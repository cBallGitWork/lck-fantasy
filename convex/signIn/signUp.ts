// Signing up and joining late (spec/09-onboarding.md): a guest's squad becomes an entry on Save.
import { budgetProblems, requirePrice, type BudgetProblem, type Prices } from "../squads/budget";
import { squadProblems, STARTER_SLOTS, type Pick, type Squad, type SquadProblem, type SquadSettings } from "../squads/squad";

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

/** How far over the budget the squad is at the prices it is saved at, in won; null when it isn't
 *  over. The Save bar says it, such as ₩0.3m over, when a deadline has moved prices since the
 *  squad was picked (spec/09, Signing up). */
export function overBudgetBy(problems: readonly SignUpProblem[]): number | null {
  for (const problem of problems) {
    if (problem.rule === "squad" && problem.problem.rule === "overBudget") return problem.problem.cost - problem.problem.budget;
  }
  return null;
}

/** A new manager's first Captain: the highest-priced starting player, never the coach; a tie goes
 *  to the first in slot order (spec/09, Signing up: after Save team). */
export function firstCaptain(squad: Squad, prices: Prices): string {
  const players = STARTER_SLOTS.filter((slot) => slot !== "coach")
    .flatMap((slot) => squad.starters.filter((starter) => starter.slot === slot))
    .map((starter) => starter.pick);
  const dearest = players.reduce<Pick | undefined>(
    (best, pick) => (best === undefined || requirePrice(pick, prices) > requirePrice(best, prices) ? pick : best),
    undefined,
  );
  if (dearest === undefined) throw new Error("A squad with no starting player has no Captain.");
  return dearest.id;
}

/** The first gameweek a new entry scores: the first whose deadline is still to come when it joins,
 *  starting on 0 points (spec/09, Joining late). Null when every deadline has passed. */
export function firstScoringGameweek(joinedAt: number, gameweeks: readonly { number: number; deadline: number }[]): number | null {
  const open = gameweeks.filter((gw) => gw.deadline > joinedAt).sort((a, b) => a.deadline - b.deadline);
  return open[0]?.number ?? null;
}
