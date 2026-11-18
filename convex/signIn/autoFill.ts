// Auto-fill (spec/09-onboarding.md, Picking as a guest): fill a guest's empty slots with a valid
// squad under budget, as UCL Fantasy and FPL do, at random but spending close to the budget.
import { sum } from "../../src/parts/util/sum";
import { priceOf, requirePrice, type Prices } from "../squads/budget";
import {
  fitsSlot, pickKey, picksPerTeam, STARTER_SLOTS,
  type Pick, type Squad, type SquadSettings, type StarterSlot,
} from "../squads/squad";

/** Picks one of the affordable candidates: at random in the app, as FPL's Auto Pick does; the
 *  first in tests. */
export type Chooser = (candidates: Pick[]) => Pick;

/** Any candidate, evenly: a new squad each press. `random` returns a number in [0, 1), as
 *  Math.random does; tests seed it. */
export const randomChooser = (random: () => number): Chooser => (candidates) =>
  candidates[Math.floor(random() * candidates.length)]!;

/** The budget, null for none, and how far under it Auto-fill aims to spend at most: both in won,
 *  both the season's data (spec/09: "spends close to the budget"). */
export interface AutoFillMoney {
  budget: number | null;
  gap: number;
}

/** The squad with every empty slot filled from `pool`. Each choice leaves a fill of the slots still
 *  empty, the cheapest distinct picks within the cap, that the budget covers. Among those it chooses
 *  from the picks that still let the squad reach the budget less the gap, where any do; where none
 *  do, it takes the dearest, the closest it can get. Throws when no valid fill exists, rather than
 *  hand back a squad that breaks a rule. */
export function autoFill(
  squad: Squad,
  pool: readonly Pick[],
  prices: Prices,
  settings: SquadSettings,
  { budget, gap }: AutoFillMoney,
  choose: Chooser,
): Squad {
  const starters = [...squad.starters];
  const bench = [...squad.bench];
  const empty: (StarterSlot | "bench")[] = [
    ...STARTER_SLOTS.flatMap((slot) =>
      Array(Math.max(0, settings.starterSlots[slot] - starters.filter((s) => s.slot === slot).length)).fill(slot),
    ),
    ...Array(Math.max(0, settings.benchSize - bench.length)).fill("bench"),
  ];
  // A pool pick with no price can't be bought, so Auto-fill never offers it.
  const priced = pool.filter((pick) => priceOf(pick, prices) !== undefined);
  const cost = (pick: Pick) => priceOf(pick, prices)!;
  const fill = (picks: Pick[], slot: StarterSlot | "bench") => {
    const perTeam = picksPerTeam(picks);
    const taken = new Set(picks.map(pickKey));
    return priced.filter(
      (pick) =>
        fitsSlot(pick.role, slot) &&
        !taken.has(pickKey(pick)) &&
        (settings.teamCap === null || (perTeam.get(pick.teamId) ?? 0) < settings.teamCap),
    );
  };
  const cheapestFirst = (a: Pick, b: Pick) => cost(a) - cost(b);
  const dearestFirst = (a: Pick, b: Pick) => cost(b) - cost(a);
  /** The cost of filling `slots` in turn, each with the first distinct pick within the cap in
   *  `order`; null if a slot has none. */
  const completion = (picks: Pick[], slots: (StarterSlot | "bench")[], order: typeof cheapestFirst): number | null => {
    const chosen = [...picks];
    let total = 0;
    for (const slot of slots) {
      const next = fill(chosen, slot).sort(order)[0];
      if (!next) return null;
      chosen.push(next);
      total += cost(next);
    }
    return total;
  };

  while (empty.length > 0) {
    const slot = empty.shift()!;
    const picks = [...starters.map((s) => s.pick), ...bench];
    const spent = sum(picks.map((pick) => requirePrice(pick, prices)));
    const candidates = fill(picks, slot).filter((pick) => {
      const rest = completion([...picks, pick], empty, cheapestFirst);
      return rest !== null && (budget === null || spent + cost(pick) + rest <= budget);
    });
    if (candidates.length === 0) throw new Error(`Auto-fill found no pick for the ${slot} slot within the rules.`);
    const near = budget === null ? candidates : candidates.filter((pick) => {
      const most = completion([...picks, pick], empty, dearestFirst);
      return most !== null && spent + cost(pick) + most >= budget - gap;
    });
    const pick = near.length > 0 ? choose(near) : [...candidates].sort(dearestFirst)[0]!;
    if (slot === "bench") bench.push(pick);
    else starters.push({ slot, pick });
  }
  return { starters, bench };
}
