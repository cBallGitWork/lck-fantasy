// Every approved picture's state (docs/design/approved/<page>/), the dev URL that opens it and the
// picture it is checked against. /dev/states lists them; the UI checks read them from here.
import { LIVE_SERIES_ID } from "../fixtures/week3";
import { DEV_STATE_PARAM } from "../parts";
import { cardGo, leagueGo, PATHS, pathTo, profileGo, seriesGo, type Go } from "../paths";

/** The dev-only page listing every state. */
export const DEV_STATES_PATH = "/dev/states";

/** One approved state: its page's picture folder, its name there, where it opens in dev, and its picture. */
export interface DevState {
  page: string;
  state: string;
  url: string;
  picture: string;
}

/** One state of a page: its name, its route, `?state=` when the route alone doesn't reach it, and a picture not named `1440-<state>.png`. */
interface StateAt {
  state: string;
  go: Go;
  /** Opened by `?state=<state>`. */
  param?: true;
  /** A query the route itself reads, such as the coach card's `from=points`. */
  query?: string;
  picture?: string;
}

/** A page's states, the first being its `1440.png`. */
const page = (name: string, states: StateAt[]): DevState[] =>
  states.map(({ state, go, param, query, picture }, i) => {
    const search = [query, param && `${DEV_STATE_PARAM}=${state}`].filter(Boolean).join("&");
    return {
      page: name,
      state,
      url: pathTo(go) + (search ? `?${search}` : ""),
      picture: `docs/design/approved/${name}/${picture ?? (i === 0 ? "1440.png" : `1440-${state}.png`)}`,
    };
  });

const home: Go = { to: PATHS.home };
const faker = cardGo("faker", "mid");
const kkoma = cardGo("kkoma", "coach");
const minji = profileGo("minji");

/**
 * Every state, named as its picture is: the HTML file, or its `?v=` or `#`. Not here: the crests
 * (no screen), and Settings' sign-up steps, drawn over Pick team (signed out), which has no route yet.
 */
export const DEV_STATES: readonly DevState[] = [
  ...page("home", [
    { state: "live", go: home },
    { state: "idle", go: home, param: true },
  ]),
  ...page("pick-team", [
    { state: "pick", go: { to: PATHS.pickTeam } },
    { state: "cards", go: { to: PATHS.pickTeam }, param: true },
    { state: "swap", go: { to: PATHS.pickTeam }, param: true },
  ]),
  ...page("transfers", [
    { state: "transfers", go: { to: PATHS.transfers } },
    { state: "confirm", go: { to: PATHS.transfers }, param: true },
  ]),
  ...page("points", [{ state: "points", go: { to: PATHS.points } }]),
  ...page("leagues", [
    { state: "league", go: leagueGo("pub-league") },
    { state: "overall", go: leagueGo("overall") },
    { state: "admin", go: leagueGo("pub-league"), param: true },
    { state: "create", go: leagueGo("pub-league"), param: true },
    { state: "created", go: leagueGo("pub-league"), param: true },
    { state: "join", go: leagueGo("pub-league"), param: true },
    { state: "member", go: leagueGo("flol-discord") },
    { state: "delete", go: leagueGo("pub-league"), param: true },
    { state: "leave", go: leagueGo("flol-discord"), param: true },
  ]),
  ...page("stats", [
    { state: "stats", go: { to: PATHS.stats } },
    { state: "pergame", go: { to: PATHS.stats }, param: true },
    { state: "coaches", go: { to: PATHS.stats }, param: true },
  ]),
  ...page("live", [
    { state: "live", go: { to: PATHS.live } },
    { state: "idle", go: { to: PATHS.live }, param: true },
    { state: "down", go: { to: PATHS.live }, param: true },
  ]),
  ...page("series", [
    { state: "series", go: seriesGo(LIVE_SERIES_ID) },
    { state: "f21", go: seriesGo("w3-sat-1"), picture: "1440-21.png" },
    { state: "live", go: seriesGo(LIVE_SERIES_ID), param: true },
    { state: "next", go: seriesGo("w4-wed-1") },
  ]),
  ...page("compare", [
    { state: "compare", go: { to: PATHS.compare } },
    { state: "pick", go: { to: PATHS.compare }, param: true },
    { state: "coaches", go: { to: PATHS.compare }, param: true },
  ]),
  ...page("perfect-game", [
    { state: "rift", go: { to: PATHS.perfectGame }, param: true },
    { state: "card", go: { to: PATHS.perfectGame }, param: true },
  ]),
  ...page("patch-update", [{ state: "patch", go: { to: PATHS.patchUpdate } }]),
  ...page("settings", [
    { state: "settings", go: { to: PATHS.settings }, param: true },
    { state: "display", go: { to: PATHS.settings }, param: true },
    { state: "emails", go: { to: PATHS.settings }, param: true },
    { state: "account", go: { to: PATHS.settings }, param: true },
    { state: "delete", go: { to: PATHS.settings }, param: true },
  ]),
  ...page("lck-hub", [
    { state: "hub", go: { to: PATHS.lckHub } },
    { state: "results", go: { to: PATHS.lckHub }, param: true },
    { state: "standings", go: { to: PATHS.lckHub }, param: true },
    { state: "teams", go: { to: PATHS.lckHub }, param: true },
  ]),
  ...page("player-card", [
    { state: "card", go: faker },
    { state: "week", go: faker, param: true },
    { state: "fixtures", go: faker, param: true },
    { state: "champs", go: faker, param: true },
  ]),
  ...page("coach-card", [
    { state: "coach", go: kkoma },
    { state: "week", go: kkoma, query: "from=points" },
    { state: "roster", go: kkoma, param: true },
  ]),
  ...page("profile", [
    { state: "points", go: minji },
    { state: "history", go: minji, param: true },
    { state: "transfers", go: minji, param: true },
  ]),
  ...page("following", [
    { state: "following", go: { to: PATHS.following } },
    { state: "truck", go: { to: PATHS.following }, param: true },
  ]),
];
