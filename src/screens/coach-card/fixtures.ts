// kkOma's card on the made-up LCK Cup (docs/design/approved/coach-card/coach.html), at the two
// moments the picture draws: from Pick Team (Week 4, Tuesday) and from Points (Week 3 Saturday,
// T1 v DK game 2 live). This week's series and points come from the shared Week 3 (week3.ts).
import { POINTS_SQUAD, WEEK3_SERIES_AT_POINTS, WEEK4_SERIES, type TeamCode } from "../../fixtures/week3";
import type { CoachCardData, CoachWeek, FixtureRow, SeasonLine, StripNext, StripPast, WeekGame, WeekSeries } from "./types";

const HEAD = { team: "T1", name: "kkOma", hangul: "김정균", legal: "Kim Jeong-gyun" } as const;

/** The series line's points (spec/05), held per competition. */
const SERIES_WON = 3;
const SERIES_LOST = -1;

const NEXT: StripNext[] = [
  { week: 4, day: "Wed", opponent: "KT", format: "Bo3" },
  { week: 4, day: "Sat", opponent: "GEN", format: "Bo3" },
  { week: 5, day: "Thu", opponent: "BRO", format: "Bo3" },
];

const PAST_BEFORE_SAT: StripPast[] = [
  { week: 2, day: "Fri", opponent: "BFX", points: 4 },
  { week: 3, day: "Wed", opponent: "HLE", points: 8 },
];

/** T1's next series, as the player card's Fixtures draws them (Week 4's from week3.ts). */
const T1_WEEK4: FixtureRow[] = WEEK4_SERIES.filter((s) => s.home === "T1" || s.away === "T1").map((s) => ({
  week: 4,
  day: s.day,
  opponent: (s.home === "T1" ? s.away : s.home) as TeamCode,
  format: "Bo3",
  local: s.local,
  kst: s.kst,
}));
const LATER: FixtureRow[] = [
  { week: 5, day: "Thu", opponent: "BRO", format: "Bo3", local: "08:00", kst: "17:00" },
  { week: 5, day: "Sun", opponent: "KRX", format: "Bo3", local: "10:30", kst: "19:30" },
  { week: 6, day: "Wed", opponent: "DK", format: "Bo3", local: "08:00", kst: "17:00" },
  { week: 6, day: "Sat", opponent: "HLE", format: "Bo3", local: "10:30", kst: "19:30" },
];
const FIXTURES = [...T1_WEEK4, ...LATER];

/** Each game's result and the coach lines it scored, beside its points from week3.ts. */
const GAME_LINES: Record<string, Pick<WeekGame, "result" | "lines">[]> = {
  "w3-wed-1": [
    { result: "W", lines: ["First tower", "Most drakes"] },
    { result: "L", lines: [] },
    { result: "W", lines: ["First tower", "Most drakes", "Most barons"] },
  ],
  "w3-sat-2": [{ result: "W", lines: ["First tower", "Most drakes"] }, { lines: [] }],
};
/** The best 2 games count (spec/05); the live game counts until it is played. */
const COUNTED: Record<string, boolean[]> = { "w3-wed-1": [true, false, true], "w3-sat-2": [true, true] };

const COACH = POINTS_SQUAD.find((p) => p.slot === "coach");
if (!COACH?.series) throw new Error("Week 3's Points squad has no coach with series");

function weekSeries(id: string, games: number[], coachResult?: number): WeekSeries {
  const s = WEEK3_SERIES_AT_POINTS.find((x) => x.id === id);
  if (!s?.score) throw new Error(`Week 3 has no series ${id} with a score`);
  const home = s.home === HEAD.team;
  const live = s.state === "live";
  return {
    id,
    day: s.day,
    opponent: home ? s.away : s.home,
    score: home ? s.score : [s.score[1], s.score[0]],
    state: live ? "live" : "final",
    liveGame: s.liveGame,
    games: games.map((points, i) => ({
      result: GAME_LINES[id]?.[i]?.result,
      lines: GAME_LINES[id]?.[i]?.lines ?? [],
      points,
      counts: COUNTED[id]?.[i] ?? false,
      clock: live && i + 1 === s.liveGame ? s.clock : undefined,
    })),
    points: games.filter((_, i) => COUNTED[id]?.[i]).reduce((a, b) => a + b, 0) + (coachResult ?? 0),
  };
}

const WEEK3_COACH_SERIES = COACH.series.map((s) => weekSeries(s.id, s.games, s.coachResult));
const WEEK3: CoachWeek = {
  week: 3,
  series: WEEK3_COACH_SERIES,
  total: WEEK3_COACH_SERIES.reduce((sum, s) => sum + s.points, 0),
  seriesWon: SERIES_WON,
  seriesLost: SERIES_LOST,
};

const lines = (counts: [number, number][]): SeasonLine[] =>
  ["First tower", "Most drakes", "Most barons", "Most elders", "Quick win", "Series won", "Series lost"].map((name, i) => ({
    name,
    total: counts[i]?.[0] ?? 0,
    points: counts[i]?.[1] ?? 0,
    series: name.startsWith("Series"),
  }));

/** Opened from Pick Team: Week 4, Tuesday, before the deadline. History is the drawn tab. */
export const FROM_PICK_TEAM: CoachCardData = {
  head: HEAD,
  meta: { priceEok: 7.0, moveEok: 0.5, form: 9.0, formRank: 1, ownedPct: 22, ownedRank: 2, transfersIn: 310, transfersOut: 95 },
  season: {
    points: 27,
    rank: 1,
    of: 10,
    games: 15,
    lines: lines([[8, 6], [7, 5], [3, 2], [1, 0], [0, 0], [5, 15], [1, -1]]),
  },
  past: [...PAST_BEFORE_SAT, { week: 3, day: "Sat", opponent: "DK", points: 8 }],
  next: NEXT,
  fixtures: FIXTURES,
  history: {
    competition: "LCK Cup 2027",
    rows: [
      { week: 3, day: "Sat", opponent: "DK", score: [2, 0], games: 2, priceEok: 7.0, points: 8 },
      { week: 3, day: "Wed", opponent: "HLE", score: [2, 1], games: 3, priceEok: 7.0, points: 8 },
      { week: 2, day: "Fri", opponent: "BFX", score: [2, 1], games: 3, priceEok: 6.5, points: 4 },
      { week: 2, day: "Wed", opponent: "DNS", score: [2, 0], games: 2, priceEok: 6.5, points: 4 },
      { week: 1, day: "Sat", opponent: "NS", score: [2, 0], games: 2, priceEok: 6.5, points: 3 },
      { week: 1, day: "Wed", opponent: "GEN", score: [1, 2], games: 3, priceEok: 6.5, points: 0 },
    ],
    past: [
      { season: "LCK 2026", games: 98, points: 284 },
      { season: "LCK 2025", games: 104, points: 322 },
    ],
  },
  roster: [
    { role: "top", name: "Doran", priceEok: 12.5, points: 38, ownedPct: 12 },
    { role: "jng", name: "Oner", priceEok: 14.0, points: 44, ownedPct: 21 },
    { role: "mid", name: "Faker", priceEok: 18.5, points: 58, ownedPct: 46, mine: true },
    { role: "bot", name: "Peyz", priceEok: 15.0, points: 47, ownedPct: 30 },
    { role: "sup", name: "Keria", priceEok: 14.5, points: 41, ownedPct: 25 },
  ],
};

/** Opened from Points: Week 3 Saturday, T1 v DK game 2 live. This week is the drawn tab. */
export const FROM_POINTS: CoachCardData = {
  head: HEAD,
  meta: { priceEok: 7.0, moveEok: 0.5, form: 5.5, formRank: 2, ownedPct: 22, ownedRank: 2, transfersIn: 204, transfersOut: 58 },
  season: {
    points: 11,
    rank: 3,
    of: 10,
    games: 10,
    lines: lines([[3, 1], [2, 1], [1, 1], [0, 0], [0, 0], [3, 9], [1, -1]]),
  },
  past: [...PAST_BEFORE_SAT, { week: 3, day: "Sat", opponent: "DK", points: 2, live: true }],
  next: NEXT,
  fixtures: FIXTURES,
  week: WEEK3,
};
