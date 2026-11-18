// The one clock every server read and write takes its "now" from (spec/10, The road to launch, step 1):
// real time on the real site, the stored moment on the sim. On the sim an admin's Next day plays one
// match day, passing its deadline when it comes, and Play to end runs the rest without stopping.
import { v } from "convex/values";
import { internalMutation, internalQuery, type MutationCtx, type QueryCtx } from "../_generated/server";

/** The deployment setting that makes a Convex project the sim: `true` there, unset on the real site. */
export const SIM_SETTING = "FLOL_SIM";

export const isSim = () => process.env[SIM_SETTING] === "true";

/** Now, in ms since the epoch: the real time, or on the sim its stored moment. A sim whose clock was
 *  never started is a broken setup, said so. */
export async function now(ctx: QueryCtx): Promise<number> {
  return isSim() ? (await startedSimClock(ctx)).now : Date.now();
}

/** The first moment of the day after `instant`'s, in `zone`: where a match day ends. */
export function nextMidnight(instant: number, zone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: zone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(instant);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  const midnightAsUtc = Date.UTC(part("year"), part("month") - 1, part("day") + 1);
  // The zone's offset from UTC, read at the guess and once more in case the guess crossed a change.
  const guess = midnightAsUtc - offset(midnightAsUtc, zone);
  return midnightAsUtc - offset(guess, zone);
}

/** How far `zone`'s wall clock runs ahead of UTC at `instant`, in ms. */
function offset(instant: number, zone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(instant);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  const wall = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"), part("second"));
  return wall - Math.floor(instant / 1000) * 1000;
}

/** Now, as the admin's buttons show it. */
export const clockNow = internalQuery({ args: {}, handler: (ctx) => now(ctx) });

/** Sets the sim's clock, such as to the start of its season after a wipe. */
export const startSimClock = internalMutation({
  args: { at: v.number() },
  handler: async (ctx, { at }) => {
    requireSim();
    const clock = await simClock(ctx);
    if (clock === null) await ctx.db.insert("simClock", { now: at });
    else await ctx.db.patch(clock._id, { now: at });
  },
});

/** Next day: the clock moves to the end of the next day a game starts on, in the competition's zone,
 *  passing that day's deadline if it has one. Null, and the clock unmoved, when no game is left. */
export const nextDay = internalMutation({
  args: { competition: v.string() },
  handler: async (ctx, { competition }) => playDay(ctx, await zoneOf(ctx, competition)),
});

/** Play to end: Next day until no game is left. Returns how many match days it played. */
export const playToEnd = internalMutation({
  args: { competition: v.string() },
  handler: async (ctx, { competition }) => {
    const zone = await zoneOf(ctx, competition);
    let days = 0;
    while ((await playDay(ctx, zone)) !== null) days++;
    return days;
  },
});

/** One match day played: the clock's new moment, or null when no game is left. */
async function playDay(ctx: MutationCtx, zone: string): Promise<number | null> {
  const clock = await startedSimClock(ctx);
  const next = await ctx.db.query("games").withIndex("by_startedAt", (q) => q.gt("startedAt", clock.now)).first();
  if (next === null) return null;
  const to = nextMidnight(next.startedAt, zone);
  await ctx.db.patch(clock._id, { now: to });
  return to;
}

function requireSim() {
  if (!isSim()) throw new Error(`The real site's clock is the real time: only the sim (${SIM_SETTING}=true) moves it.`);
}

const simClock = (ctx: QueryCtx) => ctx.db.query("simClock").unique();

async function startedSimClock(ctx: QueryCtx) {
  requireSim();
  const clock = await simClock(ctx);
  if (clock === null) throw new Error("The sim's clock isn't started: run admin/clock:startSimClock.");
  return clock;
}

async function zoneOf(ctx: QueryCtx, name: string): Promise<string> {
  const competition = await ctx.db.query("competitions").withIndex("by_name", (q) => q.eq("name", name)).unique();
  if (competition === null) throw new Error(`No ${name} competition is stored.`);
  return competition.timeZone;
}
