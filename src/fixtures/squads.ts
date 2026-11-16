// Baron Steal FC's squads and week totals at the pictures' moments, and Week 3's perfect game.
// Every name and number is an example.

import type { Mark, PersonRole, SlotKey, SquadSlot } from "../rift";
import type { TeamCode } from "./competition";

/** A squad member at the Points picture's moment, with his points game by game. */
export interface PointsPick {
  slot: SlotKey | "bench";
  name: string;
  team: TeamCode;
  /** The role he plays: his slot's, save the Flex and the bench. */
  role: PersonRole;
  mark?: Mark;
  /** Each series he played this week: its id and points per game. A live series' last game is live. */
  series: { id: string; games: number[]; coachResult?: number }[];
  birthday?: boolean;
  /** Who he came on for, or that he went off unplayed. */
  subbedInFor?: string;
  subbedOut?: boolean;
}

/** Baron Steal FC at the Points picture's moment (points.html). */
export const POINTS_SQUAD: PointsPick[] = [
  { slot: "top", name: "Zeus", team: "HLE", role: "top", series: [{ id: "w3-wed-1", games: [4, 1, 3] }, { id: "w3-sat-1", games: [2, 5, 0] }] },
  { slot: "jng", name: "Canyon", team: "GEN", role: "jng", series: [{ id: "w3-wed-2", games: [3, 4] }, { id: "w3-sat-1", games: [2, 3, 4] }] },
  { slot: "mid", name: "Faker", team: "T1", role: "mid", mark: "C", series: [{ id: "w3-wed-1", games: [5, 2, 7] }, { id: "w3-sat-2", games: [4, 1] }] },
  { slot: "bot", name: "Ruler", team: "GEN", role: "bot", mark: "V", series: [{ id: "w3-wed-2", games: [3, 4] }, { id: "w3-sat-1", games: [3, 1, 4] }] },
  { slot: "sup", name: "Delight", team: "HLE", role: "sup", birthday: true, series: [{ id: "w3-wed-1", games: [2, 3, 1] }, { id: "w3-sat-1", games: [1, 2, 2] }] },
  { slot: "flex", name: "Siwoo", team: "DK", role: "top", subbedInFor: "Bdd", series: [{ id: "w3-thu-1", games: [3, 2] }, { id: "w3-sat-2", games: [2, 1] }] },
  {
    slot: "coach",
    name: "kkOma",
    team: "T1",
    role: "coach",
    series: [{ id: "w3-wed-1", games: [2, 0, 3], coachResult: 3 }, { id: "w3-sat-2", games: [2, 0] }],
  },
  { slot: "bench", name: "Bdd", team: "KT", role: "mid", subbedOut: true, series: [] },
  { slot: "bench", name: "Cuzz", team: "KT", role: "jng", series: [{ id: "w3-wed-2", games: [1, 0] }, { id: "w3-fri-1", games: [3, 2, 5] }] },
];

/** The Points picture's head: Average and Highest beside the total. */
export const POINTS_WEEK = { week: 3, average: 74, highest: 131 } as const;

/** Week 3's Average and Highest once final (Home, Live, Perfect game, Profile). */
export const WEEK3_FINAL = { average: 79, highest: 136 } as const;

/**
 * Baron Steal FC's Week 3 as Home, Live, Points and the cards give it: the total at Points' moment
 * and each starter's points then, by card id (the Carry's after ×1.5), and the total once final.
 */
export const MY_WEEK3 = {
  liveTotal: 94,
  live: { faker: 25, siwoo: 8, kkoma: 10, zeus: 14, canyon: 14, ruler: 14, delight: 9 } as Readonly<Record<string, number>>,
  finalTotal: 109,
} as const;

/** A starter's points at Points' moment, by card id; a missing one is a broken fixture. */
export function livePointsOf(id: string): number {
  const points = MY_WEEK3.live[id];
  if (points === undefined) throw new Error(`No Week 3 live points for ${id}`);
  return points;
}

/** A squad member at the Pick Team picture's moment, with Week 4's price in m and form. */
export interface PickTeamPick {
  slot: SquadSlot;
  name: string;
  team: TeamCode;
  role: PersonRole;
  priceEok: number;
  form: number;
  mark?: Mark;
  news?: string;
}

/** Baron Steal FC at the Pick Team picture's moment (pick.html). */
export const PICK_TEAM_SQUAD: PickTeamPick[] = [
  { slot: "top", name: "Zeus", team: "HLE", role: "top", priceEok: 16.0, form: 14.0 },
  { slot: "jng", name: "Canyon", team: "GEN", role: "jng", priceEok: 15.5, form: 14.7 },
  { slot: "mid", name: "Faker", team: "T1", role: "mid", priceEok: 18.5, form: 19.3, mark: "C" },
  { slot: "bot", name: "Ruler", team: "GEN", role: "bot", priceEok: 17.0, form: 15.3, mark: "V" },
  { slot: "sup", name: "Delight", team: "HLE", role: "sup", priceEok: 9.0, form: 9.3 },
  { slot: "flex", name: "Siwoo", team: "DK", role: "top", priceEok: 7.5, form: 7.7, news: "Not starting Wed" },
  { slot: "coach", name: "kkOma", team: "T1", role: "coach", priceEok: 7.0, form: 9.0 },
  { slot: "bench1", name: "Bdd", team: "KT", role: "mid", priceEok: 5.0, form: 5.3 },
  { slot: "bench2", name: "Cuzz", team: "KT", role: "jng", priceEok: 4.0, form: 7.7 },
];

/** A Pick Team squad member by name; a missing one is a broken fixture. */
export function pickedAt(name: string): PickTeamPick {
  const pick = PICK_TEAM_SQUAD.find((p) => p.name === name);
  if (!pick) throw new Error(`${name} is not in the Pick Team squad`);
  return pick;
}

/** The sample manager's nine: the same names in the Points and Pick Team squads. */
export const MY_PLAYERS: ReadonlySet<string> = new Set(PICK_TEAM_SQUAD.map((p) => p.name));

/** A starter in the Perfect game picture: Week 3's best team, final. */
export interface PerfectPick {
  slot: SlotKey;
  name: string;
  team: TeamCode;
  role: PersonRole;
  points: number;
  /** Before ×1.5, for the Carry. */
  raw?: number;
  carry?: boolean;
  /** One of the sample manager's players. */
  mine?: boolean;
  line: string;
}

/** Week 3's perfect game (perfect.html). */
export const PERFECT_GAME: PerfectPick[] = [
  { slot: "top", role: "top", name: "Zeus", mine: true, team: "HLE", points: 14, line: "v T1 7 · v GEN 7" },
  { slot: "jng", role: "jng", name: "Pyosik", team: "DNS", points: 24, line: "v BRO 11 · v BFX 13" },
  { slot: "mid", role: "mid", name: "Faker", mine: true, team: "T1", points: 40, raw: 27, carry: true, line: "v HLE 12 · v DK 15" },
  { slot: "bot", role: "bot", name: "Ruler", mine: true, team: "GEN", points: 14, line: "v KT 7 · v HLE 7" },
  { slot: "sup", role: "sup", name: "Duro", team: "GEN", points: 13, line: "v KT 6 · v HLE 7" },
  { slot: "flex", role: "mid", name: "BuLLDoG", team: "DNS", points: 21, line: "v BRO 9 · v BFX 12" },
  { slot: "coach", role: "coach", name: "kkOma", mine: true, team: "T1", points: 16, line: "v HLE 8 · v DK 8" },
];
