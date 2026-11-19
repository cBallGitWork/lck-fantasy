import { describe, expect, test } from "vitest";
import { leaguepediaGameKey, v5Extras } from "./leaguepedia";
import { leaguepediaPage } from "./fixtures/leaguepedia";

describe("leaguepedia", () => {
  test("the page key is the Oracle's Elixir id with a space for each underscore", () => {
    expect(leaguepediaGameKey("LOLTMNT03_183532")).toBe("LOLTMNT03 183532");
  });

  test("an admin's pasted key wins; a blank one falls back", () => {
    expect(leaguepediaGameKey("LOLTMNT03_183532", " ESPORTSTMNT01 3400 ")).toBe("ESPORTSTMNT01 3400");
    expect(leaguepediaGameKey("LOLTMNT03_183532", "  ")).toBe("LOLTMNT03 183532");
  });

  test("solo kills and steals by participant id, from the page's flat participants", () => {
    const game2 = v5Extras(leaguepediaPage("LOLTMNT03_183538"));
    expect(game2.size).toBe(10);
    expect(game2.get(2)).toEqual({ soloKills: 0, steals: 1 });
    const game3 = v5Extras(leaguepediaPage("LOLTMNT03_183544"));
    expect(game3.get(8)).toEqual({ soloKills: 2, steals: 0 });
    expect([...game3.values()].reduce((sum, e) => sum + e.soloKills + e.steals, 0)).toBe(2);
  });

  test("a missing field throws rather than score 0", () => {
    const page = leaguepediaPage("LOLTMNT03_183532");
    delete page.participants[4]!.challenges;
    expect(() => v5Extras(page)).toThrow("participant 5 has no challenges.soloKills");
    expect(() => v5Extras({ info: { participants: page.participants } })).toThrow("Match data has no participants.");
  });
});
