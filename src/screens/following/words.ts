// Following's words, named once. Every word a player reads on this screen lives here.

import { CHEER_LABEL, plural } from "../../parts";

export const WORDS = {
  /** The page's title, and its list of the managers you follow. */
  following: "Following",
  hangul: "팔로잉",
  followNoOne: "You follow no one",
  requests: "Requests",
  noRequests: "No requests",
  accept: "Accept",
  decline: "Decline",
  noCheers: "No cheers or jeers this week",
  followers: "Followers",
  unfollow: "Unfollow",
  remove: "Remove",
  block: "Block",
  /** Block's confirm, under its title. */
  blockLine: "They can't follow you again.",
  /** A series row's tag when the Captain's multiplier was the bigger one. */
  bigCaptain: "Big Captain",
  /** Before a series' end time: `Ended Sat 10:20`. */
  ended: "Ended",
  /** After a deadline row's moves, before each swap's points. */
  soFar: "so far",
  /** A received cheer's sender: `Cheer from Minji Park`. */
  from: "from",
  /** A sponsor's cheer, before its league. */
  sponsorCheer: "Sponsor cheer,",
  noTransfers: "no transfers",
  /** In a series row, after the Captain's points when no multiplier sum is shown. */
  captain: "Captain",
  /** The cheer picker's lines, for a reader. */
  line: "Line",
  cancel: "Cancel",
  send: "Send",
} as const;

/** `Block Minji?`: the confirm's title. */
export const blockTitle = (first: string) => `${WORDS.block} ${first}?`;

/** A key's name for a screen reader, where the same key repeats down a list: `Accept Ella Wong`. */
export const named = (key: string, name: string) => `${key} ${name}`;

/** `3 of 50`: how many you follow, of how many you may. */
export const followCount = (n: number, cap: number) => `${n} of ${cap}`;

/** `Week 3`: a feed week's head, and the week in a picker's line. */
export const weekHead = (n: number) => `Week ${n}`;

/** `+ 2 more`: swaps a deadline row doesn't list. */
export const more = (n: number) => `+ ${n} more`;

/** `Cheer sent`. */
export const sent = (kind: string) => `${kind} sent`;

/** `Pub League top`: the league a sponsor's cheer went to the top of. */
export const leagueTop = (league: string) => `${league} top`;

/** `1 transfer`, `5 transfers`. */
export const transfers = (n: number) => plural(n, "transfer");

/** `12 × 1.5`: the Captain's points before the multiplier, and the multiplier. */
export const captainSum = (before: number, multiplier: number) => `${before} × ${multiplier}`;

/** `31 pts so far`: a picker's receiver's week. */
export const ptsSoFar = (points: number) => `${points} pts so far`;

/** The picker's title: `Cheer or jeer Jae Kim`. */
export const pickerTitle = (name: string) => named(CHEER_LABEL, name);

/** Under the picker's lines: `One cheer or jeer to Jae a week.` */
export const pickerNote = (first: string) => `One cheer or jeer to ${first} a week.`;
