import { convexTest } from "convex-test";
import { afterEach, describe, expect, test, vi } from "vitest";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { HOUR_MS, SPEC_FINAL_AFTER_MS } from "../lck/fixtures";
import { LCK_2027, type SeasonFile } from "../lck/season";
import { seriesState } from "../lck/series";
import schema from "../schema";
import { firstScoringGameweek } from "../signIn/signUp";
import { modules } from "../test.setup";
import { nextMidnight, SIM_SETTING } from "./clock";

const clock = internal.admin.clock;
const LCK = { competition: "LCK" };
const KST = "Asia/Seoul";

/** A moment on a made-up season's day, in KST (UTC+9): day 1 is Wed 13 Jan 2027. */
const kst = (day: number, hour: number, minute = 0) => Date.UTC(2027, 0, 12 + day, hour - 9, minute);

// Gameweek 1's deadline is day 1 at 16:45; its series are day 1 at 17:00 and day 3 at 17:00, each one
// game of an hour. Gameweek 2's deadline is day 8.
const SEASON: SeasonFile = {
  ...LCK_2027,
  gameweeks: [
    { number: 1, split: 1, deadline: new Date(kst(1, 16, 45)).toISOString(), state: "toCome" },
    { number: 2, split: 1, deadline: new Date(kst(8, 16, 45)).toISOString(), state: "toCome" },
  ],
};
const GAME_STARTS = [kst(1, 17), kst(3, 17)];

afterEach(() => vi.unstubAllEnvs());

async function sim() {
  vi.stubEnv(SIM_SETTING, "true");
  const t = convexTest(schema, modules);
  await t.mutation(internal.lck.season.loadSeason, { data: SEASON });
  const teams = await t.run(async (ctx) => [
    await ctx.db.insert("teams", { name: "T1", oeId: "oe-t1" }),
    await ctx.db.insert("teams", { name: "Gen.G", oeId: "oe-gen" }),
  ]);
  const series = await t.run(async (ctx) => {
    const ids: Id<"series">[] = [];
    for (const [i, startedAt] of GAME_STARTS.entries()) {
      const line = (team: Id<"teams">, won: boolean) => ({ team, won, firstTower: won, drakes: 0, barons: 0, elders: 0, raw: {} });
      const game = await ctx.db.insert("games", {
        oeId: `game-${i}`,
        pair: teams.join("|"),
        gameNumber: 1,
        startedAt,
        patch: "27.1",
        lengthSeconds: HOUR_MS / 1000,
        complete: true,
        winner: teams[0]!,
        blue: line(teams[0]!, true),
        red: line(teams[1]!, false),
      });
      ids.push(await ctx.db.insert("series", { firstGame: game, teams, score: [1, 0], endedAt: startedAt + HOUR_MS, settledStatsIn: true, waiting: [] }));
    }
    return ids;
  });
  await t.mutation(clock.startSimClock, { at: kst(0, 12) });
  const now = () => t.query(clock.clockNow, {});
  const openGameweek = async () => {
    const gameweeks = await t.run((ctx) => ctx.db.query("gameweeks").collect());
    return firstScoringGameweek(await now(), gameweeks);
  };
  const stateOf = async (id: Id<"series">) => {
    const row = (await t.run((ctx) => ctx.db.get(id)))!;
    return seriesState(row.endedAt, row.settledStatsIn, await now(), SPEC_FINAL_AFTER_MS);
  };
  return { t, series, now, openGameweek, stateOf };
}

describe("the sim's clock (spec/10, The road to launch, step 1)", () => {
  test("Next day plays one match day at a time, through a deadline and a series turning final", async () => {
    const { t, series, now, openGameweek, stateOf } = await sim();
    expect(await now()).toBe(kst(0, 12));
    expect(await openGameweek()).toBe(1);

    // Day 1: gameweek 1's deadline passes and its first series plays; it ends at 18:00, final at 21:00.
    expect(await t.mutation(clock.nextDay, LCK)).toBe(kst(2, 0));
    expect(await now()).toBe(kst(2, 0));
    expect(await openGameweek()).toBe(2);
    expect(await stateOf(series[0]!)).toBe("final");
    expect(await stateOf(series[1]!)).toBe("provisional");

    // Day 2 has no game: the next press plays day 3.
    expect(await t.mutation(clock.nextDay, LCK)).toBe(kst(4, 0));
    expect(await stateOf(series[1]!)).toBe("final");

    // No game left: the clock stays.
    expect(await t.mutation(clock.nextDay, LCK)).toBeNull();
    expect(await now()).toBe(kst(4, 0));
  });

  test("Play to end runs every match day left without stopping", async () => {
    const { t, now } = await sim();
    expect(await t.mutation(clock.playToEnd, LCK)).toBe(GAME_STARTS.length);
    expect(await now()).toBe(kst(4, 0));
  });

  test("a sim whose clock was never started says so", async () => {
    vi.stubEnv(SIM_SETTING, "true");
    const t = convexTest(schema, modules);
    await expect(t.query(clock.clockNow, {})).rejects.toThrow("clock isn't started");
  });

  test("the real site's clock is the real time, and nothing moves it", async () => {
    vi.useFakeTimers({ now: kst(5, 9), toFake: ["Date"] });
    try {
      const t = convexTest(schema, modules);
      await t.mutation(internal.lck.season.loadSeason, { data: SEASON });
      expect(await t.query(clock.clockNow, {})).toBe(kst(5, 9));
      await expect(t.mutation(clock.nextDay, LCK)).rejects.toThrow("only the sim");
      await expect(t.mutation(clock.startSimClock, { at: 0 })).rejects.toThrow("only the sim");
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("nextMidnight", () => {
  test("is the start of the next day in the zone", () => {
    expect(nextMidnight(kst(1, 17), KST)).toBe(kst(2, 0));
    expect(nextMidnight(kst(1, 0), KST)).toBe(kst(2, 0));
    expect(nextMidnight(kst(1, 23, 30), KST)).toBe(kst(2, 0));
  });

  test("holds across a clock change", () => {
    // London's clocks go forward at 01:00 UTC on 28 Mar 2027: midnight on the 29th is 23:00 UTC on the 28th.
    expect(nextMidnight(Date.UTC(2027, 2, 28, 12), "Europe/London")).toBe(Date.UTC(2027, 2, 28, 23));
  });
});
