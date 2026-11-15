// Minji Park's profile as the approved picture shows it (docs/design/approved/profile/): a made-up
// LCK Cup Week 3 on the Sunday before its last two series, so Week 3 is not final. Her series are
// Week 3's, final from Wednesday to Saturday (WEEK3_SERIES_FINAL). Not roster data.

import { MANAGERS } from "../../fixtures/managers";
import { seriesById } from "../../fixtures/series";
import { playerId, WEEK3_FINAL, WEEK3_SERIES_FINAL, type BuffName, type TeamCode } from "../../fixtures/week3";
import { score } from "../../parts";
import type { Mark, RoleKey, SlotKey, SquadSlot } from "../../rift";

/** Whether you follow the manager; `self` is your own profile, which has no key. */
export type FollowState = "following" | "follow" | "requested" | "self";

export interface ProfileManager {
  id: string;
  name: string;
  team: string;
  /** The team name in hangul, on the banner (spec/13). */
  hangul: string;
  follow: FollowState;
}

export interface ProfilePlayer {
  /** The player card's or coach card's id. */
  id: string;
  name: string;
  team: TeamCode;
}

export interface ProfilePick extends ProfilePlayer {
  slot: SquadSlot;
  /** The role he plays: the Flex's and the bench's, shown after the slot. */
  plays?: RoleKey;
  mark?: Mark;
  /** The week's points, Carry's ×1.5 in; absent when he didn't play. */
  points?: number;
  /** The week's series he played, as his line shows them: `GEN 2–0 KT · Wed`. */
  series: string[];
  /** Why he has no series, in place of them. */
  note?: string;
}

export interface Truck {
  kind: "coffee" | "protest";
  line: string;
  from: string;
}

export interface PointsWeek {
  week: number;
  points: number;
  average?: number;
  highest?: number;
  final: boolean;
  /** The buff played that week. */
  buff?: BuffName;
  /** Her team that week; absent until the backend feeds it. */
  team?: ProfilePick[];
  trucks: Truck[];
}

export interface HistoryRow {
  week: number;
  points: number;
  total: number;
  /** Absent until the week is final. */
  weekRank?: number;
  overall: number;
  /** Places moved on Overall: up is positive. */
  move?: number;
  transfers?: number;
  hits?: number;
  bankEok: number;
  valueEok: number;
  buff?: BuffName;
}

export interface Transfer {
  slot: SlotKey;
  out: ProfilePlayer & { priceEok: number };
  in: ProfilePlayer & { priceEok: number };
  /** Points the player in scored over the player out. */
  gained: number;
}

export interface TransferWeek {
  week: number;
  /** When the transfers were made: yours, then KST. */
  at: { local: string; kst: string };
  /** The week's cost: the buff and hits, or free transfers used. */
  cost: string;
  transfers: Transfer[];
}

export interface LeagueRow {
  id: string;
  name: string;
  rank: number;
  /** Places moved: up is positive. */
  move: number;
  /** Overall's tier (spec/08): its name and division. */
  tier?: { name: string; division: string };
  /** A private league shows its rank as a place: `3rd`. */
  ordinal?: boolean;
}

export interface ProfileData {
  manager: ProfileManager;
  /** The week shown on Points when the page opens. */
  currentWeek: number;
  weeks: PointsWeek[];
  history: HistoryRow[];
  buffsLeft: BuffName[];
  transfers: TransferWeek[];
  leagues: LeagueRow[];
}

const player = (name: string, team: TeamCode): ProfilePlayer => ({ id: playerId(name), name, team });

/** A series as a player's line shows it: `GEN 2–0 KT · Wed`. */
function seriesLine(id: string): string {
  const s = seriesById(WEEK3_SERIES_FINAL, id);
  if (!s.score) throw new Error(`No final Week 3 series ${id}`);
  return `${s.home} ${score(s.score)} ${s.away} · ${s.day}`;
}

const lines = (...ids: string[]) => ids.map(seriesLine);
const GEN_WEEK = lines("w3-wed-2", "w3-sat-1");
const T1_WEEK = lines("w3-wed-1", "w3-sat-2");

const WEEK3_TEAM: ProfilePick[] = [
  { slot: "top", ...player("Kiin", "GEN"), points: 11, series: GEN_WEEK },
  { slot: "jng", ...player("Canyon", "GEN"), points: 14, series: GEN_WEEK },
  { slot: "mid", ...player("Chovy", "GEN"), mark: "V", points: 17, series: GEN_WEEK },
  { slot: "bot", ...player("Ruler", "GEN"), mark: "C", points: 21, series: GEN_WEEK },
  { slot: "sup", ...player("Keria", "T1"), points: 9, series: T1_WEEK },
  { slot: "flex", ...player("Kingen", "NS"), plays: "top", points: 5, series: lines("w3-thu-1", "w3-fri-2") },
  { slot: "coach", ...player("kkOma", "T1"), points: 16, series: T1_WEEK },
  { slot: "bench1", ...player("Bdd", "KT"), plays: "mid", series: [], note: "Not in KT's lineup" },
  { slot: "bench2", ...player("Cuzz", "KT"), plays: "jng", points: 9, series: lines("w3-wed-2", "w3-fri-1") },
];

export const PROFILE: ProfileData = {
  manager: { id: MANAGERS.minji.id, name: MANAGERS.minji.name, team: MANAGERS.minji.team, hangul: "쵸비는 바로 거기 있었다", follow: "following" },
  currentWeek: 3,
  weeks: [
    { week: 1, points: 59, final: true, trucks: [] },
    { week: 2, points: 98, final: true, trucks: [] },
    {
      week: 3,
      points: 93,
      ...WEEK3_FINAL,
      final: false,
      buff: "Limitless",
      team: WEEK3_TEAM,
      trucks: [
        { kind: "protest", line: "The template was right there, mate.", from: MANAGERS.dan.name },
        { kind: "coffee", line: "This coffee is Keria-tier support.", from: MANAGERS.jae.name },
      ],
    },
  ],
  history: [
    { week: 3, points: 93, total: 250, overall: 21_804, move: 3_112, transfers: 5, hits: 0, bankEok: 0.5, valueEok: 100.9, buff: "Limitless" },
    { week: 2, points: 98, total: 157, weekRank: 4_211, overall: 24_916, move: 9_870, transfers: 1, hits: 0, bankEok: 1.0, valueEok: 100.6 },
    { week: 1, points: 59, total: 59, weekRank: 34_786, overall: 34_786, bankEok: 2.5, valueEok: 100.0 },
  ],
  buffsLeft: ["Remake", "Bench Boost", "Dual Carry"],
  transfers: [
    {
      week: 3,
      at: { local: "Tue 09:00", kst: "18:00" },
      cost: "Limitless · 0 hits",
      transfers: [
        { slot: "top", out: { ...player("Doran", "T1"), priceEok: 13.0 }, in: { ...player("Kiin", "GEN"), priceEok: 13.5 }, gained: 1 },
        { slot: "bot", out: { ...player("Peyz", "T1"), priceEok: 13.0 }, in: { ...player("Ruler", "GEN"), priceEok: 16.0 }, gained: 4 },
        { slot: "sup", out: { ...player("Lehends", "NS"), priceEok: 10.0 }, in: { ...player("Keria", "T1"), priceEok: 12.0 }, gained: -1 },
        { slot: "flex", out: { ...player("Siwoo", "DK"), priceEok: 11.0 }, in: { ...player("Kingen", "NS"), priceEok: 6.0 }, gained: -4 },
        { slot: "jng", out: { ...player("Peanut", "NS"), priceEok: 15.5 }, in: { ...player("Canyon", "GEN"), priceEok: 15.5 }, gained: 2 },
      ],
    },
    {
      week: 2,
      at: { local: "Mon 12:40", kst: "21:40" },
      cost: "1 free",
      transfers: [{ slot: "bot", out: { ...player("Smash", "T1"), priceEok: 6.0 }, in: { ...player("Peyz", "T1"), priceEok: 13.0 }, gained: 6 }],
    },
  ],
  leagues: [
    { id: "overall", name: "Overall", rank: 21_804, move: 3_112, tier: { name: "Emerald", division: "I" } },
    { id: "south-korea", name: "South Korea", rank: 2_310, move: 402 },
    { id: "gen-supporters", name: "GEN supporters", rank: 1_977, move: 288 },
    { id: "pub-league", name: "Pub League", rank: 3, move: -1, ordinal: true },
  ],
};
