// The sim's season (spec/10, The road to launch; spec/15, The replay; #399): the LCK's 2026 laid out
// as 2027's, from data/lck/2026's plan and Oracle's Elixir's rows. Each stage is the file's split and
// playoffs columns; the Cup is in none, so it is left out. A gameweek is one LCK week, its deadline
// 15 minutes before its first series (spec/10, Gameweeks); 2026's real dates are kept.
import { v } from "convex/values";
import type { Infer } from "convex/values";
import { internalMutation } from "../_generated/server";
import type { OeGame, OeRow } from "../feeds/oraclesElixir";
import { LCK_2027, storeSeason, type SeasonFile } from "./season";
import { split, stage } from "./seasonSettings";
import plan from "../../data/lck/2026/sim-plan.json";
import season2026 from "../../data/lck/2026/season-2026.json";

export const simPlan = v.object({
  note: v.optional(v.string()),
  league: v.string(),
  year: v.number(),
  splits: v.array(split),
  deadlineMinutesBefore: v.number(),
  /** The sim's live settings, over the season's: a quicker read, and how long a replayed game takes. */
  live: v.object({ pollSeconds: v.number(), replaySeconds: v.number() }),
  /** Each stage with its source: the file's `split`, and whether its `playoffs` column is 1. */
  stages: v.array(v.object({ ...stage.fields, source: v.object({ split: v.string(), playoffs: v.boolean() }) })),
});
export type SimPlan = Infer<typeof simPlan>;

/** data/lck/2026's plan, and the season file made from it (convex/world/simSeason.test.ts keeps it true). */
export const SIM_PLAN = plan as SimPlan;
export const LCK_2026_SIM = season2026 as SeasonFile;

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
/** The day an LCK week starts on, as JavaScript counts weekdays (0 is Sunday). */
const MONDAY = 1;

/** Stores the sim's season: its competition, settings, stages and gameweeks. Its games load
 *  through convex/feeds/load.ts's `loadOracleElixir`, fed `simRows`. */
export const loadSimSeason = internalMutation({ args: {}, handler: (ctx) => storeSeason(ctx, LCK_2026_SIM) });

/** The stage a row's game is in; undefined for one the plan leaves out. */
export function stageOf(plan: SimPlan, row: OeRow): SimPlan["stages"][number] | undefined {
  return plan.stages.find((s) => s.source.split === row.split && s.source.playoffs === (row.playoffs === "1"));
}

/** The file's rows the sim plays: its league's, in one of its stages. */
export function simRows(plan: SimPlan, rows: readonly OeRow[]): OeRow[] {
  return rows.filter((row) => row.league === plan.league && stageOf(plan, row) !== undefined);
}

/** The sim's season file: 2027's competition and settings with the plan's live settings, its stages,
 *  and a gameweek for each week a game of a stage starts in, in `zone`'s calendar. No prices yet:
 *  first prices come with the price formula's build (#23). */
export function simSeasonFile(plan: SimPlan, games: readonly OeGame[], base: SeasonFile = LCK_2027): SeasonFile {
  const zone = base.competition.timeZone;
  const weeks = new Map<number, { stage: SimPlan["stages"][number]; firstStart: number }>();
  for (const game of games) {
    const gameStage = stageOf(plan, game.teams[0].raw);
    if (gameStage === undefined) continue;
    const week = weekStart(game.startedAt, zone);
    const held = weeks.get(week);
    if (held !== undefined && held.stage !== gameStage) throw new Error(`The week of ${new Date(week).toISOString().slice(0, 10)} holds two stages.`);
    weeks.set(week, { stage: gameStage, firstStart: Math.min(held?.firstStart ?? Infinity, game.startedAt) });
  }
  const gameweeks = [...weeks.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, { stage: s, firstStart }], i) => ({
      number: i + 1,
      split: s.split,
      deadline: new Date(firstStart - plan.deadlineMinutesBefore * MS_PER_MINUTE).toISOString(),
      state: "toCome" as const,
      stage: s.name,
    }));
  return {
    note: `The LCK's 2026 as the sim plays it, made from data/lck/2026's sim-plan.json and Oracle's Elixir's rows by convex/world/simSeason.ts: change the plan, not this file.`,
    madeUp: false,
    competition: base.competition,
    year: plan.year,
    splits: plan.splits,
    settings: { ...base.settings, live: { ...base.settings.live, ...plan.live } },
    stages: plan.stages.map(({ source: _, ...rest }) => rest),
    gameweeks,
    prices: [],
  };
}

/** The Monday that starts `instant`'s week in `zone`, as that date's UTC midnight: a week's key. */
function weekStart(instant: number, zone: string): number {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(instant)
    .split("-")
    .map(Number);
  const date = Date.UTC(year!, month! - 1, day!);
  const sinceMonday = (new Date(date).getUTCDay() - MONDAY + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  return date - sinceMonday * MS_PER_DAY;
}
