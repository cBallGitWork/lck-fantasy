// A manager's own gameweek on Points (spec/12-pages.md, Points, Your own week; spec/08-leagues.md,
// Overall tiers, Where it shows): three Stars, the Flop, three Killers and both tier gaps.
import { lineupPoints } from "../squads/carry";
import { pickKey } from "../squads/squad";
import { tierGaps, type TierCutoff, type TierGaps } from "../leagues/tiers";
import type { TableRow } from "../leagues/tables";
import type { ManagerLineup, Ownership } from "./starAndFlop";

export interface YourWeekSettings {
  /** How many Stars and how many Killers. */
  picks: number;
}

/** The manager's week as it scored, and what he owns. */
export interface YourLineup extends ManagerLineup {
  /** Every pick in his squad, bench included, by `pickKey`: a Killer is none of these. */
  squad: ReadonlySet<string>;
  /** Each pick who played at least one game, by `pickKey`. */
  played: ReadonlySet<string>;
}

/** Where he stands on the whole Overall season table; null while Unranked. */
export interface YourOverall {
  table: readonly TableRow[];
  entryId: string;
  cutoffs: readonly TierCutoff[];
}

/** The tier gaps are both null while Unranked. */
export interface YourWeek extends TierGaps {
  /** Listed by points, highest first; `points` is as it scored for him, the Captain's multiplied. */
  stars: Ownership[];
  /** Null when no starter played. */
  flop: Ownership | null;
  /** Listed by points, highest first. */
  killers: Ownership[];
}

/** Stars: the most points × (1 − effective ownership), a tie to the lower ownership; then listed by points. */
export function pickStars(rows: readonly Ownership[], count: number): Ownership[] {
  const sum = (row: Ownership) => settled(row.points * (1 - row.effectiveOwnership));
  return topThenByPoints(rows, (a, b) => sum(b) - sum(a) || a.effectiveOwnership - b.effectiveOwnership, count);
}

/** Killers: the most points × effective ownership, a tie to the higher ownership; then listed by points. */
export function pickKillers(rows: readonly Ownership[], count: number): Ownership[] {
  const sum = (row: Ownership) => settled(row.points * row.effectiveOwnership);
  return topThenByPoints(rows, (a, b) => sum(b) - sum(a) || b.effectiveOwnership - a.effectiveOwnership, count);
}

/** The Flop: the fewest points among starters who played, a tie to the higher ownership, as Home's. */
export function pickFlop(rows: readonly Ownership[]): Ownership | null {
  return [...rows].sort((a, b) => a.points - b.points || b.effectiveOwnership - a.effectiveOwnership || byKey(a, b))[0] ?? null;
}

/** `ownership` is the gameweek's, from `starAndFlop`: every pick who scored or was started. */
export function yourWeek(
  ownership: ReadonlyMap<string, Ownership>,
  mine: YourLineup,
  overall: YourOverall | null,
  settings: YourWeekSettings,
): YourWeek {
  const rawPoints = new Map([...ownership].map(([key, row]) => [key, row.points]));
  const starters = lineupPoints(mine.lineup.filter((one) => one.slot !== "bench"), rawPoints, mine.multipliers).map((one): Ownership => {
    const key = pickKey(one.pick);
    return { key, points: one.points, effectiveOwnership: ownership.get(key)?.effectiveOwnership ?? 0 };
  });
  const notMine = [...ownership.values()].filter((row) => !mine.squad.has(row.key));
  const gaps = overall === null ? { promote: null, demote: null } : tierGaps(overall.table, overall.entryId, overall.cutoffs);
  return {
    stars: pickStars(starters, settings.picks),
    flop: pickFlop(starters.filter((row) => mine.played.has(row.key))),
    killers: pickKillers(notMine, settings.picks),
    ...gaps,
  };
}

/** The first `count` under `order`, a tie still left falling to the key so the pick never varies; then by points. */
function topThenByPoints(rows: readonly Ownership[], order: (a: Ownership, b: Ownership) => number, count: number): Ownership[] {
  const top = [...rows].sort((a, b) => order(a, b) || byKey(a, b)).slice(0, count);
  return top.sort((a, b) => b.points - a.points || order(a, b) || byKey(a, b));
}

/** A sum in whole billionths, so equal sums tie and float error can't split them: 15 × 0.92 and
 *  23 × 0.6 are both 13.8. */
const settled = (sum: number) => Math.round(sum * 1e9);

const byKey = (a: Ownership, b: Ownership) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
