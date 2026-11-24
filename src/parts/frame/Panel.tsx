import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./Panel.css";

/**
 * A panel (plate.md, Parts): on `--paper`, a 1px `--line` round it, a 2px `--text` rule on top, its
 * title 16/700 and its contents 16 in. Pick Team's buffs, bench and Save, and its side column. With no
 * title, `label` names it for a screen reader.
 */
export function Panel({ title, label, className, children }: { title?: string; label?: string; className?: string; children: ReactNode }) {
  return (
    <section className={cx("panel", className)} aria-label={title ? undefined : label}>
      {title && <h2 className="panel__title">{title}</h2>}
      {children}
    </section>
  );
}
