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
  disabledReason,
}: {
  children: ReactNode;
  onClick?: () => void;
  /** Set when the action can't be taken, as the reason. */
  disabledReason?: string;
}) {
  const off = disabledReason !== undefined;
  const key = (
    <button type="button" className={cx("outlined-key", off && "key-off")} disabled={off} onClick={onClick}>
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
