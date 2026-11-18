// @vitest-environment node
import { expect, test, vi } from "vitest";
import { PERFECT_GAME } from "../../fixtures/week3";
import { sum, VIEW_KEYS } from "../../parts";
import { PATHS } from "../../paths";
import { expectInOrder, hovers, html, htmlAt, text } from "../../testing/render";
import { blockedStorage, chosenView, keptStorage, stubStorage } from "../../testing/storage";
import { PERFECT_WEEK3 } from "./fixtures";
import { PerfectGame, PerfectGameCards, PerfectGameRift } from "./PerfectGame";

const SEVEN = ["Zeus", "Pyosik", "Faker", "Ruler", "Duro", "BuLLDoG", "kkOma"];

test("Rift view, Faker tapped: the head, the seven on the Rift, his games, the week's series, the sponsor", () => {
  const out = text(<PerfectGame game={PERFECT_WEEK3} view="Rift view" selected="mid" onSelect={() => {}} />);
  expectInOrder(out, [
    "Perfect game",
    "퍼펙트 게임",
    "‹",
    "Split 1 · Week 3",
    "›",
    "130",
    "Final",
    "Average 79",
    "Highest 128",
    "Your points 109›",
    "Rift view",
    "Card view",
    ...SEVEN,
    "Faker",
    "T1 · Mid✕",
    "Wed · v HLE W 2–1",
    "G1Azir · W5",
    "G2Taliyah · L2",
    "G3Galio · W7",
    "Sat · v DK W 2–0",
    "G1Orianna · W4",
    "G2Sylas · W6",
    "Captain33",
    "Full stats ›",
    "Week 3 series",
    "WedT1 v HLE2–1",
    "SunBFX v DNS0–2",
    "Sponsor",
    "All sponsors are made up.",
  ]);
});

test("Final is the head's tag alone, no cap tag (Craig, 16 Nov 2026), and Captain is the sum's label alone", () => {
  const out = text(<PerfectGame game={PERFECT_WEEK3} view="Rift view" selected="mid" />);
  expect(out.match(/Final/g)).toHaveLength(1);
  expect(out).not.toMatch(/Cap(?!tain)/);
  expect(out.match(/Captain/g)).toHaveLength(1);
});

test("the Rift's tiles show each starter's points (the Captain's result only), series, your dots and the Flex and Coach labels", () => {
  const out = html(<PerfectGameRift game={PERFECT_WEEK3} selected="mid" />);
  for (const p of PERFECT_GAME) expect(out).toContain(p.line);
  expect(out).toContain('class="tile__points num">33</div>');
  expect(text(<PerfectGame game={PERFECT_WEEK3} view="Rift view" selected="mid" />)).not.toContain("×");
  expect(out).toContain('aria-label="Captain">C');
  expect(out.match(/aria-label="Your player"/g)).toHaveLength(4);
  expect(out).toContain('class="tile__slot tile__slot--flex"><span class="hint"');
  expect(hovers(out)).toContainEqual(["Flex", "Any role"]);
  expect(out).not.toContain("plays Mid");
  expect(out).toContain("Coach 감독");
  expect(out.match(/tile--selected/g)).toHaveLength(1);
});

test("Card view: the seven as the broadcast lineup, each with his series and points, C on Faker", () => {
  const out = text(<PerfectGame game={PERFECT_WEEK3} view="Card view" />);
  expectInOrder(out, ["Rift view", "Card view", "Top", "Zeus", "Jungle", "Pyosik", "Mid", "C", "Faker"]);
  expectInOrder(out, ["Zeus", "HLE", "v T1 7", "v GEN 7", "14"]);
  expectInOrder(out, ["Faker", "T1", "v HLE 12", "v DK 10", "33"]);
  expect(out).not.toContain("×");
  expectInOrder(out, ["Flex", "plays Mid", "BuLLDoG", "DNS", "v BRO 9", "v BFX 12", "21"]);
  expectInOrder(out, ["Coach", "감독", "kkOma", "T1", "v HLE 8", "v DK 8", "16"]);
  expect(out).not.toContain("Full stats");
  const cards = html(<PerfectGameCards game={PERFECT_WEEK3} />);
  expect(cards.match(/class="pcard( |")/g)).toHaveLength(7);
  expect(cards).toContain("crest");
});

test("the chosen view is pressed; the other draws neither tiles nor cards", () => {
  const rift = html(<PerfectGame game={PERFECT_WEEK3} view="Rift view" />);
  expect(rift).toMatch(/aria-pressed="true"[^>]*>Rift view/);
  expect(rift).not.toContain("pcard");
  const card = html(<PerfectGame game={PERFECT_WEEK3} view="Card view" />);
  expect(card).toMatch(/aria-pressed="true"[^>]*>Card view/);
  expect(card).not.toContain("rift-map");
});

test("with no one tapped there is no panel; every tile and card can be tapped", () => {
  const out = text(<PerfectGame game={PERFECT_WEEK3} view="Rift view" />);
  expect(out).not.toContain("Full stats");
  // Each tile and card is a key (role="button") the keyboard reaches.
  expect(html(<PerfectGameRift game={PERFECT_WEEK3} onSelect={vi.fn()} />).match(/role="button"/g)).toHaveLength(7);
  expect(html(<PerfectGameCards game={PERFECT_WEEK3} onSelect={vi.fn()} />).match(/role="button"/g)).toHaveLength(7);
});

test("Full stats opens the player card, or the coach card for the Coach; Your points opens Points", () => {
  expect(html(<PerfectGame game={PERFECT_WEEK3} view="Rift view" selected="mid" />)).toContain('href="/player/faker"');
  expect(html(<PerfectGame game={PERFECT_WEEK3} view="Rift view" selected="coach" />)).toContain('href="/coach/kkoma"');
  expect(html(<PerfectGame game={PERFECT_WEEK3} view="Rift view" />)).toContain('href="/points"');
});

test("a starter without drawn games shows his series and sum; Not final shows dashed", () => {
  const out = text(<PerfectGame game={{ ...PERFECT_WEEK3, final: false }} view="Rift view" selected="top" />);
  expectInOrder(out, ["Not final", "Zeus", "HLE · Top", "Wed · v T1 L 1–2", "Sat · v GEN L 1–2", "7 + 7", "14", "Full stats ›"]);
  expect(html(<PerfectGame game={{ ...PERFECT_WEEK3, final: false }} view="Rift view" />)).toContain("tag--not-final");
});

test("the fixture agrees with the shared Week 3: each series' points make the line and the total", () => {
  for (const p of PERFECT_WEEK3.players) {
    expect(sum(p.series.map((s) => s.points)), p.name).toBe(p.captain ? p.raw : p.points);
    for (const s of p.series) expect(p.line, p.name).toContain(` ${s.points}`);
    for (const s of p.series.filter((x) => x.games)) {
      const counted = sum((s.games ?? []).filter((g) => g.counted).map((g) => g.points));
      expect(counted, `${p.name} ${s.id}`).toBe(s.points);
    }
  }
});

test("Perfect game opens on Rift the first time, then on the view shared with Points, and on Rift where storage is blocked", async () => {
  expect(chosenView(await htmlAt(PATHS.perfectGame))).toBe("Rift view");
  stubStorage(keptStorage({ [VIEW_KEYS.board]: "Card view", [VIEW_KEYS.transfers]: "List view" }));
  expect(chosenView(await htmlAt(PATHS.perfectGame))).toBe("Card view");
  stubStorage(blockedStorage);
  expect(chosenView(await htmlAt(PATHS.perfectGame))).toBe("Rift view");
});
