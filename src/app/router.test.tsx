// @vitest-environment node
import { expect, test } from "vitest";
import { pageTitle, PATHS, pathTo, PRODUCT, SCREEN_NAME, type Go, type ScreenKey } from "../paths";
import { htmlAt } from "../testing/render";

// Each route, with its params, and the screen folder it renders. A screen's own content is
// tested in its folder, so building a screen never touches this file.
const ROUTES: Record<ScreenKey, [Go, string]> = {
  home: [{ to: PATHS.home }, "home"],
  pickTeam: [{ to: PATHS.pickTeam }, "pick-team"],
  createTeam: [{ to: PATHS.createTeam }, "pick-team-signed-out"],
  transfers: [{ to: PATHS.transfers }, "transfers"],
  points: [{ to: PATHS.points }, "points"],
  pointsWeek: [{ to: PATHS.pointsWeek, params: { week: "2" } }, "points"],
  leagues: [{ to: PATHS.leagues }, "leagues"],
  league: [{ to: PATHS.league, params: { leagueId: "pub-league" } }, "leagues"],
  leagueJoin: [{ to: PATHS.leagueJoin, params: { code: "GANK-4TQ1" } }, "leagues"],
  stats: [{ to: PATHS.stats }, "stats"],
  live: [{ to: PATHS.live }, "live"],
  series: [{ to: PATHS.series, params: { seriesId: "w3-sat-2" } }, "series"],
  compare: [{ to: PATHS.compare, params: { playerId: "faker" } }, "compare"],
  perfectGame: [{ to: PATHS.perfectGame }, "perfect-game"],
  perfectGameWeek: [{ to: PATHS.perfectGameWeek, params: { week: "2" } }, "perfect-game"],
  priceChanges: [{ to: PATHS.priceChanges }, "price-changes"],
  settings: [{ to: PATHS.settings }, "settings"],
  lckHub: [{ to: PATHS.lckHub }, "lck-hub"],
  playerCard: [{ to: PATHS.playerCard, params: { playerId: "faker" } }, "player-card"],
  coachCard: [{ to: PATHS.coachCard, params: { coachId: "kkoma" } }, "coach-card"],
  profile: [{ to: PATHS.profile, params: { managerId: "minji" } }, "profile"],
  following: [{ to: PATHS.following }, "following"],
  privacy: [{ to: PATHS.privacy }, "legal"],
  terms: [{ to: PATHS.terms }, "legal"],
};

test.each(Object.keys(PATHS) as ScreenKey[])("the %s route renders its screen with the top bar", async (key) => {
  const [go, folder] = ROUTES[key];
  const out = await htmlAt(pathTo(go));
  expect(out).toContain('class="top-bar"');
  expect(out).toContain(`data-screen="${folder}"`);
  expect(out).toContain("--ink:");
});

test.each(Object.keys(PATHS) as ScreenKey[])("the %s route has its own title, a skip link before the top bar, and the live region", async (key) => {
  const [go] = ROUTES[key];
  const out = await htmlAt(pathTo(go));
  expect(out).toContain(`<title>${SCREEN_NAME[key]} · ${PRODUCT}</title>`);
  expect(out.indexOf('href="#main">Skip to content</a>')).toBeLessThan(out.indexOf('class="top-bar"'));
  expect(out).toContain('<main id="main"');
  expect(out.match(/aria-live="polite"/g)).toHaveLength(1);
});

test("a page's title names it: Pick Team · Flol; any other route is Flol", () => {
  expect(pageTitle(PATHS.pickTeam)).toBe("Pick Team · Flol");
  expect(pageTitle(PATHS.playerCard)).toBe("Player · Flol");
  expect(pageTitle("/dev/states")).toBe("Flol");
  expect(pageTitle(undefined)).toBe("Flol");
});

test("a path takes its params, escaped", () => {
  expect(pathTo({ to: PATHS.series, params: { seriesId: "w3 sat" } })).toBe("/series/w3%20sat");
  expect(pathTo({ to: PATHS.stats })).toBe("/stats");
});
