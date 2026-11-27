// Overall tiers (spec/08-leagues.md, Overall tiers): a manager's rank on the whole Overall season
// table, against the competition's percentile cut-offs, as a LoL ranked tier, Iron to Challenger.
import type { TableRow } from "./tables";

export type TierName = "iron" | "bronze" | "silver" | "gold" | "platinum" | "emerald" | "diamond" | "master" | "grandmaster" | "challenger";

/** I is the top division, IV the bottom. Master, Grandmaster and Challenger have none. */
export type Division = 1 | 2 | 3 | 4;

/** One line of the competition's cut-off table: a rank in the top `topPercent`% of Overall, and
 *  below every better line, is in this tier and division. */
export interface TierCutoff {
  tier: TierName;
  division: Division | null;
  topPercent: number;
}

export type Tier = { tier: "unranked" } | { tier: TierName; division: Division | null };

/** Percentages are held to hundredths (0.02%), so a rank is compared in whole basis points and a
 *  rank exactly on a cut-off can't fall either side by float error. */
const BASIS_POINTS = 10_000;

/** The ranks a line holds, counting from 1st: a line too thin for one manager holds none, so a
 *  small field has no Challenger until the cut-offs are set for it. */
function seats(cutoff: TierCutoff, managers: number): number {
  return Math.floor((Math.round(cutoff.topPercent * 100) * managers) / BASIS_POINTS);
}

/** Cut-offs run best first, each wider than the last, and the last takes everyone (100%). */
function checkCutoffs(cutoffs: readonly TierCutoff[]): void {
  cutoffs.forEach((cutoff, i) => {
    const before = cutoffs[i - 1];
    if (before !== undefined && cutoff.topPercent <= before.topPercent) {
      throw new Error(`Tier cut-offs must widen: ${cutoff.tier} ${cutoff.topPercent}% is not past ${before.topPercent}%.`);
    }
  });
  if (cutoffs[cutoffs.length - 1]?.topPercent !== 100) throw new Error("The last tier cut-off must be 100%.");
}

/** The line a rank falls under, and the one just above it (none for the top line). */
function lineFor(rank: number, managers: number, cutoffs: readonly TierCutoff[]): { line: TierCutoff; above: TierCutoff | undefined } {
  checkCutoffs(cutoffs);
  if (!Number.isInteger(rank) || rank < 1 || rank > managers) throw new Error(`Rank ${rank} is not on a table of ${managers}.`);
  const index = cutoffs.findIndex((cutoff) => rank <= seats(cutoff, managers));
  const line = cutoffs[index];
  if (line === undefined) throw new Error(`No tier cut-off holds rank ${rank} of ${managers}.`);
  return { line, above: cutoffs[index - 1] };
}

/** A manager's tier from their rank on the whole Overall season table of `managers` ranked
 *  managers. `rank` is null until gameweek 1 is final, which is Unranked. */
export function overallTier(rank: number | null, managers: number, cutoffs: readonly TierCutoff[]): Tier {
  if (rank === null) return { tier: "unranked" };
  const { line } = lineFor(rank, managers, cutoffs);
  return { tier: line.tier, division: line.division };
}

/** Points across a tier line: to pass the manager at the line above, or of room over the
 *  manager just under one's own line. `tier` is where the move lands. */
export interface TierGap {
  points: number;
  tier: Tier;
}

/** Both gaps, shown at every tier (spec/08, Points; Craig, 27 Nov 2026). */
export interface TierGaps {
  promote: TierGap | null;
  demote: TierGap | null;
}

/** spec/08, Points: the points to promote and the room before demotion, each the gap now to the
 *  nearest manager across the line, so only ≈ while others still score. Null where there is no
 *  line: Challenger, or the top tier this field can reach, has none above; the last tier none below. */
export function tierGaps(table: readonly TableRow[], entryId: string, cutoffs: readonly TierCutoff[]): TierGaps {
  const own = table.find((row) => row.entryId === entryId);
  if (own === undefined) throw new Error(`${entryId} is not in the Overall table.`);
  const managers = table.length;
  const { line, above } = lineFor(own.rank, managers, cutoffs);
  const tierOf = (row: TableRow) => overallTier(row.rank, managers, cutoffs);

  const lineAbove = above === undefined ? 0 : seats(above, managers);
  const atLine = table.filter((row) => row.rank <= lineAbove).at(-1);
  const below = table.find((row) => row.rank > seats(line, managers));
  return {
    promote: atLine === undefined ? null : { points: atLine.total - own.total, tier: tierOf(atLine) },
    demote: below === undefined ? null : { points: own.total - below.total, tier: tierOf(below) },
  };
}


/** What the season keeps of each manager when it ends: their final rank and tier on the whole
 *  Overall season table (spec/08; the profile's History tab lists them per season). */
export function finalTiers(
  table: readonly TableRow[],
  cutoffs: readonly TierCutoff[],
): { entryId: string; rank: number; tier: Tier }[] {
  return table.map((row) => ({ entryId: row.entryId, rank: row.rank, tier: overallTier(row.rank, table.length, cutoffs) }));
}
