// Every colour, font, size, weight, gap and width the app draws with (docs/design/plate.md).
// Nothing outside src/theme/ holds a colour: parts and screens use the CSS custom properties
// these become (`var(--ink)`), so a reskin changes this file only.
//
// Colour is a basic LoL and LCK theme until the reskin (Craig, 15 Nov 2026): Hextech navy
// ground, gold accent, cream text, a blue-teal second accent, Korean red rises and blue falls.
// The plate's role names stay; each maps to a themed value.

const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export const color = {
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
  /** A price rise, Korean red, lightened to read on navy. */
  rise: "#FF5C6C",
  /** A price fall, Korean blue, lightened to read on navy. */
  fall: "#6EA2FF",
  /** A figure past its limit: the bank below zero while over the budget. */
  over: "#FF5C6C",
  /** The hangul on your team's banner, and only there. */
  gold: "#F0D58C",
  /** The banner's rule under the gold hangul. */
  goldRule: "#785A28",
  /** Live's dark stage. */
  stage: "#000508",
  /** Grey text on the stage. */
  stageText: "#A09B8C",
  /** The second accent, used sparingly: the live dot, the focus ring. */
  teal: "#0AC8B9",
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
} as const;

export const font = {
  /** Words, Korean included. */
  sans: '"IBM Plex Sans KR", sans-serif',
  /** Figures, so they line up. */
  mono: '"IBM Plex Mono", monospace',
} as const;

/** Type sizes in px. Nothing under 12. */
export const size = {
  /** Table heads, notes and every tag. */
  small: 12,
  body: 14,
  lead: 16,
  head: 20,
  title: 28,
  /** A player's or coach's name on his card, as a broadcast lower third. */
  card: 40,
  /** The page's one key figure. */
  key: 44,
} as const;

export const weight = { regular: 400, semi: 600, bold: 700 } as const;

/** Line heights, as multiples of the type size. */
export const lineHeight = { tight: 1, snug: 1.2, mid: 1.3, body: 1.4 } as const;

/** The one spacing scale, in px. No other gap, padding or margin. */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 } as const;

/** Heights, widths and rules, in px. */
export const measure = {
  rule: 1,
  ruleHeavy: 2,
  /** A table row and a form field. */
  row: 40,
  /** The smallest target on the desk. */
  target: 24,
  topBar: 56,
  side: 360,
  modalCard: 1056,
  modalSheet: 544,
  /** Your-player dot and the live dot. */
  dot: 8,
  /** The C on a Rift tile. */
  mark: 20,
  /** The C on a lineup card. */
  markCard: 28,
  /** The C on a player's breakdown sheet (Craig, 16 Nov 2026: "make C bigger"). */
  markSheet: 32,
  roleIcon: 28,
  /** The role icon on a lineup card's head. */
  roleIconSmall: 20,
  shirtW: 56,
  shirtH: 50,
  /** The shirt in a player's panel. */
  shirtSmallW: 40,
  shirtSmallH: 36,
  /** The Rift is square, 720 a side, centred in the main column (Craig, 16 Nov 2026). Tiles stand at shares of it. */
  rift: 720,
  /** A tile on the Rift: its card, name plate and band. */
  tileW: 124,
  /** The round of a tile's card, FPL's one rounded shape (Craig, 16 Nov 2026). */
  tileRadius: 6,
  /** `Bench`, before the bench tiles. */
  benchTitleW: 56,
  /** A tag's line. */
  tagLine: 16,
  /** Stats' sticking column: rank, role and name. */
  colName: 244,
  /** A table's last column, holding a row's `›`. */
  goCol: 48,
  /** A table's figure column (W, L, Win %, a move, Now), its price column (Was, Owned), and a roster's role column. */
  colFigure: 72,
  colPrice: 80,
  colRole: 112,
  /** A league table's rank, Captain, and points (the week's, the split's, Total) columns. */
  colRank: 64,
  colCaptain: 152,
  colScore: 120,
  /** Profile Points' slot, player and Pts columns. */
  colSlot: 150,
  colPlayer: 230,
  colPts: 60,
  /** Profile Transfers' slot and Pts gained, Out, `→` and In columns. */
  colSwap: 90,
  colOut: 240,
  colArrow: 30,
  colIn: 260,
  /** A menu's list: the Admin menu. */
  menuW: 220,
  cardHead: 48,
  cardPhoto: 176,
  crest: 96,
  /** A crest beside a team code: in a player's panel. */
  crestSmall: 20,
  /** The crest in a breakdown sheet's portrait slot, until photos exist. */
  crestSheet: 56,
  /** A game's row on a breakdown sheet: 32 in a sheet (Claude's call, Craig: "your call"). */
  rowSheet: 32,
  sponsorH: 112,
  sponsorTopW: 120,
} as const;

/** Opacities: the band across a tier shield; a dimmed tile's shirt drawing, never its words; an
 *  empty slot's shirt outline (front door picture). */
export const opacity = { tierBand: 0.45, dim: 0.5, emptyShirt: 0.25 } as const;

/** SVG strokes, in the drawing's own units: the shirt's edge, and the dashes round a pit. */
export const stroke = { shirt: 1.6, dash: 3 } as const;

/** Frame shapes: a stream's picture, the same on Home and Live; the Rift, square at any width. */
export const ratio = { stream: "16 / 9", rift: `${measure.rift} / ${measure.rift}` } as const;

export type MeasureKey = keyof typeof measure;

/** A measure as CSS, for the few sizes a part takes as a prop. */
export const measureVar = (key: MeasureKey) => `var(--m-${kebab(key)})`;

/** Every token as a CSS custom property name and value, in the order they are declared. */
export function themeVars(): [string, string][] {
  return [
    ...Object.entries(color).map(([k, v]): [string, string] => [`--${kebab(k)}`, v]),
    ...Object.entries(font).map(([k, v]): [string, string] => [`--font-${k}`, v]),
    ...Object.entries(size).map(([k, v]): [string, string] => [`--size-${k}`, `${v}px`]),
    ...Object.entries(weight).map(([k, v]): [string, string] => [`--w-${k}`, String(v)]),
    ...Object.entries(space).map(([k, v]): [string, string] => [`--s-${k}`, `${v}px`]),
    ...Object.entries(measure).map(([k, v]): [string, string] => [`--m-${kebab(k)}`, `${v}px`]),
    ...Object.entries(lineHeight).map(([k, v]): [string, string] => [`--lh-${k}`, String(v)]),
    ...Object.entries(opacity).map(([k, v]): [string, string] => [`--opacity-${kebab(k)}`, String(v)]),
    ...Object.entries(stroke).map(([k, v]): [string, string] => [`--stroke-${k}`, String(v)]),
    ...Object.entries(ratio).map(([k, v]): [string, string] => [`--ratio-${k}`, v]),
  ];
}

/** The `:root` block that applies every token. */
export function themeCss(): string {
  return `:root{${themeVars()
    .map(([name, value]) => `${name}:${value};`)
    .join("")}}`;
}
