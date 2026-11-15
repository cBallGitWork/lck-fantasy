// Home's made-up data: the approved picture's own LCK Cup Week 3 (docs/design/approved/home/),
// built on the shared Week 3 (src/fixtures/week3.ts). Every name and number is an example.

import {
  BEST_OF,
  COMPETITION,
  MANAGER,
  PICK_TEAM_SQUAD,
  POINTS_WEEK,
  WEEK3_SERIES_AT_POINTS,
  WEEK4_DEADLINE,
  WEEK4_SERIES,
  type Series,
} from "../../fixtures/week3";
import { MANAGERS } from "../../fixtures/managers";
import { seriesById } from "../../fixtures/series";
import { isBench } from "../../rift";
import type { HomeIdleData, HomeLiveData, HomeShared, LineupStarter } from "./types";

const atPoints = (id: string) => seriesById(WEEK3_SERIES_AT_POINTS, id);
const matchup = (s: Series) => `${s.home} v ${s.away}`;

const SHARED: Omit<HomeShared, "countdown"> = {
  team: MANAGER.team,
  hangul: MANAGER.hangul,
  overall: { tier: "Emerald I", hangul: "에메랄드 1", division: "I", rank: 48211, move: 6904 },
  deadline: { week: 4, competition: COMPETITION, local: WEEK4_DEADLINE.local, kst: WEEK4_DEADLINE.kst },
  freeTransfers: 1,
  following: [
    { kind: "series", id: "minji-w3-sat-1", manager: MANAGERS.minji.first, series: matchup(atPoints("w3-sat-1")), points: 20 },
    { kind: "carry", id: "dan-w3-wed-1", manager: MANAGERS.dan.first, player: "Faker", series: matchup(atPoints("w3-wed-1")), points: 34 },
    { kind: "series", id: "jae-w3-fri-2", manager: MANAGERS.jae.first, series: matchup(atPoints("w3-fri-2")), points: 9 },
    { kind: "truck", id: "truck-minji-w3", line: "Sell your bot laner", from: MANAGERS.minji.first, week: 3 },
  ],
  leagues: [
    { id: "uk", name: "United Kingdom", kind: "country", rank: 1402, move: 233 },
    { id: "t1", name: "T1 supporters", kind: "team", rank: 3118, move: 510 },
    { id: "pub-league", name: "Pub League", kind: "private", rank: 2, move: 1 },
    { id: "flol-discord", name: "Flol Discord", kind: "private", rank: 14, move: -2 },
  ],
};

const live = atPoints("w3-sat-2");
if (!live.score || live.liveGame === undefined) throw new Error("w3-sat-2 is live at Points' moment, with its score and game");

/** Home while T1 v DK game 2 is live (live.html). */
export const HOME_LIVE: HomeLiveData = {
  ...SHARED,
  state: "live",
  countdown: { days: 3, hours: 20, minutes: 15 },
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
  week: { label: "Your week", final: false, points: 94, average: POINTS_WEEK.average, highest: POINTS_WEEK.highest },
  inSeries: [
    { role: "mid", name: "Faker", team: "T1", mark: "C", stat: "G2 · 3/0/2", points: 25 },
    { role: "top", name: "Siwoo", team: "DK", stat: "G2 · 0/1/1", points: 8 },
    { role: "coach", name: "kkOma", team: "T1", stat: "G2", points: 10 },
  ],
  stillToPlay: [],
};

const lineup: LineupStarter[] = PICK_TEAM_SQUAD.flatMap((p) =>
  isBench(p.slot)
    ? []
    : [{ slot: p.slot, name: p.name, team: p.team, plays: p.slot === "flex" && p.role !== "coach" ? p.role : undefined, mark: p.mark }],
);

const next = seriesById(WEEK4_SERIES, "w4-wed-1");

/** Home with nothing live, Week 4 to come (idle.html). */
export const HOME_IDLE: HomeIdleData = {
  ...SHARED,
  state: "idle",
  countdown: { days: 1, hours: 20, minutes: 45 },
  lineupWeek: 4,
  lineup,
  next: { home: next.home, away: next.away, day: next.day, local: next.local, kst: next.kst, startsIn: { days: 1, hours: 21 } },
  week: { label: "Week 3", final: true, points: 109, average: 79, highest: 136 },
  star: { role: "mid", name: "Faker", team: "T1", points: 22 },
  flop: { role: "sup", name: "Delight", team: "HLE", points: 9 },
};
