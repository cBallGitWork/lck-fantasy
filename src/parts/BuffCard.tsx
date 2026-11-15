import type { ReactNode } from "react";
import { cx } from "./cx";
import "./BuffCard.css";

/**
 * A buff: its name, one line on what it does (spec/06), how many are left, and Play. `on` is
 * played this week (filled); `off` can't be played now.
 */
export function BuffCard({
  name,
  does,
  left,
  state = "ready",
  action,
  onPlay,
}: {
  name: string;
  does: string;
  /** `1 left`, or `On · unsaved` while played. */
  left: string;
  state?: "ready" | "on" | "off";
  /** In place of Play: `Cancel`, or a link (`Transfers ›`). */
  action?: ReactNode;
  onPlay?: () => void;
}) {
  const control =
    action ??
    (state === "ready" && (
      <button type="button" className="buff-card__play" onClick={onPlay}>
        Play
      </button>
    ));
  return (
    <div className={cx("buff-card", state !== "ready" && `buff-card--${state}`)}>
      <b>{name}</b>
      <p className="buff-card__does">{does}</p>
      <div className="buff-card__foot">
        <span>{left}</span>
        {control}
      </div>
    </div>
  );
}
