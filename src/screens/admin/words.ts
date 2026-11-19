// The admin section's words: read by the admin alone, never a player.
import type { AdminRefusal } from "../../../convex/admin/access";

export const TABS = ["Sim", "Alerts"] as const;
export type AdminTab = (typeof TABS)[number];

export const WORDS = {
  keyLabel: "Admin key",
  open: "Open",
  noConvex: "Not connected to Convex: set VITE_CONVEX_URL.",
  refused: {
    wrongKey: "That isn't the admin key.",
    noKeySet: "No admin key is set: set ADMIN_KEY on this Convex deployment.",
  } satisfies Record<AdminRefusal["rule"], string>,
  failed: "That didn't work",
  notSim: "This is the real site: its clock is the real time.",
  notStarted: "The sim's clock isn't started: run admin/clock:startSimClock.",
  simDate: "Sim date",
  nextDay: "Next day",
  playToEnd: "Play to end",
  pressing: "Playing…",
  noGamesLeft: "No games left",
  /** `Thu 15 Jan: 2 series played, GW1 deadline passed`. */
  played: (day: string, series: number, deadlines: number[]) => {
    const passed = deadlines.length === 0 ? "" : `, ${deadlines.map((n) => `GW${n}`).join(", ")} deadline${deadlines.length === 1 ? "" : "s"} passed`;
    return `${day}: ${series} series played${passed}`;
  },
  noAlerts: "No alerts",
} as const;
