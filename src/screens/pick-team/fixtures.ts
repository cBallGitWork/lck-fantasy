// Pick Team's own made-up data, built on the shared Week 3 file (src/fixtures/week3.ts), at the
// picture's moment: Week 4, Tuesday 22:00 London, before the deadline (pick.html). Faker's and
// Siwoo's card figures are the picture's; the other players' are made up the same way.

import { COMPETITION, MANAGER, PICK_TEAM_SQUAD, WEEK4_DEADLINE, WEEK4_SERIES, type PickTeamPick, type Series, type TeamCode } from "../../fixtures/week3";
import type { Mark, PersonRole, SquadSlot } from "../../rift";
import type { PickBuff, PickState, PickTeam } from "./model";

/** A place in a ranking and what it is out of: `1st of 10 mids`. */
export interface Ranked {
  place: number;
  of?: string;
}

/** A squad member with what his card shows (spec/12, The player card). */
export interface PickPlayer {
  id: string;
  name: string;
  team: TeamCode;
  role: PersonRole;
  priceEok: number;
  /** His last price move in 억; absent before it first moves. */
  priceMove?: number;
  form: number;
  formRank: Ranked;
  ownedPct: number;
  ownedRank: Ranked;
  season: number;
  seasonRank: Ranked;
  /** His points in each of the last three weeks, oldest first. */
  lastThree: readonly number[];
  /** The admin's flag and its note: `Not starting` `Wed`. */
  news?: { flag: string; note: string };
}

/** A buff's box: name, one line (spec/06), how many are left; `here` when it is played on this page. */
export interface PickBuffInfo {
  name: string;
  does: string;
  left: number;
  here?: PickBuff;
}

/** Everything the page shows that the backend will feed. */
export interface PickTeamData {
  /** The manager's team name, for the account menu. */
  account: string;
  /** `LCK Cup Week 4`. */
  week: string;
  players: Record<string, PickPlayer>;
  series: readonly Series[];
  /** Games in each of the week's series. */
  bestOf: number;
  deadline: { local: string; kst: string; countdown: string };
  buffs: readonly PickBuffInfo[];
}

const idOf = (name: string) => name.toLowerCase();

/** Each player's card figures, by name. */
const CARDS: Record<string, Omit<PickPlayer, "id" | "name" | "team" | "role" | "priceEok" | "form">> = {
  Zeus: { formRank: { place: 3, of: "10 tops" }, ownedPct: 31, ownedRank: { place: 4 }, season: 48, seasonRank: { place: 7 }, lastThree: [12, 16, 14] },
  Canyon: { formRank: { place: 2, of: "10 junglers" }, ownedPct: 29, ownedRank: { place: 5 }, season: 50, seasonRank: { place: 6 }, lastThree: [15, 13, 16] },
  Faker: { priceMove: 0.5, formRank: { place: 1, of: "10 mids" }, ownedPct: 46, ownedRank: { place: 1 }, season: 58, seasonRank: { place: 2 }, lastThree: [19, 22, 17] },
  Ruler: { formRank: { place: 1, of: "10 bots" }, ownedPct: 38, ownedRank: { place: 3 }, season: 56, seasonRank: { place: 3 }, lastThree: [14, 17, 15] },
  Delight: { formRank: { place: 4, of: "10 supports" }, ownedPct: 19, ownedRank: { place: 8 }, season: 38, seasonRank: { place: 12 }, lastThree: [8, 11, 9] },
  Siwoo: {
    formRank: { place: 7, of: "10 tops" },
    ownedPct: 6,
    ownedRank: { place: 9 },
    season: 23,
    seasonRank: { place: 8 },
    lastThree: [6, 9, 8],
    news: { flag: "Not starting", note: "Wed" },
  },
  kkOma: { formRank: { place: 1, of: "10 coaches" }, ownedPct: 24, ownedRank: { place: 1 }, season: 27, seasonRank: { place: 1 }, lastThree: [8, 10, 9] },
  Bdd: { formRank: { place: 8, of: "10 mids" }, ownedPct: 4, ownedRank: { place: 10 }, season: 18, seasonRank: { place: 9 }, lastThree: [4, 6, 6] },
  Cuzz: { formRank: { place: 6, of: "10 junglers" }, ownedPct: 5, ownedRank: { place: 9 }, season: 24, seasonRank: { place: 8 }, lastThree: [9, 4, 10] },
};

const player = (p: PickTeamPick): PickPlayer => {
  const card = CARDS[p.name];
  if (!card) throw new Error(`No card figures for ${p.name}`);
  return { id: idOf(p.name), name: p.name, team: p.team, role: p.role, priceEok: p.priceEok, form: p.form, ...card };
};

export const PICK_TEAM_DATA: PickTeamData = {
  account: MANAGER.team,
  week: `${COMPETITION} Week 4`,
  players: Object.fromEntries(PICK_TEAM_SQUAD.map((p) => [idOf(p.name), player(p)])),
  series: WEEK4_SERIES,
  bestOf: 3,
  deadline: WEEK4_DEADLINE,
  buffs: [
    { name: "Bench Boost", does: "Your bench scores too", left: 1, here: "benchBoost" },
    { name: "Dual Carry", does: "Vice-carry ×1.5 too", left: 1, here: "dualCarry" },
    { name: "Remake", does: "Unlimited transfers, kept", left: 1 },
    { name: "Limitless", does: "One week, no budget or team cap", left: 1 },
  ],
};

const markOf = (mark: Mark) => {
  const p = PICK_TEAM_SQUAD.find((x) => x.mark === mark);
  if (!p) throw new Error(`No ${mark} in the Pick Team squad`);
  return idOf(p.name);
};

/** Baron Steal FC's saved team at the picture's moment. */
export const SAVED_TEAM: PickTeam = {
  slots: Object.fromEntries(PICK_TEAM_SQUAD.map((p) => [p.slot, idOf(p.name)])) as Record<SquadSlot, string>,
  carry: markOf("C"),
  vice: markOf("V"),
};

/** The three states the picture folder draws. */
export const PICK_TEAM_STATES: Record<"rift" | "cards" | "swap", PickState> = {
  /** 1440.png: Rift view, Faker tapped, no changes. */
  rift: { saved: SAVED_TEAM, draft: SAVED_TEAM, view: "rift", selected: "faker" },
  /** 1440-cards.png: Card view, Faker tapped. */
  cards: { saved: SAVED_TEAM, draft: SAVED_TEAM, view: "cards", selected: "faker" },
  /** 1440-swap.png: Siwoo going out, Bench Boost on and unsaved. */
  swap: { saved: SAVED_TEAM, draft: { ...SAVED_TEAM, buff: "benchBoost" }, view: "rift", selected: "siwoo", swapping: "siwoo" },
};
