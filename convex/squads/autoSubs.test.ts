import { describe, expect, test } from "vitest";
import { autoSubs } from "./autoSubs";
import { bdd, chovy, ktCoach, player, playedExcept, ruler, validSquad, zeus } from "./fixtures";

const slotOf = (lineup: ReturnType<typeof autoSubs>["lineup"], slot: string) =>
  lineup.find((starter) => starter.slot === slot)?.pick.id;

const support = player("lehends", "ns", "support");
const top = player("doran", "t1", "top");

describe("autoSubs", () => {
  test("everyone played: no subs, the line-up is the starters", () => {
    const squad = validSquad();
    const result = autoSubs(squad, playedExcept(squad));
    expect(result.subs).toEqual([]);
    expect(result.lineup).toEqual(squad.starters);
  });

  test("a starter who played no game is replaced from the bench, in bench order", () => {
    // validSquad's bench is Bdd (mid) then Lucid (jungle); a mid out brings on Bdd.
    const squad = validSquad();
    const result = autoSubs(squad, playedExcept(squad, chovy));
    expect(result.subs).toEqual([{ slot: "mid", out: chovy, in: bdd }]);
    expect(slotOf(result.lineup, "mid")).toBe("bdd");
  });

  test("a bench player comes on only into his own role or the flex", () => {
    // Bench 1 a support, bench 2 a top laner: the top laner out brings on bench 2.
    const squad = { ...validSquad(), bench: [support, top] };
    const result = autoSubs(squad, playedExcept(squad, zeus));
    expect(result.subs).toEqual([{ slot: "top", out: zeus, in: top }]);
  });

  test("a flex starter out is replaced by the first bench player who played, whatever his role", () => {
    const squad = { ...validSquad(), bench: [support, top] };
    const result = autoSubs(squad, playedExcept(squad, ruler));
    expect(result.subs).toEqual([{ slot: "flex", out: ruler, in: support }]);
  });

  test("own role before the flex: mid and flex out with two mids on the bench", () => {
    const secondMid = player("showmaker", "dk", "mid");
    const squad = { ...validSquad(), bench: [bdd, secondMid] };
    const result = autoSubs(squad, playedExcept(squad, chovy, ruler));
    expect(result.subs).toEqual([
      { slot: "mid", out: chovy, in: bdd },
      { slot: "flex", out: ruler, in: secondMid },
    ]);
  });

  test("a bench player who also played no game is skipped and the next is tried", () => {
    const secondMid = player("showmaker", "dk", "mid");
    const squad = { ...validSquad(), bench: [bdd, secondMid] };
    const result = autoSubs(squad, playedExcept(squad, chovy, bdd));
    expect(result.subs).toEqual([{ slot: "mid", out: chovy, in: secondMid }]);
  });

  test("a bench player who fits no open slot stays on the bench", () => {
    // Bench 2 is Lucid, a jungler, so he can't replace a mid; Bdd sat out too.
    const squad = validSquad();
    const result = autoSubs(squad, playedExcept(squad, chovy, bdd));
    expect(result.subs).toEqual([]);
    expect(slotOf(result.lineup, "mid")).toBe("chovy");
  });

  test("a coach whose team has no series scores 0 and nobody replaces it", () => {
    const squad = validSquad();
    const result = autoSubs(squad, playedExcept(squad, ktCoach));
    expect(result.subs).toEqual([]);
    expect(slotOf(result.lineup, "coach")).toBe("kt");
  });

  test("the squad passed in is left as it was", () => {
    const squad = validSquad();
    autoSubs(squad, playedExcept(squad, chovy));
    expect(slotOf(squad.starters, "mid")).toBe("chovy");
  });
});
