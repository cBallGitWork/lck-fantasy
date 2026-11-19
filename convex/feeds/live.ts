// Storing the live feed (spec/11, Live): each read's window folded into the game's `liveFrames` row,
// the next read booked at the competition's pace, and an admin alert when the feed stays quiet too
// long. A down feed's reading stays as it was, so points shown stay at the last reading until final.
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import { internalMutation, type MutationCtx } from "../_generated/server";
import { raiseAlert } from "../admin/alerts";
import { now } from "../admin/clock";
import { findSeason } from "../world/season";
import { parseLiveWindow, readWindow } from "./liveFeed";

const MS_PER_SECOND = 1000;
const MINUTE_SECONDS = 60;

/** Starts reading a live game's feed, by the feed's game id: an admin pastes one in. A game already
 *  being read is left as it is; one that finished or went down starts again, its reading kept. */
export const watchLiveGame = internalMutation({
  args: { competition: v.string(), year: v.number(), esportsGameId: v.string() },
  handler: async (ctx, { competition, year, esportsGameId }) => {
    const found = await findSeason(ctx, competition, year);
    if (found === null) throw new Error(`No ${competition} ${year} season is stored.`);
    const row = await liveRow(ctx, esportsGameId);
    if (row?.state === "polling") return;
    const fields = { season: found.season._id, state: "polling" as const, since: await now(ctx), lastError: undefined };
    if (row === null) await ctx.db.insert("liveFrames", { esportsGameId, readAt: null, reading: null, ...fields });
    else await ctx.db.patch(row._id, fields);
    await ctx.scheduler.runAfter(0, internal.outbound.liveFeed.readLiveGame, { esportsGameId });
  },
});

/** One read of the feed: its window, or what went wrong. A new frame updates the reading; a game
 *  quiet for the season's `downAfterSeconds` is down, and an admin is told. */
export const storeLiveRead = internalMutation({
  args: { esportsGameId: v.string(), window: v.any(), error: v.optional(v.string()) },
  handler: async (ctx, { esportsGameId, window, error }) => {
    const row = await liveRow(ctx, esportsGameId);
    if (row === null || row.state !== "polling") return;
    const { live, zone } = await liveSettings(ctx, row);
    let reading = row.reading;
    let problem = error;
    if (problem === undefined) {
      try {
        reading = readWindow(row.reading, parseLiveWindow(window), live.goldLeadAtMinutes);
      } catch (e) {
        problem = e instanceof Error ? e.message : String(e);
      }
    }
    const at = await now(ctx);
    if (reading !== null && reading.lastFrameAt > (row.reading?.lastFrameAt ?? 0)) {
      // The first reading names any player with no lane opponent (spec/11, Live).
      if (row.reading === null) {
        for (const message of reading.alerts) await raiseAlert(ctx, { kind: "noLaneOpponent", message, names: [esportsGameId] }, zone);
      }
      const state = reading.finished ? "finished" : "polling";
      await ctx.db.patch(row._id, { reading, readAt: at, state, lastError: undefined });
      if (state === "polling") await readAgain(ctx, esportsGameId, live.pollSeconds);
      return;
    }
    const quietSince = Math.max(row.since, row.readAt ?? 0);
    if (at - quietSince < live.downAfterSeconds * MS_PER_SECOND) {
      await ctx.db.patch(row._id, { lastError: problem });
      await readAgain(ctx, esportsGameId, live.pollSeconds);
      return;
    }
    await ctx.db.patch(row._id, { state: "down", lastError: problem });
    const why = problem ?? row.lastError;
    const message =
      `Live game ${esportsGameId}: the feed is down, no new reading for ${live.downAfterSeconds / MINUTE_SECONDS} minutes` +
      `${why === undefined ? "" : ` (${why})`}. Its live points stay at the last reading until final.`;
    await raiseAlert(ctx, { kind: "feedDown", message, names: [esportsGameId] }, zone);
  },
});

function liveRow(ctx: MutationCtx, esportsGameId: string) {
  return ctx.db.query("liveFrames").withIndex("by_esportsGameId", (q) => q.eq("esportsGameId", esportsGameId)).unique();
}

/** The season's live settings and its competition's time zone, which dates an alert's match day. */
async function liveSettings(ctx: MutationCtx, row: Doc<"liveFrames">) {
  const season = await ctx.db.get(row.season);
  const competition = season === null ? null : await ctx.db.get(season.competition);
  if (season === null || competition === null) throw new Error(`Live game ${row.esportsGameId}'s season is gone.`);
  return { live: season.settings.live, zone: competition.timeZone };
}

function readAgain(ctx: MutationCtx, esportsGameId: string, pollSeconds: number) {
  return ctx.scheduler.runAfter(pollSeconds * MS_PER_SECOND, internal.outbound.liveFeed.readLiveGame, { esportsGameId });
}
