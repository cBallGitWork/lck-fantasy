// The Series page's words for a link to a series that doesn't exist (spec/12, Series page), named once.

import { WORDS as HUB_WORDS } from "../lck-hub/words";

export const WORDS = {
  noSuchSeries: "No such series",
  /** The way on from a missing series. */
  hub: HUB_WORDS.hub,
} as const;
