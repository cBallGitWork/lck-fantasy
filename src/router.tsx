import { createRootRoute, createRoute, createRouter, Outlet, type RouterHistory } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { DEV_STATES_PATH } from "./devStates";
import { DevStatesPage } from "./DevStatesPage";
import { PATHS, type ScreenKey } from "./paths";
import { CoachCardScreen } from "./screens/coach-card";
import { CompareScreen } from "./screens/compare";
import { FollowingScreen } from "./screens/following";
import { HomeScreen } from "./screens/home";
import { LckHubScreen } from "./screens/lck-hub";
import { LeaguesScreen } from "./screens/leagues";
import { LiveScreen } from "./screens/live";
import { PatchUpdateScreen } from "./screens/patch-update";
import { PerfectGameScreen } from "./screens/perfect-game";
import { PickTeamScreen } from "./screens/pick-team";
import { PlayerCardScreen } from "./screens/player-card";
import { PointsScreen } from "./screens/points";
import { ProfileScreen } from "./screens/profile";
import { SeriesScreen } from "./screens/series";
import { SettingsScreen } from "./screens/settings";
import { StatsScreen } from "./screens/stats";
import { TransfersScreen } from "./screens/transfers";
import { ThemeStyle } from "./theme";

// One route per approved screen (docs/design/approved/), each its folder's index.tsx; in dev also /dev/states.
function Root() {
  return (
    <>
      <ThemeStyle />
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({ component: Root });

const screen = <P extends (typeof PATHS)[ScreenKey]>(path: P, component: () => ReactElement) =>
  createRoute({ getParentRoute: () => rootRoute, path, component });

const routeTree = rootRoute.addChildren([
  screen(PATHS.home, HomeScreen),
  screen(PATHS.pickTeam, PickTeamScreen),
  screen(PATHS.transfers, TransfersScreen),
  screen(PATHS.points, PointsScreen),
  screen(PATHS.pointsWeek, PointsScreen),
  screen(PATHS.leagues, LeaguesScreen),
  screen(PATHS.league, LeaguesScreen),
  screen(PATHS.stats, StatsScreen),
  screen(PATHS.live, LiveScreen),
  screen(PATHS.series, SeriesScreen),
  screen(PATHS.compare, CompareScreen),
  screen(PATHS.perfectGame, PerfectGameScreen),
  screen(PATHS.patchUpdate, PatchUpdateScreen),
  screen(PATHS.settings, SettingsScreen),
  screen(PATHS.lckHub, LckHubScreen),
  screen(PATHS.playerCard, PlayerCardScreen),
  screen(PATHS.coachCard, CoachCardScreen),
  screen(PATHS.profile, ProfileScreen),
  screen(PATHS.following, FollowingScreen),
  // Dev only: a build drops it with the page.
  ...(import.meta.env.DEV ? [createRoute({ getParentRoute: () => rootRoute, path: DEV_STATES_PATH, component: DevStatesPage })] : []),
]);

/** The app's router; tests pass a memory history. */
export function makeRouter(history?: RouterHistory) {
  return createRouter({ routeTree, history });
}

export const router = makeRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
