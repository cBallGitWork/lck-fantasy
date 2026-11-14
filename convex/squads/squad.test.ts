import { describe, expect, test } from "vitest";
import { coach, player, REGULAR_SETTINGS, validSquad, withStarter } from "./fixtures";
import { squadProblems } from "./squad";

describe("squadProblems", () => {
  test("a valid squad of nine breaks no rule", () => {
    expect(squadProblems(validSquad(), REGULAR_SETTINGS)).toEqual([]);
  });

  test("a squad missing its flex or with a third bench player is refused", () => {
    const squad = validSquad();
    squad.starters = squad.starters.filter((s) => s.slot !== "flex");
    squad.bench.push(player("peyz", "dk", "bot"));
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([
      { rule: "slotCount", slot: "flex", expected: 1, actual: 0 },
      { rule: "slotCount", slot: "bench", expected: 2, actual: 3 },
    ]);
  });

  test("the sizes come from the settings", () => {
    const settings = { ...REGULAR_SETTINGS, benchSize: 3 };
    expect(squadProblems(validSquad(), settings)).toEqual([
      { rule: "slotCount", slot: "bench", expected: 3, actual: 2 },
    ]);
  });

  test("a player in the wrong role slot is refused", () => {
    const squad = withStarter(validSquad(), "top", player("canyon", "dk", "jungle"));
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([{ rule: "wrongRole", slot: "top", pickId: "canyon" }]);
  });

  test("the flex takes a player of any role, so two bot laners is valid", () => {
    // validSquad has Gumayusi at bot and Ruler, a bot laner, in flex.
    const squad = withStarter(validSquad(), "flex", player("peyz", "dk", "bot"));
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([]);
  });

  test("the flex never takes a coach", () => {
    const squad = withStarter(validSquad(), "flex", coach("dk"));
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([{ rule: "wrongRole", slot: "flex", pickId: "dk" }]);
  });

  test("there is no bench coach", () => {
    const squad = validSquad();
    squad.bench = [squad.bench[0]!, coach("dk")];
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([{ rule: "wrongRole", slot: "bench", pickId: "dk" }]);
  });

  test("the coach slot takes only a team", () => {
    const squad = withStarter(validSquad(), "coach", player("peyz", "dk", "bot"));
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([{ rule: "wrongRole", slot: "coach", pickId: "peyz" }]);
  });

  test("a stand-in fills the slot of his listed role, whatever he plays on the day", () => {
    // The pick carries the roster's listed role; the role played in a game is never read here.
    const standIn = player("standin", "dk", "mid");
    expect(squadProblems(withStarter(validSquad(), "mid", standIn), REGULAR_SETTINGS)).toEqual([]);
    expect(squadProblems(withStarter(validSquad(), "jungle", standIn), REGULAR_SETTINGS)).toEqual([
      { rule: "wrongRole", slot: "jungle", pickId: "standin" },
    ]);
  });

  test("the coach counts toward the team cap: T1's coach and Faker fill T1", () => {
    const squad = withStarter(withStarter(validSquad(), "coach", coach("t1")), "mid", player("faker", "t1", "mid"));
    squad.bench = [player("bdd", "kt", "mid"), player("peyz", "dk", "bot")];
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([{ rule: "overTeamCap", teamId: "t1", cap: 2, actual: 4 }]);
  });

  test("with a cap of 3, three from one team is valid", () => {
    const squad = withStarter(validSquad(), "coach", coach("t1"));
    expect(squadProblems(squad, { ...REGULAR_SETTINGS, teamCap: 3 })).toEqual([]);
  });

  test("with no cap, any number from one team is valid", () => {
    const squad = withStarter(withStarter(validSquad(), "coach", coach("t1")), "mid", player("faker", "t1", "mid"));
    expect(squadProblems(squad, { ...REGULAR_SETTINGS, teamCap: null })).toEqual([]);
  });

  test("the coach pick is the team, so a new head coach leaves it valid", () => {
    // A coach pick holds only the team; who coaches it is read from the roster when shown.
    const squad = validSquad();
    const coachPick = squad.starters.find((s) => s.slot === "coach")!.pick;
    expect(coachPick).toEqual({ id: "kt", teamId: "kt", role: "coach" });
    expect(squadProblems(squad, REGULAR_SETTINGS)).toEqual([]);
  });

  test("the same player picked twice is refused", () => {
    const squad = validSquad();
    squad.bench = [squad.bench[0]!, player("ruler", "gen", "bot")];
    expect(squadProblems(squad, REGULAR_SETTINGS)).toContainEqual({ rule: "pickedTwice", pickId: "ruler" });
  });
});
