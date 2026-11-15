// The roles and lineup slots, named once (spec/01; plate.md, Card view).

export type RoleKey = "top" | "jng" | "mid" | "bot" | "sup";
export type SlotKey = RoleKey | "flex" | "coach";
/** What a role icon can show. */
export type IconKey = SlotKey;

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

/** The seven starters in the LCK broadcast's lineup order. */
export const LINEUP_ORDER: readonly SlotKey[] = ["top", "jng", "mid", "bot", "sup", "flex", "coach"];

/** The icon a starter shows: his slot's, save the Flex, who shows the role he plays. */
export function slotIcon(slot: SlotKey, plays?: RoleKey): IconKey {
  return slot === "flex" && plays ? plays : slot;
}

/** The tag under a Flex or Coach: `Flex · plays Top`, `Coach 감독`. */
export function slotTag(slot: SlotKey, plays?: RoleKey): string | undefined {
  if (slot === "flex") return plays ? `${ROLE_NAME.flex} · plays ${ROLE_NAME[plays]}` : ROLE_NAME.flex;
  if (slot === "coach") return `${ROLE_NAME.coach} ${COACH_HANGUL}`;
  return undefined;
}
