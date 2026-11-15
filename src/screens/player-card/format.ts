// How the card writes its figures, once each.

import { formatEok, WON_PER_EOK } from "../../parts";

const MINUS = "−";
const EN_DASH = "–";

/** 1st, 2nd, 3rd, 4th … 11th, 12th, 13th, 21st. */
export function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th"}`;
}

/** Points as the Season panel shows them: `+22`, `−4`. */
export const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `${MINUS}${-n}` : "0");

/** A count with thousands marked: `1,204`. */
export const count = (n: number) => n.toLocaleString("en-GB");

/** The week's transfers in and out: `+1,204 / −310`. */
export const transfers = (moveIn: number, moveOut: number) => `+${count(moveIn)} / ${MINUS}${count(moveOut)}`;

/** A score, his team's first: `2–1`. */
export const score = ([ours, theirs]: [number, number]) => `${ours}${EN_DASH}${theirs}`;

/** A finished series from his side: `W 2–1`, `L 1–2`. */
export const result = (s: [number, number]) => `${s[0] > s[1] ? "W" : "L"} ${score(s)}`;

/** A price held in 억, written as the shared money part writes it: `18.5억`. */
export const eok = (priceEok: number) => formatEok(priceEok * WON_PER_EOK);

/** A figure to one decimal: `4.9`. */
export const oneDecimal = (n: number) => n.toFixed(1);

/** A figure per game, to one decimal. */
export const perGame = (total: number, games: number) => oneDecimal(total / games);
