import type { Go } from "../../paths";
import { cx } from "../util/cx";
import { GoLink } from "./GoLink";
import "./WeekArrow.css";

/**
 * A week's ‹ or ›, a key: a link (`go`) or a button (`onStep`) to the week that way. Where there is
 * none it is a disabled key, so both arrows always stand either side of the week.
 */
export function WeekArrow({ label, go, onStep, children }: { label: string; go?: Go; onStep?: () => void; children: string }) {
  if (go)
    return (
      <GoLink className="week-arrow" go={go} label={label}>
        {children}
      </GoLink>
    );
  return (
    <button type="button" className={cx("week-arrow", !onStep && "week-arrow--off")} aria-label={label} disabled={!onStep} onClick={onStep}>
      {children}
    </button>
  );
}
