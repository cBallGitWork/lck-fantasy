import { describe, expect, test } from "vitest";
import { leaguepediaGameKey, v5Extras } from "./leaguepedia";
import { v5Game } from "./fixtures/v5-shape";

describe("leaguepedia", () => {
  test("the page key is the Oracle's Elixir id with a space for each underscore", () => {
    expect(leaguepediaGameKey("LOLTMNT03_183532")).toBe("LOLTMNT03 183532");
  });

  test("solo kills and steals by participant id", () => {
    const extras = v5Extras(v5Game({ 3: { soloKills: 2 }, 7: { objectivesStolen: 1 } }));
    expect(extras.get(3)).toEqual({ soloKills: 2, steals: 0 });
    expect(extras.get(7)).toEqual({ soloKills: 0, steals: 1 });
    expect(extras.size).toBe(10);
  });

  test("a missing field throws rather than score 0", () => {
    const payload = v5Game();
    delete (payload.info.participants[4] as { challenges?: unknown }).challenges;
    expect(() => v5Extras(payload)).toThrow("participant 5 has no challenges.soloKills");
    expect(() => v5Extras({})).toThrow("Match data has no info.participants.");
  });
});
