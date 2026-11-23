// The end-of-season report (spec/10, The road to launch, step 1; Craig, 19 Nov 2026, #401): the alerts
// left open by kind, the points mismatches the check raised, and the price spread and moves. Read from
// the stored season on the admin section's Report tab.
import { v } from "convex/values";
import { query } from "../_generated/server";
import { competitionByName } from "../world/season";
import { adminPassword, requireAdmin } from "./access";
import type { AlertKind } from "./alertKinds";
import { mismatchCount, openAlertCounts } from "./alerts";
import { priceSpread, type PriceSpread } from "./priceSpread";

export interface SeasonReport {
  /** `LCK 2027`, or null before the competition has a season. */
  season: string | null;
  openAlerts: Record<AlertKind, number>;
  mismatches: number;
  prices: PriceSpread;
}

/** The report on the competition's latest season. */
export const seasonReport = query({
  args: { password: adminPassword, competition: v.string() },
  handler: async (ctx, { password, competition: name }): Promise<SeasonReport> => {
    requireAdmin(password);
    const alerts = { openAlerts: await openAlertCounts(ctx), mismatches: await mismatchCount(ctx) };
    const competition = await competitionByName(ctx, name);
    const season = competition === null
      ? null
      : await ctx.db.query("seasons").withIndex("by_competition", (q) => q.eq("competition", competition._id)).order("desc").first();
    if (season === null) return { season: null, ...alerts, prices: priceSpread([], []) };
    const gameweeks = await ctx.db.query("gameweeks").withIndex("by_season", (q) => q.eq("season", season._id)).collect();
    const prices = await ctx.db.query("prices").withIndex("by_season", (q) => q.eq("season", season._id)).collect();
    return { season: `${name} ${season.year}`, ...alerts, prices: priceSpread(prices, gameweeks.map((gw) => gw.number)) };
  },
});
