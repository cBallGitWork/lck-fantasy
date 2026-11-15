// Truck lines (spec/14-following.md, Truck lines): a database of preset lines, each with its kind,
// the week it fits (a trigger) and a weight for how often it comes up. An admin adds a line; it
// shows only once Craig approves it. `fit.ts` picks the lines that fit a receiver's week.

export const TRUCK_KINDS = ["coffee", "protest", "sponsor"] as const;
export type TruckKind = (typeof TRUCK_KINDS)[number];

export const TRIGGERS = [
  "carry_blank",
  "carry_big",
  "took_hits",
  "rank_up",
  "rank_down",
  "top_of_league",
  "bottom_of_league",
  "bench_outscored_starters",
  "no_transfer",
  "buff_played",
  "buff_wasted",
  "price_flop",
  "high_score",
  "low_score",
  "any",
] as const;
export type Trigger = (typeof TRIGGERS)[number];

export const PLACEHOLDERS = ["carryPts", "carry", "hits", "move", "team", "league", "bench", "price", "points", "player"] as const;
export type Placeholder = (typeof PLACEHOLDERS)[number];

/** Placeholders that name a real player: a protest line never carries one (spec/14). */
const PLAYER_PLACEHOLDERS: readonly Placeholder[] = ["player", "carry"];

export const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;

export interface TruckLine {
  id: string;
  kind: TruckKind;
  /** With `{placeholders}`, filled from the receiver's week. */
  text: string;
  trigger: Trigger;
  weight: number;
  /** The made-up sponsor's name, on a sponsor line only (spec/13). */
  sponsor?: string;
  /** Live only once Craig approves it. */
  approved: boolean;
}

export type NewLine = Omit<TruckLine, "approved">;

export type LineProblem =
  | { rule: "duplicateId"; id: string }
  | { rule: "unknownKind"; kind: string }
  | { rule: "unknownTrigger"; trigger: string }
  | { rule: "unknownPlaceholder"; placeholder: string }
  | { rule: "protestNamesPlayer"; placeholder: string }
  | { rule: "sponsorMissing" }
  | { rule: "badWeight"; weight: number }
  | { rule: "noLine"; id: string };

/** Thrown by a line change that breaks a rule, never applied silently. */
export class LineError extends Error {
  constructor(readonly problem: LineProblem) {
    super(`Truck line refused: ${problem.rule}.`);
  }
}

export function isOneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

/** The placeholder names a line's text uses, in order. */
export function placeholdersIn(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER_PATTERN)].map((match) => match[1] ?? "");
}

/** Why a line can't be added; empty when it can. */
export function lineProblems(lines: readonly TruckLine[], line: NewLine): LineProblem[] {
  const problems: LineProblem[] = [];
  if (lines.some((row) => row.id === line.id)) problems.push({ rule: "duplicateId", id: line.id });
  if (!isOneOf(TRUCK_KINDS, line.kind)) problems.push({ rule: "unknownKind", kind: line.kind });
  if (!isOneOf(TRIGGERS, line.trigger)) problems.push({ rule: "unknownTrigger", trigger: line.trigger });
  if (!(line.weight > 0)) problems.push({ rule: "badWeight", weight: line.weight });
  if (line.kind === "sponsor" && !line.sponsor) problems.push({ rule: "sponsorMissing" });
  for (const placeholder of placeholdersIn(line.text)) {
    if (!isOneOf(PLACEHOLDERS, placeholder)) problems.push({ rule: "unknownPlaceholder", placeholder });
    else if (line.kind === "protest" && PLAYER_PLACEHOLDERS.includes(placeholder)) {
      problems.push({ rule: "protestNamesPlayer", placeholder });
    }
  }
  return problems;
}

/** An admin adds a line; it waits for Craig's approval before it shows. */
export function addLine(lines: readonly TruckLine[], line: NewLine): TruckLine[] {
  const [problem] = lineProblems(lines, line);
  if (problem) throw new LineError(problem);
  return [...lines, { ...line, approved: false }];
}

/** Seed rows, each added as an admin adds a line, so each waits for approval. Fields a row carries
 *  beyond a line's (the draft's `placeholders` and `top`) are left out. */
export function seedLines(rows: readonly NewLine[]): TruckLine[] {
  return rows.reduce<TruckLine[]>((lines, { id, kind, text, trigger, weight, sponsor }) => {
    return addLine(lines, { id, kind, text, trigger, weight, ...(sponsor === undefined ? {} : { sponsor }) });
  }, []);
}

/** Craig approves a line, and it goes live. */
export function approveLine(lines: readonly TruckLine[], id: string): TruckLine[] {
  if (!lines.some((line) => line.id === id)) throw new LineError({ rule: "noLine", id });
  return lines.map((line) => (line.id === id ? { ...line, approved: true } : line));
}
