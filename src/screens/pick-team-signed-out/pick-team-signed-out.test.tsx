// @vitest-environment node
import { describe, expect, test } from "vitest";
import { budgetProblems } from "../../../convex/squads/budget";
import { squadProblems } from "../../../convex/squads/squad";
import { COUNTRIES } from "../../fixtures/managers";
import { PATHS } from "../../paths";
import { expectInOrder, html, htmlAt, noop, text } from "../../testing/render";
import { NAME_MAX, NEXT, PART_SQUAD, PLAYERS, RULES, TEAMS, WEEK } from "./fixtures";
import { FrontDoor, type FrontDoorProps } from "./FrontDoor";
import { listed } from "./PlayerList";
import { add, autoFilled, bankOf, countryFrom, EMPTY_SQUAD, holders, leftToPick, pricesOf, removeAt, saveBlock, teamCapLine, unpicked, type GuestPlayer } from "./pick";
import { canSaveTeam, SignUpStepOne, SignUpStepTwo, type SignUpAnswers } from "./SignUp";
import { joinedCheer } from "./words";

const props: FrontDoorProps = {
  ...WEEK,
  players: PLAYERS,
  rules: RULES,
  next: NEXT,
  teams: TEAMS,
  countries: COUNTRIES,
  country: "United Kingdom",
  nameMax: NAME_MAX,
  initialSquad: EMPTY_SQUAD,
  onSave: noop,
};

const player = (name: string): GuestPlayer => PLAYERS.find((p) => p.name === name)!;

/** A seeded random in [0, 1), so a test's Auto-fill is the same each run. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2 ** 31;
    return state / 2 ** 31;
  };
}

describe("a new visitor lands on the front door (spec/09, Picking as a guest)", () => {
  test("the empty squad: 0 of 9, the whole budget, Auto-fill, Save team off with 9 to pick", () => {
    const out = text(<FrontDoor {...props} />);
    expectInOrder(out, [
      "Stats",
      "LCK",
      "Log in ›",
      "Pick your squad",
      "스쿼드 선택",
      "Split 1 Week 4 · Deadline Wed 7:45am",
      "Picked 0 / 9",
      "Bank ₩100.0m",
      "Team cap 0 / 2",
      "Rift view",
      "List view",
      "Auto-fill",
      "Top",
      "Bench",
      "Any role",
      "9 to pick",
      "Save team",
      "Players",
      "All roles",
    ]);
    expect(out).not.toContain("Reset");
    expect(out).not.toContain("Pick Team");
    expect(html(<FrontDoor {...props} />)).toMatch(/disabled="">Save team/);
  });

  test("the part-picked picture: Reset beside Auto-fill, the team cap, 5 to pick, the picked not in the list", () => {
    const out = text(<FrontDoor {...props} initialSquad={PART_SQUAD} />);
    expectInOrder(out, ["Picked 4 / 9", "Bank ₩44.5m", "Team cap T1 2 / 2", "Reset", "Auto-fill", "₩14.0m", "Zeus", "5 to pick"]);
    expect(listed(unpicked(PART_SQUAD, PLAYERS), { role: null, search: "", team: null, sort: "points" }).map((p) => p.name)).not.toContain("Faker");
  });

  test("the front door is at /create-team, with the visitor's top bar", async () => {
    const out = await htmlAt(PATHS.createTeam);
    expect(out).toContain('data-screen="pick-team-signed-out"');
    expect(out).toContain(">Log in ›<");
    expect(out).not.toContain(">Transfers<");
  });
});

describe("picking", () => {
  test("a pick goes to his role's slot, then the Flex, then the bench", () => {
    let squad = EMPTY_SQUAD;
    for (const name of ["Chovy", "Faker", "ShowMaker"]) {
      const done = add(squad, player(name), RULES.squad);
      if ("refused" in done) throw new Error(done.refused);
      squad = done.squad;
    }
    expect(squad.starters.map((s) => [s.slot, s.pick.id])).toEqual([["mid", "Chovy"], ["flex", "Faker"]]);
    expect(squad.bench.map((p) => p.id)).toEqual(["ShowMaker"]);
  });

  test("past the team cap the pick is refused, saying why", () => {
    expect(add(PART_SQUAD, player("Keria"), RULES.squad)).toEqual({ refused: "Team full: 2 from T1" });
  });

  test("one coach only", () => {
    expect(add(PART_SQUAD, player("Ryu"), RULES.squad)).toEqual({ refused: "One coach only. Remove yours first" });
  });

  test("× empties a place; Reset empties them all", () => {
    expect(leftToPick(removeAt(PART_SQUAD, "top"), RULES.squad)).toBe(6);
    expect(leftToPick(EMPTY_SQUAD, RULES.squad)).toBe(9);
  });
});

describe("Auto-fill (spec/09)", () => {
  test("fills the empty places with a valid squad under budget, keeping the guest's picks", () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const squad = autoFilled(PART_SQUAD, PLAYERS, RULES, seeded(seed));
      expect(squadProblems(squad, RULES.squad)).toEqual([]);
      expect(budgetProblems(squad, pricesOf(PLAYERS), RULES.budget)).toEqual([]);
      expect(squad.starters).toEqual(expect.arrayContaining(PART_SQUAD.starters));
      expect(saveBlock(squad, PLAYERS, RULES)).toBeUndefined();
    }
  });

  test("off once all nine are picked", () => {
    const full = autoFilled(EMPTY_SQUAD, PLAYERS, RULES, seeded(7));
    expect(html(<FrontDoor {...props} initialSquad={full} />)).toMatch(/disabled="">Auto-fill/);
  });
});

describe("the Save team bar (spec/09, Signing up)", () => {
  test("says how many are left, or by how much it is over at today's prices", () => {
    expect(saveBlock(PART_SQUAD, PLAYERS, RULES)).toBe("5 to pick");
    const full = autoFilled(EMPTY_SQUAD, PLAYERS, RULES, seeded(3));
    const left = bankOf(full, PLAYERS, RULES.budget)!;
    // Since the pick, a deadline put the bank and 0.3m more on his top.
    const top = holders(full, PLAYERS).top!;
    const dearer = PLAYERS.map((p) => (p === top ? { ...p, priceWon: p.priceWon + left + 300_000 } : p));
    expect(saveBlock(full, dearer, RULES)).toBe("₩0.3m over");
  });

  test("the Team cap figure names the team at the most", () => {
    expect(teamCapLine(EMPTY_SQUAD, 2)).toBe("0 / 2");
    expect(teamCapLine(PART_SQUAD, 2)).toBe("T1 2 / 2");
  });
});

describe("the sign-up sheets", () => {
  const ANSWERS: SignUpAnswers = { teamName: "Baron Steal FC", favouriteTeam: null, country: "United Kingdom", ticked: false };
  const step2 = (answers = ANSWERS) =>
    html(<SignUpStepTwo answers={answers} onChange={noop} countries={COUNTRIES} nameMax={NAME_MAX} deadline={WEEK.deadline} onBack={noop} onSave={noop} onClose={noop} />);

  test("step 1 offers Google and Discord, and stores no password", () => {
    expectInOrder(text(<SignUpStepOne onContinue={noop} onClose={noop} />), [
      "Save your team",
      "1 of 2",
      "Your squad of 9 is kept while you sign up.",
      "GContinue with Google",
      "DContinue with Discord",
      "No password is stored.",
    ]);
  });

  test("step 2 asks name, team and country, says when they lock, and holds Save team until a name, a team and the tick", () => {
    expectInOrder(step2(), [
      "Your team",
      "2 of 2",
      "Team name",
      'value="Baron Steal FC"',
      "14/20",
      "Favourite team",
      "Choose a team",
      "Country",
      'value="United Kingdom" selected',
      "Both lock at your first deadline:",
      "Wed 7:45am",
      "I&#x27;m 16 or over and accept the",
      'href="/terms"',
      'href="/privacy"',
      "Back",
      "Save team",
    ]);
    expect(step2()).toMatch(/disabled="">Save team/);
    expect(step2({ ...ANSWERS, favouriteTeam: "T1", ticked: true })).not.toMatch(/disabled="">Save team/);
  });

  test("spaces alone are no name; a team, a country and the tick are needed too", () => {
    const ready = { ...ANSWERS, favouriteTeam: "T1" as const, ticked: true };
    expect(canSaveTeam(ready)).toBe(true);
    expect(canSaveTeam({ ...ready, teamName: "   " })).toBe(false);
    expect(canSaveTeam({ ...ready, favouriteTeam: null })).toBe(false);
    expect(canSaveTeam({ ...ready, country: "" })).toBe(false);
    expect(canSaveTeam({ ...ready, ticked: false })).toBe(false);
  });

  test("Save team cheers the new team by its name", () => {
    expect(joinedCheer("  Baron Steal FC ")).toBe("Baron Steal FC is in. 화이팅!");
  });

  test("country is filled in from where the visitor is, when it is offered", () => {
    expect(countryFrom("en-GB", COUNTRIES)).toBe("United Kingdom");
    expect(countryFrom("ko", COUNTRIES)).toBe("South Korea");
    expect(countryFrom("pt-BR", COUNTRIES)).toBe("");
    expect(countryFrom(undefined, COUNTRIES)).toBe("");
  });
});
