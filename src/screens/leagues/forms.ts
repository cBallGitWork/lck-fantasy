// What the league forms do to the manager's leagues, kept apart from how they are drawn.
import type { LeagueSummary, LeagueView, NewTable, PrivateEntry, PrivateLeague } from "./types";
import { atCap } from "./words";

/** Which sheet is open over the page, and the league it is about. */
export type OpenForm =
  | { kind: "create" }
  | { kind: "created"; league: PrivateLeague }
  | { kind: "join" }
  | { kind: "leave" | "delete"; id: string }
  | null;

/** Every league the manager is in: the list's lines, and each one's table by id. */
export interface MyLeagues {
  list: LeagueSummary[];
  views: Record<string, LeagueView>;
}

export const privateCount = ({ list }: MyLeagues) => list.filter((league) => league.kind === "private").length;

/** Why a manager at the cap can't create or join another (spec/08); nothing below it. */
export const capReason = (count: number, cap: number) => (count >= cap ? atCap(cap) : undefined);

/** A new league, its maker first of one, its table not yet started. */
export function makeLeague(name: string, scoringFrom: number, code: string, table: NewTable): PrivateEntry {
  const id = code.toLowerCase();
  return {
    summary: { id, name, kind: "private", rank: 1, move: null, size: 1 },
    view: { kind: "private", id, name, code, scoringFrom, role: "maker", ...table, tables: {} },
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

/** The code a typed code or link names: a link's last part, any case. */
export const codeOf = (codeOrLink: string) => (codeOrLink.trim().split("/").pop() ?? "").toUpperCase();

/** The league a typed code or link finds, if any. */
export const findByCode = (leagues: PrivateEntry[], codeOrLink: string) => leagues.find(({ view }) => view.code === codeOf(codeOrLink));
