// One way to show money: in m with ₩ in front, to one decimal, as FPL does ("₩7.5m"; Craig, 16 Nov 2026).
import { MINUS } from "./figures";

/** A price in m is millions of won (spec/02). */
export const WON_PER_M = 1_000_000;

/** An amount in won, written as every page writes money: `₩18.5m`, a minus in front when below zero. */
export function formatWon(won: number): string {
  const amount = (Math.abs(won) / WON_PER_M).toFixed(1);
  return `${won < 0 ? MINUS : ""}₩${amount}m`;
}

/** A price held in m, written as every page writes money: `₩18.5m`. */
export const money = (priceM: number) => formatWon(priceM * WON_PER_M);

/** A price held in m, as won. */
export const mToWon = (priceM: number) => Math.round(priceM * WON_PER_M);
