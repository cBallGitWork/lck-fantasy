import { describe, expect, test } from "vitest";
import { bdd, chovy, coach, ktCoach, lucid, oner, player, REGULAR_SETTINGS, ruler, validSquad, withStarter, zeus } from "./fixtures";
import { arrangeByRole, transferProblems } from "./squadAfterTransfers";
import type { Squad, StarterSlot } from "./squad";

const faker = player("faker", "t1", "mid");
const canyon = player("canyon", "dk", "jungle");
const showmaker = player("showmaker", "dk", "mid");
const peyz = player("peyz", "dk", "bot");

const starterIn = (squad: Squad, slot: StarterSlot) => squad.starters.find((s) => s.slot === slot)!.pick;

describe("a transfer of any role for any role", () => {
  test("Craig's example: sell the starting jungler for a mid; the bench jungler starts, the mid takes his bench spot", () => {
    // validSquad: Oner starts at jungle; the bench is BDD (mid), then Lucid (jungle).
    const transfers = [{ out: oner, in: faker }];
    expect(transferProblems(validSquad(), transfers, REGULAR_SETTINGS)).toEqual([]);
    const after = arrangeByRole(validSquad(), transfers);
    expect(starterIn(after, "jungle")).toBe(lucid);
    expect(after.bench).toEqual([bdd, faker]);
  });

  test("like for like, the new player takes the sold player's slot, as in FPL", () => {
    const after = arrangeByRole(validSquad(), [{ out: chovy, in: showmaker }]);
    expect(after).toEqual(withStarter(validSquad(), "mid", showmaker));
  });

  test("a bench player of any role may go for any role, in his bench spot", () => {
    const transfers = [{ out: bdd, in: peyz }];
    expect(transferProblems(validSquad(), transfers, REGULAR_SETTINGS)).toEqual([]);
    expect(arrangeByRole(validSquad(), transfers).bench).toEqual([peyz, lucid]);
  });

  test("selling the only jungler for a mid is refused: a squad keeps one of each role", () => {
    const squad: Squad = { ...validSquad(), bench: [bdd, peyz] };
    expect(transferProblems(squad, [{ out: oner, in: faker }], REGULAR_SETTINGS)).toEqual([
      { rule: "roleShort", role: "jungle", min: 1, actual: 0 },
    ]);
  });

  test("the minimum of each role comes from the settings", () => {
    const settings = { ...REGULAR_SETTINGS, minPerRole: { ...REGULAR_SETTINGS.minPerRole, mid: 2 } };
    expect(transferProblems(validSquad(), [{ out: bdd, in: peyz }], settings)).toEqual([
      { rule: "roleShort", role: "mid", min: 2, actual: 1 },
    ]);
  });

  test("with no jungler on the bench, the flex jungler moves to jungle and the new mid starts in flex", () => {
    const squad: Squad = { ...withStarter(validSquad(), "flex", canyon), bench: [bdd, peyz] };
    const after = arrangeByRole(squad, [{ out: oner, in: faker }]);
    expect(starterIn(after, "jungle")).toBe(canyon);
    expect(starterIn(after, "flex")).toBe(faker);
    expect(after.bench).toEqual([bdd, peyz]);
  });

  test("the player already starting keeps his place: the bench jungler starts before the flex jungler moves", () => {
    const squad: Squad = { ...withStarter(validSquad(), "flex", canyon), bench: [lucid, bdd] };
    const after = arrangeByRole(squad, [{ out: oner, in: faker }]);
    expect(starterIn(after, "flex")).toBe(canyon);
    expect(starterIn(after, "jungle")).toBe(lucid);
    expect(after.bench).toEqual([faker, bdd]);
  });

  test("two crossed transfers each fill the other's role slot, and the bench is left alone", () => {
    // Oner (jungle) for Faker (mid), Chovy (mid) for Canyon (jungle).
    const transfers = [{ out: oner, in: faker }, { out: chovy, in: canyon }];
    expect(transferProblems(validSquad(), transfers, REGULAR_SETTINGS)).toEqual([]);
    const after = arrangeByRole(validSquad(), transfers);
    expect(starterIn(after, "jungle")).toBe(canyon);
    expect(starterIn(after, "mid")).toBe(faker);
    expect(after.bench).toEqual([bdd, lucid]);
  });

  test("the coach is swapped for a coach, into the coach slot", () => {
    const transfers = [{ out: ktCoach, in: coach("dk") }];
    expect(transferProblems(validSquad(), transfers, REGULAR_SETTINGS)).toEqual([]);
    expect(starterIn(arrangeByRole(validSquad(), transfers), "coach")).toEqual(coach("dk"));
  });

  test("a coach for a player, or a player for a coach, is refused", () => {
    const transfers = [{ out: ktCoach, in: peyz }, { out: ruler, in: coach("dk") }];
    expect(transferProblems(validSquad(), transfers, REGULAR_SETTINGS)).toEqual([
      { rule: "coachForCoach", outId: "kt", inId: "peyz" },
      { rule: "coachForCoach", outId: "ruler", inId: "dk" },
    ]);
  });

  test("selling a pick not in the squad is refused", () => {
    expect(transferProblems(validSquad(), [{ out: showmaker, in: faker }], REGULAR_SETTINGS)).toEqual([
      { rule: "notInSquad", pickId: "showmaker" },
    ]);
  });

  test("the team cap still holds after the squad is arranged", () => {
    // T1 has Oner and Keria; a T1 top laner for Zeus makes three.
    const transfers = [{ out: zeus, in: player("doran", "t1", "top") }];
    expect(transferProblems(validSquad(), transfers, REGULAR_SETTINGS)).toEqual([
      { rule: "overTeamCap", teamId: "t1", cap: 2, actual: 3 },
    ]);
  });
});
