import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./MainAction.css";

/**
 * The screen's one main action, filled `--ink` gold (`Save team`). Disabled, it is mid on fill, with the
 * reason beside it (`No changes`).
 */
export function MainAction({
  children,
  onClick,
  disabledReason,
  wide,
}: {
  children: ReactNode;
  onClick?: () => void;
  /** Set when the action can't be taken, as the reason; empty where the page says it already. */
  disabledReason?: string;
  /** As wide as its box (Pick Team's Save panel). */
  wide?: boolean;
}) {
  const off = disabledReason !== undefined;
  return (
    <span className={cx("main-action", wide && "main-action--wide")}>
      {off &&<span className="main-action__reason">{disabledReason}</span>}
      <button type="button" className={cx("main-action__key", off && "key-off")} disabled={off} onClick={onClick}>
        {children}
      </button>
    </span>
  );
}
