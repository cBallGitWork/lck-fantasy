// BRION v DRX, LCK Cup, 15 Jan 2025: the three games' 36 rows cut from Oracle's Elixir's 2025 file.
import fileText from "./oe-2025-brion-drx.csv?raw";
import { oeGames, oeSeriesGame, parseOeCsv } from "../oraclesElixir";

export const OE_FIXTURE_TEXT = fileText;
export const OE_FIXTURE_ROWS = parseOeCsv(fileText);
/** The league the fixture's rows are filed under. */
export const OE_FIXTURE_LEAGUE = "LCK";
export const OE_FIXTURE_GAMES = oeGames(OE_FIXTURE_ROWS, OE_FIXTURE_LEAGUE);
/** The fixture's games as series grouping reads them. */
export const OE_SERIES_GAMES = OE_FIXTURE_GAMES.map(oeSeriesGame);
export const BRION = "oe:team:b77b3f6068e20a2b3edc0ecd3dc70d4";
export const DRX = "oe:team:101f8589e58c724c1dcd5a9c1555277";
export const OE_GAME_1 = OE_FIXTURE_GAMES[0]!;

/** A player's row in game 1, by handle. */
export function gameOnePlayer(name: string) {
  const found = OE_GAME_1.players.find((p) => p.playerName === name);
  if (found === undefined) throw new Error(`No ${name} in the fixture's game 1.`);
  return found;
}
