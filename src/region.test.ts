import { describe, expect, test } from "vitest";
import season from "../data/lck/season-2027.json";
import { SEASON } from "./fixtures/competition";
import { PATHS, SCREEN_NAME } from "./paths";
import { REGION, regionOf } from "./region";

describe("the region's names come from its data (spec/15)", () => {
  test("the hub's name, address and the season label are the LCK's season file's", () => {
    expect([SCREEN_NAME.hub, PATHS.hub, SEASON]).toEqual([season.competition.name, `/${season.competition.name.toLowerCase()}`, `${season.competition.name} ${season.year}`]);
    expect(REGION).toEqual({ name: "LCK", hub: "/lck", season: "LCK 2027" });
  });

  test("another region's data gives its own names, with no new code", () => {
    expect(regionOf({ competition: { name: "LEC" }, year: 2027 })).toEqual({ name: "LEC", hub: "/lec", season: "LEC 2027" });
  });
});
