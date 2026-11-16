import { NONE, RankMove } from "../../parts";

/** A rank's move in `--text`, ▲ or ▼ then the places; `—` when it held. */
export function Move({ move }: { move: number }) {
  if (move === 0) return <span className="home__move-none">{NONE}</span>;
  return <RankMove move={move} />;
}
