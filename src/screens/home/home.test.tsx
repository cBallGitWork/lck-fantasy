// @vitest-environment node
import { describe, expect, test } from "vitest";
import { CAPTAIN_MULTIPLIER } from "../../fixtures/competition";
import { expectInOrder, hovers, html, press, text, trucksOutsideCredit } from "../../testing/render";
import { FOLLOWING } from "../following/fixtures";
import { pickerOn } from "../following/useCheerPicker";
import { FeedRow } from "./band";
import { STREAMS } from "../../fixtures/streams";
import { HOME_IDLE, HOME_LIVE } from "./fixtures";
import { Home } from "./index";

const HEAD = ["Baron Steal FC", "바론 스틸 FC", "Emerald I", "에메랄드 1", "48,211", "6,904", "Badge"];
const deadline = (d: string, h: string, m: string) => ["Week 4 deadline", "Split 1", `${d}d${h}h${m}m`, "Wed 07:45", "16:45 KST", "Pick Team", "Transfers", "2 free transfers"];
const BAND = [
  "Following",
  "Minji · GEN v HLE",
  "20 pts",
  "Cheer / Jeer ›",
  "Dan · Captain Faker",
  "34 pts in T1 v HLE",
  "Cheer sent",
  "Jae · NS v KRX",
  "9 pts",
  "Cheer / Jeer ›",
  "Sell your bot laner",
  "Jeer from Minji",
  "Week 3",
  "Truck hire by Sponsor",
  "Following ›",
  "Leagues",
  "League",
  "Rank",
  "Move",
  "United Kingdom",
  "1,402",
  "233",
  "T1 supporters",
  "3,118",
  "510",
  "Pub League",
  "2nd",
  "1",
  "Flol Discord",
  "14th",
  "2",
  "All leagues ›",
  "Sponsor",
  "All sponsors are made up.",
];

describe("live", () => {
  const out = text(<Home data={HOME_LIVE} />);

  test("holds the picture's content in its order", () => {
    expectInOrder(out, [
      ...HEAD,
      ...deadline("3", "19", "35"),
      "Live",
      "T1 1–0 DK",
      "Game 2 · Bo3 · Split 1 Week 3",
      "Live ›",
      "LCK · English · Twitch",
      ...["LCK · English", "Twitch", "LCK · English", "YouTube", "LCK · 한국어", "YouTube", "Caedrel · English", "Twitch", "LCK · Tiếng Việt", "YouTube", "More ▾"],
      ...["Your week", "Not final", "94", "Average 74", "Highest 121›"],
      ...["In this series", "Faker", "C", "T1", "1/0/2", "25", "Siwoo", "DK", "2/1/1", "8", "kkOma", "T1", "10"],
      ...["Still to play", "None", "Points ›"],
      ...BAND,
    ]);
  });

  test("marks the remembered pick, greys out a stream not live, and shows the pick on the screen", () => {
    const markup = html(<Home data={HOME_LIVE} />);
    expect(markup).toMatch(/aria-pressed="true"[^>]*>LCK · English<small[^>]*>Twitch/);
    expect(markup).toMatch(/home__stream--off" aria-pressed="false" disabled="">LCK · Tiếng Việt/);
    expect(text(<Home data={{ ...HOME_LIVE, pickedStream: "caedrel" }} />)).toContain("Caedrel · English · Twitch");
  });

  test("shows Live's one streams list: Kameto sixth, under More ▾", () => {
    expect(HOME_LIVE.streams).toBe(STREAMS);
    expect(STREAMS[5]?.name).toBe("Kameto");
    expect(out).not.toContain("日本語");
  });

  test("lists who is still to play when someone is", () => {
    const later = text(<Home data={{ ...HOME_LIVE, stillToPlay: [{ role: "bot", name: "Ruler", team: "GEN", points: 0 }] }} />);
    expectInOrder(later, ["Still to play", "Ruler", "GEN", "Points ›"]);
    expect(later).not.toContain("None");
  });

  test("links Live, Highest, Points, Following and All leagues", () => {
    const markup = html(<Home data={HOME_LIVE} />);
    for (const href of ["/live", "/perfect-game", "/points", "/following", "/leagues"]) expect(markup).toContain(`href="${href}"`);
  });
});

describe("idle", () => {
  const out = text(<Home data={HOME_IDLE} />);

  test("holds the picture's content in its order", () => {
    expectInOrder(out, [
      ...HEAD,
      ...deadline("1", "20", "45"),
      "Week 4 lineup",
      ...["Next on stream", "HLE v DK", "Wed 08:00", "17:00 KST", "in", "1d 21h"],
      ...["HLE", "Zeus", "Top", "GEN", "Canyon", "Jungle", "T1", "C", "Faker", "Mid", "GEN", "Ruler", "Bot"],
      ...["HLE", "Delight", "Support", "DK", "Siwoo", "Flex · Top", "T1", "kkOma", "Coach"],
      ...["Week 3", "Final", "109", "Average 79", "Highest 128›"],
      ...["Faker", "T1", "Star", "22", "Delight", "HLE", "Flop", "9", "Points ›"],
      ...BAND,
    ]);
  });

  test("shows no live series, no stage Pick Team, no second Deadline and no division on the shield", () => {
    expect(out).not.toContain("In this series");
    expect(out).not.toContain("Star and flop");
    expect(out.match(/Deadline/g)).toBeNull();
    const markup = html(<Home data={HOME_IDLE} />);
    expect(markup).not.toContain("home__stage-go");
    expect(markup).not.toContain("home__shield-division");
    expect(out).not.toContain("Not final");
    expect(html(<Home data={HOME_IDLE} />)).toContain('href="/pick-team"');
  });

  test("sets each starter's role upright on his slanted plate, as his name is", () => {
    const markup = html(<Home data={HOME_IDLE} />);
    expect(markup.match(/class="home__plate-role[ "]/g)).toHaveLength(HOME_IDLE.lineup.length);
  });

  test("draws the jeer on the shared LED panel and Overall on the shared, outlined tier shield", () => {
    const markup = html(<Home data={HOME_IDLE} />);
    expect(markup).toContain('<div class="led">Sell your bot laner</div>');
    expect(markup).toContain('<svg class="tier-shield home__shield"');
  });
});

describe("cheers and jeers on the Following card (spec/14)", () => {
  const minji = HOME_LIVE.following.find((item) => item.kind === "series" && item.managerId === "minji")!;

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
    expect(text(<Home data={HOME_LIVE} />)).not.toContain("Cheer or jeer");
  });

  test("says Truck only in the truck-hire credit", () => {
    for (const data of [HOME_LIVE, HOME_IDLE]) expect(trucksOutsideCredit(text(<Home data={data} />))).toEqual([]);
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
