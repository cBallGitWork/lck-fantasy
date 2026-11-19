import { describe, expect, test } from "vitest";
import { FPL_LIKE, HOUR, SEASON, entryOf, kinds, make, newEntry, passFirstDeadline, refusal, store, world } from "./store.setup";

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

  test("a change of country moves the manager to its league until the first gameweek's deadline", async () => {
    const { t, t1 } = await world();
    const craig = await entryOf(t, "Faker Fan", "GB", t1);
    await t.mutation(store.changeCountry, { entry: craig, country: " KR " });
    const country = (await t.query(store.leaguesOf, { entry: craig })).filter((l) => l.kind === "country");
    expect(country).toMatchObject([{ country: "KR", size: 1 }]);
    expect(await refusal(t.mutation(store.changeCountry, { entry: craig, country: " " }))).toEqual({ rule: "noCountry" });

    await passFirstDeadline(t, craig);
    expect(await refusal(t.mutation(store.changeCountry, { entry: craig, country: "GB" }))).toEqual({ rule: "countryFixed" });
    expect(await t.run(async (ctx) => (await ctx.db.query("managers").first())?.country)).toBe("KR");
  });

  test("an entry never entered into its leagues is a broken row: the change says so and changes nothing", async () => {
    const { t, t1, gen } = await world();
    const entry = await newEntry(t, "Faker Fan", "GB", t1);
    await expect(t.mutation(store.changeFavouriteTeam, { entry, team: gen, firstDeadline: Date.now() + HOUR })).rejects.toThrow(
      "isn't in its favourite team's league",
    );
    expect(await t.run(async (ctx) => (await ctx.db.get(entry))?.favouriteTeam)).toBe(t1);
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
