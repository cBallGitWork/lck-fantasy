import { convexTest } from "convex-test";
import { afterEach, expect, test, vi } from "vitest";
import { internal } from "../_generated/api";
import { LIVE_WINDOWS } from "../feeds/fixtures/live";
import schema from "../schema";
import { modules } from "../test.setup";
import { EMAIL_SETTINGS } from "./email";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const EMAIL = { subject: "Flol admin alert", text: "Live game 1: the feed is down." };

test("an admin email goes to Resend with the deployment's key and addresses", async () => {
  vi.stubEnv(EMAIL_SETTINGS.key, "re_test");
  vi.stubEnv(EMAIL_SETTINGS.admin, "admin@example.com");
  vi.stubEnv(EMAIL_SETTINGS.from, "flol@example.com");
  const fetch = vi.fn(() => Promise.resolve(new Response("{}")));
  vi.stubGlobal("fetch", fetch);
  await convexTest(schema, modules).action(internal.outbound.email.emailAdmin, EMAIL);
  const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
  expect(url).toBe("https://api.resend.com/emails");
  expect(new Headers(init.headers).get("Authorization")).toBe("Bearer re_test");
  expect(JSON.parse(init.body as string)).toEqual({ from: "flol@example.com", to: "admin@example.com", ...EMAIL });
});

test("an email with no key set, or one Resend refuses, fails loudly", async () => {
  vi.stubGlobal("fetch", () => Promise.resolve(new Response("bad key", { status: 401 })));
  const t = convexTest(schema, modules);
  await expect(t.action(internal.outbound.email.emailAdmin, EMAIL)).rejects.toThrow(`The deployment setting ${EMAIL_SETTINGS.key} isn't set`);
  for (const [name, value] of [[EMAIL_SETTINGS.key, "re_test"], [EMAIL_SETTINGS.admin, "a@example.com"], [EMAIL_SETTINGS.from, "f@example.com"]]) vi.stubEnv(name!, value!);
  await expect(t.action(internal.outbound.email.emailAdmin, EMAIL)).rejects.toThrow("Resend refused the email (401): bad key");
});

test("a read of the feed hands its window, or what went wrong, to be stored", async () => {
  const t = convexTest(schema, modules);
  await t.mutation(internal.world.season.loadSeason, {});
  const game = LIVE_WINDOWS.start.esportsGameId;
  await t.run(async (ctx) => {
    const season = (await ctx.db.query("seasons").first())!;
    await ctx.db.insert("liveFrames", { esportsGameId: game, season: season._id, state: "polling", since: Date.now(), readAt: null, reading: null });
  });
  const frames = () => t.run(async (ctx) => (await ctx.db.query("liveFrames").first())!);

  vi.stubGlobal("fetch", () => Promise.resolve(new Response("", { status: 404 })));
  await t.action(internal.outbound.liveFeed.readLiveGame, { esportsGameId: game });
  expect((await frames()).lastError).toBe("the feed answered 404");

  vi.stubGlobal("fetch", () => Promise.resolve(new Response(JSON.stringify(LIVE_WINDOWS.start))));
  await t.action(internal.outbound.liveFeed.readLiveGame, { esportsGameId: game });
  expect((await frames()).reading?.gameId).toBe(game);
});
