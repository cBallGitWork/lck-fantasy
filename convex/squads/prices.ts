// Prices: first prices from the formula, and each week's move at the deadline (spec/02, First prices,
// The formula and Price moves). Pure: past points and the settings in, prices out. Every amount is
// whole won and every number Craig may tune is a setting, data per competition.
import { sum } from "../../src/parts/util/sum";
import type { Role } from "./squad";

/** spec/02's formula and moves, each a setting. Amounts in won, shares 0 to 1. */
export interface PriceSettings {
  /** How much each past season counts, last season first (The formula, 1). */
  seasonWeights: number[];
  /** Under this many series over those seasons, a pick is a rookie, priced by hand (The formula, 8). */
  minSeries: number;
  /** Own points at this percentile or below count as 0 (The formula, 1). */
  lowPercentile: number;
  /** Team strength's share of the blend; own record has the rest (The formula, 3). */
  teamWeight: number;
  /** The line's power: 1 is straight (The formula, 4). */
  bend: number;
  /** The cheapest first-team pick, coaches too, and the price no move takes a pick below. */
  floor: number;
  /** The dearest player the line gives (The formula, 4). */
  top: number;
  /** The dearest coach the coaches' line gives (The formula, 7). */
  coachTop: number;
  /** Every first price is a whole number of these (The formula, 4). */
  rounding: number;
  /** No first price inside this, low and high edge (The formula, 5). */
  gap: { low: number; high: number };
  /** Stars, and each role's starters and the coaches, at least this apart (The formula, 5 and 6). */
  spacing: number;
  /** An academy player's price, by hand (The formula, 8). */
  academy: number;
  /** Form is points per series over this many of his last gameweeks (Price moves). */
  formWeeks: number;
  /** A gap of this or more between form and price moves him (Price moves). */
  formGap: number;
  /** One move, up or down, of any kind (Price moves). */
  step: number;
  /** Net transfers in or out reaching this share of managers move him (Price moves). */
  transferShare: number;
  /** Owned by under this share of managers, with form not above his price, he falls (Price moves). */
  lowOwnership: number;
}

/** A pick going into first prices. */
export interface FirstPriceInput {
  /** A `pickKey`. */
  key: string;
  role: Role;
  /** His current team. */
  teamId: string;
  /** His points in each series, one list per past season, last season first. */
  seasonPoints: number[][];
  /** Series he played for his current team: the most-played in a role is its starter. */
  played: number;
  /** A price Craig set by hand, in won: it stands. */
  byHand?: number;
  /** An academy player: priced at the academy price. */
  academy?: boolean;
}

/** Where the line runs, from first prices; weekly form goes through the same line (Price moves). */
export interface PriceLine {
  ownLow: number;
  ownHigh: number;
  teamLow: number;
  teamHigh: number;
  coachLow: number;
  coachHigh: number;
  /** The best player's blend: his price is the top. */
  topBlend: number;
}

/** A pick's proposal: its price in won, or null for a rookie Craig prices by hand; and the team
 *  strength his form is priced with each week. */
export interface FirstPrice {
  key: string;
  won: number | null;
  teamShare: number;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const scale = (x: number, low: number, high: number) => (high > low ? clamp01((x - low) / (high - low)) : 1);
const mean = (xs: readonly number[]) => sum(xs) / xs.length;
const roundTo = (x: number, unit: number) => Math.round(x / unit) * unit;

/** Weighted mean over the seasons that have a value, last season first; undefined with none. */
function weighted(weights: readonly number[], values: readonly (number | undefined)[]): number | undefined {
  const pairs = values.flatMap((v, i) => (v === undefined ? [] : [[weights[i] ?? 0, v] as const]));
  const total = sum(pairs.map(([w]) => w));
  return total === 0 ? undefined : sum(pairs.map(([w, v]) => w * v)) / total;
}

/** A pick's blend, 0 to 1: a coach on his own points, a player on own record and team strength. */
function blend(line: PriceLine, settings: PriceSettings, pointsPerSeries: number, teamShare: number, isCoach: boolean): number {
  if (isCoach) return scale(pointsPerSeries, line.coachLow, line.coachHigh);
  const own = scale(pointsPerSeries, line.ownLow, line.ownHigh);
  return (1 - settings.teamWeight) * own + settings.teamWeight * scale(teamShare, line.teamLow, line.teamHigh);
}

/** A price on the line, before the gap, the stars and the spacing: from the floor to the top (or
 *  the coaches' top), rounded. Form goes through this too (Price moves). */
export function linePrice(line: PriceLine, settings: PriceSettings, pointsPerSeries: number, teamShare: number, isCoach: boolean): number {
  const b = blend(line, settings, pointsPerSeries, teamShare, isCoach);
  const share = isCoach ? b : line.topBlend > 0 ? clamp01(b / line.topBlend) : 0;
  const top = isCoach ? settings.coachTop : settings.top;
  return Math.max(settings.floor, roundTo(settings.floor + (top - settings.floor) * share ** settings.bend, settings.rounding));
}

/** A price inside the gap goes to its nearer edge (The formula, 5). */
function outOfGap(won: number, { low, high }: PriceSettings["gap"]): number {
  if (won <= low || won >= high) return won;
  return won - low < high - won ? low : high;
}

/**
 * spec/02's formula (The formula, 1 to 8): each pick's proposed first price, which Craig then sets
 * by hand, and the line weekly form is priced on. `teamShares` is each team's share of series won,
 * one per past season, last season first (undefined where it didn't play), or tier lists' or
 * bookmakers' numbers in its place.
 */
export function firstPrices(
  picks: readonly FirstPriceInput[],
  teamShares: ReadonlyMap<string, readonly (number | undefined)[]>,
  settings: PriceSettings,
): { prices: FirstPrice[]; line: PriceLine } {
  const lastSeason = [...teamShares.values()].flatMap((shares) => (shares[0] === undefined ? [] : [shares[0]])).sort((a, b) => a - b);
  const medianShare = lastSeason[Math.floor(lastSeason.length / 2)] ?? 0;
  const teamShareOf = (teamId: string) => weighted(settings.seasonWeights, teamShares.get(teamId) ?? []) ?? medianShare;
  const rows = picks.map((pick) => {
    const series = sum(pick.seasonPoints.map((xs) => xs.length));
    const pointsPerSeries = weighted(settings.seasonWeights, pick.seasonPoints.map((xs) => (xs.length ? mean(xs) : undefined)));
    const rookie = pick.academy !== true && pick.byHand === undefined && series < settings.minSeries;
    return { pick, pointsPerSeries: pointsPerSeries ?? 0, teamShare: teamShareOf(pick.teamId), formula: !rookie && pick.academy !== true };
  });
  const priced = rows.filter((r) => r.formula);
  const players = priced.filter((r) => r.pick.role !== "coach");
  const coaches = priced.filter((r) => r.pick.role === "coach");
  const own = players.map((r) => r.pointsPerSeries).sort((a, b) => a - b);
  const shares = players.map((r) => r.teamShare);
  const coachPoints = coaches.map((r) => r.pointsPerSeries);
  const line: PriceLine = {
    ownLow: own[Math.floor(settings.lowPercentile * (own.length - 1))] ?? 0,
    ownHigh: own.at(-1) ?? 0,
    teamLow: Math.min(...shares),
    teamHigh: Math.max(...shares),
    coachLow: Math.min(...coachPoints),
    coachHigh: Math.max(...coachPoints),
    topBlend: 0,
  };
  line.topBlend = Math.max(0, ...players.map((r) => blend(line, settings, r.pointsPerSeries, r.teamShare, false)));

  const won = new Map<string, number>();
  for (const r of priced) won.set(r.pick.key, outOfGap(linePrice(line, settings, r.pointsPerSeries, r.teamShare, r.pick.role === "coach"), settings.gap));
  const byHand = (r: (typeof rows)[number]) => r.pick.byHand !== undefined;

  // Stars, dearest first, a step apart, starting a step under the dearest hand price (The formula, 5).
  const handTop = Math.max(0, ...picks.map((p) => p.byHand ?? 0));
  const stars = priced
    .filter((r) => r.pick.role !== "coach" && !byHand(r) && won.get(r.pick.key)! >= settings.gap.high)
    .sort((a, b) => won.get(b.pick.key)! - won.get(a.pick.key)! || b.pointsPerSeries - a.pointsPerSeries);
  let next = handTop > 0 ? Math.min(settings.top, handTop - settings.spacing) : settings.top;
  for (const star of stars) {
    won.set(star.pick.key, Math.max(settings.gap.high, next));
    next -= settings.spacing;
  }

  // Each role's starters, and the coaches, a step apart from the cheapest up, never into the gap
  // (The formula, 6).
  for (const role of new Set(priced.map((r) => r.pick.role))) {
    const starterOf = new Map<string, (typeof priced)[number]>();
    for (const r of priced.filter((x) => x.pick.role === role)) {
      const held = starterOf.get(r.pick.teamId);
      if (!held || r.pick.played > held.pick.played) starterOf.set(r.pick.teamId, r);
    }
    const below = [...starterOf.values()]
      .filter((r) => !byHand(r) && won.get(r.pick.key)! <= settings.gap.low)
      .sort((a, b) => won.get(a.pick.key)! - won.get(b.pick.key)! || a.pointsPerSeries - b.pointsPerSeries);
    below.forEach((r, i) => {
      if (i === 0) return;
      const under = won.get(below[i - 1]!.pick.key)!;
      won.set(r.pick.key, Math.min(settings.gap.low, Math.max(won.get(r.pick.key)!, under + settings.spacing)));
    });
    // Those pushed against the gap's foot are taken down instead, a step apart.
    for (let i = below.length - 2; i >= 0; i--) {
      const over = won.get(below[i + 1]!.pick.key)!;
      won.set(below[i]!.pick.key, Math.min(won.get(below[i]!.pick.key)!, over - settings.spacing));
    }
  }

  const prices = rows.map((r) => ({
    key: r.pick.key,
    won: r.pick.byHand ?? (r.pick.academy ? settings.academy : r.formula ? won.get(r.pick.key)! : null),
    teamShare: r.teamShare,
  }));
  return { prices, line };
}

/** A pick's week, going into the deadline's move. */
export interface PriceWeek {
  key: string;
  role: Role;
  /** His price now, in won. */
  won: number;
  /** His team strength, from first prices. */
  teamShare: number;
  /** His points in each of his series so far, one list per gameweek, oldest first, reaching back
   *  into earlier splits and seasons: form reads the last few weeks he played. */
  weekSeriesPoints: number[][];
  /** Whether he played a series this gameweek: form moves only a pick who did. */
  playedThisWeek: boolean;
  /** Managers who bought him this gameweek, less those who sold him. */
  netTransfers: number;
  /** Managers whose squad holds him at the deadline. */
  owners: number;
}

/** His form price: points per series over his last few gameweeks with a series, through the first
 *  prices' line; undefined before his first series. */
export function formPrice(week: PriceWeek, line: PriceLine, settings: PriceSettings): number | undefined {
  const recent = week.weekSeriesPoints.filter((w) => w.length > 0).slice(-settings.formWeeks).flat();
  if (recent.length === 0) return undefined;
  return linePrice(line, settings, mean(recent), week.teamShare, week.role === "coach");
}

/** Which way a pick moves this week: +1, -1 or 0. Transfers first, then form, then low ownership;
 *  one step at most (spec/02, Price moves). */
export function priceMove(week: PriceWeek, managers: number, line: PriceLine, settings: PriceSettings): -1 | 0 | 1 {
  if (managers > 0 && Math.abs(week.netTransfers) >= settings.transferShare * managers) return week.netTransfers > 0 ? 1 : -1;
  const form = formPrice(week, line, settings);
  if (week.playedThisWeek && form !== undefined && Math.abs(form - week.won) >= settings.formGap) return form > week.won ? 1 : -1;
  if (managers > 0 && week.owners < settings.lowOwnership * managers && (form === undefined || form <= week.won)) return -1;
  return 0;
}

/**
 * Next week's prices at the deadline, keyed by `pickKey`: each pick moves a step at most, and never
 * below the floor; one already under it, as an academy player is, never falls. `managers` is every
 * manager with a saved squad in the competition at the deadline.
 */
export function nextPrices(weeks: readonly PriceWeek[], managers: number, line: PriceLine, settings: PriceSettings): Map<string, number> {
  return new Map(
    weeks.map((week) => {
      const moved = week.won + priceMove(week, managers, line, settings) * settings.step;
      return [week.key, Math.max(moved, Math.min(week.won, settings.floor))];
    }),
  );
}
