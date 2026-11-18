import { createRootRoute, createRoute, createRouter, Outlet, useRouterState, type RouterHistory } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { DEV_STATES_PATH } from "./devStates";
import { DevStatesPage } from "./DevStatesPage";
import { AppFrame } from "../parts";
import { BARE_COMPARE, PATHS, type ScreenKey } from "../paths";
import { CoachCardScreen } from "../screens/coach-card";
import { CompareScreen, toStatsWithNoPlayer } from "../screens/compare";
import { FollowingScreen } from "../screens/following";
import { HomeScreen } from "../screens/home";
import { PrivacyScreen, TermsScreen } from "../screens/legal";
import { LckHubScreen } from "../screens/lck-hub";
import { LeaguesScreen } from "../screens/leagues";
import { LiveScreen } from "../screens/live";
import { PerfectGameScreen } from "../screens/perfect-game";
import { PickTeamScreen } from "../screens/pick-team";
import { PlayerCardScreen } from "../screens/player-card";
import { PointsScreen } from "../screens/points";
import { PriceChangesScreen } from "../screens/price-changes";
import { ProfileScreen } from "../screens/profile";
import { SeriesScreen } from "../screens/series";
import { SettingsScreen } from "../screens/settings";
import { StatsScreen } from "../screens/stats";
import { TransfersScreen } from "../screens/transfers";
import { ThemeStyle } from "../theme";

// One route per approved screen (docs/design/approved/), each its folder's index.tsx; in dev also /dev/states.
function Root() {
  const routeId = useRouterState({ select: (s) => s.matches.at(-1)?.routeId });
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AppFrame routeId={routeId} path={path}>
      <ThemeStyle />
      <Outlet />
    </AppFrame>
  );
}

const rootRoute = createRootRoute({ component: Root });

const screen = <P extends (typeof PATHS)[ScreenKey]>(path: P, component: () => ReactElement) =>
  createRoute({ getParentRoute: () => rootRoute, path, component });

// Compare with no player, bare or one it has no lines for, goes to Stats.
const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: PATHS.compare,
  component: CompareScreen,
  beforeLoad: ({ params }) => toStatsWithNoPlayer(params.playerId),
});
const bareCompareRoute = createRoute({ getParentRoute: () => rootRoute, path: BARE_COMPARE, beforeLoad: () => toStatsWithNoPlayer(undefined) });

const routeTree = rootRoute.addChildren([
  screen(PATHS.home, HomeScreen),
  screen(PATHS.pickTeam, PickTeamScreen),
  screen(PATHS.transfers, TransfersScreen),
  screen(PATHS.points, PointsScreen),
  screen(PATHS.pointsWeek, PointsScreen),
  screen(PATHS.leagues, LeaguesScreen),
  screen(PATHS.league, LeaguesScreen),
  screen(PATHS.leagueJoin, LeaguesScreen),
  screen(PATHS.stats, StatsScreen),
  screen(PATHS.live, LiveScreen),
  screen(PATHS.series, SeriesScreen),
  compareRoute,
  bareCompareRoute,
  screen(PATHS.perfectGame, PerfectGameScreen),
  screen(PATHS.perfectGameWeek, PerfectGameScreen),
  screen(PATHS.priceChanges, PriceChangesScreen),
  screen(PATHS.settings, SettingsScreen),
  screen(PATHS.lckHub, LckHubScreen),
  screen(PATHS.playerCard, PlayerCardScreen),
  screen(PATHS.coachCard, CoachCardScreen),
  screen(PATHS.profile, ProfileScreen),
  screen(PATHS.following, FollowingScreen),
  screen(PATHS.privacy, PrivacyScreen),
  screen(PATHS.terms, TermsScreen),
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
