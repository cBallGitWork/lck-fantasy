// @vitest-environment node
import { expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { PICK_TEAM_DATA, PICK_TEAM_STATES, SAVED_TEAM, type PickPlayer } from "./fixtures";
import { ordinal } from "../../parts";
import { changeCount, pickReducer, swapIds, type PickAction, type PickState } from "./model";
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

/** The buffs, in one row above the Rift. */
const BUFFS = [
  "Bench Boost",
  "Your bench players score this week too",
  "Dual Carry",
  "Your Vice-carry scores ×1.5 too",
  "Remake",
  "Unlimited free transfers; your new squad stays",
  "Limitless",
  "One week, no budget or team cap; then your squad returns",
];

const SIDE_TAIL = [
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
  "T1 · Mid · ₩18.5m 0.5",
  "Form19.3 · 1st of 10 mids",
  "Owned46% · 1st",
  "Season58 · 2nd",
  "Last 3 series10 · 12 · 10",
  "✓ Carry",
  "Make Vice-carry",
  "Full card ›",
];

test("Rift view, Faker tapped, no changes: the picture's content in its order", () => {
  const out = text(view(PICK_TEAM_STATES.rift));
  expectInOrder(out, [
    "Pick Team",
    "팀 선택",
    "LCK Cup Week 4",
    ...BUFFS,
    "Rift view",
    "Card view",
    "Zeusv DK, NS",
    "Canyonv BRO, T1",
    "Fakerv KT, GEN",
    "Rulerv BRO, T1",
    "Delightv DK, NS",
    "FlexDK!Siwoov HLE, KT",
    "Coach 감독T1kkOmav KT, GEN",
    "Bench",
    "1. Mid",
    "KTBddv T1, DK",
    "2. Jungle",
    "KTCuzzv T1, DK",
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
  // Faker tapped: Bdd, the bench mid, is lit to swap with him; the Flex plays Top, so isn't; the other six starters and Cuzz dim.
  expect(markup.match(/tile--bench tile--fit/g)).toHaveLength(1);
  expect(markup.match(/tile--dim/g)).toHaveLength(7);
  // His news is a flag at his shirt's corner, the word in his card; the Flex and Coach are labelled over the shirt, nothing under (Craig, 16 Nov 2026).
  expect(markup.match(/class="tile__flag" role="img" aria-label="Not starting"/g)).toHaveLength(1);
  expect(markup.match(/class="tile__slot/g)).toHaveLength(2);
  expect(markup).not.toContain("plays Top</div>");
  // His card shows T1's crest; the Rift's tiles and the bench show none (Craig, 16 Nov 2026).
  expect(markup.match(/alt="T1 crest"/g)).toHaveLength(1);
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
    "TopPhotoZeusHLEv DK, NSForm 16.0₩14.0m",
    "JunglePhotoCanyonGENv BRO, T1Form 16.7₩15.5m",
    "MidPhotoCFakerT1v KT, GENForm 19.3₩18.5m",
    "BotPhotoVRulerGENv BRO, T1Form 18.7₩16.0m",
    "SupportPhotoDelightHLEv DK, NSForm 12.7₩10.0m",
    "Flexplays TopPhotoNot startingSiwooDKv HLE, KTForm 11.7₩11.5m",
    "Coach감독",
    "kkOmaT1v KT, GENForm 9.0₩7.0m",
    "Bench",
    "Bdd",
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

test("Siwoo, the Flex, tapped: Zeus and both bench players lit, Bench Boost on and unsaved", () => {
  const out = text(view(PICK_TEAM_STATES.swap));
  expectInOrder(out, [
    "Bench Boost",
    "On · unsaved",
    "Cancel",
    "Dual Carry",
    "1 left",
    "Remake",
    "Siwoo",
    "Bench",
    "Bdd",
    "Cuzz",
    "1 change",
    "Reset",
    "Deadline Wed 07:45 16:45 KST 9h 45m",
    "Save team",
    "Siwoo",
    "DK · Flex · plays Top · ₩11.5m",
    "Not starting Wed",
    "Form11.7 · 7th of 10 tops",
    "Owned12% · 9th",
    "Season35 · 8th",
    "Last 3 series6 · 5 · 4",
    "Make Carry",
    "Make Vice-carry",
    "Full card ›",
    ...SIDE_TAIL,
  ]);
  // The buff's card says it is on, so the bar gives only the count; his series are on his tile, not his card.
  expect(out).toContain("1 changeReset");
  expect(out).not.toContain("Bench Boost on");
  expect(out).not.toContain("Bo3");
  const markup = html(view(PICK_TEAM_STATES.swap));
  expect(markup.match(/tile--bench tile--fit/g)).toHaveLength(2);
  expect(markup.match(/"tile tile--fit"/g)).toHaveLength(1);
  expect(markup.match(/tile--dim/g)).toHaveLength(5);
  expect(markup).toContain("buff-card--on");
  expect(markup.match(/buff-card--off/g)).toHaveLength(3);
  expect(markup).not.toContain("buff-card__play");
  expect(markup).not.toMatch(/main-action__key"[^>]*disabled/);
});

test("the coach's card has no Carry or swap keys", () => {
  const out = text(view({ ...PICK_TEAM_STATES.rift, selected: "kkoma" }));
  expect(out).toContain("T1 · Coach · ₩7.0m");
  expect(out).not.toContain("Make Carry");
  // He can swap with nobody, so nothing lights or dims.
  expect(html(view({ ...PICK_TEAM_STATES.rift, selected: "kkoma" }))).not.toMatch(/tile--(fit|dim)/);
  expect(html(view({ ...PICK_TEAM_STATES.rift, selected: "kkoma" }))).toContain('href="/coach/kkoma"');
});

test("tap a player, then one lit up, and they swap: a role starter with the bench or a Flex of his role", () => {
  expect(swapIds(SAVED_TEAM, "faker", roleOf)).toEqual(new Set(["bdd"]));
  expect(swapIds(SAVED_TEAM, "canyon", roleOf)).toEqual(new Set(["cuzz"]));
  expect(swapIds(SAVED_TEAM, "zeus", roleOf)).toEqual(new Set(["siwoo"]));
  expect(swapIds(SAVED_TEAM, "siwoo", roleOf)).toEqual(new Set(["zeus", "bdd", "cuzz"]));
  expect(swapIds(SAVED_TEAM, "bdd", roleOf)).toEqual(new Set(["faker", "siwoo", "cuzz"]));
  expect(swapIds(SAVED_TEAM, "kkoma", roleOf)).toEqual(new Set());
  // One tap each: Canyon, then Cuzz.
  const done = run(PICK_TEAM_STATES.rift, { type: "select", id: "canyon" }, { type: "select", id: "cuzz" });
  expect([done.draft.slots.jng, done.draft.slots.bench2, done.selected]).toEqual(["cuzz", "canyon", undefined]);
  expect(changeCount(done.saved, done.draft)).toBe(1);
  // A tap on one not lit picks him instead; a second tap on the same lets go.
  const picked = run(PICK_TEAM_STATES.rift, { type: "select", id: "canyon" }, { type: "select", id: "faker" });
  expect([picked.draft, picked.selected]).toEqual([SAVED_TEAM, "faker"]);
  expect(run(picked, { type: "select", id: "faker" }).selected).toBeUndefined();
});

test("Zeus and the Flex swap places, the V staying with Zeus: the swap and the V counted once each", () => {
  const s = run({ ...PICK_TEAM_STATES.rift, selected: undefined }, { type: "makeVice", id: "zeus" }, { type: "select", id: "zeus" }, { type: "select", id: "siwoo" });
  expect([s.draft.slots.top, s.draft.slots.flex, s.draft.vice]).toEqual(["siwoo", "zeus", "zeus"]);
  expect(changeCount(s.saved, s.draft)).toBe(2);
  expect(text(view({ ...s, selected: undefined }))).toContain("FlexHLEVZeusv DK, NS");
});

test("the coach can't swap; a Carry going to the bench hands his C to the player coming on", () => {
  const s = run(PICK_TEAM_STATES.rift, { type: "select", id: "bdd" });
  expect([s.draft.slots.mid, s.draft.slots.bench1, s.draft.carry, s.draft.vice]).toEqual(["bdd", "faker", "bdd", "ruler"]);
  expect(changeCount(s.saved, s.draft)).toBe(1);
  expect(run({ ...PICK_TEAM_STATES.rift, selected: "kkoma" }, { type: "select", id: "bdd" }).draft).toBe(SAVED_TEAM);
});

test("with Dual Carry played the V is gold as the C", () => {
  const plain = html(view(PICK_TEAM_STATES.rift));
  expect(plain).toContain('mark-badge--v tile__mark"');
  const dual = run(PICK_TEAM_STATES.rift, { type: "playBuff", buff: "dualCarry" });
  expect(html(view(dual))).not.toContain("mark-badge--v");
  expect(html(view({ ...dual, view: "cards" }))).not.toContain("mark-badge--v");
});

test("making the Vice-carry the Carry hands the old Carry the V, as FPL's armband", () => {
  const s = run(PICK_TEAM_STATES.rift, { type: "makeCarry", id: "ruler" });
  expect([s.draft.carry, s.draft.vice]).toEqual(["ruler", "faker"]);
  const t = run(PICK_TEAM_STATES.rift, { type: "makeVice", id: "zeus" });
  expect([t.draft.carry, t.draft.vice]).toEqual(["faker", "zeus"]);
  expect(run(PICK_TEAM_STATES.rift, { type: "makeCarry", id: "kkoma" }).draft.carry).toBe("faker");
});

test("tapping one bench player then the other swaps bench 1 and 2, as FPL; one buff a week; Reset drops the draft and Save keeps it", () => {
  const s = run(PICK_TEAM_STATES.rift, { type: "select", id: "faker" }, { type: "select", id: "bdd" }, { type: "select", id: "cuzz" }, { type: "playBuff", buff: "benchBoost" }, { type: "playBuff", buff: "dualCarry" });
  expect([s.draft.slots.bench1, s.draft.slots.bench2]).toEqual(["cuzz", "bdd"]);
  expect(s.draft.buff).toBe("benchBoost");
  expect(changeCount(s.saved, s.draft)).toBe(2);
  expect(run(s, { type: "reset" }).draft).toBe(SAVED_TEAM);
  const saved = run(s, { type: "save" });
  expect(changeCount(saved.saved, saved.draft)).toBe(0);
  expect(text(view(saved))).toContain("Bench BoostYour bench players score this week tooOnCancel");
  expect(run(saved, { type: "cancelBuff" }).draft.buff).toBeUndefined();
});

test("Rift view | Card view sets the view; ✕ closes the card and ends the swap", () => {
  expect(run(PICK_TEAM_STATES.rift, { type: "view", view: "cards" }).view).toBe("cards");
  const closed = run(PICK_TEAM_STATES.swap, { type: "close" });
  expect(closed.selected).toBeUndefined();
  expect(text(view(closed))).not.toContain("Last 3 series");
  expect(html(view(closed))).not.toMatch(/tile--(fit|dim)/);
});

test("ranks read as ordinals", () => {
  expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "101st"]);
});
