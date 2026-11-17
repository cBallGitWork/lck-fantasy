import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./OutlinedKey.css";

/**
 * Any action but the screen's main one: an outlined key (`Join a league`, `Copy link`). Disabled,
 * it is mid on fill with no edge (`.key-off`), and the reason beside it.
 */
export function OutlinedKey({
  children,
  onClick,
  label,
  disabledReason,
}: {
  children: ReactNode;
  onClick?: () => void;
  /** The key's name for a screen reader where its words repeat down a list (`Accept Ella Wong`). */
  label?: string;
  /** Set when the action can't be taken, as the reason. */
  disabledReason?: string;
}) {
  const off = disabledReason !== undefined;
  const key = (
    <button type="button" className={cx("outlined-key", off && "key-off")} disabled={off} onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
  if (!off) return key;
  return (
    <span className="outlined-key__off">
      {key}
      <span className="outlined-key__reason">{disabledReason}</span>
    </span>
  );
}
