// @vitest-environment node
import { describe, expect, test } from "vitest";
import { STATS_PLAYERS } from "../../fixtures/week3";
import { expectInOrder, html, noop, text } from "../../testing/render";
import { stepWeek } from ".";
import { WEEK3_PRICES, WEEK4_PRICES } from "./fixtures";
import { cardOf, NO_MOVES, PriceChangesPage } from "./PriceChangesPage";

describe("Week 4 prices", () => {
  const out = text(<PriceChangesPage week={WEEK4_PRICES} onPrev={noop} />);

  test("shows the head, then when the prices were set, then Rises before Falls", () => {
    expectInOrder(out, ["Price changes", "가격 변동", "‹", "Week 4 prices", "›", "Set Wed 13 Jan 07:45 16:45 KST", "Rises", "Falls"]);
  });

  test("lists each move in the picture's order: name, team and role, was, now, owned", () => {
    const rises = out.slice(out.indexOf("Rises"), out.indexOf("Falls"));
    const falls = out.slice(out.indexOf("Falls"));
    expect(rises).toContain("PlayerWasNowOwnedFakerT1 · Mid₩18.0m₩18.5m46%ChovyGEN · Mid₩17.0m₩17.5m41%");
    expect(rises.endsWith("HypeKRX · Bot₩5.0m₩5.5m1%")).toBe(true);
    expect(falls).toContain("PlayerWasNowOwnedGumayusiHLE · Bot₩16.0m₩15.5m26%");
    expect(falls.endsWith("EdgarBRO · Coach₩5.0m₩4.5m1%")).toBe(true);
    expectInOrder(rises, ["Faker", "Chovy", "Peyz", "Siwoo", "BuLLDoG", "Lucid", "Kingen", "Ssong", "Hype"]);
    expectInOrder(falls, ["Gumayusi", "Aiming", "ShowMaker", "Doran", "DuDu", "Clear", "DanDy", "Edgar"]);
  });

  test("marks no row with an arrow (the list says rise or fall), and your own players with the dot", () => {
    const page = html(<PriceChangesPage week={WEEK4_PRICES} />);
    expect(page).not.toMatch(/class="(rise|fall)"/);
    expect(page.match(/me-dot/g)).toHaveLength(2);
    expect(WEEK4_PRICES.rises.filter((row) => row.mine).map((row) => row.name)).toEqual(["Faker", "Siwoo"]);
  });

  test("agrees with the Stats picture on every player it lists", () => {
    const shared = [...WEEK4_PRICES.rises, ...WEEK4_PRICES.falls].flatMap((row) => {
      const stats = STATS_PLAYERS.find((player) => player.name === row.name);
      return stats ? [{ row, stats }] : [];
    });
    expect(shared.map(({ row }) => row.name)).toEqual(["Faker", "Chovy", "Peyz", "Siwoo", "BuLLDoG", "Ssong", "Gumayusi", "Aiming", "ShowMaker", "Doran"]);
    for (const { row, stats } of shared) {
      expect([row.nowM, row.ownedPct, Math.sign(row.nowM - row.wasM)]).toEqual([stats.priceM, stats.ownedPct, stats.move]);
    }
  });
});

describe("controls", () => {
  test("a name opens the player's card, or the coach's", () => {
    const page = html(<PriceChangesPage week={WEEK4_PRICES} />);
    expect(page).toContain('href="/player/faker"');
    expect(page).toContain('href="/coach/ssong"');
    expect(cardOf(WEEK4_PRICES.falls.at(-1)!)).toEqual({ to: "/coach/$coachId", params: { coachId: "edgar" } });
  });

  test("‹ and › step only where there is a week to go to; the other is a disabled key", () => {
    const latest = html(<PriceChangesPage week={WEEK4_PRICES} onPrev={noop} />);
    expect(latest).toContain('<button type="button" class="week-arrow" aria-label="Week before">');
    expect(latest).toContain('<button type="button" class="week-arrow week-arrow--off" aria-label="Week after" disabled="">');
  });

  test("stepping stops at the first and the latest week", () => {
    expect(stepWeek(1, -1, 2)).toBe(0);
    expect(stepWeek(1, 1, 2)).toBeUndefined();
    expect(stepWeek(0, -1, 2)).toBeUndefined();
  });

  test("How prices move › shows only once it has somewhere to go", () => {
    expect(text(<PriceChangesPage week={WEEK4_PRICES} />)).not.toContain("How prices move");
    expect(text(<PriceChangesPage week={WEEK4_PRICES} howPricesMove={{ to: "/stats" }} />)).toContain("Set Wed 13 Jan 07:45 16:45 KSTHow prices move ›");
  });
});

describe("before the first move", () => {
  test("both lists read No moves yet", () => {
    const out = text(<PriceChangesPage week={WEEK3_PRICES} onNext={noop} />);
    expect(out).toContain(`Week 3 prices›Rises${NO_MOVES}Falls${NO_MOVES}`);
    expect(out).not.toContain("Set ");
  });
});
