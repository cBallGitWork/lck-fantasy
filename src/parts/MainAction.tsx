import type { ReactNode } from "react";
import "./MainAction.css";

/**
 * The screen's one main action, filled ink (`Save team`). Disabled, it is mid on fill, with the
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
  return (
    <span className="main-action">
      {disabledReason !== undefined && <span className="main-action__reason">{disabledReason}</span>}
      <button type="button" className="main-action__key" disabled={disabledReason !== undefined} onClick={onClick}>
        {children}
      </button>
    </span>
  );
}
