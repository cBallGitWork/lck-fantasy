// A price's move and a rank's move, drawn by base.css's `rise`, `fall`, `rank-up` and `rank-down`.
import { count } from "./figures";

/** A price's move in 억: ▲ or ▼ and the amount to one decimal; nothing when it held. */
export function PriceMove({ eok }: { eok: number }) {
  if (eok === 0) return null;
  return <span className={eok > 0 ? "rise" : "fall"}>{Math.abs(eok).toFixed(1)}</span>;
}

/** A rank's move in ink: ▲ or ▼ and the places. Each screen draws its own `—` for a rank that held. */
export function RankMove({ move }: { move: number }) {
  return <span className={move < 0 ? "rank-down" : "rank-up"}>{count(Math.abs(move))}</span>;
}
