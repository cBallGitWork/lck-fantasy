// Every screen's path, in one home: the router, the top bar and every link read it.

export const PATHS = {
  home: "/",
  pickTeam: "/pick-team",
  transfers: "/transfers",
  points: "/points",
  /** Points for one week, so a week can be linked: `/points/2`. */
  pointsWeek: "/points/$week",
  leagues: "/leagues",
  league: "/leagues/$leagueId",
  stats: "/stats",
  live: "/live",
  series: "/series/$seriesId",
  compare: "/compare",
  perfectGame: "/perfect-game",
  priceChanges: "/price-changes",
  settings: "/settings",
  lckHub: "/lck",
  playerCard: "/player/$playerId",
  coachCard: "/coach/$coachId",
  profile: "/manager/$managerId",
  following: "/following",
} as const;

export type ScreenKey = keyof typeof PATHS;

/** The `$params` a path names: `"/series/$seriesId"` gives `"seriesId"`. */
type ParamName<P extends string> = P extends `${string}$${infer Name}/${infer Rest}`
  ? Name | ParamName<Rest>
  : P extends `${string}$${infer Name}`
    ? Name
    : never;

type GoTo<P extends string> = [ParamName<P>] extends [never] ? { to: P; params?: never } : { to: P; params: Record<ParamName<P>, string> };

/** Where a link goes inside Flol: a screen's path and every param it names, checked by the typecheck. */
export type Go = { [K in ScreenKey]: GoTo<(typeof PATHS)[K]> }[ScreenKey];

/** A link's path with its `$params` filled in. */
export function pathTo(go: Go): string {
  const params: Record<string, string> = go.params ?? {};
  return go.to.replace(/\$(\w+)/g, (_, name: string) => encodeURIComponent(params[name] ?? ""));
}

/** A player's card, or the coach's card for a coach. */
export function cardGo(id: string, coach: boolean): Go {
  return coach ? { to: PATHS.coachCard, params: { coachId: id } } : { to: PATHS.playerCard, params: { playerId: id } };
}

/** A league's page. */
export const leagueGo = (id: string): Go => ({ to: PATHS.league, params: { leagueId: id } });

/** A series' page. */
export const seriesGo = (id: string): Go => ({ to: PATHS.series, params: { seriesId: id } });

/** A manager's profile. */
export const profileGo = (id: string): Go => ({ to: PATHS.profile, params: { managerId: id } });
