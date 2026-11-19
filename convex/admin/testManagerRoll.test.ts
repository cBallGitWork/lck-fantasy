import { describe, expect, test } from "vitest";
import { seeded } from "../../src/parts/util/seeded";
import testManagerData from "../../data/testManagers.json";
import { LCK_2027 } from "../world/season";
import { competitionsOf, rollFavouriteTeam, rollTestManager, testManagerCount, type TestManagerGroup } from "./testManagerRoll";
import { TEST_MANAGER_STYLES } from "./testManagers";

const PLANS = testManagerData.plans as Record<string, TestManagerGroup[]>;
const LCK_TEAMS = [...new Set(LCK_2027.prices[0]!.picks.map((pick) => pick.team))];
const rolls = (count: number) => Array.from({ length: count }, (_, n) => rollTestManager(n, testManagerData.names, testManagerData.countries, seeded(n + 1)));

describe("a run's test managers (Craig, 19 Nov 2026 on #400)", () => {
  test("the sim has 1,000 in the LCK; January 400 in both regions, 300 LCK only, 300 LEC only", () => {
    expect(testManagerCount(PLANS.sim!)).toBe(1000);
    expect(competitionsOf(999, PLANS.sim!)).toEqual(["LCK"]);
    const january = PLANS.january!;
    expect(testManagerCount(january)).toBe(1000);
    const played = Array.from({ length: 1000 }, (_, n) => competitionsOf(n, january).join("+"));
    expect(played.filter((c) => c === "LCK+LEC")).toHaveLength(400);
    expect(played.filter((c) => c === "LCK")).toHaveLength(300);
    expect(played.filter((c) => c === "LEC")).toHaveLength(300);
    expect(() => competitionsOf(1000, january)).toThrow();
  });

  test("each style is a quarter, and test manager n is the same every run", () => {
    const all = rolls(1000);
    for (const style of TEST_MANAGER_STYLES) expect(all.filter((roll) => roll.style === style)).toHaveLength(250);
    expect(rolls(5)).toEqual(all.slice(0, 5));
  });
});

describe("what a manager sees of a test manager (story 4)", () => {
  const all = rolls(1000);

  test("a made-up team and manager name, never the words test manager", () => {
    for (const roll of all) {
      expect(roll.name).toMatch(/^\S+ [A-Z]\.$/);
      expect(`${roll.name} ${roll.teamName}`.toLowerCase()).not.toContain("test");
    }
    expect(new Set(all.map((roll) => roll.teamName)).size).toBeGreaterThan(100);
  });

  test("every team name fits the sign-up's longest", () => {
    const { teamFirst, teamLast } = testManagerData.names;
    for (const first of teamFirst) for (const last of teamLast) expect(`${first} ${last}`.length).toBeLessThanOrEqual(LCK_2027.settings.teamNameMaxLength);
  });

  test("no name word is a real player's handle", () => {
    const handles = new Set(LCK_2027.prices.flatMap((week) => week.picks.flatMap((pick) => (pick.handle ? [pick.handle.toLowerCase()] : []))));
    const { teamFirst, teamLast, people } = testManagerData.names;
    const words = [...teamFirst, ...teamLast, ...people.flatMap((p) => p.given)].flatMap((name) => name.toLowerCase().split(" "));
    expect(words.filter((word) => handles.has(word))).toEqual([]);
  });
});

describe("favourite team and country, like real fans", () => {
  const random = seeded(7);
  const favourites = Array.from({ length: 4000 }, () => rollFavouriteTeam(LCK_TEAMS, testManagerData.favouriteTeams, testManagerData.otherTeams, random));
  const share = (code: string) => favourites.filter((team) => team === code).length / favourites.length;

  test("T1 and Gen.G most, every team someone's", () => {
    const others = LCK_TEAMS.filter((code) => code !== "T1" && code !== "GEN");
    for (const code of others) expect(share("GEN")).toBeGreaterThan(share(code));
    expect(share("T1")).toBeGreaterThan(share("GEN"));
    for (const code of LCK_TEAMS) expect(share(code)).toBeGreaterThan(0);
  });

  test("mostly Korea, with a spread of others", () => {
    const countries = rolls(1000).map((roll) => roll.country);
    const korea = countries.filter((country) => country === "South Korea").length;
    expect(korea).toBeGreaterThan(500);
    expect(new Set(countries).size).toBeGreaterThan(5);
  });
});
