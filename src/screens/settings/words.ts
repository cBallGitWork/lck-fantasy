// Settings' words, named once. Every word a player reads on this screen lives here.

import { plural } from "../../parts";
import type { SettingsTab, SettingsValues, ThemeChoice } from "./settings";

export const WORDS = {
  title: "Settings",
  hangul: "설정",
  /** The tabs, for a reader. */
  tabs: "Settings",
  /** After a tab holding an unsaved change. */
  dirtyMark: " •",
  reset: "Reset",
  save: "Save",
  locked: "Locked",
  teamName: "Team name",
  banner: "Hangul banner",
  optional: "Optional",
  /** The greyed word holding the hangul's place while the banner is empty (Profile then shows the team name alone). */
  emptyBanner: "배너",
  favouriteTeam: "Favourite team",
  country: "Country",
  timeZone: "Time zone",
  theme: "Theme",
  on: "On",
  off: "Off",
  deadlineReminder: "Deadline reminder",
  weeklyRecap: "Weekly recap",
  /** When the weekly recap goes. */
  recapWhen: "Once the week is final",
  email: "Email",
  signOut: "Sign out",
  public: "Public",
  publicList: "Team name, favourite team, country, banner, points",
  yourData: "Your data",
  /** The feature's name in spec/12. */
  download: "Download my data",
  deleteAccount: "Delete account",
  privacy: "Privacy ›",
  terms: "Terms ›",
  /** Holds the privacy email's place until Flol's domain. */
  privacyEmail: "privacy email",
  /** The Delete sheet. */
  deleteTitle: "Delete account?",
  backups: "Backups are deleted within 30 days.",
  keepCopy: "first to keep a copy.",
  back: "Back",
  /** The Delete sheet's rows. */
  teamAndSquad: "Team and squad",
  pointsAndHistory: "Points and history",
  follows: "Following and followers",
} as const;

export const TAB_NAMES: Record<SettingsTab, string> = {
  Team: "Team",
  Display: "Display",
  Emails: "Emails",
  Account: "Account",
};

export const THEME_NAMES: Record<ThemeChoice, string> = {
  Device: "Device",
  Light: "Light",
  Dark: "Dark",
};

/** Each setting's name in the save bar. */
const FIELD_NAMES: Record<keyof SettingsValues, string> = {
  teamName: "team name",
  banner: "hangul banner",
  favouriteTeam: "favourite team",
  country: "country",
  timeZone: "time zone",
  theme: "theme",
  deadlineReminder: "deadline reminder",
  weeklyRecap: "weekly recap",
};

/** The save bar's words: `1 change: hangul banner`. */
export const changeLine = (changed: (keyof SettingsValues)[]) =>
  `${plural(changed.length, "change")}: ${changed.map((key) => FIELD_NAMES[key]).join(", ")}`;

/** The reminder's lead time as the Emails tab shows it: `24 hours before`. */
export const hoursBefore = (hours: number) => `${plural(hours, "hour")} before`;

/** `Browser · Europe/London`: the time zone the browser reports, as the first choice. */
export const browserZoneLabel = (zone: string) => `Browser · ${zone}`;

/** `Sent to barons.steal.fc@gmail.com`: where the emails go. */
export const sentTo = (email: string) => `Sent to ${email}`;

/** `from Google`: how the manager signs in. */
export const fromProvider = (provider: string) => `from ${provider}`;

/** The Delete sheet's sentence, erased at once (docs/decisions.md): `Baron Steal FC is deleted at once. You can't undo this.` */
export const erased = (team: string) => `${team} is deleted at once. You can't undo this.`;

/** `Weeks 1–3 · 187 pts`: the weeks played and the points they scored. */
export const weeksPoints = (from: number, to: number, points: number) => `Weeks ${from}–${to} · ${points} pts`;

/** `Ranks in 5 leagues`. */
export const ranksIn = (leagues: number) => `Ranks in ${plural(leagues, "league")}`;

/** `Overall, United Kingdom, T1, 2 private`: the general leagues by name, then the private ones counted. */
export const leagueList = (general: string[], privateCount: number) =>
  [...general, ...(privateCount > 0 ? [`${privateCount} private`] : [])].join(", ");

/** `12 following · 9 followers`. */
export const followCounts = (following: number, followers: number) => `${following} following · ${plural(followers, "follower")}`;

/** `Haru's Tower Divers becomes admin`: who a private league passes to (spec/12, Settings). */
export const passesTo = (team: string) => `${team} becomes admin`;
