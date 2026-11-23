// Sign-up stored (spec/09, Signing up): Save team turns a guest's squad into a manager, an entry and its
// picks, at that moment's prices, and enters it into Overall, its country's and its team's leagues
// (spec/08). Internal until Convex Auth is wired: the signed-in account is passed in.
import { ConvexError, v } from "convex/values";
import { sum } from "../../src/parts/util/sum";
import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation, internalQuery, type MutationCtx, type QueryCtx } from "../_generated/server";
import { now } from "../admin/clock";
import type { TestManagerStyle } from "../admin/testManagers";
import { pricedPickOf, pricesFor, requireSeason } from "../world/season";
import { joinAutoLeagues } from "../leagues/store";
import { literals } from "../world/seasonSettings";
import { requirePrice, type Prices } from "../squads/budget";
import { allPicks, PLAYER_ROLES, STARTER_SLOTS, type Squad } from "../squads/squad";
import { admit, type InviteRefusal } from "./invites";
import { firstCaptain, firstScoringGameweek, signUpProblems, type SignUpProblem } from "./signUp";

const pick = v.object({ id: v.string(), teamId: v.string(), role: literals([...PLAYER_ROLES, "coach"]) });
const squad = v.object({ starters: v.array(v.object({ slot: literals(STARTER_SLOTS), pick })), bench: v.array(pick) });
const season = { competition: v.string(), year: v.number() };

/** Why a Save was refused, for the sheet to say: a sign-up rule, every deadline gone, an account
 *  that already has a team this season, or a closed test it has no invite to. */
export type SaveRefusal = { rule: "signUp"; problems: SignUpProblem[] } | { rule: "seasonOver" } | { rule: "hasTeam" } | InviteRefusal;

const refuse = (refusal: SaveRefusal) => new ConvexError(refusal);

/** Save team: the guest's squad, bought at this moment's prices, becomes the account's entry for the
 *  season. It starts on 0 points and scores from its first deadline still to come (spec/09, Joining
 *  late); its Captain is the highest-priced starter. Refused, with every reason, when it can't. */
export const saveNewTeam = internalMutation({
  args: {
    account: v.string(),
    ...season,
    squad,
    teamName: v.string(),
    favouriteTeam: v.string(),
    country: v.string(),
    /** The version of the Terms and Privacy the box was ticked against. */
    agreedVersion: v.string(),
    /** The code in a personal invite's link, while the season runs as a closed test. */
    invite: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const at = await now(ctx);
    const { season } = await requireSeason(ctx, args.competition, args.year);
    if ((await entryOf(ctx, args.account, season._id)) !== null) throw refuse({ rule: "hasTeam" });
    if (season.settings.signUpOpen === false) {
      const turnedAway = await admit(ctx, args.account, args.invite, at);
      if (turnedAway !== null) throw refuse(turnedAway);
    }
    const open = await signUpMarket(ctx, season._id, at);
    if (open === null) throw refuse({ rule: "seasonOver" });
    return storeNewTeam(ctx, season, open, at, { ...args, favouriteTeam: args.favouriteTeam as Id<"teams"> });
  },
});

/** What a sign-up at `at` buys at: its first scoring gameweek, that gameweek's prices and the teams
 *  a favourite team is one of. Null when every deadline has passed. */
export interface SignUpMarket {
  firstGameweek: number;
  prices: Prices;
  teamIds: string[];
}

export async function signUpMarket(ctx: QueryCtx, season: Id<"seasons">, at: number): Promise<SignUpMarket | null> {
  const gameweeks = await ctx.db.query("gameweeks").withIndex("by_season", (q) => q.eq("season", season)).collect();
  const firstGameweek = firstScoringGameweek(at, gameweeks);
  if (firstGameweek === null) return null;
  const prices = pricesFor(await ctx.db.query("prices").withIndex("by_season", (q) => q.eq("season", season)).collect(), firstGameweek);
  const teamIds = (await ctx.db.query("teams").collect()).map((team) => team._id as string);
  return { firstGameweek, prices, teamIds };
}

/** A sign-up's answers: the squad, the three questions and the Terms' version. A test manager also
 *  has a made-up name and his style (convex/admin/testManagerStore.ts). */
export interface NewTeam {
  account: string;
  squad: Squad;
  teamName: string;
  favouriteTeam: Id<"teams">;
  country: string;
  agreedVersion: string;
  name?: string;
  testStyle?: TestManagerStyle;
}

/** Save team's store, for an account with no team in `season` yet: checked by the sign-up rules,
 *  then the manager, the entry, its picks and its three leagues. */
export async function storeNewTeam(ctx: MutationCtx, season: Doc<"seasons">, { firstGameweek, prices, teamIds }: SignUpMarket, at: number, team: NewTeam) {
  const { settings } = season;
  const fields = { teamName: team.teamName, favouriteTeamId: team.favouriteTeam, country: team.country };
  const problems = signUpProblems(team.squad, prices, fields, {
    squad: settings.squad,
    budget: settings.budget,
    teamNameMaxLength: settings.teamNameMaxLength,
    teamIds,
  });
  if (problems.length > 0) throw refuse({ rule: "signUp", problems });

  // One manager per person (docs/data-model.md): an account back for a later season keeps its
  // manager, with this sign-up's answers.
  const answers = {
    country: team.country.trim(),
    agreed: { at, version: team.agreedVersion },
    ...(team.name === undefined ? {} : { name: team.name }),
    ...(team.testStyle === undefined ? {} : { testStyle: team.testStyle }),
  };
  const existing = await managerOf(ctx, team.account);
  if (existing !== null) await ctx.db.patch(existing._id, answers);
  const manager = existing?._id ?? (await ctx.db.insert("managers", { account: team.account, ...answers }));
  const cost = sum(allPicks(team.squad).map((p) => requirePrice(p, prices)));
  const entry = await ctx.db.insert("entries", {
    manager,
    season: season._id,
    teamName: team.teamName.trim(),
    favouriteTeam: team.favouriteTeam,
    firstGameweek,
    bank: settings.budget === null ? null : settings.budget - cost,
  });
  const captain = firstCaptain(team.squad, prices);
  const bought = { entry, gameweek: firstGameweek };
  for (const { slot, pick } of team.squad.starters) {
    const isCaptain = pick.role !== "coach" && pick.id === captain;
    await ctx.db.insert("picks", { ...bought, slot, ...pricedPickOf(pick), captain: isCaptain, buyPrice: requirePrice(pick, prices) });
  }
  for (const [i, pick] of team.squad.bench.entries()) {
    await ctx.db.insert("picks", { ...bought, slot: "bench", benchOrder: i + 1, ...pricedPickOf(pick), captain: false, buyPrice: requirePrice(pick, prices) });
  }
  await joinAutoLeagues(ctx, entry);
  return { entry, firstGameweek, captain };
}

/** On log-in: whether the account already has a team this season. If it has, that team wins and the
 *  guest's squad is dropped with no question (spec/09, Signing in again). */
export const hasTeam = internalQuery({
  args: { account: v.string(), ...season },
  handler: async (ctx, args) => {
    const { season } = await requireSeason(ctx, args.competition, args.year);
    return (await entryOf(ctx, args.account, season._id)) !== null;
  },
});

/** The account's manager, if it has signed up before. */
const managerOf = (ctx: QueryCtx, account: string) =>
  ctx.db.query("managers").withIndex("by_account", (q) => q.eq("account", account)).unique();

/** The account's entry for a season, if it has one. */
export async function entryOf(ctx: QueryCtx, account: string, season: Id<"seasons">) {
  const manager = await managerOf(ctx, account);
  if (manager === null) return null;
  return ctx.db.query("entries").withIndex("by_manager", (q) => q.eq("manager", manager._id).eq("season", season)).unique();
}
