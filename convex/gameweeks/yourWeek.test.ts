import { describe, expect, test } from "vitest";
import { SPEC_TIER_CUTOFFS } from "../leagues/fixtures";
import type { TableRow } from "../leagues/tables";
import { CARRY_MULTIPLIER, canyon, chovy, coach, faker, keria, oner, peyz, player, ruler, zeus } from "../squads/fixtures";
import { pickKey, type Pick } from "../squads/squad";
import type { Ownership } from "./starAndFlop";
import { pickFlop, pickKillers, pickStars, yourWeek, type YourLineup } from "./yourWeek";

const SETTINGS = { picks: 3 }; // fixture values: the real ones are the competition's data

const kiin = player("kiin", "gen", "top");
const zeka = player("zeka", "hle", "mid");
const t1Coach = coach("t1");

const row = (pick: Pick, points: number, effectiveOwnership: number): Ownership => ({ key: pickKey(pick), points, effectiveOwnership });
const keysOf = (rows: readonly Ownership[]) => rows.map((one) => one.key);

describe("Stars", () => {
  test("Kiin, 15 at 8%, ranks above Chovy, 18 at 45% (spec/12)", () => {
    expect(keysOf(pickStars([row(chovy, 18, 0.45), row(kiin, 15, 0.08)], 1))).toEqual([pickKey(kiin)]);
  });

  test("the sum picks the three; they are listed by points", () => {
    // Sums: Oner 9.4, Zeus 9.0, Faker 8.0, Ruler 6.0, so Ruler's 12 is out; Faker, third by sum, is listed first.
    const rows = [row(faker, 16, 0.5), row(zeus, 10, 0.1), row(oner, 10, 0.06), row(ruler, 12, 0.5)];
    expect(pickStars(rows, 3)).toEqual([row(faker, 16, 0.5), row(oner, 10, 0.06), row(zeus, 10, 0.1)]);
  });

  test("level on points, the higher sum is listed first", () => {
    expect(keysOf(pickStars([row(zeus, 10, 0.1), row(oner, 10, 0.06)], 2))).toEqual([pickKey(oner), pickKey(zeus)]);
  });

  test("a tie goes to the lower ownership: Kiin, 15 at 8%, over Zeus, 23 at 40%, both 13.8", () => {
    expect(keysOf(pickStars([row(zeus, 23, 0.4), row(kiin, 15, 0.08)], 1))).toEqual([pickKey(kiin)]);
  });

  test("the coach is in the running", () => {
    expect(keysOf(pickStars([row(t1Coach, 12, 0.1), row(kiin, 10, 0.1)], 1))).toEqual([pickKey(t1Coach)]);
  });
});

describe("Killers", () => {
  test("Chovy, 15 at 41%, ranks above a 20-point player at 5% (spec/12)", () => {
    expect(keysOf(pickKillers([row(peyz, 20, 0.05), row(chovy, 15, 0.41)], 1))).toEqual([pickKey(chovy)]);
  });

  test("Chovy 15, Zeka 14, Kiin 12 are listed by points, though Kiin's sum beats Zeka's", () => {
    const rows = [row(kiin, 12, 0.33), row(zeka, 14, 0.22), row(chovy, 15, 0.41), row(peyz, 20, 0.05)];
    expect(keysOf(pickKillers(rows, 3))).toEqual([pickKey(chovy), pickKey(zeka), pickKey(kiin)]);
  });

  test("a tie goes to the higher ownership: Zeus, 10 at 40%, over Kiin, 20 at 20%, both 4", () => {
    expect(keysOf(pickKillers([row(kiin, 20, 0.2), row(zeus, 10, 0.4)], 1))).toEqual([pickKey(zeus)]);
  });

  test("the coach is in the running", () => {
    expect(keysOf(pickKillers([row(t1Coach, 10, 0.6), row(chovy, 12, 0.3)], 1))).toEqual([pickKey(t1Coach)]);
  });
});

describe("the Flop", () => {
  test("the fewest points; a tie goes to the higher ownership", () => {
    expect(pickFlop([row(faker, 4, 0.6), row(keria, 4, 0.3), row(zeus, 9, 0.1)])).toEqual(row(faker, 4, 0.6));
  });

  test("none when no starter played", () => {
    expect(pickFlop([])).toBeNull();
  });
});

/** A table of `managers` with no ties, 2 points between each rank. */
function table(managers: number): TableRow[] {
  return Array.from({ length: managers }, (_, i) => ({ entryId: `e${i + 1}`, rank: i + 1, gameweekPoints: 0, total: 2 * (managers - i), transfers: 0 }));
}

describe("yourWeek", () => {
  const ownership = new Map(
    [row(faker, 10, 0.6), row(zeus, 8, 0.1), row(canyon, 2, 0.3), row(t1Coach, 6, 0.2), row(oner, 0, 0.1), row(keria, 9, 0.9), row(chovy, 15, 0.4), row(ruler, 7, 0.5), row(kiin, 3, 0.05)].map(
      (one) => [one.key, one],
    ),
  );
  const mine: YourLineup = {
    lineup: [
      { slot: "mid", pick: faker },
      { slot: "top", pick: zeus },
      { slot: "jungle", pick: canyon },
      { slot: "coach", pick: t1Coach },
      { slot: "flex", pick: oner },
    ],
    multipliers: new Map([[pickKey(faker), CARRY_MULTIPLIER]]),
    squad: new Set([faker, zeus, canyon, t1Coach, oner, keria].map(pickKey)),
    played: new Set([faker, zeus, canyon, t1Coach].map(pickKey)),
  };
  const overall = (entryId: string) => ({ table: table(10_000), entryId, cutoffs: SPEC_TIER_CUTOFFS });

  test("Stars are your starters, the Captain's points after ×1.5; Killers are the players you don't own", () => {
    const week = yourWeek(ownership, mine, null, SETTINGS);
    // Faker 15 × 0.4 = 6.0, Zeus 7.2, the coach 4.8, Canyon 1.4.
    expect(week.stars).toEqual([row(faker, 15, 0.6), row(zeus, 8, 0.1), row(t1Coach, 6, 0.2)]);
    // Keria is on the bench: never a Killer. Chovy 6.0, Ruler 3.5, Kiin 0.15.
    expect(keysOf(week.killers)).toEqual([pickKey(chovy), pickKey(ruler), pickKey(kiin)]);
  });

  test("the Flop is the lowest starter who played: Oner's 0 never played", () => {
    expect(yourWeek(ownership, mine, null, SETTINGS).flop).toEqual(row(canyon, 2, 0.3));
  });

  test("a Bench Boost bench is no Star", () => {
    const boosted = { ...mine, lineup: [...mine.lineup, { slot: "bench" as const, pick: keria }] };
    expect(keysOf(yourWeek(ownership, boosted, null, SETTINGS).stars)).not.toContain(pickKey(keria));
  });

  test("both tier gaps in a middle tier: 160th of 10,000 is Diamond II", () => {
    expect(yourWeek(ownership, mine, overall("e160"), SETTINGS)).toMatchObject({
      promote: { points: 20, tier: { tier: "diamond", division: 1 } },
      demote: { points: 162, tier: { tier: "diamond", division: 3 } },
    });
  });

  test("at Challenger nothing above; at Iron IV nothing below; Unranked neither", () => {
    expect(yourWeek(ownership, mine, overall("e1"), SETTINGS)).toMatchObject({
      promote: null,
      demote: { points: 4, tier: { tier: "grandmaster", division: null } },
    });
    expect(yourWeek(ownership, mine, overall("e10000"), SETTINGS)).toMatchObject({
      // Iron III ends at 9,900th, 200 points up.
      promote: { points: 200, tier: { tier: "iron", division: 3 } },
      demote: null,
    });
    expect(yourWeek(ownership, mine, null, SETTINGS)).toMatchObject({ promote: null, demote: null });
  });
});
