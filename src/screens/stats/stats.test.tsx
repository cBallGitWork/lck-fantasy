// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MANAGER } from "../../fixtures/week3";
import { html, text } from "../../testing/render";
import { SEASON_COACHES, SEASON_PLAYERS, SPANS, STATS_BY_SPAN } from "./fixtures";
import { listRows, nextView, pageLabel, pageRows, priceChoices, START_VIEW, type StatsView } from "./stats";
import { StatsPage } from "./StatsPage";

const page = (view: Partial<StatsView>, rows = SEASON_PLAYERS) => (
  <StatsPage account={MANAGER.team} view={{ ...START_VIEW, ...view }} rows={rows} spans={SPANS} onChange={() => {}} />
);

/** The picture's first page of names, in order (stats.html). */
const PICTURE_TOTALS = [
  "Chovy",
  "Faker",
  "Ruler",
  "Peyz",
  "Keria",
  "Canyon",
  "Zeus",
  "Doran",
  "Oner",
  "Gumayusi",
  "Zeka",
  "Kiin",
  "Delight",
  "BuLLDoG",
  "Siwoo",
  "Duro",
  "ShowMaker",
  "Kanavi",
  "Aiming",
  "Pyosik",
];

/** Each row's name, in the order the page shows them. */
const names = (out: string) => [...out.matchAll(/class="stats__name"[^>]*>([^<]+)</g)].map((m) => m[1]);

/** The text of each head cell, in order. */
const heads = (out: string) => [...out.matchAll(/<th[^>]*>(.*?)<\/th>/g)].map((m) => (m[1] ?? "").replace(/<[^>]+>/g, ""));

/** The text of each cell in the row of the named player. */
function cells(out: string, name: string): string[] {
  const row = out.split("<tr").find((r) => r.includes(`>${name}<`)) ?? "";
  return [...row.matchAll(/<td[^>]*>(.*?)<\/td>/g)].map((m) => (m[1] ?? "").replace(/<[^>]+>/g, ""));
}

const inOrder = (out: string, parts: string[]) => {
  let at = 0;
  for (const part of parts) {
    const next = out.indexOf(part, at);
    expect(next, `${part} after ${at}`).toBeGreaterThanOrEqual(0);
    at = next + part.length;
  }
};

describe("players, totals (1440.png)", () => {
  const out = html(page({}));

  test("holds the head, tabs and controls in the picture's order", () => {
    inOrder(text(page({})), [
      "Stats",
      "통계",
      "Patch update ›",
      "Players",
      "Coaches",
      "All",
      "Top",
      "Jungle",
      "Mid",
      "Bot",
      "Support",
      "Team",
      "All",
      "Max price",
      "Any",
      "Span",
      "Season",
      "Totals",
      "Per game",
    ]);
    expect(out).toContain('placeholder="Find a player"');
    expect(out).toContain('data-screen="stats"');
  });

  test("lists the picture's 20 players by points, with its columns", () => {
    expect(names(out)).toEqual(PICTURE_TOTALS);
    expect(heads(out)).toEqual([
      "Player",
      "Price",
      "",
      "Form",
      "Owned",
      "Pts",
      "Games",
      "K",
      "D",
      "A",
      "GD@15",
      "Solo kills",
      "First blood",
      "Deathless",
      "Quadra+",
      "Obj. steals",
    ]);
    expect(out).toMatch(/aria-sort="descending"[^>]*><button[^>]*>Pts</);
  });

  test("Faker's row: rank, team, dot, price and rise, form, owned, Pts, games and lines", () => {
    expect(cells(out, "Faker")).toEqual([
      "2FakerT1",
      "18.5억",
      "0.5",
      "19.3",
      "46%",
      "58",
      "15",
      "66",
      "16",
      "87",
      "10",
      "6",
      "3",
      "3",
      "1",
      "0",
    ]);
    const faker = out.split("<tr").find((r) => r.includes(">Faker<")) ?? "";
    expect(faker).toContain('aria-label="Your player"');
    expect(faker).toContain('class="rise"');
    expect(faker).toContain('href="/player/faker"');
    const doran = out.split("<tr").find((r) => r.includes(">Doran<")) ?? "";
    expect(doran).toContain('class="fall"');
    expect(doran).not.toContain("Your player");
  });

  test("pages beneath: 20 rows a page", () => {
    const total = SEASON_PLAYERS.length;
    expect(text(page({}))).toContain(`1–20 of ${total}`);
    expect(out).toMatch(/aria-label="Page 3"/);
    expect(names(html(page({ page: 2 })))[0]).toBe(listRows(SEASON_PLAYERS, START_VIEW)[20]?.name);
  });
});

describe("players, per game (1440-pergame.png)", () => {
  const out = html(page({ figures: "Per game" }));

  test("divides Pts and every line by games, and re-sorts", () => {
    const perGame = [...SEASON_PLAYERS.slice(0, 20)].sort((a, b) => b.points / b.games - a.points / a.games).map((p) => p.name);
    expect(names(out)).toEqual(perGame);
    expect(cells(out, "Faker")).toEqual([
      "1FakerT1",
      "18.5억",
      "0.5",
      "19.3",
      "46%",
      "3.9",
      "15",
      "4.4",
      "1.1",
      "5.8",
      "0.7",
      "0.4",
      "0.2",
      "0.2",
      "0.1",
      "0.0",
    ]);
    expect(out).toContain('aria-pressed="true">Per game<');
  });
});

describe("coaches (1440-coaches.png)", () => {
  const out = html(page({ tab: "Coaches" }, SEASON_COACHES));

  test("the same frame with the coach lines, no role filter, ten coaches", () => {
    expect(heads(out)).toEqual([
      "Coach",
      "Price",
      "",
      "Form",
      "Owned",
      "Pts",
      "Games",
      "Series",
      "First tower",
      "Most drakes",
      "Most barons",
      "Most elders",
      "Quick wins",
    ]);
    expect(names(out)).toEqual(["kkOma", "Ryu", "Homme", "Ssong", "cvMax", "Score", "Joker", "DanDy", "Edgar", "Mowgli"]);
    expect(out).not.toContain(">Jungle<");
    expect(out).toContain('placeholder="Find a coach"');
    expect(cells(out, "kkOma")).toEqual(["1kkOmaT1", "7.0억", "", "9.0", "24%", "27", "15", "5–1", "6", "5", "5", "0", "2"]);
    expect(out).toContain('href="/coach/kkoma"');
  });
});

describe("the controls work on the list", () => {
  const list = (view: Partial<StatsView>, rows = SEASON_PLAYERS) => listRows(rows, { ...START_VIEW, ...view }).map((r) => r.name);

  test("role, team, max price and search filter", () => {
    expect(list({ role: "mid" }).slice(0, 3)).toEqual(["Chovy", "Faker", "Zeka"]);
    expect(list({ team: "T1" }).slice(0, 5)).toEqual(["Faker", "Peyz", "Keria", "Doran", "Oner"]);
    const upTo12 = listRows(SEASON_PLAYERS, { ...START_VIEW, maxPrice: 12 });
    expect(upTo12.length).toBeGreaterThan(0);
    expect(upTo12.every((r) => r.priceEok <= 12)).toBe(true);
    expect(list({ search: "  fAk " })).toEqual(["Faker"]);
    expect(priceChoices(SEASON_PLAYERS)[0]).toBe(18.5);
  });

  test("a column sorts highest first; academy players stay last", () => {
    expect(list({ sort: "kills" }).slice(0, 2)).toEqual(["Ruler", "Peyz"]);
    const last = list({ sort: "deaths" }).slice(-4);
    expect(last).toEqual(["Smash", "Guwon", "Sajin", "Sylvie"]);
  });

  test("span shows one week, its games adding up to the season", () => {
    const weeks = SPANS.slice(1).map((s) => STATS_BY_SPAN[s.value]?.players.find((p) => p.name === "Faker"));
    expect(weeks.reduce((n, w) => n + (w?.games ?? 0), 0)).toBe(15);
    expect(weeks.reduce((n, w) => n + (w?.points ?? 0), 0)).toBe(58);
    expect(weeks[2]?.games).toBe(5);
    const coach = STATS_BY_SPAN["week-3"]?.coaches.find((c) => c.name === "kkOma");
    expect(coach?.series).toEqual([2, 0]);
  });

  test("a change starts at page 1; a tab without the sorted column sorts by points", () => {
    expect(nextView({ ...START_VIEW, page: 3 }, { team: "GEN" }).page).toBe(1);
    expect(nextView({ ...START_VIEW, page: 1 }, { page: 2 }).page).toBe(2);
    expect(nextView({ ...START_VIEW, sort: "kills" }, { tab: "Coaches" }).sort).toBe("points");
    expect(nextView({ ...START_VIEW, sort: "form" }, { tab: "Coaches" }).sort).toBe("form");
  });

  test("the count beneath, and each row's rank across pages", () => {
    expect(pageLabel(104, 1)).toBe("1–20 of 104");
    expect(pageLabel(45, 3)).toBe("41–45 of 45");
    expect(pageLabel(0, 1)).toBe("");
    expect(pageRows(listRows(SEASON_PLAYERS, START_VIEW), 2)[0]?.rank).toBe(21);
  });
});
