import type { ReactNode } from "react";
import "./FactMark.css";

/** The facts drawn with their own mark; Most captained's is the Captain's C (src/rift's MarkBadge). */
export type FactKind = "star" | "flop" | "bought" | "sold";

/** Each fact's mark, as approved/home/render.js draws it. */
const MARK: Record<FactKind, ReactNode> = {
  star: <path className="fact-mark__fill" d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z" />,
  flop: <path d="M3 7l6 6 4-4 8 8M21 11v6h-6" />,
  bought: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  sold: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </>
  ),
};

/**
 * A fact's 20px mark before its word (plate.md, Parts, A fact's mark): Star a gold star, Flop a red
 * falling line, Most bought a green plus in a ring, Most sold a red minus in a ring. One mark a fact,
 * the same on every page; the word beside it names the fact, so a screen reader skips the mark.
 */
export function FactMark({ kind }: { kind: FactKind }) {
  return (
    <svg className={`fact-mark fact-mark--${kind}`} viewBox="0 0 24 24" aria-hidden="true">
      {MARK[kind]}
    </svg>
  );
}
