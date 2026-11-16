import { cx } from "../parts";
import "./MarkBadge.css";

export type Mark = "C" | "V";

export const MARK_NAME: Record<Mark, string> = { C: "Carry", V: "Vice-carry" };

/**
 * C or V, round, drawn one way everywhere: C filled, V outlined, V filled as C under Dual Carry
 * (spec/06). `small` beside a name or on a tile, `card` on a lineup card, `sheet` on a breakdown.
 * The page places it with `className`.
 */
export function MarkBadge({ mark, size = "small", dual, className }: { mark: Mark; size?: "small" | "card" | "sheet"; dual?: boolean; className?: string }) {
  return (
    <span className={cx("mark-badge", `mark-badge--${size}`, mark === "V" && !dual && "mark-badge--v", className)} title={MARK_NAME[mark]}>
      {mark}
    </span>
  );
}
