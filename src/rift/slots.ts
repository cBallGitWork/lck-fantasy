import type { SlotKey } from "./roles";

/** A tile's centre on the Rift, in px of its 720 square (`measure.rift`). A tile stands at the same share of the Rift at any width. */
export type RiftPoint = readonly [x: number, y: number];

/**
 * Where each starter stands on Pick Team, Points and Perfect game: top in top lane, jungle in the
 * jungle, mid in mid lane, Support over Bot together in bot lane, and Coach and Flex by the blue base
 * (Craig, 16 Nov 2026).
 */
export const RIFT_SLOTS: Record<SlotKey, RiftPoint> = {
  top: [100, 104],
  jng: [196, 300],
  mid: [372, 372],
  sup: [600, 448],
  bot: [600, 604],
  coach: [100, 612],
  flex: [236, 612],
};
