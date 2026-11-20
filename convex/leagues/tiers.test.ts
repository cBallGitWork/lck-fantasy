import { describe, expect, test } from "vitest";
import { SPEC_TIER_CUTOFFS as CUTOFFS } from "./fixtures";
import { leagueTable, legendAndRise, type LeagueMember, type TableRow } from "./tables";
import { finalTiers, overallTier, tierGaps, tierLine } from "./tiers";

/** A table of `managers` with no ties, 2 points between each rank. */
function table(managers: number): TableRow[] {
  return Array.from({ length: managers }, (_, i) => ({
    entryId: `e${i + 1}`,
    rank: i + 1,
    gameweekPoints: 0,
    total: 2 * (managers - i),
    transfers: 0,
  }));
}

describe("overallTier", () => {
  test("Iron to Diamond have divisions, Master and Grandmaster none, Challenger the top", () => {
    expect(overallTier(1, 10_000, CUTOFFS)).toEqual({ tier: "challenger", division: null });
    expect(overallTier(3, 10_000, CUTOFFS)).toEqual({ tier: "grandmaster", division: null });
    expect(overallTier(7, 10_000, CUTOFFS)).toEqual({ tier: "master", division: null });
    expect(overallTier(900, 10_000, CUTOFFS)).toEqual({ tier: "emerald", division: 2 });
    expect(overallTier(10_000, 10_000, CUTOFFS)).toEqual({ tier: "iron", division: 4 });
  });

  test("a rank exactly on a cut-off is in that tier", () => {
    expect(overallTier(2, 10_000, CUTOFFS)).toEqual({ tier: "challenger", division: null });
    expect(overallTier(440, 10_000, CUTOFFS)).toEqual({ tier: "diamond", division: 4 });
    expect(overallTier(441, 10_000, CUTOFFS)).toEqual({ tier: "emerald", division: 1 });
  });

  test("a field too small for one Challenger has none: 1st of 1,000 is Master", () => {
    expect(overallTier(1, 1_000, CUTOFFS)).toEqual({ tier: "master", division: null });
  });

  test("the tier moves as soon as the rank does, with no protection at a floor", () => {
    expect(overallTier(150, 10_000, CUTOFFS)).toEqual({ tier: "diamond", division: 1 });
    expect(overallTier(151, 10_000, CUTOFFS)).toEqual({ tier: "diamond", division: 2 });
  });

  test("Unranked until gameweek 1 is final", () => {
    expect(overallTier(null, 0, CUTOFFS)).toEqual({ tier: "unranked" });
  });

  test("in Split 2 the tier is from the whole Overall table, not Legend or Rise", () => {
    const SEASON = { first: 1, last: 2 };
    const members: LeagueMember[] = Array.from({ length: 10 }, (_, i) => ({
      entryId: `m${i + 1}`,
      gameweeks: [{ gameweek: 1, points: 100 - i, transfers: 0 }, { gameweek: 2, points: 10, transfers: 0 }],
    }));
    const split1 = leagueTable(members, { first: 1, last: 1 }, 1, 1);
    const { rise } = legendAndRise(split1, members.map((m) => m.entryId));
    const whole = leagueTable(members, SEASON, 1, 2);
    const riseTable = leagueTable(members.filter((m) => rise.includes(m.entryId)), SEASON, 1, 2);
    expect(riseTable[0]).toMatchObject({ entryId: "m6", rank: 1 });
    const own = whole.find((row) => row.entryId === "m6");
    // 6th of 10 is Silver I; 1st of Rise's 5 would have been Platinum I.
    expect(overallTier(own?.rank ?? null, whole.length, CUTOFFS)).toEqual({ tier: "silver", division: 1 });
  });

  test("cut-offs that don't widen, or don't end at 100%, are refused", () => {
    const narrowing = [{ tier: "iron" as const, division: 1 as const, topPercent: 50 }, { tier: "iron" as const, division: 2 as const, topPercent: 40 }];
    expect(() => overallTier(1, 10, narrowing)).toThrow("must widen");
    expect(() => overallTier(1, 10, CUTOFFS.slice(0, -1))).toThrow("100%");
    expect(() => overallTier(11, 10, CUTOFFS)).toThrow("not on a table");
  });
});

describe("tierGaps", () => {
  test("the points to the manager at the line above, and of room over the one under one's own", () => {
    // 160th of 10,000 is Diamond II: Diamond I ends at 150th, Diamond II at 240th.
    expect(tierGaps(table(10_000), "e160", CUTOFFS)).toEqual({
      promote: { points: 20, tier: { tier: "diamond", division: 1 } },
      demote: { points: 162, tier: { tier: "diamond", division: 3 } },
    });
  });

  test("level on points with the manager under the line, there is no room left", () => {
    const rows = table(10_000).map((row) => (row.rank === 151 ? { ...row, total: 2 * (10_000 - 149) } : row));
    expect(tierGaps(rows, "e150", CUTOFFS).demote).toEqual({ points: 0, tier: { tier: "diamond", division: 2 } });
  });

  test("Challenger has nothing above, the last tier nothing below", () => {
    expect(tierGaps(table(10_000), "e1", CUTOFFS).promote).toBeNull();
    expect(tierGaps(table(10_000), "e10000", CUTOFFS).demote).toBeNull();
  });

  test("in a field too small for Grandmaster, Master is the top", () => {
    expect(tierGaps(table(1_000), "e1", CUTOFFS).promote).toBeNull();
  });
});

describe("tierLine", () => {
  test("always the points to promote, never the room before demotion below Challenger (Craig, 18 Nov 2026)", () => {
    expect(tierLine(table(10_000), "e160", CUTOFFS)).toEqual({ to: "promote", points: 20, tier: { tier: "diamond", division: 1 } });
  });

  test("at Challenger, with nothing above, the room before demotion", () => {
    // 1st of 10,000 is Challenger to 2nd; 3rd is Grandmaster, 4 points under.
    expect(tierLine(table(10_000), "e1", CUTOFFS)).toEqual({ to: "demote", points: 4, tier: { tier: "grandmaster", division: null } });
  });

  test("at the top of a field too small for Challenger, no line", () => {
    expect(tierLine(table(1_000), "e1", CUTOFFS)).toBeNull();
  });
});

describe("finalTiers", () => {
  test("keeps each manager's final rank and tier when the season ends", () => {
    expect(finalTiers(table(10_000), CUTOFFS)[159]).toEqual({ entryId: "e160", rank: 160, tier: { tier: "diamond", division: 2 } });
  });
});
