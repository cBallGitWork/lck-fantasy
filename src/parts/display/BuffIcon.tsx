import type { ReactNode } from "react";
import type { BuffEffect } from "../../../convex/squads/buffs";
import { cx } from "../util/cx";
import "./BuffIcon.css";

/** Each effect's gold icon, as the approved picture draws them (approved/pick-team/render.js). */
const ICON: Record<BuffEffect, ReactNode> = {
  benchBoost: <path d="M3 16h18M4 13h16M5 16v4M19 16v4M12 10V3M8.5 6.5 12 3l3.5 3.5" />,
  doubleCaptain: (
    <>
      <circle className="buff-icon__back" cx="15.5" cy="10" r="6.5" />
      <circle className="buff-icon__coin" cx="9.5" cy="14" r="7" />
      <path className="buff-icon__cut" d="M12 11.6a3.2 3.2 0 1 0 0 4.8" />
    </>
  ),
  coachMultiplier: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1" />
      <rect x="17" y="13" width="4" height="6" rx="1" />
      <path d="M19 19c0 2-3 2.5-6 2.5" />
    </>
  ),
};

/** A buff's gold icon, one way everywhere (plate.md, A buff): its buff card on Pick Team, Home's Deadline panel. The page sizes it with `className`. */
export function BuffIcon({ effect, className }: { effect: BuffEffect; className?: string }) {
  return (
    <svg className={cx("buff-icon", className)} viewBox="0 0 24 24" aria-hidden="true">
      {ICON[effect]}
    </svg>
  );
}
