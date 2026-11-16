// Leagues stored (spec/08): the three every manager joins, and private leagues made, joined, renamed,
// left and deleted. Internal until sign-in arrives (#42): the signed-in manager's entry is passed in.
// The cap and size settings are the competition's data, passed in, as the rules take them.
import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation, internalQuery, type MutationCtx, type QueryCtx } from "../_generated/server";
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
  | { rule: "notMaker" | "makerLeaves" | "notMember" }
  | { rule: "favouriteTeamFixed" };

const refuse = (refusal: LeagueRefusal) => new ConvexError(refusal);

/** A new entry joins Overall, its country's league and its favourite team's (spec/08). */
export const enterAutoLeagues = internalMutation({
  args: { entry: v.id("entries") },
  handler: async (ctx, { entry }) => {
    const manager = await managerOf(ctx, entry);
    for (const auto of autoLeagues({ country: manager.country, favouriteTeamId: manager.favouriteTeam })) {
      await join(ctx, await autoLeague(ctx, auto), entry);
    }
  },
});

/** The favourite team, and with it the team league, until the first gameweek scores (spec/08). */
export const changeFavouriteTeam = internalMutation({
  args: { entry: v.id("entries"), team: v.id("teams"), firstScoredGameweek: v.union(v.number(), v.null()) },
  handler: async (ctx, { entry, team, firstScoredGameweek }) => {
    if (!canChangeFavouriteTeam(firstScoredGameweek)) throw refuse({ rule: "favouriteTeamFixed" });
    const manager = await managerOf(ctx, entry);
    const old = await autoLeague(ctx, { kind: "team", teamId: manager.favouriteTeam });
    await leave(ctx, old, entry);
    await ctx.db.patch(manager._id, { favouriteTeam: team });
    await join(ctx, await autoLeague(ctx, { kind: "team", teamId: team }), entry);
  },
});

/** A private league, its maker its first member, counting from this gameweek or a later one. */
export const createPrivateLeague = internalMutation({
  args: { entry: v.id("entries"), name: v.string(), startGameweek: v.number(), currentGameweek: v.number(), lastGameweek: v.number(), settings },
  handler: async (ctx, { entry, name, startGameweek, currentGameweek, lastGameweek, settings }) => {
    const trimmed = name.trim();
    if (trimmed === "") throw refuse({ rule: "noName" });
    const choices = startGameweekChoices(currentGameweek, lastGameweek);
    if (!choices.includes(startGameweek)) throw refuse({ rule: "startGameweek", choices });
    await checkJoin(ctx, entry, 0, settings);
    let code = joinCode(trimmed, Math.random);
    while ((await leagueByCode(ctx, code)) !== null) code = joinCode(trimmed, Math.random);
    const league = await ctx.db.insert("leagues", { kind: "private", name: trimmed, code, maker: entry, startGameweek });
    await join(ctx, league, entry);
    return { league, code };
  },
});

/** Join a private league by its code, any case. Joining one already in changes nothing. */
export const joinPrivateLeague = internalMutation({
  args: { entry: v.id("entries"), code: v.string(), settings },
  handler: async (ctx, { entry, code, settings }) => {
    const league = await leagueByCode(ctx, normalCode(code));
    if (league === null) throw refuse({ rule: "noCode", code });
    if ((await membership(ctx, league._id, entry)) === null) {
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

/** The maker takes a manager out of the league. */
export const removeFromPrivateLeague = internalMutation({
  args: { entry: v.id("entries"), league: v.id("leagues"), member: v.id("entries") },
  handler: async (ctx, { entry, league, member }) => {
    await allowed(ctx, "remove", entry, league);
    if (member === entry) throw refuse({ rule: "makerLeaves" });
    await leave(ctx, league, member);
  },
});

/** The maker deletes the league, and every membership with it. */
export const deletePrivateLeague = internalMutation({
  args: { entry: v.id("entries"), league: v.id("leagues") },
  handler: async (ctx, { entry, league }) => {
    await allowed(ctx, "delete", entry, league);
    for (const row of await members(ctx, league)) await ctx.db.delete(row._id);
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
      rows.map(async (row) => ({ ...(await ctx.db.get(row.league))!, size: (await members(ctx, row.league)).length })),
    );
    const order: Doc<"leagues">["kind"][] = ["overall", "country", "team", "private"];
    return leagues.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  },
});

async function managerOf(ctx: QueryCtx, entry: Id<"entries">): Promise<Doc<"managers">> {
  const row = await ctx.db.get(entry);
  if (row === null) throw new Error(`No entry ${entry}.`);
  const manager = await ctx.db.get(row.manager);
  if (manager === null) throw new Error(`No manager for entry ${entry}.`);
  return manager;
}

/** The one league of an auto kind, made the first time a manager needs it. */
async function autoLeague(ctx: MutationCtx, auto: AutoLeague): Promise<Id<"leagues">> {
  const found =
    auto.kind === "overall"
      ? await ctx.db.query("leagues").withIndex("by_kind", (q) => q.eq("kind", "overall")).first()
      : auto.kind === "country"
        ? await ctx.db.query("leagues").withIndex("by_country", (q) => q.eq("country", auto.country)).first()
        : await ctx.db.query("leagues").withIndex("by_team", (q) => q.eq("team", auto.teamId as Id<"teams">)).first();
  if (found !== null) return found._id;
  if (auto.kind === "overall") return ctx.db.insert("leagues", { kind: "overall" });
  if (auto.kind === "country") return ctx.db.insert("leagues", { kind: "country", country: auto.country });
  return ctx.db.insert("leagues", { kind: "team", team: auto.teamId as Id<"teams"> });
}

const leagueByCode = (ctx: QueryCtx, code: string) =>
  ctx.db.query("leagues").withIndex("by_code", (q) => q.eq("code", code)).first();

const members = (ctx: QueryCtx, league: Id<"leagues">) =>
  ctx.db.query("leagueEntries").withIndex("by_league", (q) => q.eq("league", league)).collect();

const membership = (ctx: QueryCtx, league: Id<"leagues">, entry: Id<"entries">) =>
  ctx.db.query("leagueEntries").withIndex("by_league", (q) => q.eq("league", league).eq("entry", entry)).first();

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
  const kinds = await Promise.all(rows.map(async (row) => (await ctx.db.get(row.league))?.kind));
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
