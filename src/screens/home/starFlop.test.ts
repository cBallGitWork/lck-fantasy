import { describe, expect, test } from "vitest";
import { STREAMS } from "../../fixtures/streams";
import { HOME_IDLE, WEEK3_FIELD } from "./fixtures";
import { starAndFlop, type WeekPlayer } from "./starFlop";
import { streamToPlay } from "./stream";

const names = (list: WeekPlayer[]) => list.map((p) => p.name);
const at = (name: string, points: number, eoPct: number): WeekPlayer => ({ name, points, eoPct });

/** Nine more owned than everyone in a test, on few points, so the flop pool's 10th is the test's to set. */
const OWNED = Array.from({ length: 9 }, (_, i) => at(`Owned${i + 1}`, 20, 90 - i));

describe("star (spec/12, Home)", () => {
  test("the most points × (1 − effective ownership): Kiin, 15 at 8%, beats Chovy, 18 at 45%", () => {
    expect(names(starAndFlop([at("Chovy", 18, 45), at("Kiin", 15, 8)]).stars)).toEqual(["Kiin"]);
  });

  test("the coach is in the running: Gen.G's coach, 12 at 30%, scores 8.4 and beats a player's 8.0", () => {
    expect(names(starAndFlop([at("Doran", 10, 20), at("Ryu", 12, 30)]).stars)).toEqual(["Ryu"]);
  });

  test("a tie goes to the lower effective ownership", () => {
    // 10 × 0.8 and 16 × 0.5 are both 8.
    expect(names(starAndFlop([at("Doran", 16, 50), at("Oner", 10, 20)]).stars)).toEqual(["Oner"]);
  });

  test("still tied, both are shown", () => {
    expect(names(starAndFlop([at("Doran", 10, 20), at("Oner", 10, 20), at("Kiin", 5, 20)]).stars)).toEqual(["Doran", "Oner"]);
  });
});

describe("flop (spec/12, Home)", () => {
  test("the fewest points among the 10 most owned: Faker, 2 at 62%; the 11th's 1 point doesn't count", () => {
    const { flops } = starAndFlop([...OWNED, at("Faker", 2, 62), at("Siwoo", 1, 12)]);
    expect(names(flops)).toEqual(["Faker"]);
  });

  test("everyone tied at 10th joins the pool", () => {
    const { flops } = starAndFlop([...OWNED, at("Keria", 6, 30), at("Delight", 3, 30)]);
    expect(names(flops)).toEqual(["Delight"]);
  });

  test("a tie goes to the higher effective ownership", () => {
    expect(names(starAndFlop([at("Keria", 3, 40), at("Faker", 3, 62)]).flops)).toEqual(["Faker"]);
  });

  test("still tied, both are shown", () => {
    expect(names(starAndFlop([at("Keria", 3, 40), at("Zeus", 3, 40), at("Faker", 9, 62)]).flops)).toEqual(["Keria", "Zeus"]);
  });

  test("the coach is in the running", () => {
    expect(names(starAndFlop([...OWNED, at("kkOma", 1, 30)]).flops)).toEqual(["kkOma"]);
  });
});

test("a week with no one in it has no star and no flop", () => {
  expect(starAndFlop([])).toEqual({ stars: [], flops: [] });
});

test("Home's star and flop are Week 3's, from the whole field, not the manager's squad", () => {
  const { week, stars, flops } = HOME_IDLE.week.starFlop;
  expect(week).toBe(3);
  expect(stars.map((p) => p.name)).toEqual(starAndFlop(WEEK3_FIELD).stars.map((p) => p.name));
  expect(flops.map((p) => p.name)).toEqual(starAndFlop(WEEK3_FIELD).flops.map((p) => p.name));
  expect([...stars, ...flops].map((p) => [p.name, p.points, p.eoPct])).toEqual([
    ["Pyosik", 21, 7],
    ["Delight", 9, 26],
  ]);
});

describe("the stream that plays as a series starts (spec/12, Live)", () => {
  test("the remembered pick, while it is live", () => {
    expect(streamToPlay(STREAMS, "caedrel")).toBe("caedrel");
  });

  test("the official English stream, when the remembered pick isn't live", () => {
    expect(STREAMS.find((s) => s.id === "kameto")?.live).toBe(false);
    expect(streamToPlay(STREAMS, "kameto")).toBe("lck-en-twitch");
  });

  test("the official English stream, when the remembered pick is gone from the list", () => {
    expect(streamToPlay(STREAMS, "retired")).toBe("lck-en-twitch");
  });
});
