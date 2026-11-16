// kkOma's card on the made-up LCK Cup (docs/design/approved/coach-card/coach.html), at the two
// moments the picture draws: from Pick Team (Week 4, Tuesday) and from Points (Week 3 Saturday,
// T1 v DK game 2 live). This week's series and points come from the shared Week 3 (week3.ts).
import { hangulOf, ROSTERS, T1_PRICES_EOK } from "../../fixtures/rosters";
import { fromSide, seriesById } from "../../fixtures/series";
import { KKOMA_OWNED_PCT, KKOMA_SEASON, last3, playedBy, T1_FIXTURES, T1_NEXT3 } from "../../fixtures/t1Season";
import { BEST_OF, pickedAt, POINTS_SQUAD, statsOf, WEEK3_SERIES_AT_POINTS } from "../../fixtures/week3";
import { bestOf, type StripNext, type StripPast } from "../../parts";
import type { RoleKey } from "../../rift";
import type { CoachCardData, CoachWeek, FixtureRow, RosterRow, SeasonLine, WeekGame, WeekSeries } from "./types";

const HEAD = { team: "T1", name: "kkOma", hangul: hangulOf("kkOma"), legal: "Kim Jeong-gyun" } as const;

/** T1's player in roster place `i`, name and price from the shared roster, with the card's own season figures. */
function t1Player(role: RoleKey, i: number, figures: Pick<RosterRow, "points" | "ownedPct" | "mine">): RosterRow {
  const name = ROSTERS.T1[i]?.[0];
  const priceEok = T1_PRICES_EOK[i];
  if (name === undefined || priceEok === undefined) throw new Error(`T1 has no rostered player ${i}`);
  return { role, name, priceEok, ...figures };
}

/** The series line's points (spec/05), held per competition. */
const SERIES_WON = 3;
const SERIES_LOST = -1;
const FORMAT = bestOf(BEST_OF);

const NEXT: StripNext[] = T1_NEXT3.map(({ week, day, opponent, bestOf }) => ({ week, day, opponent, bestOf }));

/** His last three series before Week 4, oldest first. */
const PAST: StripPast[] = last3(KKOMA_SEASON).map(({ week, day, opponent, points }) => ({ week, day, opponent, points }));

/** T1's next series, as the player card's Fixtures draws them. */
const FIXTURES: FixtureRow[] = T1_FIXTURES.map(({ week, day, opponent, local, kst }) => ({ week, day, opponent, format: FORMAT, local, kst }));

/** His price in m in each of T1's series, in T1_PLAYED's order (newest first). */
const HISTORY_PRICES = [7.0, 7.0, 6.5, 6.5, 6.5, 6.5];

const AT_PICK_TEAM = pickedAt(HEAD.name);

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
  const s = seriesById(WEEK3_SERIES_AT_POINTS, id);
  const side = fromSide(s, HEAD.team);
  if (!side.score) throw new Error(`Week 3 has no series ${id} with a score`);
  const live = s.state === "live";
  return {
    id,
    day: s.day,
    opponent: side.opponent,
    score: side.score,
    state: live ? "live" : "final",
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
  meta: {
    priceEok: AT_PICK_TEAM.priceEok,
    moveEok: KKOMA_SEASON.riseEok,
    form: AT_PICK_TEAM.form,
    formRank: 1,
    ownedPct: KKOMA_OWNED_PCT,
    ownedRank: 2,
    transfersIn: 310,
    transfersOut: 95,
  },
  season: {
    points: statsOf(HEAD.name).points,
    rank: KKOMA_SEASON.place,
    of: KKOMA_SEASON.of,
    games: KKOMA_SEASON.games,
    lines: KKOMA_SEASON.lines.map(({ line, total, points, series }) => ({ name: line, total, points, series: series ?? false })),
  },
  past: PAST,
  next: NEXT,
  fixtures: FIXTURES,
  history: {
    competition: "LCK Cup 2027",
    rows: playedBy(KKOMA_SEASON).map(({ week, day, opponent, score, games, points, id }, i) => {
      const priceEok = HISTORY_PRICES[i];
      if (priceEok === undefined) throw new Error(`${HEAD.name} has no price for ${id}`);
      return { week, day, opponent, score, games, priceEok, points };
    }),
    past: [
      { season: "LCK 2026", games: 98, points: 284 },
      { season: "LCK 2025", games: 104, points: 322 },
    ],
  },
  roster: [
    t1Player("top", 0, { points: 38, ownedPct: 12 }),
    t1Player("jng", 1, { points: 44, ownedPct: 21 }),
    t1Player("mid", 2, { points: 58, ownedPct: 46, mine: true }),
    t1Player("bot", 3, { points: 47, ownedPct: 30 }),
    t1Player("sup", 4, { points: 41, ownedPct: 25 }),
  ],
};

/** Opened from Points: Week 3 Saturday, T1 v DK game 2 live. This week is the drawn tab. */
export const FROM_POINTS: CoachCardData = {
  head: HEAD,
  meta: { priceEok: 7.0, moveEok: 0.5, form: 5.5, formRank: 2, ownedPct: KKOMA_OWNED_PCT, ownedRank: 2, transfersIn: 204, transfersOut: 58 },
  season: {
    points: 11,
    rank: 3,
    of: 10,
    games: 10,
    lines: lines([[3, 1], [2, 1], [1, 1], [0, 0], [0, 0], [3, 9], [1, -1]]),
  },
  past: [...PAST.slice(0, 2), { week: 3, day: "Sat", opponent: "DK", points: 2, live: true }],
  next: NEXT,
  fixtures: FIXTURES,
  week: WEEK3,
};
