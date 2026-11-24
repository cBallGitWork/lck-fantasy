// Where the nine stand on Transfers' Rift: by role, no bench, as FPL's Transfers pitch stands all fifteen
// by position (Craig, 16 Nov 2026). A role holding several stands them in a row along its lane.

import { PLAN, type PersonRole, type RiftPoint } from "../../rift";
import { share, space } from "../../theme";

/** From one tile's centre to the next in a role's row, in the map's own square: a tile (its share of the Rift) and a gap. */
export const STEP = share.tile * PLAN + space[2];

/**
 * Each role's first tile, and which way the rest go, on the square Rift: top rightward along top lane,
 * jungle and mid in rows centred in the jungle and on mid lane, Bot then Support leftward along bot lane,
 * the coach alone by the blue base. `centre` rows are centred on the point; the others start there. The
 * rows sit a whole tile apart, its price chip and band included, at the size the Rift's tiles take (`share`).
 */
const SPOTS: Record<PersonRole, { at: RiftPoint; dir: readonly [number, number]; centre?: boolean }> = {
  top: { at: [84, 84], dir: [1, 0] },
  jng: { at: [196, 250], dir: [1, 0], centre: true },
  mid: { at: [428, 400], dir: [1, 0], centre: true },
  bot: { at: [636, 560], dir: [-1, 0] },
  sup: { at: [404, 560], dir: [-1, 0] },
  coach: { at: [84, 640], dir: [1, 0] },
};

/** Where the `i`th of a role's `n` tiles stands. */
export function spotOf(role: PersonRole, i: number, n: number): RiftPoint {
  const { at, dir, centre } = SPOTS[role];
  const k = (centre ? i - (n - 1) / 2 : i) * STEP;
  return [at[0] + dir[0] * k, at[1] + dir[1] * k];
}
