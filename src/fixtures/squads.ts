// Baron Steal FC's squads and week totals at the pictures' moments, and Week 3's perfect game.
// Every name and number is an example.

import type { Mark, PersonRole, SlotKey, SquadSlot } from "../rift";
import { carried, playerId, seriesPoints, type TeamCode } from "./competition";
import { formOf, statsOf } from "./players";
import { fromSide, seriesById } from "./series";
import { WEEK3_SERIES_FINAL } from "./weeks";

/** Who a team played in a final Week 3 series. */
const opponentIn = (id: string, team: TeamCode) => fromSide(seriesById(WEEK3_SERIES_FINAL, id), team).opponent;

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
export const POINTS_WEEK = { week: 3, average: 74, highest: 121 } as const;

/** Week 3's Average and Highest once final (Home, Live, Perfect game, Profile): under the perfect game. */
export const WEEK3_FINAL = { average: 79, highest: 128 } as const;

/** The series live at Points' moment. */
export const LIVE_SERIES_ID = "w3-sat-2";

/** T1 v DK once final, for the squad members in it: the Series page's games, and kkOma's +3 for a series won. */
const LIVE_SERIES_FINAL: Record<string, { games: number[]; coachResult?: number }> = {
  Faker: { games: [4, 6] },
  Siwoo: { games: [2, 2] },
  kkOma: { games: [2, 3], coachResult: 3 },
};

/** Baron Steal FC once Week 3 is final: Points' squad with T1 v DK finished. */
export const WEEK3_FINAL_SQUAD: PointsPick[] = POINTS_SQUAD.map((pick) => ({
  ...pick,
  series: pick.series.map((s) => {
    if (s.id !== LIVE_SERIES_ID) return s;
    const final = LIVE_SERIES_FINAL[pick.name];
    if (!final) throw new Error(`No final ${LIVE_SERIES_ID} for ${pick.name}`);
    return { id: s.id, ...final };
  }),
}));

/** A squad member's points in each series he played, before the Carry's ×1.5. */
export const seriesPointsOf = (pick: PointsPick) => pick.series.map((s) => ({ id: s.id, points: seriesPoints(s.games, s.coachResult) }));

/** A squad member's week before the Carry's ×1.5; `without` leaves a series out. */
export const rawWeekOf = (pick: PointsPick, without?: string) =>
  seriesPointsOf(pick)
    .filter((s) => s.id !== without)
    .reduce((sum, s) => sum + s.points, 0);

/** A squad member's week as it counts for Baron Steal FC: the Carry's ×1.5 in. */
export const weekOf = (pick: PointsPick, without?: string) => (pick.mark === "C" ? carried(rawWeekOf(pick, without)) : rawWeekOf(pick, without));

/** Each starter's week by card id, at a moment's squad. */
const startersWeek = (squad: PointsPick[], without?: string): Readonly<Record<string, number>> =>
  Object.fromEntries(squad.filter((p) => p.slot !== "bench").map((p) => [playerId(p.name), weekOf(p, without)]));

const sum = (byId: Readonly<Record<string, number>>) => Object.values(byId).reduce((a, b) => a + b, 0);

/**
 * Baron Steal FC's Week 3 as Home, Live, Points and the cards give it, worked from the squad: each
 * starter's points at Points' moment, by card id (the Carry's after ×1.5), the same with the live
 * series left out (the feed down), and once final.
 */
export const MY_WEEK3 = (() => {
  const live = startersWeek(POINTS_SQUAD);
  const down = startersWeek(POINTS_SQUAD, LIVE_SERIES_ID);
  const final = startersWeek(WEEK3_FINAL_SQUAD);
  return { live, liveTotal: sum(live), down, downTotal: sum(down), final, finalTotal: sum(final) };
})();

/** A starter's points at Points' moment, by card id; a missing one is a broken fixture. */
export function livePointsOf(id: string): number {
  const points = MY_WEEK3.live[id];
  if (points === undefined) throw new Error(`No Week 3 live points for ${id}`);
  return points;
}

/** A squad member once Week 3 is final, by name; a missing one is a broken fixture. */
export function finalPickOf(name: string): PointsPick {
  const pick = WEEK3_FINAL_SQUAD.find((p) => p.name === name);
  if (!pick) throw new Error(`${name} is not in Baron Steal FC's Week 3 squad`);
  return pick;
}

/** A squad member at the Pick Team picture's moment, with Week 4's price in m and form, from Stats. */
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

const priced = (pick: Omit<PickTeamPick, "priceEok" | "form">): PickTeamPick => {
  const stats = statsOf(pick.name);
  return { ...pick, priceEok: stats.priceEok, form: formOf(stats.points) };
};

/** Baron Steal FC at the Pick Team picture's moment (pick.html): prices and form are Stats'. */
export const PICK_TEAM_SQUAD: PickTeamPick[] = ([
  { slot: "top", name: "Zeus", team: "HLE", role: "top" },
  { slot: "jng", name: "Canyon", team: "GEN", role: "jng" },
  { slot: "mid", name: "Faker", team: "T1", role: "mid", mark: "C" },
  { slot: "bot", name: "Ruler", team: "GEN", role: "bot", mark: "V" },
  { slot: "sup", name: "Delight", team: "HLE", role: "sup" },
  { slot: "flex", name: "Siwoo", team: "DK", role: "top", news: "Not starting Wed" },
  { slot: "coach", name: "kkOma", team: "T1", role: "coach" },
  { slot: "bench1", name: "Bdd", team: "KT", role: "mid" },
  { slot: "bench2", name: "Cuzz", team: "KT", role: "jng" },
] satisfies Omit<PickTeamPick, "priceEok" | "form">[]).map(priced);

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

/** A perfect pick from Baron Steal FC's final squad: his series and points, worked from its games. */
function mineInPerfect(slot: SlotKey, carry = false): PerfectPick {
  const pick = WEEK3_FINAL_SQUAD.find((p) => p.slot === slot);
  if (!pick) throw new Error(`Baron Steal FC has no ${slot} in Week 3`);
  const series = seriesPointsOf(pick);
  const raw = rawWeekOf(pick);
  const line = series.map((s) => `v ${opponentIn(s.id, pick.team)} ${s.points}`).join(" · ");
  return { slot, role: pick.role, name: pick.name, mine: true, team: pick.team, points: carry ? carried(raw) : raw, raw: carry ? raw : undefined, carry: carry || undefined, line };
}

/** Week 3's perfect game (perfect.html): Baron Steal FC's four worked from his squad's games. */
export const PERFECT_GAME: PerfectPick[] = [
  mineInPerfect("top"),
  { slot: "jng", role: "jng", name: "Pyosik", team: "DNS", points: 21, line: "v BRO 10 · v BFX 11" },
  mineInPerfect("mid", true),
  mineInPerfect("bot"),
  { slot: "sup", role: "sup", name: "Duro", team: "GEN", points: 11, line: "v KT 6 · v HLE 5" },
  { slot: "flex", role: "mid", name: "BuLLDoG", team: "DNS", points: 21, line: "v BRO 9 · v BFX 12" },
  mineInPerfect("coach"),
];
