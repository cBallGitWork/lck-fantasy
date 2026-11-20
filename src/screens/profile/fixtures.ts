// Minji Park's profile as the approved picture shows it (docs/design/approved/profile/): a made-up
// Split 1 Week 3 on the Sunday before its last two series, so Week 3 is not final. Her series are
// Week 3's, final from Wednesday to Saturday (WEEK3_SERIES_FINAL). Not roster data.

import { MANAGERS, MINJI_EARLIER_WEEKS, MINJI_WEEK3 } from "../../fixtures/managers";
import { playedFromSide, seriesById } from "../../fixtures/series";
import { HIT_POINTS, playerId, WEEK3_FINAL, WEEK3_SERIES_FINAL, type BuffName, type TeamCode } from "../../fixtures/week3";
import { overallTierOf } from "../../fixtures/myLeagues";
import { score, type CheerKind, type Standing } from "../../parts";
import type { Tier } from "../../../convex/leagues/tiers";
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
  /** Overall as a LoL tier, by the team name (spec/08): the tier, its rank and move. */
  overall: Standing;
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
  /** The week's points, Captain's ×1.5 in; absent when he didn't play. */
  points?: number;
  /** The week's series he played, from his team's side as Points shows them: `v KT 2–0 · Wed`. */
  series: string[];
  /** Why he has no series, in place of them. */
  note?: string;
}

/** A cheer or jeer parked on her profile for the week (spec/14). */
export interface Parked {
  kind: CheerKind;
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
  cheers: Parked[];
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
  /** The points the week's transfers took over the free ones: 6 for one extra (spec/03); absent for none. */
  cost?: number;
  bankM: number;
  valueM: number;
  buff?: BuffName;
}

export interface Transfer {
  slot: SlotKey;
  out: ProfilePlayer & { priceM: number };
  in: ProfilePlayer & { priceM: number };
  /** Points the player in scored over the player out. */
  gained: number;
}

export interface TransferWeek {
  week: number;
  /** When the transfers were made, in your time. */
  at: { local: string };
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
}

/** A season that has ended: its final tier and rank on Overall (spec/08, History's Past seasons). */
export interface PastSeason {
  season: string;
  tier: Tier;
  rank: number;
}

export interface ProfileData {
  manager: ProfileManager;
  /** The week shown on Points when the page opens. */
  currentWeek: number;
  weeks: PointsWeek[];
  history: HistoryRow[];
  buffsLeft: BuffName[];
  /** Each ended season, latest first; none until a season has ended. */
  pastSeasons: PastSeason[];
  transfers: TransferWeek[];
  leagues: LeagueRow[];
}

const player = (name: string, team: TeamCode): ProfilePlayer => ({ id: playerId(name), name, team });

/** A series from his team's side, as Points shows it: `v KT 2–0 · Wed` (the row already names his team). */
function seriesLine(team: TeamCode, id: string): string {
  const s = seriesById(WEEK3_SERIES_FINAL, id);
  const side = playedFromSide(s, team);
  return `v ${side.opponent} ${score(side.score)} · ${s.day}`;
}

const lines = (team: TeamCode, ...ids: string[]) => ids.map((id) => seriesLine(team, id));
const GEN_WEEK = lines("GEN", "w3-wed-2", "w3-sat-1");
const T1_WEEK = lines("T1", "w3-wed-1", "w3-sat-2");

const WEEK3_TEAM: ProfilePick[] = [
  { slot: "top", ...player("Kiin", "GEN"), points: 11, series: GEN_WEEK },
  { slot: "jng", ...player("Canyon", "GEN"), points: 14, series: GEN_WEEK },
  { slot: "mid", ...player("Chovy", "GEN"), points: 17, series: GEN_WEEK },
  { slot: "bot", ...player("Ruler", "GEN"), mark: "C", points: 21, series: GEN_WEEK },
  { slot: "sup", ...player("Keria", "T1"), points: 9, series: T1_WEEK },
  { slot: "flex", ...player("Kingen", "NS"), plays: "top", points: 5, series: lines("NS", "w3-thu-1", "w3-fri-2") },
  { slot: "coach", ...player("kkOma", "T1"), points: 16, series: T1_WEEK },
  { slot: "bench1", ...player("Bdd", "KT"), plays: "mid", series: [], note: "Not in KT's lineup" },
  { slot: "bench2", ...player("Cuzz", "KT"), plays: "jng", points: 9, series: lines("KT", "w3-wed-2", "w3-fri-1") },
];

const [W1, W2] = MINJI_EARLIER_WEEKS;

/** Her Overall rank at Week 3 and its move. */
const OVERALL = { rank: 21_804, move: 3_112 };

export const PROFILE: ProfileData = {
  manager: {
    id: MANAGERS.minji.id,
    name: MANAGERS.minji.name,
    team: MANAGERS.minji.team,
    hangul: "쵸비는 바로 거기 있었다",
    follow: "following",
    overall: { ...OVERALL, tier: overallTierOf(OVERALL.rank) },
  },
  currentWeek: 3,
  weeks: [
    { week: 1, points: W1, final: true, cheers: [] },
    { week: 2, points: W2, final: true, cheers: [] },
    {
      week: 3,
      points: MINJI_WEEK3.points,
      ...WEEK3_FINAL,
      final: false,
      buff: "Bench Boost",
      team: WEEK3_TEAM,
      cheers: [
        { kind: "jeer", line: "The template was right there, mate.", from: MANAGERS.dan.name },
        { kind: "cheer", line: "This coffee is Keria-tier support.", from: MANAGERS.jae.name },
      ],
    },
  ],
  history: [
    { week: 3, ...MINJI_WEEK3, overall: OVERALL.rank, move: OVERALL.move, transfers: 5, cost: 3 * HIT_POINTS, bankM: 0.5, valueM: 100.9, buff: "Bench Boost" },
    { week: 2, points: W2, total: W1 + W2, weekRank: 4_211, overall: 24_916, move: 9_870, transfers: 1, bankM: 1.0, valueM: 100.6 },
    { week: 1, points: W1, total: W1, weekRank: 34_786, overall: 34_786, bankM: 2.5, valueM: 100.0 },
  ],
  buffsLeft: ["Double Captain", "Coach Diff"],
  pastSeasons: [],
  transfers: [
    {
      week: 3,
      at: { local: "Tue 09:00" },
      cost: "Bench Boost · 3 hits",
      transfers: [
        { slot: "top", out: { ...player("Doran", "T1"), priceM: 13.0 }, in: { ...player("Kiin", "GEN"), priceM: 13.5 }, gained: 1 },
        { slot: "bot", out: { ...player("Peyz", "T1"), priceM: 13.0 }, in: { ...player("Ruler", "GEN"), priceM: 16.0 }, gained: 4 },
        { slot: "sup", out: { ...player("Lehends", "NS"), priceM: 10.0 }, in: { ...player("Keria", "T1"), priceM: 12.0 }, gained: -1 },
        { slot: "flex", out: { ...player("Siwoo", "DK"), priceM: 11.0 }, in: { ...player("Kingen", "NS"), priceM: 6.0 }, gained: -4 },
        { slot: "jng", out: { ...player("Peanut", "NS"), priceM: 15.5 }, in: { ...player("Canyon", "GEN"), priceM: 15.5 }, gained: 2 },
      ],
    },
    {
      week: 2,
      at: { local: "Mon 12:40" },
      cost: "1 free",
      transfers: [{ slot: "bot", out: { ...player("Smash", "T1"), priceM: 6.0 }, in: { ...player("Peyz", "T1"), priceM: 13.0 }, gained: 6 }],
    },
  ],
  leagues: [
    { id: "overall", name: "Overall", ...OVERALL },
    { id: "south-korea", name: "South Korea", rank: 2_310, move: 402 },
    { id: "gen-supporters", name: "GEN supporters", rank: 1_977, move: 288 },
    { id: "pub-league", name: "Pub League", rank: 3, move: -1 },
  ],
};
