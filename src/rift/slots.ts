import type { SlotKey } from "./roles";

/**
 * A tile's centre on the Rift, in the pictures' px from its top left (984 × 560, the main column at
 * 1440). A tile stands at the same share of the Rift at any width.
 */
export type RiftPoint = readonly [x: number, y: number];

/** Where each starter stands on Points and Perfect game (points.html, perfect.html). */
export const RIFT_SLOTS: Record<SlotKey, RiftPoint> = {
  top: [104, 70],
  jng: [280, 262],
  mid: [500, 260],
  coach: [92, 468],
  flex: [252, 468],
  sup: [650, 486],
  bot: [846, 486],
};

/** Where each starter stands on Pick Team, whose narrower tiles sit a little further right (pick.html). */
export const RIFT_SLOTS_PICK: Record<SlotKey, RiftPoint> = {
  top: [104, 70],
  jng: [312, 262],
  mid: [532, 262],
  coach: [124, 468],
  flex: [282, 468],
  sup: [682, 486],
  bot: [878, 486],
};
