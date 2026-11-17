// How every page writes its figures, once each: counts, places, signed points and scores.

/** The minus sign figures use, never a hyphen: `−4`. */
export const MINUS = "−";

const EN_DASH = "–";

/** A count or rank with thousands marked: `48,211`. */
export const count = (n: number) => n.toLocaleString("en-GB");

/** A count and its noun, one or many: `1 manager`, `12 managers`. */
export const plural = (n: number, noun: string) => `${count(n)} ${noun}${n === 1 ? "" : "s"}`;

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

/** A series' score as a player's or coach's week shows it: `1–0` while live (no W or L yet), else `W 2–1`. */
export const seriesResult = (s: Score, live: boolean) => (live ? score(s) : result(s));

/** A figure to one decimal: form, an average. `9.0`. */
export const oneDecimal = (n: number) => n.toFixed(1);

/** A figure per game as a number, 0 where there are no games; for sorting. */
export const perGameValue = (total: number, games: number) => (games === 0 ? 0 : total / games);

/** A figure per game, to one decimal: `4.9`; `0.0` with no games. */
export const perGame = (total: number, games: number) => oneDecimal(perGameValue(total, games));

/** A per cent: owned, a win rate. `46%`. */
export const pct = (n: number) => `${n}%`;

/** Absence: a figure or a line there is none of (plate.md, Words). */
export const NONE = "—";

/** A series' length: `Bo3`. */
export const bestOf = (n: number) => `Bo${n}`;

/** A game of a series: `G2`. */
export const gameNo = (n: number) => `G${n}`;

/** A series by its day and the other side: `Wed · v HLE`. */
export const seriesTitle = (day: string, opponent: string) => `${day} · v ${opponent}`;

/** A place, alone or among so many: `2nd`, `2nd of 10 mids`. */
export const placeOf = (place: number, of?: string) => (of === undefined ? ordinal(place) : `${ordinal(place)} of ${of}`);

