// Home's made-up data: the approved picture's own Split 1 Week 3 (docs/design/approved/home/),
// built on the shared Week 3 (src/fixtures/week3.ts). Every name and number is an example.

import {
  BEST_OF,
  COMPETITION,
  countdown,
  finalPickOf,
  kdaText,
  LIVE_SERIES_ID,
  livePointsOf,
  MANAGER,
  MY_WEEK3,
  PERFECT_OTHERS,
  PICK_TEAM_SQUAD,
  POINTS_AT,
  POINTS_WEEK,
  rawWeekOf,
  startOf,
  statsOf,
  WEEK3_FINAL,
  WEEK3_SERIES_AT_POINTS,
  WEEK4_DEADLINE,
  WEEK4_FREE_TRANSFERS,
  WEEK4_SERIES,
  weekGamesOf,
  type Series,
} from "../../fixtures/week3";
import { FOLLOWED_WEEK3, MANAGERS } from "../../fixtures/managers";
import { MY_LEAGUES, MY_OVERALL } from "../../fixtures/myLeagues";
import { seriesById } from "../../fixtures/series";
import { DEFAULT_STREAM, STREAMS } from "../../fixtures/streams";
import { sum } from "../../parts";
import { flexPlays, isBench } from "../../rift";
import { starAndFlop, type WeekPlayer } from "./starFlop";
import type { HomeIdleData, HomeLiveData, HomeShared, LineupStarter, SidePlayer } from "./types";

const atPoints = (id: string) => seriesById(WEEK3_SERIES_AT_POINTS, id);
const matchup = (s: Series) => `${s.home} v ${s.away}`;

/** A followed manager's Week 3 series as Home's feed lists it. */
function followed(who: keyof typeof FOLLOWED_WEEK3) {
  const { seriesId, points } = FOLLOWED_WEEK3[who];
  return { id: `${who}-${seriesId}`, managerId: MANAGERS[who].id, manager: MANAGERS[who].first, series: matchup(atPoints(seriesId)), points };
}

const SHARED: Omit<HomeShared, "countdown"> = {
  team: MANAGER.team,
  hangul: MANAGER.hangul,
  overall: { tier: MY_OVERALL.tier, hangul: MY_OVERALL.hangul, rank: MY_OVERALL.rank, move: MY_OVERALL.move },
  deadline: { week: 4, competition: COMPETITION, local: WEEK4_DEADLINE.local, kst: WEEK4_DEADLINE.kst },
  freeTransfers: WEEK4_FREE_TRANSFERS,
  following: [
    { kind: "series", ...followed("minji") },
    { kind: "captain", ...followed("dan"), player: FOLLOWED_WEEK3.dan.captain },
    { kind: "series", ...followed("jae") },
    { kind: "received", cheer: "jeer", id: "jeer-minji-w3", line: "Sell your bot laner", from: MANAGERS.minji.first, week: 3 },
  ],
  leagues: MY_LEAGUES.map(({ id, name, kind, rank, move }) => ({ id, name, kind, rank, move })),
};

const live = atPoints(LIVE_SERIES_ID);
if (!live.score || live.liveGame === undefined) throw new Error(`${LIVE_SERIES_ID} is live at Points' moment, with its score and game`);

/** A player's K/D/A in the live game, as every page shows it (src/fixtures/games.ts). */
const LIVE_GAME = live.liveGame;
function liveKda(name: string) {
  const kda = weekGamesOf(name, LIVE_SERIES_ID)[LIVE_GAME - 1]?.kda;
  if (!kda) throw new Error(`${name} has no K/D/A in game ${LIVE_GAME} of ${LIVE_SERIES_ID}`);
  return kdaText(kda);
}

/** Home while T1 v DK game 2 is live (live.html). */
export const HOME_LIVE: HomeLiveData = {
  ...SHARED,
  state: "live",
  countdown: countdown(POINTS_AT, WEEK4_DEADLINE.at),
  series: { home: live.home, away: live.away, score: live.score, game: live.liveGame, bestOf: BEST_OF, label: `${COMPETITION} Week 3` },
  streams: STREAMS,
  pickedStream: DEFAULT_STREAM,
  week: { label: "Your week", final: false, points: MY_WEEK3.liveTotal, average: POINTS_WEEK.average, highest: POINTS_WEEK.highest },
  inSeries: [
    { role: "mid", name: "Faker", team: "T1", mark: "C", stat: liveKda("Faker"), points: livePointsOf("faker") },
    { role: "top", name: "Siwoo", team: "DK", stat: liveKda("Siwoo"), points: livePointsOf("siwoo") },
    { role: "coach", name: "kkOma", team: "T1", stat: "", points: livePointsOf("kkoma") },
  ],
  stillToPlay: [],
};

const lineup: LineupStarter[] = PICK_TEAM_SQUAD.flatMap((p) =>
  isBench(p.slot)
    ? []
    : [{ slot: p.slot, name: p.name, team: p.team, plays: flexPlays(p.slot, p.role), mark: p.mark }],
);

const next = seriesById(WEEK4_SERIES, "w4-wed-1");

/** The idle picture's own moment, by design not Points' or Pick Team's: Monday 11:00 London, Week 4 to come. */
const IDLE_AT = "2027-01-18T11:00:00Z";
const startsIn = countdown(IDLE_AT, startOf(next));

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

/** Week 3's players and coaches, final: role and team from Stats, points and effective ownership. */
export const WEEK3_FIELD: (SidePlayer & WeekPlayer)[] = Object.entries(WEEK3_EO).map(([name, eoPct]) => {
  const { role, team } = statsOf(name);
  return { role, name, team, points: week3PointsOf(name), eoPct };
});

const lastWeek = starAndFlop(WEEK3_FIELD);

/** Home with nothing live, Week 4 to come (idle.html). */
export const HOME_IDLE: HomeIdleData = {
  ...SHARED,
  state: "idle",
  countdown: countdown(IDLE_AT, WEEK4_DEADLINE.at),
  lineupWeek: 4,
  lineup,
  next: { home: next.home, away: next.away, day: next.day, local: next.local, kst: next.kst, startsIn: { days: startsIn.days, hours: startsIn.hours } },
  week: { label: "Week 3", final: true, points: MY_WEEK3.finalTotal, ...WEEK3_FINAL },
  stars: lastWeek.stars,
  flops: lastWeek.flops,
};
