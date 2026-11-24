// The game's layer: the marks every League of Legends league shares, whatever its colours.
// A league's map may not hold these keys.

export const game = {
  color: {
    /** A price rise, red as Korea writes a rise, lightened to read on a dark ground. */
    rise: "#FF6B78",
    /** A price fall, blue as Korea writes a fall, lightened to read on a dark ground. */
    fall: "#6EA2FF",
    /** A rank's move in a league: up green, down red, as FPL's arrows (Craig, 24 Nov 2026). */
    up: "#4CD98A",
    down: "#FF6B78",
  },
} as const;

export type GameColour = keyof typeof game.color;
