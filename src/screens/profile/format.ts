// How the profile writes its figures, in one home.
import { count as figure, NONE } from "../../parts";

/** A count or rank with thousands marked: `21,804`; `—` when absent. */
export const count = (n: number | undefined) => (n === undefined ? NONE : figure(n));
