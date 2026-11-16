// Compare's rules, as the picture and spec/12 (Compare) set them, kept apart from the drawing so the tests read them.

import { nameMatches } from "../../parts";
import { ROLE_KEYS, type PersonRole } from "../../rift";
import type { SearchRow } from "./fixtures";

/** Which side holds the higher number; none when they are level. Higher is better for Season, Form and line points. */
export type Side = "left" | "right" | null;

export function better(left: number, right: number): Side {
  if (left === right) return null;
  return left > right ? "left" : "right";
}

/** A role named as a group of players: the search's heads and the season rank (`2nd of 10 mids`). */
export const ROLE_PLURAL: Record<PersonRole, string> = {
  top: "Tops",
  jng: "Junglers",
  mid: "Mids",
  bot: "Bots",
  sup: "Supports",
  coach: "Coaches",
};

export interface SearchGroup {
  role: PersonRole;
  rows: SearchRow[];
}

/**
 * The second player's search: never the first player; a coach only against a coach. His role is
 * listed first, best season first; the other roles show once asked for (`wide`) or once a name is typed.
 */
export function searchGroups(rows: readonly SearchRow[], first: { name: string; role: PersonRole }, query: string, wide: boolean): SearchGroup[] {
  const roles: PersonRole[] = first.role === "coach" ? ["coach"] : [first.role, ...ROLE_KEYS.filter((r) => r !== first.role)];
  const shown = query.trim() || wide ? roles : roles.slice(0, 1);
  return shown
    .map((role) => ({
      role,
      rows: rows
        .filter((r) => r.role === role && r.name !== first.name && nameMatches(r.name, query))
        .sort((x, y) => y.points - x.points),
    }))
    .filter((g) => g.rows.length > 0);
}
