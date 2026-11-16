import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { PLAYER_ROLES } from "./squads/squad";

// Tables arrive with the features that need them (docs/data-model.md holds the model).

/** A source's row as it sent it: column name to text (ARCHITECTURE.md, Data). */
export const rawRow = v.record(v.string(), v.string());

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
    role: v.union(...PLAYER_ROLES.map((role) => v.literal(role))),
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
});
