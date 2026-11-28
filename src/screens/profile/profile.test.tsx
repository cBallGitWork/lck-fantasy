// @vitest-environment node
import { describe, expect, test } from "vitest";
import { HIT_POINTS, MANAGER } from "../../fixtures/week3";
import { expectInOrder, html, text } from "../../testing/render";
import { PROFILE, type ProfileData } from "./fixtures";
import { nextFollow, Profile, type ProfileTab } from ".";

const page = (tab: ProfileTab, data: ProfileData = PROFILE, week?: number) => (
  <Profile data={data} account={MANAGER.team} initialTab={tab} initialWeek={week} />
);

// Her tier by her name, from the tier function: 21,804th of the shared Overall's 712,480 is the top
// 3.06%, Diamond III (2.4% to 3.3%).
const BANNER = ["쵸비는 바로 거기 있었다", "Chovy Was Right There", "Minji Park", "Diamond III", "다이아몬드 3", "21,804", "3,112", "Following ✓", "Points", "History", "Transfers"];
const LEAGUES = ["Leagues", "Overall", "21,804", "3,112", "South Korea", "2,310", "402", "GEN supporters", "1,977", "288", "Pub League", "3", "1"];

describe("Points", () => {
  const out = text(page("Points"));

  test("shows the banner, the tabs, Week 3's head, her team in role order, the bench, leagues, cheers and jeers", () => {
    expectInOrder(out, [
      ...BANNER,
      "‹",
      "Week 3",
      "›",
      "93",
      "Average 79",
      "Highest 128 ›",
      "Not final",
      "Bench Boost",
      "Slot",
      "Player",
      "Pts",
      "Series",
      "Top", "Kiin", "GEN", "11", "v KT 2–0 · Wed", "v HLE 2–1 · Sat",
      "Jungle", "Canyon", "14",
      "Mid", "Chovy", "17",
      "Bot", "Ruler", "C", "21",
      "Support", "Keria", "T1", "9", "v HLE 2–1 · Wed", "v DK 2–0 · Sat",
      "Flex · Top", "Kingen", "NS", "5", "v DK 0–2 · Thu", "v KRX 0–2 · Fri",
      "Coach", "kkOma", "16",
      "Bench",
      "Bench 1 · Mid", "Bdd", "KT", "—", "Not in KT's lineup",
      "Bench 2 · Jungle", "Cuzz", "9", "v GEN 0–2 · Wed", "v BFX 2–1 · Fri",
      ...LEAGUES,
      "Cheers and jeers · Week 3", "2",
      "The template was right there, mate.", "Jeer from Dan Okafor", "Truck hire by Sponsor",
      "This coffee is Keria-tier support.", "Cheer from Jae Kim", "Truck hire by Sponsor",
      "All sponsors are made up.",
    ]);
  });

  test("is the profile screen, Points chosen, the week before a key and the week after a disabled key", () => {
    const markup = html(page("Points"));
    expect(markup).toContain('data-screen="profile"');
    expect(markup).toMatch(/aria-selected="true"[^>]*>Points</);
    expect(markup).toContain('aria-label="Previous week"');
    expect(markup).toContain('<button type="button" class="week-arrow key-off" aria-label="Next week" disabled="">›</button>');
  });

  test("her team is the Table part's, Bench a sub-row above the bench", () => {
    expect(html(page("Points"))).toMatch(/<tr class="table__sub"><td colSpan="4">Bench<\/td><\/tr><tr><td><small>Bench 1 · Mid/);
  });

  test("links each player to his card, the coach to the coach card, Highest to Perfect game and each league to its table", () => {
    const markup = html(page("Points"));
    expect(markup).toContain('href="/player/kiin"');
    expect(markup).toContain('href="/coach/kkoma"');
    expect(markup).not.toContain('href="/player/kkoma"');
    expect(markup).toContain('href="/perfect-game"');
    for (const id of ["overall", "south-korea", "gen-supporters", "pub-league"]) expect(markup).toContain(`href="/leagues/${id}"`);
  });

  test("draws each cheer and jeer on the shared LED panel", () => {
    expect(html(page("Points"))).toContain('<div class="led">The template was right there, mate.</div>');
  });

  test("an earlier week shows its points, its team loading until the backend feeds it, and no cheers or jeers", () => {
    const week2 = text(page("Points", PROFILE, 2));
    expectInOrder(week2, ["Week 2", "112"]);
    expect(week2).not.toContain("Not final");
    expect(week2).not.toContain("Cheers and jeers");
    expect(html(page("Points", PROFILE, 2))).toContain("Loading Week 2&#x27;s team");
  });
});

describe("History", () => {
  test("shows each week's row, newest first, then the buffs left", () => {
    expectInOrder(text(page("History")), [
      ...BANNER,
      "Week", "Pts", "Total", "Week rank", "Overall rank", "Rank move", "Transfers", "Cost", "Bank", "Value", "Buff",
      "Week 3", "93", "315", "—", "21,804", "3,112", "5", `−${3 * HIT_POINTS}`, "₩0.5m", "₩100.9m", "Bench Boost", "›",
      "Week 2", "112", "222", "4,211", "24,916", "9,870", "1", "—", "₩1.0m", "₩100.6m", "—", "›",
      "Week 1", "110", "110", "34,786", "34,786", "—", "—", "—", "₩2.5m", "₩100.0m", "—", "›",
      "Buffs left: Double Captain · Coach Diff",
      ...LEAGUES,
    ]);
  });

  test("each row opens its week; the side has no cheers or jeers", () => {
    const markup = html(page("History"));
    expect(markup).toContain('aria-label="Open Week 1"');
    expect(markup).not.toContain("Cheers and jeers");
  });

  test("Past seasons, under the weeks, one row a season: Season, Tier, Rank; hidden until a season has ended (spec/08)", () => {
    expect(text(page("History"))).not.toContain("Past seasons");
    const ended: ProfileData = { ...PROFILE, pastSeasons: [{ season: "LCK 2027", tier: { tier: "diamond", division: 2 }, rank: 2_104 }] };
    expectInOrder(text(page("History", ended)), ["Buffs left: Double Captain · Coach Diff", "Past seasons", "Season", "Tier", "Rank", "LCK 2027", "Diamond II", "2,104th", "Leagues"]);
    expect(html(page("History", ended))).toContain('<span class="tier-tag"><svg class="tier-shield tier-ink--diamond tier-tag__shield"');
  });
});

describe("her tier", () => {
  test("shows by her team name in the banner, once: not again in the Leagues column (spec/08)", () => {
    const markup = html(page("Points"));
    expect(markup.match(/<svg class="tier-shield/g)).toHaveLength(1);
    expect(markup).toContain('<div class="tier-mark profile__tier">');
  });

  test("Unranked: the outlined shield and its word, no rank line", () => {
    const unranked: ProfileData = { ...PROFILE, manager: { ...PROFILE.manager, overall: { tier: { tier: "unranked" }, rank: null, move: null } } };
    expectInOrder(text(page("Points", unranked)), ["Minji Park", "Unranked", "Following ✓"]);
    expect(html(page("Points", unranked))).not.toContain("tier-mark__rank");
  });
});

describe("Transfers", () => {
  test("shows each week's swaps by slot, out → in with team and price, then points gained", () => {
    expectInOrder(text(page("Transfers")), [
      ...BANNER,
      "Slot", "Out", "In", "Pts gained",
      "Week 3", "Tue 9:00am", "Bench Boost · 3 hits",
      "Top", "Doran", "T1 · ₩13.0m", "→", "Kiin", "GEN · ₩13.5m", "+1",
      "Bot", "Peyz", "T1 · ₩13.0m", "→", "Ruler", "GEN · ₩16.0m", "+4",
      "Support", "Lehends", "NS · ₩10.0m", "→", "Keria", "T1 · ₩12.0m", "−1",
      "Flex", "Siwoo", "DK · ₩11.0m", "→", "Kingen", "NS · ₩6.0m", "−4",
      "Jungle", "Peanut", "NS · ₩15.5m", "→", "Canyon", "GEN · ₩15.5m", "+2",
      "Week 2", "Mon 12:40pm", "1 free",
      "Bot", "Smash", "T1 · ₩6.0m", "→", "Peyz", "T1 · ₩13.0m", "+6",
      ...LEAGUES,
    ]);
  });

  test("is the Table part's, each week a sub-row with its cost on the right", () => {
    const markup = html(page("Transfers"));
    expect(markup.match(/<tr class="table__sub"><td colSpan="6"><b>Week \d<\/b>/g)).toHaveLength(2);
    expect(markup).toContain('<span class="table__sub-aside">Bench Boost · 3 hits</span>');
  });
});

describe("the follow key", () => {
  const as = (follow: ProfileData["manager"]["follow"]) => text(page("Points", { ...PROFILE, manager: { ...PROFILE.manager, follow } }));

  test("reads Follow, Requested or Following, and is absent on your own profile", () => {
    expect(as("follow")).toContain("Follow");
    expect(as("follow")).not.toContain("Following");
    expect(as("requested")).toContain("Requested");
    expect(as("self")).not.toMatch(/Follow|Requested/);
  });

  test("Following unfollows; Follow requests; Requested cancels, back to Follow", () => {
    expect(nextFollow("following")).toBe("follow");
    expect(nextFollow("follow")).toBe("requested");
    expect(nextFollow("requested")).toBe("follow");
  });

  test("Requested is a live key, with no confirm", () => {
    const markup = html(page("Points", { ...PROFILE, manager: { ...PROFILE.manager, follow: "requested" } }));
    expect(markup).not.toMatch(/disabled=""[^>]*>Requested</);
    expect(markup).not.toMatch(/confirm/i);
  });
});

test("every league rank is a plain number, a private league's too", () => {
  const out = text(page("Points"));
  expectInOrder(out, ["Overall", "21,804", "Pub League", "3"]);
  expect(out).not.toMatch(/\d(st|nd|rd|th)\b/);
});

test("History's Cost is the points a week's transfers took, — for none", () => {
  const week1 = (cost?: number) => text(page("History", { ...PROFILE, history: PROFILE.history.filter((r) => r.week === 1).map((r) => ({ ...r, transfers: 2, cost })) }));
  expectInOrder(week1(HIT_POINTS), ["Week 1", "110", "110", "34,786", "34,786", "—", "2", `−${HIT_POINTS}`, "₩2.5m"]);
  expectInOrder(week1(), ["Week 1", "110", "110", "34,786", "34,786", "—", "2", "—", "₩2.5m"]);
});

test("a held rank, in Leagues or History, is RankMove's grey —", () => {
  const held: ProfileData = {
    ...PROFILE,
    manager: { ...PROFILE.manager, overall: { ...PROFILE.manager.overall, move: 0 } },
    leagues: PROFILE.leagues.map((l) => ({ ...l, move: 0 })),
    history: PROFILE.history.map((r) => ({ ...r, move: 0 })),
  };
  expect(html(page("Points", held))).toContain('<span class="rank-held">—</span>');
  const history = html(page("History", held));
  expect(history).toContain('<span class="rank-held">—</span>');
  expect(history).not.toMatch(/rank-(up|down)/);
});
