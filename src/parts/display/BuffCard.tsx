import type { ReactNode } from "react";
import { cx } from "../util/cx";
import { playBuff, WORDS } from "../words";
import "./BuffCard.css";

/**
 * A buff: its name (a heading, drawn as bold body text), one line on what it does (spec/06), how many are left, and Play. `on` is
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
      <button type="button" className="buff-card__play" aria-label={playBuff(name)} onClick={onPlay}>
        {WORDS.play}
      </button>
    ));
  return (
    <div className={cx("buff-card", state !== "ready" && `buff-card--${state}`)}>
      <h2 className="buff-card__name">{name}</h2>
      <p className="buff-card__does quiet">{does}</p>
      <div className="buff-card__foot quiet">
        <span>{left}</span>
        {control}
      </div>
    </div>
  );
}
