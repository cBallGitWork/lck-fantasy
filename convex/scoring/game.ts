// One game's points, line by line (spec/05-scoring.md). The table is the competition's data:
// every line has its values and can be turned off, so a change needs no code, and a re-score runs
// this again over the stats kept as they arrived (ARCHITECTURE.md, Data).
import { sum } from "../../src/parts/util/sum";
import type { PlayerRole } from "../squads/squad";

export interface PlayerGameStats {
  /** The role played in this game, not the listed one: a support playing top scores as a top. */
  role: PlayerRole;
  kills: number;
  deaths: number;
  assists: number;
  /** Gold against the lane opponent at 15:00; null when the source has none. A blank reading
   *  scores 0 and does not hold the series back from final. */
  goldDiffAt15: number | null;
  soloKills: number;
  /** The first blood's killer only; an assist on it scores nothing. */
  firstBlood: boolean;
  /** The biggest multikill in the game: 0 for none, 2 a double, up to 5 a penta. */
  biggestMultikill: number;
  steals: number;
}

interface Line {
  on: boolean;
}
/** "+1 per N", rounded down, capped at `max` points. */
interface PerLine extends Line {
  per: number;
  max: number;
}
interface RolePerLine extends Line {
  per: Record<PlayerRole, number>;
  max: number;
}
interface FlatLine extends Line {
  points: number;
}

export interface PlayerTable {
  kills: RolePerLine;
  assists: PerLine;
  /** Scored as minus points. */
  deaths: RolePerLine;
  goldLeadAt15: FlatLine;
  soloKill: FlatLine;
  firstBlood: FlatLine;
  deathless: FlatLine;
  /** Points for the biggest multikill only, keyed by its size (4 a quadra, 5 a penta). */
  multikill: Line & { points: Record<number, number> };
  steal: FlatLine;
}

export type PlayerLine = keyof PlayerTable;
export type LinePoints<L extends string> = Record<L, number>;

const perPoints = (count: number, per: number, max: number) => Math.min(Math.floor(count / per), max);
const when = (line: Line, points: number) => (line.on ? points : 0);
const flat = (line: FlatLine, earned: boolean) => when(line, earned ? line.points : 0);

export function scorePlayerGame(stats: PlayerGameStats, table: PlayerTable): LinePoints<PlayerLine> {
  return {
    kills: when(table.kills, perPoints(stats.kills, table.kills.per[stats.role], table.kills.max)),
    assists: when(table.assists, perPoints(stats.assists, table.assists.per, table.assists.max)),
    deaths: when(table.deaths, 0 - perPoints(stats.deaths, table.deaths.per[stats.role], table.deaths.max)),
    goldLeadAt15: flat(table.goldLeadAt15, (stats.goldDiffAt15 ?? 0) > 0),
    soloKill: when(table.soloKill, stats.soloKills * table.soloKill.points),
    firstBlood: flat(table.firstBlood, stats.firstBlood),
    deathless: flat(table.deathless, stats.deaths === 0),
    multikill: when(table.multikill, table.multikill.points[stats.biggestMultikill] ?? 0),
    steal: when(table.steal, stats.steals * table.steal.points),
  };
}

/** One side's objectives in a game. */
export interface TeamObjectives {
  drakes: number;
  barons: number;
  elders: number;
}

export interface TeamGameStats extends TeamObjectives {
  won: boolean;
  lengthSeconds: number;
  firstTower: boolean;
  opponent: TeamObjectives;
}

export interface CoachTable {
  firstTower: FlatLine;
  /** "Most" is more than the opponent; a tie scores nobody (spec/05, The coach). */
  mostDrakes: FlatLine;
  mostBarons: FlatLine;
  mostElders: FlatLine;
  quickWin: FlatLine & { underMinutes: number };
}

export type CoachLine = keyof CoachTable;

const SECONDS_PER_MINUTE = 60;

export function scoreCoachGame(stats: TeamGameStats, table: CoachTable): LinePoints<CoachLine> {
  const quick = stats.won && stats.lengthSeconds < table.quickWin.underMinutes * SECONDS_PER_MINUTE;
  return {
    firstTower: flat(table.firstTower, stats.firstTower),
    mostDrakes: flat(table.mostDrakes, stats.drakes > stats.opponent.drakes),
    mostBarons: flat(table.mostBarons, stats.barons > stats.opponent.barons),
    mostElders: flat(table.mostElders, stats.elders > stats.opponent.elders),
    quickWin: flat(table.quickWin, quick),
  };
}

export function total(lines: Record<string, number>): number {
  return sum(Object.values(lines));
}
