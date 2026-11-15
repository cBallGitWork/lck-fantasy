// @vitest-environment node
import { expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { POINTS_FIXTURE } from "./fixtures";
import { POINTS_VIEW_KEY, rememberedView } from "./index";
import { PointsPage } from "./PointsPage";

/** Fails unless each piece appears in `out`, each after the one before it. */
function expectInOrder(out: string, pieces: string[]) {
  let from = 0;
  for (const piece of pieces) {
    const at = out.indexOf(piece, from);
    expect(at, `"${piece}" after position ${from}`).toBeGreaterThanOrEqual(0);
    from = at + piece.length;
  }
}

// The picture's moment: Saturday, T1 v DK live, Faker's games open (points.html).
const PICTURE = <PointsPage data={POINTS_FIXTURE} open="Faker" />;

test("the picture's state holds its head, Rift, bench and side column, in its order", () => {
  expectInOrder(text(PICTURE), [
    "Baron Steal FC",
    "바론 스틸 FC",
    "LCK Cup · Week 3",
    "94",
    "Not final",
    "Average 74",
    "Highest 131",
    "Live",
    "T1 v DK, game 2",
    "Watch ›",
    "Rift view",
    "Card view",
    "Zeus14v T1 7 · v GEN 7",
    "Canyon14v KT 7 · v HLE 7",
    "Faker2517×1.5v HLE 12 · v DK 5Live",
    "Ruler14v KT 7 · v HLE 7",
    "Delight 🎂9v T1 5 · v GEN 4",
    "Siwoo8v NS 5 · v T1 3LiveSubbed in for BddFlex · plays Top",
    "kkOma10v HLE 8 · v DK 2LiveCoach 감독",
    "Bench",
    "1Bdd KT · Didn't play—",
    "2Cuzz KT9",
    "FakerT1 · Mid · Carry✕",
    "Wed · v HLEW 2–1 · final",
    "G1Azir · W5",
    "G2Taliyah · L2",
    "G3Galio · W7",
    "Sat · v DK1–0 · game 2 live",
    "G1Orianna · W4",
    "G2Sylas · 14:20Live1",
    "Your Carry12 + 5 = 17 × 1.5Average Carry 1925",
    "Full stats ›",
    "Your week",
    "StarFaker25 · owned by 46%",
    "FlopSiwoo8 · owned by 6%",
    "KillerChovy15 · not owned · 41%",
    "Leagues",
    "Overall · Emerald I48,2116,904",
    "United Kingdom1,402233",
    "T1 supporters3,118510",
    "Pub League2nd1",
    "Flol Discord14th2",
    "≈6 pts to Diamond IV",
    "All leagues ›",
    "This week's seriesyour time · KST",
    "WedT1 v HLE2–1",
    "SatGEN v HLE2–1 Not final",
    "SatT1 v DK1–0 Live",
    "SunKRX v BRO08:00 17:00 KST",
    "SunBFX v DNS10:30 19:30 KST",
    "Sponsor",
    "All sponsors are made up.",
  ]);
});

test("the picture's state boxes the counted games, greys the dropped one and marks Faker chosen", () => {
  const out = html(PICTURE);
  expect(out.match(/points__counted/g)).toHaveLength(4);
  expect(out.match(/points__game--dropped/g)).toHaveLength(1);
  expect(out.match(/tile--selected/g)).toHaveLength(1);
  expect(out).toContain('aria-pressed="true"');
  // Rank moves: four up, one down.
  expect(out.match(/rank-up/g)).toHaveLength(4);
  expect(out.match(/rank-down/g)).toHaveLength(1);
});

test("the links go where the README says: Highest, Watch, Full stats, All leagues", () => {
  const out = html(PICTURE);
  expect(out).toContain('href="/perfect-game"');
  expect(out).toContain('href="/live"');
  expect(out).toContain('href="/player/faker"');
  expect(out).toContain('href="/leagues"');
});

test("the games stay closed until a player is tapped", () => {
  const out = text(<PointsPage data={POINTS_FIXTURE} />);
  expect(out).not.toContain("Full stats");
  expect(out).not.toContain("Your Carry");
  expectInOrder(out, ["Bench", "Cuzz KT9", "Your week"]);
});

test("the Coach's games lead to his coach card and show no Carry sum", () => {
  const coach = <PointsPage data={POINTS_FIXTURE} open="kkOma" />;
  expect(html(coach)).toContain('href="/coach/kkoma"');
  const out = text(coach);
  expect(out).not.toContain("Your Carry");
  expectInOrder(out, ["kkOmaT1 · Coach✕", "G1W2", "G2L0", "G3W3", "Sat · v DK1–0 · game 2 live", "G1W2", "G214:20Live0"]);
});

test("Card view shows the seven in the broadcast's order with their series and points, then the bench", () => {
  const out = text(<PointsPage data={POINTS_FIXTURE} view="Card view" />);
  expect(out).not.toContain("rift-map");
  expectInOrder(out, [
    "Zeus",
    "v T1 7 · v GEN 7",
    "14",
    "Faker",
    "v HLE 12 · v DK 5Live",
    "2517×1.5",
    "Subbed in for Bdd",
    "Siwoo",
    "kkOma",
    "10",
    "Bench",
  ]);
  expect(html(<PointsPage data={POINTS_FIXTURE} view="Card view" />)).toContain('class="lineup"');
});

test("a bench player who didn't play can't be opened; one who played can", () => {
  const bench = html(<PointsPage data={POINTS_FIXTURE} />).split('class="bench-bar"')[1] ?? "";
  expect(bench.match(/role="button"/g)).toHaveLength(1);
  expect(text(<PointsPage data={POINTS_FIXTURE} open="Cuzz" />)).toContain("CuzzKT · Jungle✕");
});

test("the fixture's total is its starters' points: 94, the Carry's 25 after ×1.5", () => {
  const { starters, total } = POINTS_FIXTURE;
  expect(total).toBe(94);
  expect(starters.map((p) => p.points)).toEqual([14, 14, 25, 14, 9, 8, 10]);
  const faker = starters.find((p) => p.mark === "C");
  expect(faker?.carry).toEqual({ raw: 17, multiplier: 1.5, average: 19 });
});

test("the view opens on Rift the first time, then on the one kept, and on Rift where storage fails", () => {
  const kept = (value: string | null) => ({ getItem: (key: string) => (key === POINTS_VIEW_KEY ? value : null) });
  expect(rememberedView(undefined)).toBe("Rift view");
  expect(rememberedView(kept(null))).toBe("Rift view");
  expect(rememberedView(kept("Card view"))).toBe("Card view");
  expect(rememberedView(kept("Pitch"))).toBe("Rift view");
  const blocked = {
    getItem: () => {
      throw new Error("blocked");
    },
  };
  expect(rememberedView(blocked)).toBe("Rift view");
});
