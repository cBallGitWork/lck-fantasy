// Last week's star and flop, the same pair for every manager (spec/12, Home).

/** One player or coach's final week: his points and effective ownership, in per cent. */
export interface WeekPlayer {
  name: string;
  points: number;
  /** The share of managers starting him, a Captain counting 1.5 (2 under Double Captain): `31` for 31%. */
  eoPct: number;
}

/** How many of the most owned, by effective ownership, the flop is picked from. */
export const FLOP_POOL = 10;

/** Star's measure, points × (1 − effective ownership), times 100 so whole per cents tie exactly. */
const starScore = (p: WeekPlayer) => p.points * (100 - p.eoPct);

/** Everyone first on `by`, then on `tie`: each the lower first. Still tied, all of them. */
function lowestOn<T extends WeekPlayer>(players: readonly T[], by: (p: T) => number, tie: (p: T) => number): T[] {
  const first = Math.min(...players.map(by));
  const level = players.filter((p) => by(p) === first);
  const second = Math.min(...level.map(tie));
  return level.filter((p) => tie(p) === second);
}

/**
 * The star and flop of a final week, coaches in the running as the 6th role. Star: the most
 * points × (1 − effective ownership), a tie to the lower ownership. Flop: the fewest points among
 * the 10 most owned (everyone tied at 10th joins), a tie to the higher ownership. Still tied, all
 * tied are returned. No one in the week, no one returned.
 */
export function starAndFlop<T extends WeekPlayer>(players: readonly T[]): { stars: T[]; flops: T[] } {
  if (players.length === 0) return { stars: [], flops: [] };
  const byOwned = [...players].sort((a, b) => b.eoPct - a.eoPct);
  const cut = byOwned[Math.min(FLOP_POOL, byOwned.length) - 1]!.eoPct;
  const pool = byOwned.filter((p) => p.eoPct >= cut);
  return {
    stars: lowestOn(players, (p) => -starScore(p), (p) => p.eoPct),
    flops: lowestOn(pool, (p) => p.points, (p) => -p.eoPct),
  };
}
