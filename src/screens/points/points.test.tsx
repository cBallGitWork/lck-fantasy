// @vitest-environment node
import { expect, test } from "vitest";
import { VIEW_KEYS } from "../../parts";
import { PATHS } from "../../paths";
import { expectInOrder, html, htmlAt, text } from "../../testing/render";
import { blockedStorage, chosenView, keptStorage, stubStorage } from "../../testing/storage";
import { MY_SEASON_TOTAL } from "../../fixtures/myLeagues";
import { MY_EARLIER_WEEKS, MY_WEEK3 } from "../../fixtures/week3";
import { LATEST_WEEK, POINTS_FIXTURE, POINTS_WEEKS } from "./fixtures";
import { weekOf } from "./index";
import { LINE, LIVE_SERIES_ID, WEEK3_FINAL_SQUAD, weekGamesOf, type Kda, type LineWord } from "../../fixtures/week3";
import type { PointsPlayer } from "./types";
import { PointsPage } from "./PointsPage";

// The picture's moment: Saturday, T1 v DK live, Faker's breakdown open (points.html, breakdown.html).
const PICTURE = <PointsPage data={POINTS_FIXTURE} open="Faker" />;

test("the picture's state holds its head, Rift, bench and side column, in its order", () => {
  expectInOrder(text(PICTURE), [
    "Baron Steal FC",
    "바론 스틸 FC",
    "Split 1 · Week 3",
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
    "✕Faker",
    "Full stats ›",
    "Leagues",
    "Overall · Emerald I48,2116,904",
    "United Kingdom1,402233",
    "T1 supporters3,118510",
    "Pub League2nd1",
    "Flol Discord14th2",
    "≈6 pts to Diamond IV",
    "All leagues ›",
    "This week's seriesWedT1 v HLE2–1",
    "SatGEN v HLE2–1 Not final",
    "SatT1 v DK1–0 Live",
    "SunKRX v BRO08:00",
    "SunBFX v DNS10:30",
    "Your week",
    "StarFaker25 · owned by 46%",
    "FlopSiwoo8 · owned by 6%",
    "KillerChovy15 · not yours · owned by 41%",
    "Sponsor",
    "All sponsors are made up.",
  ]);
});

test("the picture's state boxes the counted games, greys the dropped one and marks Faker chosen", () => {
  const out = html(PICTURE);
  expect(out.match(/points__breakdown-counted/g)).toHaveLength(4);
  expect(out.match(/points__breakdown-game--dropped/g)).toHaveLength(1);
  expect(out).toContain('role="dialog"');
  expect(out.match(/tile--selected/g)).toHaveLength(1);
  expect(out).toContain('aria-pressed="true"');
  // Rank moves: four up, one down.
  expect(out.match(/rank-up/g)).toHaveLength(4);
  expect(out.match(/rank-down/g)).toHaveLength(1);
});

test("the Captain shows only his result, and no one's tile, card or games show an auto-sub line", () => {
  for (const view of ["Rift view", "Card view"] as const) {
    const out = text(<PointsPage data={POINTS_FIXTURE} view={view} open="Faker" />);
    expect(out).not.toMatch(/×|Subbed in/);
  }
});

test("Live shows on the head's bar, the open game's row and the week's series, never on a tile or a series result", () => {
  const out = text(PICTURE);
  // The top bar's Live item, then the three.
  expect(out.match(/Live/g)).toHaveLength(4);
  expectInOrder(out, ["Live", "T1 v DK, game 2", "Sat v DK 1–0 ›", "G2SylasLive 14:20", "SatT1 v DK1–0 Live"]);
  expect(out).not.toMatch(/game \d live/);
});

test("each series on the sheet opens its Series page: day, opponent and result, then ›", () => {
  const out = html(PICTURE);
  expect(out).toContain('href="/series/w3-wed-1"');
  expect(out).toContain('href="/series/w3-sat-2"');
  expectInOrder(text(PICTURE), ["Wed v HLE W 2–1 ›", "Sat v DK 1–0 ›"]);
});

test("the links go where the README says: Highest, Watch, Full stats, All leagues", () => {
  const out = html(PICTURE);
  expect(out).toContain('href="/perfect-game"');
  expect(out).toContain('href="/live"');
  expect(out).toContain('href="/player/faker"');
  expect(out).toContain('href="/leagues"');
});

test("the sheet stays closed until a player is tapped", () => {
  const out = text(<PointsPage data={POINTS_FIXTURE} />);
  expect(out).not.toContain("Full stats");
  expect(html(<PointsPage data={POINTS_FIXTURE} />)).not.toContain('role="dialog"');
  expectInOrder(out, ["Bench", "Cuzz9", "Your week"]);
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

test("the fixture's total is its starters' points: 94, the Captain's 25 among them, as the shared Week 3 gives them", () => {
  const { starters, total } = POINTS_FIXTURE;
  expect(total).toBe(MY_WEEK3.liveTotal);
  expect(starters.map((p) => p.points)).toEqual([14, 14, 25, 14, 9, 8, 10]);
  expect(Object.fromEntries(starters.map((p) => [p.cardId, p.points]))).toEqual(MY_WEEK3.live);
  const faker = starters.find((p) => p.mark === "C");
  expect(faker?.captain).toEqual({ average: 19 });
});

test("Points opens on Rift the first time, then on the view shared with Pick Team, and on Rift where storage is blocked", async () => {
  expect(chosenView(await htmlAt(PATHS.points))).toBe("Rift view");
  stubStorage(keptStorage({ [VIEW_KEYS.board]: "Card view", [VIEW_KEYS.transfers]: "List view" }));
  expect(chosenView(await htmlAt(PATHS.points))).toBe("Card view");
  stubStorage(blockedStorage);
  expect(chosenView(await htmlAt(PATHS.points))).toBe("Rift view");
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
  expect(head(1)).toContain('<button type="button" class="week-arrow key-off" aria-label="Previous week" disabled="">‹</button>');
  expect(head(1)).toContain('href="/points/2"');
  expect(head(2)).toContain('href="/points/1"');
  expect(head(2)).toContain('href="/points/3"');
  expect(head(3)).toContain('href="/points/2"');
  expect(head(3)).toContain('<button type="button" class="week-arrow key-off" aria-label="Next week" disabled="">›</button>');
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
    expect(out).toContain(`Split 1 · Week ${n}`);
    expect(out.match(/Final/g)).toHaveLength(1);
    expect(out).not.toMatch(/Not final|· final|Watch/);
    // Only the top bar's Live item.
    expect(out.match(/Live/g)).toHaveLength(1);
  }
});

test("Weeks 1 and 2 add up: each total its starters', the Captain's ×1.5 rounded down, Star the top and Flop the lowest", () => {
  const w1 = week(1);
  expect(w1.starters.map((p) => p.points)).toEqual([15, 14, 27, 16, 9, 6, 9]);
  expect(w1.total).toBe(96);
  expect(w1.yourWeek.map((p) => `${p.label} ${p.name} ${p.points}`)).toEqual(["Star Faker 27", "Flop Siwoo 6", "Killer Chovy 22"]);
  const w2 = week(2);
  expect(w2.starters.map((p) => p.points)).toEqual([15, 15, 30, 15, 9, 13, 15]);
  expect(w2.total).toBe(112);
  expect(w2.yourWeek.map((p) => `${p.label} ${p.name} ${p.points}`)).toEqual(["Star Faker 30", "Flop Delight 9", "Killer Peyz 19"]);
  // A final week: no Not final on the sheet; Weeks 1 and 2 have no lines, so the rows show W or L and points.
  const out = text(<PointsPage data={w2} open="kkOma" />);
  expectInOrder(out, ["T1 · Coach15", "v DNS W 2–0 ›7", "G1W2", "G2W2", "Series win+3", "v BFX W 2–1 ›8", "G1W2", "G2L0", "G3W3", "Series win+3"]);
});

test("Leagues' season total is Points' weeks: Weeks 1 and 2 final, and Week 3 so far", () => {
  expect(MY_EARLIER_WEEKS).toEqual([week(1).total, week(2).total]);
  expect(MY_SEASON_TOTAL).toBe(week(1).total + week(2).total + POINTS_FIXTURE.total);
});

/** spec/05's player table, per game: kills per 2 for tops and supports, else per 3; assists per 5; deaths per 3, per 4 for supports. */
function playerGame(role: string, [k, d, a]: Kda, lines: readonly LineWord[], live: boolean) {
  const kills = Math.min(3, Math.floor(k / (role === "top" || role === "sup" ? 2 : 3)));
  const assists = Math.min(3, Math.floor(a / 5));
  const deaths = Math.min(3, Math.floor(d / (role === "sup" ? 4 : 3)));
  // Deathless only once a game is over and he never died.
  expect(lines.includes(LINE.deathless), `Deathless at ${k}/${d}/${a}`).toBe(d === 0 && !live);
  return kills + assists - deaths + lines.length;
}

test("each Week 3 game's points are what spec/05 gives its K/D/A and lines; a coach's, his lines", () => {
  const squad: (PointsPlayer & { plays?: string })[] = [...POINTS_FIXTURE.starters, ...POINTS_FIXTURE.bench];
  for (const p of squad) {
    for (const s of p.series) {
      for (const g of s.games) {
        const live = g.clock !== undefined;
        const worked = g.kda ? playerGame(p.plays ?? p.role, g.kda, g.lines, live) : g.lines.length;
        expect(worked, `${p.name} v ${s.opponent} G${g.game}`).toBe(g.points);
        if (p.role !== "coach") expect(g.kda, `${p.name}'s K/D/A`).toBeDefined();
      }
    }
  }
});

test("T1 v DK's finished games score what Week 3's final squad gives them", () => {
  for (const pick of WEEK3_FINAL_SQUAD.filter((p) => p.series.some((s) => s.id === LIVE_SERIES_ID))) {
    const final = pick.series.find((s) => s.id === LIVE_SERIES_ID)!;
    const worked = weekGamesOf(pick.name, LIVE_SERIES_ID, true).map((g) => (g.kda ? playerGame(pick.role, g.kda, g.lines, false) : g.lines.length));
    expect(worked, pick.name).toEqual(final.games);
  }
});

test("the sheet shows the picture: Faker's crest, name, hangul and C, his 25, then each series over its games", () => {
  expect(html(PICTURE)).toContain('alt="T1 crest"');
  expectInOrder(text(PICTURE), [
    "Faker이상혁C",
    "T1 · Mid",
    "25Not final · Captains averaged 19",
    "Wed v HLE W 2–1 ›12",
    "G1AzirW6/1/9Gold · Solo5",
    "G2TaliyahL2/4/5Gold · First blood2",
    "G3GalioW4/0/14Gold · First blood · Solo · Deathless7",
    "Sat v DK 1–0 ›5",
    "G1OriannaW5/2/8Gold · First blood4",
    "G2SylasLive 14:201/0/2Solo1",
    "Full stats ›",
  ]);
});

test("a held league rank is RankMove's grey —, never ▲ 0", () => {
  const held = { ...POINTS_FIXTURE, leagues: POINTS_FIXTURE.leagues.map((l) => ({ ...l, move: 0 })) };
  const markup = html(<PointsPage data={held} />);
  expect(markup.split('class="rank-held"').length - 1).toBe(held.leagues.length);
  expect(markup).not.toMatch(/rank-(up|down)/);
});
