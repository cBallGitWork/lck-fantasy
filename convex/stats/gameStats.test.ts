import { describe, expect, test } from "vitest";
import { v5Extras } from "../feeds/leaguepedia";
import { BRION, DRX, gameOnePlayer, OE_GAME_1 } from "../feeds/fixtures/oe";
import { v5Game } from "../feeds/fixtures/v5-shape";
import { OE_2025_BRION_DRX } from "../scoring/fixtures";
import { playerGameStats, teamGameStats } from "./gameStats";

const game1 = OE_GAME_1;
const player = gameOnePlayer;

describe("playerGameStats", () => {
  test("loaded stats match the scoring's hand-copied fixture for the same game", () => {
    const none = v5Extras(v5Game());
    expect(playerGameStats(player("Clozer"), none)).toEqual(OE_2025_BRION_DRX.clozer);
    expect(playerGameStats(player("Sponge"), none)).toEqual(OE_2025_BRION_DRX.sponge);
  });

  test("solo kills and steals join by participant id", () => {
    const extras = v5Extras(v5Game({ 3: { soloKills: 2 }, 7: { objectivesStolen: 1 } }));
    expect(playerGameStats(player("Clozer"), extras)).toMatchObject({ soloKills: 2, steals: 0 });
    expect(playerGameStats(player("Sponge"), extras)).toMatchObject({ soloKills: 0, steals: 1 });
  });

  test("a player with no match data throws", () => {
    expect(() => playerGameStats(player("Clozer"), new Map())).toThrow("No match data for participant 3 (Clozer).");
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
