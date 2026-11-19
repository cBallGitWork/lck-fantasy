import { describe, expect, test } from "vitest";
import { WON_PER_M } from "../../src/parts/text/money";
import { PRICE_SETTINGS } from "./fixtures";
import { firstPrices, formPrice, nextPrices, type FirstPriceInput, type PriceLine, type PriceWeek } from "./prices";
import { PLAYER_ROLES, type Role } from "./squad";

const m = (x: number) => Math.round(x * WON_PER_M);
const S = PRICE_SETTINGS;
const TEAMS = Array.from({ length: 10 }, (_, i) => `team${i}`);

/** Ten teams, team i winning i/9 of its series; each pick plays 12 series, scoring 1 + i a series,
 *  less a little for each role after top, so only team9's mid and top are stars. */
function market(): { picks: FirstPriceInput[]; teamShares: Map<string, number[]> } {
  const roles: Role[] = ["mid", "top", "jungle", "bot", "support", "coach"];
  const picks = TEAMS.flatMap((teamId, i) =>
    roles.map((role, r) => ({ key: `${role}:${teamId}`, role, teamId, seasonPoints: [Array<number>(12).fill(1 + i - (role === "coach" ? 0 : 1.5 * r))], played: 12 })),
  );
  return { picks, teamShares: new Map(TEAMS.map((teamId, i) => [teamId, [i / 9]])) };
}

const priceOf = (prices: { key: string; won: number | null }[], key: string) => prices.find((p) => p.key === key)?.won;

describe("first prices (spec/02, The formula)", () => {
  test("the best team's best player is the top, and the worst first-teamer the floor", () => {
    const { prices } = firstPrices(market().picks, market().teamShares, S);
    expect(priceOf(prices, "mid:team9")).toBe(S.top);
    expect(priceOf(prices, "support:team0")).toBe(S.floor);
  });

  test("nothing lands inside the gap, and the stars are a step apart, dearest first, down to ₩21m", () => {
    const { prices } = firstPrices(market().picks, market().teamShares, S);
    const won = prices.map((p) => p.won!);
    expect(won.filter((w) => w > S.gap.low && w < S.gap.high)).toEqual([]);
    const stars = won.filter((w) => w >= S.gap.high).sort((a, b) => b - a);
    expect(stars.slice(0, 3)).toEqual([m(22.5), m(22), m(21.5)]);
    expect(stars.slice(3).every((w) => w === S.gap.high)).toBe(true);
  });

  test("each role's ten starters, and the ten coaches, are at least ₩0.5m apart", () => {
    const { prices } = firstPrices(market().picks, market().teamShares, S);
    for (const role of [...PLAYER_ROLES, "coach"]) {
      const won = prices.filter((p) => p.key.startsWith(`${role}:`)).map((p) => p.won!).sort((a, b) => a - b);
      won.slice(1).forEach((w, i) => expect(w - won[i]!).toBeGreaterThanOrEqual(S.spacing));
    }
  });

  test("coaches have a line of their own, the worst at the floor and the best at the coaches' top", () => {
    const { prices } = firstPrices(market().picks, market().teamShares, S);
    expect(priceOf(prices, "coach:team0")).toBe(S.floor);
    expect(priceOf(prices, "coach:team9")).toBe(S.coachTop);
  });

  test("a price set by hand stands, and the stars start a step under it", () => {
    const { picks, teamShares } = market();
    const handPicks = picks.map((p) => (p.key === "mid:team9" ? { ...p, byHand: m(23) } : p));
    const { prices } = firstPrices(handPicks, teamShares, S);
    expect(priceOf(prices, "mid:team9")).toBe(m(23));
    expect(Math.max(...prices.filter((p) => p.key !== "mid:team9").map((p) => p.won!))).toBe(m(22.5));
  });

  test("a rookie with under 10 series is left for Craig to price; an academy player is ₩5m", () => {
    const { picks, teamShares } = market();
    const rookie: FirstPriceInput = { key: "rookie", role: "top", teamId: "team5", seasonPoints: [[9, 9, 9]], played: 3 };
    const academy: FirstPriceInput = { key: "academy", role: "jungle", teamId: "team5", seasonPoints: [], played: 0, academy: true };
    const { prices } = firstPrices([...picks, rookie, academy], teamShares, S);
    expect(priceOf(prices, "rookie")).toBeNull();
    expect(priceOf(prices, "academy")).toBe(S.academy);
  });

  test("last season counts 75% and the one before 25%", () => {
    const { picks, teamShares } = market();
    // team5's mid: 2 a series last season, 10 the one before: 4 on the weights, against 6 for all 10 last season.
    const recent = picks.map((p) => (p.key === "mid:team5" ? { ...p, seasonPoints: [Array<number>(12).fill(2), Array<number>(12).fill(10)] } : p));
    const older = picks.map((p) => (p.key === "mid:team5" ? { ...p, seasonPoints: [Array<number>(12).fill(10), Array<number>(12).fill(2)] } : p));
    const a = priceOf(firstPrices(recent, teamShares, S).prices, "mid:team5")!;
    const b = priceOf(firstPrices(older, teamShares, S).prices, "mid:team5")!;
    expect(a).toBeLessThan(b);
  });
});

/** A line where a player scoring 10 a series on the best team is the top, and a coach scoring 10 the coaches' top. */
const LINE: PriceLine = { ownLow: 0, ownHigh: 10, teamLow: 0, teamHigh: 1, coachLow: 0, coachHigh: 10, topBlend: 1 };
const MANAGERS = 1000;

/** A pick at ₩15m in form for ₩22.5m, played this week, quiet in the market and widely owned. */
const week = (over: Partial<PriceWeek> = {}): PriceWeek => ({
  key: "kiin",
  role: "top",
  won: m(15),
  teamShare: 1,
  seriesPoints: Array<number>(8).fill(10),
  playedThisWeek: true,
  netTransfers: 0,
  owners: 300,
  ...over,
});
const next = (w: PriceWeek) => nextPrices([w], MANAGERS, LINE, S).get(w.key);

describe("price moves (spec/02, Price moves)", () => {
  test("prices move once a week, at the deadline: each deadline moves a pick one step at most", () => {
    // Form, transfers in and the market all say rise: still one step.
    expect(next(week({ netTransfers: 200 }))).toBe(m(15.2));
  });

  test("form ₩3m or more above his price lifts him ₩0.2m, and below drops him", () => {
    expect(formPrice(week(), LINE, S)).toBe(m(22.5));
    expect(next(week())).toBe(m(15.2));
    expect(next(week({ seriesPoints: Array<number>(8).fill(0), teamShare: 0, won: m(9) }))).toBe(m(8.8));
  });

  test("form under ₩3m from his price doesn't move him", () => {
    expect(next(week({ won: m(20) }))).toBe(m(20));
  });

  test("form is his last 8 series, older ones left out", () => {
    const w = week({ seriesPoints: [...Array<number>(20).fill(0), ...Array<number>(8).fill(10)] });
    expect(formPrice(w, LINE, S)).toBe(m(22.5));
  });

  test("a week he played no series, form doesn't move him", () => {
    expect(next(week({ playedThisWeek: false }))).toBe(m(15));
  });

  test("net transfers of 5% of managers move him, and sales beat form", () => {
    expect(next(week({ won: m(20), netTransfers: 50 }))).toBe(m(20.2));
    expect(next(week({ won: m(20), netTransfers: 49 }))).toBe(m(20));
    expect(next(week({ netTransfers: -60 }))).toBe(m(14.8));
  });

  test("owned by under 2% of managers, with form not above his price, he falls", () => {
    // Form ₩19.5m: under his price, but not by ₩3m.
    expect(next(week({ won: m(20), owners: 19, seriesPoints: Array<number>(8).fill(7) }))).toBe(m(19.8));
    expect(next(week({ won: m(20), owners: 20, seriesPoints: Array<number>(8).fill(7) }))).toBe(m(20));
    expect(next(week({ won: m(21), owners: 19 }))).toBe(m(21)); // form ₩22.5m, above: he holds
  });

  test("no price falls below the floor; an academy player under it never falls", () => {
    const low = { owners: 0, seriesPoints: [], playedThisWeek: false };
    expect(next(week({ ...low, won: S.floor }))).toBe(S.floor);
    expect(next(week({ ...low, won: m(6.1) }))).toBe(S.floor);
    expect(next(week({ ...low, won: S.academy }))).toBe(S.academy);
  });

  test("a coach moves by the same rule on its own score, through the coaches' line", () => {
    const coach = week({ key: "coach:gen", role: "coach", won: m(12) });
    expect(formPrice(coach, LINE, S)).toBe(S.coachTop);
    expect(next(coach)).toBe(m(12.2));
    expect(next({ ...coach, won: m(14) })).toBe(m(14));
  });
});
