// @vitest-environment node
import { describe, expect, test } from "vitest";
import { expectInOrder, html, text } from "../../testing/render";
import { CARD_FROM_PICK_TEAM, CARD_FROM_POINTS, CARD_WITH_NEWS } from "./fixtures";
import { PlayerCardPage } from ".";
import { weekStarts } from "./WeekCell";

const HEAD = ["Mid · T1", "Faker", "이상혁", "Lee Sang-hyeok"];
const STRIP_NEXT = ["W4 · Wed · Bo3", "v KT", "W4 · Sat · Bo3", "v GEN", "W5 · Thu · Bo3", "v BRO"];
const TABS = ["This week", "Fixtures", "History", "Champions"];
const PICK_TEAM_KEYS = ["✓ Captain", "Swap with bench", "Transfer out", "Compare ›"];
const PICK_TEAM_META = ["₩18.5m", "price 0.5", "19.3", "form · 2nd", "46%", "owned · 1st", "+1,204 / −310 this week"];
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
      "Split 1 2027",
      "Week", "Series", "Games", "K / D / A", "Price", "Pts", "Week",
      "2", "Wed · W 2–0 DNS", "14/4/16", "₩18.0m", "12", "22",
      "1", "Sat · W 2–0 NS", "9/3/11", "₩17.5m", "11", "14",
      "Wed · L 1–2 GEN", "7/9/10", "3",
      "Past seasons", "LCK, scored by Flol",
      "Season", "Games", "K / D / A", "Per game", "Pts",
      "LCK 2026", "98", "392/171/598", "4.2", "412",
      "LCK 2025", "104", "405/188/611", "4.4", "455",
      ...PICK_TEAM_SEASON,
    ]);
  });

  test("shows each week's price and total once, on its first row", () => {
    expect(out.match(/₩17\.5m/g)).toHaveLength(1);
    expect(out.match(/₩18\.0m/g)).toHaveLength(1);
  });

  test("marks History as the chosen tab", () => {
    expect(html(<PlayerCardPage />)).toMatch(/aria-selected="true"[^>]*>History</);
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
      "₩18.5m", "price 0.5", "18.0", "form · 1st", "46%", "owned · 1st", "+842 / −126 this week",
      "W2 · Fri", "10", "v BFX", "W3 · Wed", "12", "v HLE", "W3 · Sat", "5", "Live", "v DK",
      ...STRIP_NEXT,
      ...TABS,
      "Wed · v HLE", "W 2–1", "12",
      "G1", "Azir", "· W", "6/1/9", "5",
      "G2", "Taliyah", "· L", "2/4/5", "2",
      "G3", "Galio", "· W", "4/0/14", "7",
      "Sat · v DK", "1–0", "5",
      "G1", "Orianna", "· W", "5/2/8", "4",
      "G2", "Sylas", "· 14:20", "1/0/2", "1",
      "Week 3", "17 × 1.5 Captain", "25",
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
  test("offer one mark key, the Captain's", () => {
    const out = text(<PlayerCardPage />);
    expectInOrder(out, ["✓ Captain", "Swap with bench"]);
    expect(out).not.toContain("Make ");
  });
});

describe("a tab whose data hasn't come", () => {
  test("shows nothing between the tabs and the Season panel", () => {
    const out = text(<PlayerCardPage initialTab="This week" />);
    expect(out).toContain("ChampionsSeason 15 games");
  });
});

describe("the card's week rows", () => {
  test("open a week on its first row only", () => {
    const rows = [
      { id: "a", week: 4 },
      { id: "b", week: 4 },
      { id: "c", week: 5 },
    ];
    expect([...weekStarts(rows)]).toEqual(["a", "c"]);
  });
});
