// How the profile writes its figures, in one home.
import { count, NONE } from "../../parts";

/** A count or rank with thousands marked: `21,804`; `—` when absent. */
export const countOrNone = (n: number | undefined) => (n === undefined ? NONE : count(n));
