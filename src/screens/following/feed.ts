// What the Following page shows, as plain data and plain functions, so each control is tested
// without a browser. The backend feeds `FollowingData` later (#89, #90); the page takes it as props.
import type { BuffName, TeamCode } from "../../fixtures/week3";
import { type Score, signed } from "../../parts";

export interface Manager {
  id: string;
  name: string;
  team: string;
}

/** The trucks a manager sends; a sponsor truck sends itself. */
export type SentKind = "coffee" | "protest";

export interface When {
  local: string;
  kst: string;
}

/** A player's points in a series; `carry` when he took the multiplier, with his points before it. */
export interface SeriesPlayer {
  name: string;
  points: number;
  carry?: { before?: number };
}

/** A followed manager's points at the end of a series, his players in role order. */
export interface SeriesItem {
  kind: "series";
  id: string;
  manager: Manager;
  points: number;
  home: TeamCode;
  away: TeamCode;
  score: Score;
  bigCarry?: boolean;
  players: SeriesPlayer[];
  ended: When;
}

export interface Swap {
  out: string;
  in: string;
  /** The player in's points less the player out's, so far. */
  soFar: number;
}

/** A followed manager's moves at the deadline: buff, transfers, the points taken, each swap so far. */
export interface DeadlineItem {
  kind: "deadline";
  id: string;
  manager: Manager;
  buff?: BuffName;
  transfers: number;
  /** Points taken for extra transfers (6 shows as −6). */
  hit?: number;
  swaps: Swap[];
}

export type FeedItem = SeriesItem | DeadlineItem;

export interface FeedWeek {
  week: number;
  final: boolean;
  /** The week's deadline, once, under its head, when it has deadline rows. */
  deadline?: When;
  /** Its rows can be trucked: the live week, or last week's until the next starts (spec/14). */
  truckable: boolean;
  /** Newest first. */
  items: FeedItem[];
}

export interface TruckLine {
  id: string;
  kind: SentKind;
  /** Filled with the receiver's numbers. */
  text: string;
}

/** What a picker needs of a manager you can truck: the week so far and the lines that fit it. */
export interface TruckReceiver {
  pointsSoFar: number;
  lines: TruckLine[];
}

export type ReceivedTruck =
  | { id: string; kind: SentKind; text: string; from: Manager }
  | { id: string; kind: "sponsor"; text: string; league: string; sponsor: string };

export interface FollowingData {
  /** The gameweek trucks are sent and parked for. */
  week: number;
  feed: FeedWeek[];
  requests: Manager[];
  trucks: ReceivedTruck[];
  following: Manager[];
  followers: Manager[];
  /** How many a manager may follow, data per competition (spec/14). */
  followCap: number;
  /** The Carry's multiplier, data per competition. */
  carryMultiplier: number;
  /** The truck you have sent each manager this week, by manager id. */
  sent: Record<string, SentKind>;
  receivers: Record<string, TruckReceiver>;
}

export const TRUCK_WORD: Record<SentKind, string> = { coffee: "Coffee", protest: "Protest" };
export const TRUCK_HANGUL: Record<SentKind, string> = { coffee: "커피차", protest: "시위 트럭" };
export const TRUCK_KINDS: readonly SentKind[] = ["coffee", "protest"];

/** Swaps a deadline row lists before `+ 2 more` (the picture). */
export const SWAPS_SHOWN = 3;

/** `Limitless, 5 transfers`, `2 transfers, −6`, `no transfers`. */
export function movesSummary(item: DeadlineItem): string {
  const transfers = item.transfers === 0 ? "no transfers" : `${item.transfers} transfer${item.transfers === 1 ? "" : "s"}`;
  return [item.buff, transfers, item.hit ? signed(-item.hit) : undefined].filter(Boolean).join(", ");
}

/** `Kiin 5 · ucal 2 (Carry) · Faker 18 (12 × 1.5)`. */
export function playersLine(players: SeriesPlayer[], multiplier: number): string {
  return players
    .map((p) => {
      if (!p.carry) return `${p.name} ${p.points}`;
      const note = p.carry.before === undefined ? "Carry" : `${p.carry.before} × ${multiplier}`;
      return `${p.name} ${p.points} (${note})`;
    })
    .join(" · ");
}

/** A picker's line under its title: `Deft Tomorrow · Week 3 · 31 pts so far, no transfers`. */
export function receiverLine(data: FollowingData, manager: Manager): string {
  const moves = data.feed
    .find((w) => w.week === data.week)
    ?.items.find((i): i is DeadlineItem => i.kind === "deadline" && i.manager.id === manager.id);
  const points = data.receivers[manager.id]?.pointsSoFar;
  const soFar = [points !== undefined && `${points} pts so far`, moves && movesSummary(moves)].filter(Boolean).join(", ");
  return [manager.team, `Week ${data.week}`, soFar].join(" · ");
}

// The page's controls, each a step from one FollowingData to the next.

const without = (list: Manager[], id: string) => list.filter((m) => m.id !== id);

/** Accepting a request makes its sender a follower. */
export function accept(data: FollowingData, id: string): FollowingData {
  const asker = data.requests.find((m) => m.id === id);
  if (!asker) return data;
  return { ...data, requests: without(data.requests, id), followers: [...data.followers, asker] };
}

export const decline = (data: FollowingData, id: string): FollowingData => ({ ...data, requests: without(data.requests, id) });

/** Unfollowing takes the manager out of Following and their rows out of the feed. */
export function unfollow(data: FollowingData, id: string): FollowingData {
  const feed = data.feed.map((w) => ({ ...w, items: w.items.filter((i) => i.manager.id !== id) })).filter((w) => w.items.length > 0);
  return { ...data, following: without(data.following, id), feed };
}

/** Remove and Block both take a follower off the list; the block itself is the backend's (#89). */
export const removeFollower = (data: FollowingData, id: string): FollowingData => ({ ...data, followers: without(data.followers, id) });

/** One truck per manager a gameweek: a second is refused, never sent silently. */
export function sendTruck(data: FollowingData, id: string, kind: SentKind): FollowingData {
  if (data.sent[id]) throw new Error(`A truck has already gone to ${id} this week.`);
  return { ...data, sent: { ...data.sent, [id]: kind } };
}
