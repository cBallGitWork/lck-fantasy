// League tables (spec/08-leagues.md, Tables; Legend and Rise). Every league ranks on total points
// over a run of gameweeks: the season, or one split, from the league's start.
import { sum } from "../../src/parts/util/sum";

export interface EntryGameweek {
  gameweek: number;
  points: number;
  /** Regular transfers made, for the tie-break (spec/08, Tables). */
  transfers: number;
}

export interface LeagueMember {
  entryId: string;
  /** A gameweek with no row counts 0: right for one before a late joiner's first deadline. Settling
   *  a gameweek must write a row for every entry, so a data gap fails there, not here. */
  gameweeks: EntryGameweek[];
}

/** First to last gameweek, both counted: the season, or a split (Road to MSI inside Split 1). */
export interface GameweekRange {
  first: number;
  last: number;
}

export interface TableRow {
  entryId: string;
  rank: number;
  /** Points in the last gameweek counted. */
  gameweekPoints: number;
  total: number;
  transfers: number;
}

/** A member's points in gameweek `to`. Every member needs a row for it (a late joiner's is 0), so
 *  a missing row is a data gap and throws, rather than show as a real 0. */
function latestPoints(member: LeagueMember, to: number): number {
  const row = member.gameweeks.find((gw) => gw.gameweek === to);
  if (row === undefined) throw new Error(`No points row for ${member.entryId} in gameweek ${to}.`);
  return row.points;
}

/** A table up to `upTo`: total points over `range` from `startGameweek` (a private league's own
 *  start). Ties go to fewer transfers, as in FPL; still level, they share the rank (1, 1, 3). */
export function leagueTable(
  members: readonly LeagueMember[],
  range: GameweekRange,
  startGameweek: number,
  upTo: number,
): TableRow[] {
  const from = Math.max(range.first, startGameweek);
  const to = Math.min(range.last, upTo);
  const rows = members.map((member) => {
    const counted = member.gameweeks.filter((gw) => gw.gameweek >= from && gw.gameweek <= to);
    return {
      entryId: member.entryId,
      gameweekPoints: latestPoints(member, to),
      total: sum(counted.map((gw) => gw.points)),
      transfers: sum(counted.map((gw) => gw.transfers)),
    };
  });
  rows.sort((a, b) => b.total - a.total || a.transfers - b.transfers);
  const ranked: TableRow[] = [];
  rows.forEach((row, index) => {
    const above = ranked[index - 1];
    const tied = above !== undefined && above.total === row.total && above.transfers === row.transfers;
    ranked.push({ ...row, rank: tied ? above.rank : index + 1 });
  });
  return ranked;
}

/** How each entry's rank moved since the previous table: up is positive. New entries have none. */
export function rankMovement(previous: readonly TableRow[], current: readonly TableRow[]): Map<string, number | null> {
  const before = new Map(previous.map((row) => [row.entryId, row.rank]));
  return new Map(current.map((row) => {
    const was = before.get(row.entryId);
    return [row.entryId, was === undefined ? null : was - row.rank];
  }));
}

/** Legend's or Rise's table on the Split 2 tab: ranked on season points, Split 1 included, with
 *  each manager's Split 2 points beside the total (spec/08, Legend and Rise). */
export function legendRiseTable(
  members: readonly LeagueMember[],
  season: GameweekRange,
  split2: GameweekRange,
  upTo: number,
): (TableRow & { splitTotal: number })[] {
  const split = new Map(leagueTable(members, split2, split2.first, upTo).map((row) => [row.entryId, row.total]));
  return leagueTable(members, season, season.first, upTo).map((row) => ({ ...row, splitTotal: split.get(row.entryId) ?? 0 }));
}

/** The chase tag on a manager's own row: points to the rank above, or the lead when 1st. */
export type ChaseTag = { kind: "chasing"; points: number; rank: number } | { kind: "clear"; points: number };

/** spec/08, The Leagues page: the points to the nearest rank above ("16 pts to 1st"), the lead
 *  over 2nd when alone in 1st ("+16 clear"), and none when level with the row it is measured to. */
export function chaseTag(table: readonly TableRow[], entryId: string): ChaseTag | null {
  const index = table.findIndex((row) => row.entryId === entryId);
  const own = table[index];
  if (own === undefined) throw new Error(`${entryId} is not in this table.`);
  const above = table[index - 1];
  if (above !== undefined) {
    const gap = above.total - own.total;
    return gap > 0 ? { kind: "chasing", points: gap, rank: above.rank } : null;
  }
  const below = table[index + 1];
  if (below === undefined) return null;
  const lead = own.total - below.total;
  return lead > 0 ? { kind: "clear", points: lead } : null;
}

/** How a long table's first page is cut: its rows a page, the top rows it keeps, and the rows either
 *  side of the manager's own. Data, as the page size is (spec/08, The Leagues page). */
export interface FirstPageCut {
  pageSize: number;
  top: number;
  around: number;
}

/** A table's first page as runs of rows, a gap between runs (spec/08, The Leagues page; Craig,
 *  28 Nov 2026): where the table runs past one page and the manager's row is not among its top rows,
 *  the top rows, then the rows round theirs; one run where the two meet. Otherwise the page as it is.
 *  Example: 86 managers, yours 14th, top 5 and 2 either side: 1st to 5th, then 12th to 16th. */
export function firstPage<R>(table: readonly R[], isMine: (row: R) => boolean, cut: FirstPageCut): R[][] {
  const page = [table.slice(0, cut.pageSize)];
  if (table.length <= cut.pageSize) return page;
  const mine = table.findIndex(isMine);
  if (mine < cut.top) return page;
  const from = mine - cut.around;
  const to = mine + cut.around + 1;
  return from <= cut.top ? [table.slice(0, to)] : [table.slice(0, cut.top), table.slice(from, to)];
}

/** The Carry column shows each manager's Carry only once the gameweek's deadline has passed, as
 *  FPL hides picks until then (spec/08, The Leagues page). */
export function carryShown(deadline: number, now: number): boolean {
  return now >= deadline;
}

/** Whether a season's Overall splits into Legend and Rise: the LCK's does, the LEC's stays whole
 *  (spec/16, Leagues in the LEC). Data per season; a season stored before it was data splits. */
export function overallSplits(settings: { overallSplits?: boolean }): boolean {
  return settings.overallSplits !== false;
}

/** Split 2's Overall groups: the top half of Split 1's Overall table goes to Legend, the rest to
 *  Rise, and anyone not in it (joined in Split 2) to Rise. Top half is rank ≤ half the managers, so
 *  managers tied on the line stay together. */
export function legendAndRise(
  split1Overall: readonly TableRow[],
  split2Entries: readonly string[],
): { legend: string[]; rise: string[] } {
  const half = split1Overall.length / 2;
  const legend = new Set(split1Overall.filter((row) => row.rank <= half).map((row) => row.entryId));
  return {
    legend: split2Entries.filter((id) => legend.has(id)),
    rise: split2Entries.filter((id) => !legend.has(id)),
  };
}
