// How the coach card writes its figures.
import { formatEok, WON_PER_EOK } from "../../parts";

const MINUS = "−";

/** A place: 1st, 2nd, 3rd, 4th, 11th. */
export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
}

/** Points as a line scores them: +6, 0, −1. */
export function signed(n: number): string {
  if (n > 0) return `+${n}`;
  return n < 0 ? `${MINUS}${-n}` : "0";
}

/** A count with thousands marked: 1,204. */
export const count = (n: number) => n.toLocaleString("en-GB");

/** Transfers this week: `+310 / −95`. */
export const inOut = (into: number, out: number) => `+${count(into)} / ${MINUS}${count(out)}`;

/** A price held in 억, written as every page writes money: `7.0억`. */
export const eok = (amount: number) => formatEok(amount * WON_PER_EOK);

/** Whether the coach's team won a series, its games first. */
export const won = ([a, b]: readonly [number, number]) => a > b;

/** A series' score: `2–1`. */
export const score = ([a, b]: readonly [number, number]) => `${a}–${b}`;
