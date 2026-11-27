// @vitest-environment node
import { describe, expect, test } from "vitest";
import { CAPTAIN_MULTIPLIER } from "../../fixtures/competition";
import { STREAMS } from "../../fixtures/streams";
import { expectInOrder, hovers, html, press, text, trucksOutsideCredit } from "../../testing/render";
import { FOLLOWING } from "../following/fixtures";
import { pickerOn } from "../following/useCheerPicker";
import { PointsPage } from "../points/PointsPage";
import { POINTS_FIXTURE } from "../points/fixtures";
import { FeedRow } from "./band";
import { HOME_BOOST, HOME_BOOST_LIVE, HOME_IDLE, HOME_LIVE } from "./fixtures";
import { Home } from "./index";
import type { HomeData } from "./types";

const HEAD = ["Baron Steal FC", "바론 스틸 FC", "Emerald I", "에메랄드 1", "48,211", "6,904", "Badge"];
const LEAGUES = ["Leagues", "All leagues ›", "United Kingdom", "1,402", "233", "T1 supporters", "3,118", "510", "Pub League", "2nd", "1", "Flol Discord", "14th", "2", "Sponsor", "All sponsors are made up."];
const NEXT = ["Next", "Week 5", "Wed 27 Jan 7:45am", "Week 6", "Wed 3 Feb 7:45am", "Week 7", "Wed 10 Feb 7:45am"];
const deadline = (countdown: string, buff: string[] = []) => [
  "Week 4 deadline",
  countdown,
  "Wed 7:45am",
  "Pick Team",
  "Transfers",
  "Free transfers",
  "2",
  ...buff,
  ...["DK Siwoo", "Top", "Not starting", "Wed›"],
  ...NEXT,
];
const following = (tag: string[]) => [
  "Following",
  "Week 3",
  ...tag,
  "Pts",
  ...["Minji · GEN v HLE", "20", "Cheer / Jeer ›", "Dan · T1 v HLE", "34", "Cheer sent", "Jae · NS v KRX", "9", "Cheer / Jeer ›"],
  ...["Sell your bot laner", "Jeer from Minji · Week 3", "Truck hire by Sponsor", "Following ›"],
];
const page = (data: HomeData) => text(<Home data={data} />);

describe("a series live (1440.png)", () => {
  const out = page(HOME_LIVE);

  test("holds the picture's content in its order", () => {
    expectInOrder(out, [
      ...HEAD,
      ...["Live", "T1 1–0 DK", "Game 2 · Bo3", "Live ›", "LCK · English · Twitch", "Muted"],
      ...["Streams", "More ▾", "LCK · English", "Twitch", "LCK · English", "YouTube", "LCK · 한국어", "YouTube", "Caedrel · English", "Twitch", "LCK · Tiếng Việt", "YouTube"],
      ...["Your players", "Pts", "T1 Faker", "C", "5", "DK Siwoo", "3", "T1 kkOma", "2"],
      ...["Week 3 series", "Wed", "T1 v HLE", "2–1", "GEN v KT", "2–0", "Thu", "Sat", "T1 v DK", "1–0 Live", "Sun", "BFX v DNS", "10:30am"],
      ...following(["Not final"]),
      ...["All managers", "Week 3", "Most captained", "GEN Chovy", "38%", "Week 4 so far", "Most bought", "GEN Kiin", "36,750", "Most sold", "HLE Zeka", "28,930"],
      ...deadline("3d19h35m"),
      ...["Week 3", "Points ›", "94", "Not final", "Average", "74", "Highest", "121 ›"],
      ...["Week 2", "Pts", "Owned", "Star", "GEN Kiin", "15", "8%", "Flop", "T1 Faker", "2", "62%"],
      ...LEAGUES,
    ]);
  });

  test("shows no lineup and no buff when none is played", () => {
    expect(out).not.toContain("lineup");
    expect(out).not.toContain("Buff");
    expect(out).not.toContain("Bench Boost");
  });

  test("names a day once, on its first series, in the series panel Points shares", () => {
    const markup = html(<Home data={HOME_LIVE} />);
    expect(markup).toContain('class="panel panel--band series-panel home__panel"');
    expect(html(<PointsPage data={POINTS_FIXTURE} />)).toContain('class="panel panel--band series-panel points__side"');
    const days = markup.slice(markup.indexOf("series-list")).match(/<span class="quiet">(Wed|Thu|Fri|Sat|Sun)?<\/span><span>/g);
    expect(days?.filter((d) => d.includes("quiet\"><"))).toHaveLength(5);
    expect(days).toHaveLength(10);
  });

  test("marks the remembered pick, greys out a stream not live, and shows the pick on the screen", () => {
    const markup = html(<Home data={HOME_LIVE} />);
    expect(markup).toMatch(/aria-pressed="true"[^>]*>LCK · English<small[^>]*>Twitch/);
    expect(markup).toMatch(/home__pick--off" aria-pressed="false" disabled="">LCK · Tiếng Việt/);
    expect(page({ ...HOME_LIVE, pickedStream: "caedrel" })).toContain("Caedrel · English · Twitch");
  });

  test("plays the official English stream when the remembered pick isn't live, without saving it as the pick", () => {
    const remembered = { ...HOME_LIVE, pickedStream: "kameto" };
    const saved: string[] = [];
    expect(html(<Home data={remembered} onPickStream={(id) => saved.push(id)} />)).toMatch(/aria-pressed="true"[^>]*>LCK · English<small[^>]*>Twitch/);
    expect(page(remembered)).toContain("LCK · English · Twitch");
    expect(saved).toEqual([]);
  });

  test("shows Live's one streams list: five rows, Kameto sixth under More ▾", () => {
    expect(HOME_LIVE.streams).toBe(STREAMS);
    expect(STREAMS[5]?.name).toBe("Kameto");
    expect(html(<Home data={HOME_LIVE} />).match(/class="home__pick[ "]/g)).toHaveLength(5);
  });

  test("lists only your players in the live series, the Captain's points before ×1.5", () => {
    expect(HOME_LIVE.inSeries.map((p) => [p.name, p.points])).toEqual([
      ["Faker", 5],
      ["Siwoo", 3],
      ["kkOma", 2],
    ]);
  });

  test("links Live, Highest, Points, Following, All leagues and the warning row", () => {
    const markup = html(<Home data={HOME_LIVE} />);
    for (const href of ["/live", "/perfect-game", "/points", "/following", "/leagues", "/pick-team"]) expect(markup).toContain(`href="${href}"`);
  });
});

describe("nothing live (1440-idle.png)", () => {
  const out = page(HOME_IDLE);

  test("holds the picture's content in its order", () => {
    expectInOrder(out, [
      ...HEAD,
      "Week 4 lineup",
      ...["Top", "Zeus", "HLE", "v DK, NS", "Jungle", "Canyon", "GEN", "v BRO, T1", "Mid", "C", "Faker", "T1", "v KT, GEN", "Bot", "Ruler", "Support", "Delight"],
      ...["Flex", "Not starting", "Siwoo", "DK · Top", "v HLE, KT", "Coach", "kkOma", "T1", "v KT, GEN"],
      ...["Bench", "1. Mid", "KT Bdd", "2. Jungle", "KT Cuzz"],
      ...["Week 4 series", "Wed", "HLE v DK", "8:00am", "T1 v KT", "10:30am", "Sun", "KRX v DNS", "10:30am"],
      ...following([]),
      ...["All managers", "Week 4 so far", "Most captained", "T1 Faker", "34%", "Most bought", "GEN Kiin", "41,208", "Most sold", "HLE Zeka", "31,412"],
      ...deadline("9h45m"),
      ...["Week 3", "Points ›", "109", "Final", "Average", "79", "Highest", "128 ›"],
      ...["Week 3", "Pts", "Owned", "Star", "DNS Pyosik", "21", "7%", "Flop", "HLE Delight", "9", "26%"],
      ...LEAGUES,
    ]);
  });

  test("shows no stream, no live series and no Not final", () => {
    expect(out).not.toContain("Streams");
    expect(out).not.toContain("Your players");
    expect(out).not.toContain("Not final");
  });

  test("draws the seven starters as Card view's cards, the bench as a row", () => {
    const markup = html(<Home data={HOME_IDLE} />);
    expect(markup.match(/class="pcard[ "]/g)).toHaveLength(7);
    expect(markup).toContain('class="home__bench"');
  });

  test("marks your Most captained with the dot", () => {
    expect(html(<Home data={HOME_IDLE} />)).toMatch(/T1<\/span> <b>Faker<\/b><span class="me-dot"/);
  });

  test("shows the same star and flop to every manager, every one still tied", () => {
    const kiin = { name: "Kiin", team: "GEN", points: 15, eoPct: 8 };
    const doran = { name: "Doran", team: "T1", points: 15, eoPct: 8 };
    const tied = { ...HOME_IDLE, week: { ...HOME_IDLE.week, starFlop: { ...HOME_IDLE.week.starFlop, stars: [kiin, doran] } } };
    expectInOrder(page(tied), ["Star", "GEN Kiin", "15", "8%", "Star", "T1 Doran", "15", "8%", "Flop", "HLE Delight"]);
  });

  test("before Week 1 is final: the outlined shield and Unranked, no rank line (spec/08)", () => {
    const unranked = { ...HOME_IDLE, overall: { tier: { tier: "unranked" as const }, rank: null, move: null } };
    const markup = html(<Home data={unranked} />);
    expect(markup).toContain('<svg class="tier-shield tier-shield--unranked tier-mark__shield"');
    expect(markup).not.toContain("tier-mark__rank");
    expectInOrder(page(unranked), ["Baron Steal FC", "바론 스틸 FC", "Unranked", "Badge"]);
  });
});

describe("a played buff (spec/12, Home)", () => {
  test("before the deadline: a row in the Deadline panel with its gold icon, a tag by the lineup's title, all nine as cards (1440-boost.png)", () => {
    const out = page(HOME_BOOST);
    expectInOrder(out, ["Week 4 lineup", "Bench Boost", "Top", "Zeus", "Coach", "kkOma", "1. Mid", "Bdd", "KT", "v T1, DK", "2. Jungle", "Cuzz"]);
    expectInOrder(out, deadline("9h45m", ["Buff", "Bench Boost"]));
    const markup = html(<Home data={HOME_BOOST} />);
    expect(markup.match(/class="pcard[ "]/g)).toHaveLength(9);
    expect(markup).not.toContain('class="home__bench"');
    expect(markup).toContain('<svg class="buff-icon home__buff-icon"');
  });

  test("in the week it is on: a tag by the week's total, the bench's points in it (1440-boost-live.png)", () => {
    expectInOrder(page(HOME_BOOST_LIVE), ["Week 3", "Points ›", String(HOME_BOOST_LIVE.week.points), "Bench Boost", "Not final", "Average"]);
    expect(HOME_BOOST_LIVE.week.points).toBeGreaterThan(HOME_LIVE.week.points);
    expect(page(HOME_BOOST_LIVE)).not.toContain("Buff");
  });

  test("Double Captain: both Captains carry the C; Coach Diff: ×3 on the coach's card", () => {
    const lineup = HOME_IDLE.lineup.map((p) => (p.name === "Ruler" ? { ...p, mark: "C" as const } : p.slot === "coach" ? { ...p, times: 3 } : p));
    const markup = html(<Home data={{ ...HOME_IDLE, lineup }} />);
    expect(markup.match(/aria-label="Captain">C/g)).toHaveLength(2);
    expectInOrder(page({ ...HOME_IDLE, lineup }), ["Coach", "×3", "kkOma"]);
  });
});

test("Star, Flop, Most captained, Most bought and Most sold each carry their mark before the word (plate.md, A fact's mark)", () => {
  const markup = html(<Home data={HOME_LIVE} />);
  for (const [mark, word] of [
    ["star", "Star"],
    ["flop", "Flop"],
    ["bought", "Most bought"],
    ["sold", "Most sold"],
  ])
    expect(markup).toMatch(new RegExp(`<svg class="fact-mark fact-mark--${mark}"[^>]*>.*?</svg>${word}<`));
  expect(markup).toMatch(/<span class="mark-badge mark-badge--small" aria-hidden="true">C<\/span>Most captained/);
});

describe("cheers and jeers on the Following panel (spec/14)", () => {
  const minji = HOME_LIVE.following.items.find((item) => item.managerId === "minji")!;

  test("Cheer / Jeer › on Home opens the picker on that manager", () => {
    const opened: string[] = [];
    press(FeedRow({ item: minji, onCheer: (id) => opened.push(id) }), "Cheer or jeer Minji");
    expect(opened).toEqual(["minji"]);
    expectInOrder(text(<Home data={HOME_LIVE} initialPicking={pickerOn(FOLLOWING, "minji")} />), [
      "Cheer or jeer Minji Park",
      "Chovy Was Right There · Week 3 · 58 pts so far, Bench Boost, 5 transfers, −18",
      "BENCH BOOST IN WEEK 3? BIG PLAY.",
      "Send",
    ]);
  });

  test("no picker shows until a key is pressed", () => {
    expect(page(HOME_LIVE)).not.toContain("Cheer or jeer");
  });

  test("draws the jeer on the shared LED panel, and says Truck only in the truck-hire credit", () => {
    expect(html(<Home data={HOME_IDLE} />)).toContain('<div class="led">Sell your bot laner</div>');
    for (const data of [HOME_LIVE, HOME_IDLE]) expect(trucksOutsideCredit(page(data))).toEqual([]);
  });
});

test("a held rank, Overall's or a league's, is RankMove's grey —", () => {
  const held = { ...HOME_IDLE, overall: { ...HOME_IDLE.overall, move: 0 }, leagues: HOME_IDLE.leagues.map((l) => ({ ...l, move: 0 })) };
  const markup = html(<Home data={held} />);
  expect(markup.split('class="rank-held"').length - 1).toBe(held.leagues.length + 1);
  expect(markup).not.toContain("rank-up");
});

test("Overall's tier and the C carry their hover's lines (spec/12, Words)", () => {
  for (const data of [HOME_IDLE, HOME_LIVE]) {
    const out = hovers(html(<Home data={data} />));
    expect(out[0]).toEqual(["Emerald I", "Overall rank as a LoL tier"]);
    expect(out).toContainEqual(["C", `Scores ×${CAPTAIN_MULTIPLIER} this week`]);
  }
});
