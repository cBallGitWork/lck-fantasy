import { describe, expect, test } from "vitest";
import { OE_2025_BRION_DRX, playerGame, SPEC_COACH_TABLE, SPEC_PLAYER_TABLE } from "./fixtures";
import { scoreCoachGame, scorePlayerGame, total } from "./game";

const score = (stats: Parameters<typeof scorePlayerGame>[0]) => scorePlayerGame(stats, SPEC_PLAYER_TABLE);

describe("the player table", () => {
  test("spec/05's example: a mid on 7/2/11 with a gold lead scores 5", () => {
    const lines = score(playerGame({ role: "mid", kills: 7, deaths: 2, assists: 11, goldDiffAt15: 300 }));
    expect(lines).toMatchObject({ kills: 2, assists: 2, deaths: 0, goldLeadAt15: 1 });
    expect(total(lines)).toBe(5);
  });

  test("kills score by role: per 2 for tops and supports, per 3 for the rest, at most 3", () => {
    expect(score(playerGame({ role: "top", kills: 5 })).kills).toBe(2);
    expect(score(playerGame({ role: "support", kills: 5 })).kills).toBe(2);
    expect(score(playerGame({ role: "jungle", kills: 5 })).kills).toBe(1);
    expect(score(playerGame({ role: "bot", kills: 14 })).kills).toBe(3);
  });

  test("assists score 1 per 5, at most 3", () => {
    expect(score(playerGame({ role: "mid", assists: 9 })).assists).toBe(1);
    expect(score(playerGame({ role: "support", assists: 22 })).assists).toBe(3);
  });

  test("deaths cost 1 per 3, per 4 for supports, at most 3", () => {
    expect(score(playerGame({ role: "mid", deaths: 5 })).deaths).toBe(-1);
    expect(score(playerGame({ role: "support", deaths: 7 })).deaths).toBe(-1);
    expect(score(playerGame({ role: "top", deaths: 12 })).deaths).toBe(-3);
  });

  test("a gold lead at 15 scores 1; level or behind, or no reading, scores 0", () => {
    expect(score(playerGame({ role: "mid", deaths: 1, goldDiffAt15: 1 })).goldLeadAt15).toBe(1);
    expect(score(playerGame({ role: "mid", deaths: 1, goldDiffAt15: 0 })).goldLeadAt15).toBe(0);
    expect(score(playerGame({ role: "mid", deaths: 1, goldDiffAt15: null })).goldLeadAt15).toBe(0);
  });

  test("solo kills and steals score 1 each; first blood and a deathless game 1", () => {
    const lines = score(playerGame({ role: "jungle", deaths: 0, soloKills: 2, steals: 1, firstBlood: true }));
    expect(lines).toMatchObject({ soloKill: 2, steal: 1, firstBlood: 1, deathless: 1 });
  });

  test("only the biggest multikill scores: a quadra 1, a penta 2, a triple 0", () => {
    expect(score(playerGame({ role: "bot", deaths: 1, biggestMultikill: 3 })).multikill).toBe(0);
    expect(score(playerGame({ role: "bot", deaths: 1, biggestMultikill: 4 })).multikill).toBe(1);
    expect(score(playerGame({ role: "bot", deaths: 1, biggestMultikill: 5 })).multikill).toBe(2);
  });

  test("a 2025 game from Oracle's Elixir scores by the table", () => {
    const game = OE_2025_BRION_DRX;
    expect(total(score(game.morgan))).toBe(5); // 2 kills, 1 assists, gold, deathless
    expect(total(score(game.clozer))).toBe(4); // 1, 1, gold, deathless
    expect(total(score(game.hype))).toBe(5); // 2, 1, gold, deathless
    expect(total(score(game.pollu))).toBe(4); // 0, 3 (capped), 0 deaths (1 of 4), gold
    expect(total(score(game.sponge))).toBe(-1); // 5 deaths, behind at 15
  });
});

describe("the coach", () => {
  test("a 2025 game: first tower, most drakes and most barons; elders level at 0, no quick win", () => {
    const lines = scoreCoachGame(OE_2025_BRION_DRX.brion, SPEC_COACH_TABLE);
    expect(lines).toEqual({ firstTower: 1, mostDrakes: 1, mostBarons: 1, mostElders: 0, quickWin: 0 });
  });

  test("a tie on 'most' scores nobody", () => {
    const level = { ...OE_2025_BRION_DRX.brion, drakes: 2, opponent: { drakes: 2, barons: 1, elders: 0 } };
    expect(scoreCoachGame(level, SPEC_COACH_TABLE)).toMatchObject({ mostDrakes: 0, mostBarons: 0 });
  });

  test("a win under 25 minutes is quick; a loss never is", () => {
    const quick = { ...OE_2025_BRION_DRX.brion, lengthSeconds: 24 * 60 + 59 };
    expect(scoreCoachGame(quick, SPEC_COACH_TABLE).quickWin).toBe(1);
    expect(scoreCoachGame({ ...quick, lengthSeconds: 25 * 60 }, SPEC_COACH_TABLE).quickWin).toBe(0);
    expect(scoreCoachGame({ ...quick, won: false }, SPEC_COACH_TABLE).quickWin).toBe(0);
  });
});

describe("the table is data", () => {
  test("a line's value changes without code, and a re-score of the same stats gives the new points", () => {
    const stats = OE_2025_BRION_DRX.clozer;
    const before = total(scorePlayerGame(stats, SPEC_PLAYER_TABLE));
    const richerGold = { ...SPEC_PLAYER_TABLE, goldLeadAt15: { on: true, points: 3 } };
    expect(total(scorePlayerGame(stats, richerGold))).toBe(before + 2);
  });

  test("a line turned off scores 0", () => {
    const noDeathless = { ...SPEC_PLAYER_TABLE, deathless: { on: false, points: 1 } };
    expect(scorePlayerGame(OE_2025_BRION_DRX.clozer, noDeathless).deathless).toBe(0);
    const noDeaths = { ...SPEC_PLAYER_TABLE, deaths: { ...SPEC_PLAYER_TABLE.deaths, on: false } };
    expect(scorePlayerGame(OE_2025_BRION_DRX.sponge, noDeaths).deaths).toBe(0);
  });
});
