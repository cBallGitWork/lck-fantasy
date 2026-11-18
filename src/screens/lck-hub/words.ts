// The region hub's words, named once; its name is the region's (#374), and a stage
// not yet started says when it starts (spec/12, LCK hub).

import { REGION } from "../../region";

export const WORDS = {
  /** The hub's name, as its tabs and a link to it say: `LCK hub`. */
  hub: `${REGION.name} hub`,
  /** A stage not yet started, with its first day from the competition's data: `Starts Wed 10 Mar`. */
  starts: (day: string) => `Starts ${day}`,
} as const;
