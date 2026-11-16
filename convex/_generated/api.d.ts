/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as feeds_fixtures_oe from "../feeds/fixtures/oe.js";
import type * as feeds_fixtures_v5_shape from "../feeds/fixtures/v5-shape.js";
import type * as feeds_leaguepedia from "../feeds/leaguepedia.js";
import type * as feeds_load from "../feeds/load.js";
import type * as feeds_oraclesElixir from "../feeds/oraclesElixir.js";
import type * as following_feed from "../following/feed.js";
import type * as following_fit from "../following/fit.js";
import type * as following_follows from "../following/follows.js";
import type * as following_lines from "../following/lines.js";
import type * as following_trucks from "../following/trucks.js";
import type * as gameweeks_starAndFlop from "../gameweeks/starAndFlop.js";
import type * as lck_series from "../lck/series.js";
import type * as leagues_membership from "../leagues/membership.js";
import type * as leagues_store from "../leagues/store.js";
import type * as leagues_tables from "../leagues/tables.js";
import type * as scoring_fixtures from "../scoring/fixtures.js";
import type * as scoring_game from "../scoring/game.js";
import type * as scoring_series from "../scoring/series.js";
import type * as signIn_autoFill from "../signIn/autoFill.js";
import type * as signIn_signUp from "../signIn/signUp.js";
import type * as squads_autoSubs from "../squads/autoSubs.js";
import type * as squads_budget from "../squads/budget.js";
import type * as squads_buffs from "../squads/buffs.js";
import type * as squads_carry from "../squads/carry.js";
import type * as squads_fixtures from "../squads/fixtures.js";
import type * as squads_splitBreak from "../squads/splitBreak.js";
import type * as squads_squad from "../squads/squad.js";
import type * as squads_transfers from "../squads/transfers.js";
import type * as stats_gameStats from "../stats/gameStats.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "feeds/fixtures/oe": typeof feeds_fixtures_oe;
  "feeds/fixtures/v5-shape": typeof feeds_fixtures_v5_shape;
  "feeds/leaguepedia": typeof feeds_leaguepedia;
  "feeds/load": typeof feeds_load;
  "feeds/oraclesElixir": typeof feeds_oraclesElixir;
  "following/feed": typeof following_feed;
  "following/fit": typeof following_fit;
  "following/follows": typeof following_follows;
  "following/lines": typeof following_lines;
  "following/trucks": typeof following_trucks;
  "gameweeks/starAndFlop": typeof gameweeks_starAndFlop;
  "lck/series": typeof lck_series;
  "leagues/membership": typeof leagues_membership;
  "leagues/store": typeof leagues_store;
  "leagues/tables": typeof leagues_tables;
  "scoring/fixtures": typeof scoring_fixtures;
  "scoring/game": typeof scoring_game;
  "scoring/series": typeof scoring_series;
  "signIn/autoFill": typeof signIn_autoFill;
  "signIn/signUp": typeof signIn_signUp;
  "squads/autoSubs": typeof squads_autoSubs;
  "squads/budget": typeof squads_budget;
  "squads/buffs": typeof squads_buffs;
  "squads/carry": typeof squads_carry;
  "squads/fixtures": typeof squads_fixtures;
  "squads/splitBreak": typeof squads_splitBreak;
  "squads/squad": typeof squads_squad;
  "squads/transfers": typeof squads_transfers;
  "stats/gameStats": typeof stats_gameStats;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
