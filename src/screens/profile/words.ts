// Profile's words, named once. Every word a player reads on this screen lives here.
import type { FollowState } from "./fixtures";

/** Profile's tabs, in their order; each is also the tab's key. */
export const TABS = ["Points", "History", "Transfers"] as const;

/** The follow key, by the state it shows (spec/14). */
export const FOLLOW_LABEL: Record<Exclude<FollowState, "self">, string> = { following: "Following ✓", follow: "Follow", requested: "Requested" };

export const WORDS = {
  /** The tab list's name, for a reader. */
  profile: "Profile",
  leagues: "Leagues",
  average: "Average",
  highest: "Highest",
  bench: "Bench",
  slot: "Slot",
  player: "Player",
  pts: "Pts",
  series: "Series",
  week: "Week",
  total: "Total",
  weekRank: "Week rank",
  overall: "Overall rank",
  move: "Rank move",
  transfers: "Transfers",
  cost: "Cost",
  bank: "Bank",
  value: "Value",
  buff: "Buff",
  /** History: the table's name, for a reader. */
  history: "History",
  buffsLeft: "Buffs left:",
  out: "Out",
  in: "In",
  ptsGained: "Pts gained",
} as const;

export const dot = " · ";

/** `Week 3`: the week's head on Points and Transfers, and a History row. */
export const weekNo = (week: number) => `${WORDS.week} ${week}`;

/** `Loading Week 3's team`: what a reader hears while her team is on its way. */
export const weekTeam = (week: number) => `Loading ${weekNo(week)}'s team`;

/** `Cheers and jeers · Week 3`: the side's head on Points. */
export const cheersWeek = (cheers: string, week: number) => `${cheers}${dot}${weekNo(week)}`;

/** `Cheer from Dan`: under a cheer or jeer, before the sender's name. */
export const fromWord = "from";
