// A season's settings and its stages' (docs/data-model.md): every value Craig may tune, as data.
import { v } from "convex/values";
import { BUFF_EFFECTS } from "../squads/buffs";
import { PLAYER_ROLES, STARTER_SLOTS } from "../squads/squad";

export const literals = <T extends string>(values: readonly [T, T, ...T[]]) =>
  v.union(...values.map((value) => v.literal(value)));

/** A number for each of `keys`: slot sizes, role minimums. */
const countPer = <K extends string>(keys: readonly K[]) =>
  v.object(Object.fromEntries(keys.map((key) => [key, v.number()])) as Record<K, ReturnType<typeof v.number>>);

/** A season's rules, every value Craig may tune (spec/01, 02, 03, 04, 06, 09): data, never code. */
export const seasonSettings = v.object({
  /** convex/squads/squad.ts's SquadSettings. */
  squad: v.object({
    starterSlots: countPer(STARTER_SLOTS),
    benchSize: v.number(),
    minPerRole: countPer(PLAYER_ROLES),
    teamCap: v.union(v.number(), v.null()),
  }),
  /** In won; null for no budget (spec/10). */
  budget: v.union(v.number(), v.null()),
  /** In won: Auto-fill aims to spend at least the budget less this (spec/09). */
  autoFillGap: v.number(),
  /** convex/squads/transfers.ts's TransferSettings. */
  transfers: v.object({ freePerGameweek: v.number(), bankCap: v.number(), hitPoints: v.number(), freeAfterUnlimited: v.number() }),
  carryMultiplier: v.number(),
  /** Each buff, its multiplier where its effect has one, and how many a manager gets per split (spec/06). */
  buffs: v.array(v.object({ name: v.string(), effect: literals(BUFF_EFFECTS), multiplier: v.optional(v.number()), perSplit: v.number() })),
  teamNameMaxLength: v.number(),
  /** False while it runs as a closed test: only an account with a personal invite signs up (spec/10,
   *  The road to launch). Missing, as on a season stored before it, is open. */
  signUpOpen: v.optional(v.boolean()),
  /** Whether Overall splits into Legend and Rise in the season's second split: the LCK's does, the
   *  LEC's doesn't (spec/08; spec/16). Missing, as on a season stored before it, splits. */
  overallSplits: v.optional(v.boolean()),
  /** Live points (spec/11, Live): how often each live game's feed is read, how long with no new
   *  reading counts as down, and the minute gold lead is read at (the scoring table's
   *  `goldLeadAt15.atMinutes`, held here until the scoring table is stored). Required, unlike
   *  `signUpOpen`: no deployment has stored a season yet, and loading data/lck rewrites settings. */
  live: v.object({
    pollSeconds: v.number(),
    downAfterSeconds: v.number(),
    goldLeadAtMinutes: v.number(),
    /** The sim's only: how long a replayed game takes, about a minute (spec/10, The road to launch). */
    replaySeconds: v.optional(v.number()),
  }),
  /** convex/squads/prices.ts's PriceSettings: the formula and the weekly moves (spec/02). Required,
   *  as `live` is. */
  prices: v.object({
    seasonWeights: v.array(v.number()),
    minSeries: v.number(),
    lowPercentile: v.number(),
    teamWeight: v.number(),
    bend: v.number(),
    floor: v.number(),
    top: v.number(),
    coachTop: v.number(),
    rounding: v.number(),
    gap: v.object({ low: v.number(), high: v.number() }),
    spacing: v.number(),
    academy: v.number(),
    formWeeks: v.number(),
    formGap: v.number(),
    step: v.number(),
    transferShare: v.number(),
    lowOwnership: v.number(),
  }),
});

export const split = v.object({ number: v.number(), name: v.string() });

/** A stage and its settings, which stand in for the season's in its gameweeks (spec/10, Stages and
 *  their settings): the cap on one team's players, the budget in won (null for none), and whether
 *  transfers are unlimited, with no hits. */
export const stage = v.object({
  name: v.string(),
  split: v.number(),
  teamCap: v.union(v.number(), v.null()),
  budget: v.union(v.number(), v.null()),
  unlimitedTransfers: v.boolean(),
});
