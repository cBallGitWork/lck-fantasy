import type { ChaseTag } from "./types";

/** A count or a rank with thousands marked: `48,211`. */
export const figure = (n: number) => n.toLocaleString("en-GB");

/** `1st`, `2nd`, `13th`, `22nd`. */
export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${figure(n)}${suffix}`;
}

/** The chase tag's words: `16 pts to 1st`, `+16 clear` (spec/08). */
export const chaseText = (tag: ChaseTag) => (tag.kind === "clear" ? `+${tag.points} clear` : `${tag.points} pts to ${ordinal(tag.rank)}`);
