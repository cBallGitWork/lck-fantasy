import type { SlotKey } from "./roles";

/** A tile's centre on the Rift, in the map's own 720 square (`PLAN`, riftPlan.ts). A tile stands at the same share of the Rift at any width. */
export type RiftPoint = readonly [x: number, y: number];

/** A tile's centre on a desk's Rift and on a phone's, where a tile is a bigger share of the map and is pulled in so none hangs off it. */
export type RiftPlace = { readonly desk: RiftPoint; readonly phone: RiftPoint };

/**
 * Where each starter stands on Pick Team, Points and Perfect game, as the approved picture
 * (docs/design/approved/pick-team/render.js): Top level with Flex, Jungle in the middle of his jungle,
 * Mid in mid lane, Coach under Top, Bot beside Support under Flex, Coach and Flex beside each nexus,
 * leaving it showing (Craig, 19 Nov 2026).
 */
export const RIFT_SLOTS: Record<SlotKey, RiftPlace> = {
  top: { desk: [132, 124], phone: [150, 150] },
  jng: { desk: [196, 340], phone: [196, 362] },
  mid: { desk: [372, 372], phone: [372, 366] },
  bot: { desk: [470, 600], phone: [396, 572] },
  sup: { desk: [592, 600], phone: [563, 572] },
  coach: { desk: [132, 600], phone: [150, 572] },
  flex: { desk: [592, 124], phone: [563, 150] },
};
