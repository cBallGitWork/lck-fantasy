// League tables (spec/08-leagues.md, Tables; Legend and Rise). Every league ranks on total points
// over a run of gameweeks: the season, or one split, from the league's start.

export interface EntryGameweek {
  gameweek: number;
  points: number;
  /** Transfers made, for the tie-break. Remake and Limitless weeks count none, as FPL leaves out
   *  Wildcard and Free Hit transfers. */
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
      gameweekPoints: counted.find((gw) => gw.gameweek === to)?.points ?? 0,
      total: counted.reduce((sum, gw) => sum + gw.points, 0),
      transfers: counted.reduce((sum, gw) => sum + gw.transfers, 0),
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
