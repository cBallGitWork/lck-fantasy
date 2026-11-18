// Settings' words, named once. Every word a player reads on this screen lives here.

import type { SettingsTab, SettingsValues, ThemeChoice } from "./settings";

export const WORDS = {
  title: "Settings",
  hangul: "설정",
  /** The four tabs, by the rules' names for them. */
  tabs: { Team: "Team", Display: "Display", Emails: "Emails", Account: "Account" } satisfies Record<SettingsTab, string>,
  /** After a tab holding an unsaved change: `Team •`. */
  dirtyMark: " •",
  /** The save bar's keys. */
  reset: "Reset",
  save: "Save",
  /** Team. */
  teamName: "Team name",
  banner: "Hangul banner",
  optional: "Optional",
  /** The greyed word holding the hangul's place while the banner is empty (Profile then shows the team name alone). */
  emptyBanner: "배너",
  favouriteTeam: "Favourite team",
  country: "Country",
  locked: "Locked",
  /** Display. */
  timeZone: "Time zone",
  theme: "Theme",
  themes: { Device: "Device", Light: "Light", Dark: "Dark" } satisfies Record<ThemeChoice, string>,
  /** Emails. */
  deadlineReminder: "Deadline reminder",
  weeklyRecap: "Weekly recap",
  weeklyRecapWhen: "Once the week is final",
  on: "On",
  off: "Off",
  /** Account. */
  email: "Email",
  signOut: "Sign out",
  public: "Public",
  publicFields: "Team name, favourite team, country, banner, points",
  yourData: "Your data",
  download: "Download my data",
  deleteAccount: "Delete account",
  /** The foot. */
  privacy: "Privacy ›",
  terms: "Terms ›",
  privacyEmail: "privacy email",
  /** The Delete account sheet. */
  deleteTitle: "Delete account?",
  backups: "Backups clear within 30 days.",
  keepCopy: "first to keep a copy.",
  back: "Back",
} as const;

/** Each setting's name in the save bar. */
export const FIELD_NAMES: Record<keyof SettingsValues, string> = {
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
export const changesNamed = (names: string[]) => `${names.length} change${names.length === 1 ? "" : "s"}: ${names.join(", ")}`;

/** The reminder's lead time as the Emails tab shows it: `24 hours before`. */
export const hoursBefore = (hours: number) => `${hours} hour${hours === 1 ? "" : "s"} before`;

/** The time zone choice that follows the browser: `Browser · Europe/London`. */
export const browserZoneLabel = (zone: string) => `Browser · ${zone}`;

/** Where the emails go: `Sent to barons.steal.fc@gmail.com`. */
export const sentTo = (email: string) => `Sent to ${email}`;

/** Which sign-in the email came from: `from Google`. */
export const fromProvider = (provider: string) => `from ${provider}`;

/** The Delete sheet's lead: `Baron Steal FC is erased at once and can't be brought back.` */
export const erased = (team: string) => `${team} is erased at once and can't be brought back.`;
