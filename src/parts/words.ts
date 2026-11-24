// The shared parts' words, named once. Every word a player reads in a part lives here; a figure's
// format (`2–1`, `Bo3`, `G2`) stays in text/figures.ts.

import type { Tier, TierName } from "../../convex/leagues/tiers";
import { PRODUCT } from "../paths";

export const WORDS = {
  /** The page frame's first link, unseen until focused. */
  skip: "Skip to content",
  /** Before the sponsor in the top bar. */
  presentedBy: "presented by",
  /** A sponsor's dashed slot until its name is approved. */
  sponsor: "Sponsor",
  /** The deadline's word, before its time. */
  deadline: "Deadline",
  /** A loading state's name for a screen reader. */
  loading: "Loading",
  /** An error state's way to try again. */
  tryAgain: "Try again ›",
  /** A buff card's keys: Play, and Cancel while it is on this week. */
  play: "Play",
  cancel: "Cancel",
  /** A table's ›'s column, for a screen reader. */
  open: "Open",
  /** The week arrows, for a screen reader. */
  weekBefore: "Previous week",
  weekAfter: "Next week",
  /** The dot after your player's name, for a screen reader. */
  yourPlayer: "Your player",
} as const;

/** Riot's Legal Jibber Jabber notice, word for word as its policy requires (spec/13, Shirts and crests). */
export const RIOT_NOTICE = `${PRODUCT} was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.`;

/** The link a visitor with an account takes (spec/09, Signing in again). */
export const LOG_IN = "Log in ›";

/** What the live region says when a save goes through. */
export const SAVED_NEWS = "Saved";

/** Ends a page that shows a sponsor (spec/13). */
export const SPONSOR_NOTE = "All sponsors are made up.";

/** A pop-up's or a panel's ✕, for a screen reader. */
export const CLOSE = "Close";

/** A sheet's way out, the same in every sheet. */
export const BACK = "Back";

/** A times column's head. */
export const YOUR_TIME = "Your time";
/** The credit on every player photo (spec/13, Shirts and crests). */
export const PHOTO_CREDIT = "Photo: LCK";

/** The state tags' words. */
export const TAG_WORD = { live: "Live", final: "Final", notFinal: "Not final" } as const;

/** The hovers' lines that are words alone (spec/12, Words); C's and the buffs' are read from the competition. */
export const HINTS = {
  killer: "Top scorer you don't own",
  flex: "Any role",
  tier: "Overall rank as a LoL tier",
} as const;

/** C's hover, the multiplier from the competition's data: `Scores ×1.5 this week`. */
export const captainHint = (multiplier: number) => `Scores ×${multiplier} this week`;

/** A move in words, as a screen reader says it: `up 0.5`, `down 1`. */
export const moveWords = (up: boolean, figure: string) => `${up ? "up" : "down"} ${figure}`;

/** A buff card's Play, for a screen reader: `Play Bench Boost`. */
export const playBuff = (buff: string) => `${WORDS.play} ${buff}`;

/** A buff card's Cancel, for a screen reader: `Cancel Bench Boost`. */
export const cancelBuff = (buff: string) => `${WORDS.cancel} ${buff}`;

/** A buff's state under its name (plate.md, A buff); one played earlier says its week. Never a count. */
export const BUFF_STATE = { available: "Available", on: "On this week", unavailable: "Unavailable" } as const;

/** `Played Week 3`. */
export const playedWeek = (week: number) => `Played Week ${week}`;

/** A table row's ›, for a screen reader: `Open Faker`. */
export const openRow = (name: string) => `${WORDS.open} ${name}`;

/** The kinds a manager sends; a sponsor cheer sends itself (spec/14). */
export type CheerKind = "cheer" | "jeer";

export const CHEER_WORD: Record<CheerKind, string> = { cheer: "Cheer", jeer: "Jeer" };

/** The key on a feed row, on Home and on Following (spec/14). */
export const CHEER_KEY = "Cheer / Jeer";

/** The picker's title and the key's name for a screen reader, with the manager's name: `Cheer or jeer Jae Kim`. */
export const CHEER_LABEL = "Cheer or jeer";

/** The head over the cheers and jeers received, on Following and on a profile. */
export const CHEERS_RECEIVED = "Cheers and jeers";

/** The only place a screen says Truck (plate.md, One name per thing): the credit's words. */
export const TRUCK_HIRE = "Truck hire by";

/** Each Overall tier's name and hangul, as the LoL client says them (spec/08, Overall tiers). */
export const TIER_WORDS: Record<TierName, { name: string; hangul: string }> = {
  iron: { name: "Iron", hangul: "아이언" },
  bronze: { name: "Bronze", hangul: "브론즈" },
  silver: { name: "Silver", hangul: "실버" },
  gold: { name: "Gold", hangul: "골드" },
  platinum: { name: "Platinum", hangul: "플래티넘" },
  emerald: { name: "Emerald", hangul: "에메랄드" },
  diamond: { name: "Diamond", hangul: "다이아몬드" },
  master: { name: "Master", hangul: "마스터" },
  grandmaster: { name: "Grandmaster", hangul: "그랜드마스터" },
  challenger: { name: "Challenger", hangul: "챌린저" },
};

/** Everyone's tier until gameweek 1 is final (spec/08). */
export const UNRANKED = "Unranked";

/** A division's numeral: I the best. */
export const DIVISION_NUMERAL = ["I", "II", "III", "IV"] as const;

/** A tier's short name: `Emerald I`, `Master`, `Unranked`. */
export function tierName(tier: Tier): string {
  if (tier.tier === "unranked") return UNRANKED;
  const { name } = TIER_WORDS[tier.tier];
  return tier.division === null ? name : `${name} ${DIVISION_NUMERAL[tier.division - 1]}`;
}

/** A tier's hangul, its division a figure as the Korean client has it: `에메랄드 1`; none for Unranked. */
export function tierHangul(tier: Tier): string | null {
  if (tier.tier === "unranked") return null;
  const { hangul } = TIER_WORDS[tier.tier];
  return tier.division === null ? hangul : `${hangul} ${tier.division}`;
}
