// How the profile writes its figures, in one home.
import { count as figure, MINUS, NONE } from "../../parts";

/** A count or rank with thousands marked: `21,804`; `—` when absent. */
export const count = (n: number | undefined) => (n === undefined ? NONE : figure(n));

/** Points gained, signed: `+4`, `−1`; `+0` when none. */
export const gained = (n: number) => (n < 0 ? `${MINUS}${Math.abs(n)}` : `+${n}`);
