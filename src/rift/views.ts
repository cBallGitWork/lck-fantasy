// The two ways a squad is drawn, named once in words.ts: the Rift view first.
import { VIEWS } from "./words";

export type BoardView = (typeof VIEWS)[number];
export const RIFT_VIEW: BoardView = VIEWS[0];
