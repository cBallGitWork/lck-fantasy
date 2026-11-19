// The season report's prices (Craig, 19 Nov 2026, #401): per role the dearest and cheapest at the
// start and the end, the rises and falls at each deadline, and the season's five biggest risers and
// fallers.
import { pricesFor, pickOfPrice } from "../world/season";
import { PLAYER_ROLES, pickKey, type Role } from "../squads/squad";
import type { Prices } from "../squads/budget";

/** How many risers and fallers the report lists. */
export const MOVERS_LISTED = 5;

/** A stored price row (the `prices` table's fields). */
export interface PriceRow {
  fromGameweek: number;
  team: string;
  role: Role;
  handle?: string;
  won: number;
}

/** A pick and a price, or a move, in won: the player's handle, or the coach's team. */
export interface PricedName {
  name: string;
  won: number;
}

export interface RoleSpread {
  role: Role;
  start: { dearest: PricedName; cheapest: PricedName } | null;
  end: { dearest: PricedName; cheapest: PricedName } | null;
}

export interface PriceSpread {
  roles: RoleSpread[];
  /** At each gameweek after the first, how many picks rose and fell from the week before. */
  weeks: { gameweek: number; rises: number; falls: number }[];
  /** Over the season, start to end, biggest first: `won` is the move. */
  risers: PricedName[];
  fallers: PricedName[];
}

/** The spread over `gameweeks`, in number order, from the season's price rows. */
export function priceSpread(rows: readonly PriceRow[], gameweeks: readonly number[]): PriceSpread {
  const first = gameweeks[0];
  const last = gameweeks.at(-1);
  if (first === undefined || last === undefined) return { roles: [], weeks: [], risers: [], fallers: [] };
  const picks = new Map(rows.map((row) => [keyOf(row), { name: row.handle ?? row.team, role: row.role }]));
  const start = pricesFor(rows, first);
  const end = pricesFor(rows, last);

  const ends = (prices: Prices, role: Role) => {
    const priced = [...prices]
      .filter(([key]) => picks.get(key)?.role === role)
      .map(([key, won]) => ({ name: picks.get(key)!.name, won }))
      .sort((a, b) => b.won - a.won || a.name.localeCompare(b.name));
    return priced.length === 0 ? null : { dearest: priced[0]!, cheapest: priced.at(-1)! };
  };
  const roles = [...PLAYER_ROLES, "coach" as const].map((role) => ({ role, start: ends(start, role), end: ends(end, role) }));

  const weeks = gameweeks.slice(1).map((gameweek, i) => {
    const before = pricesFor(rows, gameweeks[i]!);
    const moves = [...pricesFor(rows, gameweek)].map(([key, won]) => won - (before.get(key) ?? won));
    return { gameweek, rises: moves.filter((move) => move > 0).length, falls: moves.filter((move) => move < 0).length };
  });

  const moves = [...end]
    .map(([key, won]) => ({ name: picks.get(key)!.name, won: won - (start.get(key) ?? won) }))
    .sort((a, b) => b.won - a.won || a.name.localeCompare(b.name));
  return {
    roles,
    weeks,
    risers: moves.filter((move) => move.won > 0).slice(0, MOVERS_LISTED),
    fallers: moves.filter((move) => move.won < 0).sort((a, b) => a.won - b.won || a.name.localeCompare(b.name)).slice(0, MOVERS_LISTED),
  };
}

const keyOf = (row: PriceRow) => pickKey(pickOfPrice(row));
