// The LCK hub's words for a stage not yet started (spec/12, LCK hub), named once.

export const WORDS = {
  /** A stage not yet started, with its first day from the competition's data: `Starts Wed 10 Mar`. */
  starts: (day: string) => `Starts ${day}`,
} as const;
