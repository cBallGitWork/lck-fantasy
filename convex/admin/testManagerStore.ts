// Test managers signed up (spec/10, The road to launch, steps 1 and 2; spec/15, Test managers): each
// joins the competitions his run gives him through Save team's own store, so the sign-up rules check
// his squad and he enters Overall, his country's and his team's leagues as a manager does. His first
// squad is his style's. Run again, a test manager who already has a team in a season is left as he is.
import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation, type QueryCtx } from "../_generated/server";
import { seeded } from "../../src/parts/util/seeded";
import { entryOf, signUpMarket, storeNewTeam, type SignUpMarket } from "../signIn/store";
import { pickKey, type Pick } from "../squads/squad";
import { findSeason, pickOfPrice } from "../world/season";
import { now } from "./clock";
import { competitionsOf, rollFavouriteTeam, rollTestManager, testManagerCount, type TestManagerGroup } from "./testManagerRoll";
import { testManagerFirstSquad, type TestManagerHabits } from "./testManagers";
import testManagerData from "../../data/testManagers.json";
import lckTeams from "../../data/lck/teams.json";

const DATA = testManagerData as typeof testManagerData & { habits: TestManagerHabits; plans: Record<string, TestManagerGroup[]> };

/** Each competition's teams by code, with the Oracle's Elixir id their stored row keeps. */
const TEAMS_BY_COMPETITION: Record<string, readonly { code: string; oeId: string }[]> = { LCK: lckTeams.teams };

/** Test managers signed up per mutation: each writes an entry, its picks and its leagues per region,
 *  so a run of 1,000 is split to stay well inside a mutation's limits. */
const BATCH = 25;

/** The Terms' version a test manager's row holds: he never ticked the box. */
const NO_TERMS = "none: never shown";

const group = v.object({ competitions: v.array(v.string()), managers: v.number() });

/** Signs up a run's test managers from number `from`, `BATCH` at a time, each batch scheduling the
 *  next. The run is a plan in data/testManagers.json (`sim`, `january`), or `groups` given instead. */
export const addTestManagers = internalMutation({
  args: { year: v.number(), plan: v.optional(v.string()), groups: v.optional(v.array(group)), from: v.optional(v.number()) },
  handler: async (ctx, { year, plan, groups: given, from = 0 }) => {
    const groups = given ?? planOf(plan);
    const total = testManagerCount(groups);
    const to = Math.min(from + BATCH, total);
    const at = await now(ctx);
    const seasons = new Map<string, SeasonForTestManagers>();
    let added = 0;
    for (let n = from; n < to; n++) {
      const random = seeded(n + 1);
      const roll = rollTestManager(n, DATA.names, DATA.countries, random);
      for (const competition of competitionsOf(n, groups)) {
        const season = seasons.get(competition) ?? (await seasonForTestManagers(ctx, competition, year, at));
        seasons.set(competition, season);
        const favourite = rollFavouriteTeam(season.teamCodes, DATA.favouriteTeams, DATA.otherTeams, random);
        const squad = testManagerFirstSquad({ style: roll.style, teamId: favourite }, season.week, DATA.habits, random);
        if ((await entryOf(ctx, roll.account, season.season._id)) !== null) continue;
        await storeNewTeam(ctx, season.season, season.market, at, {
          account: roll.account,
          squad,
          teamName: roll.teamName,
          favouriteTeam: season.teamRow(favourite),
          country: roll.country,
          agreedVersion: NO_TERMS,
          name: roll.name,
          testStyle: roll.style,
        });
        added++;
      }
    }
    if (to < total) await ctx.scheduler.runAfter(0, internal.admin.testManagerStore.addTestManagers, { year, plan, groups: given, from: to });
    return { added, upTo: to, of: total };
  },
});

function planOf(plan: string | undefined): TestManagerGroup[] {
  const groups = plan === undefined ? undefined : DATA.plans[plan];
  if (groups === undefined) throw new Error(`Name a plan in data/testManagers.json (${Object.keys(DATA.plans).join(", ")}) or give groups.`);
  return groups;
}

/** What a season's test managers sign up into: the season, what it sells now, its picks and teams. */
interface SeasonForTestManagers {
  season: Doc<"seasons">;
  market: SignUpMarket;
  week: Parameters<typeof testManagerFirstSquad>[1];
  teamCodes: string[];
  teamRow: (code: string) => Id<"teams">;
}

async function seasonForTestManagers(ctx: QueryCtx, competition: string, year: number, at: number): Promise<SeasonForTestManagers> {
  const found = await findSeason(ctx, competition, year);
  if (found === null) throw new Error(`No ${competition} ${year} season is stored.`);
  const { season } = found;
  const market = await signUpMarket(ctx, season._id, at);
  if (market === null) throw new Error(`Every ${competition} ${year} deadline has passed: test managers can't sign up.`);
  const rows = await ctx.db.query("prices").withIndex("by_season", (q) => q.eq("season", season._id)).collect();
  const pool = [...new Map(rows.map(pickOfPrice).map((pick): [string, Pick] => [pickKey(pick), pick])).values()]
    .filter((pick) => market.prices.has(pickKey(pick)));
  const teamCodes = [...new Set(pool.map((pick) => pick.teamId))];
  const teamRows = await teamRowsOf(ctx, competition, teamCodes);
  const { settings } = season;
  return {
    season,
    market,
    // No form before he has seen a game: his style picks among the season's prices.
    week: { squadSettings: settings.squad, budget: settings.budget, autoFillGap: settings.autoFillGap, pool, prices: market.prices, form: new Map() },
    teamCodes,
    teamRow: (code) => teamRows.get(code)!,
  };
}

/** Each team code's stored row, found by its Oracle's Elixir id in data/<region>/teams.json. */
async function teamRowsOf(ctx: QueryCtx, competition: string, codes: readonly string[]): Promise<Map<string, Id<"teams">>> {
  const known = TEAMS_BY_COMPETITION[competition];
  if (known === undefined) throw new Error(`No ${competition} teams in data: a test manager's favourite team needs its code's Oracle's Elixir id.`);
  const rows = new Map<string, Id<"teams">>();
  for (const code of codes) {
    const oeId = known.find((team) => team.code === code)?.oeId;
    const row = oeId === undefined ? null : await ctx.db.query("teams").withIndex("by_oeId", (q) => q.eq("oeId", oeId)).unique();
    if (row === null) throw new Error(`${competition}'s ${code} has no stored team: load its games first.`);
    rows.set(code, row._id);
  }
  return rows;
}
