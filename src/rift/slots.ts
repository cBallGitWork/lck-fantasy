import type { SlotKey } from "./roles";

/**
 * A tile's centre on the Rift, in the pictures' px from its top left (984 × 560, the main column at
 * 1440). A tile stands at the same share of the Rift at any width.
 */
export type RiftPoint = readonly [x: number, y: number];

/**
 * Where each starter stands on Points and Perfect game (points.html, perfect.html). Coach stands under
 * Top and Flex under Jungle; Coach and Flex carry a tag the others don't, so Support and Bot stand a
 * little higher to keep the bottom row's shirts on one line (Craig, 16 Nov 2026).
 */
export const RIFT_SLOTS: Record<SlotKey, RiftPoint> = {
  top: [104, 70],
  jng: [280, 262],
  mid: [500, 260],
  coach: [104, 468],
  flex: [280, 468],
  sup: [650, 457],
  bot: [846, 457],
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
