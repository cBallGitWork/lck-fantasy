// A live game's provisional stats, in the scoring's shape (spec/11, Live). A live query, so the
// browser's points move as each reading lands.
import { v } from "convex/values";
import { query } from "../_generated/server";
import { livePlayerStats, liveTeamStats } from "../feeds/liveFeed";

/** Each player's and team's live lines, by the feed's game id. Null before the first reading: no
 *  live points. A feed that went down keeps its last reading, so points shown stay until final. */
export const liveGame = query({
  args: { esportsGameId: v.string() },
  handler: async (ctx, { esportsGameId }) => {
    const row = await ctx.db.query("liveFrames").withIndex("by_esportsGameId", (q) => q.eq("esportsGameId", esportsGameId)).unique();
    const reading = row?.reading ?? null;
    if (row === null || reading === null) return null;
    return {
      state: row.state,
      players: reading.players.map((p) => ({
        esportsPlayerId: p.esportsPlayerId,
        name: p.name,
        teamId: p.teamId,
        stats: livePlayerStats(reading, p.participantId),
      })),
      teams: reading.teams.map((t) => ({ teamId: t.teamId, stats: liveTeamStats(reading, t.teamId) })),
    };
  },
});
