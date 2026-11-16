// Where the nine stand on Transfers' Rift: by role, no bench, as FPL's Transfers pitch stands all fifteen
// by position (Craig, 16 Nov 2026). A role holding several stands them in a row along its lane.

import type { PersonRole, RiftPoint } from "../../rift";
import { measure, space } from "../../theme";

/** From one tile's centre to the next in a role's row: a narrow tile and a gap. */
export const STEP = measure.tileWNarrow + space[2];

/**
 * Each role's first tile, and which way the rest go: top along the top lane, jungle and mid in rows
 * across the middle, support leftward and bot up the bot lane, the coach alone in his corner. `centre`
 * rows are centred on the point; the others start there.
 */
const SPOTS: Record<PersonRole, { at: RiftPoint; dir: readonly [number, number]; centre?: boolean }> = {
  top: { at: [104, 70], dir: [1, 0] },
  jng: { at: [280, 230], dir: [1, 0], centre: true },
  mid: { at: [540, 360], dir: [1, 0], centre: true },
  sup: { at: [650, 486], dir: [-1, 0] },
  bot: { at: [846, 486], dir: [0, -1] },
  coach: { at: [92, 468], dir: [1, 0] },
};

/** Where the `i`th of a role's `n` tiles stands. */
export function spotOf(role: PersonRole, i: number, n: number): RiftPoint {
  const { at, dir, centre } = SPOTS[role];
  const k = (centre ? i - (n - 1) / 2 : i) * STEP;
  return [at[0] + dir[0] * k, at[1] + dir[1] * k];
}
