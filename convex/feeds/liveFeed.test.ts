import { describe, expect, test } from "vitest";
import { DHOKLA, GEN, KIIN, LIVE_WINDOWS, LYON } from "./fixtures/live";
import { biggestMultikill, feedStale, livePlayerStats, liveTeamStats, parseLiveWindow, readWindow, type LiveReading } from "./liveFeed";

const { start, beforeFirstBlood, firstBlood, at15, end } = LIVE_WINDOWS;
const fold = (...windows: (typeof start)[]) => windows.reduce<LiveReading | null>(readWindow, null)!;
const SECOND = 1000;

describe("readWindow", () => {
  test("the game clock starts at the first frame with gold", () => {
    expect(fold(start).startedAt).toBe(Date.parse("2026-10-25T20:59:40.091Z"));
  });

  test("first blood goes to the killer only: Kiin, at 21:09:01", () => {
    const before = fold(start, beforeFirstBlood);
    expect(before.players.some((p) => p.firstBloodKill)).toBe(false);
    const after = fold(start, beforeFirstBlood, firstBlood);
    expect(after.players.filter((p) => p.firstBloodKill).map((p) => p.participantId)).toEqual([KIIN]);
  });

  test("gold lead at 15 is against the same role, and matches Oracle's Elixir for the tops (+1457)", () => {
    const reading = fold(start, beforeFirstBlood, firstBlood, at15);
    expect(livePlayerStats(reading, KIIN).goldDiffAt15).toBe(1457);
    expect(livePlayerStats(reading, DHOKLA).goldDiffAt15).toBe(-1457);
    expect(livePlayerStats(fold(start, firstBlood), KIIN).goldDiffAt15).toBeNull();
  });

  test("the final window's kills, deaths and assists match Oracle's Elixir's for the game", () => {
    const reading = fold(start, beforeFirstBlood, firstBlood, at15, end);
    expect(reading.finished).toBe(true);
    expect(livePlayerStats(reading, KIIN)).toMatchObject({ role: "top", kills: 2, deaths: 1, assists: 1, firstBlood: true });
    expect(livePlayerStats(reading, DHOKLA)).toMatchObject({ role: "top", kills: 2, deaths: 3, assists: 2, firstBlood: false });
  });

  test("solo kills and steals stay 0 live: they come with the final stats", () => {
    const reading = fold(start, firstBlood, end);
    expect(livePlayerStats(reading, KIIN)).toMatchObject({ soloKills: 0, steals: 0 });
  });

  test("the coach's live lines: towers, drakes and elders kept apart, barons", () => {
    const reading = fold(start, at15, end);
    expect(liveTeamStats(reading, LYON)).toMatchObject({ won: false, drakes: 3, barons: 2, elders: 0, opponent: { drakes: 2, barons: 0, elders: 0 } });
    expect(liveTeamStats(reading, GEN).drakes).toBe(2);
  });

  test("kills seen after a skipped stretch can't make a multikill", () => {
    const reading = fold(start, end);
    expect(reading.players.every((p) => livePlayerStats(reading, p.participantId).biggestMultikill === 0)).toBe(true);
  });

  test("a window already read changes nothing", () => {
    const once = fold(start, firstBlood);
    expect(readWindow(once, firstBlood)).toEqual(once);
  });
});

describe("biggestMultikill", () => {
  test("kills within 10 s of each other make a multikill; a penta may take 30 s after the quadra", () => {
    expect(biggestMultikill([0, 8 * SECOND])).toBe(2);
    expect(biggestMultikill([0, 11 * SECOND])).toBe(0);
    expect(biggestMultikill([0, 5, 10, 15].map((s) => s * SECOND))).toBe(4);
    expect(biggestMultikill([0, 5, 10, 15, 40].map((s) => s * SECOND))).toBe(5);
  });

  test("a kill with no known time breaks a run", () => {
    expect(biggestMultikill([0, null, 1000])).toBe(0);
  });
});

describe("the feed going down", () => {
  test("a changed shape throws, for an admin alert rather than a silent gap", () => {
    expect(() => parseLiveWindow({ frames: [] })).toThrow("Live feed window has an unexpected shape.");
  });

  test("no frame for longer than the limit, mid-game, is stale; a finished game never is", () => {
    const live = fold(start, firstBlood);
    expect(feedStale(live, live.lastFrameAt + 60 * SECOND, 30 * SECOND)).toBe(true);
    expect(feedStale(live, live.lastFrameAt + 10 * SECOND, 30 * SECOND)).toBe(false);
    const done = fold(start, end);
    expect(feedStale(done, done.lastFrameAt + 3600 * SECOND, 30 * SECOND)).toBe(false);
  });
});
