import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./Panel.css";

/**
 * A panel (plate.md, Parts): on `--paper`, a 1px `--line` round it, a 2px `--text` rule on top, its
 * title 16/700 and its contents 16 in. Pick Team's buffs, bench and Save, and its side column. With no
 * title, `label` names it for a screen reader. `band` sets the title on the `--head-band` band in place
 * of the rule, as every panel from Transfers on (Craig, 26 Nov 2026).
 */
export function Panel({
  title,
  sub,
  label,
  band,
  go,
  className,
  children,
}: {
  /** Words, or what stands in their place while they are edited (Leagues' Rename). */
  title?: ReactNode;
  /** What sits after the title in 14/400 (`LCK 2027 · Split 2`; approved/leagues/). */
  sub?: string;
  label?: string;
  band?: boolean;
  /** A link at the band's right, as Home's `Points ›` (approved/home/). */
  go?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cx("panel", band && "panel--band", className)} aria-label={label}>
      {title && (
        <h2 className="panel__title">
          {title}
          {sub && <span className="panel__sub">{sub}</span>}
          {go && <span className="panel__go">{go}</span>}
        </h2>
      )}
      {children}
    </section>
  );
}
