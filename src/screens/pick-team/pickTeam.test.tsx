// @vitest-environment node
import { expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { PICK_TEAM_DATA, PICK_TEAM_STATES, SAVED_TEAM, type PickPlayer } from "./fixtures";
import { ordinal } from "./format";
import { canSwap, changeCount, fitIds, pickReducer, type PickAction, type PickState } from "./model";
import { PickTeamView } from "./PickTeam";

const roleOf = (id: string) => (PICK_TEAM_DATA.players[id] as PickPlayer).role;
const reduce = pickReducer(roleOf);
const run = (state: PickState, ...actions: PickAction[]) => actions.reduce(reduce, state);
const view = (state: PickState) => <PickTeamView data={PICK_TEAM_DATA} state={state} dispatch={() => {}} />;

/** Fails unless every piece is in the text, each after the one before. */
function expectInOrder(out: string, pieces: string[]) {
  let at = 0;
  for (const piece of pieces) {
    const found = out.indexOf(piece, at);
    expect(found, `"${piece}" after position ${at}`).toBeGreaterThanOrEqual(0);
    at = found + piece.length;
  }
}

const SIDE_TAIL = [
  "Buffs",
  "Bench Boost",
  "Your bench scores too",
  "Dual Carry",
  "Vice-carry ×1.5 too",
  "Remake",
  "Unlimited transfers, kept",
  "Limitless",
  "One week, no budget or team cap",
  "This week's series",
  "your time · KST",
  "HLE v DK",
  "T1 v KT",
  "GEN v BRO",
  "NS v DNS",
  "KRX v BFX",
  "DK v KT",
  "T1 v GEN",
  "HLE v NS",
  "BRO v BFX",
  "KRX v DNS",
  "Sponsor",
  "All sponsors are made up.",
];

const FAKER_CARD = [
  "Faker",
  "T1 · Mid · 18.5억 0.5",
  "Form19.3 · 1st of 10 mids",
  "Owned46% · 1st",
  "Season58 · 2nd",
  "Last 3 weeks19 · 22 · 17",
  "Wed 10:30 19:30 KST",
  "v KT · Bo3",
  "Sat 08:00 17:00 KST",
  "v GEN · Bo3",
  "✓ Carry",
  "Make Vice-carry",
  "Swap with bench",
  "Full card ›",
];

test("Rift view, Faker tapped, no changes: the picture's content in its order", () => {
  const out = text(view(PICK_TEAM_STATES.rift));
  expectInOrder(out, [
    "Pick Team",
    "팀 선택",
    "LCK Cup Week 4",
    "Rift view",
    "Card view",
    "Zeusv DK · v NS",
    "Canyonv BRO · v T1",
    "Fakerv KT · v GEN",
    "Rulerv BRO · v T1",
    "Delightv DK · v NS",
    "Siwoov HLE · v KTNot startingFlex · plays Top",
    "kkOmav KT · v GENCoach 감독",
    "Bench",
    "1",
    "Bdd KTv T1 · v DK",
    "⇅ Swap",
    "2",
    "Cuzz KTv T1 · v DK",
    "No changes",
    "Deadline Wed 07:45 16:45 KST 9h 45m",
    "Save team",
    ...FAKER_CARD,
    ...SIDE_TAIL,
  ]);
  const markup = html(view(PICK_TEAM_STATES.rift));
  expect(markup).toContain('data-screen="pick-team"');
  expect(markup).toContain('title="Carry">C');
  expect(markup).toContain('title="Vice-carry">V');
  expect(markup.match(/tile--selected/g)).toHaveLength(1);
  expect(markup).toMatch(/main-action__key"[^>]*disabled/);
  expect(markup).not.toContain("Reset");
  expect(markup.match(/buff-card__play/g)).toHaveLength(2);
  expect(markup.match(/href="\/transfers"[^>]*class="link-go"|class="link-go"[^>]*href="\/transfers"/g)).toHaveLength(2);
  expect(markup).toContain('href="/player/faker"');
});

test("Card view: the seven starters as the broadcast lineup, the bench bar, then the bar", () => {
  const out = text(view(PICK_TEAM_STATES.cards));
  expectInOrder(out, [
    "Rift view",
    "Card view",
    "TopPhotoZeusHLEv DK · v NSForm 14.016.0억",
    "JunglePhotoCanyonGENv BRO · v T1Form 14.715.5억",
    "MidPhotoCFakerT1v KT · v GENForm 19.318.5억",
    "BotPhotoVRulerGENv BRO · v T1Form 15.317.0억",
    "SupportPhotoDelightHLEv DK · v NSForm 9.39.0억",
    "Flexplays TopPhotoNot startingSiwooDKv HLE · v KTForm 7.77.5억",
    "Coach감독",
    "kkOmaT1v KT · v GENForm 9.07.0억",
    "Bench",
    "Bdd",
    "⇅ Swap",
    "Cuzz",
    "No changes",
    "Save team",
    ...FAKER_CARD,
    ...SIDE_TAIL,
  ]);
  const markup = html(view(PICK_TEAM_STATES.cards));
  expect(markup.match(/class="pcard[ "]/g)).toHaveLength(7);
  expect(markup).toContain("pcard--selected");
  expect(markup).not.toContain("rift-map");
});

test("Mid-swap: Siwoo going out, both bench players fit, Bench Boost on and unsaved", () => {
  const out = text(view(PICK_TEAM_STATES.swap));
  expectInOrder(out, [
    "Siwoo",
    "Bench",
    "Bdd",
    "Cuzz",
    "1 change · Bench Boost on",
    "Reset",
    "Deadline Wed 07:45 16:45 KST 9h 45m",
    "Save team",
    "Siwoo",
    "DK · Flex · plays Top · 7.5억",
    "Not starting Wed",
    "Form7.7 · 7th of 10 tops",
    "Owned6% · 9th",
    "Season23 · 8th",
    "Last 3 weeks6 · 9 · 8",
    "Wed 08:00 17:00 KST",
    "v HLE · Bo3",
    "Fri 10:30 19:30 KST",
    "v KT · Bo3",
    "Make Carry",
    "Make Vice-carry",
    "Cancel swap",
    "Full card ›",
    "Bench Boost",
    "On · unsaved",
    "Cancel",
    "Dual Carry",
    "1 left",
    ...SIDE_TAIL.slice(SIDE_TAIL.indexOf("Remake")),
  ]);
  const markup = html(view(PICK_TEAM_STATES.swap));
  expect(markup.match(/bench-tile--fit/g)).toHaveLength(2);
  expect(markup.match(/tile--dim/g)).toHaveLength(6);
  expect(markup.match(/pick-team__key"[^>]*disabled/g)).toHaveLength(2);
  expect(markup).toContain("buff-card--on");
  expect(markup.match(/buff-card--off/g)).toHaveLength(3);
  expect(markup).not.toContain("buff-card__play");
  expect(markup).not.toMatch(/main-action__key"[^>]*disabled/);
});

test("the coach's card has no Carry or swap keys", () => {
  const out = text(view({ ...PICK_TEAM_STATES.rift, selected: "kkoma" }));
  expect(out).toContain("T1 · Coach · 7.0억");
  expect(out).not.toContain("Make Carry");
  expect(out).not.toContain("Swap with bench");
  expect(html(view({ ...PICK_TEAM_STATES.rift, selected: "kkoma" }))).toContain('href="/coach/kkoma"');
});

test("a swap brings on a bench player who fits: own role, or any role for the Flex", () => {
  expect(fitIds(SAVED_TEAM, "siwoo", roleOf)).toEqual(new Set(["bdd", "cuzz"]));
  expect(fitIds(SAVED_TEAM, "zeus", roleOf)).toEqual(new Set());
  expect(fitIds(SAVED_TEAM, "canyon", roleOf)).toEqual(new Set(["cuzz"]));
  const swapped = run(PICK_TEAM_STATES.rift, { type: "select", id: "canyon" }, { type: "startSwap", id: "canyon" }, { type: "swapIn", id: "bdd" });
  expect(swapped.draft.slots.jng).toBe("canyon");
  const done = run(swapped, { type: "swapIn", id: "cuzz" }, { type: "startSwap", id: "canyon" }, { type: "swapIn", id: "cuzz" });
  expect(done.draft.slots.jng).toBe("cuzz");
  expect(done.draft.slots.bench2).toBe("canyon");
  expect(done.swapping).toBeUndefined();
  expect(changeCount(done.saved, done.draft)).toBe(1);
});

test("the coach can't go to the bench; a Carry who does hands his C to the player coming on", () => {
  expect(canSwap(SAVED_TEAM, "kkoma")).toBe(false);
  expect(canSwap(SAVED_TEAM, "faker")).toBe(true);
  expect(run(PICK_TEAM_STATES.rift, { type: "startSwap", id: "kkoma" }).swapping).toBeUndefined();
  const s = run(PICK_TEAM_STATES.rift, { type: "startSwap", id: "faker" }, { type: "swapIn", id: "bdd" });
  expect([s.draft.slots.mid, s.draft.slots.bench1, s.draft.carry, s.draft.vice]).toEqual(["bdd", "faker", "bdd", "ruler"]);
  expect(changeCount(s.saved, s.draft)).toBe(1);
});

test("making the Vice-carry the Carry hands the old Carry the V, as FPL's armband", () => {
  const s = run(PICK_TEAM_STATES.rift, { type: "makeCarry", id: "ruler" });
  expect([s.draft.carry, s.draft.vice]).toEqual(["ruler", "faker"]);
  const t = run(PICK_TEAM_STATES.rift, { type: "makeVice", id: "zeus" });
  expect([t.draft.carry, t.draft.vice]).toEqual(["faker", "zeus"]);
  expect(run(PICK_TEAM_STATES.rift, { type: "makeCarry", id: "kkoma" }).draft.carry).toBe("faker");
});

test("⇅ Swap swaps bench 1 and 2; one buff a week; Reset drops the draft and Save keeps it", () => {
  const s = run(PICK_TEAM_STATES.rift, { type: "swapBench" }, { type: "playBuff", buff: "benchBoost" }, { type: "playBuff", buff: "dualCarry" });
  expect([s.draft.slots.bench1, s.draft.slots.bench2]).toEqual(["cuzz", "bdd"]);
  expect(s.draft.buff).toBe("benchBoost");
  expect(changeCount(s.saved, s.draft)).toBe(2);
  expect(run(s, { type: "reset" }).draft).toBe(SAVED_TEAM);
  const saved = run(s, { type: "save" });
  expect(changeCount(saved.saved, saved.draft)).toBe(0);
  expect(text(view(saved))).toContain("BuffsBench BoostYour bench scores tooOnCancel");
  expect(run(saved, { type: "cancelBuff" }).draft.buff).toBeUndefined();
});

test("Rift view | Card view sets the view; ✕ closes the card and ends the swap", () => {
  expect(run(PICK_TEAM_STATES.rift, { type: "view", view: "cards" }).view).toBe("cards");
  const closed = run(PICK_TEAM_STATES.swap, { type: "close" });
  expect([closed.selected, closed.swapping]).toEqual([undefined, undefined]);
  expect(text(view(closed))).not.toContain("Last 3 weeks");
});

test("ranks read as ordinals", () => {
  expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "101st"]);
});
