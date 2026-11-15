// Patch update's made-up data (docs/design/approved/patch-update/patch.html): the moves made at the
// Week 3 deadline, as Week 4's prices. Prices and owned agree with the Stats picture where it lists
// the player (STATS_PLAYERS); a dot marks the players in Baron Steal FC's squad (PICK_TEAM_SQUAD).

import { PICK_TEAM_SQUAD, type TeamCode } from "../../fixtures/week3";
import type { PersonRole } from "../../rift";

/** One player's or coach's price move, in 억. */
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

const MY_SQUAD = new Set(PICK_TEAM_SQUAD.map((pick) => pick.name));

const move = (name: string, team: TeamCode, role: PriceMove["role"], wasEok: number, nowEok: number, ownedPct: number): PriceMove => ({
  id: name.toLowerCase(),
  name,
  team,
  role,
  wasEok,
  nowEok,
  ownedPct,
  mine: MY_SQUAD.has(name),
});

/** Week 4's prices, set at the Week 3 deadline (patch.html). */
export const WEEK4_PRICES: PriceWeek = {
  week: 4,
  set: { local: "Wed 13 Jan 07:45", kst: "16:45" },
  rises: [
    move("Faker", "T1", "mid", 18.0, 18.5, 46),
    move("Chovy", "GEN", "mid", 17.0, 17.5, 41),
    move("Peyz", "T1", "bot", 14.5, 15.0, 33),
    move("Siwoo", "DK", "top", 11.0, 11.5, 12),
    move("BuLLDoG", "DNS", "mid", 10.5, 11.0, 6),
    move("Lucid", "DK", "jng", 8.5, 9.0, 4),
    move("Kingen", "NS", "top", 6.0, 6.5, 3),
    move("Ssong", "DNS", "coach", 5.0, 5.5, 3),
    move("Hype", "KRX", "bot", 5.0, 5.5, 2),
  ],
  falls: [
    move("Gumayusi", "HLE", "bot", 16.0, 15.5, 26),
    move("Aiming", "DK", "bot", 14.0, 13.5, 8),
    move("ShowMaker", "DK", "mid", 13.5, 13.0, 9),
    move("Doran", "T1", "top", 13.0, 12.5, 18),
    move("DuDu", "DNS", "top", 6.5, 6.0, 2),
    move("Clear", "BFX", "top", 6.0, 5.5, 1),
    move("DanDy", "NS", "coach", 5.5, 5.0, 1),
    move("Edgar", "BRO", "coach", 5.0, 4.5, 1),
  ],
};

/** Week 3, before the first move: both lists read `No moves yet` (the picture's README). */
export const WEEK3_PRICES: PriceWeek = { week: 3, rises: [], falls: [] };

/** The weeks ‹ › step through, oldest first. */
export const PRICE_WEEKS: PriceWeek[] = [WEEK3_PRICES, WEEK4_PRICES];
