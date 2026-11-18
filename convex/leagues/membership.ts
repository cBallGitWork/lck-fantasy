// Who is in which league, and who may change it (spec/08-leagues.md).

export interface LeagueSettings {
  /** The most private leagues one manager can be in: 25, as in FPL. */
  privateLeagueCap: number;
  /** The most members in a private league; null for no cap, as in FPL. */
  privateLeagueSize: number | null;
}

/** A league every manager joins on their own, keyed so each exists once. */
export type AutoLeague = { kind: "overall" } | { kind: "country"; country: string } | { kind: "team"; teamId: string };

/** Overall, their country's league and their favourite team's supporter league (spec/08). */
export function autoLeagues(manager: { country: string; favouriteTeamId: string }): AutoLeague[] {
  return [
    { kind: "overall" },
    { kind: "country", country: manager.country },
    { kind: "team", teamId: manager.favouriteTeamId },
  ];
}

/** The favourite team, and so the supporter league, can change until the deadline of the manager's
 *  first gameweek; after that it is fixed (spec/08, Craig, 15 Nov 2026). The country follows the
 *  same rule. Both times in ms since the epoch. */
export function canChangeFavouriteTeam(firstDeadline: number, now: number): boolean {
  return now < firstDeadline;
}

export type JoinProblem = { rule: "privateLeagueCap"; cap: number } | { rule: "leagueFull"; size: number };

/** Whether a manager in `privateLeaguesIn` private leagues can join one of `members` members. */
export function joinProblems(privateLeaguesIn: number, members: number, settings: LeagueSettings): JoinProblem[] {
  const problems: JoinProblem[] = [];
  if (privateLeaguesIn >= settings.privateLeagueCap) problems.push({ rule: "privateLeagueCap", cap: settings.privateLeagueCap });
  if (settings.privateLeagueSize !== null && members >= settings.privateLeagueSize) {
    problems.push({ rule: "leagueFull", size: settings.privateLeagueSize });
  }
  return problems;
}

/** The gameweeks a new private league can count from: this one or a later one, this one first as
 *  the default (spec/08, Private leagues). */
export function startGameweekChoices(current: number, lastOfSeason: number): number[] {
  const choices: number[] = [];
  for (let gameweek = current; gameweek <= lastOfSeason; gameweek++) choices.push(gameweek);
  return choices;
}

export type PrivateLeagueAction = "rename" | "remove" | "delete" | "leave";

/** The maker can rename, remove a manager and delete; any other member can leave. The maker can't
 *  leave: they delete the league instead (spec/08). */
export function mayAct(action: PrivateLeagueAction, actorId: string, makerId: string): boolean {
  const isMaker = actorId === makerId;
  if (action === "leave") return !isMaker;
  return isMaker;
}

/** Letters and digits a code is made of: no 0, O, 1, I or L, which read alike. */
const CODE_CHARACTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_PART_LENGTH = 4;

/** A private league's join code: up to four letters of its name's first word, then four random
 *  characters (GANK-4TQ1); two random parts when the name starts with none (a hangul name).
 *  `random` returns a number in [0, 1), as Math.random does. */
export function joinCode(name: string, random: () => number): string {
  const part = () =>
    Array.from({ length: CODE_PART_LENGTH }, () => CODE_CHARACTERS[Math.floor(random() * CODE_CHARACTERS.length)]).join("");
  const firstWord = name.trim().split(/\s+/)[0] ?? "";
  const prefix = firstWord.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_PART_LENGTH);
  return `${prefix || part()}-${part()}`;
}

/** A typed code as codes are stored: trimmed, in capitals. */
export const normalCode = (code: string) => code.trim().toUpperCase();
