// Auto-fill (spec/09-onboarding.md, Picking as a guest): fill a guest's empty slots with a valid
// squad under budget, as UCL Fantasy and FPL do.
import { priceOf, requirePrice, type Prices } from "../squads/budget";
import {
  fitsSlot, pickKey, picksPerTeam, STARTER_SLOTS,
  type Pick, type Squad, type SquadSettings, type StarterSlot,
} from "../squads/squad";

/** Picks one of the affordable candidates: at random in the app, as FPL's Auto Pick does; the
 *  first in tests. */
export type Chooser = (candidates: Pick[]) => Pick;

/** The squad with every empty slot filled from `pool`. Each choice leaves a fill of the slots still
 *  empty, the cheapest distinct picks within the cap, that the budget covers (null: no budget).
 *  Throws when no valid fill exists, rather than hand back a squad that breaks a rule. */
export function autoFill(
  squad: Squad,
  pool: readonly Pick[],
  prices: Prices,
  settings: SquadSettings,
  budget: number | null,
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
  /** The cost of filling `slots` with the cheapest distinct picks within the cap; null if none. */
  const cheapestCompletion = (picks: Pick[], slots: (StarterSlot | "bench")[]): number | null => {
    const chosen = [...picks];
    let total = 0;
    for (const slot of slots) {
      const cheapest = fill(chosen, slot).sort((a, b) => cost(a) - cost(b))[0];
      if (!cheapest) return null;
      chosen.push(cheapest);
      total += cost(cheapest);
    }
    return total;
  };

  while (empty.length > 0) {
    const slot = empty.shift()!;
    const picks = [...starters.map((s) => s.pick), ...bench];
    const spent = picks.reduce((sum, pick) => sum + requirePrice(pick, prices), 0);
    const candidates = fill(picks, slot).filter((pick) => {
      const rest = cheapestCompletion([...picks, pick], empty);
      return rest !== null && (budget === null || spent + cost(pick) + rest <= budget);
    });
    if (candidates.length === 0) throw new Error(`Auto-fill found no pick for the ${slot} slot within the rules.`);
    const pick = choose(candidates);
    if (slot === "bench") bench.push(pick);
    else starters.push({ slot, pick });
  }
  return { starters, bench };
}
