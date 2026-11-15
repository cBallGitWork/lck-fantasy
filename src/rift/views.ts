// The two ways a squad is drawn, named once: the Rift view first.

export const VIEWS = ["Rift view", "Card view"] as const;
export type BoardView = (typeof VIEWS)[number];
export const RIFT_VIEW: BoardView = VIEWS[0];
