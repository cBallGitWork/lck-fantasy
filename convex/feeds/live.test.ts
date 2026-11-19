import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { api, internal } from "../_generated/api";
import schema from "../schema";
import { modules } from "../test.setup";
import { LCK_2027 } from "../world/season";
import { GEN, KIIN, LIVE_WINDOWS, LYON } from "./fixtures/live";
import type { LiveWindow } from "./liveFeed";

const { start, beforeFirstBlood, firstBlood, at15, end } = LIVE_WINDOWS;
const GAME = start.esportsGameId;
const LIVE = LCK_2027.settings.live;
const MINUTE = 60_000;
/** 25 Oct 2026, 21:00 UTC: 06:00 on the 26th in KST, so the whole test is one match day. */
const T0 = Date.UTC(2026, 9, 25, 21, 0);
/** Reads start a second after the game is watched: convex-test moves a frozen clock on a
 *  millisecond for each write, so reads exactly at T0 would land a little late. */
const at = (minutes: number) => T0 + 1000 + minutes * MINUTE;
const FEED_404 = "the feed answered 404";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(T0);
  // Tests never reach the network: a booked read or email that ran would fail here.
  vi.stubGlobal("fetch", () => Promise.reject(new Error("No network in tests.")));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function watched(...games: string[]) {
  const t = convexTest(schema, modules);
  await t.mutation(internal.world.season.loadSeason, {});
  for (const esportsGameId of games) await t.mutation(internal.feeds.live.watchLiveGame, { competition: "LCK", year: 2027, esportsGameId });
  return t;
}

type Test = Awaited<ReturnType<typeof watched>>;

/** One read of the feed, `minutes` into the reads: a window, or a failure. */
async function read(t: Test, minutes: number, got: LiveWindow | { error: string }, esportsGameId = GAME) {
  vi.setSystemTime(at(minutes));
  const sent = "error" in got ? { window: null, error: got.error } : { window: got };
  await t.mutation(internal.feeds.live.storeLiveRead, { esportsGameId, ...sent });
}

/** The functions booked so far, by name, that haven't run. */
async function booked(t: Test, name: string) {
  const jobs = await t.run((ctx) => ctx.db.system.query("_scheduled_functions").collect());
  return jobs.filter((job) => job.name.includes(name) && job.state.kind === "pending");
}

const liveGame = (t: Test) => t.query(api.stats.live.liveGame, { esportsGameId: GAME });
const alerts = (t: Test) => t.query(internal.admin.alerts.alerts, {});

describe("reading a live game", () => {
  test("pasting a game id starts reading its feed at once", async () => {
    const t = await watched(GAME);
    expect(await booked(t, "readLiveGame")).toHaveLength(1);
    expect(await liveGame(t)).toBeNull();
  });

  test("saved windows of a finished game give the live lines: first blood, gold lead at 15, objectives", async () => {
    const t = await watched(GAME);
    for (const [i, window] of [start, beforeFirstBlood, firstBlood, at15, end].entries()) await read(t, i, window);
    const game = (await liveGame(t))!;
    expect(game.state).toBe("finished");
    const kiinId = start.gameMetadata.redTeamMetadata.participantMetadata.find((p) => p.participantId === KIIN)!.esportsPlayerId;
    const kiin = game.players.find((p) => p.esportsPlayerId === kiinId)!;
    expect(kiin.stats.firstBlood).toBe(true);
    expect(kiin.stats.goldDiffAt15).toBe(1457);
    expect(game.players.filter((p) => p.stats.firstBlood)).toHaveLength(1);
    const lyon = game.teams.find((team) => team.teamId === LYON)!.stats;
    expect(lyon).toMatchObject({ won: false, drakes: 3, barons: 2, elders: 0, opponent: { drakes: 2, barons: 0, elders: 0 } });
    expect(game.teams.find((team) => team.teamId === GEN)!.stats.drakes).toBe(2);
    expect(await alerts(t)).toEqual([]);
  });

  test("each new reading books the next read at the season's pace; a finished game books none", async () => {
    const t = await watched(GAME);
    await read(t, 0, start);
    const next = await booked(t, "readLiveGame");
    expect(next.map((job) => job.scheduledTime)).toContain(at(0) + LIVE.pollSeconds * 1000);
    await read(t, 1, end);
    expect((await booked(t, "readLiveGame")).filter((job) => job.scheduledTime > at(0) + LIVE.pollSeconds * 1000)).toEqual([]);
  });
});

describe("the feed going down", () => {
  test("a feed that never answers gives no live points, and after 3 minutes an admin alert and one email", async () => {
    const t = await watched(GAME);
    await read(t, 1, { error: FEED_404 });
    await read(t, 2, { error: FEED_404 });
    expect(await alerts(t)).toEqual([]);
    await read(t, 3, { error: FEED_404 });
    expect(await liveGame(t)).toBeNull();
    const [alert] = await alerts(t);
    expect(alert?.message).toContain(`Live game ${GAME}: the feed is down, no new reading for 3 minutes (${FEED_404})`);
    expect(await booked(t, "emailAdmin")).toHaveLength(1);
  });

  test("a feed that dies mid-game keeps the points shown at the last reading, and stops reading", async () => {
    const t = await watched(GAME);
    await read(t, 0, start);
    await read(t, 1, firstBlood);
    const before = await liveGame(t);
    for (const minute of [2, 3, 4]) await read(t, minute, { error: FEED_404 });
    const after = (await liveGame(t))!;
    expect(after.state).toBe("down");
    expect(after.players).toEqual(before!.players);
    const reads = (await booked(t, "readLiveGame")).filter((job) => job.scheduledTime > at(4));
    expect(reads).toEqual([]);
  });

  test("the same window again is no new reading", async () => {
    const t = await watched(GAME);
    await read(t, 0, start);
    for (const minute of [1, 2]) await read(t, minute, start);
    expect(await alerts(t)).toEqual([]);
    await read(t, 3, start);
    expect((await liveGame(t))!.state).toBe("down");
  });

  test("a window of the wrong shape is no reading, and the alert says why", async () => {
    const t = await watched(GAME);
    for (const minute of [1, 2, 3]) {
      vi.setSystemTime(at(minute));
      await t.mutation(internal.feeds.live.storeLiveRead, { esportsGameId: GAME, window: { frames: [] } });
    }
    expect((await alerts(t))[0]?.message).toContain("Live feed window has an unexpected shape.");
  });

  test("only the first alert of a match day emails; the next day's first emails again", async () => {
    const OTHER = "other-game";
    const t = await watched(GAME, OTHER);
    for (const game of [GAME, OTHER]) await read(t, 3, { error: FEED_404 }, game);
    expect(await alerts(t)).toHaveLength(2);
    expect(await booked(t, "emailAdmin")).toHaveLength(1);
    await t.mutation(internal.feeds.live.watchLiveGame, { competition: "LCK", year: 2027, esportsGameId: GAME });
    await read(t, 24 * 60, { error: FEED_404 });
    await read(t, 24 * 60 + 3, { error: FEED_404 });
    expect(await booked(t, "emailAdmin")).toHaveLength(2);
  });
});

test("a player with no same-role opponent raises an admin alert naming the game and the player", async () => {
  const t = await watched(GAME);
  const window = structuredClone(start);
  const kiin = window.gameMetadata.redTeamMetadata.participantMetadata.find((p) => p.participantId === KIIN)!;
  kiin.role = "mid";
  await read(t, 0, window);
  const messages = (await alerts(t)).map((a) => a.message);
  expect(messages.some((m) => m.startsWith(`Live game ${GAME}:`) && m.includes("(top) has no top"))).toBe(true);
});
