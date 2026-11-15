// Compare's rules, as the picture and spec/12 (Compare) set them, kept apart from the drawing so the tests read them.

import { LINEUP_ORDER, type RoleKey } from "../../rift";
import type { CompareRole, SearchRow } from "./fixtures";

/** Which side holds the higher number; none when they are level. Higher is better for Season, Form and line points. */
export type Side = "left" | "right" | null;

export function better(left: number, right: number): Side {
  if (left === right) return null;
  return left > right ? "left" : "right";
}

/** A role named as a group of players: the search's heads and the season rank (`2nd of 10 mids`). */
export const ROLE_PLURAL: Record<CompareRole, string> = {
  top: "Tops",
  jng: "Junglers",
  mid: "Mids",
  bot: "Bots",
  sup: "Supports",
  coach: "Coaches",
};

/** The search's roles in the broadcast's order. */
const PLAYER_ROLES = LINEUP_ORDER.filter((slot): slot is RoleKey => slot !== "flex" && slot !== "coach");

export interface SearchGroup {
  role: CompareRole;
  rows: SearchRow[];
}

/**
 * The second player's search: never the first player; a coach only against a coach. His role is
 * listed first, best season first; the other roles show once asked for (`wide`) or once a name is typed.
 */
export function searchGroups(rows: readonly SearchRow[], first: { name: string; role: CompareRole }, query: string, wide: boolean): SearchGroup[] {
  const roles: CompareRole[] = first.role === "coach" ? ["coach"] : [first.role, ...PLAYER_ROLES.filter((r) => r !== first.role)];
  const typed = query.trim().toLowerCase();
  const shown = typed || wide ? roles : roles.slice(0, 1);
  return shown
    .map((role) => ({
      role,
      rows: rows
        .filter((r) => r.role === role && r.name !== first.name && r.name.toLowerCase().includes(typed))
        .sort((x, y) => y.points - x.points),
    }))
    .filter((g) => g.rows.length > 0);
}
