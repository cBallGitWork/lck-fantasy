// How every page writes its figures, once each: counts, places, signed points and scores.

/** The minus sign figures carry, never a hyphen: `−4`. */
export const MINUS = "−";

const EN_DASH = "–";

/** A count or rank with thousands marked: `48,211`. */
export const count = (n: number) => n.toLocaleString("en-GB");

const SUFFIX: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };

/** A place: `1st`, `2nd`, `11th`, `1,402nd`. */
export function ordinal(n: number): string {
  const tens = n % 100;
  return `${count(n)}${tens >= 11 && tens <= 13 ? "th" : (SUFFIX[n % 10] ?? "th")}`;
}

/** Points as a line scores them: `+6`, `0`, `−1`. */
export const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${-n}` : "0");

/** Transfers in and out: `+1,204 / −310`. */
export const inOut = (into: number, out: number) => `+${count(into)} / ${MINUS}${count(out)}`;

/** A series' score, one side's games first. */
export type Score = readonly [number, number];

/** `2–1`. */
export const score = ([a, b]: Score) => `${a}${EN_DASH}${b}`;

/** `W` or `L`. */
export const outcome = (won: boolean) => (won ? "W" : "L");

/** A finished series from the first side: `W 2–1`, `L 1–2`. */
export const result = (s: Score) => `${outcome(s[0] > s[1])} ${score(s)}`;

/** A figure per game, to one decimal: `4.9`. */
export const perGame = (total: number, games: number) => (total / games).toFixed(1);
