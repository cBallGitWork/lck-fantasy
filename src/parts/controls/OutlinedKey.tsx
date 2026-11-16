import type { ReactNode } from "react";
import "./OutlinedKey.css";

/**
 * Any action but the screen's main one: an outlined key (`Join a league`, `Copy link`). Disabled,
 * it is mid on fill with a line edge, and the reason beside it.
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
  const key = (
    <button type="button" className="outlined-key" disabled={disabledReason !== undefined} onClick={onClick}>
      {children}
    </button>
  );
  if (disabledReason === undefined) return key;
  return (
    <span className="outlined-key__off">
      {key}
      <span className="outlined-key__reason">{disabledReason}</span>
    </span>
  );
}
