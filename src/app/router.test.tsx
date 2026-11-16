// @vitest-environment node
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { PATHS, pathTo, type Go, type ScreenKey } from "../paths";
import { makeRouter } from "./router";

// Each route, with its params, and the screen folder it renders. A screen's own content is
// tested in its folder, so building a screen never touches this file.
const ROUTES: Record<ScreenKey, [Go, string]> = {
  home: [{ to: PATHS.home }, "home"],
  pickTeam: [{ to: PATHS.pickTeam }, "pick-team"],
  transfers: [{ to: PATHS.transfers }, "transfers"],
  points: [{ to: PATHS.points }, "points"],
  pointsWeek: [{ to: PATHS.pointsWeek, params: { week: "2" } }, "points"],
  leagues: [{ to: PATHS.leagues }, "leagues"],
  league: [{ to: PATHS.league, params: { leagueId: "pub-league" } }, "leagues"],
  stats: [{ to: PATHS.stats }, "stats"],
  live: [{ to: PATHS.live }, "live"],
  series: [{ to: PATHS.series, params: { seriesId: "w3-sat-2" } }, "series"],
  compare: [{ to: PATHS.compare }, "compare"],
  perfectGame: [{ to: PATHS.perfectGame }, "perfect-game"],
  patchUpdate: [{ to: PATHS.patchUpdate }, "patch-update"],
  settings: [{ to: PATHS.settings }, "settings"],
  lckHub: [{ to: PATHS.lckHub }, "lck-hub"],
  playerCard: [{ to: PATHS.playerCard, params: { playerId: "faker" } }, "player-card"],
  coachCard: [{ to: PATHS.coachCard, params: { coachId: "kkoma" } }, "coach-card"],
  profile: [{ to: PATHS.profile, params: { managerId: "minji" } }, "profile"],
  following: [{ to: PATHS.following }, "following"],
};

test.each(Object.keys(PATHS) as ScreenKey[])("the %s route renders its screen with the top bar", async (key) => {
  const [go, folder] = ROUTES[key];
  const router = makeRouter(createMemoryHistory({ initialEntries: [pathTo(go)] }));
  await router.load();
  const out = renderToStaticMarkup(<RouterProvider router={router} />);
  expect(out).toContain('class="top-bar"');
  expect(out).toContain(`data-screen="${folder}"`);
  expect(out).toContain("--ink:");
});

test("a path takes its params, escaped", () => {
  expect(pathTo({ to: PATHS.series, params: { seriesId: "w3 sat" } })).toBe("/series/w3%20sat");
  expect(pathTo({ to: PATHS.stats })).toBe("/stats");
});
