// The game's layer: the marks every League of Legends league shares, whatever its colours.
// A league's map may not hold these keys.

/** FPL's green: a rank moving up, and what a transfer adds. */
const GREEN = "#4CD98A";

export const game = {
  color: {
    /** A price rise, red as Korea writes a rise, lightened to read on a dark ground. */
    rise: "#FF6B78",
    /** A price fall, blue as Korea writes a fall, lightened to read on a dark ground. */
    fall: "#6EA2FF",
    /** A rank's move in a league: up green, down red, as FPL's arrows (Craig, 24 Nov 2026). */
    up: GREEN,
    down: "#FF6B78",
    /** What a transfer adds (Craig, 26 Nov 2026; plate.md, Colour): the bank chip, `+` to buy, the
     *  bought player's outline. */
    add: GREEN,
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
    /** Each Overall tier's ranked colour (plate.md, Colour; Craig, 27 Nov 2026): its shield, its share bar,
     *  and silver and bronze for a league table's ranks 2 and 3. Gold is pale to stay clear of `ink`. */
    tierIron: "#948D86",
    tierBronze: "#B0733F",
    tierSilver: "#A9B6C6",
    tierGold: "#F0D58C",
    tierPlatinum: "#3FB0A6",
    tierEmerald: "#2FBF74",
    tierDiamond: "#6F94FF",
    tierMaster: "#B46AE6",
    tierGrandmaster: "#F0606B",
    tierChallenger: "#5CCFF2",
    /** A player with news: a yellow warning triangle and the dark mark on it, as the picture. */
    news: "#F2C230",
    onNews: "#16181B",
  },
} as const;

export type GameColour = keyof typeof game.color;
