// Oracle's Elixir's daily file (spec/11, Final): its CSV rows into one record per game, each
// player's and team's stats as the source sent them, with the raw row kept (ARCHITECTURE.md, Data).
import Papa from "papaparse";
import type { SeriesGame } from "../lck/series";
import type { PlayerRole } from "../squads/squad";

export type OeRow = Record<string, string>;

/** Oracle's Elixir's position names for the roles. A source's spelling, not a rule. */
const OE_POSITIONS: Record<string, PlayerRole> = { top: "top", jng: "jungle", mid: "mid", bot: "bot", sup: "support" };
const OE_TEAM_POSITION = "team";
const PLAYERS_PER_GAME = 10;
/** The file's multikill columns, biggest first, with the size each counts. */
const MULTIKILL_COLUMNS: [string, number][] = [["pentakills", 5], ["quadrakills", 4], ["triplekills", 3], ["doublekills", 2]];

export interface OePlayerGame {
  participantId: number;
  playerName: string;
  playerId: string;
  teamId: string;
  /** The role played in this game (spec/05: kills and deaths go by it). */
  role: PlayerRole;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  goldDiffAt15: number | null;
  /** The first blood's killer; an assist on it is not counted (spec/05). */
  firstBloodKill: boolean;
  /** The biggest multikill: 0 for none, 2 a double, up to 5 a penta. */
  biggestMultikill: number;
  raw: OeRow;
}

export interface OeTeamGame {
  teamName: string;
  teamId: string;
  side: "blue" | "red";
  won: boolean;
  firstTower: boolean;
  /** Elemental drakes only: the elder is counted on its own. */
  drakes: number;
  barons: number;
  elders: number;
  raw: OeRow;
}

export interface OeGame {
  gameId: string;
  league: string;
  /** The game's start, in ms since the epoch (the file's dates are UTC). */
  startedAt: number;
  /** Its number in the series: 1 opens a series. */
  gameNumber: number;
  patch: string;
  lengthSeconds: number;
  /** The file marks a game "partial" when some stats are missing; such a game can't settle a series. */
  complete: boolean;
  teams: [OeTeamGame, OeTeamGame];
  players: OePlayerGame[];
}

/** The file's text as rows keyed by column name. Throws on a malformed file rather than drop rows. */
export function parseOeCsv(text: string): OeRow[] {
  const parsed = Papa.parse<OeRow>(text, { header: true, skipEmptyLines: true });
  if (parsed.errors.length > 0) {
    const first = parsed.errors[0]!;
    throw new Error(`Oracle's Elixir file: ${first.message} (row ${first.row ?? "?"}).`);
  }
  return parsed.data;
}

/** The games of one league (the file's `league`, such as "LCK"), in the file's order. */
export function oeGames(rows: readonly OeRow[], league: string): OeGame[] {
  const byGame = new Map<string, OeRow[]>();
  for (const row of rows) {
    if (row.league !== league) continue;
    const id = text(row, "gameid");
    byGame.set(id, [...(byGame.get(id) ?? []), row]);
  }
  return [...byGame.entries()].map(([gameId, gameRows]) => oeGame(gameId, gameRows));
}

/** A game with what grouping it into a series needs. */
export function oeSeriesGame(game: OeGame): OeGame & SeriesGame {
  const [blue, red] = game.teams;
  if (blue.won === red.won) throw new Error(`Game ${game.gameId} has no single winner.`);
  return { ...game, teamIds: [blue.teamId, red.teamId], winnerId: (blue.won ? blue : red).teamId };
}

/** One game from its rows, ten players' and two teams', as the file or a stored copy holds them. */
export function oeGame(gameId: string, rows: readonly OeRow[]): OeGame {
  const teamRows = rows.filter((row) => row.position === OE_TEAM_POSITION);
  const playerRows = rows.filter((row) => row.position !== OE_TEAM_POSITION);
  if (teamRows.length !== 2 || playerRows.length !== PLAYERS_PER_GAME) {
    throw new Error(`Game ${gameId} has ${teamRows.length} team rows and ${playerRows.length} player rows.`);
  }
  const first = rows[0]!;
  return {
    gameId,
    league: text(first, "league"),
    startedAt: utc(text(first, "date")),
    gameNumber: num(first, "game"),
    patch: text(first, "patch"),
    lengthSeconds: num(first, "gamelength"),
    complete: text(first, "datacompleteness") === "complete",
    teams: [toTeam(teamRows[0]!), toTeam(teamRows[1]!)],
    players: playerRows.map(toPlayer),
  };
}

function toTeam(row: OeRow): OeTeamGame {
  const side = text(row, "side").toLowerCase();
  if (side !== "blue" && side !== "red") throw new Error(`Unknown side "${side}" in game ${row.gameid}.`);
  return {
    teamName: text(row, "teamname"),
    teamId: text(row, "teamid"),
    side,
    won: flag(row, "result"),
    firstTower: flag(row, "firsttower"),
    drakes: num(row, "elementaldrakes"),
    barons: num(row, "barons"),
    elders: num(row, "elders"),
    raw: row,
  };
}

function toPlayer(row: OeRow): OePlayerGame {
  const role = OE_POSITIONS[text(row, "position")];
  if (role === undefined) throw new Error(`Unknown position "${row.position}" in game ${row.gameid}.`);
  return {
    participantId: num(row, "participantid"),
    playerName: text(row, "playername"),
    playerId: text(row, "playerid"),
    teamId: text(row, "teamid"),
    role,
    champion: text(row, "champion"),
    kills: num(row, "kills"),
    deaths: num(row, "deaths"),
    assists: num(row, "assists"),
    goldDiffAt15: row.golddiffat15 ? num(row, "golddiffat15") : null,
    firstBloodKill: flag(row, "firstbloodkill"),
    biggestMultikill: MULTIKILL_COLUMNS.find(([column]) => num(row, column) > 0)?.[1] ?? 0,
    raw: row,
  };
}

function text(row: OeRow, column: string): string {
  const value = row[column];
  if (value === undefined || value === "") throw new Error(`No ${column} in game ${row.gameid ?? "?"}.`);
  return value;
}

function num(row: OeRow, column: string): number {
  const value = Number(text(row, column));
  if (!Number.isFinite(value)) throw new Error(`${column} is not a number in game ${row.gameid}.`);
  return value;
}

function flag(row: OeRow, column: string): boolean {
  return num(row, column) === 1;
}

function utc(date: string): number {
  const ms = Date.parse(`${date.replace(" ", "T")}Z`);
  if (Number.isNaN(ms)) throw new Error(`Unreadable date "${date}".`);
  return ms;
}
