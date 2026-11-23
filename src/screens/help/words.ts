// Help's labels and the words of its tables (spec/12, Help). The guide's pages are in guide.ts and
// the rules in rules.ts; every number comes from facts.ts or the competition's data, so a tuned
// value changes the text with it.
import type { PlayerRole } from "../../../convex/squads/squad";
import { BUFF_DOES, CAPTAIN_MULTIPLIER, TEAM_CAP, type BuffName } from "../../fixtures/competition";
import { NONE } from "../../parts";
import { ROLE_NAME, type RoleKey } from "../../rift";
import type { CoachRow, PlayerRow, RoleGroup } from "./facts";

export const HANGUL = "도움말";

export const TABS = ["Help", "Rules"] as const;
export type HelpTab = (typeof TABS)[number];

/** A piece of an item's text. A table, or notes that read the series rules, are drawn from the game's data. */
export type Block =
  | { p: string }
  | { list: readonly string[]; captainMark?: true; check?: true }
  | { ex: string }
  | { facts: readonly (readonly [string, string, string?])[] }
  | { table: "players" | "coach" | "buffs" | "tiers" | "deadlines" | "glossary" }
  | { notes: "players" | "coach" }
  | { link: "fullScoring" | "priceChanges" };

/** A guide page or a rule: its id (`/help#prices`), its title and its text. */
export interface Item {
  id: string;
  title: string;
  blocks: readonly Block[];
  /** The Help menu's step number. */
  step?: number;
}

/** The words a multiplier is said in; any other is written `×4`. */
const TIMES: Record<number, string> = { 1.5: "one and a half times", 2: "double", 3: "three times" };
const times = (m: number) => TIMES[m] ?? `×${m}`;
export const CAPTAIN_TIMES = times(CAPTAIN_MULTIPLIER);
/** The Captain's example score, as both the guide and Rules work it. */
export const CAPTAIN_EXAMPLE = 9;
/** The playoffs' cap: one more per team (spec/03, Knockouts). */
export const KNOCKOUT_TEAM_CAP = TEAM_CAP + 1;
export const DEADLINE_RULE = "The deadline is 15 minutes before the week's first series.";

/** `A, B or C`. */
export const orList = (names: readonly string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} or ${names.at(-1)}` : (names[0] ?? ""));

export const MENU_TITLE = "Help menu";
export const RULES_MENU_TITLE = "Rules";
export const LINKS = { fullScoring: "Full scoring table", priceChanges: "Price changes" } as const;

/** Scoring's notes, which read the series rules. */
export const NOTES = {
  players: (bestGames: number) => [
    `Players score in every game of a series, and their best ${bestGames} games count. In a series of ${bestGames} games every one counts; in a longer one the weaker ones are dropped.`,
    "Nobody gets points just for playing or for their team winning.",
  ],
  coach: (bestGames: number) => [
    `As with players, the coach's best ${bestGames} games count, then the series win or loss is added. A coach can end a series below zero.`,
    "Dragons, barons and elder dragons are big monsters the two teams fight over. If both teams kill the same number, neither gets that point.",
  ],
};

const PLAYER_ROLE_KEY: Record<PlayerRole, RoleKey> = { top: "top", jungle: "jng", mid: "mid", bot: "bot", support: "sup" };
const rolesOr = (roles: readonly PlayerRole[]) => orList(roles.map((r) => ROLE_NAME[PLAYER_ROLE_KEY[r]]));

/** `Every 3 kills, or every 2 for a Top or Support`: a value most roles share is said for everyone else. */
function perRole(noun: string, groups: readonly RoleGroup[]): string {
  const roleCount = groups.reduce((n, g) => n + g.roles.length, 0);
  const [most, ...rest] = groups;
  if (!most) return "";
  const head = rest.length === 0 || most.roles.length * 2 > roleCount ? `Every ${most.per} ${noun}` : `Every ${most.per} ${noun} for a ${rolesOr(most.roles)}`;
  return [head, ...rest.map((g) => `every ${g.per} for a ${rolesOr(g.roles)}`)].join(", or ");
}

const MULTIKILL: Record<number, string> = {
  2: "A double kill (two kills close together)",
  3: "A triple kill (three kills close together)",
  4: "A quadra kill (four kills close together)",
  5: "A penta kill (five). Only the biggest multikill in a game scores",
};

/** A line of the players' table in words. */
export function playerLine(row: PlayerRow): string {
  switch (row.line) {
    case "kills":
      return perRole("kills", row.groups);
    case "deaths":
      return perRole("deaths", row.groups);
    case "assists":
      return `Every ${row.per} assists (helping a teammate get a kill)`;
    case "goldLeadAt15":
      return `More gold at ${row.atMinutes} minutes than the player in his position on the other team`;
    case "multikill":
      return MULTIKILL[row.size] ?? `A multikill of ${row.size}`;
    case "soloKill":
      return "Each kill with no help from a teammate";
    case "firstBlood":
      return "First blood (the game's first kill)";
    case "deathless":
      return "Not dying all game";
    case "steal":
      return "Each monster stolen from the other team";
  }
}

const COACH_LINE: Record<Exclude<CoachRow["line"], "quickWin">, string> = {
  firstTower: "Takes the first tower",
  mostDrakes: "Kills more dragons than the other team",
  mostBarons: "Kills more barons than the other team",
  mostElders: "Kills more elder dragons than the other team",
  seriesWin: "Wins",
  seriesLoss: "Loses",
};

/** A line of the coach's table in words; the quick win's minutes are the table's. */
export const coachLine = (line: CoachRow["line"], quickWinMinutes: number) => (line === "quickWin" ? `Wins in under ${quickWinMinutes} minutes` : COACH_LINE[line]);

export const PLAYER_HEADS = { what: "In a game", points: "Points", cap: "Cap per game" };
export const COACH_HEADS = { game: "In a game, the team", series: "In the series, the team", points: "Points" };
export const BUFF_HEADS = { buff: "Buff", does: "What it does", like: "Like" };
export const TIER_HEAD = "Top % of everyone";
export const DEADLINE_HEADS = { week: "Week", deadline: "Deadline" };

/** What each buff is like elsewhere (spec/06). */
export const BUFF_LIKE: Record<BuffName, string> = {
  "Bench Boost": "FPL's Bench Boost",
  "Double Captain": NONE,
  "Coach Diff": "FPL's Triple Captain, on the coach",
};

/** Each buff's one line, as its Pick Team card says it. */
export const buffDoes = (buff: BuffName) => BUFF_DOES[buff];

export const weekName = (week: number) => `Week ${week}`;
