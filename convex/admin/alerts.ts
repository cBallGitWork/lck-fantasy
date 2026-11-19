// Admin alerts (spec/11, Live): what an admin must fix, such as the live feed going down. Each is a
// stored row on the admin's list; the first of a match day also emails the admin through Resend, and
// later ones that day only add rows.
import { internal } from "../_generated/api";
import { internalQuery, type MutationCtx } from "../_generated/server";
import { nextMidnight, now } from "./clock";

/** The email's subject: the message itself is its body. */
export const ALERT_SUBJECT = "Flol admin alert";
/** How many of the newest alerts the admin's list shows. */
const LIST_LENGTH = 100;

/** Stores an alert, dated in the competition's `zone`; the first of its match day emails the admin. */
export async function raiseAlert(ctx: MutationCtx, message: string, zone: string): Promise<void> {
  const at = await now(ctx);
  const matchDayEnd = nextMidnight(at, zone);
  const earlier = await ctx.db.query("alerts").withIndex("by_matchDayEnd", (q) => q.eq("matchDayEnd", matchDayEnd)).first();
  await ctx.db.insert("alerts", { at, matchDayEnd, message });
  if (earlier === null) await ctx.scheduler.runAfter(0, internal.outbound.email.emailAdmin, { subject: ALERT_SUBJECT, text: message });
}

/** The admin's list: the newest alerts first. Internal, so only an admin, from the Convex dashboard, reads it. */
export const alerts = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("alerts").order("desc").take(LIST_LENGTH);
    return rows.map(({ at, message }) => ({ at, message }));
  },
});
