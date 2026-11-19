// One way to show money: in m with the league's sign in front, as its data holds it, to one decimal,
// as FPL does (`7.5m` after the sign; Craig, 16 Nov 2026).
import { REGION } from "../../region";
import { MINUS } from "./figures";

/** A price in m is millions of won (spec/02). */
export const WON_PER_M = 1_000_000;

/** An amount in won, written as every page writes money: the sign, then `18.5m`, a minus in front when below zero. */
export function formatWon(won: number): string {
  const amount = (Math.abs(won) / WON_PER_M).toFixed(1);
  return `${won < 0 ? MINUS : ""}${REGION.currency}${amount}m`;
}

/** A price held in m, written as every page writes money. */
export const money = (priceM: number) => formatWon(priceM * WON_PER_M);

/** A price held in m, as won. */
export const mToWon = (priceM: number) => Math.round(priceM * WON_PER_M);
