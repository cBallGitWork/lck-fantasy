import { cx } from "../parts";
import "./MarkBadge.css";

export type Mark = "C" | "V";

export const MARK_NAME: Record<Mark, string> = { C: "Carry", V: "Vice-carry" };

/** A mark's key on a card: `✓ Carry` while he has it, `Make Carry` until then. */
export const markKey = (mark: Mark, on: boolean) => (on ? `✓ ${MARK_NAME[mark]}` : `Make ${MARK_NAME[mark]}`);

/**
 * C or V, round, drawn one way everywhere: C filled, V outlined, V filled as C under Dual Carry
 * (spec/06), and read by a screen reader as Carry or Vice-carry. `small` beside a name or on a tile, `card` on a lineup card, `sheet` on a breakdown.
 * The page places it with `className`.
 */
export function MarkBadge({ mark, size = "small", dual, className }: { mark: Mark; size?: "small" | "card" | "sheet"; dual?: boolean; className?: string }) {
  return (
    <span
      className={cx("mark-badge", `mark-badge--${size}`, mark === "V" && !dual && "mark-badge--v", className)}
      role="img"
      aria-label={MARK_NAME[mark]}
      title={MARK_NAME[mark]}
    >
      {mark}
    </span>
  );
}
