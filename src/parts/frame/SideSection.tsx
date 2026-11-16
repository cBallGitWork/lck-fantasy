import type { ReactNode } from "react";
import "./SideSection.css";

/** A titled section of the side column: a 2px rule, a 14px title, its count or state after it. */
export function SideSection({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="side-section">
      <h2 className="side-section__title">
        {title}
        {note !== undefined && <span className="side-section__note">{note}</span>}
      </h2>
      {children}
    </section>
  );
}
