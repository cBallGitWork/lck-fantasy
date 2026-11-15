// What the league forms do to the manager's private leagues, kept apart from how they are drawn.
import type { PrivateLeague } from "./fixtures";

/** Which form is open over the page, and the league it is about. */
export type OpenForm =
  | { kind: "create" }
  | { kind: "created"; league: PrivateLeague }
  | { kind: "join" }
  | { kind: "leave"; league: PrivateLeague }
  | { kind: "delete"; league: PrivateLeague }
  | null;

/** A rank as the pictures write it: `2nd`, `14th`, `11th`. */
export function ordinal(rank: number): string {
  const lastTwo = rank % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${rank}th`;
  const suffix = ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[rank % 10] ?? "th";
  return `${rank}${suffix}`;
}

/** `Private leagues: 2 of 25`. */
export const privateCountLine = (count: number, cap: number) => `Private leagues: ${count} of ${cap}`;

/** Why a manager at the cap can't create or join another (spec/08); nothing below it. */
export const capReason = (count: number, cap: number) => (count >= cap ? `${cap} leagues already` : undefined);

/** A new league, its maker first of one. */
export function makeLeague(name: string, scoringFrom: number, code: string): PrivateLeague {
  return { id: code.toLowerCase(), name, code, scoringFrom, managers: 1, rank: 1, maker: true };
}

export const withoutLeague = (leagues: PrivateLeague[], id: string) => leagues.filter((league) => league.id !== id);

export const renameLeague = (leagues: PrivateLeague[], id: string, name: string) =>
  leagues.map((league) => (league.id === id ? { ...league, name } : league));

/** The code a typed code or link names: a link's last part, any case. */
export const codeOf = (codeOrLink: string) => (codeOrLink.trim().split("/").pop() ?? "").toUpperCase();

/** The league a typed code or link finds, if any. */
export const findByCode = (leagues: PrivateLeague[], codeOrLink: string) =>
  leagues.find((league) => league.code === codeOf(codeOrLink));
