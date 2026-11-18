import { convexTest } from "convex-test";
import { ConvexError } from "convex/values";
import { describe, expect, test } from "vitest";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import schema from "../schema";
import { modules } from "../test.setup";
import type { LeagueRefusal } from "./store";

const FPL_LIKE = { privateLeagueCap: 25, privateLeagueSize: null }; // fixture values: the real ones are data
const SEASON = { currentGameweek: 4, lastGameweek: 18 };
const store = internal.leagues.store;
const HOUR = 60 * 60 * 1000;

type T = ReturnType<typeof convexTest>;

async function world() {
  const t = convexTest(schema, modules);
  const [t1, gen] = await t.run(async (ctx) => [
    await ctx.db.insert("teams", { name: "T1", oeId: "oe-t1" }),
    await ctx.db.insert("teams", { name: "Gen.G", oeId: "oe-gen" }),
  ]);
  await t.mutation(internal.lck.season.loadSeason, {});
  return { t, t1, gen };
}

/** A manager and their entry, in no league yet. */
const newEntry = (t: T, teamName: string, country: string, favouriteTeam: Id<"teams">) =>
  t.run(async (ctx) => {
    const season = (await ctx.db.query("seasons").first())!._id;
    const agreed = { at: 0, version: "test" };
    const manager = await ctx.db.insert("managers", { account: `account-${teamName}`, country, favouriteTeam, agreed });
    return ctx.db.insert("entries", { manager, season, teamName, firstGameweek: 1, bank: 0 });
  });

/** A signed-up manager's entry, entered into its three leagues. */
async function entryOf(t: T, teamName: string, country: string, favouriteTeam: Id<"teams">) {
  const entry = await newEntry(t, teamName, country, favouriteTeam);
  await t.mutation(store.enterAutoLeagues, { entry });
  return entry;
}

const kinds = async (t: T, entry: Id<"entries">) =>
  (await t.query(store.leaguesOf, { entry })).map((l) => (l.kind === "private" ? l.name : l.kind));

const make = (t: T, entry: Id<"entries">, name = "Pub League", startGameweek = SEASON.currentGameweek) =>
  t.mutation(store.createPrivateLeague, { entry, name, startGameweek, ...SEASON, settings: FPL_LIKE });

/** The refusal a call throws, as the page gets it. */
async function refusal(call: Promise<unknown>) {
  const error = await call.then(() => null, (e: unknown) => e);
  expect(error).toBeInstanceOf(ConvexError);
  return (error as ConvexError<LeagueRefusal>).data;
}

describe("leagues every manager joins", () => {
  test("a new manager is in Overall, their country's league and their team's, each made once", async () => {
    const { t, t1 } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    const sam = await entryOf(t, "Sam's Squad", "GB", t1);
    expect(await kinds(t, craig)).toEqual(["overall", "country", "team"]);
    expect((await t.query(store.leaguesOf, { entry: sam })).map((l) => l.size)).toEqual([2, 2, 2]);
  });

  test("a change of favourite team moves the manager to its league until the first gameweek's deadline", async () => {
    const { t, t1, gen } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    await t.mutation(store.changeFavouriteTeam, { entry: craig, team: gen, firstDeadline: Date.now() + HOUR });
    const team = (await t.query(store.leaguesOf, { entry: craig })).find((l) => l.kind === "team");
    expect(team).toMatchObject({ kind: "team", team: gen, size: 1 });
    expect(await refusal(t.mutation(store.changeFavouriteTeam, { entry: craig, team: t1, firstDeadline: Date.now() - HOUR }))).toEqual({
      rule: "favouriteTeamFixed",
    });
  });

  test("an entry never entered into its leagues is a broken row: the change says so and changes nothing", async () => {
    const { t, t1, gen } = await world();
    const entry = await newEntry(t, "Faker Fan", "GB", t1);
    await expect(t.mutation(store.changeFavouriteTeam, { entry, team: gen, firstDeadline: Date.now() + HOUR })).rejects.toThrow(
      "isn't in its favourite team's league",
    );
    expect(await t.run(async (ctx) => (await ctx.db.query("managers").first())?.favouriteTeam)).toBe(t1);
  });

  test("a membership whose league is gone is said, not skipped", async () => {
    const { t, t1 } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    const { league } = await make(t, craig);
    await t.run((ctx) => ctx.db.delete(league));
    await expect(t.query(store.leaguesOf, { entry: craig })).rejects.toThrow(`No league ${league}`);
    await expect(make(t, craig, "Two")).rejects.toThrow(`No league ${league}`);
  });
});

describe("private leagues", () => {
  test("made with a code, counting from this gameweek or a later one, its maker in it", async () => {
    const { t, t1 } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    const { code } = await make(t, craig, "Gank Squad", 6);
    expect(code).toMatch(/^GANK-[A-Z2-9]{4}$/);
    const pub = (await t.query(store.leaguesOf, { entry: craig })).at(-1);
    expect(pub).toMatchObject({ kind: "private", name: "Gank Squad", code, maker: craig, startGameweek: 6, size: 1 });
    expect(await refusal(make(t, craig, "Old League", 3))).toMatchObject({ rule: "startGameweek" });
    expect(await refusal(make(t, craig, "  "))).toEqual({ rule: "noName" });
  });

  test("another manager joins with the code in any case, once", async () => {
    const { t, t1, gen } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    const sam = await entryOf(t, "Sam's Squad", "KR", gen);
    const { league, code } = await make(t, craig);
    await t.mutation(store.joinPrivateLeague, { entry: sam, code: ` ${code.toLowerCase()} `, settings: FPL_LIKE });
    await t.mutation(store.joinPrivateLeague, { entry: sam, code, settings: FPL_LIKE });
    expect(await kinds(t, sam)).toEqual(["overall", "country", "team", "Pub League"]);
    expect((await t.query(store.leaguesOf, { entry: craig })).find((l) => l._id === league)?.size).toBe(2);
    expect(await refusal(t.mutation(store.joinPrivateLeague, { entry: sam, code: "NOPE-2222", settings: FPL_LIKE }))).toEqual({
      rule: "noCode",
      code: "NOPE-2222",
    });
  });

  test("up to the cap of private leagues, and a size cap when the data sets one", async () => {
    const { t, t1 } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    const sam = await entryOf(t, "Sam's Squad", "GB", t1);
    const small = { privateLeagueCap: 1, privateLeagueSize: 1 };
    const { code } = await t.mutation(store.createPrivateLeague, { entry: craig, name: "Pub League", startGameweek: 4, ...SEASON, settings: small });
    expect(await refusal(t.mutation(store.createPrivateLeague, { entry: craig, name: "Two", startGameweek: 4, ...SEASON, settings: small }))).toEqual({
      rule: "privateLeagueCap",
      cap: 1,
    });
    expect(await refusal(t.mutation(store.joinPrivateLeague, { entry: sam, code, settings: small }))).toEqual({ rule: "leagueFull", size: 1 });
  });

  test("the maker renames, removes a manager and deletes; a member leaves; the maker can't leave", async () => {
    const { t, t1 } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    const sam = await entryOf(t, "Sam's Squad", "GB", t1);
    const jo = await entryOf(t, "Jo's Rift", "GB", t1);
    const { league, code } = await make(t, craig);
    for (const entry of [sam, jo]) await t.mutation(store.joinPrivateLeague, { entry, code, settings: FPL_LIKE });

    expect(await refusal(t.mutation(store.renamePrivateLeague, { entry: sam, league, name: "Mine" }))).toEqual({ rule: "notMaker" });
    await t.mutation(store.renamePrivateLeague, { entry: craig, league, name: "Office Rift" });
    expect(await kinds(t, sam)).toContain("Office Rift");

    await t.mutation(store.removeFromPrivateLeague, { entry: craig, league, member: jo });
    expect(await kinds(t, jo)).toEqual(["overall", "country", "team"]);

    await t.mutation(store.leavePrivateLeague, { entry: sam, league });
    expect(await kinds(t, sam)).toEqual(["overall", "country", "team"]);
    expect(await refusal(t.mutation(store.leavePrivateLeague, { entry: craig, league }))).toEqual({ rule: "makerLeaves" });

    await t.mutation(store.deletePrivateLeague, { entry: craig, league });
    expect(await kinds(t, craig)).toEqual(["overall", "country", "team"]);
    expect(await t.run((ctx) => ctx.db.get(league))).toBeNull();
  });

  test("a manager the maker removes can't rejoin; one who left can", async () => {
    const { t, t1 } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    const sam = await entryOf(t, "Sam's Squad", "GB", t1);
    const jo = await entryOf(t, "Jo's Rift", "GB", t1);
    const { league, code } = await make(t, craig);
    for (const entry of [sam, jo]) await t.mutation(store.joinPrivateLeague, { entry, code, settings: FPL_LIKE });

    await t.mutation(store.removeFromPrivateLeague, { entry: craig, league, member: jo });
    expect(await refusal(t.mutation(store.joinPrivateLeague, { entry: jo, code, settings: FPL_LIKE }))).toEqual({ rule: "removed" });
    expect(await kinds(t, jo)).toEqual(["overall", "country", "team"]);

    await t.mutation(store.leavePrivateLeague, { entry: sam, league });
    await t.mutation(store.joinPrivateLeague, { entry: sam, code, settings: FPL_LIKE });
    expect(await kinds(t, sam)).toContain("Pub League");

    await t.mutation(store.deletePrivateLeague, { entry: craig, league });
    expect(await t.run((ctx) => ctx.db.query("leagueRemovals").collect())).toEqual([]);
  });
});
