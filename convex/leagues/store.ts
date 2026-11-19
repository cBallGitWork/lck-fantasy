// Leagues stored (spec/08): the three every manager joins, and private leagues made, joined, renamed,
// left and deleted. Internal until Convex Auth is wired: the signed-in manager's entry is passed in.
// The cap and size settings are the competition's data, passed in, as the rules take them.
import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation, internalQuery, type MutationCtx, type QueryCtx } from "../_generated/server";
import { now } from "../admin/clock";
import {
  autoLeagues,
  canChangeFavouriteTeam,
  joinCode,
  joinProblems,
  mayAct,
  normalCode,
  startGameweekChoices,
  type AutoLeague,
  type PrivateLeagueAction,
} from "./membership";

const settings = v.object({ privateLeagueCap: v.number(), privateLeagueSize: v.union(v.number(), v.null()) });

/** Why a league action was refused, for the page to say. */
export type LeagueRefusal =
  | ReturnType<typeof joinProblems>[number]
  | { rule: "noName" }
  | { rule: "startGameweek"; choices: number[] }
  | { rule: "noCode"; code: string }
  | { rule: "notMaker" | "makerLeaves" | "notMember" | "removed" }
  | { rule: "favouriteTeamFixed" | "countryFixed" | "noCountry" }
  | { rule: "otherSeason" };

const refuse = (refusal: LeagueRefusal) => new ConvexError(refusal);

/** A new entry joins its season's Overall, its country's league and its favourite team's (spec/08;
 *  spec/16, Leagues in the LEC). */
export const enterAutoLeagues = internalMutation({
  args: { entry: v.id("entries") },
  handler: (ctx, { entry }) => joinAutoLeagues(ctx, entry),
});

/** `enterAutoLeagues` inside another mutation: sign-up's (convex/signIn). */
export async function joinAutoLeagues(ctx: MutationCtx, entry: Id<"entries">) {
  const { row, manager } = await entryAndManager(ctx, entry);
  for (const auto of autoLeagues({ country: manager.country, favouriteTeamId: row.favouriteTeam })) {
    await join(ctx, await autoLeague(ctx, row.season, auto), entry);
  }
}

/** The favourite team, and with it the team league, until the deadline of the entry's first
 *  gameweek, in ms since the epoch (spec/08). */
export const changeFavouriteTeam = internalMutation({
  args: { entry: v.id("entries"), team: v.id("teams"), firstDeadline: v.number() },
  handler: async (ctx, { entry, team, firstDeadline }) => {
    if (!canChangeFavouriteTeam(firstDeadline, await now(ctx))) throw refuse({ rule: "favouriteTeamFixed" });
    const { row } = await entryAndManager(ctx, entry);
    // Every entry joins its team's league at sign-up, so one that isn't in it is a broken row, said so.
    const old = await membership(ctx, await autoLeague(ctx, row.season, { kind: "team", teamId: row.favouriteTeam }), entry);
    if (old === null) throw new Error(`Entry ${entry} isn't in its favourite team's league.`);
    await ctx.db.delete(old._id);
    await ctx.db.patch(entry, { favouriteTeam: team });
    await join(ctx, await autoLeague(ctx, row.season, { kind: "team", teamId: team }), entry);
  },
});

/** The country, and with it the country league in every region the manager plays, until the deadline
 *  of their first gameweek, as the favourite team (spec/08; spec/09). The country is the account's
 *  (spec/16), so that is the earliest first deadline of any of their entries. */
export const changeCountry = internalMutation({
  args: { entry: v.id("entries"), country: v.string() },
  handler: async (ctx, { entry, country }) => {
    const trimmed = country.trim();
    if (trimmed === "") throw refuse({ rule: "noCountry" });
    const { manager } = await entryAndManager(ctx, entry);
    const entries = await ctx.db.query("entries").withIndex("by_manager", (q) => q.eq("manager", manager._id)).collect();
    const deadlines = await Promise.all(entries.map((row) => firstDeadlineOf(ctx, row)));
    if (!canChangeFavouriteTeam(Math.min(...deadlines), await now(ctx))) throw refuse({ rule: "countryFixed" });
    for (const row of entries) {
      // Every entry joins its country's league at sign-up, so one that isn't in it is a broken row, said so.
      const old = await membership(ctx, await autoLeague(ctx, row.season, { kind: "country", country: manager.country }), row._id);
      if (old === null) throw new Error(`Entry ${row._id} isn't in its country's league.`);
      await ctx.db.delete(old._id);
      await join(ctx, await autoLeague(ctx, row.season, { kind: "country", country: trimmed }), row._id);
    }
    await ctx.db.patch(manager._id, { country: trimmed });
  },
});

/** A private league in its maker's season, so its region, its maker its first member, counting from
 *  this gameweek or a later one. */
export const createPrivateLeague = internalMutation({
  args: { entry: v.id("entries"), name: v.string(), startGameweek: v.number(), currentGameweek: v.number(), lastGameweek: v.number(), settings },
  handler: async (ctx, { entry, name, startGameweek, currentGameweek, lastGameweek, settings }) => {
    const trimmed = name.trim();
    if (trimmed === "") throw refuse({ rule: "noName" });
    const choices = startGameweekChoices(currentGameweek, lastGameweek);
    if (!choices.includes(startGameweek)) throw refuse({ rule: "startGameweek", choices });
    await checkJoin(ctx, entry, 0, settings);
    let code: string;
    do code = joinCode(trimmed, Math.random);
    while ((await leagueByCode(ctx, code)) !== null);
    const { season } = (await entryAndManager(ctx, entry)).row;
    const league = await ctx.db.insert("leagues", { season, kind: "private", name: trimmed, code, maker: entry, startGameweek });
    await join(ctx, league, entry);
    return { league, code };
  },
});

/** Join a private league by its code, any case. Joining one already in changes nothing; a manager
 *  its maker removed can't rejoin (spec/08). A code joins only its own season's entries, so never
 *  another region's (spec/16). */
export const joinPrivateLeague = internalMutation({
  args: { entry: v.id("entries"), code: v.string(), settings },
  handler: async (ctx, { entry, code, settings }) => {
    const league = await leagueByCode(ctx, normalCode(code));
    if (league === null) throw refuse({ rule: "noCode", code });
    if (league.season !== (await entryAndManager(ctx, entry)).row.season) throw refuse({ rule: "otherSeason" });
    if ((await membership(ctx, league._id, entry)) === null) {
      if ((await removal(ctx, league._id, entry)) !== null) throw refuse({ rule: "removed" });
      await checkJoin(ctx, entry, (await members(ctx, league._id)).length, settings);
      await join(ctx, league._id, entry);
    }
    return league._id;
  },
});

export const renamePrivateLeague = internalMutation({
  args: { entry: v.id("entries"), league: v.id("leagues"), name: v.string() },
  handler: async (ctx, { entry, league, name }) => {
    await allowed(ctx, "rename", entry, league);
    const trimmed = name.trim();
    if (trimmed === "") throw refuse({ rule: "noName" });
    await ctx.db.patch(league, { name: trimmed });
  },
});

/** The maker takes a manager out of the league for good: they can't rejoin it (spec/08). */
export const removeFromPrivateLeague = internalMutation({
  args: { entry: v.id("entries"), league: v.id("leagues"), member: v.id("entries") },
  handler: async (ctx, { entry, league, member }) => {
    await allowed(ctx, "remove", entry, league);
    if (member === entry) throw refuse({ rule: "makerLeaves" });
    await leave(ctx, league, member);
    await ctx.db.insert("leagueRemovals", { league, entry: member });
  },
});

/** The maker deletes the league, and every membership and removal with it. */
export const deletePrivateLeague = internalMutation({
  args: { entry: v.id("entries"), league: v.id("leagues") },
  handler: async (ctx, { entry, league }) => {
    await allowed(ctx, "delete", entry, league);
    for (const row of await members(ctx, league)) await ctx.db.delete(row._id);
    const removals = await ctx.db.query("leagueRemovals").withIndex("by_league", (q) => q.eq("league", league)).collect();
    for (const row of removals) await ctx.db.delete(row._id);
    await ctx.db.delete(league);
  },
});

/** Any member but the maker leaves (spec/08). */
export const leavePrivateLeague = internalMutation({
  args: { entry: v.id("entries"), league: v.id("leagues") },
  handler: async (ctx, { entry, league }) => {
    await allowed(ctx, "leave", entry, league);
    await leave(ctx, league, entry);
  },
});

/** Every league an entry is in, Overall, country and team first, then its private leagues, each
 *  with its member count. */
export const leaguesOf = internalQuery({
  args: { entry: v.id("entries") },
  handler: async (ctx, { entry }) => {
    const rows = await ctx.db.query("leagueEntries").withIndex("by_entry", (q) => q.eq("entry", entry)).collect();
    const leagues = await Promise.all(
      rows.map(async (row) => ({ ...(await leagueOf(ctx, row)), size: (await members(ctx, row.league)).length })),
    );
    const order: Doc<"leagues">["kind"][] = ["overall", "country", "team", "private"];
    return leagues.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  },
});

async function entryAndManager(ctx: QueryCtx, entry: Id<"entries">): Promise<{ row: Doc<"entries">; manager: Doc<"managers"> }> {
  const row = await ctx.db.get(entry);
  if (row === null) throw new Error(`No entry ${entry}.`);
  const manager = await ctx.db.get(row.manager);
  if (manager === null) throw new Error(`No manager for entry ${entry}.`);
  return { row, manager };
}

/** The deadline of an entry's first gameweek, in ms since the epoch. */
async function firstDeadlineOf(ctx: QueryCtx, entry: Doc<"entries">): Promise<number> {
  const gameweek = await ctx.db
    .query("gameweeks")
    .withIndex("by_season", (q) => q.eq("season", entry.season).eq("number", entry.firstGameweek))
    .unique();
  if (gameweek === null) throw new Error(`No gameweek ${entry.firstGameweek} for entry ${entry._id}.`);
  return gameweek.deadline;
}

/** A membership's league; a membership whose league is gone is a broken row, said so. */
async function leagueOf(ctx: QueryCtx, row: Doc<"leagueEntries">): Promise<Doc<"leagues">> {
  const league = await ctx.db.get(row.league);
  if (league === null) throw new Error(`No league ${row.league} for membership ${row._id}.`);
  return league;
}

/** A season's one league of an auto kind, made the first time a manager needs it. */
async function autoLeague(ctx: MutationCtx, season: Id<"seasons">, auto: AutoLeague): Promise<Id<"leagues">> {
  const leagues = ctx.db.query("leagues");
  const found =
    auto.kind === "overall"
      ? await leagues.withIndex("by_kind", (q) => q.eq("season", season).eq("kind", "overall")).first()
      : auto.kind === "country"
        ? await leagues.withIndex("by_country", (q) => q.eq("season", season).eq("country", auto.country)).first()
        : await leagues.withIndex("by_team", (q) => q.eq("season", season).eq("team", auto.teamId as Id<"teams">)).first();
  if (found !== null) return found._id;
  if (auto.kind === "overall") return ctx.db.insert("leagues", { season, kind: "overall" });
  if (auto.kind === "country") return ctx.db.insert("leagues", { season, kind: "country", country: auto.country });
  return ctx.db.insert("leagues", { season, kind: "team", team: auto.teamId as Id<"teams"> });
}

const leagueByCode = (ctx: QueryCtx, code: string) =>
  ctx.db.query("leagues").withIndex("by_code", (q) => q.eq("code", code)).first();

const members = (ctx: QueryCtx, league: Id<"leagues">) =>
  ctx.db.query("leagueEntries").withIndex("by_league", (q) => q.eq("league", league)).collect();

const membership = (ctx: QueryCtx, league: Id<"leagues">, entry: Id<"entries">) =>
  ctx.db.query("leagueEntries").withIndex("by_league", (q) => q.eq("league", league).eq("entry", entry)).first();

const removal = (ctx: QueryCtx, league: Id<"leagues">, entry: Id<"entries">) =>
  ctx.db.query("leagueRemovals").withIndex("by_league", (q) => q.eq("league", league).eq("entry", entry)).first();

async function join(ctx: MutationCtx, league: Id<"leagues">, entry: Id<"entries">) {
  if ((await membership(ctx, league, entry)) === null) await ctx.db.insert("leagueEntries", { league, entry });
}

async function leave(ctx: MutationCtx, league: Id<"leagues">, entry: Id<"entries">) {
  const row = await membership(ctx, league, entry);
  if (row === null) throw refuse({ rule: "notMember" });
  await ctx.db.delete(row._id);
}

/** Refused when the entry is at the private league cap, or the league is full. */
async function checkJoin(ctx: QueryCtx, entry: Id<"entries">, size: number, settings: { privateLeagueCap: number; privateLeagueSize: number | null }) {
  const rows = await ctx.db.query("leagueEntries").withIndex("by_entry", (q) => q.eq("entry", entry)).collect();
  const kinds = await Promise.all(rows.map(async (row) => (await leagueOf(ctx, row)).kind));
  const [problem] = joinProblems(kinds.filter((kind) => kind === "private").length, size, settings);
  if (problem !== undefined) throw refuse(problem);
}

/** Refused unless the league is private, the entry is in it, and the rule lets it act (spec/08). */
async function allowed(ctx: QueryCtx, action: PrivateLeagueAction, entry: Id<"entries">, leagueId: Id<"leagues">) {
  const league = await ctx.db.get(leagueId);
  if (league === null || league.kind !== "private" || (await membership(ctx, leagueId, entry)) === null) {
    throw refuse({ rule: "notMember" });
  }
  if (!mayAct(action, entry, league.maker)) throw refuse({ rule: action === "leave" ? "makerLeaves" : "notMaker" });
}
