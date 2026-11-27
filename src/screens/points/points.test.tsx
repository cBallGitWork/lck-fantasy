// @vitest-environment node
import { expect, test } from "vitest";
import { VIEW_KEYS } from "../../parts";
import { PATHS } from "../../paths";
import { expectInOrder, html, htmlAt, text } from "../../testing/render";
import { blockedStorage, chosenView, keptStorage, stubStorage } from "../../testing/storage";
import { MY_WEEK3 } from "../../fixtures/week3";
import { LATEST_WEEK, POINTS_FIXTURE, POINTS_WEEKS } from "./fixtures";
import { weekOf } from "./index";
import type { PointsSeries } from "./types";
import { PointsPage } from "./PointsPage";

// The picture's moment (approved/points/1440.png, points.html): Saturday, T1 v DK live, the page as it opens on the Captain's week.
const PICTURE = <PointsPage data={POINTS_FIXTURE} />;

test("the picture's state holds its head, Rift, Total, bench, the Captain's week and the side column, in its order", () => {
  expectInOrder(text(PICTURE), [
    "Baron Steal FC",
    "바론 스틸 FC",
    "‹Split 1 Week 3›",
    "Rift view",
    "Card view",
    "TopHLE Zeus14",
    "JungleGEN Canyon14",
    "MidCT1 Faker25",
    "BotGEN Ruler14",
    "SupportHLE Delight 🎂9",
    "FlexDK Siwoo8",
    "CoachT1 kkOma10",
    "Total94",
    "Not final",
    "Average74",
    "Highest121 ›",
    "Live",
    "T1 v DK, game 2",
    "Watch ›",
    "Bench",
    "1. MidKT Bdd—Didn't play",
    "2. JungleKT Cuzz9",
    "MidT1 Faker이상혁C17 ×1.5 · Captains averaged 1925",
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
    "T1 v DK1–0 Live",
    "SunKRX v BRO8:00am",
    "BFX v DNS10:30am",
    "Your weekPtsOwned",
    "StarT1 Faker2546%",
    "FlopDK Siwoo86%",
    "KillerGEN Chovy1541%",
    "Sponsor",
    "All sponsors are made up.",
  ]);
});

test("the picture's state boxes the counted games, greys the dropped one, docks the card and marks Faker chosen", () => {
  const out = html(PICTURE);
  expect(out.match(/rift-card__points num counted/g)).toHaveLength(4);
  expect(out.match(/points__card-game--dropped/g)).toHaveLength(1);
  expect(out).not.toContain('role="dialog"');
  expect(out.match(/tile--selected/g)).toHaveLength(1);
  expect(out).toContain('aria-pressed="true"');
  // The card's results: W outlined green, L red, Live filled.
  expect(out.match(/result-chip--w"/g)).toHaveLength(4);
  expect(out.match(/result-chip--l"/g)).toHaveLength(1);
  expect(out.match(/result-chip--live/g)).toHaveLength(2);
  // Rank moves: four up, one down.
  expect(out.match(/rank-up/g)).toHaveLength(4);
  expect(out.match(/rank-down/g)).toHaveLength(1);
});

test("Your week's Star, Flop and Killer each carry their mark before the word, and the player his team's bar", () => {
  const panel = html(<PointsPage data={POINTS_FIXTURE} />).split("points__picks")[1]!;
  expect(panel.match(/fact-mark--(\w+)/g)).toEqual(["fact-mark--star", "fact-mark--flop", "fact-mark--killer"]);
  expect(panel.match(/class="team-bar"/g)).toHaveLength(3);
});

test("the Captain's ×1.5 shows once, on his card; no tile shows it, and nothing shows an auto-sub line", () => {
  for (const view of ["Rift view", "Card view"] as const) {
    const out = text(<PointsPage data={POINTS_FIXTURE} view={view} />);
    expect(out.match(/×/g)).toHaveLength(1);
    expect(out.match(/Captains averaged/g)).toHaveLength(1);
    expect(out).not.toMatch(/Subbed in/);
  }
});

test("a tile's band is the week's total alone; with a series still to come, the total so far and that opponent", () => {
  const zeus = POINTS_FIXTURE.starters[0]!;
  const coming: PointsSeries = { id: "w3-sun-9", day: "Sun", opponent: "GEN", score: [0, 0], state: "next", points: 0, games: [] };
  const data = { ...POINTS_FIXTURE, starters: POINTS_FIXTURE.starters.map((p) => (p === zeus ? { ...zeus, series: [...zeus.series, coming] } : p)) };
  const out = text(<PointsPage data={data} />);
  expectInOrder(out, ["TopHLE Zeus14, v GEN", "JungleGEN Canyon14Mid"]);
  // Faker's live series is under way: his total alone.
  expect(out).toContain("MidCT1 Faker25Bot");
  expect(out.match(/, v /g)).toHaveLength(1);
});

test("Live shows in Total, on the card's live series and game, and in the week's series, never on a tile", () => {
  const out = text(PICTURE);
  // The top bar's Live item, then the four.
  expect(out.match(/Live/g)).toHaveLength(5);
  expectInOrder(out, ["Live", "T1 v DK, game 2", "Satv DK ›Live 1–0", "G2LiveSylas14:20", "T1 v DK1–0 Live"]);
  expect(out).not.toMatch(/game \d live/);
});

test("each series on the card opens its Series page: day, the opponent's crest, `v HLE ›`, then its result", () => {
  const out = html(PICTURE);
  expect(out).toContain('href="/series/w3-wed-1"');
  expect(out).toContain('href="/series/w3-sat-2"');
  expect(out).toContain('alt="HLE crest"');
  expectInOrder(text(PICTURE), ["Wedv HLE ›W 2–1", "Satv DK ›Live 1–0"]);
});

test("the links go where the README says: Highest, Watch, Full stats, All leagues", () => {
  const out = html(PICTURE);
  expect(out).toContain('href="/perfect-game"');
  expect(out).toContain('href="/live"');
  expect(out).toContain('href="/player/faker"');
  expect(out).toContain('href="/leagues"');
});

test("the tier line: the promote line; at Challenger, the room over Grandmaster; none while Unranked (spec/08)", () => {
  const atChallenger = { ...POINTS_FIXTURE, tierLine: { to: "demote" as const, points: 4, tier: { tier: "grandmaster" as const, division: null } } };
  expect(text(<PointsPage data={atChallenger} />)).toContain("≈4 pts clear of Grandmaster");
  const unranked = { ...POINTS_FIXTURE, tierLine: null };
  expect(html(<PointsPage data={unranked} />)).not.toContain("points__tier");
});

test("the Rift, its panels and the card stay on screen while the side column scrolls", () => {
  expect(html(PICTURE)).toContain("page-frame--stick");
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
  expect(faker?.captain).toEqual({ before: 17, by: 1.5, average: 19 });
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
  const head = (n: number) => html(<PointsPage data={week(n)} />).split('class="points__views"')[0] ?? "";
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

test("a final week says Final once, as Total's tag (Craig, 16 Nov 2026): no Not final, no Live, no live game", () => {
  for (const n of [1, 2]) {
    const data = week(n);
    expect(data.final).toBe(true);
    const out = text(<PointsPage data={data} />);
    expect(out).toContain(`Split 1 Week ${n}`);
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
  // A final week: Weeks 1 and 2 have no lines, so the rows show W or L and points.
  const out = text(<PointsPage data={w2} open="kkOma" />);
  expectInOrder(out, ["CoachT1 kkOma", "15GameScoredPts", "v DNS ›W 2–07", "G1W2", "G2W2", "Series win+3", "v BFX ›W 2–18", "G1W2", "G2L0", "G3W3", "Series win+3"]);
});

test("the card shows the picture: Faker's crest, role, team, name, hangul and C, the working once, his 25, then each series over its games", () => {
  expect(html(PICTURE)).toContain('alt="T1 crest"');
  expectInOrder(text(PICTURE), [
    "MidT1 Faker이상혁C",
    "17 ×1.5 · Captains averaged 19",
    "25",
    "GameKDAScoredPts",
    "Wedv HLE ›W 2–112",
    "G1WAzir619Gold lead · Solo5",
    "G2LTaliyah245Gold lead · First blood2",
    "G3WGalio4014Gold lead · First blood · Solo · Deathless7",
    "Satv DK ›Live 1–05",
    "G1WOrianna528Gold lead · First blood4",
    "G2LiveSylas14:20102Solo1",
    "Full stats ›",
  ]);
});

test("a held league rank is RankMove's grey —, never ▲ 0", () => {
  const held = { ...POINTS_FIXTURE, leagues: POINTS_FIXTURE.leagues.map((l) => ({ ...l, move: 0 })) };
  const markup = html(<PointsPage data={held} />);
  expect(markup.split('class="rank-held"').length - 1).toBe(held.leagues.length);
  expect(markup).not.toMatch(/rank-(up|down)/);
});
