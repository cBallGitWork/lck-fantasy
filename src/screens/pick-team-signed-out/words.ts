// The front door's words, named once. Every word a player reads on this screen lives here.

export const WORDS = {
  title: "Pick your squad",
  hangul: "스쿼드 선택",
  picked: "Picked",
  bank: "Bank",
  teamCap: "Team cap",
  view: "View",
  listView: "List view",
  reset: "Reset",
  autoFill: "Auto-fill",
  save: "Save team",
  bench: "Bench",
  anyRole: "Any role",
  players: "Players",
  allRoles: "All roles",
  search: "Search a player",
  all: "All",
  noPlayers: "No players found",
  role: "Role",
  player: "Player",
  price: "Price",
  pts: "Pts",
  owned: "Owned",
  next: "Next",
  pick: "Pick",
  remove: "Remove",
  slot: "Slot",
  versus: "v",
  /** The news once a pick goes in: `Zeus added`. */
  added: "added",
  /** Why Save team is off once all nine are in: `0.3m over`, the league's money sign in front. */
  over: "over",
  /** No place he fits. */
  noRoom: "Squad's full. Remove a player first",
  oneCoach: "One coach only. Remove yours first",
  /** The sign-up sheets (spec/09, Signing up). */
  saveTitle: "Save your team",
  keptLead: "Your squad of 9 is kept while you sign up.",
  noPassword: "No password is stored.",
  yourTeam: "Your team",
  teamName: "Team name",
  favouriteTeam: "Favourite team",
  chooseTeam: "Choose a team",
  country: "Country",
  chooseCountry: "Choose a country",
  lockAt: "Both lock at your first deadline:",
  tickStart: "I'm 16 or over and accept the",
  terms: "Terms",
  and: "and",
  privacy: "Privacy",
} as const;

export const SORT_WORDS = { points: "Points", price: "Price", owned: "Owned" } as const;
export type SortKey = keyof typeof SORT_WORDS;

/** `5 to pick`: why Save team is off. */
export const toPick = (left: number) => `${left} to pick`;

/** `Team full: 2 from T1` (front door picture). */
export const teamFull = (cap: number, team: string) => `Team full: ${cap} from ${team}`;

/** `Pick Chovy`, `Remove Zeus`: a key's name for a reader. */
export const keyFor = (key: string, name: string) => `${key} ${name}`;

/** `Sort: Points ▾`. */
export const sortLabel = (sort: string) => `Sort: ${sort} ▾`;

/** `Team: All ▾`. */
export const teamLabel = (team: string) => `Team: ${team} ▾`;

/** `Continue with Google`. */
export const continueWith = (provider: string) => `Continue with ${provider}`;

/** `1 of 2`: the sign-up step. */
export const stepOf = (step: number) => `${step} of 2`;

/** Save team until sign-in is live: nothing is stored, and the squad stays kept. */
export const SAVE_NOT_LIVE = "Not saved. Sign-up isn't open yet. Your squad is kept in this browser.";

/** `Baron Steal FC is in. 화이팅!`: the one cheer on Save team (spec/09). */
export const joinedCheer = (teamName: string) => `${teamName.trim()} is in. 화이팅!`;
