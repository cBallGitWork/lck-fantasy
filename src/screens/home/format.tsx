/** A count with thousands commas: `48,211`. */
export const withCommas = (n: number) => n.toLocaleString("en-GB");

/** A place in a private league: `2nd`, `14th`. */
export function place(n: number): string {
  const tens = n % 100;
  const suffix = tens >= 11 && tens <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
}

/** A rank's move in ink, ▲ or ▼ then the places; `—` when it held. */
export function Move({ move }: { move: number }) {
  if (move === 0) return <span className="home__move-none">—</span>;
  return <span className={move > 0 ? "rank-up" : "rank-down"}>{withCommas(Math.abs(move))}</span>;
}
