import { describe, expect, test } from "vitest";
import { playerGameStats, teamGameStats } from "../stats/gameStats";
import { LCK_2027 } from "../world/season";
import { OE_2026_GAMES } from "./fixtures/oe2026";
import { biggestMultikill, livePlayerStats, liveTeamStats, readWindow, type LiveReading } from "./liveFeed";
import { nextReplayWindow, replayWindow } from "./replay";
import type { OeGame } from "./oraclesElixir";

const GOLD_AT = LCK_2027.settings.live.goldLeadAtMinutes;
const READS = 12;

/** A game replayed read by read, as the sim's live reader takes it: the reading after each read. */
function replayed(game: OeGame): LiveReading[] {
  const whole = replayWindow(game, GOLD_AT);
  const readings: LiveReading[] = [];
  let reading: LiveReading | null = null;
  for (let read = 0; read < READS + 1; read++) {
    const window = nextReplayWindow(whole, reading?.lastFrameAt ?? 0, READS);
    if (window.frames.length === 0) break;
    reading = readWindow(reading, window, GOLD_AT);
    readings.push(reading);
  }
  return readings;
}

/** Oracle's Elixir's stats alone: the sim has no Leaguepedia pages yet, so solo kills and steals are 0
 *  (Craig, 19 Nov 2026). */
const settled = (game: OeGame, participantId: number) => {
  const player = game.players.find((p) => p.participantId === participantId)!;
  return playerGameStats(player, new Map([[participantId, { soloKills: 0, steals: 0 }]]));
};

describe("replayWindow", () => {
  test("every 2026 game's live stats end equal to its settled stats, on every line the feed carries", () => {
    for (const game of OE_2026_GAMES) {
      const final = replayed(game).at(-1)!;
      expect(final.finished, game.gameId).toBe(true);
      for (const p of game.players) expect(livePlayerStats(final, p.participantId), `${game.gameId} ${p.playerName}`).toEqual(settled(game, p.participantId));
      // The feed names no winner: the coach's win waits for the final stats (spec/11, Live).
      for (const t of game.teams) expect(liveTeamStats(final, t.teamId), `${game.gameId} ${t.teamName}`).toEqual({ ...teamGameStats(game, t.teamId), won: false });
    }
  });

  test("a game plays out over the reads, its points rising, never all at once", () => {
    const game = OE_2026_GAMES[0]!;
    const readings = replayed(game);
    expect(readings.length).toBeGreaterThan(READS / 2);
    expect(readings.length).toBeLessThanOrEqual(READS);
    const kills = readings.map((r) => r.players.reduce((total, p) => total + p.kills, 0));
    expect(kills[0]).toBeLessThan(kills.at(-1)!);
    expect([...kills].sort((a, b) => a - b)).toEqual(kills);
    expect(readings.slice(0, -1).every((r) => !r.finished)).toBe(true);
  });

  test("first blood goes to its killer and a multikill to its player, as the file has them", () => {
    const game = OE_2026_GAMES.find((g) => g.players.some((p) => p.biggestMultikill >= 3))!;
    const final = replayed(game).at(-1)!;
    const killer = game.players.find((p) => p.firstBloodKill)!;
    const multi = game.players.find((p) => p.biggestMultikill >= 3)!;
    expect(final.players.filter((p) => p.firstBloodKill).map((p) => p.participantId)).toEqual([killer.participantId]);
    expect(biggestMultikill(final.players.find((p) => p.participantId === multi.participantId)!.killTimes)).toBe(multi.biggestMultikill);
  });
});
