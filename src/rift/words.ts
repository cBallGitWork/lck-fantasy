// The Rift's words, named once. Every word a player reads in the Rift view and Card view lives here.

import type { Mark } from "./MarkBadge";
import type { RoleKey, SlotKey } from "./roles";

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

/** The Coach's hangul, as the LCK names him. */
export const COACH_HANGUL = "감독";

/** The two ways a squad is drawn: the Rift view first. */
export const VIEWS = ["Rift view", "Card view"] as const;

/** Under a Flex on his lineup card: `plays Mid`. */
export const flexRole = (role: RoleKey) => `plays ${ROLE_NAME[role]}`;

export const MARK_NAME: Record<Mark, string> = { C: "Captain" };

/** What the live region says when a mark moves: `Faker is your Captain`. */
export const markNews = (name: string, mark: Mark) => `${name} is your ${MARK_NAME[mark]}`;

/** A mark's key on a card: `✓ Captain` while he has it, `Make Captain` until then. */
export const markKey = (mark: Mark, on: boolean) => (on ? `✓ ${MARK_NAME[mark]}` : `Make ${MARK_NAME[mark]}`);
