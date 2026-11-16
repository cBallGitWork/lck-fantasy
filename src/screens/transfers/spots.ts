// Where the nine stand on Transfers' Rift: by role, no bench, as FPL's Transfers pitch stands all fifteen
// by position (Craig, 16 Nov 2026). A role holding several stands them in a row along its lane.

import type { PersonRole, RiftPoint } from "../../rift";
import { measure, space } from "../../theme";

/** From one tile's centre to the next in a role's row: a tile and a gap. */
export const STEP = measure.tileW + space[2];

/**
 * Each role's first tile, and which way the rest go, on the square Rift: top rightward along top lane,
 * jungle and mid in rows centred in the jungle and on mid lane, Bot over Support leftward along bot lane,
 * the coach alone by the blue base. `centre` rows are centred on the point; the others start there.
 */
const SPOTS: Record<PersonRole, { at: RiftPoint; dir: readonly [number, number]; centre?: boolean }> = {
  top: { at: [92, 76], dir: [1, 0] },
  jng: { at: [196, 220], dir: [1, 0], centre: true },
  mid: { at: [392, 364], dir: [1, 0], centre: true },
  bot: { at: [628, 508], dir: [-1, 0] },
  sup: { at: [628, 652], dir: [-1, 0] },
  coach: { at: [92, 640], dir: [1, 0] },
};

/** Where the `i`th of a role's `n` tiles stands. */
export function spotOf(role: PersonRole, i: number, n: number): RiftPoint {
  const { at, dir, centre } = SPOTS[role];
  const k = (centre ? i - (n - 1) / 2 : i) * STEP;
  return [at[0] + dir[0] * k, at[1] + dir[1] * k];
}
