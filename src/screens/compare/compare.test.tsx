// @vitest-environment node
import { describe, expect, test } from "vitest";
import { expectInOrder, html, noop, text } from "../../testing/render";
import { sum } from "../../parts";
import { better, searchGroups } from "./rules";
import { CHOVY, COMPARE_PLAYERS, FAKER, KKOMA, RYU, SEARCH_ROWS } from "./fixtures";
import { ComparePage } from ".";

/** The text of each bold (better) cell, in order. */
const bold = (out: string) => [...out.matchAll(/compare__better">([^<]*)/g)].map((m) => m[1]);

describe("Faker v Chovy", () => {
  const out = text(<ComparePage onClose={noop} />);
  const markup = html(<ComparePage onClose={noop} />);

  test("is the compare screen, a card with ✕", () => {
    expect(markup).toContain('data-screen="compare"');
    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-label="Close"');
  });

  test("faces each other across a v, Change › under Chovy", () => {
    expectInOrder(out, ["portrait", "Mid · T1", "Faker", "이상혁", "v", "portrait", "Mid · GEN", "Chovy", "정지훈", "Change ›"]);
  });

  test("holds the top table in the picture's order", () => {
    expectInOrder(out, [
      "58", "2nd of 10 mids", "Season", "61", "1st of 10 mids",
      "19.3", "Form", "20.3",
      "₩18.5m", "0.5", "Price", "₩17.5m", "0.5",
      "46%", "Owned", "41%",
      "W2 · Fri", "10", "v BFX", "W3 · Wed", "12", "v HLE", "W3 · Sat", "10", "v DK", "Last 3", "W2 · Sat", "11", "v BRO",
      "W4 · Wed", "v KT", "W4 · Sat", "v GEN", "W5 · Thu", "v BRO", "Next 3", "W4 · Thu", "v BRO", "W4 · Sat", "v T1", "W5 · Wed", "v DNS",
    ]);
  });

  test("holds each line's total, per game and points, mirrored, in the picture's order", () => {
    expectInOrder(out, [
      "Total", "Per game", "Pts", "Pts", "Per game", "Total",
      "73", "4.9", "+22", "Kills", "+24", "4.4", "70",
      "86", "5.7", "+16", "Assists", "+12", "4.6", "74",
      "26", "1.7", "−4", "Deaths", "−2", "0.6", "9",
      "9", "0.6", "+9", "Gold lead at 15", "+11", "0.7", "11",
      "5", "0.3", "+5", "Solo kills", "+8", "0.5", "8",
      "3", "0.2", "+3", "First bloods", "+3", "0.2", "3",
      "4", "0.3", "+4", "Deathless", "+4", "0.3", "4",
      "1", "0.1", "+1", "Quadra kills", "+1", "0.1", "1",
      "2", "0.1", "+2", "Steals", "0", "0.0", "0",
    ]);
  });

  test("marks only Season, Form and the better line points; level lines and Price and Owned never", () => {
    expect(bold(markup)).toEqual(["61", "20.3", "+24", "+16", "−2", "+11", "+8", "+2"]);
    expect(markup).toContain('class="rise compare__move"');
  });
});

describe("the second player not picked yet", () => {
  const out = text(<ComparePage right={null} onClose={noop} />);

  test("shows Faker alone, then the search with mids first", () => {
    expectInOrder(out, ["Mid · T1", "Faker", "이상혁", "v", "Mids", "Chovy", "GEN", "₩17.5m", "61", "Zeka", "HLE", "₩15.0m", "41"]);
    expectInOrder(out, ["BuLLDoG", "DNS", "₩11.0m", "36", "ShowMaker", "DK", "₩13.0m", "33", "All mids · Other roles ›"]);
    expect(out).not.toContain("Change ›");
    expect(html(<ComparePage right={null} onClose={noop} />)).toContain('placeholder="Find a player"');
  });

  test("lists his role only, never himself, and no coach", () => {
    expect(out).not.toMatch(/Ruler|kkOma|Tops|Coaches/);
    expect(out.match(/Faker/g)).toHaveLength(1);
  });

  test("a row is a key only where Compare has his lines", () => {
    const markup = html(<ComparePage right={null} onClose={noop} />);
    expect(markup.match(/role="button"/g)).toHaveLength(1);
    expect(markup).toMatch(/role="button"[^>]*><td class="compare__result-name">Chovy/);
  });
});

describe("kkOma v Ryu", () => {
  const out = text(<ComparePage left={KKOMA} right={RYU} onClose={noop} />);

  test("faces each other as coaches, then the top table", () => {
    expectInOrder(out, ["Coach · T1", "kkOma", "김정균", "v", "Coach · GEN", "Ryu", "류상욱", "Change ›"]);
    expectInOrder(out, ["27", "1st of 10 coaches", "Season", "26", "2nd of 10 coaches", "9.0", "Form", "8.7", "₩7.0m", "0.5", "Price", "₩7.0m", "24%", "Owned", "21%"]);
  });

  test("holds the coach lines, with no per-game figure on the series rows", () => {
    expectInOrder(out, [
      "8", "0.5", "+6", "First tower", "+5", "0.4", "7",
      "7", "0.5", "+5", "Most drakes", "+4", "0.4", "6",
      "3", "0.2", "+2", "Most barons", "+3", "0.3", "4",
      "1", "0.1", "0", "Most elders", "0", "0.0", "0",
      "0", "0.0", "0", "Quick win", "0", "0.1", "1",
      "5", "+15", "Series won", "+15", "5",
      "1", "−1", "Series lost", "−1", "1",
    ]);
    expect(out).toContain("5+15Series won+155");
  });

  test("searching from a coach lists coaches only, with no Other roles", () => {
    const pick = text(<ComparePage left={KKOMA} right={null} onClose={noop} />);
    expectInOrder(pick, ["Coaches", "Ryu", "Homme", "Ssong", "cvMax", "Score", "Joker"]);
    expect(pick).not.toMatch(/Mids|Chovy|Other roles/);
  });
});

describe("the rules", () => {
  test("the higher number is better, and level is unmarked", () => {
    expect(better(-4, -2)).toBe("right");
    expect(better(22, 24)).toBe("right");
    expect(better(16, 12)).toBe("left");
    expect(better(3, 3)).toBeNull();
  });

  test("Other roles lists his role first, then the rest in the broadcast's order", () => {
    expect(searchGroups(SEARCH_ROWS, FAKER, "", true).map((g) => g.role)).toEqual(["mid", "top", "jng", "bot", "sup"]);
  });

  test("a typed name searches every role he can be compared with", () => {
    const found = searchGroups(SEARCH_ROWS, FAKER, "ru", false).flatMap((g) => g.rows.map((r) => r.name));
    expect(found).toEqual(["Ruler"]);
    expect(searchGroups(SEARCH_ROWS, KKOMA, "ru", false)).toEqual([]);
  });

  test("each side's season is the sum of its line points", () => {
    for (const p of Object.values(COMPARE_PLAYERS)) expect(sum(p.lines.map((l) => l.points)), p.name).toBe(p.season.points);
    expect(Object.keys(COMPARE_PLAYERS)).toEqual([FAKER.name, CHOVY.name, KKOMA.name, RYU.name]);
  });
});
