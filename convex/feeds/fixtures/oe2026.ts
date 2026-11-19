// The LCK's 2026 as data/lck/2026 holds it (Oracle's Elixir's rows), for the sim's tests.
import fileText from "../../../data/lck/2026/oe-2026-lck.csv?raw";
import { oeGames, parseOeCsv } from "../oraclesElixir";

export const OE_2026_ROWS = parseOeCsv(fileText);
export const OE_2026_GAMES = oeGames(OE_2026_ROWS, "LCK");
