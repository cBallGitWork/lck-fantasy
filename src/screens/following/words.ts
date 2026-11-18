// Following's words for Block's confirm and the empty parts (spec/14, Following), named once.

export const WORDS = {
  block: "Block",
  /** Block's confirm, under its title. */
  blockLine: "They can't follow you again.",
  noRequests: "No requests",
  noCheers: "No cheers or jeers this week",
  followNoOne: "You follow no one",
} as const;

/** `Block Minji?`: the confirm's title. */
export const blockTitle = (first: string) => `${WORDS.block} ${first}?`;
