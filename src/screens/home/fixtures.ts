// Home's made-up data: the approved pictures' own Split 1 Week 3 and Week 4 (docs/design/approved/home/),
// built on the shared weeks (src/fixtures/week3.ts). Every name and number is an example; who may not
// start, the next deadlines and All managers' counts are Home's own (#473).

import type { BuffEffect } from "../../../convex/squads/buffs";
import { FOLLOWED_WEEK3, MANAGERS } from "../../fixtures/managers";
import { MY_LEAGUES, MY_OVERALL } from "../../fixtures/myLeagues";
import { opponent, seriesById, seriesOf } from "../../fixtures/series";
import { DEFAULT_STREAM, STREAMS } from "../../fixtures/streams";
import {
  BEST_OF,
  countdown,
  finalPickOf,
  LIVE_SERIES_ID,
  MANAGER,
  MY_PLAYERS,
  MY_WEEK3,
  PERFECT_OTHERS,
  PICK_TEAM_SQUAD,
  playedIn,
  playerId,
  POINTS_AT,
  POINTS_SQUAD,
  POINTS_WEEK,
  rawWeekOf,
  seriesPoints,
  statsOf,
  WEEK3_FINAL,
  WEEK3_SERIES_AT_POINTS,
  WEEK4_DEADLINE,
  WEEK4_FREE_TRANSFERS,
  WEEK4_SERIES,
  type BuffName,
  type Series,
} from "../../fixtures/week3";
import { momentIn, sum } from "../../parts";
import { flexPlays, isBench, type RoleKey } from "../../rift";
import { PICK_TEAM_DATA } from "../pick-team/fixtures";
import { starAndFlop, type WeekPlayer } from "./starFlop";
import type { Doubt, HomeData, HomeFollowing, HomeIdleData, HomeLiveData, HomeShared, InSeries, ManagersWeek, Named, PlayedBuff, WeekPick } from "./types";

/** The pictures' zone: London, UTC in January to March. */
const ZONE = "Europe/London";

/** A player as a row names him: team, name, and whether he is in Baron Steal FC's squad. */
const named = (name: string): Named => {
  const { team } = statsOf(name);
  return MY_PLAYERS.has(name) ? { name, team, mine: true } : { name, team };
};

const matchup = (s: Series) => `${s.home} v ${s.away}`;

/** The idle pictures' own moment, by design not Points' or Pick Team's: Tuesday evening, 9h 45m before Week 4's deadline. */
const IDLE_AT = "2027-01-19T22:00:00Z";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** The three deadlines after Week 4's, a week apart, made up: the season's data holds Weeks 1 to 4. */
const NEXT_DEADLINES = [5, 6, 7].map((week) => ({
  week,
  local: momentIn(Date.parse(WEEK4_DEADLINE.at) + (week - 4) * WEEK_MS, ZONE, { date: true }),
}));

/** Each Week 4 starter who may not play: the admin's flag on him, as Pick Team shows it. Never the bench. */
const DOUBTS: Doubt[] = PICK_TEAM_SQUAD.flatMap((p) => {
  const news = PICK_TEAM_DATA.players[playerId(p.name)]?.news;
  if (isBench(p.slot) || !news) return [];
  return [{ name: p.name, team: p.team, role: p.role, flag: news.flag, note: news.note }];
});

/** A buff by name, its effect from Pick Team's buffs. */
function buffOf(name: BuffName): PlayedBuff {
  const effect: BuffEffect | undefined = PICK_TEAM_DATA.buffs.find((b) => b.name === name)?.here;
  if (!effect) throw new Error(`Pick Team has no ${name}`);
  return { effect, name };
}

const BENCH_BOOST: BuffName = "Bench Boost";

/** A followed manager's Week 3 series, as the Following panel lists it. */
function followed(who: keyof typeof FOLLOWED_WEEK3) {
  const { seriesId, points } = FOLLOWED_WEEK3[who];
  return { id: `${who}-${seriesId}`, managerId: MANAGERS[who].id, manager: MANAGERS[who].first, series: matchup(seriesById(WEEK3_SERIES_AT_POINTS, seriesId)), points };
}

const following = (final: boolean): HomeFollowing => ({
  week: 3,
  final,
  items: [followed("minji"), followed("dan"), followed("jae")],
  received: { cheer: "jeer", line: "Sell your bot laner", from: MANAGERS.minji.first, week: 3 },
});

const SHARED: Pick<HomeShared, "team" | "hangul" | "overall" | "leagues"> = {
  team: MANAGER.team,
  hangul: MANAGER.hangul,
  overall: { tier: MY_OVERALL.tier, rank: MY_OVERALL.rank, move: MY_OVERALL.move },
  leagues: MY_LEAGUES.map(({ id, name, kind, rank, move }) => ({ id, name, kind, rank, move })),
};

const deadline = (from: string, buff?: PlayedBuff): HomeShared["deadline"] => ({
  week: 4,
  local: WEEK4_DEADLINE.local,
  countdown: countdown(from, WEEK4_DEADLINE.at),
  freeTransfers: WEEK4_FREE_TRANSFERS,
  ...(buff && { buff }),
  doubts: DOUBTS,
  next: NEXT_DEADLINES,
});

/** A star or flop as the week panel shows him. */
const pickOf = (p: WeekPlayer): WeekPick => ({ ...named(p.name), points: p.points, eoPct: p.eoPct });

/** Week 2's made-up points and effective ownership, final: the live pictures' star and flop. */
const WEEK2_FIELD: WeekPlayer[] = Object.entries({
  Faker: [2, 62], Keria: [9, 52], Chovy: [12, 45], Ruler: [11, 45], Zeus: [10, 41], Canyon: [8, 37], Peyz: [7, 33],
  kkOma: [6, 30], Delight: [5, 26], Gumayusi: [4, 22], Oner: [9, 18], Kiin: [15, 8],
}).map(([name, [points, eoPct]]) => ({ name, points: points!, eoPct: eoPct! }));

/** A squad member's final Week 3, before the Captain's ×1.5, as star and flop show it. */
const week3Of = (name: string) => rawWeekOf(finalPickOf(name));

/** Week 3's made-up points for those neither in Baron Steal FC's squad nor the perfect game. */
const OTHERS_WEEK3: Record<string, number> = { Keria: 14, Chovy: 17, Peyz: 12, Gumayusi: 10, Oner: 13, Kiin: 15, Doran: 8 };

/** A final Week 3 by name: a squad member's and a perfect pick's worked from their games, the rest made up. */
function week3PointsOf(name: string): number {
  const perfect = PERFECT_OTHERS[name];
  if (perfect) return sum(perfect.map((s) => s.points));
  return OTHERS_WEEK3[name] ?? week3Of(name);
}

/** Week 3's made-up effective ownership, in per cent, most owned first. */
const WEEK3_EO: Record<string, number> = {
  Faker: 64, Keria: 52, Chovy: 48, Ruler: 45, Zeus: 41, Canyon: 37, Peyz: 33, kkOma: 30, Delight: 26, Gumayusi: 22,
  Oner: 18, Kiin: 15, Duro: 14, Siwoo: 12, Doran: 10, BuLLDoG: 9, Pyosik: 7,
};

/** Week 3's players and coaches, final: points and effective ownership. */
export const WEEK3_FIELD: WeekPlayer[] = Object.entries(WEEK3_EO).map(([name, eoPct]) => ({ name, points: week3PointsOf(name), eoPct }));

const starFlopOf = (week: number, field: readonly WeekPlayer[]) => {
  const { stars, flops } = starAndFlop(field);
  return { week, stars: stars.map(pickOf), flops: flops.map(pickOf) };
};

/** Baron Steal FC's bench's points in Week 3 so far, which count with Bench Boost on. */
const BENCH_WEEK3 = sum(POINTS_SQUAD.filter((p) => p.slot === "bench").map((p) => rawWeekOf(p)));

/** All managers' made-up facts. */
const fact = (kind: ManagersWeek["facts"][number]["kind"], name: string, value: number) => ({ kind, ...named(name), value });

// A series live: Saturday of Week 3, T1 v DK in game 2 (1440.png).

const live = seriesById(WEEK3_SERIES_AT_POINTS, LIVE_SERIES_ID);
if (!live.score || live.liveGame === undefined) throw new Error(`${LIVE_SERIES_ID} is live at Points' moment, with its score and game`);

/** Your player's points so far in the live series, the Captain's before ×1.5. */
function inLive(name: string): InSeries {
  const played = playedIn(name, LIVE_SERIES_ID);
  const mark = POINTS_SQUAD.find((p) => p.name === name)?.mark;
  return { ...named(name), ...(mark && { mark }), points: seriesPoints(played.games, played.coachResult) };
}

/** Home while T1 v DK game 2 is live. */
export const HOME_LIVE: HomeLiveData = {
  ...SHARED,
  state: "live",
  deadline: deadline(POINTS_AT),
  series: { week: 3, rows: WEEK3_SERIES_AT_POINTS },
  following: following(false),
  managers: [
    { week: 3, soFar: false, facts: [fact("captained", "Chovy", 38)] },
    { week: 4, soFar: true, facts: [fact("bought", "Kiin", 36_750), fact("sold", "Zeka", 28_930)] },
  ],
  week: { week: 3, final: false, points: MY_WEEK3.liveTotal, average: POINTS_WEEK.average, highest: POINTS_WEEK.highest, starFlop: starFlopOf(2, WEEK2_FIELD) },
  live: { home: live.home, away: live.away, score: live.score, game: live.liveGame, bestOf: BEST_OF },
  streams: STREAMS,
  pickedStream: DEFAULT_STREAM,
  inSeries: POINTS_SQUAD.filter((p) => p.series.some((s) => s.id === LIVE_SERIES_ID)).map((p) => inLive(p.name)),
};

// Nothing live: Tuesday evening before Week 4's deadline (1440-idle.png).

/** A Week 4 team's opponents, in order. */
const opponentsOf = (team: string) => seriesOf(WEEK4_SERIES, team).map((s) => opponent(s, team));

/** Home with nothing live, Week 4 to come. */
export const HOME_IDLE: HomeIdleData = {
  ...SHARED,
  state: "idle",
  deadline: deadline(IDLE_AT),
  series: { week: 4, rows: WEEK4_SERIES },
  following: following(true),
  managers: [{ week: 4, soFar: true, facts: [fact("captained", "Faker", 34), fact("bought", "Kiin", 41_208), fact("sold", "Zeka", 31_412)] }],
  week: { week: 3, final: true, points: MY_WEEK3.finalTotal, ...WEEK3_FINAL, starFlop: starFlopOf(3, WEEK3_FIELD) },
  lineupWeek: 4,
  lineup: PICK_TEAM_SQUAD.flatMap((p) => {
    if (isBench(p.slot)) return [];
    const news = DOUBTS.find((d) => d.name === p.name)?.flag;
    const plays: RoleKey | undefined = flexPlays(p.slot, p.role);
    return [{ slot: p.slot, name: p.name, team: p.team, ...(plays && { plays }), ...(p.mark && { mark: p.mark }), ...(news && { news }), opponents: opponentsOf(p.team) }];
  }),
  bench: PICK_TEAM_SQUAD.filter((p) => isBench(p.slot)).map((p) => ({ role: p.role, name: p.name, team: p.team, opponents: opponentsOf(p.team) })),
};

/** Bench Boost played for Week 4, before the deadline (1440-boost.png). */
export const HOME_BOOST: HomeIdleData = { ...HOME_IDLE, deadline: deadline(IDLE_AT, buffOf(BENCH_BOOST)) };

/** Bench Boost on in the live week (1440-boost-live.png): its tag by the total, the bench's points in it. */
export const HOME_BOOST_LIVE: HomeLiveData = { ...HOME_LIVE, week: { ...HOME_LIVE.week, points: HOME_LIVE.week.points + BENCH_WEEK3, buff: BENCH_BOOST } };

/** Every state the pictures draw, by its dev name. */
export const HOME_STATES: Record<string, HomeData> = { idle: HOME_IDLE, boost: HOME_BOOST, "boost-live": HOME_BOOST_LIVE };
