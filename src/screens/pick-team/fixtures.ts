// Pick Team's own made-up data, built on the shared Week 3 file (src/fixtures/week3.ts), at the
// picture's moment: Week 4, Tuesday 22:00 London, before the deadline (pick.html). Prices, form,
// owned % and season points are Stats'; Faker's and kkOma's last three series are the T1 season's.

import { FAKER_SEASON, KKOMA_SEASON, last3, type T1MemberSeason } from "../../fixtures/t1Season";
import { BUFF_DOES, COMPETITION, finalPickOf, MANAGER, PICK_TEAM_SQUAD, playerId, seriesPointsOf, statsOf, WEEK4_DEADLINE, WEEK4_SERIES, type BuffName, type PickTeamPick, type Series, type TeamCode } from "../../fixtures/week3";
import type { Mark, PersonRole, SquadSlot } from "../../rift";
import type { PickBuff, PickState, PickTeam } from "./model";

/** A squad member with what his card shows (spec/12, The player card). */
export interface PickPlayer {
  id: string;
  name: string;
  team: TeamCode;
  role: PersonRole;
  priceM: number;
  /** His last price move in m; absent before it first moves. */
  priceMove?: number;
  /** The group his form, owned and season rank among, said once over the ranks: `10 mids`. */
  among: string;
  form: number;
  formRank: number;
  ownedPct: number;
  ownedRank: number;
  season: number;
  seasonRank: number;
  /** His points in each of his last three series, oldest first. */
  last3: readonly number[];
  /** The admin's flag and its note: `Not starting` `Wed`. */
  news?: { flag: string; note: string };
}

/** A buff's box: name, one line (spec/06), the week it was played in, if it was, and the buff it plays. */
export interface PickBuffInfo {
  name: BuffName;
  does: string;
  /** The week it was played this split; one of each a split (spec/06). */
  playedWeek?: number;
  here: PickBuff;
}

/** Everything the page shows that the backend will feed. */
export interface PickTeamData {
  /** The manager's team name, for the account menu. */
  account: string;
  /** `Split 1 Week 4`. */
  week: string;
  players: Record<string, PickPlayer>;
  series: readonly Series[];
  deadline: { local: string; countdown: string };
  buffs: readonly PickBuffInfo[];
}


/** T1's two in the squad: their last three series are the shared T1 season's. */
const T1_SEASONS: Record<string, T1MemberSeason> = { Faker: FAKER_SEASON, kkOma: KKOMA_SEASON };

/** The others' series points before Week 3, oldest first, made up; Week 3's are the shared squad's. */
const BEFORE_WEEK3: Record<string, number[]> = { Zeus: [12], Canyon: [15], Ruler: [14], Delight: [8], Siwoo: [6], Bdd: [4, 6, 6], Cuzz: [9] };

/** His points in his last three series, oldest first (spec/12, the player card's front). */
function last3Of(name: string): number[] {
  const t1 = T1_SEASONS[name];
  if (t1) return last3(t1).map((s) => s.points);
  const before = BEFORE_WEEK3[name];
  if (!before) throw new Error(`${name} has no series before Week 3`);
  return [...before, ...seriesPointsOf(finalPickOf(name)).map((s) => s.points)].slice(-3);
}

/** Each player's card figures, by name; owned % and season points are Stats'. */
const CARDS: Record<string, Omit<PickPlayer, "id" | "name" | "team" | "role" | "priceM" | "form" | "ownedPct" | "season" | "last3">> = {
  Zeus: { among: "10 tops", formRank: 3, ownedRank: 4, seasonRank: 7 },
  Canyon: { among: "10 junglers", formRank: 2, ownedRank: 5, seasonRank: 6 },
  Faker: { priceMove: 0.5, among: "10 mids", formRank: 1, ownedRank: 1, seasonRank: 2 },
  Ruler: { among: "10 bots", formRank: 1, ownedRank: 3, seasonRank: 3 },
  Delight: { among: "10 supports", formRank: 4, ownedRank: 8, seasonRank: 12 },
  Siwoo: { among: "10 tops", formRank: 7, ownedRank: 9, seasonRank: 8, news: { flag: "Not starting", note: "Wed" } },
  kkOma: { among: "10 coaches", formRank: 1, ownedRank: 1, seasonRank: 1 },
  Bdd: { among: "10 mids", formRank: 8, ownedRank: 10, seasonRank: 9 },
  Cuzz: { among: "10 junglers", formRank: 6, ownedRank: 9, seasonRank: 8 },
};

const player = (p: PickTeamPick): PickPlayer => {
  const card = CARDS[p.name];
  if (!card) throw new Error(`No card figures for ${p.name}`);
  const { ownedPct, points } = statsOf(p.name);
  return { id: playerId(p.name), name: p.name, team: p.team, role: p.role, priceM: p.priceM, form: p.form, ownedPct, season: points, last3: last3Of(p.name), ...card };
};

export const PICK_TEAM_DATA: PickTeamData = {
  account: MANAGER.team,
  week: `${COMPETITION} Week 4`,
  players: Object.fromEntries(PICK_TEAM_SQUAD.map((p) => [playerId(p.name), player(p)])),
  series: WEEK4_SERIES,
  deadline: WEEK4_DEADLINE,
  buffs: [
    { name: "Bench Boost", does: BUFF_DOES["Bench Boost"], here: "benchBoost" },
    { name: "Double Captain", does: BUFF_DOES["Double Captain"], here: "doubleCaptain" },
    { name: "Coach Diff", does: BUFF_DOES["Coach Diff"], here: "coachMultiplier" },
  ],
};

const markOf = (mark: Mark) => {
  const p = PICK_TEAM_SQUAD.find((x) => x.mark === mark);
  if (!p) throw new Error(`No ${mark} in the Pick Team squad`);
  return playerId(p.name);
};

/** Baron Steal FC's saved team at the picture's moment. */
export const SAVED_TEAM: PickTeam = {
  slots: Object.fromEntries(PICK_TEAM_SQUAD.map((p) => [p.slot, playerId(p.name)])) as Record<SquadSlot, string>,
  captain: markOf("C"),
};

/** The three states the picture folder draws. */
export const PICK_TEAM_STATES: Record<"rift" | "cards" | "swap", PickState> = {
  /** 1440.png: Rift view, Faker tapped (Bdd lit to swap with him), no changes. */
  rift: { saved: SAVED_TEAM, draft: SAVED_TEAM, view: "rift", selected: "faker" },
  /** 1440-cards.png: Card view, Faker tapped. */
  cards: { saved: SAVED_TEAM, draft: SAVED_TEAM, view: "cards", selected: "faker" },
  /** 1440-swap.png: Siwoo, the Flex, tapped (Zeus and both bench players lit), Bench Boost on and unsaved. */
  swap: { saved: SAVED_TEAM, draft: { ...SAVED_TEAM, buff: "benchBoost" }, view: "rift", selected: "siwoo" },
};
