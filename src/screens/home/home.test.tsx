// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { HOME_IDLE, HOME_LIVE } from "./fixtures";
import { ordinal as place } from "../../parts";
import { Home } from "./index";

/** Fails unless each piece appears in `out`, in this order. */
function expectInOrder(out: string, pieces: string[]) {
  let from = 0;
  for (const piece of pieces) {
    const at = out.indexOf(piece, from);
    expect(at, `"${piece}" after position ${from}`).toBeGreaterThanOrEqual(0);
    from = at + piece.length;
  }
}

const HEAD = ["Baron Steal FC", "바론 스틸 FC", "Emerald I", "에메랄드 1", "48,211", "6,904", "Badge"];
const deadline = (d: string, h: string, m: string) => ["Week 4 deadline", "Split 1", `${d}d${h}h${m}m`, "Wed 07:45", "16:45 KST", "Pick Team", "Transfers", "2 free transfers"];
const BAND = [
  "Following",
  "Minji · GEN v HLE",
  "20 pts",
  "Truck ›",
  "Dan · Carry Faker",
  "34 pts in T1 v HLE",
  "Jae · NS v KRX",
  "9 pts",
  "Sell your bot laner",
  "Truck from Minji",
  "Week 3",
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
      ...["LCK · English", "Twitch", "LCK · English", "YouTube", "LCK · 한국어", "YouTube", "Caedrel · English", "Twitch", "Kameto · Français", "Twitch", "More ▾"],
      ...["Your week", "Not final", "94", "Average 74", "Highest 121›"],
      ...["In this series", "Faker", "C", "T1", "1/0/2", "25", "Siwoo", "DK", "2/1/1", "8", "kkOma", "T1", "10"],
      ...["Still to play", "None", "Points ›"],
      ...BAND,
    ]);
  });

  test("marks the remembered pick, greys out a stream not live, and shows the pick on the screen", () => {
    const markup = html(<Home data={HOME_LIVE} />);
    expect(markup).toMatch(/aria-pressed="true"[^>]*>LCK · English<small[^>]*>Twitch/);
    expect(markup).toMatch(/home__stream--off" aria-pressed="false" disabled="">Kameto/);
    expect(text(<Home data={{ ...HOME_LIVE, pickedStream: "caedrel-twitch" }} />)).toContain("Caedrel · English · Twitch");
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
      ...["HLE", "Zeus", "Top", "GEN", "Canyon", "Jungle", "T1", "C", "Faker", "Mid", "GEN", "V", "Ruler", "Bot"],
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
});

test("a private league's rank reads as a place", () => {
  expect([1, 2, 3, 4, 11, 12, 13, 14, 21, 22, 101, 111].map(place)).toEqual([
    "1st",
    "2nd",
    "3rd",
    "4th",
    "11th",
    "12th",
    "13th",
    "14th",
    "21st",
    "22nd",
    "101st",
    "111th",
  ]);
});
