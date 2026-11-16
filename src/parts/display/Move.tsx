// A price's move and a rank's move, drawn by base.css's `rise`, `fall`, `rank-up`, `rank-down` and `rank-held`.
import { cx } from "../util/cx";
import { count, NONE, oneDecimal } from "../text/figures";

/** A price's move in m: ▲ or ▼ and the amount to one decimal; nothing when it held. */
export function PriceMove({ money, className }: { money: number; className?: string }) {
  if (money === 0) return null;
  return <span className={cx(money > 0 ? "rise" : "fall", className)}>{oneDecimal(Math.abs(money))}</span>;
}

/** A rank's move in `--text`, never gold: ▲ or ▼ and the places; `—` in mid grey when it held or has none yet. */
export function RankMove({ move }: { move: number | null | undefined }) {
  if (!move) return <span className="rank-held">{NONE}</span>;
  return <span className={move < 0 ? "rank-down" : "rank-up"}>{count(Math.abs(move))}</span>;
}
