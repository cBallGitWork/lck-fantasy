import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { internal } from "../_generated/api";
import schema from "../schema";
import type { SquadSettings } from "../squads/squad";
import type { TransferSettings } from "../squads/transfers";
import { modules } from "../test.setup";
import { LCK_2027, type SeasonFile } from "./season";

const season = internal.lck.season;

/** data/lck's 2027 season loaded, and how to read it back. */
async function loaded(data?: SeasonFile) {
  const t = convexTest(schema, modules);
  await t.mutation(season.loadSeason, data === undefined ? {} : { data });
  const read = () => t.query(season.seasonOf, { competition: "LCK", year: 2027 });
  return { t, read };
}

const rowCounts = (t: ReturnType<typeof convexTest>) =>
  t.run(async (ctx) => {
    const counts: Record<string, number> = {};
    for (const table of ["competitions", "seasons", "gameweeks", "prices"] as const) counts[table] = (await ctx.db.query(table).collect()).length;
    return counts;
  });

const priceOf = (prices: { handle?: string; team: string; role: string; won: number }[], handle: string) =>
  prices.find((p) => p.handle === handle)?.won;

describe("a season loaded from data/lck", () => {
  test("the LCK is a competition in KST, with a 2027 season and Split 1", async () => {
    const got = (await (await loaded()).read())!;
    expect(got.competition).toEqual({ name: "LCK", region: "Korea", timeZone: "Asia/Seoul" });
    expect(got.year).toBe(2027);
    expect(got.splits).toEqual([{ number: 1, name: "Split 1" }]);
    expect(got.madeUp).toBe(true);
  });

  test("its settings are the file's, in the shapes the rules take", async () => {
    const got = (await (await loaded()).read())!;
    expect(got.settings).toEqual(LCK_2027.settings);
    const squad: SquadSettings = got.settings.squad;
    const transfers: TransferSettings = got.settings.transfers;
    expect(squad.teamCap).toBe(2);
    expect(transfers.hitPoints).toBe(6);
    expect(got.settings.carryMultiplier).toBe(1.5);
    expect(got.settings.buffs.map((b) => [b.name, b.effect, b.multiplier, b.perSplit])).toEqual([
      ["Bench Boost", "benchBoost", undefined, 1],
      ["Double Captain", "doubleCaptain", 2, 1],
      ["Coach Diff", "coachMultiplier", 3, 1],
    ]);
  });

  test("a setting changed in the file is stored, never a value in code", async () => {
    const data = structuredClone(LCK_2027);
    data.settings.squad.teamCap = 3;
    data.settings.budget = 120_000_000;
    const got = (await (await loaded(data)).read())!;
    expect(got.settings.squad.teamCap).toBe(3);
    expect(got.settings.budget).toBe(120_000_000);
  });

  test("each player and each team's coach has a price in won from a gameweek", async () => {
    const got = (await (await loaded()).read())!;
    expect(got.prices).toHaveLength(60);
    expect(got.prices).toContainEqual({ team: "T1", role: "mid", handle: "Faker", fromGameweek: 1, won: 18_500_000 });
    expect(got.prices).toContainEqual({ team: "T1", role: "coach", handle: undefined, fromGameweek: 1, won: 7_000_000 });
    expect(got.prices.filter((p) => p.role === "coach")).toHaveLength(10);
  });

  test("each gameweek has its number, split, UTC deadline and state", async () => {
    const got = (await (await loaded()).read())!;
    expect(got.gameweeks).toEqual([
      { number: 1, split: 1, deadline: Date.UTC(2026, 11, 30, 7, 45), state: "final" },
      { number: 2, split: 1, deadline: Date.UTC(2027, 0, 6, 7, 45), state: "final" },
      { number: 3, split: 1, deadline: Date.UTC(2027, 0, 13, 7, 45), state: "final" },
      { number: 4, split: 1, deadline: Date.UTC(2027, 0, 20, 7, 45), state: "toCome" },
    ]);
  });

  test("a rerun updates in place: one price and one deadline change, nothing duplicates", async () => {
    const { t, read } = await loaded();
    const before = await rowCounts(t);
    const data = structuredClone(LCK_2027);
    const faker = data.prices[0]!.picks.find((p) => p.handle === "Faker")!;
    faker.won = 19_000_000;
    data.gameweeks[3]!.deadline = "2027-01-20T09:45:00Z";
    await t.mutation(season.loadSeason, { data });
    await t.mutation(season.loadSeason, { data });
    const got = (await read())!;
    expect(await rowCounts(t)).toEqual(before);
    expect(priceOf(got.prices, "Faker")).toBe(19_000_000);
    expect(priceOf(got.prices, "Chovy")).toBe(17_500_000);
    expect(got.gameweeks[3]!.deadline).toBe(Date.UTC(2027, 0, 20, 9, 45));
    expect(got.gameweeks[2]!.deadline).toBe(Date.UTC(2027, 0, 13, 7, 45));
  });

  test("a season not loaded reads as none", async () => {
    const t = convexTest(schema, modules);
    expect(await t.query(season.seasonOf, { competition: "LCK", year: 2027 })).toBeNull();
  });
});

describe("a broken season file is refused", () => {
  test("a deadline with no zone", async () => {
    const data = structuredClone(LCK_2027);
    data.gameweeks[0]!.deadline = "2026-12-30T07:45:00";
    await expect(loaded(data)).rejects.toThrow("not an ISO time with its zone");
  });

  test("a coach with a handle", async () => {
    const data = structuredClone(LCK_2027);
    data.prices[0]!.picks.push({ team: "T1", role: "coach", handle: "kkOma", won: 7_000_000 });
    await expect(loaded(data)).rejects.toThrow("a coach has no handle");
  });

  test("a pick priced twice in one gameweek", async () => {
    const data = structuredClone(LCK_2027);
    data.prices[0]!.picks.push({ team: "T1", role: "mid", handle: "Faker", won: 1 });
    await expect(loaded(data)).rejects.toThrow("twice in gameweek 1");
  });
});
