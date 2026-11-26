// The Rift's words, named once. Every word a player reads in the Rift view and Card view lives here.

import type { Mark } from "./MarkBadge";
import type { PersonRole, RoleKey, SlotKey } from "./roles";

export const WORDS = {
  /** The bench bar's head. */
  bench: "Bench",
  /** The player panel's foot, to his card. */
  fullStats: "Full stats",
} as const;

/** The roles and lineup slots (spec/01; plate.md, Card view). */
export const ROLE_NAME: Record<SlotKey, string> = {
  top: "Top",
  jng: "Jungle",
  mid: "Mid",
  bot: "Bot",
  sup: "Support",
  flex: "Flex",
  coach: "Coach",
};

/** The two ways a squad is drawn: the Rift view first. */
export const VIEWS = ["Rift view", "Card view"] as const;

/** A Flex's team on his lineup card, the role he plays after it: `DK · Top`. */
export const teamPlays = (team: string, role: RoleKey) => `${team} · ${ROLE_NAME[role]}`;

/** A bench place, over its tile or on its card's strip, as FPL's `1. DEF`: `1. Mid`, or `1.` for an empty one. */
export const benchPlace = (order: number, role?: PersonRole) => (role ? `${order}. ${ROLE_NAME[role]}` : `${order}.`);

export const MARK_NAME: Record<Mark, string> = { C: "Captain" };

/** What the live region says when a mark moves: `Faker is your Captain`. */
export const markNews = (name: string, mark: Mark) => `${name} is your ${MARK_NAME[mark]}`;

/** A mark's key on a card: `✓ Captain` while he has it, `Make Captain` until then. */
export const markKey = (mark: Mark, on: boolean) => (on ? `✓ ${MARK_NAME[mark]}` : `Make ${MARK_NAME[mark]}`);
