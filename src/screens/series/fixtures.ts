// The Series picture's own made-up data (docs/design/approved/series/series.html), built on the
// shared Split 1 Week 3. Points, best 2 and coach lines are the picture's figures as drawn, save
// Baron Steal FC's players', whose games are the shared ones: the backend scores them (#30, #34).

import { BEST_OF, COMPETITION, countedGames, kdaText, LINE, LIVE_SERIES_ID, MY_PLAYERS, playedIn, playerId, seriesPoints, TEAMS, WEEK3_SERIES_FINAL, WEEK4_SERIES, weekGamesOf, type Series, type TeamCode } from "../../fixtures/week3";
import { ROSTERS, hangulOf } from "../../fixtures/rosters";
import { seriesById } from "../../fixtures/series";
import { recordOf } from "../../fixtures/standings";
import { bestOf } from "../../parts";
import { ROLE_KEYS, type RoleKey } from "../../rift";
import type { CoachCell, GameCell, NextSeries, PlayedSeries, PlayerLine, Roster, SeriesView, SeriesWhen } from "./types";

const FORMAT = bestOf(BEST_OF);
/** Where VOD links go until #36 fetches each game's own (spec/12). */
const VOD = "https://lolesports.com/vods";

const person = (name: string, hangul = hangulOf(name)) => ({ id: playerId(name), name, hangul, mine: MY_PLAYERS.has(name) || undefined });

const side = (code: TeamCode, record: string) => ({ code, name: TEAMS[code], record });

function when(list: Series[], id: string, week: number): SeriesWhen {
  const s = seriesById(list, id);
  return { format: FORMAT, competition: COMPETITION, week, day: s.day, date: s.date, local: s.local, kst: s.kst };
}

/** A game: champion, K/D/A, points; dropped from the best 2 when `counts` is false. */
const g = (champion: string, kda: string, points: number, counts = true, pog?: true): GameCell => ({ champion, kda, points, counts, pog });

const c = (lines: string[], points: number, counts = true): CoachCell => ({ lines, points, counts });

/** A player's line; a sub off every roster brings his own hangul. */
const player = (role: RoleKey, name: string, games: (GameCell | null)[], total: number, sub?: true, hangul?: string): PlayerLine => ({
  ...person(name, hangul),
  role,
  games,
  total,
  sub,
});

/**
 * A Baron Steal FC player's line: his games as every page shows them (src/fixtures/games.ts), the
 * points his squad gives them, at Points' moment or once final. `pog` marks his player-of-the-game games.
 */
function squadLine(role: RoleKey, name: string, seriesId: string, final: boolean, pog: number[] = []): PlayerLine {
  const played = playedIn(name, seriesId, final);
  const counted = countedGames(played.games);
  const games = weekGamesOf(name, seriesId, final).map((d, i) => {
    if (!d.champion || !d.kda) throw new Error(`${name}'s game ${i + 1} in ${seriesId} has no champion or K/D/A`);
    return g(d.champion, kdaText(d.kda), played.games[i] ?? 0, counted.has(i), pog.includes(i) || undefined);
  });
  return player(role, name, games, seriesPoints(played.games));
}

/** A Baron Steal FC coach's games: his lines as every page shows them, the points his squad gives them. */
function squadCoachGames(name: string, seriesId: string, final: boolean): CoachCell[] {
  const played = playedIn(name, seriesId, final);
  const counted = countedGames(played.games);
  return weekGamesOf(name, seriesId, final).map((d, i) => c([...d.lines], played.games[i] ?? 0, counted.has(i)));
}

const { firstTower, drakes, baron } = LINE;
const TOWER_DRAKES_BARON = [firstTower, drakes, baron];

/** T1 v DK, Week 3, Saturday: T1 2–0, final, as the LCK hub's Results show it. */
const T1_DK_FINAL: PlayedSeries = {
  id: LIVE_SERIES_ID,
  when: when(WEEK3_SERIES_FINAL, LIVE_SERIES_ID, 3),
  games: [
    { winner: "T1", length: "31:42", vod: VOD },
    { winner: "T1", length: "27:10", vod: VOD },
  ],
  home: {
    ...side("T1", recordOf("T1")),
    players: [
      player("top", "Doran", [g("K'Sante", "2/1/7", 3), g("Rumble", "3/0/6", 4)], 7),
      player("jng", "Oner", [g("Viego", "3/2/9", 3), g("Xin Zhao", "2/2/8", 3)], 6),
      squadLine("mid", "Faker", LIVE_SERIES_ID, true, [0, 1]),
      player("bot", "Peyz", [g("Kalista", "6/1/5", 4), g("Varus", "5/0/7", 4)], 8),
      player("sup", "Keria", [g("Rell", "0/3/12", 2), g("Nautilus", "1/2/13", 3)], 5),
    ],
    coach: { ...person("kkOma"), games: squadCoachGames("kkOma", LIVE_SERIES_ID, true), total: 8, result: 3 },
  },
  away: {
    ...side("DK", recordOf("DK")),
    players: [
      squadLine("top", "Siwoo", LIVE_SERIES_ID, true),
      player("jng", "Lucid", [g("Sejuani", "1/3/4", -1), g("Maokai", "0/5/2", -1)], -2),
      player("mid", "ShowMaker", [g("Taliyah", "2/2/3", 0), g("Azir", "1/4/2", -1)], -1),
      player("bot", "Aiming", [g("Ezreal", "3/3/2", 0), g("Zeri", "2/4/1", -1)], -1),
      player("sup", "BeryL", [g("Braum", "0/5/5", 0), g("Alistar", "0/3/4", 0)], 0),
    ],
    coach: { ...person("cvMax"), games: [c([], 0), c([], 0)], total: -1, result: -1 },
  },
};

/** GEN v HLE, Week 3, Saturday: GEN 2–1, final. Zeka sat out game 3; Kael, a sub, played it. */
const GEN_HLE_FINAL: PlayedSeries = {
  id: "w3-sat-1",
  when: when(WEEK3_SERIES_FINAL, "w3-sat-1", 3),
  games: [
    { winner: "GEN", length: "29:05", vod: VOD },
    { winner: "HLE", length: "34:48", vod: VOD },
    { winner: "GEN", length: "26:31", vod: VOD },
  ],
  home: {
    ...side("GEN", recordOf("GEN")),
    players: [
      player("top", "Kiin", [g("Rumble", "3/1/5", 3), g("Jax", "0/4/2", -1, false), g("K'Sante", "2/2/7", 2)], 5),
      squadLine("jng", "Canyon", "w3-sat-1", true, [2]),
      player("mid", "Chovy", [g("Azir", "4/0/6", 4, true, true), g("Orianna", "1/4/3", -1, false), g("Sylas", "7/1/5", 4)], 8),
      squadLine("bot", "Ruler", "w3-sat-1", true),
      player("sup", "Duro", [g("Rell", "1/2/12", 2), g("Braum", "0/5/5", 0, false), g("Rakan", "1/2/15", 3)], 5),
    ],
    coach: { ...person("Ryu"), games: [c(TOWER_DRAKES_BARON, 3), c([], 0, false), c(TOWER_DRAKES_BARON, 3)], total: 9, result: 3 },
  },
  away: {
    ...side("HLE", recordOf("HLE")),
    players: [
      squadLine("top", "Zeus", "w3-sat-1", true, [1]),
      player("jng", "Kanavi", [g("Xin Zhao", "1/4/3", -1), g("Viego", "4/2/8", 3), g("Maokai", "1/6/3", -2, false)], 2),
      player("mid", "Zeka", [g("Taliyah", "2/3/2", -1), g("Ahri", "5/1/7", 3), null], 2),
      player("mid", "Kael", [null, null, g("Azir", "2/4/3", -1)], -1, true, "김태율"),
      player("bot", "Gumayusi", [g("Ezreal", "1/3/3", -1), g("Varus", "5/1/6", 3), g("Zeri", "2/4/2", -1, false)], 2),
      squadLine("sup", "Delight", "w3-sat-1", true),
    ],
    coach: { ...person("Homme"), games: [c([], 0, false), c(TOWER_DRAKES_BARON, 3), c([drakes], 1)], total: 3, result: -1 },
  },
};

/** T1 v DK at the Points picture's moment: T1 1–0, game 2 at 14:20. Records are before the series. */
const T1_DK_LIVE: PlayedSeries = {
  id: T1_DK_FINAL.id,
  when: T1_DK_FINAL.when,
  games: [T1_DK_FINAL.games[0]!, { clock: "14:20" }],
  home: {
    ...side("T1", "4–1"),
    players: [
      player("top", "Doran", [g("K'Sante", "2/1/7", 3), g("Rumble", "1/0/1", 0)], 3),
      player("jng", "Oner", [g("Viego", "3/2/9", 3), g("Xin Zhao", "1/0/2", 0)], 3),
      squadLine("mid", "Faker", LIVE_SERIES_ID, false, [0]),
      player("bot", "Peyz", [g("Kalista", "6/1/5", 4), g("Varus", "1/0/3", 0)], 4),
      player("sup", "Keria", [g("Rell", "0/3/12", 2), g("Nautilus", "0/1/4", 0)], 2),
    ],
    coach: { ...person("kkOma"), games: squadCoachGames("kkOma", LIVE_SERIES_ID, false), total: 2 },
  },
  away: {
    ...side("DK", "3–2"),
    players: [
      squadLine("top", "Siwoo", LIVE_SERIES_ID, false),
      player("jng", "Lucid", [g("Sejuani", "1/3/4", -1), g("Maokai", "0/2/1", 0)], -1),
      player("mid", "ShowMaker", [g("Taliyah", "2/2/3", 0), g("Azir", "0/2/1", 0)], 0),
      player("bot", "Aiming", [g("Ezreal", "3/3/2", 0), g("Zeri", "0/1/0", 0)], 0),
      player("sup", "BeryL", [g("Braum", "0/5/5", 0), g("Alistar", "0/1/2", 0)], 0),
    ],
    coach: { ...person("cvMax"), games: [c([], 0), c([], 0)], total: 0 },
  },
};

/** A team's roster before a series: its five in role order, then its coach, from the shared rosters. */
function roster(code: TeamCode, record: string): Roster {
  const people = ROSTERS[code].map(([name, hangul]) => person(name, hangul));
  const at = (i: number) => {
    const p = people[i];
    if (!p) throw new Error(`${code}'s roster has no place ${i}`);
    return p;
  };
  return { ...side(code, record), players: ROLE_KEYS.map((role, i) => ({ ...at(i), role })), coach: at(ROLE_KEYS.length) };
}

/** HLE v DK, Week 4, Wednesday, before it starts. */
const HLE_DK_NEXT: NextSeries = {
  id: "w4-wed-1",
  when: when(WEEK4_SERIES, "w4-wed-1", 4),
  home: roster("HLE", recordOf("HLE")),
  away: roster("DK", recordOf("DK")),
};

/** Each state the picture folder draws: `1440.png`, `1440-21.png`, `1440-live.png`, `1440-next.png`. */
export const SERIES_VIEWS = {
  final: { state: "final", series: T1_DK_FINAL },
  final21: { state: "final", series: GEN_HLE_FINAL },
  live: { state: "live", series: T1_DK_LIVE },
  next: { state: "next", series: HLE_DK_NEXT },
} as const satisfies Record<string, SeriesView>;

/** The series a link opens, at the LCK hub's moment (Week 4, Tuesday). None is live then, so the live view gets a link with the live feed (#34). */
export const SERIES_BY_ID: Record<string, SeriesView> = Object.fromEntries(
  [SERIES_VIEWS.final, SERIES_VIEWS.final21, SERIES_VIEWS.next].map((v) => [v.series.id, v]),
);
