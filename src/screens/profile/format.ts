// How the profile writes its figures and links, in one home.
import { formatEok, WON_PER_EOK } from "../../parts";
import { PATHS, type Go } from "../../paths";
import type { ProfilePlayer } from "./fixtures";

const MINUS = "−";

/** Absence, never `0` (plate.md, Words). */
export const NONE = "—";

/** A count or rank with thousands marked: `21,804`; `—` when absent. */
export const count = (n: number | undefined) => (n === undefined ? NONE : n.toLocaleString("en-GB"));

/** Points gained, signed: `+4`, `−1`. */
export const signed = (n: number) => (n < 0 ? `${MINUS}${Math.abs(n)}` : `+${n}`);

/** An amount held in 억: `13.0억`. */
export const eok = (amount: number) => formatEok(amount * WON_PER_EOK);

const SUFFIX: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };

/** A place: `3rd`, `11th`. */
export function ordinal(n: number): string {
  const tens = n % 100;
  return `${n}${tens >= 11 && tens <= 13 ? "th" : (SUFFIX[n % 10] ?? "th")}`;
}

/** A player opens his player card; the coach opens the coach card. */
export function cardGo(player: ProfilePlayer, coach: boolean): Go {
  return coach ? { to: PATHS.coachCard, params: { coachId: player.id } } : { to: PATHS.playerCard, params: { playerId: player.id } };
}
