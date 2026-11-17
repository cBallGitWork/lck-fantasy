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
}: {
  children: ReactNode;
  onClick?: () => void;
  /** Set when the action can't be taken, as the reason. */
  disabledReason?: string;
}) {
  const off = disabledReason !== undefined;
  return (
    <span className="main-action">
      {off &&<span className="main-action__reason">{disabledReason}</span>}
      <button type="button" className={cx("main-action__key", off && "key-off")} disabled={off} onClick={onClick}>
        {children}
      </button>
    </span>
  );
}
