// The end-of-season report and the alerts it counts (Craig, 19 Nov 2026, #401), on made-up rows.
import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { api, internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import schema from "../schema";
import { modules } from "../test.setup";
import { ADMIN_PASSWORD_SETTING } from "./access";
import { priceSpread, type PriceRow } from "./priceSpread";
import { raiseMismatches, type Mismatch } from "./seasonCheck";

const PASSWORD = "admin-password";
const M = 1_000_000;

const row = (fromGameweek: number, team: string, role: PriceRow["role"], handle: string | undefined, won: number): PriceRow =>
  handle === undefined ? { fromGameweek, team, role, won } : { fromGameweek, team, role, handle, won };

describe("the price spread and moves", () => {
  // Faker rises twice, Chovy falls once, Zeka falls twice; the T1 coach never moves.
  const rows = [
    row(1, "T1", "mid", "Faker", 18 * M),
    row(1, "GEN", "mid", "Chovy", 17.5 * M),
    row(1, "HLE", "mid", "Zeka", 15 * M),
    row(1, "T1", "coach", undefined, 9 * M),
    row(2, "T1", "mid", "Faker", 18.2 * M),
    row(2, "HLE", "mid", "Zeka", 14.8 * M),
    row(3, "T1", "mid", "Faker", 18.4 * M),
    row(3, "GEN", "mid", "Chovy", 17.3 * M),
    row(3, "HLE", "mid", "Zeka", 14.6 * M),
  ];
  const spread = priceSpread(rows, [1, 2, 3]);

  test("per role, the dearest and cheapest at the start and the end", () => {
    expect(spread.roles.find((r) => r.role === "mid")).toEqual({
      role: "mid",
      start: { dearest: { name: "Faker", won: 18 * M }, cheapest: { name: "Zeka", won: 15 * M } },
      end: { dearest: { name: "Faker", won: 18.4 * M }, cheapest: { name: "Zeka", won: 14.6 * M } },
    });
    expect(spread.roles.find((r) => r.role === "coach")?.end).toEqual({ dearest: { name: "T1", won: 9 * M }, cheapest: { name: "T1", won: 9 * M } });
    expect(spread.roles.find((r) => r.role === "top")).toEqual({ role: "top", start: null, end: null });
  });

  test("the rises and falls at each deadline after the first", () => {
    expect(spread.weeks).toEqual([
      { gameweek: 2, rises: 1, falls: 1 },
      { gameweek: 3, rises: 1, falls: 2 },
    ]);
  });

  test("the season's biggest risers and fallers, biggest first", () => {
    expect(spread.risers).toEqual([{ name: "Faker", won: 0.4 * M }]);
    expect(spread.fallers.map((f) => f.name)).toEqual(["Zeka", "Chovy"]);
  });

  test("five at most", () => {
    const many = Array.from({ length: 7 }, (_, i) => [row(1, "T1", "top", `P${i}`, 10 * M), row(2, "T1", "top", `P${i}`, 10 * M + i + 1)]).flat();
    expect(priceSpread(many, [1, 2]).risers.map((r) => r.name)).toEqual(["P6", "P5", "P4", "P3", "P2"]);
  });
});

describe("the report on the stored season", () => {
  beforeEach(() => vi.stubGlobal("fetch", () => Promise.reject(new Error("No network in tests."))));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const mismatch = (gameweek: number): Mismatch => ({ manager: "Test 1", gameweek, part: "total", app: 47, backtest: 46 });

  test("counts open alerts by kind and every mismatch, and an admin closes an alert", async () => {
    vi.stubEnv(ADMIN_PASSWORD_SETTING, PASSWORD);
    const t = convexTest(schema, modules);
    await t.mutation(internal.world.season.loadSeason, {});
    await t.run((ctx) => raiseMismatches(ctx, [mismatch(1), mismatch(2)], "Asia/Seoul"));

    const report = () => t.query(api.admin.seasonReport.seasonReport, { password: PASSWORD, competition: "LCK" });
    expect(await report()).toMatchObject({ season: "LCK 2027", openAlerts: { feedDown: 0, noLaneOpponent: 0, pointsMismatch: 2 }, mismatches: 2 });

    const listed = await t.query(api.admin.alerts.alertList, { password: PASSWORD });
    expect(listed[0]).toMatchObject({ kind: "pointsMismatch", names: ["Test 1", "GW2"], open: true });
    await t.mutation(api.admin.alerts.closeAlert, { password: PASSWORD, alert: listed[0]!.id as Id<"alerts"> });
    expect((await t.query(api.admin.alerts.alertList, { password: PASSWORD }))[0]?.open).toBe(false);
    expect(await report()).toMatchObject({ openAlerts: { pointsMismatch: 1 }, mismatches: 2 });
  });

  test("reads the season's stored prices", async () => {
    vi.stubEnv(ADMIN_PASSWORD_SETTING, PASSWORD);
    const t = convexTest(schema, modules);
    await t.mutation(internal.world.season.loadSeason, {});
    await t.run(async (ctx) => {
      const season = (await ctx.db.query("seasons").first())!;
      await ctx.db.insert("prices", { season: season._id, fromGameweek: 2, team: "T1", role: "mid", handle: "Faker", won: 18.7 * M });
    });
    const { prices } = await t.query(api.admin.seasonReport.seasonReport, { password: PASSWORD, competition: "LCK" });
    expect(prices.risers).toEqual([{ name: "Faker", won: 0.2 * M }]);
    expect(prices.weeks[0]).toEqual({ gameweek: 2, rises: 1, falls: 0 });
  });

  test("a competition with no season reports its alerts alone", async () => {
    vi.stubEnv(ADMIN_PASSWORD_SETTING, PASSWORD);
    const t = convexTest(schema, modules);
    expect(await t.query(api.admin.seasonReport.seasonReport, { password: PASSWORD, competition: "LEC" })).toMatchObject({ season: null, mismatches: 0 });
  });
});
