// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { CARD_FROM_PICK_TEAM, CARD_FROM_POINTS, CARD_WITH_NEWS } from "./fixtures";
import { inOut as transfers, ordinal, signed } from "../../parts";
import { PlayerCardPage } from ".";
import { weekStarts } from "./WeekCell";

/** Each part appears after the one before it. */
function expectInOrder(out: string, parts: string[]) {
  let from = 0;
  for (const part of parts) {
    const at = out.indexOf(part, from);
    expect(at, `"${part}" after position ${from}`).toBeGreaterThanOrEqual(0);
    from = at + part.length;
  }
}

const HEAD = ["Mid · T1", "Faker", "이상혁", "Lee Sang-hyeok"];
const STRIP_NEXT = ["W4 · Wed · Bo3", "v KT", "W4 · Sat · Bo3", "v GEN", "W5 · Thu · Bo3", "v BRO"];
const TABS = ["This week", "Fixtures", "History", "Champions"];
const PICK_TEAM_KEYS = ["✓ Carry", "Make Vice-carry", "Swap with bench", "Transfer out", "Compare ›"];
const PICK_TEAM_META = ["18.5억", "price 0.5", "19.3", "form · 2nd", "46%", "owned · 1st", "+1,204 / −310 this week"];
const PICK_TEAM_STRIP = ["W2 · Fri", "10", "v BFX", "W3 · Wed", "12", "v HLE", "W3 · Sat", "10", "v DK", ...STRIP_NEXT];
const PICK_TEAM_SEASON = ["Season", "15 games", "Total", "Per game", "Pts", "Kills", "73", "4.9", "+22", "Deaths", "26", "1.7", "−4", "Steals", "2", "0.1", "+2"];

describe("History, opened from Pick Team", () => {
  const out = text(<PlayerCardPage />);

  test("holds the picture's content in its order", () => {
    expectInOrder(out, [
      ...HEAD,
      "58",
      "Season · 2nd of 10 mids",
      ...PICK_TEAM_KEYS,
      ...PICK_TEAM_META,
      ...PICK_TEAM_STRIP,
      ...TABS,
      "LCK Cup 2027",
      "Week", "Series", "Games", "K / D / A", "Price", "Pts", "Week",
      "2", "Wed · W 2–0 DNS", "14/4/16", "18.0억", "12", "22",
      "1", "Sat · W 2–0 NS", "9/3/11", "17.5억", "11", "14",
      "Wed · L 1–2 GEN", "7/9/10", "3",
      "Past seasons", "LCK, scored by Flol",
      "Season", "Games", "K / D / A", "Per game", "Pts",
      "LCK 2026", "98", "392/171/598", "4.2", "412",
      "LCK 2025", "104", "405/188/611", "4.4", "455",
      ...PICK_TEAM_SEASON,
    ]);
  });

  test("shows each week's price and total once, on its first row", () => {
    expect(out.match(/17\.5억/g)).toHaveLength(1);
    expect(out.match(/18\.0억/g)).toHaveLength(1);
  });

  test("marks History as the chosen tab", () => {
    expect(html(<PlayerCardPage />)).toMatch(/aria-pressed="true"[^>]*>History</);
  });
});

describe("This week, opened from Points with T1 v DK game 2 live", () => {
  const screen = <PlayerCardPage card={CARD_FROM_POINTS} initialTab="This week" openedFrom="points" />;
  const out = text(screen);

  test("holds the picture's content in its order", () => {
    expectInOrder(out, [
      ...HEAD,
      "36",
      "Season · 2nd of 10 mids",
      "Compare ›",
      "18.5억", "price 0.5", "18.0", "form · 1st", "46%", "owned · 1st", "+842 / −126 this week",
      "W2 · Fri", "10", "v BFX", "W3 · Wed", "12", "v HLE", "W3 · Sat", "5", "Live", "v DK",
      ...STRIP_NEXT,
      ...TABS,
      "Wed · v HLE", "W 2–1", "12",
      "G1", "Azir", "· W", "6/1/7", "5",
      "G2", "Taliyah", "· L", "3/2/5", "2",
      "G3", "Galio", "· W", "9/0/8", "7",
      "Sat · v DK", "1–0", "5",
      "G1", "Orianna", "· W", "5/1/9", "4",
      "G2", "Sylas", "· 14:20", "3/0/2", "1",
      "Week 3", "17 × 1.5 Carry", "25",
      "Season", "10 games", "Kills", "43", "4.3", "+13", "Deaths", "22", "2.2", "−3", "Steals", "1", "0.1", "+1",
    ]);
  });

  test("carries only Compare, none of the Pick Team keys", () => {
    for (const key of PICK_TEAM_KEYS.slice(0, -1)) expect(out).not.toContain(key);
  });

  test("strikes through the game that doesn't count", () => {
    expect(html(screen)).toMatch(/player-card__dropped"><td[^>]*>G2<\/td><td>Taliyah/);
    expect(html(screen).match(/player-card__dropped/g)).toHaveLength(1);
  });

  test("says Live once, on the strip, and never Final", () => {
    expect(html(screen).match(/tag--live/g)).toHaveLength(1);
    expect(out).not.toContain("Final");
  });
});

describe("the strip's series show once", () => {
  test("History starts after the strip's 3 played, Fixtures after its 3 to come", () => {
    const history = text(<PlayerCardPage />);
    expect(history).not.toContain("Sat · W 2–0 DK");
    expect(history).not.toContain("Fri · W 2–1 BFX");
    const fixtures = text(<PlayerCardPage initialTab="Fixtures" />);
    expect(fixtures).not.toContain("T1 v KT");
    expect(fixtures).not.toContain("T1 v BRO");
  });
});

describe("Fixtures, with a news line", () => {
  const out = text(<PlayerCardPage card={CARD_WITH_NEWS} initialTab="Fixtures" />);

  test("holds the picture's content in its order, the news bar first", () => {
    expectInOrder(out, [
      "! Rested for Wednesday's series",
      ...HEAD,
      "58",
      ...PICK_TEAM_KEYS,
      ...PICK_TEAM_META,
      ...PICK_TEAM_STRIP,
      ...TABS,
      "Week", "Series", "Your time", "KST",
      "5", "Sun · T1 v KRX · Bo3", "10:30", "19:30",
      "6", "Wed · T1 v DK · Bo3", "08:00", "17:00",
      "Sat · T1 v HLE · Bo3", "10:30", "19:30",
      ...PICK_TEAM_SEASON,
    ]);
  });

  test("shows no news bar when there is no news", () => {
    expect(text(<PlayerCardPage />)).not.toContain("!");
  });
});

describe("Champions", () => {
  const out = text(<PlayerCardPage initialTab="Champions" />);

  test("holds the picture's content in its order, most games first", () => {
    expectInOrder(out, [
      ...HEAD,
      "58",
      ...PICK_TEAM_KEYS,
      ...TABS,
      "Champion", "Games", "W–L", "Avg pts",
      "Azir", "4", "3–1", "4.8",
      "Galio", "3", "3–0", "5.7",
      "Orianna", "3", "2–1", "4.3",
      "Sylas", "2", "2–0", "4.0",
      "Taliyah", "2", "0–2", "2.5",
      "Ryze", "1", "1–0", "1.0",
      ...PICK_TEAM_SEASON,
    ]);
  });

  test("sorts by games whatever order the data comes in", () => {
    const shuffled = { ...CARD_FROM_PICK_TEAM, champions: [...(CARD_FROM_PICK_TEAM.champions ?? [])].reverse() };
    expectInOrder(text(<PlayerCardPage card={shuffled} initialTab="Champions" />), ["Azir", "Galio", "Sylas", "Ryze"]);
  });
});

describe("the Pick Team keys", () => {
  test("offer Make Carry and show ✓ Vice-carry when he is the Vice-carry", () => {
    const out = text(<PlayerCardPage initialMark="V" />);
    expectInOrder(out, ["Make Carry", "✓ Vice-carry", "Swap with bench"]);
    expect(out).not.toContain("✓ Carry");
  });
});

describe("a tab whose data hasn't come", () => {
  test("shows nothing between the tabs and the Season panel", () => {
    const out = text(<PlayerCardPage initialTab="This week" />);
    expect(out).toContain("ChampionsSeason 15 games");
  });
});

describe("the card's figures", () => {
  test("write places, signed points and transfers", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "101st"]);
    expect([22, -4, 0].map(signed)).toEqual(["+22", "−4", "0"]);
    expect(transfers(1204, 310)).toBe("+1,204 / −310");
  });

  test("open a week on its first row only", () => {
    const rows = [
      { id: "a", week: 4 },
      { id: "b", week: 4 },
      { id: "c", week: 5 },
    ];
    expect([...weekStarts(rows)]).toEqual(["a", "c"]);
  });
});
