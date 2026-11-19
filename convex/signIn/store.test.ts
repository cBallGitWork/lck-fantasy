import { convexTest } from "convex-test";
import { ConvexError } from "convex/values";
import { describe, expect, test } from "vitest";
import { WON_PER_M } from "../../src/parts/text/money";
import { internal } from "../_generated/api";
import { HOUR_MS } from "../world/fixtures";
import { LCK_2027, type SeasonFile } from "../world/season";
import schema from "../schema";
import type { Pick, Squad } from "../squads/squad";
import { modules } from "../test.setup";
import { INVITE_CAP } from "./invites";
import type { SaveRefusal } from "./store";

const store = internal.signIn.store;
const LCK = { competition: "LCK", year: 2027 };
const ACCOUNT = "google|craig";

const at = (ms: number) => new Date(ms).toISOString();
const DAY = 24 * HOUR_MS;
const player = (id: string, teamId: string, role: Pick["role"]): Pick => ({ id, teamId, role });

/** data/lck's 2027 season, with gameweek 1's deadline gone and 2 and 3 to come, and `later` prices
 *  from gameweek 2. */
function season(later: SeasonFile["prices"][number]["picks"] = [], deadlinesFrom = Date.now() - DAY): SeasonFile {
  return {
    ...LCK_2027,
    gameweeks: [1, 2, 3].map((number) => ({ number, split: 1, deadline: at(deadlinesFrom + (number - 1) * 7 * DAY), state: "toCome" as const })),
    prices: [LCK_2027.prices[0]!, ...(later.length > 0 ? [{ fromGameweek: 2, picks: later }] : [])],
  };
}

// Zeus 14, Oner 14, Faker 18.5, Ruler 16, Delight 10, Clozer 5, KT 5.5, Clear 5.5, Hype 5.5: ₩94m of 100.
const SQUAD: Squad = {
  starters: [
    { slot: "top", pick: player("Zeus", "HLE", "top") },
    { slot: "jungle", pick: player("Oner", "T1", "jungle") },
    { slot: "mid", pick: player("Faker", "T1", "mid") },
    { slot: "bot", pick: player("Ruler", "GEN", "bot") },
    { slot: "support", pick: player("Delight", "HLE", "support") },
    { slot: "flex", pick: player("Clozer", "BRO", "mid") },
    { slot: "coach", pick: player("KT", "KT", "coach") },
  ],
  bench: [player("Clear", "BFX", "top"), player("Hype", "KRX", "bot")],
};

async function world(data = season()) {
  const t = convexTest(schema, modules);
  await t.mutation(internal.world.season.loadSeason, { data });
  const t1 = await t.run((ctx) => ctx.db.insert("teams", { name: "T1", oeId: "oe-t1" }));
  const save = (fields: Partial<{ squad: Squad; teamName: string; favouriteTeam: string; country: string; account: string; invite: string; competition: string }> = {}) =>
    t.mutation(store.saveNewTeam, {
      ...LCK,
      account: ACCOUNT,
      squad: SQUAD,
      teamName: "Baron Steal FC",
      favouriteTeam: t1,
      country: "GB",
      agreedVersion: "2026-11-18",
      ...fields,
    });
  return { t, t1, save };
}

/** The refusal a call throws, as the sheet gets it. */
async function refusal(call: Promise<unknown>) {
  const error = await call.then(() => null, (e: unknown) => e);
  expect(error).toBeInstanceOf(ConvexError);
  return (error as ConvexError<SaveRefusal>).data;
}

const stored = (t: ReturnType<typeof convexTest>) =>
  t.run(async (ctx) => ({
    managers: await ctx.db.query("managers").collect(),
    entries: await ctx.db.query("entries").collect(),
    picks: await ctx.db.query("picks").collect(),
  }));

describe("Save team makes the entry (spec/09, Signing up)", () => {
  test("the squad becomes the account's entry, bought at today's prices, from the next deadline on 0 points", async () => {
    const { t, t1, save } = await world();
    const saved = await save();
    expect(saved).toMatchObject({ firstGameweek: 2, captain: "Faker" });
    const { managers, entries, picks } = await stored(t);
    expect(managers).toMatchObject([{ account: ACCOUNT, country: "GB", agreed: { version: "2026-11-18" } }]);
    expect(entries).toMatchObject([{ teamName: "Baron Steal FC", favouriteTeam: t1, firstGameweek: 2, bank: 6 * WON_PER_M }]);
    expect(picks).toHaveLength(9);
    expect(picks.filter((p) => p.captain).map((p) => p.handle)).toEqual(["Faker"]);
    expect(picks.find((p) => p.slot === "coach")).toMatchObject({ team: "KT", role: "coach", buyPrice: 5.5 * WON_PER_M });
    expect(picks.filter((p) => p.slot === "bench").map((p) => [p.benchOrder, p.handle])).toEqual([[1, "Clear"], [2, "Hype"]]);
  });

  test("the new manager is in Overall, their country's league and their team's (spec/08)", async () => {
    const { t, save } = await world();
    const { entry } = await save();
    expect((await t.query(internal.leagues.store.leaguesOf, { entry })).map((l) => l.kind)).toEqual(["overall", "country", "team"]);
  });

  test("a deadline that moved prices since the pick: refused at today's, saying by how much, and nothing stored", async () => {
    // Faker rose from 18.5m to 24.8m at gameweek 2: ₩100.3m, ₩0.3m over.
    const { t, save } = await world(season([{ team: "T1", role: "mid", handle: "Faker", won: 24_800_000 }]));
    expect(await refusal(save())).toEqual({
      rule: "signUp",
      problems: [{ rule: "squad", problem: { rule: "overBudget", budget: 100 * WON_PER_M, cost: 100_300_000 } }],
    });
    expect(await stored(t)).toEqual({ managers: [], entries: [], picks: [] });
  });

  test("a squad short of nine, a blank name or an unknown team is refused with each reason", async () => {
    const { save } = await world();
    const { problems } = (await refusal(save({ squad: { ...SQUAD, bench: [SQUAD.bench[0]!] }, teamName: "  ", favouriteTeam: "lec" }))) as {
      problems: unknown[];
    };
    expect(problems).toEqual([
      { rule: "squad", problem: { rule: "slotCount", slot: "bench", expected: 2, actual: 1 } },
      { rule: "missing", field: "teamName" },
      { rule: "unknownTeam", teamId: "lec" },
    ]);
  });

  test("a pick with no price is refused, never bought free", async () => {
    const { save } = await world();
    const squad = { ...SQUAD, bench: [SQUAD.bench[0]!, player("Nobody", "BFX", "bot")] };
    expect(await refusal(save({ squad }))).toEqual({ rule: "signUp", problems: [{ rule: "squad", problem: { rule: "unpriced", pickId: "Nobody" } }] });
  });

  test("after the last deadline there is no gameweek left to join", async () => {
    const { save } = await world(season([], Date.now() - 30 * DAY));
    expect(await refusal(save())).toEqual({ rule: "seasonOver" });
  });
});

describe("logging in (spec/09, Signing in again)", () => {
  test("an account with a team has it, and can't make a second", async () => {
    const { t, save } = await world();
    expect(await t.query(store.hasTeam, { ...LCK, account: ACCOUNT })).toBe(false);
    await save();
    expect(await t.query(store.hasTeam, { ...LCK, account: ACCOUNT })).toBe(true);
    expect(await refusal(save({ teamName: "Second Go" }))).toEqual({ rule: "hasTeam" });
    expect(await t.query(store.hasTeam, { ...LCK, account: "discord|sam" })).toBe(false);
  });

  test("an account back for a new season keeps its one manager, with this sign-up's answers", async () => {
    const { t, save } = await world();
    // A manager from an earlier season, with no entry in this one.
    await t.run((ctx) => ctx.db.insert("managers", { account: ACCOUNT, country: "KR", agreed: { at: 0, version: "2026-01-01" } }));
    await save();
    const { managers, entries } = await stored(t);
    expect(managers).toMatchObject([{ account: ACCOUNT, country: "GB", agreed: { version: "2026-11-18" } }]);
    expect(entries).toMatchObject([{ manager: managers[0]!._id }]);
    expect(await t.query(store.hasTeam, { ...LCK, account: ACCOUNT })).toBe(true);
  });
});

describe("a closed test signs up only those Craig invites (spec/10, The road to launch, step 2)", () => {
  const invites = internal.signIn.invites;
  /** The season, run as a closed test, under `competition`'s name. */
  const closed = (competition = LCK.competition): SeasonFile => {
    const data = season();
    return { ...data, competition: { ...data.competition, name: competition }, settings: { ...data.settings, signUpOpen: false } };
  };

  test("an unused invite's link signs up, any case, and the invite shows as used", async () => {
    const { t, save } = await world(closed());
    const code = await t.mutation(invites.makeInvite, { for: "Sam from Discord" });
    expect(await t.query(invites.invites, {})).toEqual([{ for: "Sam from Discord", code, usedAt: null }]);
    await save({ invite: code.toLowerCase() });
    expect(await t.query(store.hasTeam, { ...LCK, account: ACCOUNT })).toBe(true);
    expect((await t.query(invites.invites, {}))[0]!.usedAt).toEqual(expect.any(Number));
  });

  test("with no invite, or a code that isn't one, sign-up is closed and nothing is stored", async () => {
    const { t, save } = await world(closed());
    expect(await refusal(save())).toEqual({ rule: "closed" });
    expect(await refusal(save({ invite: "NOPE-NOPE" }))).toEqual({ rule: "noInvite", code: "NOPE-NOPE" });
    expect(await stored(t)).toEqual({ managers: [], entries: [], picks: [] });
  });

  test("an open season signs up anyone and ignores an invite code", async () => {
    const { t, save } = await world();
    await save({ invite: "NOPE-NOPE" });
    expect(await t.query(store.hasTeam, { ...LCK, account: ACCOUNT })).toBe(true);
  });

  test("an invite someone else used turns a second person away", async () => {
    const { t, save } = await world(closed());
    const code = await t.mutation(invites.makeInvite, { for: "Sam" });
    await save({ invite: code });
    expect(await refusal(save({ invite: code, account: "discord|jo" }))).toEqual({ rule: "inviteUsed" });
  });

  test("one invite lets its person into both regions' tests", async () => {
    const { t, save } = await world(closed());
    await t.mutation(internal.world.season.loadSeason, { data: closed("LEC") });
    const code = await t.mutation(invites.makeInvite, { for: "Sam" });
    await save({ invite: code });
    await save({ competition: "LEC" });
    expect(await t.query(store.hasTeam, { competition: "LEC", year: 2027, account: ACCOUNT })).toBe(true);
  });

  test("a refused Save leaves the invite unused", async () => {
    const { t, save } = await world(closed());
    const code = await t.mutation(invites.makeInvite, { for: "Sam" });
    await refusal(save({ invite: code, teamName: " " }));
    expect((await t.query(invites.invites, {}))[0]!.usedAt).toBeNull();
  });

  test(`Craig makes up to the cap's ${INVITE_CAP} invites, then no more`, async () => {
    const { t } = await world(closed());
    for (let i = 0; i < INVITE_CAP; i++) await t.mutation(invites.makeInvite, { for: `Tester ${i}` });
    await expect(t.mutation(invites.makeInvite, { for: "One too many" })).rejects.toThrow(`All ${INVITE_CAP} invites are made`);
  });
});
