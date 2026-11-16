import { describe, expect, test } from "vitest";
import {
  byPick, CARRY_MULTIPLIER, chovy, faker, gumayusi, keria, ktCoach, oner, ruler, showmaker, validSquad, zeus,
} from "../squads/fixtures";
import type { Pick, ScoringPick } from "../squads/squad";
import { feed, type FeedSettings, type FinishedSeries, type ManagerWeek } from "./feed";
import { following, LINE_SETTINGS, NO_FOLLOWS } from "./fixtures";
import { block } from "./follows";

const SETTINGS: FeedSettings = { bigCarryPoints: LINE_SETTINGS.bigCarryPoints, carryMultiplier: CARRY_MULTIPLIER };
const DEADLINE = 1_000;

const lineup: ScoringPick[] = validSquad().starters;

function series(id: string, finishedAt: number, points: [Pick, number][]): FinishedSeries {
  return { id, finishedAt, points: byPick(points) };
}

function week(managerId: string, changes: Partial<ManagerWeek> = {}): ManagerWeek {
  return { managerId, lineup, carrying: new Set(["chovy"]), transfers: [], buff: null, ...changes };
}

/** Jun follows Minji and Sora; nobody follows Jun. */
const follows = following(NO_FOLLOWS, "jun", "minji", "sora");

describe("feed (spec/14, The feed)", () => {
  test("only accepted follows show, one-way", () => {
    const gameweek = { deadline: DEADLINE, series: [] };
    const weeks = [week("minji"), week("jun"), week("stranger")];
    expect(feed("jun", follows, gameweek, weeks, SETTINGS).map((item) => item.managerId)).toEqual(["minji"]);
    expect(feed("minji", follows, gameweek, weeks, SETTINGS)).toEqual([]);
  });

  test("a block hides the blocked manager's week", () => {
    const blocked = block(follows, "minji", "jun");
    const items = feed("jun", blocked, { deadline: DEADLINE, series: [] }, [week("minji"), week("sora")], SETTINGS);
    expect(items.map((item) => item.managerId)).toEqual(["sora"]);
  });

  test("each followed manager's points at the end of each series, newest first", () => {
    const gameweek = {
      deadline: DEADLINE,
      series: [
        series("hle-t1", 3_000, [[zeus, 5], [gumayusi, 4], [oner, 6], [keria, 2]]),
        series("gen-kt", 2_000, [[chovy, 8], [ruler, 3], [ktCoach, -1]]),
        series("dk-bro", 4_000, [[showmaker, 9]]),
      ],
    };
    const items = feed("jun", follows, gameweek, [week("minji")], SETTINGS);
    expect(items.filter((item) => item.kind !== "moves")).toEqual([
      { kind: "seriesPoints", managerId: "minji", at: 3_000, seriesId: "hle-t1", points: 17 },
      // Chovy's 8 as the Carry is 12.
      { kind: "seriesPoints", managerId: "minji", at: 2_000, seriesId: "gen-kt", points: 14 },
    ]);
  });

  test("a big Carry is 20 or more after the ×1.5: 14 makes 21, 13 makes 19", () => {
    const gameweek = { deadline: DEADLINE, series: [series("gen-kt", 2_000, [[chovy, 14]])] };
    expect(feed("jun", follows, gameweek, [week("minji")], SETTINGS)).toContainEqual({
      kind: "bigCarry", managerId: "minji", at: 2_000, seriesId: "gen-kt", pick: chovy, points: 21,
    });
    const quiet = { deadline: DEADLINE, series: [series("gen-kt", 2_000, [[chovy, 13]])] };
    expect(feed("jun", follows, quiet, [week("minji")], SETTINGS).some((item) => item.kind === "bigCarry")).toBe(false);
  });

  test("a Carry on exactly 20 is big, and the 20 is data", () => {
    const gameweek = { deadline: DEADLINE, series: [series("gen-kt", 2_000, [[chovy, 10]])] };
    const doubled = { ...SETTINGS, carryMultiplier: 2 };
    expect(feed("jun", follows, gameweek, [week("minji")], doubled)).toContainEqual(
      expect.objectContaining({ kind: "bigCarry", points: 20 }),
    );
    expect(feed("jun", follows, gameweek, [week("minji")], { ...doubled, bigCarryPoints: 21 }).some((item) => item.kind === "bigCarry")).toBe(false);
  });

  test("only the Carry counts: the same points on another player are no big Carry", () => {
    const gameweek = { deadline: DEADLINE, series: [series("hle-t1", 2_000, [[zeus, 30]])] };
    expect(feed("jun", follows, gameweek, [week("minji")], SETTINGS).some((item) => item.kind === "bigCarry")).toBe(false);
  });

  test("at the deadline, transfers and buff, then each swap's points so far: Chovy → Faker, +6", () => {
    const moved = week("minji", { transfers: [{ out: chovy, in: faker }], buff: "benchBoost" });
    const gameweek = {
      deadline: DEADLINE,
      series: [series("gen-kt", 2_000, [[chovy, 4]]), series("t1-dk", 3_000, [[faker, 10]])],
    };
    expect(feed("jun", follows, gameweek, [moved], SETTINGS).at(-1)).toEqual({
      kind: "moves", managerId: "minji", at: DEADLINE, buff: "benchBoost", swaps: [{ out: chovy, in: faker, soFar: 6 }],
    });
  });
});
