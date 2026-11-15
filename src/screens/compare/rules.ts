// Compare's rules, as the picture and spec/12 (Compare) set them, kept apart from the drawing so the tests read them.

import { formatEok, WON_PER_EOK } from "../../parts";
import { LINEUP_ORDER, type RoleKey } from "../../rift";
import type { CompareRole, SearchRow } from "./fixtures";

/** A price in 억, from the fixtures' 억 figures. */
export const eok = (n: number) => formatEok(n * WON_PER_EOK);

/** Which side holds the higher number; none when they are level. Higher is better for Season, Form and line points. */
export type Side = "left" | "right" | null;

export function better(left: number, right: number): Side {
  if (left === right) return null;
  return left > right ? "left" : "right";
}

const MINUS = "−";

/** Points with their sign: `+22`, `−4`, `0`. */
export function signed(points: number): string {
  if (points > 0) return `+${points}`;
  if (points < 0) return `${MINUS}${-points}`;
  return "0";
}

/** A line's season total over the games he played, to one decimal. */
export const perGame = (total: number, games: number) => (total / games).toFixed(1);

/** `1st`, `2nd`, `3rd`, `11th`. */
export function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th"}`;
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
