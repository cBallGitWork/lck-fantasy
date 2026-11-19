// Help's numbers, each read from the data the game itself runs on: the season's settings, the
// scoring tables (spec/05), the buffs (spec/06) and the tier cut-offs (spec/08). Help writes them,
// never its own copy of them.
import season from "../../../data/lck/season-2027.json";
import type { CoachLine, CoachTable, PlayerLine, PlayerTable } from "../../../convex/scoring/game";
import type { SeriesRules } from "../../../convex/scoring/series";
import type { TierCutoff, TierName } from "../../../convex/leagues/tiers";
import { PLAYER_ROLES, type PlayerRole } from "../../../convex/squads/squad";
import { formatWon, sum, timeIn } from "../../parts";

const settings = season.settings;

export const STARTERS = sum(Object.values(settings.squad.starterSlots));
export const BENCH = settings.squad.benchSize;
export const SQUAD_SIZE = STARTERS + BENCH;
/** The players who can be Captain: every starter but the coach (spec/04). */
export const CAPTAIN_CHOICES = STARTERS - settings.squad.starterSlots.coach;
export const BUDGET = formatWon(settings.budget);
export const FREE_PER_WEEK = settings.transfers.freePerGameweek;
export const BANK_CAP = settings.transfers.bankCap;
export const FREE_AFTER_UNLIMITED = settings.transfers.freeAfterUnlimited;

/** The data Help's tables read: the scoring, and the competition's tier cut-offs and deadlines. */
export interface HelpData {
  player: PlayerTable;
  coach: CoachTable;
  series: SeriesRules;
  tiers: readonly TierCutoff[];
  /** The split's weeks and their deadlines, as instants. */
  deadlines: readonly { week: number; deadline: string }[];
  /** The manager's time zone, as the browser gives it. */
  zone: string;
}

/** A value and the roles that share it: kills' `3` for Jungle, Mid and Bot. */
export type RoleGroup = { per: number; roles: PlayerRole[] };

/** One line of the players' points table, as the table holds it; words.ts says it. */
export type PlayerRow =
  | { line: "kills" | "deaths"; points: number; cap: number; groups: RoleGroup[] }
  | { line: "assists"; points: number; cap: number; per: number }
  | { line: "goldLeadAt15"; points: number; atMinutes: number }
  | { line: "multikill"; points: number; size: number }
  | { line: Exclude<PlayerLine, "kills" | "deaths" | "assists" | "goldLeadAt15" | "multikill">; points: number };

/** The roles grouped by their value, the most-shared value first: kills' 3 (Jungle, Mid, Bot), then 2. */
function byValue(per: Record<PlayerRole, number>): RoleGroup[] {
  const groups = new Map<number, PlayerRole[]>();
  for (const role of PLAYER_ROLES) groups.set(per[role], [...(groups.get(per[role]) ?? []), role]);
  return [...groups].map(([value, roles]) => ({ per: value, roles })).sort((a, b) => b.roles.length - a.roles.length);
}

/** Every line of the players' table that is on, in its own order; a multikill one row per size. */
export function playerRows(table: PlayerTable): PlayerRow[] {
  return (Object.keys(table) as PlayerLine[]).flatMap((line): PlayerRow[] => {
    if (!table[line].on) return [];
    switch (line) {
      case "kills":
      case "deaths": {
        const sign = line === "deaths" ? -1 : 1;
        return [{ line, points: sign, cap: sign * table[line].max, groups: byValue(table[line].per) }];
      }
      case "assists":
        return [{ line, points: 1, cap: table.assists.max, per: table.assists.per }];
      case "goldLeadAt15":
        return [{ line, points: table.goldLeadAt15.points, atMinutes: table.goldLeadAt15.atMinutes }];
      case "multikill":
        return Object.entries(table.multikill.points)
          .map(([size, points]) => ({ line, points, size: Number(size) }))
          .sort((a, b) => a.size - b.size);
      default:
        return [{ line, points: table[line].points }];
    }
  });
}

/** One line of the coach's table: a game's line, or the series won or lost. */
export type CoachRow = { line: CoachLine | "seriesWin" | "seriesLoss"; points: number };

/** The coach's game lines that are on, then the series' win and loss. */
export function coachRows(table: CoachTable, series: SeriesRules): { game: CoachRow[]; series: CoachRow[] } {
  return {
    game: (Object.keys(table) as CoachLine[]).filter((line) => table[line].on).map((line) => ({ line, points: table[line].points })),
    series: [
      { line: "seriesWin", points: series.coachSeriesWin },
      { line: "seriesLoss", points: series.coachSeriesLoss },
    ],
  };
}

/** One tier's row: its cut-offs, best division first (I to IV), or one for a tier with none. */
export interface TierRow {
  tier: TierName;
  tops: number[];
}

/** The cut-offs as Ranks' table rows, best tier first. */
export function tierRows(cutoffs: readonly TierCutoff[]): TierRow[] {
  const rows: TierRow[] = [];
  for (const cutoff of cutoffs) {
    const row = rows.find((r) => r.tier === cutoff.tier);
    if (row) row.tops.push(cutoff.topPercent);
    else rows.push({ tier: cutoff.tier, tops: [cutoff.topPercent] });
  }
  return rows;
}

/** A deadline as the Time part shows it, the date in front: `Wed 30 Dec 07:45`. */
export function deadlineIn(instant: string, zone: string): { local: string } {
  const { local } = timeIn(instant, zone);
  const date = new Intl.DateTimeFormat("en-GB", { timeZone: zone, day: "numeric", month: "short" }).format(new Date(instant));
  const [day = "", time = ""] = local.split(" ");
  return { local: `${day} ${date} ${time}` };
}
