// The LCK's 2026 as data/lck/2026 holds it (Oracle's Elixir's rows), for the sim's tests. Kept out
// of convex/, so the 4 MB file never rides in a Convex module.
import fileText from "../../data/lck/2026/oe-2026-lck.csv?raw";
import { oeGames, parseOeCsv } from "../../convex/feeds/oraclesElixir";

export const OE_2026_ROWS = parseOeCsv(fileText);
export const OE_2026_GAMES = oeGames(OE_2026_ROWS, "LCK");
