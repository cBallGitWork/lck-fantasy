import { describe, expect, test } from "vitest";
import { oeGames, oeSeriesGame, parseOeCsv } from "./oraclesElixir";
import { BRION, DRX, gameOnePlayer, OE_FIXTURE_GAMES, OE_FIXTURE_LEAGUE, OE_FIXTURE_ROWS, OE_FIXTURE_TEXT, OE_GAME_1 } from "./fixtures/oe";

const game1 = OE_GAME_1;
const player = gameOnePlayer;

describe("oeGames", () => {
  test("each game has its two teams, and who played, in which role, on which champion", () => {
    expect(OE_FIXTURE_GAMES.map((g) => [g.gameId, g.gameNumber])).toEqual([
      ["LOLTMNT03_183532", 1], ["LOLTMNT03_183538", 2], ["LOLTMNT03_183544", 3],
    ]);
    expect(game1.teams.map((t) => [t.teamName, t.side, t.won])).toEqual([["HANJIN BRION", "blue", true], ["DRX", "red", false]]);
    expect(game1.players).toHaveLength(10);
    expect(player("Clozer")).toMatchObject({ role: "mid", teamId: BRION, champion: expect.any(String) });
    expect(player("Sponge")).toMatchObject({ role: "jungle", teamId: DRX });
    expect(game1).toMatchObject({ startedAt: Date.UTC(2025, 0, 15, 8, 9, 30), lengthSeconds: 1742, complete: true });
  });

  test("every stat the scoring reads, as the file has it", () => {
    expect(player("Clozer")).toMatchObject({ kills: 4, deaths: 0, assists: 7, goldDiffAt15: 1247, biggestMultikill: 2 });
    expect(player("Pollu")).toMatchObject({ kills: 0, deaths: 1, assists: 15, goldDiffAt15: 113, biggestMultikill: 0 });
    expect(game1.teams[0]).toMatchObject({ firstTower: true, drakes: 4, barons: 1, elders: 0 });
  });

  test("first blood is the killer's only, not an assist's", () => {
    expect(player("LazyFeel").firstBloodKill).toBe(true);
    expect(player("Sponge").firstBloodKill).toBe(false);
  });

  test("the source's row is kept as it came", () => {
    expect(OE_FIXTURE_ROWS).toContain(player("Clozer").raw);
    expect(player("Clozer").raw.playername).toBe("Clozer");
  });

  test("only the asked league's games", () => {
    expect(oeGames(OE_FIXTURE_ROWS, "LPL")).toEqual([]);
  });

  test("a game missing a row, or a stat, throws rather than load part of it", () => {
    expect(() => oeGames(OE_FIXTURE_ROWS.slice(1), OE_FIXTURE_LEAGUE)).toThrow("Game LOLTMNT03_183532 has 2 team rows and 9 player rows.");
    const noKills = OE_FIXTURE_ROWS.map((row, i) => (i === 0 ? { ...row, kills: "" } : row));
    expect(() => oeGames(noKills, OE_FIXTURE_LEAGUE)).toThrow("No kills in game LOLTMNT03_183532.");
  });

  test("a partial game is marked, so it can't settle a series", () => {
    const partial = OE_FIXTURE_ROWS.map((row) => ({ ...row, datacompleteness: "partial" }));
    expect(oeGames(partial, OE_FIXTURE_LEAGUE)[0]!.complete).toBe(false);
  });

  test("a malformed file throws", () => {
    expect(() => parseOeCsv(`${OE_FIXTURE_TEXT.split("\n")[0]}\n"broken`)).toThrow("Oracle's Elixir file:");
  });

  test("a game's winner and teams, for grouping into series", () => {
    expect(oeSeriesGame(game1)).toMatchObject({ teamIds: [BRION, DRX], winnerId: BRION });
  });
});
