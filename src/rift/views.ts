// The two ways a squad is drawn, named once: the Rift view first.

export const BOARD_VIEWS = ["Rift view", "Card view"] as const;
export type BoardView = (typeof BOARD_VIEWS)[number];
export const RIFT_VIEW: BoardView = BOARD_VIEWS[0];
export const CARD_VIEW: BoardView = BOARD_VIEWS[1];
