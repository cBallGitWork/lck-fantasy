// Flol's core layer: the sizes, weights, gaps and widths every league draws with (docs/design/plate.md).
// No colour and no font: those are the game's and the league's.

/** Type sizes in px. Nothing under 12. */
const size = {
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

const weight = { regular: 400, semi: 600, bold: 700 } as const;

/** Line heights, as multiples of the type size. */
const lineHeight = { tight: 1, snug: 1.2, mid: 1.3, body: 1.4 } as const;

/** The one spacing scale, in px. No other gap, padding or margin. */
const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 } as const;

/** Heights, widths and rules, in px. */
const measure = {
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
const opacity = { tierBand: 0.45, dim: 0.5, emptyShirt: 0.25 } as const;

/** SVG strokes, in the drawing's own units: the shirt's edge, and the dashes round a pit. */
const stroke = { shirt: 1.6, dash: 3 } as const;

/** Frame shapes: a stream's picture, the same on Home and Live; the Rift, square at any width. */
const ratio = { stream: "16 / 9", rift: `${measure.rift} / ${measure.rift}` } as const;

export const core = { size, weight, lineHeight, space, measure, opacity, stroke, ratio } as const;
