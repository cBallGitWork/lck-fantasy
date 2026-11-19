// The league's layer: each league's colours and fonts, one map each with the same keys. A colour is
// named by its job, never its hue, so each name holds in every league. A new league adds a map here;
// the type refuses one with a key missing or a key too many.

/** Every colour a league sets: all but the game's (`game.ts`). */
type LeagueColour =
  | "bg"
  | "paper"
  | "line"
  | "fill"
  | "ink"
  | "onInk"
  | "text"
  | "mid"
  | "soft"
  | "over"
  | "banner"
  | "bannerRule"
  | "stage"
  | "stageText"
  | "signal"
  | "dim"
  | "mapGround"
  | "mapRiver"
  | "mapLane"
  | "mapBase"
  | "mapTower"
  | "tileCard"
  | "tilePlate"
  | "onTilePlate";

export type League = {
  color: Record<LeagueColour, string>;
  font: {
    /** Words, the league's own script included. */
    sans: string;
    /** Figures, so they line up. */
    mono: string;
  };
};

/** The LCK: a basic LoL and LCK theme until the reskin (Craig, 15 Nov 2026): Hextech navy ground,
 *  gold accent, cream text, a blue-teal second accent. */
const lck: League = {
  color: {
    /** The page. */
    bg: "#010A13",
    /** Panels and tables. */
    paper: "#0A1428",
    /** Table rules. */
    line: "#1E2D40",
    /** A selected row, a toggle's ground. */
    fill: "#14233A",
    /** Rules, the selected thing, the one filled button: Hextech gold. */
    ink: "#C89B3C",
    /** Text on a filled `ink` ground. */
    onInk: "#010A13",
    /** Words and figures. */
    text: "#F0E6D2",
    /** Secondary text: 6.5:1 on `paper`, 5.8:1 on `fill`. */
    mid: "#A09B8C",
    /** Never text: dashed outlines and placeholders only. */
    soft: "#5B5A56",
    /** A figure past its limit: the bank below zero while over the budget. */
    over: "#FF5C6C",
    /** The hangul on your team's banner, and only there. */
    banner: "#F0D58C",
    /** The banner's rule under its hangul. */
    bannerRule: "#785A28",
    /** Live's dark stage. */
    stage: "#000508",
    /** Grey text on the stage. */
    stageText: "#A09B8C",
    /** The second accent, used sparingly: the live dot, the focus ring. */
    signal: "#0AC8B9",
    /** The page behind a modal. */
    dim: "rgba(1, 10, 19, 0.72)",
    /** The Rift map's ground, river, lanes, bases and towers. */
    mapGround: "#0B1A2C",
    mapRiver: "#0D2B3E",
    mapLane: "#1A2C42",
    mapBase: "#22374F",
    mapTower: "#5B5A56",
    /** A Rift tile's card: the faint, lighter ground behind his shirt, as FPL's (Craig, 16 Nov 2026). */
    tileCard: "rgba(240, 230, 210, 0.12)",
    /** A Rift tile's white name plate, and the dark words on it, as FPL's (Craig, 16 Nov 2026). */
    tilePlate: "#FFFFFF",
    onTilePlate: "#010A13",
  },
  font: {
    sans: '"IBM Plex Sans KR", sans-serif',
    mono: '"IBM Plex Mono", monospace',
  },
};

/** Each league's map, by its competition's name as its data holds it (`LCK`). */
export const leagues: Record<string, League> = { LCK: lck };
