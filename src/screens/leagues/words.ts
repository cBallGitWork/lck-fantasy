// Leagues' words, named once. Every word a player reads on this screen lives here.

import { ordinal } from "../../parts";
import type { ChaseTag } from "./types";

export const WORDS = {
  title: "Leagues",
  hangul: "리그",
  sponsor: "Sponsor",
  /** The list's sections. */
  general: "General",
  private: "Private",
  /** The list, for a reader. */
  yourLeagues: "Your leagues",
  create: "Create a league",
  join: "Join a league",
  /** A private league's size counts managers. */
  manager: "manager",
  copyLink: "Copy link",
  copyCode: "Copy code",
  admin: "Admin ▾",
  rename: "Rename",
  removeManager: "Remove a manager",
  deleteLeague: "Delete league…",
  leave: "Leave",
  /** Rename's field, for a reader. */
  leagueName: "League name",
  /** The tabs, for a reader. */
  table: "Table",
  /** Overall's groups, for a reader. */
  group: "Overall group",
  noTable: "No table yet",
  /** The pager, for a reader. */
  pages: "Pages",
  findMe: "Find me",
  rank: "Rank",
  teamManager: "Team · Manager",
  /** Overall's season table: each manager's tier (spec/08). */
  tier: "Tier",
  captain: "Captain",
  total: "Total",
  name: "Name",
  scoringStarts: "Scoring starts",
  createKey: "Create",
  /** Why Create is off. */
  noName: "No name",
  codeOrLink: "Code or link",
  joinKey: "Join",
  /** Why Join is off. */
  noCode: "No code",
  openLeague: "Open league",
  /** The Join sheet's error: the code finds no league. */
  noSuchCode: "No league has that code. Check it and try again.",
  deleteKey: "Delete league",
} as const;

const dot = " · ";

/** `2027 · Split 1`: Overall's season, and the split on a split's tab. */
export const seasonSplit = (season: string, split: string) => season + dot + split;

/** `of 212,480`: a general league's size under your rank. */
export const ofSize = (size: string) => `of ${size}`;

/** `Week 3`: the table's week column. */
export const weekHead = (n: number) => `Week ${n}`;

/** `Scoring from Week 3`: a private league's first week. */
export const scoringFrom = (week: number) => `Scoring from ${weekHead(week)}`;

/** `12 managers · scoring from Week 1`: the Delete sheet's line. */
export const deleteLine = (managers: string, week: number) => `${managers}${dot}scoring from ${weekHead(week)}`;

/** `Week 3 · Wed 13 Jan`: a week scoring can start from, and its first day. */
export const weekStarts = (week: number, starts: string) => weekHead(week) + dot + starts;

/** `11 / 30`: the name's length of the most it takes. */
export const nameCount = (length: number, max: number) => `${length} / ${max}`;

/** `Private leagues: 2 of 25`. */
export const privateCountLine = (count: number, cap: number) => `Private leagues: ${count} of ${cap}`;

/** `Max 25 private leagues`: why a manager at the cap can't create or join another. */
export const atCap = (cap: number) => `Max ${cap} private leagues`;

/** `Leave Flol Discord?`. */
export const leaveTitle = (name: string) => `Leave ${name}?`;

/** `Delete Pub League?`. */
export const deleteTitle = (name: string) => `Delete ${name}?`;

/** The chase tag's words: `16 pts to 1st`, `+16 clear` (spec/08). */
export const chaseText = (tag: ChaseTag) => (tag.kind === "clear" ? `+${tag.points} clear` : `${tag.points} pts to ${ordinal(tag.rank)}`);
