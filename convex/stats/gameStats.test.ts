import { describe, expect, test } from "vitest";
import { leaguepediaGameKey, v5Extras } from "../feeds/leaguepedia";
import { BRION, DRX, gameOnePlayer, OE_FIXTURE_GAMES, OE_GAME_1, OE_SERIES_GAMES, playerIn } from "../feeds/fixtures/oe";
import { LEAGUEPEDIA_PAGES, leaguepediaPage } from "../feeds/fixtures/leaguepedia";
import { OE_2025_BRION_DRX } from "../scoring/fixtures";
import { HOUR_MS, SPEC_FINAL_AFTER_MS } from "../world/fixtures";
import { groupSeries, seriesState } from "../world/series";
import { playerGameStats, seriesSettledStats, teamGameStats } from "./gameStats";

const game1 = OE_GAME_1;
const player = gameOnePlayer;

describe("playerGameStats", () => {
  test("loaded stats match the scoring's hand-copied fixture for the same game", () => {
    const extras = v5Extras(leaguepediaPage(game1.gameId));
    expect(playerGameStats(player("Morgan"), extras)).toEqual(OE_2025_BRION_DRX.morgan);
    expect(playerGameStats(player("Clozer"), extras)).toEqual(OE_2025_BRION_DRX.clozer);
    expect(playerGameStats(player("Hype"), extras)).toEqual(OE_2025_BRION_DRX.hype);
    expect(playerGameStats(player("Pollu"), extras)).toEqual(OE_2025_BRION_DRX.pollu);
    expect(playerGameStats(player("Sponge"), extras)).toEqual(OE_2025_BRION_DRX.sponge);
  });

  test("solo kills and steals join by participant id, whichever side a team is on", () => {
    const [, game2, game3] = OE_FIXTURE_GAMES;
    expect(playerGameStats(playerIn(game2!, "Sponge"), v5Extras(leaguepediaPage(game2!.gameId)))).toMatchObject({ soloKills: 0, steals: 1 });
    expect(playerGameStats(playerIn(game3!, "Ucal"), v5Extras(leaguepediaPage(game3!.gameId)))).toMatchObject({ soloKills: 2, steals: 0 });
  });

  test("a player with no match data throws", () => {
    expect(() => playerGameStats(player("Clozer"), new Map())).toThrow("No match data for participant 3 (Clozer).");
  });
});

describe("seriesSettledStats", () => {
  const [series] = groupSeries(OE_SERIES_GAMES).series;
  const { endedAt, games } = series!;
  const pages = (gameIds: readonly string[]) => new Map(gameIds.map((id) => [leaguepediaGameKey(id), LEAGUEPEDIA_PAGES[id]]));
  const allIds = games.map((g) => g.gameId);
  const stateAt = (now: number, stats: ReturnType<typeof seriesSettledStats>) => seriesState(endedAt, stats.settled, now, SPEC_FINAL_AFTER_MS);

  test("with every game's settled stats, the series turns final at 3 hours, matching the scoring's fixture", () => {
    const stats = seriesSettledStats(games, pages(allIds));
    expect(stats.settled).toBe(true);
    if (!stats.settled) return;
    expect(stats.games.map((g) => g.gameId)).toEqual(allIds);
    const clozer = stats.games[0]!.players.find((p) => p.playerId === player("Clozer").playerId);
    expect(clozer?.stats).toEqual(OE_2025_BRION_DRX.clozer);
    expect(stats.games[0]!.teams.find((t) => t.teamId === BRION)?.stats).toEqual(OE_2025_BRION_DRX.brion);
    expect(stateAt(endedAt + SPEC_FINAL_AFTER_MS - 1, stats)).toBe("provisional");
    expect(stateAt(endedAt + SPEC_FINAL_AFTER_MS, stats)).toBe("final");
  });

  test("a game with no Leaguepedia page keeps it provisional, and it turns final when the page lands", () => {
    const before = seriesSettledStats(games, pages(allIds.slice(0, 2)));
    expect(before).toEqual({ settled: false, waiting: [`${allIds[2]}: no Leaguepedia page "${leaguepediaGameKey(allIds[2]!)}"`] });
    expect(stateAt(endedAt + 10 * HOUR_MS, before)).toBe("provisional");
    expect(stateAt(endedAt + 10 * HOUR_MS, seriesSettledStats(games, pages(allIds)))).toBe("final");
  });

  test("an admin's pasted key finds a page the game's own id doesn't", () => {
    const matchData = pages(allIds.slice(0, 2)).set("ESPORTSTMNT01 3400", LEAGUEPEDIA_PAGES[allIds[2]!]);
    expect(seriesSettledStats(games, matchData).settled).toBe(false);
    expect(seriesSettledStats(games, matchData, new Map([[allIds[2]!, "ESPORTSTMNT01 3400"]])).settled).toBe(true);
  });

  test("a game Oracle's Elixir marks partial keeps the series provisional", () => {
    const partial = games.map((g, i) => (i === 1 ? { ...g, complete: false } : g));
    expect(seriesSettledStats(partial, pages(allIds))).toEqual({
      settled: false,
      waiting: [`${allIds[1]}: Oracle's Elixir marks it partial`],
    });
  });
});

describe("teamGameStats", () => {
  test("the coach's lines for each side, with the opponent's objectives", () => {
    expect(teamGameStats(game1, BRION)).toEqual(OE_2025_BRION_DRX.brion);
    expect(teamGameStats(game1, DRX)).toEqual({
      won: false, lengthSeconds: 1742, firstTower: false, drakes: 0, barons: 0, elders: 0,
      opponent: { drakes: 4, barons: 1, elders: 0 },
    });
  });

  test("a team that didn't play throws", () => {
    expect(() => teamGameStats(game1, "oe:team:none")).toThrow("Team oe:team:none didn't play game LOLTMNT03_183532.");
  });
});
