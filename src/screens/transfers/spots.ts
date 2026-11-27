// Where the nine stand on Transfers' Rift: by role, no bench, as FPL's Transfers pitch stands all fifteen
// by position (Craig, 16 Nov 2026). A role's players stand side by side under its name, said once
// (approved/transfers/, What binds 1).

import type { PersonRole, RiftPoint } from "../../rift";

/**
 * Each role's group, its centre on the square Rift (the map's own 720, `PLAN`), as the picture
 * (approved/transfers/render.js): top along top lane, jungle in the blue jungle, mid on mid lane, Bot
 * and Support along bot lane, the coach by the blue base.
 */
const GROUP_AT: Record<PersonRole, RiftPoint> = {
  top: [190, 132],
  jng: [172, 338],
  mid: [432, 392],
  bot: [470, 588],
  sup: [592, 588],
  coach: [132, 588],
};

/** How far left each extra Bot moves the group, so a second Bot stands clear of the Support. */
const BOT_STEP = 60;

/** Where a role's group of `n` stands. */
export function groupAt(role: PersonRole, n: number): RiftPoint {
  const [x, y] = GROUP_AT[role];
  return [role === "bot" ? x - BOT_STEP * (n - 1) : x, y];
}
