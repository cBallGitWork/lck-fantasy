// The nine after the plan, by role: how the views group them, and how the squad is arranged on confirm
// (the squad rule, Craig 16 Nov 2026: at least one of each role, any role for any role past that).

import { BENCH_SLOTS, PERSON_ROLES, ROLE_KEYS, type Mark, type PersonRole, type SquadSlot } from "../../rift";
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

/**
 * The squad after the transfers, arranged by role: each role's slot needs one of that role. A starter
 * who kept his place keeps it; a role slot whose new player is of another role swaps with one of its
 * role, taken first from another wrongly placed slot, then a buy, then the bench, then the Flex.
 */
export function arrange(squad: SquadPlayer[], plan: Plan): Record<SquadSlot, ListPlayer> {
  const at = Object.fromEntries(SQUAD_SLOTS.map((slot) => [slot, inSlot(squad, plan, slot)])) as Record<SquadSlot, ListPlayer | null>;
  if (SQUAD_SLOTS.some((slot) => !at[slot])) throw new Error("Transfers: arrange needs every slot filled");
  const placed = at as Record<SquadSlot, ListPlayer>;
  const bought = (slot: SquadSlot) => slot in plan.sold;
  for (const role of ROLE_KEYS) {
    if (placed[role].role === role) continue;
    const from = [
      ...ROLE_KEYS.filter((r) => r !== role && placed[r].role !== r),
      ...[...BENCH_SLOTS, "flex" as const].filter(bought),
      ...BENCH_SLOTS,
      "flex" as const,
    ].find((slot) => placed[slot].role === role);
    if (!from) throw new Error(`Transfers: no ${role} in the squad`);
    [placed[role], placed[from]] = [placed[from], placed[role]];
  }
  return placed;
}

/** The arranged nine by id, as a confirm hands them over. */
export const lineupIds = (squad: SquadPlayer[], plan: Plan) =>
  Object.fromEntries(Object.entries(arrange(squad, plan)).map(([slot, p]) => [slot, p.id])) as Record<SquadSlot, string>;
