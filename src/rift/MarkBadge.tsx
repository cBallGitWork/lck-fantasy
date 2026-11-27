import { CAPTAIN_MULTIPLIER } from "../fixtures/competition";
import { captainHint, cx, Hint } from "../parts";
import { MARK_NAME } from "./words";
import "./MarkBadge.css";

/** The Captain's C, the one mark (spec/04, The name). */
export type Mark = "C";

/**
 * C, round and filled, drawn one way everywhere, read by a screen reader as Captain, its hover
 * `Scores ×1.5 this week` from the competition's multiplier (spec/12, Words). `small` beside a name,
 * `tile` on a Rift tile, `card` on a lineup card, `dock` on the player's card under the Rift. The page places it with `className`.
 */
export function MarkBadge({ mark, size = "small", className }: { mark: Mark; size?: "small" | "tile" | "card" | "dock"; className?: string }) {
  return (
    <Hint line={captainHint(CAPTAIN_MULTIPLIER)} className={cx("mark-badge-hint", className)}>
      <span className={cx("mark-badge", `mark-badge--${size}`)} role="img" aria-label={MARK_NAME[mark]}>
        {mark}
      </span>
    </Hint>
  );
}
