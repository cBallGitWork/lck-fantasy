// Every screen's path, in one home: the router and the top bar both read it.

export const PATHS = {
  home: "/",
  pickTeam: "/pick-team",
  transfers: "/transfers",
  points: "/points",
  leagues: "/leagues",
  league: "/leagues/$leagueId",
  stats: "/stats",
  live: "/live",
  series: "/series/$seriesId",
  compare: "/compare",
  perfectGame: "/perfect-game",
  patchUpdate: "/patch-update",
  settings: "/settings",
  lckHub: "/lck",
  playerCard: "/player/$playerId",
  coachCard: "/coach/$coachId",
  profile: "/manager/$managerId",
  following: "/following",
} as const;

export type ScreenKey = keyof typeof PATHS;

/** A path with its `$params` filled in. */
export function pathTo(key: ScreenKey, params: Record<string, string> = {}): string {
  return PATHS[key].replace(/\$(\w+)/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`pathTo(${key}) needs ${name}`);
    return encodeURIComponent(value);
  });
}
