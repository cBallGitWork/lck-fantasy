import "./FactMark.css";

/** The facts with a mark of their own (plate.md, Parts, A fact's mark). */
export type Fact = "Star" | "Flop" | "Killer";

/** Each fact's drawing in a 24-unit box: a filled star, a falling line, crossed swords. */
const DRAWING: Record<Fact, { d: string; filled?: true }> = {
  Star: { d: "M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z", filled: true },
  Flop: { d: "M3 7l6 6 4-4 8 8M21 11v6h-6" },
  Killer: {
    d: "M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3M3 19l2 2",
  },
};

/**
 * A fact's 20px mark before its word, the same on every page: Star a gold star, Flop a red falling line,
 * Killer crossed swords in `--text`. Unseen by a screen reader, as the word says the fact.
 */
export function FactMark({ fact }: { fact: Fact }) {
  const { d, filled } = DRAWING[fact];
  return (
    <svg className={`fact-mark fact-mark--${fact.toLowerCase()}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} fill={filled ? "currentColor" : "none"} />
    </svg>
  );
}
