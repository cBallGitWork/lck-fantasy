// The Settings picture's made-up data (docs/design/approved/settings/): Baron Steal FC on Week 4's
// Tuesday, before the deadline, with one unsaved change to the hangul banner. Not roster data.

import { MANAGER } from "../../fixtures/week3";
import { BROWSER, type Account, type DeleteRow, type SettingsValues } from "./settings";
import type { SignUpAnswers } from "./SignUp";

/** What Baron Steal FC has saved. */
export const SAVED: SettingsValues = {
  teamName: MANAGER.team,
  banner: "",
  favouriteTeam: "T1",
  country: "United Kingdom",
  timeZone: BROWSER,
  theme: "Device",
  deadlineReminder: true,
  weeklyRecap: false,
};

/** The picture's moment: the banner typed, not yet saved. */
export const DRAFT: SettingsValues = { ...SAVED, banner: MANAGER.hangul };

export const ACCOUNT: Account = { email: "barons.steal.fc@gmail.com", provider: "Google" };

/** Week 4's deadline as an instant: Wed 20 Jan 2027, 16:45 KST. */
export const DEADLINE_AT = "2027-01-20T07:45:00Z";

/** The zone the picture's browser reports. */
export const BROWSER_ZONE = "Europe/London";

/** The zones a manager may pick, until the backend gives the full list. */
export const ZONES = ["Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles", "Asia/Seoul", "Australia/Sydney"];

/** The countries a manager may pick, until the backend gives the full list. */
export const COUNTRIES = ["United Kingdom", "South Korea", "United States", "France", "Germany", "Vietnam"];

/** Whether the first deadline has passed, so favourite team and country are locked. */
export const LOCKED = true;

/** What the Delete sheet lists for Baron Steal FC. */
export const DELETE_ROWS: DeleteRow[] = [
  { what: "Team and squad", detail: MANAGER.team },
  { what: "Points and history", detail: "Weeks 1–3 · 187 pts" },
  { what: "Ranks in 5 leagues", detail: "Overall, United Kingdom, T1, 2 private" },
  { what: "Follows", detail: "12 following · 9 followers" },
  { what: "Pub League", detail: "passes to Haru's Tower Divers" },
];

/** A guest's squad at sign-up: all nine picked. */
export const SQUAD_SIZE = 9;

/** Sign-up step 2 as the picture draws it: no team picked, the box unticked. */
export const SIGN_UP: SignUpAnswers = {
  teamName: MANAGER.team,
  favouriteTeam: null,
  country: "United Kingdom",
  ticked: false,
};
