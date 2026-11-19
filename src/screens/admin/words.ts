// The admin section's words: read by the admin alone, never a player.
import type { AdminRefusal } from "../../../convex/admin/access";

export const TABS = ["Sim", "Alerts"] as const;
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
  /** `Thu 15 Jan: 2 series played, GW1 deadline passed`. */
  played: (day: string, series: number, deadlines: number[]) => {
    const passed = deadlines.length === 0 ? "" : `, ${deadlines.map((n) => `GW${n}`).join(", ")} deadline${deadlines.length === 1 ? "" : "s"} passed`;
    return `${day}: ${series} series played${passed}`;
  },
  noAlerts: "No alerts",
} as const;
