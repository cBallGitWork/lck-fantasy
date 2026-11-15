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

/** The favourite team, and so the supporter league, can change until the manager's first
 *  gameweek scores; after that it is fixed (spec/08). The country follows the same rule. */
export function canChangeFavouriteTeam(firstScoredGameweek: number | null): boolean {
  return firstScoredGameweek === null;
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
