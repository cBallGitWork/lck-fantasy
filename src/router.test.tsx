// @vitest-environment node
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { PATHS, pathTo, type ScreenKey } from "./paths";
import { makeRouter } from "./router";

const PARAMS = { leagueId: "pub-league", seriesId: "w3-sat-2", playerId: "faker", coachId: "kkoma", managerId: "minji" };

// Each screen's placeholder title, as its approved picture names it.
const TITLES: Record<ScreenKey, string> = {
  home: "Baron Steal FC",
  pickTeam: "Pick Team",
  transfers: "Transfers",
  points: "Baron Steal FC",
  leagues: "Leagues",
  league: "Leagues",
  stats: "Stats",
  live: "Live",
  series: "Series",
  compare: "Compare",
  perfectGame: "Perfect game",
  patchUpdate: "Patch update",
  settings: "Settings",
  lckHub: "LCK Cup 2027",
  playerCard: "Player card",
  coachCard: "Coach card",
  profile: "Profile",
  following: "Following",
};

test.each(Object.keys(PATHS) as ScreenKey[])("the %s route renders its placeholder with the top bar", async (key) => {
  const router = makeRouter(createMemoryHistory({ initialEntries: [pathTo(key, PARAMS)] }));
  await router.load();
  const out = renderToStaticMarkup(<RouterProvider router={router} />);
  expect(out).toContain('class="top-bar"');
  expect(out).toMatch(new RegExp(`<h1 class="page-head__title">${TITLES[key]}<span class="page-head__hangul" lang="ko">[^<]+</span>`));
  expect(out).toContain("--ink:");
});

test("a path needs every param it names", () => {
  expect(() => pathTo("series")).toThrow("seriesId");
  expect(pathTo("series", { seriesId: "w3 sat" })).toBe("/series/w3%20sat");
});
