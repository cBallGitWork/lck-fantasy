// A competition's season as data (docs/data-model.md, The real world and Gameweeks): its settings,
// splits, gameweeks and prices, loaded from data/lck/. A load run again updates each row in place.
import { v, type Infer } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { internalMutation, internalQuery, type MutationCtx } from "../_generated/server";
import { competitionFields, gameweekState, pricedPick, seasonSettings, split } from "../schema";
import season2027 from "../../data/lck/season-2027.json";

/** A season file in data/lck/, such as season-2027.json. */
export const seasonFile = v.object({
  note: v.optional(v.string()),
  madeUp: v.boolean(),
  competition: v.object(competitionFields),
  year: v.number(),
  splits: v.array(split),
  settings: seasonSettings,
  /** Each deadline in ISO 8601 UTC, such as 2027-01-20T07:45:00Z. */
  gameweeks: v.array(v.object({ number: v.number(), split: v.number(), deadline: v.string(), state: gameweekState })),
  prices: v.array(v.object({ fromGameweek: v.number(), picks: v.array(v.object({ ...pricedPick, won: v.number() })) })),
});
export type SeasonFile = Infer<typeof seasonFile>;

/** The LCK's 2027 season as data/lck holds it. The tables' validators check it as it is written. */
export const LCK_2027 = season2027 as SeasonFile;

/** Store a season file, or by default data/lck's 2027 season. Run again, it updates each row in place:
 *  a competition by name, a season by year, a gameweek by number, a price by pick and gameweek. */
export const loadSeason = internalMutation({
  args: { data: v.optional(seasonFile) },
  handler: async (ctx, { data = LCK_2027 }) => {
    const competition = await upsertCompetition(ctx, data.competition);
    const season = await upsertSeason(ctx, competition, data);
    await upsertGameweeks(ctx, season, data.gameweeks);
    await upsertPrices(ctx, season, data.prices);
    return season;
  },
});

/** A season's settings, splits, gameweeks in number order and prices; null before it is loaded. */
export const seasonOf = internalQuery({
  args: { competition: v.string(), year: v.number() },
  handler: async (ctx, args) => {
    const competition = await ctx.db.query("competitions").withIndex("by_name", (q) => q.eq("name", args.competition)).unique();
    if (competition === null) return null;
    const season = await ctx.db
      .query("seasons")
      .withIndex("by_competition", (q) => q.eq("competition", competition._id).eq("year", args.year))
      .unique();
    if (season === null) return null;
    const gameweeks = await ctx.db.query("gameweeks").withIndex("by_season", (q) => q.eq("season", season._id)).collect();
    const prices = await ctx.db.query("prices").withIndex("by_season", (q) => q.eq("season", season._id)).collect();
    return {
      competition: { name: competition.name, region: competition.region, timeZone: competition.timeZone },
      year: season.year,
      madeUp: season.madeUp,
      splits: season.splits,
      settings: season.settings,
      gameweeks: gameweeks.map(({ number, split, deadline, state }) => ({ number, split, deadline, state })),
      prices: prices.map(({ team, role, handle, fromGameweek, won }) => ({ team, role, handle, fromGameweek, won })),
    };
  },
});

async function upsertCompetition(ctx: MutationCtx, competition: SeasonFile["competition"]): Promise<Id<"competitions">> {
  const existing = await ctx.db.query("competitions").withIndex("by_name", (q) => q.eq("name", competition.name)).unique();
  if (existing === null) return ctx.db.insert("competitions", competition);
  await ctx.db.patch(existing._id, competition);
  return existing._id;
}

async function upsertSeason(ctx: MutationCtx, competition: Id<"competitions">, data: SeasonFile): Promise<Id<"seasons">> {
  const fields = { competition, year: data.year, splits: data.splits, settings: data.settings, madeUp: data.madeUp };
  const existing = await ctx.db
    .query("seasons")
    .withIndex("by_competition", (q) => q.eq("competition", competition).eq("year", data.year))
    .unique();
  if (existing === null) return ctx.db.insert("seasons", fields);
  await ctx.db.patch(existing._id, fields);
  return existing._id;
}

async function upsertGameweeks(ctx: MutationCtx, season: Id<"seasons">, gameweeks: SeasonFile["gameweeks"]) {
  for (const { number, split, deadline, state } of gameweeks) {
    const fields = { season, number, split, deadline: utcMs(deadline), state };
    const existing = await ctx.db
      .query("gameweeks")
      .withIndex("by_season", (q) => q.eq("season", season).eq("number", number))
      .unique();
    if (existing === null) await ctx.db.insert("gameweeks", fields);
    else await ctx.db.patch(existing._id, fields);
  }
}

async function upsertPrices(ctx: MutationCtx, season: Id<"seasons">, prices: SeasonFile["prices"]) {
  for (const { fromGameweek, picks } of prices) {
    const stored = await ctx.db
      .query("prices")
      .withIndex("by_season", (q) => q.eq("season", season).eq("fromGameweek", fromGameweek))
      .collect();
    const byPick = new Map(stored.map((row) => [pricedPickKey(row), row._id]));
    const seen = new Set<string>();
    for (const pick of picks) {
      const key = pricedPickKey(pick);
      if ((pick.role === "coach") !== (pick.handle === undefined)) throw new Error(`Price ${key}: a coach has no handle and a player has one.`);
      if (seen.has(key)) throw new Error(`Price ${key} is twice in gameweek ${fromGameweek}.`);
      seen.add(key);
      const id = byPick.get(key);
      if (id === undefined) await ctx.db.insert("prices", { season, fromGameweek, ...pick });
      else await ctx.db.patch(id, { won: pick.won });
    }
  }
}

/** A price row's pick, apart from every other in its season and gameweek. */
const pricedPickKey = (pick: { team: string; role: string; handle?: string }) => `${pick.team}:${pick.role}:${pick.handle ?? ""}`;

/** An ISO 8601 time with its zone as ms since the epoch; throws on one that isn't. */
function utcMs(iso: string): number {
  const ms = Date.parse(iso);
  if (!/(Z|[+-]\d\d:\d\d)$/.test(iso) || Number.isNaN(ms)) throw new Error(`Deadline ${iso} is not an ISO time with its zone.`);
  return ms;
}
