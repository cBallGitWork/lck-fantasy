// BRION v DRX, LCK Cup, 15 Jan 2025: the three games' Leaguepedia "V5 data:" pages, saved
// 17 Nov 2026, the same series as `oe.ts`. In game 2 Sponge stole one objective; in game 3 Ucal
// had two solo kills; every other count is 0.
import game1 from "./v5-LOLTMNT03-183532.json";
import game2 from "./v5-LOLTMNT03-183538.json";
import game3 from "./v5-LOLTMNT03-183544.json";

/** Each game's page, by Oracle's Elixir game id. */
export const LEAGUEPEDIA_PAGES: Readonly<Record<string, unknown>> = {
  LOLTMNT03_183532: game1,
  LOLTMNT03_183538: game2,
  LOLTMNT03_183544: game3,
};

/** A game's saved page, copied so a test can change it. */
export function leaguepediaPage(gameId: string) {
  const page = LEAGUEPEDIA_PAGES[gameId];
  if (page === undefined) throw new Error(`No saved Leaguepedia page for ${gameId}.`);
  return structuredClone(page) as { participants: Record<string, unknown>[] };
}
