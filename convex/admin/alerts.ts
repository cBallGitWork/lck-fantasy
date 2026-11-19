// Admin alerts (spec/11, Live; Craig, 19 Nov 2026, #401): what an admin must fix, such as the live feed
// going down or a test manager's points not matching. Each is a stored row on the admin's list, with
// its kind, what it names, and open until an admin closes it; the first of a match day also emails the
// admin through Resend, and later ones that day only add rows.
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalQuery, mutation, query, type MutationCtx, type QueryCtx } from "../_generated/server";
import { adminPassword, requireAdmin } from "./access";
import { ALERT_KINDS, type AlertKind, type NewAlert } from "./alertKinds";
import { nextMidnight, now } from "./clock";

/** The email's subject: the message itself is its body. */
export const ALERT_SUBJECT = "Flol admin alert";
/** How many of the newest alerts the admin's list shows: an alert is one game's feed going down, so
 *  100 is weeks of them. Older rows stay in the `alerts` table, read in the Convex dashboard's data view. */
const LIST_LENGTH = 100;

/** Stores an alert, dated in the competition's `zone`; the first of its match day emails the admin. */
export async function raiseAlert(ctx: MutationCtx, alert: NewAlert, zone: string): Promise<void> {
  const at = await now(ctx);
  const matchDayEnd = nextMidnight(at, zone);
  const earlier = await ctx.db.query("alerts").withIndex("by_matchDayEnd", (q) => q.eq("matchDayEnd", matchDayEnd)).first();
  await ctx.db.insert("alerts", { at, matchDayEnd, ...alert });
  if (earlier === null) await ctx.scheduler.runAfter(0, internal.outbound.email.emailAdmin, { subject: ALERT_SUBJECT, text: alert.message });
}

/** An alert on the admin's list. */
export interface ListedAlert {
  id: string;
  at: number;
  kind: AlertKind;
  message: string;
  names: string[];
  open: boolean;
}

/** The admin's list: the newest alerts first. */
async function newestAlerts(ctx: QueryCtx): Promise<ListedAlert[]> {
  const rows = await ctx.db.query("alerts").order("desc").take(LIST_LENGTH);
  return rows.map(({ _id, at, kind, message, names, closedAt }) => ({ id: _id, at, kind, message, names, open: closedAt === undefined }));
}

/** The list, as the Convex dashboard and tests read it. */
export const alerts = internalQuery({ args: {}, handler: newestAlerts });

/** The list on the admin section's Alerts tab, for whoever has the admin password. */
export const alertList = query({
  args: { password: adminPassword },
  handler: (ctx, { password }) => {
    requireAdmin(password);
    return newestAlerts(ctx);
  },
});

/** An admin closes an alert once it is dealt with; closing it again changes nothing. */
export const closeAlert = mutation({
  args: { password: adminPassword, alert: v.id("alerts") },
  handler: async (ctx, { password, alert }) => {
    requireAdmin(password);
    const row = await ctx.db.get(alert);
    if (row === null) throw new Error(`Alert ${alert} is gone.`);
    if (row.closedAt === undefined) await ctx.db.patch(alert, { closedAt: await now(ctx) });
  },
});

/** Each kind's open alerts, counted, for the season report. */
export async function openAlertCounts(ctx: QueryCtx): Promise<Record<AlertKind, number>> {
  const open = await ctx.db.query("alerts").withIndex("by_closedAt", (q) => q.eq("closedAt", undefined)).collect();
  const counts = Object.fromEntries(ALERT_KINDS.map((kind) => [kind, 0])) as Record<AlertKind, number>;
  for (const { kind } of open) counts[kind] += 1;
  return counts;
}

/** Every points mismatch raised, open or closed, for the season report. */
export async function mismatchCount(ctx: QueryCtx): Promise<number> {
  return (await ctx.db.query("alerts").withIndex("by_kind", (q) => q.eq("kind", "pointsMismatch")).collect()).length;
}
