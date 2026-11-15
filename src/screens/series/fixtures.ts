// The Series picture's own made-up data (docs/design/approved/series/series.html), built on the
// shared LCK Cup Week 3. Points, best 2 and coach lines are the picture's figures as drawn, not
// worked out here: the backend scores them (#30, #34).

import { BEST_OF, COMPETITION, MY_PLAYERS, playerId, TEAMS, WEEK3_SERIES_FINAL, WEEK4_SERIES, type Series, type TeamCode } from "../../fixtures/week3";
import { ROSTERS, hangulOf } from "../../fixtures/rosters";
import { seriesById } from "../../fixtures/series";
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

const TOWER_DRAKES = ["1st tower", "Drakes"];
const TOWER_DRAKES_BARON = ["1st tower", "Drakes", "Baron"];

/** T1 v DK, Week 3, Saturday: T1 2–0, final, as the LCK hub's Results show it. */
const T1_DK_FINAL: PlayedSeries = {
  id: "w3-sat-2",
  when: when(WEEK3_SERIES_FINAL, "w3-sat-2", 3),
  games: [
    { winner: "T1", length: "31:42", vod: VOD },
    { winner: "T1", length: "27:10", vod: VOD },
  ],
  home: {
    ...side("T1", "5–1"),
    players: [
      player("top", "Doran", [g("K'Sante", "2/1/7", 3), g("Rumble", "3/0/6", 4)], 7),
      player("jng", "Oner", [g("Viego", "3/2/9", 3), g("Xin Zhao", "2/2/8", 3)], 6),
      player("mid", "Faker", [g("Orianna", "5/1/9", 4, true, true), g("Sylas", "7/0/6", 6, true, true)], 10),
      player("bot", "Peyz", [g("Kalista", "6/1/5", 4), g("Varus", "5/0/7", 4)], 8),
      player("sup", "Keria", [g("Rell", "0/3/12", 2), g("Nautilus", "1/2/13", 3)], 5),
    ],
    coach: { ...person("kkOma"), games: [c(TOWER_DRAKES, 2), c(TOWER_DRAKES_BARON, 3)], total: 8, result: 3 },
  },
  away: {
    ...side("DK", "3–3"),
    players: [
      player("top", "Siwoo", [g("Jax", "2/3/2", 2), g("Gnar", "1/2/3", 2)], 4),
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
    ...side("GEN", "5–1"),
    players: [
      player("top", "Kiin", [g("Rumble", "3/1/5", 3), g("Jax", "0/4/2", -1, false), g("K'Sante", "2/2/7", 2)], 5),
      player("jng", "Canyon", [g("Vi", "2/2/9", 2, false), g("Lee Sin", "3/3/3", 3), g("Xin Zhao", "4/1/10", 4, true, true)], 7),
      player("mid", "Chovy", [g("Azir", "4/0/6", 4, true, true), g("Orianna", "1/4/3", -1, false), g("Sylas", "7/1/5", 4)], 8),
      player("bot", "Ruler", [g("Kai'Sa", "6/1/4", 3), g("Jinx", "3/2/2", 1, false), g("Kalista", "7/1/5", 4)], 7),
      player("sup", "Duro", [g("Rell", "1/2/12", 2), g("Braum", "0/5/5", 0, false), g("Rakan", "1/2/15", 3)], 5),
    ],
    coach: { ...person("Ryu"), games: [c(TOWER_DRAKES_BARON, 3), c([], 0, false), c(TOWER_DRAKES_BARON, 3)], total: 9, result: 3 },
  },
  away: {
    ...side("HLE", "4–2"),
    players: [
      player("top", "Zeus", [g("Gnar", "2/3/2", 2), g("K'Sante", "4/1/6", 5, true, true), g("Renekton", "2/4/2", 0, false)], 7),
      player("jng", "Kanavi", [g("Xin Zhao", "1/4/3", -1), g("Viego", "4/2/8", 3), g("Maokai", "1/6/3", -2, false)], 2),
      player("mid", "Zeka", [g("Taliyah", "2/3/2", -1), g("Ahri", "5/1/7", 3), null], 2),
      player("mid", "Kael", [null, null, g("Azir", "2/4/3", -1)], -1, true, "김태율"),
      player("bot", "Gumayusi", [g("Ezreal", "1/3/3", -1), g("Varus", "5/1/6", 3), g("Zeri", "2/4/2", -1, false)], 2),
      player("sup", "Delight", [g("Nautilus", "0/3/5", 1, false), g("Alistar", "0/2/14", 2), g("Leona", "0/3/10", 2)], 4),
    ],
    coach: { ...person("Homme"), games: [c([], 0, false), c(TOWER_DRAKES_BARON, 3), c(["Drakes"], 1)], total: 3, result: -1 },
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
      player("mid", "Faker", [g("Orianna", "5/1/9", 4, true, true), g("Sylas", "3/0/2", 1)], 5),
      player("bot", "Peyz", [g("Kalista", "6/1/5", 4), g("Varus", "1/0/3", 0)], 4),
      player("sup", "Keria", [g("Rell", "0/3/12", 2), g("Nautilus", "0/1/4", 0)], 2),
    ],
    coach: { ...person("kkOma"), games: [c(TOWER_DRAKES, 2), c([], 0)], total: 2 },
  },
  away: {
    ...side("DK", "3–2"),
    players: [
      player("top", "Siwoo", [g("Jax", "2/3/2", 2), g("Gnar", "1/0/1", 1)], 3),
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
  home: roster("HLE", "4–2"),
  away: roster("DK", "3–3"),
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
