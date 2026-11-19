// The leagues store's test world: an LCK season, two teams, managers entered into their leagues.
// Multi-dotted, as test.setup.ts, so Convex never deploys it.
import { convexTest } from "convex-test";
import { ConvexError } from "convex/values";
import { expect } from "vitest";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import schema from "../schema";
import { modules } from "../test.setup";
import { LCK_2027, type SeasonFile } from "../world/season";
import type { LeagueRefusal } from "./store";

export const FPL_LIKE = { privateLeagueCap: 25, privateLeagueSize: null }; // fixture values: the real ones are data
export const SEASON = { currentGameweek: 4, lastGameweek: 18 };
export const store = internal.leagues.store;
export const HOUR = 60 * 60 * 1000;

/** The test world, typed by the schema, so a run reads its tables and indexes. */
export type T = Awaited<ReturnType<typeof world>>["t"];

export async function world() {
  const t = convexTest(schema, modules);
  const [t1, gen] = await t.run(async (ctx) => [
    await ctx.db.insert("teams", { name: "T1", oeId: "oe-t1" }),
    await ctx.db.insert("teams", { name: "Gen.G", oeId: "oe-gen" }),
  ]);
  const lck = await t.mutation(internal.world.season.loadSeason, {});
  return { t, t1, gen, lck };
}

/** A made-up LEC season beside the LCK's: euros, Spring and Summer, an Overall that stays whole. */
export const LEC_2027: SeasonFile = {
  ...LCK_2027,
  competition: { name: "LEC", region: "EMEA", timeZone: "Europe/Berlin", currency: "€" },
  splits: [
    { number: 1, name: "Spring" },
    { number: 2, name: "Summer" },
  ],
  settings: { ...LCK_2027.settings, overallSplits: false },
};

/** A manager and their entry, in no league yet: in `season`, the first stored when not given. */
export const newEntry = (t: T, teamName: string, country: string, favouriteTeam: Id<"teams">, season?: Id<"seasons">) =>
  t.run(async (ctx) => {
    const agreed = { at: 0, version: "test" };
    const manager = await ctx.db.insert("managers", { account: `account-${teamName}`, country, agreed });
    return ctx.db.insert("entries", {
      manager,
      season: season ?? (await ctx.db.query("seasons").first())!._id,
      teamName,
      favouriteTeam,
      firstGameweek: 1,
      bank: 0,
    });
  });

/** The same manager's entry in another season, entered into its three leagues. */
export async function secondEntry(t: T, first: Id<"entries">, season: Id<"seasons">, teamName: string, favouriteTeam: Id<"teams">) {
  const entry = await t.run(async (ctx) => {
    const { manager } = (await ctx.db.get(first))!;
    return ctx.db.insert("entries", { manager, season, teamName, favouriteTeam, firstGameweek: 1, bank: 0 });
  });
  await t.mutation(store.enterAutoLeagues, { entry });
  return entry;
}

/** A signed-up manager's entry, entered into its three leagues. */
export async function entryOf(t: T, teamName: string, country: string, favouriteTeam: Id<"teams">) {
  const entry = await newEntry(t, teamName, country, favouriteTeam);
  await t.mutation(store.enterAutoLeagues, { entry });
  return entry;
}

/** Moves the deadline of the entry's first gameweek an hour into the past. */
export const passFirstDeadline = (t: T, entry: Id<"entries">) =>
  t.run(async (ctx) => {
    const { season, firstGameweek } = (await ctx.db.get(entry))!;
    const gameweek = (await ctx.db.query("gameweeks").withIndex("by_season", (q) => q.eq("season", season).eq("number", firstGameweek)).unique())!;
    await ctx.db.patch(gameweek._id, { deadline: Date.now() - HOUR });
  });

export const kinds = async (t: T, entry: Id<"entries">) =>
  (await t.query(store.leaguesOf, { entry })).map((l) => (l.kind === "private" ? l.name : l.kind));

export const make = (t: T, entry: Id<"entries">, name = "Pub League", startGameweek = SEASON.currentGameweek) =>
  t.mutation(store.createPrivateLeague, { entry, name, startGameweek, ...SEASON, settings: FPL_LIKE });

/** The refusal a call throws, as the page gets it. */
export async function refusal(call: Promise<unknown>) {
  const error = await call.then(() => null, (e: unknown) => e);
  expect(error).toBeInstanceOf(ConvexError);
  return (error as ConvexError<LeagueRefusal>).data;
}
