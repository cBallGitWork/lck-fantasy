// The game's layer: the marks every League of Legends league shares, whatever its colours.
// A league's map may not hold these keys.

export const game = {
  color: {
    /** A price rise, red as Korea writes a rise, lightened to read on a dark ground. */
    rise: "#FF6B78",
    /** A price fall, blue as Korea writes a fall, lightened to read on a dark ground. */
    fall: "#6EA2FF",
    /** Summoner's Rift, the game's own and the same in every league (Craig, 19 Nov 2026: "the rift is
     *  sacred"): the approved picture's map (docs/design/approved/pick-team/map.js, its calm painting).
     *  The jungle's walls, the ground you walk, the lanes and the river and its pits. */
    mapWall: "#22392A",
    mapGrass: "#46663C",
    mapLane: "#6C6B49",
    mapRiver: "#2E7E92",
    /** Each side's towers, inhibitors and nexus: blue bottom-left, red top-right. */
    mapBlue: "#6E9FD6",
    mapRed: "#D68782",
    /** The dark edge round a tower and an inhibitor's middle; the light ring round a nexus. */
    mapMark: "#12231C",
    mapNexusRing: "#D9DED6",
    /** The bases' blue-grey stone, ring by ring from the outside: rim, the rule between rings, the court, its floor. */
    mapStoneRim: "#6B7B82",
    mapStoneLine: "#4C5A60",
    mapStoneCourt: "#5C6B72",
    mapStoneFloor: "#64747B",
    /** A player with news: a yellow warning triangle and the dark mark on it, as the picture. */
    news: "#F2C230",
    onNews: "#16181B",
  },
} as const;

export type GameColour = keyof typeof game.color;
