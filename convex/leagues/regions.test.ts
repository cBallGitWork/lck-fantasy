import { describe, expect, test } from "vitest";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { FPL_LIKE, HOUR, LEC_2027, SEASON, entryOf, kinds, make, passFirstDeadline, refusal, secondEntry, store, world, type T } from "./store.setup";
import { overallSplits } from "./tables";

describe("one account, two regions (spec/16)", () => {
  /** The LCK world with the LEC's season and two of its teams beside it, and Craig in both. */
  async function twoRegions() {
    const { t, t1, lck } = await world();
    const lec = await t.mutation(internal.world.season.loadSeason, { data: LEC_2027 });
    const [g2, fnc] = await t.run(async (ctx) => [
      await ctx.db.insert("teams", { name: "G2 Esports", oeId: "oe-g2" }),
      await ctx.db.insert("teams", { name: "Fnatic", oeId: "oe-fnc" }),
    ]);
    const craigLck = await entryOf(t, "Faker Fan", "GB", t1);
    const craigLec = await secondEntry(t, craigLck, lec, "Caps Lock", g2);
    return { t, lck, lec, t1, fnc, craigLck, craigLec };
  }

  const entries = (t: T, ids: Id<"entries">[]) => t.run((ctx) => Promise.all(ids.map(async (id) => (await ctx.db.get(id))!)));

  test("one manager holds a team in each region, each with its own name", async () => {
    const { t, lck, lec, craigLck, craigLec } = await twoRegions();
    const [a, b] = await entries(t, [craigLck, craigLec]);
    expect(a!.manager).toBe(b!.manager);
    expect([a!.season, a!.teamName, b!.season, b!.teamName]).toEqual([lck, "Faker Fan", lec, "Caps Lock"]);
  });

  test("the favourite team is each region's entry's; the country is the account's, in both", async () => {
    const { t, t1, fnc, craigLck, craigLec } = await twoRegions();
    await t.mutation(store.changeFavouriteTeam, { entry: craigLec, team: fnc, firstDeadline: Date.now() + HOUR });
    expect((await entries(t, [craigLck, craigLec])).map((e) => e.favouriteTeam)).toEqual([t1, fnc]);
    for (const entry of [craigLck, craigLec]) {
      expect((await t.query(store.leaguesOf, { entry })).filter((l) => l.kind === "country")).toMatchObject([{ country: "GB" }]);
    }
  });

  test("a change of country moves both regions' country leagues, and locks at either entry's first deadline", async () => {
    const { t, craigLck, craigLec } = await twoRegions();
    await t.mutation(store.changeCountry, { entry: craigLec, country: "DE" });
    for (const entry of [craigLck, craigLec]) {
      expect((await t.query(store.leaguesOf, { entry })).filter((l) => l.kind === "country")).toMatchObject([{ country: "DE", size: 1 }]);
    }
    await passFirstDeadline(t, craigLck);
    expect(await refusal(t.mutation(store.changeCountry, { entry: craigLec, country: "GB" }))).toEqual({ rule: "countryFixed" });
  });

  test("an LCK and an LEC entry land in two separate Overall, country and team leagues", async () => {
    const { t, lck, lec, craigLck, craigLec } = await twoRegions();
    const shape = async (entry: Id<"entries">) => (await t.query(store.leaguesOf, { entry })).map((l) => [l.kind, l.season, l.size]);
    expect(await shape(craigLck)).toEqual([["overall", lck, 1], ["country", lck, 1], ["team", lck, 1]]);
    expect(await shape(craigLec)).toEqual([["overall", lec, 1], ["country", lec, 1], ["team", lec, 1]]);
  });

  test("a private league belongs to its region: its code joins no other region's team", async () => {
    const { t, lck, craigLck, craigLec } = await twoRegions();
    const { league, code } = await make(t, craigLck);
    expect((await t.run((ctx) => ctx.db.get(league)))?.season).toBe(lck);
    expect(await refusal(t.mutation(store.joinPrivateLeague, { entry: craigLec, code, settings: FPL_LIKE }))).toEqual({ rule: "otherSeason" });
    expect(await kinds(t, craigLec)).toEqual(["overall", "country", "team"]);
  });

  test("the cap of private leagues counts per region", async () => {
    const { t, craigLck, craigLec } = await twoRegions();
    const one = { privateLeagueCap: 1, privateLeagueSize: null };
    const create = (entry: Id<"entries">, name: string) =>
      t.mutation(store.createPrivateLeague, { entry, name, startGameweek: 4, ...SEASON, settings: one });
    await create(craigLck, "Pub League");
    await create(craigLec, "Kneipe");
    expect(await refusal(create(craigLec, "Two"))).toEqual({ rule: "privateLeagueCap", cap: 1 });
  });

  test("each season holds its splits, whether Overall splits and its money sign, as data", async () => {
    const { t } = await twoRegions();
    const seasonOf = (competition: string) => t.query(internal.world.season.seasonOf, { competition, year: 2027 });
    const [lck, lec] = [(await seasonOf("LCK"))!, (await seasonOf("LEC"))!];
    expect(lec.splits.map((s) => s.name)).toEqual(["Spring", "Summer"]);
    expect([overallSplits(lec.settings), lec.competition.currency]).toEqual([false, "€"]);
    expect([overallSplits(lck.settings), lck.competition.currency]).toEqual([true, "₩"]);
  });

  test("each player's nationality is data, for his flag", async () => {
    const { t } = await twoRegions();
    const caps = await t.run((ctx) => ctx.db.insert("players", { handle: "Caps", oeId: "oe-caps", nationality: "DK" }));
    expect((await t.run((ctx) => ctx.db.get(caps)))?.nationality).toBe("DK");
  });
});
