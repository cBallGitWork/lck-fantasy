// Test fixtures for following and trucks: follows and settings, never product data.
import type { LineSettings } from "./fit";
import { acceptFollow, requestFollow, type Follows } from "./follows";

/** Fixture values: the real ones are the competition's data. */
export const LINE_SETTINGS: LineSettings = { blankPoints: 2, flopPoints: 2, bigCarryPoints: 20 };

export const NO_FOLLOWS: Follows = { follows: [], blocks: [] };

/** `follower` asks to follow each of `followed`, and each accepts. */
export function following(state: Follows, follower: string, ...followed: string[]): Follows {
  return followed.reduce((now, one) => acceptFollow(requestFollow(now, follower, one), one, follower), state);
}
