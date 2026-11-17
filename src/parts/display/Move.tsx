// A price's move and a rank's move, drawn by base.css's `rise`, `fall`, `rank-up`, `rank-down` and `rank-held`.
// The ▲ and ▼ are CSS, so each move also names itself in words for a screen reader (`down 1`).
import { cx } from "../util/cx";
import { count, NONE, oneDecimal } from "../text/figures";

/** A move in words, as a screen reader says it: `up 0.5`, `down 1`. */
export const moveWords = (up: boolean, figure: string) => `${up ? "up" : "down"} ${figure}`;

/** A price's move in m: ▲ or ▼ and the amount to one decimal; nothing when it held. */
export function PriceMove({ money, className }: { money: number; className?: string }) {
  if (money === 0) return null;
  const figure = oneDecimal(Math.abs(money));
  return (
    <span className={cx(money > 0 ? "rise" : "fall", className)} role="img" aria-label={moveWords(money > 0, figure)}>
      {figure}
    </span>
  );
}

/** A rank's move in `--text`, never gold: ▲ or ▼ and the places; `—` in mid grey when it held or has none yet. */
export function RankMove({ move }: { move: number | null | undefined }) {
  if (!move) return <span className="rank-held">{NONE}</span>;
  const figure = count(Math.abs(move));
  return (
    <span className={move < 0 ? "rank-down" : "rank-up"} role="img" aria-label={moveWords(move > 0, figure)}>
      {figure}
    </span>
  );
}
