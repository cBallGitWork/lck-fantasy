import { convexTest } from "convex-test";
import { ConvexError } from "convex/values";
import { afterEach, describe, expect, test, vi } from "vitest";
import { api, internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { HOUR_MS } from "../world/fixtures";
import { LCK_2027, type SeasonFile } from "../world/season";
import schema from "../schema";
import { modules } from "../test.setup";
import { ADMIN_PASSWORD_SETTING, type AdminRefusal } from "./access";
import { SIM_SETTING } from "./clock";

const PASSWORD = "admin-password";
const sim = api.admin.sim;

/** A moment on a made-up season's day, in KST (UTC+9): day 1 is Wed 13 Jan 2027. */
const kst = (day: number, hour: number) => Date.UTC(2027, 0, 12 + day, hour - 9);

// Gameweek 1's deadline is day 1 at 16:45, gameweek 2's day 3 at 16:45. Day 1 has two series, one of
// two games; day 3 has one series.
const SEASON: SeasonFile = {
  ...LCK_2027,
  settings: { ...LCK_2027.settings, live: { ...LCK_2027.settings.live, replaySeconds: 60 } },
  gameweeks: [
    { number: 1, split: 1, deadline: new Date(kst(1, 16)).toISOString(), state: "toCome" },
    { number: 2, split: 1, deadline: new Date(kst(3, 16)).toISOString(), state: "toCome" },
  ],
};
const GAMES = [
  { startedAt: kst(1, 17), gameNumber: 1 },
  { startedAt: kst(1, 18), gameNumber: 2 },
  { startedAt: kst(1, 20), gameNumber: 1 },
  { startedAt: kst(3, 17), gameNumber: 1 },
];

afterEach(() => vi.unstubAllEnvs());

async function setUp({ startClock = true } = {}) {
  vi.stubEnv(ADMIN_PASSWORD_SETTING, PASSWORD);
  vi.stubEnv(SIM_SETTING, "true");
  const t = convexTest(schema, modules);
  await t.mutation(internal.world.season.loadSeason, { data: SEASON });
  await t.run(async (ctx) => {
    const teams: Id<"teams">[] = [await ctx.db.insert("teams", { name: "T1", oeId: "oe-t1" }), await ctx.db.insert("teams", { name: "Gen.G", oeId: "oe-gen" })];
    const line = (team: Id<"teams">, won: boolean) => ({ team, won, firstTower: won, drakes: 0, barons: 0, elders: 0, raw: {} });
    for (const [i, { startedAt, gameNumber }] of GAMES.entries()) {
      await ctx.db.insert("games", {
        oeId: `game-${i}`,
        pair: teams.join("|"),
        gameNumber,
        startedAt,
        patch: "27.1",
        lengthSeconds: HOUR_MS / 1000,
        complete: true,
        winner: teams[0]!,
        blue: line(teams[0]!, true),
        red: line(teams[1]!, false),
      });
    }
  });
  if (startClock) await t.mutation(internal.admin.clock.startSimClock, { at: kst(0, 12) });
  return t;
}

const press = { password: PASSWORD, competition: "LCK" };

async function refusal(call: Promise<unknown>): Promise<AdminRefusal> {
  const error = await call.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(ConvexError);
  return (error as ConvexError<AdminRefusal>).data;
}

describe("the admin's Sim page (#398)", () => {
  test("shows the sim's moment, and whether a game is left", async () => {
    const t = await setUp();
    expect(await t.query(sim.simState, { password: PASSWORD })).toEqual({ sim: true, now: kst(0, 12), gamesLeft: true });
  });

  test("Next day says the day it played to, its series and the deadline it passed", async () => {
    const t = await setUp();
    expect(await t.mutation(sim.nextDay, press)).toEqual({ to: kst(2, 0), series: 2, deadlines: [1] });
    expect(await t.mutation(sim.nextDay, press)).toEqual({ to: kst(4, 0), series: 1, deadlines: [2] });
    expect(await t.query(sim.simState, { password: PASSWORD })).toEqual({ sim: true, now: kst(4, 0), gamesLeft: false });
    expect(await t.mutation(sim.nextDay, press)).toEqual({ to: null, series: 0, deadlines: [] });
  });

  test("Next day replays the day's games one after another, a minute apart", async () => {
    const t = await setUp();
    await t.mutation(sim.nextDay, press);
    const watched = await t.run((ctx) => ctx.db.query("liveFrames").collect());
    expect(watched.map((row) => [row.esportsGameId, row.state])).toEqual([["game-0", "polling"], ["game-1", "polling"], ["game-2", "polling"]]);
    const reads = await t.run((ctx) => ctx.db.system.query("_scheduled_functions").collect());
    const at = reads.filter((job) => job.name.includes("readLiveGame")).map((job) => job.scheduledTime - reads[0]!.scheduledTime);
    expect(at.map((ms) => Math.round(ms / 1000))).toEqual([0, 60, 120]);
  });

  test("Play to end plays every day left at once, with no replays", async () => {
    const t = await setUp();
    expect(await t.mutation(sim.playToEnd, press)).toEqual({ to: kst(4, 0), series: 3, deadlines: [1, 2] });
    expect(await t.run((ctx) => ctx.db.query("liveFrames").collect())).toEqual([]);
  });

  test("a sim whose clock isn't started says so", async () => {
    const t = await setUp({ startClock: false });
    expect(await t.query(sim.simState, { password: PASSWORD })).toEqual({ sim: true, now: null });
  });

  test("the real site says it isn't the sim, and refuses a press", async () => {
    vi.stubEnv(ADMIN_PASSWORD_SETTING, PASSWORD);
    const t = convexTest(schema, modules);
    await t.mutation(internal.world.season.loadSeason, { data: SEASON });
    expect(await t.query(sim.simState, { password: PASSWORD })).toEqual({ sim: false });
    await expect(t.mutation(sim.nextDay, press)).rejects.toThrow("only the sim");
  });

  test("only the admin password opens it, and none works where no password is set", async () => {
    const t = await setUp();
    expect(await refusal(t.mutation(sim.nextDay, { ...press, password: "guess" }))).toEqual({ rule: "wrongPassword" });
    expect(await refusal(t.query(api.admin.alerts.alertList, { password: "guess" }))).toEqual({ rule: "wrongPassword" });
    expect(await t.query(api.admin.alerts.alertList, { password: PASSWORD })).toEqual([]);
    vi.stubEnv(ADMIN_PASSWORD_SETTING, "");
    expect(await refusal(t.query(sim.simState, { password: "" }))).toEqual({ rule: "noPasswordSet" });
  });
});
