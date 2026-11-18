import { describe, expect, test } from "vitest";
import { byPick, CARRY_MULTIPLIER, chovy, coach, faker, player, zeus } from "../squads/fixtures";
import { pickKey, type Pick } from "../squads/squad";
import { starAndFlop, type ManagerLineup } from "./starAndFlop";

const SETTINGS = { flopPoolSize: 10 }; // fixture values: the real ones are the competition's data

interface Owned {
  pick: Pick;
  /** How many managers start him, and how many of those multiply him. */
  starts: number;
  carries?: number;
}

/** `count` managers' line-ups: manager i starts a pick when i < starts, and multiplies it by
 *  `multiplier` when i < carries. */
function managers(count: number, owned: readonly Owned[], multiplier = CARRY_MULTIPLIER): ManagerLineup[] {
  return Array.from({ length: count }, (_, i) => {
    const mine = owned.filter((o) => i < o.starts);
    return {
      lineup: mine.map((o) => ({ slot: o.pick.role === "coach" ? "coach" : "flex", pick: o.pick })),
      multipliers: new Map(mine.filter((o) => i < (o.carries ?? 0)).map((o) => [pickKey(o.pick), multiplier])),
    };
  });
}

const keysOf = (rows: { key: string }[]) => rows.map((row) => row.key);

const kiin = player("kiin", "gen", "top");
const genCoach = coach("gen");

describe("effective ownership", () => {
  test("40% start Faker and 20% of all managers carry him, so 50%", () => {
    const result = starAndFlop(managers(10, [{ pick: faker, starts: 4, carries: 2 }]), byPick([[faker, 5]]), SETTINGS);
    expect(result.ownership.get(pickKey(faker))?.effectiveOwnership).toBe(0.5);
  });

  test("under Double Captain both Captains count 2: 40% start Faker, 20% make him a Captain, so 60%", () => {
    const lineups = managers(10, [{ pick: faker, starts: 4, carries: 2 }, { pick: chovy, starts: 2, carries: 2 }], 2);
    const result = starAndFlop(lineups, byPick([[faker, 5], [chovy, 5]]), SETTINGS);
    expect(result.ownership.get(pickKey(faker))?.effectiveOwnership).toBe(0.6);
    expect(result.ownership.get(pickKey(chovy))?.effectiveOwnership).toBe(0.4);
  });

  test("a coach counts as started, and ×3 as it scored under Coach Diff", () => {
    const started = starAndFlop(managers(4, [{ pick: genCoach, starts: 2 }]), byPick([[genCoach, 3]]), SETTINGS);
    expect(started.ownership.get(pickKey(genCoach))?.effectiveOwnership).toBe(0.5);
    const coachDiff = starAndFlop(managers(4, [{ pick: genCoach, starts: 2, carries: 1 }], 3), byPick([[genCoach, 3]]), SETTINGS);
    expect(coachDiff.ownership.get(pickKey(genCoach))?.effectiveOwnership).toBe(1);
  });

  test("a pick who scored but nobody started is 0%", () => {
    const result = starAndFlop(managers(10, []), byPick([[kiin, 15]]), SETTINGS);
    expect(result.ownership.get(pickKey(kiin))).toEqual({ key: pickKey(kiin), points: 15, effectiveOwnership: 0 });
  });

  test("with no managers there is no star or flop", () => {
    expect(starAndFlop([], byPick([[kiin, 15]]), SETTINGS)).toMatchObject({ stars: [], flops: [] });
  });
});

describe("the star", () => {
  test("Kiin, 15 at 8%, beats Chovy, 18 at 45% (13.8 against 9.9)", () => {
    const lineups = managers(100, [
      { pick: kiin, starts: 8 },
      { pick: chovy, starts: 45 },
    ]);
    const result = starAndFlop(lineups, byPick([[kiin, 15], [chovy, 18]]), SETTINGS);
    expect(result.stars).toEqual([{ key: pickKey(kiin), points: 15, effectiveOwnership: 0.08 }]);
  });

  test("the coach is in the running, as the 6th role", () => {
    const lineups = managers(100, [{ pick: genCoach, starts: 30 }, { pick: kiin, starts: 50 }]);
    const result = starAndFlop(lineups, byPick([[genCoach, 12], [kiin, 16]]), SETTINGS);
    expect(keysOf(result.stars)).toEqual([pickKey(genCoach)]);
  });

  test("a tie goes to the lower ownership: Kiin, 15 at 8%, over Zeus, 23 at 40%, both 13.8", () => {
    const lineups = managers(100, [{ pick: kiin, starts: 8 }, { pick: zeus, starts: 40 }]);
    const result = starAndFlop(lineups, byPick([[kiin, 15], [zeus, 23]]), SETTINGS);
    expect(keysOf(result.stars)).toEqual([pickKey(kiin)]);
  });

  test("still tied, both are shown", () => {
    const lineups = managers(100, [{ pick: kiin, starts: 8 }, { pick: zeus, starts: 8 }]);
    const result = starAndFlop(lineups, byPick([[kiin, 15], [zeus, 15]]), SETTINGS);
    expect(keysOf(result.stars).sort()).toEqual([pickKey(kiin), pickKey(zeus)]);
  });
});

describe("the flop", () => {
  /** Ten players owned 70% down to 61%, each scoring 6; extras are added per test. */
  const owners = Array.from({ length: 10 }, (_, i) => ({ pick: player(`p${i}`, "t", "top"), starts: 70 - i }));
  const ownerPoints: [Pick, number][] = owners.map((o) => [o.pick, 6]);
  const mostOwned = pickKey(player("p0", "t", "top"));

  test("Faker, 2 at 62%, is the fewest points among the 10 most owned", () => {
    const top = [...owners.slice(0, 9), { pick: faker, starts: 62 }];
    const lowOwned = { pick: kiin, starts: 5 }; // fewer points, but outside the 10 most owned
    const result = starAndFlop(
      managers(100, [...top, lowOwned]),
      byPick([...ownerPoints.slice(0, 9), [faker, 2], [kiin, 0]]),
      SETTINGS,
    );
    expect(result.flops).toEqual([{ key: pickKey(faker), points: 2, effectiveOwnership: 0.62 }]);
  });

  test("everyone tied at 10th joins the pool, and a tie goes to the higher ownership", () => {
    // Faker ties p9 at 61%, so the pool has 11; he and p0 both score 2, p0 at 70% is the flop.
    const lineups = managers(100, [...owners, { pick: faker, starts: 61 }]);
    const points = byPick([...ownerPoints, [faker, 2]]);
    points.set(mostOwned, 2);
    expect(keysOf(starAndFlop(lineups, points, SETTINGS).flops)).toEqual([mostOwned]);
    points.set(mostOwned, 6);
    expect(keysOf(starAndFlop(lineups, points, SETTINGS).flops)).toEqual([pickKey(faker)]);
  });

  test("still tied, both are shown", () => {
    const lineups = managers(100, [...owners.slice(0, 9), { pick: faker, starts: 61 }, { pick: zeus, starts: 61 }]);
    const points = byPick([...ownerPoints.slice(0, 9), [faker, 1], [zeus, 1]]);
    expect(keysOf(starAndFlop(lineups, points, SETTINGS).flops).sort()).toEqual([pickKey(faker), pickKey(zeus)]);
  });
});

describe("every manager sees the same pair", () => {
  test("the result doesn't depend on the order of the line-ups", () => {
    const lineups = managers(100, [{ pick: kiin, starts: 8 }, { pick: chovy, starts: 45, carries: 10 }]);
    const points = byPick([[kiin, 15], [chovy, 18]]);
    expect(starAndFlop([...lineups].reverse(), points, SETTINGS)).toEqual(starAndFlop(lineups, points, SETTINGS));
  });
});
