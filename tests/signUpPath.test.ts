// The signed-out pick to sign-up path (spec/09): a guest picks, Auto-fills, keeps the squad in the
// browser, comes back, and Save team makes the entry on the server, in its three leagues.
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { internal } from "../convex/_generated/api";
import { LCK_2027, type SeasonFile } from "../convex/world/season";
import schema from "../convex/schema";
import { modules } from "../convex/test.setup";
import { PLAYERS, RULES } from "../src/screens/pick-team-signed-out/fixtures";
import { keepGuestSquad, readGuestSquad } from "../src/screens/pick-team-signed-out/guestSquad";
import { add, autoFilled, EMPTY_SQUAD, saveBlock } from "../src/screens/pick-team-signed-out/pick";
import { keptStorage } from "../src/testing/storage";

const DAY = 24 * 60 * 60 * 1000;
const LCK = { competition: "LCK", year: 2027 };

/** data/lck's 2027 season, its next deadline a day off. */
const season: SeasonFile = {
  ...LCK_2027,
  gameweeks: [{ number: 1, split: 1, deadline: new Date(Date.now() + DAY).toISOString(), state: "toCome" }],
};

test("pick as a guest, Auto-fill, come back, Save team: the squad becomes the entry", async () => {
  // Picks Faker, then Auto-fills the rest.
  const faker = PLAYERS.find((p) => p.name === "Faker")!;
  const picked = add(EMPTY_SQUAD, faker, RULES.squad);
  if ("refused" in picked) throw new Error(picked.refused);
  const squad = autoFilled(picked.squad, PLAYERS, RULES, () => 0.5);
  expect(saveBlock(squad, PLAYERS, RULES)).toBeUndefined();

  // Closes the tab; tomorrow the squad is still in this browser, not entered.
  const browser = keptStorage() as Storage;
  keepGuestSquad(browser, "LCK-2027", squad);
  const back = readGuestSquad(browser, "LCK-2027");
  expect(back).toEqual({ kept: "squad", squad });

  // Save team: signs in (faked until Convex Auth is wired), names the team, and the server takes it.
  const t = convexTest(schema, modules);
  await t.mutation(internal.world.season.loadSeason, { data: season });
  const t1 = await t.run((ctx) => ctx.db.insert("teams", { name: "T1", oeId: "oe-t1" }));
  const saved = await t.mutation(internal.signIn.store.saveNewTeam, {
    ...LCK,
    account: "google|guest",
    squad: back.kept === "squad" ? back.squad : EMPTY_SQUAD,
    teamName: "Baron Steal FC",
    favouriteTeam: t1,
    country: "United Kingdom",
    agreedVersion: "test",
  });
  expect(saved.firstGameweek).toBe(1);
  expect((await t.query(internal.leagues.store.leaguesOf, { entry: saved.entry })).map((l) => l.kind)).toEqual(["overall", "country", "team"]);
  expect(await t.query(internal.signIn.store.hasTeam, { ...LCK, account: "google|guest" })).toBe(true);
});
