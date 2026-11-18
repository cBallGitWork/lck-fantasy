// The gameweek's star and flop (spec/12-pages.md, Home): the same pair for every manager, picked
// from effective ownership once the gameweek is final.
import type { BuffLineup } from "../squads/buffs";
import { pickKey } from "../squads/squad";

/** One manager's gameweek as it scored: the line-up after auto-subs or with a Bench Boost bench,
 *  and who took a multiplier, which also weighs them in effective ownership: a Captain 1.5, both
 *  Captains under Double Captain 2 (spec/12, Home: "as it scored", Craig, 15 and 17 Nov 2026). */
export type ManagerLineup = Pick<BuffLineup, "lineup" | "multipliers">;

export interface StarAndFlopSettings {
  /** How many picks, highest effective ownership first, the flop is picked from. */
  flopPoolSize: number;
}

export interface Ownership {
  /** A `pickKey`: a player, or a team's coach, the 6th role. */
  key: string;
  points: number;
  /** A share of managers: 0.5 is 50%. Over 1 when more than two thirds carry him. */
  effectiveOwnership: number;
}

export interface StarAndFlop {
  /** Every pick that scored or was started, by `pickKey`. */
  ownership: Map<string, Ownership>;
  /** More than one only when still tied after the tie-break: both are shown. Empty with no picks. */
  stars: Ownership[];
  flops: Ownership[];
}

/** Effective ownership, the star and the flop. `points` holds each pick's gameweek points by
 *  `pickKey`; a started pick with none scores 0. */
export function starAndFlop(
  managers: readonly ManagerLineup[],
  points: ReadonlyMap<string, number>,
  settings: StarAndFlopSettings,
): StarAndFlop {
  // Weights stay as counts (a Captain 1.5) so the comparisons below are exact, not float shares.
  const weights = new Map<string, number>([...points.keys()].map((key) => [key, 0]));
  for (const { lineup, multipliers } of managers) {
    for (const { pick } of lineup) {
      const key = pickKey(pick);
      weights.set(key, (weights.get(key) ?? 0) + (multipliers.get(key) ?? 1));
    }
  }

  const count = managers.length;
  const ownership = new Map<string, Ownership>();
  for (const [key, weight] of weights) {
    ownership.set(key, { key, points: points.get(key) ?? 0, effectiveOwnership: count === 0 ? 0 : weight / count });
  }
  if (count === 0) return { ownership, stars: [], flops: [] };

  const picks = [...weights.keys()];
  const weightOf = (key: string) => weights.get(key) ?? 0;
  const pointsOf = (key: string) => points.get(key) ?? 0;

  // Star: the most points × (1 − effective ownership); a tie goes to the lower ownership.
  const starScore = (key: string) => pointsOf(key) * (count - weightOf(key));
  const stars = best(picks, (a, b) => starScore(b) - starScore(a) || weightOf(a) - weightOf(b));

  // Flop: the fewest points among the most owned; everyone tied at the pool's last place joins,
  // and a tie goes to the higher ownership.
  const byOwnership = [...picks].sort((a, b) => weightOf(b) - weightOf(a));
  const cutoff = byOwnership[Math.min(settings.flopPoolSize, byOwnership.length) - 1];
  const pool = cutoff === undefined ? [] : byOwnership.filter((key) => weightOf(key) >= weightOf(cutoff));
  const flops = best(pool, (a, b) => pointsOf(a) - pointsOf(b) || weightOf(b) - weightOf(a));

  const toOwnership = (key: string) => ownership.get(key) as Ownership;
  return { ownership, stars: stars.map(toOwnership), flops: flops.map(toOwnership) };
}

/** Every key that sorts first under `order`, ties included. */
function best(keys: readonly string[], order: (a: string, b: string) => number): string[] {
  const [first] = [...keys].sort(order);
  return first === undefined ? [] : keys.filter((key) => order(key, first) === 0);
}
