// Which truck lines fit the receiver's week, and filling a line with the receiver's own numbers
// (spec/14-following.md, Truck lines). What each trigger means is Craig's answer on issue #90:
// the week read is the receiver's last final gameweek, and every number is the competition's data
// (`LineSettings`).
import { formatWon } from "../../src/parts/text/money";
import { isOneOf, PLACEHOLDER_PATTERN, PLACEHOLDERS, type Placeholder, type TruckKind, type TruckLine, type Trigger } from "./lines";

export interface LineSettings {
  /** A Carry on this many or fewer for the week, after the multiplier, blanked: 2. */
  blankPoints: number;
  /** The dearest starter on this many or fewer flopped: 2. */
  flopPoints: number;
  /** A Carry scoring this many or more in one series is a big Carry: 20 (spec/14, The feed). */
  bigCarryPoints: number;
}

export interface WeekPlayer {
  name: string;
  /** In won. */
  price: number;
  /** The week's points, after any multiplier. */
  points: number;
}

export type ScoreBand = "high" | "low" | "middle";

/** The receiver's last final gameweek, as the lines read it. */
export interface ReceiverWeek {
  points: number;
  /** Where the week's score sits in the gameweek's global scores (`scoreBand`). */
  band: ScoreBand;
  /** Points taken off for extra transfers, as a positive number: 4 for one hit. */
  hits: number;
  transfers: number;
  /** Overall rank's move this gameweek: up is positive. */
  rankMove: number;
  buffPlayed: boolean;
  /** The gameweek's global average, for a wasted buff. */
  globalAverage: number;
  /** The Carry's week points and best single series, both after the multiplier. */
  carry: { name: string; points: number; bestSeries: number } | null;
  starters: readonly WeekPlayer[];
  benchPoints: number;
}

/** The private leagues the receiver tops or props up, by name: those shared with the sender, or,
 *  for a sponsor truck, the one league sending it. */
export interface LeagueStanding {
  topOf: readonly string[];
  bottomOf: readonly string[];
}

export interface Receiver {
  team: string;
  /** Null before the receiver's first gameweek is final: only any-week lines show then. */
  week: ReceiverWeek | null;
  leagues: LeagueStanding;
}

/** Where a score sits in the gameweek: the top `share` of every score is high, the bottom `share`
 *  low. A score level with a cut-off counts in the band. */
export function scoreBand(points: number, allScores: readonly number[], share: number): ScoreBand {
  const sorted = [...allScores].sort((a, b) => b - a);
  const size = Math.max(1, Math.ceil(sorted.length * share));
  const highCut = sorted[size - 1];
  const lowCut = sorted[sorted.length - size];
  if (highCut === undefined || lowCut === undefined) throw new Error("No scores for the gameweek.");
  if (points >= highCut) return "high";
  if (points <= lowCut) return "low";
  return "middle";
}

/** The dearest starter, when they scored the flop's points or fewer. */
function flop(week: ReceiverWeek, settings: LineSettings): WeekPlayer | undefined {
  const dearest = Math.max(...week.starters.map((player) => player.price));
  return week.starters.find((player) => player.price === dearest && player.points <= settings.flopPoints);
}

function fitsTrigger(trigger: Trigger, receiver: Receiver, settings: LineSettings): boolean {
  const week = receiver.week;
  if (trigger === "any") return true;
  if (trigger === "top_of_league") return receiver.leagues.topOf.length > 0;
  if (trigger === "bottom_of_league") return receiver.leagues.bottomOf.length > 0;
  if (!week) return false;
  switch (trigger) {
    case "carry_blank":
      return week.carry !== null && week.carry.points <= settings.blankPoints;
    case "carry_big":
      return week.carry !== null && week.carry.bestSeries >= settings.bigCarryPoints;
    case "took_hits":
      return week.hits > 0;
    case "rank_up":
      return week.rankMove > 0;
    case "rank_down":
      return week.rankMove < 0;
    case "bench_outscored_starters":
      return week.benchPoints > week.starters.reduce((sum, player) => sum + player.points, 0);
    case "no_transfer":
      return week.transfers === 0;
    case "buff_played":
      return week.buffPlayed && week.points >= week.globalAverage;
    case "buff_wasted":
      return week.buffPlayed && week.points < week.globalAverage;
    case "price_flop":
      return flop(week, settings) !== undefined;
    case "high_score":
      return week.band === "high";
    case "low_score":
      return week.band === "low";
  }
}

const formatCount = (n: number) => Math.abs(n).toLocaleString("en-GB");

/** A placeholder's value for this receiver and line, or undefined when the week has none. */
function placeholderValue(
  placeholder: Placeholder,
  line: TruckLine,
  receiver: Receiver,
  settings: LineSettings,
): string | undefined {
  const week = receiver.week;
  switch (placeholder) {
    case "team":
      return receiver.team;
    case "league":
      return (line.trigger === "bottom_of_league" ? receiver.leagues.bottomOf : receiver.leagues.topOf)[0];
    case "carryPts":
      return week?.carry ? String(week.carry.points) : undefined;
    case "carry":
      return week?.carry?.name;
    case "hits":
      return week && week.hits > 0 ? String(week.hits) : undefined;
    case "move":
      return week && week.rankMove !== 0 ? formatCount(week.rankMove) : undefined;
    case "bench":
      return week ? String(week.benchPoints) : undefined;
    case "price": {
      const player = week && flop(week, settings);
      return player ? formatWon(player.price).toUpperCase() : undefined;
    }
    case "points":
      return week ? String(week.points) : undefined;
    case "player": {
      // A player in the receiver's squad: their top scorer of the week.
      const best = week ? [...week.starters].sort((a, b) => b.points - a.points)[0] : undefined;
      return best?.name;
    }
  }
}

/** A line with the receiver's numbers in, or undefined when one of its placeholders has no value. */
export function fillLine(line: TruckLine, receiver: Receiver, settings: LineSettings): string | undefined {
  let missing = false;
  const text = line.text.replace(PLACEHOLDER_PATTERN, (_, name: string) => {
    const value = isOneOf(PLACEHOLDERS, name) ? placeholderValue(name, line, receiver, settings) : undefined;
    if (value === undefined) missing = true;
    return value ?? "";
  });
  return missing ? undefined : text;
}

export interface FittingLine {
  line: TruckLine;
  text: string;
}

/** The approved lines of `kind` that fit the receiver's week, filled in; each keeps its weight. */
export function linesThatFit(
  lines: readonly TruckLine[],
  kind: TruckKind,
  receiver: Receiver,
  settings: LineSettings,
): FittingLine[] {
  return lines.flatMap((line) => {
    if (!line.approved || line.kind !== kind || !fitsTrigger(line.trigger, receiver, settings)) return [];
    const text = fillLine(line, receiver, settings);
    return text === undefined ? [] : [{ line, text }];
  });
}

/** One line, drawn by weight; `roll` is in [0, 1). */
export function pickWeighted(fitting: readonly FittingLine[], roll: number): FittingLine | undefined {
  const total = fitting.reduce((sum, one) => sum + one.line.weight, 0);
  let left = roll * total;
  for (const one of fitting) {
    left -= one.line.weight;
    if (left < 0) return one;
  }
  return fitting.at(-1);
}
