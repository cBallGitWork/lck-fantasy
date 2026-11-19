// The admin's Sim page (#398): the sim's date, and its Next day and Play to end, each saying what it
// played: the series and any deadline passed. Play to end skips the replay (Craig, 19 Nov 2026).
import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "../_generated/server";
import { adminKey, requireAdmin } from "./access";
import { isSim, playNextDay, playRest, simClock, type ClockMove } from "./clock";

/** The Sim page: not the sim, a sim whose clock isn't started, or its moment and whether a game is left. */
export type SimState = { sim: false } | { sim: true; now: null } | { sim: true; now: number; gamesLeft: boolean };

/** What a press played: the clock's new moment (null when no game was left), the series it played and
 *  the gameweeks whose deadlines it passed. */
export type Played = { to: number | null; series: number; deadlines: number[] };

export const simState = query({
  args: { key: adminKey },
  handler: async (ctx, { key }): Promise<SimState> => {
    requireAdmin(key);
    if (!isSim()) return { sim: false };
    const clock = await simClock(ctx);
    if (clock === null) return { sim: true, now: null };
    const next = await ctx.db.query("games").withIndex("by_startedAt", (q) => q.gt("startedAt", clock.now)).first();
    return { sim: true, now: clock.now, gamesLeft: next !== null };
  },
});

const pressArgs = { key: adminKey, competition: v.string() };

export const nextDay = mutation({
  args: pressArgs,
  handler: async (ctx, { key, competition }): Promise<Played> => {
    requireAdmin(key);
    return played(ctx, competition, await playNextDay(ctx, competition));
  },
});

export const playToEnd = mutation({
  args: pressArgs,
  handler: async (ctx, { key, competition }): Promise<Played> => {
    requireAdmin(key);
    return played(ctx, competition, await playRest(ctx, competition));
  },
});

/** What a move played: each series counted once, by its game 1, and the competition's deadlines it passed. */
async function played(ctx: QueryCtx, name: string, { from, to }: ClockMove): Promise<Played> {
  if (to === null) return { to, series: 0, deadlines: [] };
  const games = await ctx.db
    .query("games")
    .withIndex("by_startedAt", (q) => q.gt("startedAt", from).lte("startedAt", to))
    .collect();
  return { to, series: games.filter((game) => game.gameNumber === 1).length, deadlines: await deadlinesPassed(ctx, name, from, to) };
}

async function deadlinesPassed(ctx: QueryCtx, name: string, from: number, to: number): Promise<number[]> {
  const competition = await ctx.db.query("competitions").withIndex("by_name", (q) => q.eq("name", name)).unique();
  if (competition === null) return [];
  const seasons = await ctx.db.query("seasons").withIndex("by_competition", (q) => q.eq("competition", competition._id)).collect();
  const passed: number[] = [];
  for (const season of seasons) {
    const gameweeks = await ctx.db.query("gameweeks").withIndex("by_season", (q) => q.eq("season", season._id)).collect();
    passed.push(...gameweeks.filter((gw) => gw.deadline > from && gw.deadline <= to).map((gw) => gw.number));
  }
  return passed.sort((a, b) => a - b);
}
