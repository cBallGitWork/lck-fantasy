// One way to show money: in m with ₩ in front, to one decimal, as FPL does ("₩7.5m"; Craig, 16 Nov 2026).
import { MINUS } from "./figures";

export const WON_PER_EOK = 100_000_000;

export function formatEok(won: number): string {
  const amount = (Math.abs(won) / WON_PER_EOK).toFixed(1);
  return `${won < 0 ? MINUS : ""}₩${amount}m`;
}

/** A price held in m, written as every page writes money: `₩18.5m`. */
export const eok = (priceEok: number) => formatEok(priceEok * WON_PER_EOK);

/** A price held in m, as won. */
export const eokToWon = (priceEok: number) => Math.round(priceEok * WON_PER_EOK);
