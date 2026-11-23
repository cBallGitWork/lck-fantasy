// The admin's Sim page (#398): the sim's date, and its Next day and Play to end, each saying what it
// played: the series and any deadline passed. Next day replays the day's games through the live
// path (convex/feeds/replay.ts); Play to end skips the replay (Craig, 19 Nov 2026). Both wait until
// the day's replays are final (spec/15, The clock).
import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "../_generated/server";
import { replayDay } from "../feeds/replay";
import { competitionByName } from "../world/season";
import { adminPassword, requireAdmin } from "./access";
import { isSim, nextGame, playNextDay, playRest, simClock, type ClockMove } from "./clock";

/** The Sim page: not the sim, a sim whose clock isn't started, or its moment, whether a game is left
 *  and how many games are still replaying. */
export type SimState = { sim: false } | { sim: true; now: null } | { sim: true; now: number; gamesLeft: boolean; replaying: number };

/** What a press played: the clock's new moment (null when no game was left), the series it played and
 *  the gameweeks whose deadlines it passed. */
export type Played = { to: number | null; series: number; deadlines: number[] };

export const simState = query({
  args: { password: adminPassword },
  handler: async (ctx, { password }): Promise<SimState> => {
    requireAdmin(password);
    if (!isSim()) return { sim: false };
    const clock = await simClock(ctx);
    if (clock === null) return { sim: true, now: null };
    return { sim: true, now: clock.now, gamesLeft: (await nextGame(ctx, clock.now)) !== null, replaying: (await replaying(ctx)).length };
  },
});

const pressArgs = { password: adminPassword, competition: v.string() };

export const nextDay = mutation({
  args: pressArgs,
  handler: async (ctx, { password, competition }): Promise<Played> => {
    requireAdmin(password);
    await refuseWhileReplaying(ctx);
    const move = await playNextDay(ctx, competition);
    if (move.to !== null) await replayDay(ctx, competition, move.from, move.to);
    return played(ctx, competition, move);
  },
});

export const playToEnd = mutation({
  args: pressArgs,
  handler: async (ctx, { password, competition }): Promise<Played> => {
    requireAdmin(password);
    await refuseWhileReplaying(ctx);
    return played(ctx, competition, await playRest(ctx, competition));
  },
});

/** The games still being read. On the sim every live game is a replay; one whose feed went down has
 *  stopped and raised its alert, so it holds nothing up. */
const replaying = (ctx: QueryCtx) => ctx.db.query("liveFrames").withIndex("by_state", (q) => q.eq("state", "polling")).collect();

/** Both presses wait until the day's replays are final (spec/15, The clock). */
async function refuseWhileReplaying(ctx: QueryCtx) {
  const games = (await replaying(ctx)).length;
  if (games > 0) throw new Error(`Still replaying ${games} of the day's games: press again once they're final.`);
}

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
  const competition = await competitionByName(ctx, name);
  if (competition === null) return [];
  const seasons = await ctx.db.query("seasons").withIndex("by_competition", (q) => q.eq("competition", competition._id)).collect();
  const passed: number[] = [];
  for (const season of seasons) {
    const gameweeks = await ctx.db.query("gameweeks").withIndex("by_season", (q) => q.eq("season", season._id)).collect();
    passed.push(...gameweeks.filter((gw) => gw.deadline > from && gw.deadline <= to).map((gw) => gw.number));
  }
  return passed.sort((a, b) => a - b);
}
