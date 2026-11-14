// Signing up and joining late (spec/09-onboarding.md): a guest's squad becomes an entry on Save.
import { budgetProblems, type BudgetProblem, type Prices } from "../squads/budget";
import { squadProblems, type Squad, type SquadProblem, type SquadSettings } from "../squads/squad";

export interface SignUpFields {
  teamName: string;
  favouriteTeamId: string;
  country: string;
}

export interface SignUpRules {
  squad: SquadSettings;
  budget: number | null;
  /** The longest team name, as FPL caps it; names need not be unique (spec/09). */
  teamNameMaxLength: number;
  /** The competition's teams: the favourite team is one of them (spec/08). */
  teamIds: readonly string[];
}

export type SignUpProblem =
  | { rule: "squad"; problem: SquadProblem | BudgetProblem }
  | { rule: "missing"; field: keyof SignUpFields }
  | { rule: "teamNameTooLong"; maxLength: number }
  | { rule: "unknownTeam"; teamId: string };

/** Why a guest's Save can't become an entry; empty when it can. */
export function signUpProblems(squad: Squad, prices: Prices, fields: SignUpFields, rules: SignUpRules): SignUpProblem[] {
  const problems: SignUpProblem[] = [
    ...squadProblems(squad, rules.squad),
    ...budgetProblems(squad, prices, rules.budget),
  ].map((problem) => ({ rule: "squad", problem }));
  for (const field of ["teamName", "favouriteTeamId", "country"] as const) {
    if (fields[field].trim() === "") problems.push({ rule: "missing", field });
  }
  if ([...fields.teamName.trim()].length > rules.teamNameMaxLength) {
    problems.push({ rule: "teamNameTooLong", maxLength: rules.teamNameMaxLength });
  }
  if (fields.favouriteTeamId !== "" && !rules.teamIds.includes(fields.favouriteTeamId)) {
    problems.push({ rule: "unknownTeam", teamId: fields.favouriteTeamId });
  }
  return problems;
}

/** The first gameweek a new entry scores: the first whose deadline is still to come when it joins,
 *  starting on 0 points (spec/09, Joining late). Null when every deadline has passed. */
export function firstScoringGameweek(joinedAt: number, gameweeks: readonly { number: number; deadline: number }[]): number | null {
  const open = gameweeks.filter((gw) => gw.deadline > joinedAt).sort((a, b) => a.deadline - b.deadline);
  return open[0]?.number ?? null;
}
