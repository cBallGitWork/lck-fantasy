// @vitest-environment node
import { expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { MY_SEASON_TOTAL } from "../../fixtures/myLeagues";
import { MY_EARLIER_WEEKS, MY_WEEK3 } from "../../fixtures/week3";
import { LATEST_WEEK, POINTS_FIXTURE, POINTS_WEEKS } from "./fixtures";
import { POINTS_VIEW_KEY, rememberedView, weekOf } from "./index";
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
    "Highest 121",
    "Live",
    "T1 v DK, game 2",
    "Watch ›",
    "Rift view",
    "Card view",
    "Zeus14v T1 7 · v GEN 7",
    "Canyon14v KT 7 · v HLE 7",
    "Faker25v HLE 12 · v DK 5",
    "Ruler14v KT 7 · v HLE 7",
        "Delight 🎂9v T1 5 · v GEN 4",
    "FlexDKSiwoo8v NS 5 · v T1 3",
    "Coach 감독T1kkOma10v HLE 8 · v DK 2",
    "Bench",
    "1. MidKTBdd—Didn't play",
    "2. JungleKTCuzz9",
    "FakerT1 · Mid · Carry✕",
    "v HLEW 2–1",
    "G1Azir · W5",
    "G2Taliyah · L2",
    "G3Galio · W7",
    "v DK1–0G1Orianna · W4",
    "G2Sylas · 14:20Live1",
    "Your CarryAverage Carry 1925",
    "Full stats ›",
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
    "Your week",
    "StarFaker25 · owned by 46%",
    "FlopSiwoo8 · owned by 6%",
    "KillerChovy15 · not owned · 41%",
    "Sponsor",
    "All sponsors are made up.",
  ]);
});

test("the picture's state boxes the counted games, greys the dropped one and marks Faker chosen", () => {
  const out = html(PICTURE);
  expect(out.match(/player-panel__counted/g)).toHaveLength(4);
  expect(out.match(/player-panel__game--dropped/g)).toHaveLength(1);
  expect(out.match(/tile--selected/g)).toHaveLength(1);
  expect(out).toContain('aria-pressed="true"');
  // Rank moves: four up, one down.
  expect(out.match(/rank-up/g)).toHaveLength(4);
  expect(out.match(/rank-down/g)).toHaveLength(1);
});

test("the Carry shows only his result, and no one's tile, card or games show an auto-sub line", () => {
  for (const view of ["Rift view", "Card view"] as const) {
    const out = text(<PointsPage data={POINTS_FIXTURE} view={view} open="Faker" />);
    expect(out).not.toMatch(/×|Subbed in/);
  }
});

test("Live shows on the head's bar, the open game's row and the week's series, never on a tile or a series result", () => {
  const out = text(PICTURE);
  // The top bar's Live item, then the three.
  expect(out.match(/Live/g)).toHaveLength(4);
  expectInOrder(out, ["Live", "T1 v DK, game 2", "v DK1–0G1", "G2Sylas · 14:20Live", "SatT1 v DK1–0 Live"]);
  expect(out).not.toMatch(/game \d live/);
});

test("each series in a player's games opens its Series page, with no day before the opponent", () => {
  const out = html(PICTURE);
  expect(out).toMatch(/<a [^>]*href="\/series\/w3-wed-1"[^>]*>v HLE<\/a>/);
  expect(out).toMatch(/<a [^>]*href="\/series\/w3-sat-2"[^>]*>v DK<\/a>/);
  expect(text(PICTURE)).not.toMatch(/(Wed|Sat) · v/);
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
  expectInOrder(out, ["Bench", "Cuzz9", "Your week"]);
});

test("the Coach's games lead to his coach card and show no Carry sum", () => {
  const coach = <PointsPage data={POINTS_FIXTURE} open="kkOma" />;
  expect(html(coach)).toContain('href="/coach/kkoma"');
  const out = text(coach);
  expect(out).not.toContain("Your Carry");
  expectInOrder(out, ["kkOmaT1 · Coach✕", "G1W2", "G2L0", "G3W3", "v DK1–0G1W2", "G214:20Live0"]);
});

test("Card view shows the seven in the broadcast's order with their series and points, then the bench", () => {
  const out = text(<PointsPage data={POINTS_FIXTURE} view="Card view" />);
  expect(out).not.toContain("rift-map");
  expectInOrder(out, [
    "Zeus",
    "v T1 7 · v GEN 7",
    "14",
    "Faker",
    "v HLE 12 · v DK 5",
    "25",
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

test("the fixture's total is its starters' points: 94, the Carry's 25 among them, as the shared Week 3 gives them", () => {
  const { starters, total } = POINTS_FIXTURE;
  expect(total).toBe(MY_WEEK3.liveTotal);
  expect(starters.map((p) => p.points)).toEqual([14, 14, 25, 14, 9, 8, 10]);
  expect(Object.fromEntries(starters.map((p) => [p.cardId, p.points]))).toEqual(MY_WEEK3.live);
  const faker = starters.find((p) => p.mark === "C");
  expect(faker?.carry).toEqual({ average: 19 });
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

const week = (n: number) => {
  const data = POINTS_WEEKS.get(n);
  if (!data) throw new Error(`No Week ${n}`);
  return data;
};

test("‹ › are keys by the router: Week 1's ‹ is off, the latest's › is off, each other links its week", () => {
  expect([...POINTS_WEEKS.keys()]).toEqual([1, 2, 3]);
  expect(LATEST_WEEK).toBe(3);
  const head = (n: number) => html(<PointsPage data={week(n)} />).split('class="page-head__key-line"')[0] ?? "";
  expect(head(1)).toContain('<button type="button" class="week-arrow week-arrow--off" aria-label="Week before" disabled="">‹</button>');
  expect(head(1)).toContain('href="/points/2"');
  expect(head(2)).toContain('href="/points/1"');
  expect(head(2)).toContain('href="/points/3"');
  expect(head(3)).toContain('href="/points/2"');
  expect(head(3)).toContain('<button type="button" class="week-arrow week-arrow--off" aria-label="Week after" disabled="">›</button>');
});

test("a path names its week: /points the latest, /points/2 Week 2, anything else no week", () => {
  expect(weekOf(undefined)).toBe(3);
  expect(weekOf("2")).toBe(2);
  for (const bad of ["0", "4", "02x", "two", ""]) expect(weekOf(bad)).toBeUndefined();
});

test("a final week says Final once, as the head's tag (Craig, 16 Nov 2026): no Not final, no Live, no live bar", () => {
  for (const n of [1, 2]) {
    const data = week(n);
    expect(data.final).toBe(true);
    const out = text(<PointsPage data={data} open="Faker" />);
    expect(out).toContain(`LCK Cup · Week ${n}`);
    expect(out.match(/Final/g)).toHaveLength(1);
    expect(out).not.toMatch(/Not final|· final|Watch/);
    // Only the top bar's Live item.
    expect(out.match(/Live/g)).toHaveLength(1);
  }
});

test("Weeks 1 and 2 add up: each total its starters', the Carry's ×1.5 rounded down, Star the top and Flop the lowest", () => {
  const w1 = week(1);
  expect(w1.starters.map((p) => p.points)).toEqual([15, 14, 27, 16, 9, 6, 9]);
  expect(w1.total).toBe(96);
  expect(w1.yourWeek.map((p) => `${p.label} ${p.name} ${p.points}`)).toEqual(["Star Faker 27", "Flop Siwoo 6", "Killer Chovy 22"]);
  const w2 = week(2);
  expect(w2.starters.map((p) => p.points)).toEqual([15, 15, 30, 15, 9, 13, 15]);
  expect(w2.total).toBe(112);
  expect(w2.yourWeek.map((p) => `${p.label} ${p.name} ${p.points}`)).toEqual(["Star Faker 30", "Flop Delight 9", "Killer Peyz 19"]);
  expectInOrder(text(<PointsPage data={w2} open="kkOma" />), ["kkOmaT1 · Coach✕", "v DNSW 2–0", "G1W2", "G2W2", "v BFXW 2–1", "G1W2", "G2L0", "G3W3"]);
});

test("Leagues' season total is Points' weeks: Weeks 1 and 2 final, and Week 3 so far", () => {
  expect(MY_EARLIER_WEEKS).toEqual([week(1).total, week(2).total]);
  expect(MY_SEASON_TOTAL).toBe(week(1).total + week(2).total + POINTS_FIXTURE.total);
});
