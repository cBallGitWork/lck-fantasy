// Patch update's made-up data (docs/design/approved/patch-update/patch.html): the moves made at the
// Week 3 deadline, as Week 4's prices. The new prices, teams and owned % are the Stats list's
// (statsOf); a dot marks the players in Baron Steal FC's squad (PICK_TEAM_SQUAD).

import { MY_PLAYERS, playerId, statsOf, WEEK3_DEADLINE, type TeamCode } from "../../fixtures/week3";
import type { PersonRole } from "../../rift";

/** One player's or coach's price move, in m. */
export interface PriceMove {
  id: string;
  name: string;
  team: TeamCode;
  role: PersonRole;
  wasEok: number;
  nowEok: number;
  ownedPct: number;
  /** One of your own players. */
  mine: boolean;
}

/** One week's new prices: when they were set, then the rises and falls in the picture's order. */
export interface PriceWeek {
  week: number;
  /** When the prices were set, your time then KST; absent before the first move. */
  set?: { local: string; kst: string };
  rises: PriceMove[];
  falls: PriceMove[];
}

/** A price move from `wasEok`; the new price, team, role and owned % are the Stats list's. */
const move = (name: string, wasEok: number): PriceMove => {
  const { team, role, priceEok, ownedPct } = statsOf(name);
  return { id: playerId(name), name, team, role, wasEok, nowEok: priceEok, ownedPct, mine: MY_PLAYERS.has(name) };
};

/** Week 4's prices, set at the Week 3 deadline (patch.html). */
export const WEEK4_PRICES: PriceWeek = {
  week: 4,
  set: { local: `${WEEK3_DEADLINE.day} ${WEEK3_DEADLINE.date} ${WEEK3_DEADLINE.time}`, kst: WEEK3_DEADLINE.kst },
  rises: [
    move("Faker", 18.0),
    move("Chovy", 17.0),
    move("Peyz", 14.5),
    move("Siwoo", 11.0),
    move("BuLLDoG", 10.5),
    move("Lucid", 8.5),
    move("Kingen", 6.0),
    move("Ssong", 5.0),
    move("Hype", 5.0),
  ],
  falls: [
    move("Gumayusi", 16.0),
    move("Aiming", 14.0),
    move("ShowMaker", 13.5),
    move("Doran", 13.0),
    move("DuDu", 6.5),
    move("Clear", 6.0),
    move("DanDy", 5.5),
    move("Edgar", 5.0),
  ],
};

/** Week 3, before the first move: both lists read `No moves yet` (the picture's README). */
export const WEEK3_PRICES: PriceWeek = { week: 3, rises: [], falls: [] };

/** The weeks ‹ › step through, oldest first. */
export const PRICE_WEEKS: PriceWeek[] = [WEEK3_PRICES, WEEK4_PRICES];
