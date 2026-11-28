// What the league forms do to the manager's leagues, kept apart from how they are drawn.
import type { LeagueSummary, LeagueView, NewTable, PrivateEntry, PrivateLeague, ScoringWeek } from "./types";
import { atCap } from "./words";

/** Which sheet is open over the page, and the league it is about. */
export type OpenForm =
  | { kind: "create" }
  | { kind: "created"; league: PrivateLeague }
  | { kind: "join" }
  | { kind: "leave" | "delete"; id: string }
  | { kind: "remove"; id: string; managerId: string; team: string }
  | null;

/** Every league the manager is in: the list's lines, and each one's table by id. */
export interface MyLeagues {
  list: LeagueSummary[];
  views: Record<string, LeagueView>;
}

export const privateCount = ({ list }: MyLeagues) => list.filter((league) => league.kind === "private").length;

/** Why a manager at the cap can't create or join another (spec/08); nothing below it. */
export const capReason = (count: number, cap: number) => (count >= cap ? atCap(cap) : undefined);

/** A new league, its maker first of one, its table not yet started: `startsOn` where its first week is still to come. */
export function makeLeague(name: string, scoringFrom: number, code: string, table: NewTable, startsOn?: ScoringWeek): PrivateEntry {
  const id = code.toLowerCase();
  return {
    summary: { id, name, kind: "private", mark: { kind: "group" }, rank: 1, move: null, size: 1 },
    view: { kind: "private", id, name, code, scoringFrom, role: "maker", ...table, tables: {}, startsOn },
  };
}

/** A code no league here holds yet: the one given, or it with a count after. */
export function freeCode(code: string, { views }: MyLeagues): string {
  const taken = (c: string) => c.toLowerCase() in views;
  let next = code;
  for (let n = 2; taken(next); n++) next = `${code}-${n}`;
  return next;
}

export const withLeague = ({ list, views }: MyLeagues, { summary, view }: PrivateEntry): MyLeagues => ({
  list: [...list, summary],
  views: { ...views, [view.id]: view },
});

export function withoutLeague({ list, views }: MyLeagues, id: string): MyLeagues {
  return {
    list: list.filter((league) => league.id !== id),
    views: Object.fromEntries(Object.entries(views).filter(([key]) => key !== id)),
  };
}

export function renameLeague({ list, views }: MyLeagues, id: string, name: string): MyLeagues {
  const view = views[id];
  return {
    list: list.map((league) => (league.id === id ? { ...league, name } : league)),
    views: view ? { ...views, [id]: { ...view, name } } : views,
  };
}

/** A league with one manager removed: their row off every table, the league one smaller. */
export function removeManager({ list, views }: MyLeagues, id: string, managerId: string): MyLeagues {
  const view = views[id];
  if (!view) return { list, views };
  const tables = Object.fromEntries(
    Object.entries(view.tables).map(([key, table]) => [key, table && { ...table, runs: table.runs.map((run) => run.filter((row) => row.managerId !== managerId)) }]),
  );
  return {
    list: list.map((league) => (league.id === id ? { ...league, size: league.size - 1 } : league)),
    views: { ...views, [id]: { ...view, tables } },
  };
}

/** The code a typed code or link names: a link's last part, any case. */
export const codeOf = (codeOrLink: string) => (codeOrLink.trim().split("/").pop() ?? "").toUpperCase();

/** What Join does with a code (spec/08, Private leagues). */
export type JoinOutcome = { kind: "none" } | { kind: "open"; id: string } | { kind: "join"; entry: PrivateEntry };

/**
 * A code for a league the manager is in opens its table; a code for one they were removed from finds nothing, the same as a code
 * no league has, so the ban isn't announced; otherwise the league to join (Craig, 17 and 28 Nov 2026).
 */
export function joinOutcome(mine: MyLeagues, joinable: readonly PrivateEntry[], removedFrom: ReadonlySet<string>, codeOrLink: string): JoinOutcome {
  const code = codeOf(codeOrLink);
  const already = Object.values(mine.views).find((view) => view.kind === "private" && view.code === code);
  if (already) return { kind: "open", id: already.id };
  const entry = joinable.find(({ view }) => view.code === code);
  return entry && !removedFrom.has(code) ? { kind: "join", entry } : { kind: "none" };
}
