// A price's move and a rank's move, drawn by base.css's `rise`, `fall`, `rank-up` and `rank-down`.
import { cx } from "./cx";
import { count, oneDecimal } from "./figures";

/** A price's move in m: ▲ or ▼ and the amount to one decimal; nothing when it held. */
export function PriceMove({ eok, className }: { eok: number; className?: string }) {
  if (eok === 0) return null;
  return <span className={cx(eok > 0 ? "rise" : "fall", className)}>{oneDecimal(Math.abs(eok))}</span>;
}

/** A rank's move in ink: ▲ or ▼ and the places. Each screen draws its own `—` for a rank that held. */
export function RankMove({ move }: { move: number }) {
  return <span className={move < 0 ? "rank-down" : "rank-up"}>{count(Math.abs(move))}</span>;
}
