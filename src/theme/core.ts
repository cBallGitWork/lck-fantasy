// Flol's core layer: the sizes, weights, tracking, gaps and widths every league draws with (docs/design/plate.md).
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

/** Letter spacing, in em: a 28 or 20 head sits a touch tighter. */
const tracking = { head: "-0.01em" } as const;

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
  /** The smallest target on a phone (plate.md, Accessibility). */
  targetPhone: 44,
  /** A phone: a window this wide or narrower (approved/pick-team/arena.html). A media query can't read a
   *  token, so each writes it out; theme.test.ts checks every one is this. */
  phone: 600,
  topBar: 56,
  side: 360,
  modalCard: 1056,
  modalSheet: 544,
  /** Your-player dot and the live dot. */
  dot: 8,
  /** The C on a Rift tile. */
  mark: 20,
  /** The C in the head of the player's card under the Rift (approved/points/). */
  markDock: 24,
  /** A fact's mark before its word: Star, Flop, Killer (plate.md, Parts, A fact's mark). */
  factMark: 20,
  roleIcon: 28,
  /** The role icon beside a name in a list (Live). */
  roleIconSmall: 20,
  shirtW: 56,
  shirtH: 50,
  /** The shirt in a player's panel. */
  shirtSmallW: 40,
  shirtSmallH: 36,
  /** The Rift is square, as big as the first screen allows, at the main column's left (Craig, 19 Nov 2026),
   *  940 a side at most, as the approved picture (docs/design/approved/pick-team/). Tiles stand at shares
   *  of it, and its tiles size with it (`share`). */
  rift: 940,
  /** The room above the Rift on the first screen: the top bar and the title line; the Rift fits under it. */
  riftTop: 168,
  /** A Rift narrower than this is a phone's: its tiles take the phone's sizes and places. */
  riftPhone: 480,
  /** A bench tile, off the Rift: the Rift's own tile at the picture's 1440 Rift. */
  tileW: 96,
  tileCardH: 84,
  shirtTile: 64,
  /** A tile on a phone's Rift, and its card and kit (approved/pick-team/390.png). */
  tileWPhone: 78,
  tileCardHPhone: 60,
  shirtTilePhone: 44,
  /** The Captain's C past a Rift tile's top right corner: 40 across on a desk, 28 on a phone. */
  markTile: 40,
  markTilePhone: 28,
  /** A player's news: the yellow warning triangle on his tile's role strip. */
  newsFlag: 16,
  /** The round of a tile's card, FPL's one rounded shape (Craig, 16 Nov 2026). */
  tileRadius: 6,
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
  /** A league table's rank, Overall's Tier (the shield and `Grandmaster`), Captain, and points (the week's, the split's, Total) columns. */
  colRank: 64,
  colTier: 152,
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
  /** A lineup card (approved/pick-team/1440-cards.png): its role strip, its portrait and the crest in it
   *  until photos exist, and its two ruled rows. */
  cardStrip: 24,
  cardPhoto: 132,
  crestPortrait: 88,
  cardRow: 32,
  crest: 96,
  /** A crest beside a team code: in a player's panel. */
  crestSmall: 20,
  /** The crest in a player card's portrait slot, until photos exist. */
  crestSheet: 56,
  /** A game's row on the player's card under the Rift (approved/points/, What binds 5). */
  rowGame: 32,
  /** The player's card under the Rift (plate.md, The player's card): the crest in its head, Points' first
   *  column (the game, its result and champion), a Transfers series cell and its crest, and its key. */
  crestDock: 32,
  cardGameCol: 280,
  seriesCell: 56,
  crestCell: 24,
  cardKey: 120,
  sponsorH: 112,
  sponsorTopW: 120,
  /** A buff's gold icon (approved/pick-team/, Craig, 19 Nov 2026). */
  buffIcon: 36,
  /** The crest on a tapped player's card: as tall as his name and the line under it (approved/pick-team/). */
  crestCard: 64,
  /** Pick Team's column beside the Rift: the buffs, the bench, then Save (approved/pick-team/). */
  pickColumn: 336,
  /** Save team at the right of Card view's one bar (approved/pick-team/1440-cards.png). */
  pickSave: 304,
  /** Transfers' side column, the player list (approved/transfers/, What binds 8). */
  transfersSide: 424,
  /** A team's bar in Transfers' lists (plate.md, A team's colour). */
  teamBarWide: 6,
} as const;

/** Opacities: the band across a tier shield; an empty slot's shirt outline (front door picture). A
 *  dimmed tile is darkened, never see-through: its brightness and its colour, kept (approved/pick-team/).
 *  The towers, inhibitors and nexus on the Rift, quieter than the tiles. The coin behind Double Captain's icon. */
const opacity = { tierBand: 0.45, emptyShirt: 0.25, dim: 0.6, dimColour: 0.3, mapMarks: 0.7, buffIconBack: 0.55 } as const;

/** A Rift tile's sizes as shares of the Rift's side, so tiles size with it (approved/pick-team/): the
 *  tile, its card, its kit. */
const share = { tile: 0.15, tileCard: 0.13, shirt: 0.1 } as const;

/** SVG strokes, in the drawing's own units: the plain shirt's edge, and a buff icon's line, its coin's edge and the C cut in it, and a fact's mark. */
const stroke = { shirt: 1.6, icon: 1.2, coin: 1.5, cut: 2, fact: 2 } as const;

/** Frame shapes: a stream's picture, the same on Home and Live; the Rift, square at any width. */
const ratio = { stream: "16 / 9", rift: "1 / 1" } as const;

export const core = { size, weight, lineHeight, tracking, space, measure, opacity, share, stroke, ratio } as const;
