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

const KST_ZONE = "Asia/Seoul";

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

/** Each setting's tab and its name in the save bar, in the order the tabs show them. */
const FIELDS: { [K in keyof SettingsValues]: { tab: SettingsTab; name: string } } = {
  teamName: { tab: "Team", name: "team name" },
  banner: { tab: "Team", name: "hangul banner" },
  favouriteTeam: { tab: "Team", name: "favourite team" },
  country: { tab: "Team", name: "country" },
  timeZone: { tab: "Display", name: "time zone" },
  theme: { tab: "Display", name: "theme" },
  deadlineReminder: { tab: "Emails", name: "deadline reminder" },
  weeklyRecap: { tab: "Emails", name: "weekly recap" },
};

/** The settings the draft changes from what is saved. */
export function changedFields(saved: SettingsValues, draft: SettingsValues): (keyof SettingsValues)[] {
  return (Object.keys(FIELDS) as (keyof SettingsValues)[]).filter((key) => saved[key] !== draft[key]);
}

/** The save bar's words: `1 change: hangul banner`. */
export function changeLine(changed: (keyof SettingsValues)[]): string {
  const count = changed.length;
  return `${count} change${count === 1 ? "" : "s"}: ${changed.map((key) => FIELDS[key].name).join(", ")}`;
}

/** The tabs holding an unsaved change, which carry a dot. */
export function dirtyTabs(changed: (keyof SettingsValues)[]): Set<SettingsTab> {
  return new Set(changed.map((key) => FIELDS[key].tab));
}

/** Characters as a reader counts them, hangul syllables one each. */
const charCount = (text: string) => [...text].length;

/** Text cut to the name cap. */
export const capName = (text: string) => [...text].slice(0, NAME_MAX).join("");

/** The counter beside a capped field: `14/20`. */
export const counter = (text: string) => `${charCount(text)}/${NAME_MAX}`;

/** The zone a time shows in: the browser's, or the one picked. */
export const zoneOf = (timeZone: string, browserZone: string) => (timeZone === BROWSER ? browserZone : timeZone);

function clock(instant: string, zone: string, withDay: boolean): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    weekday: withDay ? "short" : undefined,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(instant));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const time = `${part("hour")}:${part("minute")}`;
  return withDay ? `${part("weekday")} ${time}` : time;
}

/** An instant as the Time part shows it: in the manager's zone with its day (`Wed 07:45`), then KST (`16:45`). */
export function timeIn(instant: string, zone: string): { local: string; kst: string } {
  return { local: clock(instant, zone, true), kst: clock(instant, KST_ZONE, false) };
}

/** The reminder's lead time as the Emails tab shows it: `24 hours before`. */
export const hoursBefore = (hours: number) => `${hours} hour${hours === 1 ? "" : "s"} before`;

/** Save team is offered once a favourite team is picked and the 16+ box ticked (spec/09). */
export const canSaveTeam = (favouriteTeam: TeamCode | null, ticked: boolean) => favouriteTeam !== null && ticked;
