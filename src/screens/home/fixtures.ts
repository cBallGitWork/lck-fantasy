// Home's made-up data: the approved picture's own LCK Cup Week 3 (docs/design/approved/home/),
// built on the shared Week 3 (src/fixtures/week3.ts). Every name and number is an example.

import {
  BEST_OF,
  COMPETITION,
  countdown,
  finalPickOf,
  LIVE_SERIES_ID,
  livePointsOf,
  MANAGER,
  MY_WEEK3,
  PICK_TEAM_SQUAD,
  POINTS_AT,
  POINTS_WEEK,
  rawWeekOf,
  startOf,
  WEEK3_FINAL,
  WEEK3_SERIES_AT_POINTS,
  WEEK4_DEADLINE,
  WEEK4_FREE_TRANSFERS,
  WEEK4_SERIES,
  type Series,
} from "../../fixtures/week3";
import { MANAGERS } from "../../fixtures/managers";
import { MY_LEAGUES, MY_OVERALL } from "../../fixtures/myLeagues";
import { seriesById } from "../../fixtures/series";
import { flexPlays, isBench } from "../../rift";
import type { HomeIdleData, HomeLiveData, HomeShared, LineupStarter } from "./types";

const atPoints = (id: string) => seriesById(WEEK3_SERIES_AT_POINTS, id);
const matchup = (s: Series) => `${s.home} v ${s.away}`;

const SHARED: Omit<HomeShared, "countdown"> = {
  team: MANAGER.team,
  hangul: MANAGER.hangul,
  overall: { tier: MY_OVERALL.tier, hangul: MY_OVERALL.hangul, rank: MY_OVERALL.rank, move: MY_OVERALL.move },
  deadline: { week: 4, competition: COMPETITION, local: WEEK4_DEADLINE.local, kst: WEEK4_DEADLINE.kst },
  freeTransfers: WEEK4_FREE_TRANSFERS,
  following: [
    { kind: "series", id: "minji-w3-sat-1", manager: MANAGERS.minji.first, series: matchup(atPoints("w3-sat-1")), points: 20 },
    { kind: "carry", id: "dan-w3-wed-1", manager: MANAGERS.dan.first, player: "Faker", series: matchup(atPoints("w3-wed-1")), points: 34 },
    { kind: "series", id: "jae-w3-fri-2", manager: MANAGERS.jae.first, series: matchup(atPoints("w3-fri-2")), points: 9 },
    { kind: "truck", id: "truck-minji-w3", line: "Sell your bot laner", from: MANAGERS.minji.first, week: 3 },
  ],
  leagues: MY_LEAGUES.map(({ id, name, kind, rank, move }) => ({ id, name, kind, rank, move })),
};

const live = atPoints(LIVE_SERIES_ID);
if (!live.score || live.liveGame === undefined) throw new Error(`${LIVE_SERIES_ID} is live at Points' moment, with its score and game`);

/** Home while T1 v DK game 2 is live (live.html). */
export const HOME_LIVE: HomeLiveData = {
  ...SHARED,
  state: "live",
  countdown: countdown(POINTS_AT, WEEK4_DEADLINE.at),
  series: { home: live.home, away: live.away, score: live.score, game: live.liveGame, bestOf: BEST_OF, label: `${COMPETITION} Week 3` },
  streams: [
    { id: "lck-en-twitch", name: "LCK · English", platform: "Twitch", live: true },
    { id: "lck-en-youtube", name: "LCK · English", platform: "YouTube", live: true },
    { id: "lck-ko-youtube", name: "LCK · 한국어", platform: "YouTube", live: true },
    { id: "caedrel-twitch", name: "Caedrel · English", platform: "Twitch", live: true },
    { id: "kameto-twitch", name: "Kameto · Français", platform: "Twitch", live: false },
    { id: "lck-ja-youtube", name: "LCK · 日本語", platform: "YouTube", live: true },
  ],
  pickedStream: "lck-en-twitch",
  week: { label: "Your week", final: false, points: MY_WEEK3.liveTotal, average: POINTS_WEEK.average, highest: POINTS_WEEK.highest },
  inSeries: [
    { role: "mid", name: "Faker", team: "T1", mark: "C", stat: "3/0/2", points: livePointsOf("faker") },
    { role: "top", name: "Siwoo", team: "DK", stat: "0/1/1", points: livePointsOf("siwoo") },
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

/** A squad member's final Week 3, before the Carry's ×1.5, as star and flop show it. */
const week3Of = (name: string) => rawWeekOf(finalPickOf(name));

/** Home with nothing live, Week 4 to come (idle.html). */
export const HOME_IDLE: HomeIdleData = {
  ...SHARED,
  state: "idle",
  countdown: countdown(IDLE_AT, WEEK4_DEADLINE.at),
  lineupWeek: 4,
  lineup,
  next: { home: next.home, away: next.away, day: next.day, local: next.local, kst: next.kst, startsIn: { days: startsIn.days, hours: startsIn.hours } },
  week: { label: "Week 3", final: true, points: MY_WEEK3.finalTotal, ...WEEK3_FINAL },
  star: { role: "mid", name: "Faker", team: "T1", points: week3Of("Faker") },
  flop: { role: "sup", name: "Delight", team: "HLE", points: week3Of("Delight") },
};
