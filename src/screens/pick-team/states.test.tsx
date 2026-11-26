// @vitest-environment node
// Pick Team's 18 Nov 2026 states (spec/01, The squad; spec/12, Pick Team and Transfers): a swap
// from the bench, Make Captain on starters only, and the bar's count.
import { expect, test } from "vitest";
import { expectInOrder, html, text } from "../../testing/render";
import { PICK_TEAM_DATA, PICK_TEAM_STATES, SAVED_TEAM, type PickPlayer } from "./fixtures";
import { changeCount, pickReducer, type PickAction, type PickState } from "./model";
import { PickTeamView } from "./PickTeam";

const reduce = pickReducer((id) => (PICK_TEAM_DATA.players[id] as PickPlayer).role);
const run = (state: PickState, ...actions: PickAction[]) => actions.reduce(reduce, state);
const view = (state: PickState) => <PickTeamView data={PICK_TEAM_DATA} state={state} dispatch={() => {}} />;
const NONE_TAPPED: PickState = { ...PICK_TEAM_STATES.rift, selected: undefined };

test("a swap can start from the bench: tap Bdd, then Faker lit, and they trade places (spec/01)", () => {
  const tapped = run(NONE_TAPPED, { type: "select", id: "bdd" });
  expect(html(view(tapped))).toMatch(/class="tile tile--fit"(?:(?!class="tile[ "]).)*title="Faker"/);
  const s = run(tapped, { type: "select", id: "faker" });
  expect([s.draft.slots.mid, s.draft.slots.bench1, s.draft.captain, s.selected]).toEqual(["bdd", "faker", "bdd", undefined]);
  expect(changeCount(s.saved, s.draft)).toBe(1);
});

test("mid-swap in Card view (1440-cards.png): the tapped card solid, those he can swap with dashed, the rest dimmed", () => {
  const cards = (state: PickState) => html(view(state)).match(/class="pcard(?: [^"]*)?"/g) ?? [];
  // Faker tapped: Bdd, the bench Mid, the one he can swap with (spec/01).
  const faker = cards(PICK_TEAM_STATES.cards);
  expect(faker.filter((c) => c.includes("pcard--selected"))).toHaveLength(1);
  expect(faker[7]).toContain("pcard--fit");
  expect(faker.filter((c) => c.includes("pcard--dim"))).toHaveLength(7);
  // A bench player tapped lights the other: the two swap order (spec/01).
  const bench = cards({ ...PICK_TEAM_STATES.cards, selected: "cuzz" });
  expect(bench[7]).toContain("pcard--fit");
  expect(bench[8]).toContain("pcard--selected");
});

test("mid-swap in Rift view (1440-swap.png): Siwoo, the Flex, tapped; Zeus and both bench players lit; Bench Boost unsaved counts", () => {
  const out = html(view(PICK_TEAM_STATES.swap));
  expect(out.match(/tile--fit/g)).toHaveLength(3);
  expect(out.match(/tile--selected/g)).toHaveLength(1);
  expect(out.match(/tile--dim/g)).toHaveLength(5);
  expectInOrder(text(view(PICK_TEAM_STATES.swap)), ["1 change", "Reset", "Save team"]);
  expect(out).not.toMatch(/main-action__key[^"]*"[^>]*disabled/);
});

test("Make Captain shows only on a starter: a bench player's card has none; one not starting this week can be Captain, his card saying so", () => {
  const bench = text(view({ ...NONE_TAPPED, selected: "bdd" }));
  expect(bench).toContain("Full card ›");
  expect(bench).not.toContain("Make Captain");
  expect(run(NONE_TAPPED, { type: "makeCaptain", id: "bdd" }).draft.captain).toBe("faker");
  const siwoo = run({ ...NONE_TAPPED, selected: "siwoo" }, { type: "makeCaptain", id: "siwoo" });
  expect(siwoo.draft.captain).toBe("siwoo");
  expectInOrder(text(view(siwoo)), ["Siwoo", "Not starting Wed", "✓ Captain"]);
});

test("the bar counts each swap, new Captain and buff as one; anything put back as saved counts none (spec/12)", () => {
  // Canyon to the bench, Ruler made Captain, Bench Boost: 3 changes.
  const s = run(NONE_TAPPED, { type: "select", id: "canyon" }, { type: "select", id: "cuzz" }, { type: "makeCaptain", id: "ruler" }, { type: "playBuff", buff: "benchBoost" });
  expect(changeCount(s.saved, s.draft)).toBe(3);
  expect(text(view(s))).toContain("3 changes");
  // Each put back: the swap undone, the C back on Faker, the buff cancelled.
  const back = run(s, { type: "select", id: "cuzz" }, { type: "select", id: "canyon" }, { type: "makeCaptain", id: "faker" }, { type: "cancelBuff" });
  expect(back.draft).toEqual(SAVED_TEAM);
  expect(changeCount(back.saved, back.draft)).toBe(0);
  expect(text(view(back))).toContain("No changes");
});
