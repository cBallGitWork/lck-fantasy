import { useId, type ReactNode } from "react";
import { cx } from "../util/cx";
import "./Hint.css";

/**
 * A word with its hover (spec/12, Words): one short line, shown on hover on desktop and on tap on
 * the phone (the tap focuses it), drawn one way everywhere. The page places the word with `className`.
 * `onKey` when the word is a key (Transfers' buff keys): the key takes the tap and the focus itself.
 */
export function Hint({ line, className, onKey, children }: { line: string; className?: string; onKey?: boolean; children: ReactNode }) {
  const id = useId();
  return (
    <span className={cx("hint", className)} tabIndex={onKey ? undefined : 0} aria-describedby={onKey ? undefined : id}>
      {children}
      <span className="hint__line" role="tooltip" id={id}>
        {line}
      </span>
    </span>
  );
}
