import { ordinal } from "../../parts";
import type { ChaseTag } from "./types";

/** The chase tag's words: `16 pts to 1st`, `+16 clear` (spec/08). */
export const chaseText = (tag: ChaseTag) => (tag.kind === "clear" ? `+${tag.points} clear` : `${tag.points} pts to ${ordinal(tag.rank)}`);
