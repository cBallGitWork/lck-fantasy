import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./OutlinedKey.css";

/**
 * Any action but the screen's main one: an outlined key (`Join a league`, `Copy link`). Disabled,
 * it is mid on fill with no edge (`.key-off`), and the reason beside it. `ends`: a key that ends
 * something, in its confirm sheet, with a `--down` edge (`Delete league`; plate.md, Parts). `small`:
 * a key on a table's row (Leagues' `Remove`).
 */
export function OutlinedKey({
  children,
  onClick,
  label,
  disabledReason,
  ends = false,
  small = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  /** The key's name for a screen reader where its words repeat down a list (`Accept Ella Wong`). */
  label?: string;
  /** Set when the action can't be taken, as the reason; empty where the page says it already. */
  disabledReason?: string;
  ends?: boolean;
  small?: boolean;
}) {
  const off = disabledReason !== undefined;
  const key = (
    <button
      type="button"
      className={cx("outlined-key", ends && "outlined-key--ends", small && "outlined-key--small", off && "key-off")}
      disabled={off}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </button>
  );
  if (!off || disabledReason === "") return key;
  return (
    <span className="outlined-key__off">
      {key}
      <span className="outlined-key__reason">{disabledReason}</span>
    </span>
  );
}
