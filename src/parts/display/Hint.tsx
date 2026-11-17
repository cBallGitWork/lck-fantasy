import { useId, type ReactNode } from "react";
import { cx } from "../util/cx";
import "./Hint.css";

/** The hovers' lines that are words alone (spec/12, Words); C's and the buffs' are read from the competition. */
export const HINTS = {
  killer: "Top scorer you don't own",
  flex: "Any role",
  tier: "Overall rank as a LoL tier",
} as const;

/** C's hover, the multiplier from the competition's data: `Scores ×1.5 this week`. */
export const captainHint = (multiplier: number) => `Scores ×${multiplier} this week`;

/**
 * A word with its hover (spec/12, Words): one short line, shown on hover on desktop and on tap on
 * the phone (the tap focuses it), drawn one way everywhere. The page places the word with `className`.
 */
export function Hint({ line, className, children }: { line: string; className?: string; children: ReactNode }) {
  const id = useId();
  return (
    <span className={cx("hint", className)} tabIndex={0} aria-describedby={id}>
      {children}
      <span className="hint__line" role="tooltip" id={id}>
        {line}
      </span>
    </span>
  );
}
