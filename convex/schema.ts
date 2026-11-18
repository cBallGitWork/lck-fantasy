import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { BUFF_EFFECTS } from "./squads/buffs";
import { PLAYER_ROLES, STARTER_SLOTS } from "./squads/squad";

// Tables arrive with the features that need them (docs/data-model.md holds the model).

/** A source's row as it sent it: column name to text (ARCHITECTURE.md, Data). */
export const rawRow = v.record(v.string(), v.string());

export const literals = <T extends string>(values: readonly [T, T, ...T[]]) =>
  v.union(...values.map((value) => v.literal(value)));

/** A number for each of `keys`: slot sizes, role minimums. */
const countPer = <K extends string>(keys: readonly K[]) =>
  v.object(Object.fromEntries(keys.map((key) => [key, v.number()])) as Record<K, ReturnType<typeof v.number>>);

const playerRole = literals(PLAYER_ROLES);

/** A season's rules, every value Craig may tune (spec/01, 02, 03, 04, 06, 09): data, never code. */
export const seasonSettings = v.object({
  /** convex/squads/squad.ts's SquadSettings. */
  squad: v.object({
    starterSlots: countPer(STARTER_SLOTS),
    benchSize: v.number(),
    minPerRole: countPer(PLAYER_ROLES),
    teamCap: v.union(v.number(), v.null()),
  }),
  /** In won; null for no budget (spec/10). */
  budget: v.union(v.number(), v.null()),
  /** In won: Auto-fill aims to spend at least the budget less this (spec/09). */
  autoFillGap: v.number(),
  /** convex/squads/transfers.ts's TransferSettings. */
  transfers: v.object({ freePerGameweek: v.number(), bankCap: v.number(), hitPoints: v.number(), freeAfterUnlimited: v.number() }),
  carryMultiplier: v.number(),
  /** Each buff, its multiplier where its effect has one, and how many a manager gets per split (spec/06). */
  buffs: v.array(v.object({ name: v.string(), effect: literals(BUFF_EFFECTS), multiplier: v.optional(v.number()), perSplit: v.number() })),
  teamNameMaxLength: v.number(),
});

/** A gameweek's state (docs/data-model.md, Gameweeks). */
export const gameweekState = literals(["toCome", "live", "final"]);

export const competitionFields = { name: v.string(), region: v.string(), timeZone: v.string() };
export const split = v.object({ number: v.number(), name: v.string() });

/** A price's pick, by team code: a player by role and handle, or the team's coach, which is the team
 *  and has no handle (spec/01). */
export const pricedPick = {
  team: v.string(),
  role: v.union(playerRole, v.literal("coach")),
  handle: v.optional(v.string()),
};

/** One side of a game: its team's lines for the coach (spec/05, The coach). */
const teamLine = v.object({
  team: v.id("teams"),
  won: v.boolean(),
  firstTower: v.boolean(),
  drakes: v.number(),
  barons: v.number(),
  elders: v.number(),
  raw: rawRow,
});

export default defineSchema({
  // The real world (convex/lck): filled by feeds, corrected by an admin, never written by the game.
  competitions: defineTable(competitionFields).index("by_name", ["name"]),
  seasons: defineTable({
    competition: v.id("competitions"),
    year: v.number(),
    splits: v.array(split),
    settings: seasonSettings,
    /** Made-up values, held until the real ones are known (spec/10). */
    madeUp: v.boolean(),
  }).index("by_competition", ["competition", "year"]),
  gameweeks: defineTable({
    season: v.id("seasons"),
    number: v.number(),
    split: v.number(),
    /** In ms since the epoch, UTC. */
    deadline: v.number(),
    state: gameweekState,
  }).index("by_season", ["season", "number"]),
  /** A pick's price in won from a gameweek on, until its next row (docs/data-model.md, `prices`). */
  prices: defineTable({ season: v.id("seasons"), fromGameweek: v.number(), ...pricedPick, won: v.number() }).index("by_season", [
    "season",
    "fromGameweek",
  ]),
  teams: defineTable({ name: v.string(), oeId: v.string() }).index("by_oeId", ["oeId"]),
  players: defineTable({ handle: v.string(), oeId: v.string() }).index("by_oeId", ["oeId"]),
  series: defineTable({
    /** Game 1: Oracle's Elixir has no series id, so a series is known by its opening game. */
    firstGame: v.id("games"),
    teams: v.array(v.id("teams")),
    /** Games won by each team, in `teams` order. */
    score: v.array(v.number()),
    /** When the last game ended, in ms since the epoch. */
    endedAt: v.number(),
    /** Every game's settled stats are in (spec/11, Final); else `waiting` says which and why. */
    settledStatsIn: v.boolean(),
    waiting: v.array(v.string()),
  }).index("by_firstGame", ["firstGame"]),
  games: defineTable({
    oeId: v.string(),
    /** Unset for a game out of sequence, for an admin to place. */
    series: v.optional(v.id("series")),
    /** The two teams' ids, sorted, to find a pair's games. */
    pair: v.string(),
    gameNumber: v.number(),
    startedAt: v.number(),
    patch: v.string(),
    lengthSeconds: v.number(),
    /** Oracle's Elixir's "complete": a partial game can't settle a series. */
    complete: v.boolean(),
    winner: v.id("teams"),
    blue: teamLine,
    red: teamLine,
    /** Leaguepedia's match data, as it sent it, and the page key it came from. */
    matchData: v.optional(v.any()),
    matchDataKey: v.optional(v.string()),
  })
    .index("by_oeId", ["oeId"])
    .index("by_pair", ["pair"])
    .index("by_series", ["series"]),
  gameLineups: defineTable({
    game: v.id("games"),
    player: v.id("players"),
    team: v.id("teams"),
    role: playerRole,
    champion: v.string(),
  }).index("by_game", ["game"]),

  // Stats (convex/stats): each player's, as the feeds sent them.
  gameStats: defineTable({
    game: v.id("games"),
    player: v.id("players"),
    participantId: v.number(),
    kills: v.number(),
    deaths: v.number(),
    assists: v.number(),
    goldDiffAt15: v.union(v.number(), v.null()),
    firstBloodKill: v.boolean(),
    biggestMultikill: v.number(),
    /** Leaguepedia's, unset until its match data is in. */
    soloKills: v.optional(v.number()),
    steals: v.optional(v.number()),
    raw: rawRow,
  })
    .index("by_game", ["game"])
    .index("by_player", ["player"]),

  // The game (convex/signIn makes a manager, its entry and its picks on sign-up).
  managers: defineTable({
    /** The signed-in account: Google or Discord, through Convex Auth (spec/09). */
    account: v.string(),
    country: v.string(),
    favouriteTeam: v.id("teams"),
    /** When the manager ticked the Terms and Privacy, and which version (spec/09). */
    agreed: v.object({ at: v.number(), version: v.string() }),
  }).index("by_account", ["account"]),
  entries: defineTable({
    manager: v.id("managers"),
    season: v.id("seasons"),
    teamName: v.string(),
    /** The first gameweek it scores; it starts on 0 points (spec/09, Joining late). */
    firstGameweek: v.number(),
    /** In won: the budget less what the squad cost. Null for a season with no budget. */
    bank: v.union(v.number(), v.null()),
  }).index("by_manager", ["manager", "season"]),
  /** An entry's squad for one gameweek (docs/data-model.md, `picks`). */
  picks: defineTable({
    entry: v.id("entries"),
    gameweek: v.number(),
    slot: v.union(literals(STARTER_SLOTS), v.literal("bench")),
    /** On the bench: 1 is bench 1. */
    benchOrder: v.optional(v.number()),
    ...pricedPick,
    /** The Captain; there is no vice-captain (spec/04). */
    captain: v.boolean(),
    /** In won: the price it was bought at. */
    buyPrice: v.number(),
  }).index("by_entry", ["entry", "gameweek"]),

  // Leagues (convex/leagues): Overall, country and team leagues exist once each (spec/08).
  leagues: defineTable(
    v.union(
      v.object({ kind: v.literal("overall") }),
      v.object({ kind: v.literal("country"), country: v.string() }),
      v.object({ kind: v.literal("team"), team: v.id("teams") }),
      v.object({
        kind: v.literal("private"),
        name: v.string(),
        code: v.string(),
        maker: v.id("entries"),
        /** The gameweek its scoring starts from, picked by its maker. */
        startGameweek: v.number(),
      }),
    ),
  )
    .index("by_kind", ["kind"])
    .index("by_country", ["country"])
    .index("by_team", ["team"])
    .index("by_code", ["code"]),
  leagueEntries: defineTable({ league: v.id("leagues"), entry: v.id("entries") })
    .index("by_league", ["league", "entry"])
    .index("by_entry", ["entry"]),
  /** Managers a private league's maker removed: they can't rejoin it (spec/08). */
  leagueRemovals: defineTable({ league: v.id("leagues"), entry: v.id("entries") }).index("by_league", ["league", "entry"]),
});
