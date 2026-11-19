// Settings' rules (spec/12, Settings; spec/09, Signing up): what has changed, on which tab, and how
// times show in the manager's zone.

import type { TeamCode } from "../../fixtures/week3";

export const TABS = ["Team", "Display", "Emails", "Account"] as const;
export type SettingsTab = (typeof TABS)[number];

export const THEMES = ["Device", "Light", "Dark"] as const;
export type ThemeChoice = (typeof THEMES)[number];

/** The time zone value meaning "the one the browser reports". */
export const BROWSER = "browser";

/** Team name and hangul banner are capped, as FPL's name is. */
const NAME_MAX = 20;

export interface SettingsValues {
  teamName: string;
  banner: string;
  favouriteTeam: TeamCode;
  country: string;
  /** `BROWSER`, or a zone the manager picked. */
  timeZone: string;
  theme: ThemeChoice;
  deadlineReminder: boolean;
  weeklyRecap: boolean;
}

export interface Account {
  email: string;
  provider: "Google" | "Discord";
}

/** A line of the Delete sheet: what goes, and its detail where the sentence above hasn't said it. */
export interface DeleteRow {
  what: string;
  detail?: string;
}

/** Each setting's tab, in the order the tabs show them. */
const FIELD_TABS: { [K in keyof SettingsValues]: SettingsTab } = {
  teamName: "Team",
  banner: "Team",
  favouriteTeam: "Team",
  country: "Team",
  timeZone: "Display",
  theme: "Display",
  deadlineReminder: "Emails",
  weeklyRecap: "Emails",
};

/** The settings the draft changes from what is saved. */
export function changedFields(saved: SettingsValues, draft: SettingsValues): (keyof SettingsValues)[] {
  return (Object.keys(FIELD_TABS) as (keyof SettingsValues)[]).filter((key) => saved[key] !== draft[key]);
}

/** The tabs holding an unsaved change, which captain a dot. */
export function dirtyTabs(changed: (keyof SettingsValues)[]): Set<SettingsTab> {
  return new Set(changed.map((key) => FIELD_TABS[key]));
}

/** Characters as a reader counts them, hangul syllables one each. */
const charCount = (text: string) => [...text].length;

/** Text cut to the name cap. */
export const capName = (text: string) => [...text].slice(0, NAME_MAX).join("");

/** The counter beside a capped field: `14/20`. */
export const counter = (text: string) => `${charCount(text)}/${NAME_MAX}`;

/** The zone a time shows in: the browser's, or the one picked. */
export const zoneOf = (timeZone: string, browserZone: string) => (timeZone === BROWSER ? browserZone : timeZone);
