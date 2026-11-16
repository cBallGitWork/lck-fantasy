// @vitest-environment node
import { describe, expect, test } from "vitest";
import { STATS_PLAYERS } from "../../fixtures/week3";
import { html, text } from "../../testing/render";
import { stepWeek } from ".";
import { WEEK3_PRICES, WEEK4_PRICES } from "./fixtures";
import { cardOf, NO_MOVES, PatchUpdatePage } from "./PatchUpdatePage";

const noop = () => {};

/** Every part appears in `out`, each after the one before. */
function expectInOrder(out: string, parts: string[]) {
  const at = parts.map((part) => out.indexOf(part));
  expect(at).not.toContain(-1);
  expect(at).toEqual([...at].sort((a, b) => a - b));
}

describe("Week 4 prices", () => {
  const out = text(<PatchUpdatePage week={WEEK4_PRICES} onPrev={noop} />);

  test("shows the head, then when the prices were set, then Rises before Falls", () => {
    expectInOrder(out, ["Patch update", "패치 노트", "‹", "Week 4 prices", "›", "Set Wed 13 Jan 07:45 16:45 KST", "Rises", "Falls"]);
  });

  test("lists each move in the picture's order: name, team and role, was, now, owned", () => {
    const rises = out.slice(out.indexOf("Rises"), out.indexOf("Falls"));
    const falls = out.slice(out.indexOf("Falls"));
    expect(rises).toContain("PlayerWasNowOwnedFakerT1 · Mid18.0m18.5m46%ChovyGEN · Mid17.0m17.5m41%");
    expect(rises.endsWith("HypeKRX · Bot5.0m5.5m2%")).toBe(true);
    expect(falls).toContain("PlayerWasNowOwnedGumayusiHLE · Bot16.0m15.5m26%");
    expect(falls.endsWith("EdgarBRO · Coach5.0m4.5m1%")).toBe(true);
    expectInOrder(rises, ["Faker", "Chovy", "Peyz", "Siwoo", "BuLLDoG", "Lucid", "Kingen", "Ssong", "Hype"]);
    expectInOrder(falls, ["Gumayusi", "Aiming", "ShowMaker", "Doran", "DuDu", "Clear", "DanDy", "Edgar"]);
  });

  test("marks a rise ▲ and a fall ▼, and your own players with the dot", () => {
    const page = html(<PatchUpdatePage week={WEEK4_PRICES} />);
    expect(page.match(/class="rise"/g)).toHaveLength(WEEK4_PRICES.rises.length);
    expect(page.match(/class="fall"/g)).toHaveLength(WEEK4_PRICES.falls.length);
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
      expect([row.nowEok, row.ownedPct, Math.sign(row.nowEok - row.wasEok)]).toEqual([stats.priceEok, stats.ownedPct, stats.move]);
    }
  });
});

describe("controls", () => {
  test("a name opens the player's card, or the coach's", () => {
    const page = html(<PatchUpdatePage week={WEEK4_PRICES} />);
    expect(page).toContain('href="/player/faker"');
    expect(page).toContain('href="/coach/ssong"');
    expect(cardOf(WEEK4_PRICES.falls.at(-1)!)).toEqual({ to: "/coach/$coachId", params: { coachId: "edgar" } });
  });

  test("‹ and › are keys only where there is a week to go to", () => {
    const latest = html(<PatchUpdatePage week={WEEK4_PRICES} onPrev={noop} />);
    expect(latest).toContain('aria-label="Week before"');
    expect(latest).not.toContain('aria-label="Week after"');
    expect(latest).toContain("week-arrow--off");
  });

  test("stepping stops at the first and the latest week", () => {
    expect(stepWeek(1, -1, 2)).toBe(0);
    expect(stepWeek(1, 1, 2)).toBeUndefined();
    expect(stepWeek(0, -1, 2)).toBeUndefined();
  });

  test("How prices move › shows only once it has somewhere to go", () => {
    expect(text(<PatchUpdatePage week={WEEK4_PRICES} />)).not.toContain("How prices move");
    expect(text(<PatchUpdatePage week={WEEK4_PRICES} howPricesMove={{ to: "/stats" }} />)).toContain("Set Wed 13 Jan 07:45 16:45 KSTHow prices move ›");
  });
});

describe("before the first move", () => {
  test("both lists read No moves yet", () => {
    const out = text(<PatchUpdatePage week={WEEK3_PRICES} onNext={noop} />);
    expect(out).toContain(`Week 3 prices›Rises${NO_MOVES}Falls${NO_MOVES}`);
    expect(out).not.toContain("Set ");
  });
});
