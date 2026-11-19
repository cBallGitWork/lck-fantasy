import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { TEST_MANAGER_STYLES } from "./admin/testManagers";
import { liveReading } from "./feeds/liveFeed";
import { PLAYER_ROLES, STARTER_SLOTS } from "./squads/squad";
import { literals, seasonSettings, split, stage } from "./world/seasonSettings";

// Tables arrive with the features that need them (docs/data-model.md holds the model).

/** A source's row as it sent it: column name to text (ARCHITECTURE.md, Data). */
export const rawRow = v.record(v.string(), v.string());

export { literals };

const playerRole = literals(PLAYER_ROLES);

/** A gameweek's state (docs/data-model.md, Gameweeks). */
export const gameweekState = literals(["toCome", "live", "final"]);

/** A competition: its name, region, time zone (never shown: every time on screen is the manager's own,
 *  Craig, 19 Nov 2026) and the sign its money is written with (`₩`). */
export const competitionFields = { name: v.string(), region: v.string(), timeZone: v.string(), currency: v.string() };

/** A price's pick, by team code: a player by role and handle, or the team's coach, which is the team
 *  and has no handle (spec/01). */
export const pricedPick = {
  team: v.string(),
  role: v.union(playerRole, v.literal("coach")),
  handle: v.optional(v.string()),
};

/** A live game's feed: read once a minute while `polling`, then `finished`, or `down` when it
 *  went quiet too long (spec/11, Live). */
export const LIVE_FEED_STATES = ["polling", "finished", "down"] as const;

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
  // The real world (convex/world): filled by feeds, corrected by an admin, never written by the game.
  competitions: defineTable(competitionFields).index("by_name", ["name"]),
  seasons: defineTable({
    competition: v.id("competitions"),
    year: v.number(),
    splits: v.array(split),
    settings: seasonSettings,
    /** Unset for a season with no stages yet, such as 2027's until its dates are out. */
    stages: v.optional(v.array(stage)),
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
    /** Its stage's name, one of its season's `stages`; unset in a season with none. */
    stage: v.optional(v.string()),
  }).index("by_season", ["season", "number"]),
  /** A pick's price in won from a gameweek on, until its next row (docs/data-model.md, `prices`). */
  prices: defineTable({ season: v.id("seasons"), fromGameweek: v.number(), ...pricedPick, won: v.number() }).index("by_season", [
    "season",
    "fromGameweek",
  ]),
  teams: defineTable({ name: v.string(), oeId: v.string() }).index("by_oeId", ["oeId"]),
  /** `nationality` is the player's country, for his flag; unset until known (spec/16, Flags). */
  players: defineTable({ handle: v.string(), oeId: v.string(), nationality: v.optional(v.string()) }).index("by_oeId", ["oeId"]),
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
    .index("by_series", ["series"])
    .index("by_startedAt", ["startedAt"]),
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
  /** A game in play: the live feed's latest reading, folded from every window read so far (spec/11). */
  liveFrames: defineTable({
    /** The feed's own game id, from lolesports.com's schedule pages or pasted in by an admin. */
    esportsGameId: v.string(),
    season: v.id("seasons"),
    state: literals(LIVE_FEED_STATES),
    /** When reading began, in ms since the epoch: the quiet spell that counts as down starts here
     *  until the first new reading. */
    since: v.number(),
    /** When the last new reading came in; null before the first. */
    readAt: v.union(v.number(), v.null()),
    /** What went wrong on the latest read, for the alert if the feed goes down. */
    lastError: v.optional(v.string()),
    /** Null until the first window is read: no live points yet. */
    reading: v.union(liveReading, v.null()),
  }).index("by_esportsGameId", ["esportsGameId"]),

  // The game (convex/signIn makes a manager, its entry and its picks on sign-up).
  managers: defineTable({
    /** The signed-in account: Google or Discord, through Convex Auth (spec/09). */
    account: v.string(),
    /** The account's, set once, in every region (spec/16, One account, two regions). */
    country: v.string(),
    /** When the manager ticked the Terms and Privacy, and which version (spec/09). */
    agreed: v.object({ at: v.number(), version: v.string() }),
    /** The name a table shows beside the team name (spec/08): a test manager's is made up; a real
     *  manager's is unset until Convex Auth brings the account's. */
    name: v.optional(v.string()),
    /** A test manager's style (spec/10, The road to launch); unset for a real manager. Nothing a
     *  manager reads says test manager (#400). */
    testStyle: v.optional(literals(TEST_MANAGER_STYLES)),
  }).index("by_account", ["account"]),
  /** A personal invite to the closed tests, one person each (spec/10, The road to launch). */
  invites: defineTable({
    code: v.string(),
    /** Who Craig made it for, as he wrote it. */
    for: v.string(),
    /** The account that signed up with it, and when; unset while unused. */
    used: v.optional(v.object({ account: v.string(), at: v.number() })),
  })
    .index("by_code", ["code"])
    .index("by_account", ["used.account"]),
  entries: defineTable({
    manager: v.id("managers"),
    season: v.id("seasons"),
    teamName: v.string(),
    /** One of its season's teams: each region's entry has its own (spec/16). */
    favouriteTeam: v.id("teams"),
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

  // Leagues (convex/leagues): each belongs to one season, so to one region. Overall, country and team
  // leagues exist once each per season (spec/08; spec/16).
  leagues: defineTable(
    v.union(
      v.object({ season: v.id("seasons"), kind: v.literal("overall") }),
      v.object({ season: v.id("seasons"), kind: v.literal("country"), country: v.string() }),
      v.object({ season: v.id("seasons"), kind: v.literal("team"), team: v.id("teams") }),
      v.object({
        season: v.id("seasons"),
        kind: v.literal("private"),
        name: v.string(),
        code: v.string(),
        maker: v.id("entries"),
        /** The gameweek its scoring starts from, picked by its maker. */
        startGameweek: v.number(),
      }),
    ),
  )
    .index("by_kind", ["season", "kind"])
    .index("by_country", ["season", "country"])
    .index("by_team", ["season", "team"])
    .index("by_code", ["code"]),
  leagueEntries: defineTable({ league: v.id("leagues"), entry: v.id("entries") })
    .index("by_league", ["league", "entry"])
    .index("by_entry", ["entry"]),
  /** Managers a private league's maker removed: they can't rejoin it (spec/08). */
  leagueRemovals: defineTable({ league: v.id("leagues"), entry: v.id("entries") }).index("by_league", ["league", "entry"]),

  // The sim (convex/admin/clock.ts): its one stored moment, which Next day and Play to end move (spec/10).
  simClock: defineTable({ now: v.number() }),

  // Admin alerts (convex/admin/alerts.ts): what an admin must fix, never a silent gap (spec/11, Live).
  alerts: defineTable({
    at: v.number(),
    /** The end of the match day it was raised on, in the competition's zone: one email per day. */
    matchDayEnd: v.number(),
    message: v.string(),
  }).index("by_matchDayEnd", ["matchDayEnd"]),
});
