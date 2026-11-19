// @vitest-environment node
import { describe, expect, test } from "vitest";
import { STATS_PLAYERS } from "../../fixtures/week3";
import { RIOT_NOTICE } from "../../parts";
import { PATHS, SCREEN_NAME } from "../../paths";
import { expectInOrder, html, htmlAt, text } from "../../testing/render";
import { stepWeek, weekOf } from ".";
import { WEEK3_PRICES, WEEK4_PRICES, type PriceMove } from "./fixtures";
import { biggestFirst, cardOf, PriceChangesPage } from "./PriceChangesPage";
import { WORDS } from "./words";

const WEEK3 = { to: PATHS.priceChangesWeek, params: { week: "3" } } as const;
const WEEK4 = { to: PATHS.priceChangesWeek, params: { week: "4" } } as const;

describe("Week 4 prices", () => {
  const out = text(<PriceChangesPage week={WEEK4_PRICES} prev={WEEK3} />);

  test("shows the head, then when the prices were set, then Rises before Falls", () => {
    expectInOrder(out, ["Price changes", "가격 변동", "‹", "Week 4 prices", "›", "Changed Wed 13 Jan 07:45 16:45 KST", "Rises", "Falls"]);
  });

  test("lists each move: name, team and role, was, now, owned", () => {
    const rises = out.slice(out.indexOf("Rises"), out.indexOf("Falls"));
    const falls = out.slice(out.indexOf("Falls"), out.indexOf(`${SCREEN_NAME.help}${SCREEN_NAME.privacy}${SCREEN_NAME.terms}${RIOT_NOTICE}`));
    expect(rises).toContain("PlayerWasNowOwnedFakerT1 · Mid₩18.0m₩18.5m46%ChovyGEN · Mid₩17.0m₩17.5m41%");
    expect(rises.endsWith("HypeKRX · Bot₩5.0m₩5.5m1%")).toBe(true);
    expect(falls).toContain("PlayerWasNowOwnedGumayusiHLE · Bot₩16.0m₩15.5m26%");
    expect(falls.endsWith("EdgarBRO · Coach₩5.0m₩4.5m1%")).toBe(true);
    expectInOrder(rises, ["Faker", "Chovy", "Peyz", "Siwoo", "BuLLDoG", "Lucid", "Kingen", "Ssong", "Hype"]);
    // Every move is ₩0.5m, so the most owned leads: Doran (18%) before ShowMaker (9%) and Aiming (8%).
    expectInOrder(falls, ["Gumayusi", "Doran", "ShowMaker", "Aiming", "DuDu", "Clear", "DanDy", "Edgar"]);
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

describe("biggest move first (spec/12)", () => {
  const row = (name: string, wasM: number, nowM: number, ownedPct: number): PriceMove => ({
    id: name.toLowerCase(),
    name,
    team: "T1",
    role: "mid",
    wasM,
    nowM,
    ownedPct,
    mine: false,
  });

  test("rows given shuffled come out biggest move first, the most owned first on a tie", () => {
    const rises = [row("Small", 8.0, 8.5, 60), row("Big", 10.0, 11.0, 5), row("TieLow", 9.0, 9.5, 10), row("TieHigh", 7.0, 7.5, 30)];
    expect(biggestFirst(rises).map((r) => r.name)).toEqual(["Big", "Small", "TieHigh", "TieLow"]);
  });

  test("a fall's size is how far it fell, so the biggest drop leads Falls", () => {
    const falls = [row("Dip", 9.0, 8.5, 50), row("Drop", 12.0, 11.0, 2)];
    expect(biggestFirst(falls).map((r) => r.name)).toEqual(["Drop", "Dip"]);
    const page = text(<PriceChangesPage week={{ week: 4, rises: [], falls }} />);
    expectInOrder(page, ["Falls", "Drop", "Dip"]);
  });
});

describe("controls", () => {
  test("a name opens the player's card, or the coach's", () => {
    const page = html(<PriceChangesPage week={WEEK4_PRICES} />);
    expect(page).toContain('href="/player/faker"');
    expect(page).toContain('href="/coach/ssong"');
    expect(cardOf(WEEK4_PRICES.falls.at(-1)!)).toEqual({ to: "/coach/$coachId", params: { coachId: "edgar" } });
  });

  test("‹ and › link to a week's address only where there is one; the other is a disabled key", () => {
    const latest = html(<PriceChangesPage week={WEEK4_PRICES} prev={WEEK3} />);
    expect(latest).toMatch(/<a[^>]*href="\/price-changes\/3"[^>]*>‹<\/a>/);
    expect(latest).toContain('<button type="button" class="week-arrow key-off" aria-label="Next week" disabled="">');
  });

  test("stepping goes to the week's address and stops at the first and the latest week", () => {
    expect(stepWeek(4, -1)).toEqual(WEEK3);
    expect(stepWeek(3, 1)).toEqual(WEEK4);
    expect(stepWeek(4, 1)).toBeUndefined();
    expect(stepWeek(3, -1)).toBeUndefined();
  });

  test("How prices move › shows only once it has somewhere to go", () => {
    expect(text(<PriceChangesPage week={WEEK4_PRICES} />)).not.toContain("How prices move");
    expect(text(<PriceChangesPage week={WEEK4_PRICES} howPricesMove={{ to: "/stats" }} />)).toContain("Changed Wed 13 Jan 07:45 16:45 KSTHow prices move ›");
  });
});

describe("each week has its own address (spec/12)", () => {
  test("bare /price-changes is the latest week, /price-changes/3 is Week 3, any other is none", () => {
    expect(weekOf(undefined)).toBe(4);
    expect(weekOf("3")).toBe(3);
    for (const bad of ["2", "5", "03x", "three", ""]) expect(weekOf(bad)).toBeUndefined();
  });

  test("/price-changes/3 opens Week 3, its › going to /price-changes/4", async () => {
    const page = await htmlAt("/price-changes/3");
    expect(page).toContain("Week 3 prices");
    expect(page).toMatch(/<a[^>]*href="\/price-changes\/4"[^>]*>›<\/a>/);
  });

  test("bare /price-changes opens Week 4; a week with no prices says so", async () => {
    expect(await htmlAt("/price-changes")).toContain("Week 4 prices");
    expect(await htmlAt("/price-changes/9")).toContain(WORDS.noWeek);
  });
});

describe("before the first move", () => {
  test("both lists read No moves yet", () => {
    const out = text(<PriceChangesPage week={WEEK3_PRICES} next={WEEK4} />);
    expect(out).toContain(`Week 3 prices›${WORDS.rises}${WORDS.noMoves}${WORDS.falls}${WORDS.noMoves}`);
    expect(out).not.toContain("Changed ");
  });
});
