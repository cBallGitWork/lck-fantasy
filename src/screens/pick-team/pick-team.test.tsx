// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { VIEW_KEYS } from "../../parts";
import { PATHS, pickTeamSwapping } from "../../paths";
import { expectInOrder, hovers, html, htmlAt, text } from "../../testing/render";
import { blockedStorage, chosenView, keptStorage, stubStorage } from "../../testing/storage";
import { PICK_TEAM_DATA, PICK_TEAM_STATES, SAVED_TEAM, type PickPlayer } from "./fixtures";
import { changeCount, pickNews, pickReducer, swapIds, type PickAction, type PickState } from "./model";
import { PickTeamView } from "./PickTeam";

const roleOf = (id: string) => (PICK_TEAM_DATA.players[id] as PickPlayer).role;
const reduce = pickReducer(roleOf);
const run = (state: PickState, ...actions: PickAction[]) => actions.reduce(reduce, state);
const view = (state: PickState) => <PickTeamView data={PICK_TEAM_DATA} state={state} dispatch={() => {}} />;

/** The buffs, each its name, state and key; what it does is its hover. */
const BUFFS = ["Buffs", "Bench Boost", "Available", "Play", "Double Captain", "Available", "Play", "Coach Diff", "Available", "Play"];

const SIDE_TAIL = [
  "This week's series",
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
  "Among 10 mids",
  "Form19.31st",
  "Owned46%1st",
  "Season582nd",
  "Last 3 series101210",
  "✓ Captain",
  "Full card ›",
];

test("Rift view, Faker tapped, no changes: the picture's content in its order", () => {
  const out = text(view(PICK_TEAM_STATES.rift));
  expectInOrder(out, [
    "Pick Team",
    "팀 선택",
    "Split 1 Week 4",
    "Deadline Wed 07:45 9h 45m",
    "Rift view",
    "Card view",
    ...BUFFS,
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
    "Reset",
    "Save team",
    ...FAKER_CARD,
    ...SIDE_TAIL,
  ]);
  const markup = html(view(PICK_TEAM_STATES.rift));
  // The Rift at the left, the buffs, bench and Save in the column beside it; the card and the series are panels.
  expect(markup).toContain('class="pick-team__object pick-team__object--rift"');
  expect(markup.match(/class="panel /g)).toHaveLength(4);
  expect(markup).toContain('data-screen="pick-team"');
  expect(markup).toContain('aria-label="Captain">C');
  expect(markup.match(/class="mark-badge /g)).toHaveLength(1);
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
  expect(markup).toMatch(/main-action__key[^"]*"[^>]*disabled/);
  expect(markup).toContain('class="pick-team__reset key-bare hover-line pick-team__reset--idle"');
  // All three buffs play here, each with its line as its hover and no count; none links to Transfers (spec/06).
  expect(markup.match(/aria-label="Play /g)).toHaveLength(3);
  expect(hovers(markup)).toContainEqual(["Coach Diff", "Your coach scores ×3 this week"]);
  expect(out).not.toMatch(/\d left/);
  expect(markup).not.toMatch(/class="link-go[^"]*" href="\/transfers"/);
  expect(markup).toContain('href="/player/faker"');
});

test("Card view: the buffs, the seven starters as the broadcast lineup, the bench, then Save", () => {
  const out = text(view(PICK_TEAM_STATES.cards));
  expectInOrder(out, [
    "Rift view",
    "Card view",
    ...BUFFS,
    "TopZeusHLEv DK, NSForm 16.0₩14.0m",
    "JungleCanyonGENv BRO, T1Form 16.7₩15.5m",
    "MidCFakerT1v KT, GENForm 19.3₩18.5m",
    "BotRulerGENv BRO, T1Form 18.7₩16.0m",
    "SupportDelightHLEv DK, NSForm 12.7₩10.0m",
    "Flexplays TopNot startingSiwooDKv HLE, KTForm 11.7₩11.5m",
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

test("Save sticks to the foot only on a phone, over the Rift's tiles and under a menu; on a desk nothing hides under it", () => {
  const css = readFileSync(join(import.meta.dirname, "pick-team.css"), "utf8");
  const rule = (source: string, selector: string) => source.match(new RegExp(`\\${selector} \\{([^}]*)\\}`))?.[1] ?? "";
  const zIndex = (block: string) => Number(block.match(/z-index: (\d+);/)?.[1]);
  const [desk, phone = ""] = css.split("@media (max-width: 600px)");
  expect(desk).not.toContain("sticky");
  const save = rule(phone, ".pick-team__save");
  expect(save).toContain("position: sticky;");
  expect(save).toContain("bottom: 0;");
  const other = (path: string) => readFileSync(join(import.meta.dirname, path), "utf8");
  expect(zIndex(save)).toBeGreaterThan(zIndex(rule(other("../../rift/Tile.css"), ".tile")));
  expect(zIndex(save)).toBeLessThan(zIndex(rule(other("../../parts/controls/Menu.css"), ".menu__list")));
});

test("Siwoo, the Flex, tapped: Zeus and both bench players lit, Bench Boost on and unsaved", () => {
  const out = text(view(PICK_TEAM_STATES.swap));
  expectInOrder(out, [
    "Bench Boost",
    "On this week",
    "Cancel",
    "Double Captain",
    "Unavailable",
    "Coach Diff",
    "Unavailable",
    "Siwoo",
    "Bench",
    "Bdd",
    "Cuzz",
    "1 change",
    "Reset",
    "Save team",
    "Siwoo",
    "DK · Flex · plays Top · ₩11.5m",
    "Not starting Wed",
    "Among 10 tops",
    "Form11.77th",
    "Owned12%9th",
    "Season358th",
    "Last 3 series654",
    "Make Captain",
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
  expect(markup.match(/buff-card--unavailable/g)).toHaveLength(2);
  expect(markup).not.toContain('aria-label="Play ');
  expect(markup).toContain('aria-label="Cancel Bench Boost"');
  expect(markup).not.toMatch(/main-action__key[^"]*"[^>]*disabled/);
});

test("the coach's card has no Captain or swap keys", () => {
  const out = text(view({ ...PICK_TEAM_STATES.rift, selected: "kkoma" }));
  expect(out).toContain("T1 · Coach · ₩7.0m");
  expect(out).not.toContain("Make Captain");
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

test("Zeus and the Flex swap places, the C staying with Zeus: the swap and the C counted once each", () => {
  const s = run({ ...PICK_TEAM_STATES.rift, selected: undefined }, { type: "makeCaptain", id: "zeus" }, { type: "select", id: "zeus" }, { type: "select", id: "siwoo" });
  expect([s.draft.slots.top, s.draft.slots.flex, s.draft.captain]).toEqual(["siwoo", "zeus", "zeus"]);
  expect(changeCount(s.saved, s.draft)).toBe(2);
  expect(text(view({ ...s, selected: undefined }))).toContain("FlexHLECZeusv DK, NS");
});

test("the coach can't swap; a Captain going to the bench hands his C to the player coming on", () => {
  const s = run(PICK_TEAM_STATES.rift, { type: "select", id: "bdd" });
  expect([s.draft.slots.mid, s.draft.slots.bench1, s.draft.captain]).toEqual(["bdd", "faker", "bdd"]);
  expect(changeCount(s.saved, s.draft)).toBe(1);
  expect(run({ ...PICK_TEAM_STATES.rift, selected: "kkoma" }, { type: "select", id: "bdd" }).draft).toBe(SAVED_TEAM);
});

test("Make Captain moves the one C, never to the coach; the old Captain is left with no mark", () => {
  const s = run(PICK_TEAM_STATES.rift, { type: "makeCaptain", id: "ruler" });
  expect(s.draft).toEqual({ ...SAVED_TEAM, captain: "ruler" });
  expect(changeCount(s.saved, s.draft)).toBe(1);
  expect(html(view({ ...s, view: "cards" })).match(/class="mark-badge /g)).toHaveLength(1);
  expect(run(PICK_TEAM_STATES.rift, { type: "makeCaptain", id: "kkoma" }).draft.captain).toBe("faker");
});

test("the live region says Saved on a save and the new Captain on Make Captain; nothing else", () => {
  const nameOf = (id: string) => (PICK_TEAM_DATA.players[id] as PickPlayer).name;
  const news = (action: PickAction, state = PICK_TEAM_STATES.rift) => pickNews(action, state, reduce(state, action), nameOf);
  expect(news({ type: "save" })).toBe("Saved");
  expect(news({ type: "makeCaptain", id: "ruler" })).toBe("Ruler is your Captain");
  expect(news({ type: "makeCaptain", id: "faker" })).toBeUndefined();
  expect(news({ type: "view", view: "cards" })).toBeUndefined();
});

test("each buff is a heading under the Buffs panel's, and Play names its buff; one played in an earlier week says which", () => {
  const out = html(view(PICK_TEAM_STATES.rift));
  expect(out).toContain('<h2 class="panel__title">Buffs</h2>');
  expect(out).toMatch(/<h3 class="buff-card__name"><span class="hint"[^>]*>Bench Boost/);
  expect(out).toContain('aria-label="Play Double Captain"');
  const played = { ...PICK_TEAM_DATA, buffs: PICK_TEAM_DATA.buffs.map((b) => (b.here === "benchBoost" ? { ...b, playedWeek: 2 } : b)) };
  const page = text(<PickTeamView data={played} state={PICK_TEAM_STATES.rift} dispatch={() => {}} />);
  expectInOrder(page, ["Bench Boost", "Played Week 2", "Double Captain", "Available", "Play"]);
  expect(page).not.toContain("Played Week 2Play");
});

test("tapping one bench player then the other swaps bench 1 and 2, as FPL; one buff a week; Reset drops the draft and Save keeps it", () => {
  const s = run(PICK_TEAM_STATES.rift, { type: "select", id: "faker" }, { type: "select", id: "bdd" }, { type: "select", id: "cuzz" }, { type: "playBuff", buff: "benchBoost" }, { type: "playBuff", buff: "doubleCaptain" });
  expect([s.draft.slots.bench1, s.draft.slots.bench2]).toEqual(["cuzz", "bdd"]);
  expect(s.draft.buff).toBe("benchBoost");
  expect(changeCount(s.saved, s.draft)).toBe(2);
  expect(run(s, { type: "reset" }).draft).toBe(SAVED_TEAM);
  const saved = run(s, { type: "save" });
  expect(changeCount(saved.saved, saved.draft)).toBe(0);
  expect(text(view(saved))).toContain("Bench BoostOn this weekCancel");
  expect(run(saved, { type: "cancelBuff" }).draft.buff).toBeUndefined();
});

test("Rift view | Card view sets the view; ✕ closes the card and ends the swap", () => {
  expect(run(PICK_TEAM_STATES.rift, { type: "view", view: "cards" }).view).toBe("cards");
  const closed = run(PICK_TEAM_STATES.swap, { type: "close" });
  expect(closed.selected).toBeUndefined();
  expect(text(view(closed))).not.toContain("Last 3 series");
  expect(html(view(closed))).not.toMatch(/tile--(fit|dim)/);
});

test("arriving from a card's Swap with bench, the player is tapped and those he can swap with lit; anyone not in the squad is ignored", async () => {
  const zeus = await htmlAt(pickTeamSwapping("zeus"));
  expect(zeus).toMatch(/class="tile tile--selected[^"]*"(?:(?!class="tile ).)*title="Zeus"/);
  // Zeus swaps only with Siwoo, the Flex.
  expect(zeus.match(/tile--fit/g)).toHaveLength(1);
  expect(zeus).toMatch(/class="tile [^"]*tile--fit[^"]*"(?:(?!class="tile ).)*title="Siwoo"/);
  expect(await htmlAt(pickTeamSwapping("nobody"))).toBe(await htmlAt(PATHS.pickTeam));
});

test("Pick Team opens on Rift the first time, then on the view shared with Points, and on Rift where storage is blocked", async () => {
  expect(chosenView(await htmlAt(PATHS.pickTeam))).toBe("Rift view");
  stubStorage(keptStorage({ [VIEW_KEYS.board]: "Card view", [VIEW_KEYS.transfers]: "List view" }));
  expect(chosenView(await htmlAt(PATHS.pickTeam))).toBe("Card view");
  stubStorage(blockedStorage);
  expect(chosenView(await htmlAt(PATHS.pickTeam))).toBe("Rift view");
});
