// The nine after the plan, grouped by role as the views draw them.

import { PERSON_ROLES, type Mark, type PersonRole, type SquadSlot } from "../../rift";
import { inSlot, outOf, SQUAD_SLOTS, type ListPlayer, type Plan, type SquadPlayer } from "./plan";

/** One of the nine as the views draw him: his slot, who holds it (the sold one while empty), and whether it is empty. */
export interface SlotHolder {
  slot: SquadSlot;
  player: ListPlayer;
  empty: boolean;
  mark?: Mark;
}

/** The nine grouped by role, the coach last; inside a role, the one in its own slot first, then squad order. */
export function byRole(squad: SquadPlayer[], plan: Plan): { role: PersonRole; holders: SlotHolder[] }[] {
  const nine = SQUAD_SLOTS.map((slot): SlotHolder => {
    const now = inSlot(squad, plan, slot);
    const before = outOf(squad, slot);
    return { slot, player: now ?? before, empty: now === null, mark: now?.id === before.id ? before.mark : undefined };
  });
  const own = (h: SlotHolder) => (h.slot === h.player.role ? 0 : 1);
  return PERSON_ROLES.map((role) => ({ role, holders: nine.filter((h) => h.player.role === role).sort((a, b) => own(a) - own(b)) })).filter((g) => g.holders.length > 0);
}
