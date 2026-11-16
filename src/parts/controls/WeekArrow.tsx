import type { ReactNode } from "react";
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

/** Where a week arrow goes: a path (`/points/2`), a step on the page, or nowhere. */
type WeekWay = Go | (() => void) | undefined;

const arrowTo = (way: WeekWay) => (typeof way === "function" ? { onStep: way } : { go: way });

/** `‹ Week 3 ›`: the week between its two arrows, drawn one way on every page that steps through weeks. */
export function WeekStep({ prev, next, className, children }: { prev: WeekWay; next: WeekWay; className?: string; children: ReactNode }) {
  return (
    <div className={cx("week-step", className)}>
      <WeekArrow label="Week before" {...arrowTo(prev)}>
        ‹
      </WeekArrow>
      {children}
      <WeekArrow label="Week after" {...arrowTo(next)}>
        ›
      </WeekArrow>
    </div>
  );
}
