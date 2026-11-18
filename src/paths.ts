// Every screen's path, in one home: the router, the top bar and every link read it.

export const PATHS = {
  home: "/",
  pickTeam: "/pick-team",
  /** The front door: a visitor picks a squad, then signs up on Save team (spec/09), as UCL Fantasy's /create-team. */
  createTeam: "/create-team",
  transfers: "/transfers",
  points: "/points",
  /** Points for one week, so a week can be linked: `/points/2`. */
  pointsWeek: "/points/$week",
  leagues: "/leagues",
  league: "/leagues/$leagueId",
  /** A private league's link: Join a league opens with its code in (spec/08). */
  leagueJoin: "/leagues/join/$code",
  stats: "/stats",
  live: "/live",
  series: "/series/$seriesId",
  /** Compare, opened from a player's or a coach's card: `/compare/faker`. */
  compare: "/compare/$playerId",
  perfectGame: "/perfect-game",
  /** Perfect game for one week, so a week can be shared: `/perfect-game/3`. */
  perfectGameWeek: "/perfect-game/$week",
  priceChanges: "/price-changes",
  /** One week's new prices, so a week can be linked: `/price-changes/4`. */
  priceChangesWeek: "/price-changes/$week",
  settings: "/settings",
  lckHub: "/lck",
  playerCard: "/player/$playerId",
  coachCard: "/coach/$coachId",
  profile: "/manager/$managerId",
  following: "/following",
  privacy: "/privacy",
  terms: "/terms",
  /** Help's guide and Rules; `/help#prices` opens one rule (spec/12, Help). */
  help: "/help",
} as const;

export type ScreenKey = keyof typeof PATHS;

/** Each screen's name: the top bar's label and the tab's title (`Pick Team · Flol`). */
export const SCREEN_NAME: Record<ScreenKey, string> = {
  home: "Home",
  pickTeam: "Pick Team",
  createTeam: "Pick your squad",
  transfers: "Transfers",
  points: "Points",
  pointsWeek: "Points",
  leagues: "Leagues",
  league: "Leagues",
  leagueJoin: "Leagues",
  stats: "Stats",
  live: "Live",
  series: "Series",
  compare: "Compare",
  perfectGame: "Perfect game",
  perfectGameWeek: "Perfect game",
  priceChanges: "Price changes",
  priceChangesWeek: "Price changes",
  settings: "Settings",
  lckHub: "LCK",
  playerCard: "Player",
  coachCard: "Coach",
  profile: "Manager",
  following: "Following",
  privacy: "Privacy",
  terms: "Terms",
  help: "Help",
};

/** The product's name, the tab's title on a page with none of its own. */
export const PRODUCT = "Flol";

/** The tab's title for a route (`/pick-team` gives `Pick Team · Flol`); the product's name alone for any other. */
export function pageTitle(routeId: string | undefined): string {
  const key = (Object.keys(PATHS) as ScreenKey[]).find((k) => PATHS[k] === routeId);
  return key ? `${SCREEN_NAME[key]} · ${PRODUCT}` : PRODUCT;
}

/** The `$params` a path names: `"/series/$seriesId"` gives `"seriesId"`. */
type ParamName<P extends string> = P extends `${string}$${infer Name}/${infer Rest}`
  ? Name | ParamName<Rest>
  : P extends `${string}$${infer Name}`
    ? Name
    : never;

type GoTo<P extends string> = ([ParamName<P>] extends [never] ? { to: P; params?: never } : { to: P; params: Record<ParamName<P>, string> }) & {
  /** A place on the page, after `#`: `/help#prices`. */
  hash?: string;
};

/** Where a link goes inside Flol: a screen's path and every param it names, checked by the typecheck. */
export type Go = { [K in ScreenKey]: GoTo<(typeof PATHS)[K]> }[ScreenKey];

/** A link's path with its `$params` filled in. */
export function pathTo(go: Go): string {
  const params: Record<string, string> = go.params ?? {};
  const path = go.to.replace(/\$(\w+)/g, (_, name: string) => encodeURIComponent(params[name] ?? ""));
  return go.hash ? `${path}#${go.hash}` : path;
}

/** A player's card, or the coach's card for a coach. */
export function cardGo(id: string, coach: boolean): Go {
  return coach ? { to: PATHS.coachCard, params: { coachId: id } } : { to: PATHS.playerCard, params: { playerId: id } };
}

/** The search key Transfers opens with a slot already sold under: `/transfers?sell=coach`. */
export const SELL_SEARCH = "sell";

/** Transfers with one of the nine already sold, as a card's Transfer out opens it. */
export const transfersSelling = (slot: string) => `${PATHS.transfers}?${SELL_SEARCH}=${encodeURIComponent(slot)}`;

/** A league's page. */
export const leagueGo = (id: string): Go => ({ to: PATHS.league, params: { leagueId: id } });

/** A private league's link, as Copy link gives it: it fills in the code, never joins (spec/08). */
export const leagueJoinGo = (code: string): Go => ({ to: PATHS.leagueJoin, params: { code } });

/** Compare with no player: it goes to Stats (spec/12, Compare). */
export const BARE_COMPARE = "/compare";

/** Compare, its first player the one whose card opened it. */
export const compareGo = (id: string): Go => ({ to: PATHS.compare, params: { playerId: id } });

/** A series' page. */
export const seriesGo = (id: string): Go => ({ to: PATHS.series, params: { seriesId: id } });

/** Help at one rule or guide page: `/help#prices`. */
export const helpGo = (id?: string): Go => ({ to: PATHS.help, hash: id });

/** `/help#rules`: Help's Rules tab, its first rule open. */
export const RULES_HASH = "rules";

/** The rule on prices, which Price changes' How prices move › opens (spec/12, Help). */
export const PRICES_RULE = "prices";

/** A manager's profile. */
export const profileGo = (id: string): Go => ({ to: PATHS.profile, params: { managerId: id } });
