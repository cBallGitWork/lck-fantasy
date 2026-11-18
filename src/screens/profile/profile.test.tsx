// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MANAGER } from "../../fixtures/week3";
import { expectInOrder, html, text } from "../../testing/render";
import { PROFILE, type ProfileData } from "./fixtures";
import { nextFollow, Profile, type ProfileTab } from ".";

const page = (tab: ProfileTab, data: ProfileData = PROFILE, week?: number) => (
  <Profile data={data} account={MANAGER.team} initialTab={tab} initialWeek={week} />
);

const BANNER = ["쵸비는 바로 거기 있었다", "Chovy Was Right There", "Minji Park", "Following ✓", "Points", "History", "Transfers"];
const LEAGUES = ["Leagues", "Overall", "Emerald I", "21,804", "3,112", "South Korea", "2,310", "402", "GEN supporters", "1,977", "288", "Pub League", "3rd", "1"];

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
    expect(markup).toContain('aria-label="Week before"');
    expect(markup).toContain('<button type="button" class="week-arrow key-off" aria-label="Week after" disabled="">›</button>');
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

  test("draws each cheer and jeer on the shared LED panel and Overall on the shared, outlined tier shield", () => {
    const markup = html(page("Points"));
    expect(markup).toContain('<div class="led">The template was right there, mate.</div>');
    expect(markup).toContain('<svg class="tier-shield profile__tier"');
  });

  test("an earlier week shows its points, its team loading until the backend feeds it, and no cheers or jeers", () => {
    const week2 = text(page("Points", PROFILE, 2));
    expectInOrder(week2, ["Week 2", "112"]);
    expect(week2).not.toContain("Not final");
    expect(week2).not.toContain("Cheers and jeers");
    expect(html(page("Points", PROFILE, 2))).toContain("Week 2&#x27;s team");
  });
});

describe("History", () => {
  test("shows each week's row, newest first, then the buffs left", () => {
    expectInOrder(text(page("History")), [
      ...BANNER,
      "Week", "Pts", "Total", "Week rank", "Overall", "Move", "Transfers", "Hits", "Bank", "Value", "Buff",
      "Week 3", "93", "315", "—", "21,804", "3,112", "5", "3", "₩0.5m", "₩100.9m", "Bench Boost", "›",
      "Week 2", "112", "222", "4,211", "24,916", "9,870", "1", "0", "₩1.0m", "₩100.6m", "—", "›",
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
});

describe("Transfers", () => {
  test("shows each week's swaps by slot, out → in with team and price, then points gained", () => {
    expectInOrder(text(page("Transfers")), [
      ...BANNER,
      "Slot", "Out", "In", "Pts gained",
      "Week 3", "Tue 09:00", "18:00 KST", "Bench Boost · 3 hits",
      "Top", "Doran", "T1 · ₩13.0m", "→", "Kiin", "GEN · ₩13.5m", "+1",
      "Bot", "Peyz", "T1 · ₩13.0m", "→", "Ruler", "GEN · ₩16.0m", "+4",
      "Support", "Lehends", "NS · ₩10.0m", "→", "Keria", "T1 · ₩12.0m", "−1",
      "Flex", "Siwoo", "DK · ₩11.0m", "→", "Kingen", "NS · ₩6.0m", "−4",
      "Jungle", "Peanut", "NS · ₩15.5m", "→", "Canyon", "GEN · ₩15.5m", "+2",
      "Week 2", "Mon 12:40", "21:40 KST", "1 free",
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

  test("Following unfollows; Follow requests; Requested waits for her to accept", () => {
    expect(nextFollow("following")).toBe("follow");
    expect(nextFollow("follow")).toBe("requested");
    expect(nextFollow("requested")).toBe("requested");
  });
});

test("a held rank, in Leagues or History, is RankMove's grey —", () => {
  const held: ProfileData = { ...PROFILE, leagues: PROFILE.leagues.map((l) => ({ ...l, move: 0 })), history: PROFILE.history.map((r) => ({ ...r, move: 0 })) };
  expect(html(page("Points", held))).toContain('<span class="rank-held">—</span>');
  const history = html(page("History", held));
  expect(history).toContain('<span class="rank-held">—</span>');
  expect(history).not.toMatch(/rank-(up|down)/);
});
