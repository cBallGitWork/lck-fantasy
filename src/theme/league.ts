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
  | "band"
  | "headBand"
  | "signal"
  | "dim"
  | "tileCard"
  | "tilePlate"
  | "onTilePlate";

export type League = {
  color: Record<LeagueColour, string>;
  font: {
    /** Words: the Latin face first, then the league's own script. */
    sans: string;
    /** Figures, so they line up. */
    mono: string;
  };
};

/** The LCK: Arena, the look trial's pick (Craig, 19 Nov 2026; docs/design/approved/pick-team/): the
 *  LCK's navy as the ground, cool white text, gold where you act, a teal second accent. The banner
 *  and the stage keep their earlier values until their own pictures are redrawn; the map is the game's. */
const lck: League = {
  color: {
    /** The page. */
    bg: "#0A1226",
    /** Panels and tables. */
    paper: "#111B36",
    /** Table rules. */
    line: "#22305A",
    /** A selected row, a toggle's ground. */
    fill: "#18244A",
    /** Gold, the one accent: the one filled key, the Captain's C, a buff's icon, the wordmark. */
    ink: "#E0B04A",
    /** Text on a filled `ink` ground. */
    onInk: "#0A1226",
    /** Words and figures. */
    text: "#EEF1F8",
    /** Secondary text: 7.0:1 on `paper`, 6.2:1 on `fill`. */
    mid: "#9AA6C8",
    /** Never text: dashed outlines and placeholders only. */
    soft: "#4A5884",
    /** A figure past its limit: the bank below zero while over the budget. */
    over: "#FF6B78",
    /** The hangul on your team's banner, and only there. */
    banner: "#F0D58C",
    /** The banner's rule under its hangul. */
    bannerRule: "#785A28",
    /** Live's dark stage. */
    stage: "#000508",
    /** Grey text on the stage. */
    stageText: "#9AA6C8",
    /** The darkest ground: the top bar. */
    band: "#050A18",
    /** A panel title's band, a brighter LCK blue (Craig, 26 Nov 2026; plate.md, Panel): Transfers on. */
    headBand: "#1D46A8",
    /** The second accent, used sparingly: the live dot, the focus ring. */
    signal: "#2BC4B5",
    /** The page behind a modal. */
    dim: "rgba(10, 18, 38, 0.72)",
    /** A Rift tile's card behind his kit: solid, never see-through, so the map's marks stop at it
     *  (docs/design/approved/pick-team/). */
    tileCard: "#8A918D",
    /** A Rift tile's white name plate, and the dark words on it, as FPL's (Craig, 16 Nov 2026). */
    tilePlate: "#FFFFFF",
    onTilePlate: "#010A13",
  },
  font: {
    sans: '"IBM Plex Sans", "IBM Plex Sans KR", sans-serif',
    mono: '"IBM Plex Mono", monospace',
  },
};

/** Each league's map, by its competition's name as its data holds it (`LCK`). */
export const leagues: Record<string, League> = { LCK: lck };
