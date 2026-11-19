// The game's layer: the marks every League of Legends league shares, whatever its colours.
// A league's map may not hold these keys.

export const game = {
  color: {
    /** A price rise, red as Korea writes a rise, lightened to read on a dark ground. */
    rise: "#FF5C6C",
    /** A price fall, blue as Korea writes a fall, lightened to read on a dark ground. */
    fall: "#6EA2FF",
  },
} as const;

export type GameColour = keyof typeof game.color;
