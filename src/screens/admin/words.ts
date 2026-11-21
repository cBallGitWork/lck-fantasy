// The admin section's words: read by the admin alone, never a player.
import type { AdminRefusal } from "../../../convex/admin/access";

import type { AlertKind } from "../../../convex/admin/alertKinds";

export const TABS = ["Sim", "Alerts", "Report"] as const;
export type AdminTab = (typeof TABS)[number];

export const WORDS = {
  passwordLabel: "Admin password",
  open: "Open",
  noConvex: "Not connected to Convex: VITE_CONVEX_URL is empty.",
  refused: {
    wrongPassword: "That isn't the admin password.",
    noPasswordSet: "This deployment has no admin password: add ADMIN_PASSWORD in Convex.",
  } satisfies Record<AdminRefusal["rule"], string>,
  failed: "That didn't work",
  notSim: "This is the real site: its clock is the real time.",
  notStarted: "The sim's clock isn't started: run admin/clock:startSimClock.",
  simDate: "Sim date",
  nextDay: "Next day",
  playToEnd: "Play to end",
  pressing: "Playing…",
  noGamesLeft: "No games left",
  /** `2 games replaying`: the keys wait until they're final. */
  replaying: (games: number) => `${games} game${games === 1 ? "" : "s"} replaying`,
  /** `Thu 15 Jan: 2 series played, GW1 deadline passed`. */
  played: (day: string, series: number, deadlines: number[]) => {
    const passed = deadlines.length === 0 ? "" : `, ${deadlines.map((n) => `GW${n}`).join(", ")} deadline${deadlines.length === 1 ? "" : "s"} passed`;
    return `${day}: ${series} series played${passed}`;
  },
  noAlerts: "No alerts",
  kind: {
    feedDown: "Feed down",
    noLaneOpponent: "No lane opponent",
    pointsMismatch: "Points mismatch",
  } satisfies Record<AlertKind, string>,
  closedAlert: "Closed",
  close: "Close",
  noSeason: "No season loaded",
  openAlerts: "Open alerts",
  mismatches: "Points mismatches",
  mismatchesNote: "every one raised, open or closed",
  prices: "Prices",
  role: "Role",
  start: "Start",
  end: "End",
  /** `Faker ₩18.5m`. */
  priced: (name: string, money: string) => `${name} ${money}`,
  dearestCheapest: "dearest, cheapest",
  weeks: "Moves",
  /** `Week 2: 3 up, 1 down`. */
  week: (gameweek: number, rises: number, falls: number) => `Week ${gameweek}: ${rises} up, ${falls} down`,
  risers: "Biggest risers",
  fallers: "Biggest fallers",
  none: "None",
} as const;
