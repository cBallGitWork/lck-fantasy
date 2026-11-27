// @vitest-environment node
import { expect, test } from "vitest";
import { MY_SEASON_TOTAL } from "../../fixtures/myLeagues";
import { LINE, LIVE_SERIES_ID, MY_EARLIER_WEEKS, WEEK3_FINAL_SQUAD, weekGamesOf, type Kda, type LineWord } from "../../fixtures/week3";
import { POINTS_FIXTURE, POINTS_WEEKS } from "./fixtures";
import type { PointsPlayer } from "./types";

// Points' made-up weeks add up: the season's total, and each game's points as spec/05 scores them.

const week = (n: number) => {
  const data = POINTS_WEEKS.get(n);
  if (!data) throw new Error(`No Week ${n}`);
  return data;
};

test("Leagues' season total is Points' weeks: Weeks 1 and 2 final, and Week 3 so far", () => {
  expect(MY_EARLIER_WEEKS).toEqual([week(1).total, week(2).total]);
  expect(MY_SEASON_TOTAL).toBe(week(1).total + week(2).total + POINTS_FIXTURE.total);
});

/** spec/05's player table, per game: kills per 2 for tops and supports, else per 3; assists per 5; deaths per 3, per 4 for supports. */
function playerGame(role: string, [k, d, a]: Kda, lines: readonly LineWord[], live: boolean) {
  const kills = Math.min(3, Math.floor(k / (role === "top" || role === "sup" ? 2 : 3)));
  const assists = Math.min(3, Math.floor(a / 5));
  const deaths = Math.min(3, Math.floor(d / (role === "sup" ? 4 : 3)));
  // Deathless only once a game is over and he never died.
  expect(lines.includes(LINE.deathless), `Deathless at ${k}/${d}/${a}`).toBe(d === 0 && !live);
  return kills + assists - deaths + lines.length;
}

test("each Week 3 game's points are what spec/05 gives its K/D/A and lines; a coach's, his lines", () => {
  const squad: (PointsPlayer & { plays?: string })[] = [...POINTS_FIXTURE.starters, ...POINTS_FIXTURE.bench];
  for (const p of squad) {
    for (const s of p.series) {
      for (const g of s.games) {
        const live = g.clock !== undefined;
        const worked = g.kda ? playerGame(p.plays ?? p.role, g.kda, g.lines, live) : g.lines.length;
        expect(worked, `${p.name} v ${s.opponent} G${g.game}`).toBe(g.points);
        if (p.role !== "coach") expect(g.kda, `${p.name}'s K/D/A`).toBeDefined();
      }
    }
  }
});

test("T1 v DK's finished games score what Week 3's final squad gives them", () => {
  for (const pick of WEEK3_FINAL_SQUAD.filter((p) => p.series.some((s) => s.id === LIVE_SERIES_ID))) {
    const final = pick.series.find((s) => s.id === LIVE_SERIES_ID)!;
    const worked = weekGamesOf(pick.name, LIVE_SERIES_ID, true).map((g) => (g.kda ? playerGame(pick.role, g.kda, g.lines, false) : g.lines.length));
    expect(worked, pick.name).toEqual(final.games);
  }
});
