import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./SectionHead.css";

/** A main-column section's head: a 2px `--text` rule, its title in 16px bold, then its note in mid grey. */
export function SectionHead({ note, className, children }: { note?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <h2 className={cx("section-head", className)}>
      {children}
      {note !== undefined && <small className="section-head__note quiet">{note}</small>}
    </h2>
  );
}
