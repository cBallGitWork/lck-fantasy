import { CAPTAIN_MULTIPLIER } from "../fixtures/competition";
import { captainHint, cx, Hint } from "../parts";
import "./MarkBadge.css";

/** The Captain's C, the one mark (spec/04, The name). */
export type Mark = "C";

export const MARK_NAME: Record<Mark, string> = { C: "Captain" };

/** What the live region says when a mark moves: `Faker is your Captain`. */
export const markNews = (name: string, mark: Mark) => `${name} is your ${MARK_NAME[mark]}`;

/** A mark's key on a card: `✓ Captain` while he has it, `Make Captain` until then. */
export const markKey = (mark: Mark, on: boolean) => (on ? `✓ ${MARK_NAME[mark]}` : `Make ${MARK_NAME[mark]}`);

/**
 * C, round and filled, drawn one way everywhere, read by a screen reader as Captain, its hover
 * `Scores ×1.5 this week` from the competition's multiplier (spec/12, Words). `small` beside a name
 * or on a tile, `card` on a lineup card, `sheet` on a breakdown. The page places it with `className`.
 */
export function MarkBadge({ mark, size = "small", className }: { mark: Mark; size?: "small" | "card" | "sheet"; className?: string }) {
  return (
    <Hint line={captainHint(CAPTAIN_MULTIPLIER)} className={cx("mark-badge-hint", className)}>
      <span className={cx("mark-badge", `mark-badge--${size}`)} role="img" aria-label={MARK_NAME[mark]}>
        {mark}
      </span>
    </Hint>
  );
}
