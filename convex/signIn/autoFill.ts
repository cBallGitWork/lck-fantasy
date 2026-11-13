// Auto-fill (spec/09-onboarding.md, Picking as a guest): fill a guest's empty slots with a valid
// squad under budget, as UCL Fantasy and FPL do.
import { priceOf, type Prices } from "../squads/budget";
import {
  fitsSlot, pickKey, picksPerTeam, STARTER_SLOTS,
  type Pick, type Squad, type SquadSettings, type StarterSlot,
} from "../squads/squad";

/** Picks one of the affordable candidates: at random in the app, as FPL's Auto Pick does; the
 *  first in tests. */
export type Chooser = (candidates: Pick[]) => Pick;

/** The squad with every empty slot filled from `pool`. Each choice leaves enough money for the
 *  cheapest fill of the slots still empty, so the squad ends within the budget (null: no budget).
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
  const priced = pool.filter((pick) => priceOf(pick, prices) !== undefined);
  const cost = (pick: Pick) => priceOf(pick, prices)!;

  while (empty.length > 0) {
    const slot = empty.shift()!;
    const picks = [...starters.map((s) => s.pick), ...bench];
    const taken = new Set(picks.map(pickKey));
    const perTeam = picksPerTeam(picks);
    const spent = picks.reduce((sum, pick) => sum + (priceOf(pick, prices) ?? 0), 0);
    const reserve = empty.reduce((sum, later) => sum + cheapestFor(later, priced, taken, cost), 0);
    const candidates = priced.filter(
      (pick) =>
        fitsSlot(pick.role, slot) &&
        !taken.has(pickKey(pick)) &&
        (settings.teamCap === null || (perTeam.get(pick.teamId) ?? 0) < settings.teamCap) &&
        (budget === null || spent + cost(pick) + reserve <= budget),
    );
    if (candidates.length === 0) throw new Error(`Auto-fill found no pick for the ${slot} slot within the rules.`);
    const pick = choose(candidates);
    if (slot === "bench") bench.push(pick);
    else starters.push({ slot, pick });
  }
  return { starters, bench };
}

function cheapestFor(slot: StarterSlot | "bench", pool: Pick[], taken: Set<string>, cost: (pick: Pick) => number): number {
  const prices = pool.filter((pick) => fitsSlot(pick.role, slot) && !taken.has(pickKey(pick))).map(cost);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

