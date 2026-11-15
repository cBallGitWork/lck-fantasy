import type { Go } from "../paths";
import { cx } from "./cx";
import { GoLink } from "./GoLink";
import "./WeekArrow.css";

/**
 * A week's ‹ or ›: a link (`go`) or a key (`onStep`) to the week that way. Where there is none it
 * is off, in the rule's grey: a disabled key when `button` is set, else a hidden glyph.
 */
export function WeekArrow({ label, go, onStep, button, children }: { label: string; go?: Go; onStep?: () => void; button?: boolean; children: string }) {
  if (go)
    return (
      <GoLink className="week-arrow" go={go} label={label}>
        {children}
      </GoLink>
    );
  if (onStep || button)
    return (
      <button type="button" className={cx("week-arrow", !onStep && "week-arrow--off")} aria-label={label} disabled={!onStep} onClick={onStep}>
        {children}
      </button>
    );
  return (
    <span className={cx("week-arrow", "week-arrow--off")} aria-hidden="true">
      {children}
    </span>
  );
}
