// Reading Riot's live feed (spec/11, Live): one call for a game's latest 10-second window, handed to
// convex/feeds/live.ts, which stores it and books the next read. A failed call is handed over too, so
// a feed that stays down raises an admin alert rather than a silent gap.
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { isSim } from "../admin/clock";
import { errorText } from "../feeds/liveFeed";

/** The feed's latest window for a game, by the feed's game id (docs/research/live-data-sources.md, section 3). */
const LIVE_FEED_WINDOW = "https://feed.lolesports.com/livestats/v1/window/";

export const readLiveGame = internalAction({
  args: { esportsGameId: v.string() },
  handler: async (ctx, { esportsGameId }) => {
    let window: unknown = null;
    let error: string | undefined;
    // The sim reads no feed: its replay answers as the feed would (convex/feeds/replay.ts).
    if (isSim()) {
      try {
        window = await ctx.runQuery(internal.feeds.replay.replayRead, { esportsGameId });
      } catch (e) {
        error = `the replay couldn't be read: ${errorText(e)}`;
      }
      await ctx.runMutation(internal.feeds.live.storeLiveRead, { esportsGameId, window, error });
      return;
    }
    try {
      const response = await fetch(LIVE_FEED_WINDOW + encodeURIComponent(esportsGameId));
      const body = await response.text();
      if (!response.ok) error = `the feed answered ${response.status}`;
      else if (body === "") error = "the feed sent no window";
      else window = JSON.parse(body);
    } catch (e) {
      error = `the feed couldn't be read: ${errorText(e)}`;
    }
    await ctx.runMutation(internal.feeds.live.storeLiveRead, { esportsGameId, window, error });
  },
});
