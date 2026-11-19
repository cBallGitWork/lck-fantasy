// The price formula over the LCK's 2026 (#23): first prices from 2026's series, held against Craig's
// squads (spec/02, First prices), then 2026 replayed week by week through the deadline's move. Scored
// with the game's own code on data/lck/2026's Oracle's Elixir rows; solo kills and steals score 0
// there, as the rows don't hold them.
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { oeGames, oeSeriesGame, parseOeCsv } from "../convex/feeds/oraclesElixir";
import { scoreCoachGame, scorePlayerGame, total } from "../convex/scoring/game";
import { coachSeriesPoints, playerSeriesPoints } from "../convex/scoring/series";
import { SPEC_COACH_TABLE, SPEC_PLAYER_TABLE, SPEC_SERIES_RULES } from "../convex/scoring/fixtures";
import { PRICE_SETTINGS } from "../convex/squads/fixtures";
import { firstPrices, nextPrices, type FirstPriceInput } from "../convex/squads/prices";
import { PLAYER_ROLES, type Role } from "../convex/squads/squad";
import { teamGameStats } from "../convex/stats/gameStats";
import { groupSeries } from "../convex/world/series";
import { WON_PER_M } from "../src/parts/text/money";
import { sum } from "../src/parts/util/sum";

const S = PRICE_SETTINGS;
const m = (x: number) => x * WON_PER_M;
const BUDGET = m(100);
/** spec/02, The formula, 8: Craig's hand prices for the backtest. */
const BY_HAND: Record<string, number> = { Chovy: m(23), Faker: m(15) };
const MS_PER_WEEK = 7 * 86_400_000;

interface Pick { key: string; name: string; role: Role; teamId: string }
interface SeriesScore { key: string; endedAt: number; points: number }

function season2026() {
  const rows = parseOeCsv(readFileSync(new URL("../data/lck/2026/oe-2026-lck.csv", import.meta.url), "utf8"));
  const games = oeGames(rows, "LCK").filter((g) => g.complete);
  const picks = new Map<string, Pick>();
  const scores: SeriesScore[] = [];
  const record = new Map<string, { won: number; played: number }>();
  for (const series of groupSeries(games.map(oeSeriesGame)).series) {
    const perPick = new Map<string, number[]>();
    const add = (key: string, points: number) => perPick.set(key, [...(perPick.get(key) ?? []), points]);
    for (const game of series.games) {
      for (const p of game.players) {
        const key = `player:${p.playerId}`;
        picks.set(key, { key, name: p.playerName, role: p.role, teamId: p.teamId });
        const stats = { role: p.role, kills: p.kills, deaths: p.deaths, assists: p.assists, goldDiffAt15: p.goldDiffAt15, soloKills: 0, firstBlood: p.firstBloodKill, biggestMultikill: p.biggestMultikill, steals: 0 };
        add(key, total(scorePlayerGame(stats, SPEC_PLAYER_TABLE)));
      }
      for (const team of game.teams) {
        const key = `coach:${team.teamId}`;
        picks.set(key, { key, name: team.teamName, role: "coach", teamId: team.teamId });
        add(key, total(scoreCoachGame(teamGameStats(game, team.teamId), SPEC_COACH_TABLE)));
      }
    }
    const winner = series.score[0]! > series.score[1]! ? series.teamIds[0] : series.teamIds[1];
    for (const teamId of series.teamIds) {
      const r = record.get(teamId) ?? { won: 0, played: 0 };
      record.set(teamId, { won: r.won + (teamId === winner ? 1 : 0), played: r.played + 1 });
    }
    for (const [key, points] of perPick) {
      const isCoach = key.startsWith("coach:");
      scores.push({ key, endedAt: series.endedAt, points: isCoach ? coachSeriesPoints(points, key === `coach:${winner}`, SPEC_SERIES_RULES) : playerSeriesPoints(points, SPEC_SERIES_RULES) });
    }
  }
  return { picks: [...picks.values()], scores, teamShares: new Map([...record].map(([id, r]) => [id, [r.won / r.played]])) };
}

const SEASON = season2026();
const pointsOf = (key: string) => SEASON.scores.filter((s) => s.key === key).map((s) => s.points);
const INPUTS: FirstPriceInput[] = SEASON.picks.map((p) => ({ key: p.key, role: p.role, teamId: p.teamId, seasonPoints: [pointsOf(p.key)], played: pointsOf(p.key).length, byHand: BY_HAND[p.name] }));
const { prices: FIRST, line: LINE } = firstPrices(INPUTS, SEASON.teamShares, S);
const priceOf = new Map(FIRST.flatMap((p) => (p.won === null ? [] : [[p.key, p.won] as const])));
const roleOf = new Map(SEASON.picks.map((p) => [p.key, p.role]));
const priced = [...priceOf].map(([key, won]) => ({ key, won, role: roleOf.get(key)! }));

/** The cheapest legal squad around `chosen`: a coach, one of each missing role, players to eight,
 *  two of them academy players on the bench at the academy price (spec/01; spec/02, Money). */
function cheapestSquad(chosen: typeof priced): number {
  const taken = new Set(chosen.map((c) => c.key));
  const free = priced.filter((p) => !taken.has(p.key)).sort((a, b) => a.won - b.won);
  const fill = [...chosen];
  if (!fill.some((p) => p.role === "coach")) fill.push(free.find((p) => p.role === "coach")!);
  for (const role of PLAYER_ROLES) if (!fill.some((p) => p.role === role)) fill.push(free.find((p) => p.role === role)!);
  for (const p of free) if (p.role !== "coach" && !fill.includes(p) && fill.length < 7) fill.push(p);
  return sum(fill.map((p) => p.won)) + 2 * S.academy;
}

describe("the price formula over 2026 (spec/02, First prices)", () => {
  test("Chovy is the dearest at ₩23m, Faker ₩15m, and nobody sits in the gap or under the floor", () => {
    const named = (name: string) => priceOf.get(SEASON.picks.find((p) => p.name === name)!.key);
    expect(named("Chovy")).toBe(m(23));
    expect(named("Faker")).toBe(m(15));
    expect(Math.max(...priceOf.values())).toBe(m(23));
    expect([...priceOf.values()].filter((w) => w < S.floor || (w > S.gap.low && w < S.gap.high))).toEqual([]);
  });

  test("coaches cost less than the top players", () => {
    const coaches = priced.filter((p) => p.role === "coach").map((p) => p.won);
    expect(Math.max(...coaches)).toBeLessThanOrEqual(S.coachTop);
  });

  test("three stars force the rest to be the worst; two stars and two mid-priced fit", () => {
    const players = priced.filter((p) => p.role !== "coach").sort((a, b) => b.won - a.won);
    const stars = players.slice(0, 3);
    // Mid-table picks at about ₩13m, as the approved draft's squads (docs/research/prices-formula.md).
    const mids = players.filter((p) => p.won >= m(12) && p.won <= m(13));
    expect(cheapestSquad(stars)).toBeGreaterThan(BUDGET);
    expect(cheapestSquad([...stars.slice(0, 2), ...mids.slice(0, 2)])).toBeLessThanOrEqual(BUDGET);
  });

  test("replayed week by week, each deadline moves a price one step at most, never below the floor", () => {
    const weekOf = (t: number) => Math.floor(t / MS_PER_WEEK);
    const weeks = [...new Set(SEASON.scores.map((s) => weekOf(s.endedAt)))].sort((a, b) => a - b);
    let now = new Map(priceOf);
    for (const week of weeks) {
      const before = now;
      const series = (key: string) => SEASON.scores.filter((s) => s.key === key && weekOf(s.endedAt) <= week);
      now = nextPrices(
        priced.map((p) => ({
          key: p.key,
          role: p.role,
          won: before.get(p.key)!,
          teamShare: FIRST.find((f) => f.key === p.key)!.teamShare,
          seriesPoints: series(p.key).map((s) => s.points),
          playedThisWeek: series(p.key).some((s) => weekOf(s.endedAt) === week),
          netTransfers: 0,
          owners: 0,
        })),
        0,
        LINE,
        S,
      );
      for (const [key, won] of now) {
        expect(Math.abs(won - before.get(key)!)).toBeLessThanOrEqual(S.step);
        expect(won).toBeGreaterThanOrEqual(S.floor);
      }
    }
    expect([...now].some(([key, won]) => won !== priceOf.get(key))).toBe(true);
  });
});
