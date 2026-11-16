// A follow, truck line or truck change that breaks a rule is thrown, never applied silently.

/** Thrown with the rule broken: `Truck refused: alreadySent.` */
export class Refused<P extends { rule: string }> extends Error {
  constructor(what: string, readonly problem: P) {
    super(`${what} refused: ${problem.rule}.`);
  }
}

/** Throws the first of `problems`; nothing when there are none. */
export function refuseFirst<P extends { rule: string }>(what: string, problems: readonly P[]): void {
  const [problem] = problems;
  if (problem) throw new Refused(what, problem);
}
