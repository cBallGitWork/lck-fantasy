// A manager's feed (spec/14-following.md, The feed): for each manager they follow, their moves at
// the deadline and how each swap is doing, their points at the end of each series, and a big Carry.
import type { Transfer } from "../squads/budget";
import type { BuffEffect } from "../squads/buffs";
import { lineupPoints } from "../squads/carry";
import { pickKey, type Pick, type ScoringPick } from "../squads/squad";
import { followedBy, type Follows } from "./follows";

export interface FeedSettings {
  /** A Carry scoring this many or more in a series, after the multiplier, is a big Carry: 20 (spec/14). */
  bigCarryPoints: number;
  carryMultiplier: number;
}

/** A finished series of the gameweek: each pick who played in it, by `pickKey`, with their series points. */
export interface FinishedSeries {
  id: string;
  finishedAt: number;
  points: ReadonlyMap<string, number>;
}

export interface FeedGameweek {
  deadline: number;
  series: readonly FinishedSeries[];
}

/** One manager's gameweek: the line-up that scores, who takes the multiplier, and their moves. */
export interface ManagerWeek {
  managerId: string;
  lineup: readonly ScoringPick[];
  /** Player ids taking the multiplier (`carryingPlayers`). */
  carrying: ReadonlySet<string>;
  transfers: readonly Transfer[];
  buff: BuffEffect | null;
}

export interface Swap {
  out: Pick;
  in: Pick;
  /** The player in's points less the player out's, over the series finished so far. */
  soFar: number;
}

export type FeedItem =
  | { kind: "moves"; managerId: string; at: number; buff: BuffEffect | null; swaps: Swap[] }
  | { kind: "seriesPoints"; managerId: string; at: number; seriesId: string; points: number }
  | { kind: "bigCarry"; managerId: string; at: number; seriesId: string; pick: Pick; points: number };

/** The feed `viewer` sees for a gameweek, newest first. */
export function feed(
  viewer: string,
  follows: Follows,
  gameweek: FeedGameweek,
  weeks: readonly ManagerWeek[],
  settings: FeedSettings,
): FeedItem[] {
  const shown = new Set(followedBy(follows, viewer));
  const series = [...gameweek.series].sort((a, b) => a.finishedAt - b.finishedAt);
  const items: FeedItem[] = [];
  for (const week of weeks.filter((w) => shown.has(w.managerId))) {
    items.push(movesItem(week, gameweek.deadline, series));
    for (const one of series) items.push(...seriesItems(week, one, settings));
  }
  return items.sort((a, b) => b.at - a.at);
}

function movesItem(week: ManagerWeek, deadline: number, series: readonly FinishedSeries[]): FeedItem {
  const pointsSoFar = (pick: Pick) => series.reduce((sum, one) => sum + (one.points.get(pickKey(pick)) ?? 0), 0);
  const swaps = week.transfers.map((transfer) => ({
    out: transfer.out,
    in: transfer.in,
    soFar: pointsSoFar(transfer.in) - pointsSoFar(transfer.out),
  }));
  return { kind: "moves", managerId: week.managerId, at: deadline, buff: week.buff, swaps };
}

/** The manager's points from one series, and any big Carry in it; nothing when none of their
 *  line-up played in it. */
function seriesItems(week: ManagerWeek, series: FinishedSeries, settings: FeedSettings): FeedItem[] {
  const played = week.lineup.filter((scoring) => series.points.has(pickKey(scoring.pick)));
  if (played.length === 0) return [];
  const slots = lineupPoints(played, series.points, week.carrying, settings.carryMultiplier);
  const at = series.finishedAt;
  const items: FeedItem[] = [
    {
      kind: "seriesPoints",
      managerId: week.managerId,
      at,
      seriesId: series.id,
      points: slots.reduce((sum, slot) => sum + slot.points, 0),
    },
  ];
  for (const slot of slots) {
    const isCarry = slot.pick.role !== "coach" && week.carrying.has(slot.pick.id);
    if (isCarry && slot.points >= settings.bigCarryPoints) {
      items.push({ kind: "bigCarry", managerId: week.managerId, at, seriesId: series.id, pick: slot.pick, points: slot.points });
    }
  }
  return items;
}
