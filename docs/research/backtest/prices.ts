// Price formula backtest (#23): first prices from last season's points and team strength,
// checked against Craig's two squads, then weekly moves over the next season.
// Scored with the game's own code (convex/scoring) on Oracle's Elixir's files.
// Run: npx esbuild docs/research/backtest/prices.ts --bundle --platform=node --format=esm \
//        --outfile=<scratch>/prices.mjs && node <scratch>/prices.mjs <this-season.csv> <last-season.csv> [<season-before.csv>] [grid]
// Solo kills and steals score 0: the files don't hold them (Leaguepedia does).
import { readFileSync } from "node:fs";
import { oeGames, oeSeriesGame, parseOeCsv, type OeGame } from "../../../convex/feeds/oraclesElixir";
import { groupSeries } from "../../../convex/world/series";
import { scoreCoachGame, scorePlayerGame, total } from "../../../convex/scoring/game";
import { coachSeriesPoints, playerSeriesPoints } from "../../../convex/scoring/series";
import { SPEC_COACH_TABLE, SPEC_PLAYER_TABLE, SPEC_SERIES_RULES } from "../../../convex/scoring/fixtures";
import { teamGameStats } from "../../../convex/stats/gameStats";

/** The draft settings Craig would tune: all data, in ₩m. */
const SETTINGS = {
  budget: 100,
  floor: 6, // the cheapest first-team pick, coaches too: above the academy (Craig, 17 Nov 2026)
  top: 22.5, // the dearest from the formula: just under Chovy, the dearest by hand at 23 (Craig, 17 Nov 2026)
  coachTop: 16.5, // the dearest coach: about the top over the Captain's 1.5, as a coach can't be Captain (Craig, 17 Nov 2026)
  star: 21, // a pick at this price or more is a star, for the example squads
  teamWeight: 0.45, // share of the price from his team's strength; best at predicting the next season (0.45 to 0.6 tie)
  bend: 1.1, // the curve: 1 is a straight line, higher pulls stars up and the middle down (Craig, 17 Nov 2026: more linear)
  seasonWeights: [0.75, 0.25], // last season, the one before (Craig, 17 Nov 2026: use 2026 more than 2025)
  minSeries: 10, // fewer series last season: priced by hand, as a rookie
  lowPercentile: 0.1, // own points at this percentile count as zero
  formSeries: 8, // form is the last 8 series (about 4 weeks)
  threshold: 3, // a pick moves when his form price is ₩3m or more from his price
  step: 0.2, // by one step a week, up or down
  captain: 1.5, // the Captain's multiplier (spec/04)
  byHand: { Chovy: 23, Faker: 15 } as Record<string, number>, // Craig's hand prices, 17 Nov 2026: the bigger names
  gap: [17.5, 21] as const, // no price between these (Craig, 17 Nov 2026: nobody around 18–22); the stars sit above it
  starStep: 0.5, // stars are spaced by this, dearest first, down to the gap's top (Craig, 17 Nov 2026)
  academy: 5, // an academy player's price, under every first-teamer (Craig, 17 Nov 2026), set by hand: no LCK data
};
type Settings = typeof SETTINGS;
const LEAGUE = "LCK";
const ROLES = ["top", "jungle", "mid", "bot", "support"] as const;
const SQUAD_PLAYERS = 8; // plus the coach: spec/01's nine
const BENCH = 2;
const MS_PER_DAY = 86_400_000;

interface Pick { key: string; name: string; role: string; teamId: string; team: string }
interface SeriesScore { key: string; endedAt: number; points: number }

function seasonScores(file: string) {
  const games: OeGame[] = oeGames(parseOeCsv(readFileSync(file, "utf8")), LEAGUE).filter((g) => g.complete);
  const picks = new Map<string, Pick>();
  const scores: SeriesScore[] = [];
  const record = new Map<string, { won: number; played: number }>(); // series, by team
  for (const series of groupSeries(games.map(oeSeriesGame)).series) {
    const perPick = new Map<string, number[]>();
    const add = (key: string, points: number) => perPick.set(key, [...(perPick.get(key) ?? []), points]);
    for (const game of series.games) {
      const teamName = new Map(game.teams.map((t) => [t.teamId, t.teamName]));
      for (const player of game.players) {
        const key = `player:${player.playerId}`;
        picks.set(key, { key, name: player.playerName, role: player.role, teamId: player.teamId, team: teamName.get(player.teamId) ?? "" });
        const stats = { role: player.role, kills: player.kills, deaths: player.deaths, assists: player.assists, goldDiffAt15: player.goldDiffAt15, soloKills: 0, firstBlood: player.firstBloodKill, biggestMultikill: player.biggestMultikill, steals: 0 };
        add(key, total(scorePlayerGame(stats, SPEC_PLAYER_TABLE)));
      }
      for (const team of game.teams) {
        const key = `coach:${team.teamId}`;
        picks.set(key, { key, name: team.teamName, role: "coach", teamId: team.teamId, team: team.teamName });
        add(key, total(scoreCoachGame(teamGameStats(game, team.teamId), SPEC_COACH_TABLE)));
      }
    }
    const winner = series.score[0] > series.score[1] ? series.teamIds[0] : series.teamIds[1];
    for (const teamId of series.teamIds) {
      const r = record.get(teamId) ?? { won: 0, played: 0 };
      record.set(teamId, { won: r.won + (teamId === winner ? 1 : 0), played: r.played + 1 });
    }
    for (const [key, points] of perPick) {
      const seriesPoints = key.startsWith("coach:")
        ? coachSeriesPoints(points, key === `coach:${winner}`, SPEC_SERIES_RULES)
        : playerSeriesPoints(points, SPEC_SERIES_RULES);
      scores.push({ key, endedAt: series.endedAt, points: seriesPoints });
    }
  }
  const winShare = new Map([...record].map(([id, r]) => [id, r.won / r.played]));
  return { picks, scores, winShare };
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const roundTo = (x: number, unit: number) => Math.round(x / unit) * unit;
const fixed = (x: number) => x.toFixed(1);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** First price: own points and team strength, each scaled 0–1, blended, then bent. */
function pricer(s: Settings, ownPoints: number[], teamShares: number[], coachPoints: number[]) {
  const sorted = [...ownPoints].sort((a, b) => a - b);
  const cLow = Math.min(...coachPoints), cHigh = Math.max(...coachPoints);
  const low = sorted[Math.floor(s.lowPercentile * (sorted.length - 1))]!;
  const high = sorted.at(-1)!;
  const tLow = Math.min(...teamShares), tHigh = Math.max(...teamShares);
  // A coach's points are already his team's results, so he is priced on them alone, on a line of
  // his own from the worst coach to the best, so the bottom coaches spread out.
  const blend = (pps: number, teamShare: number, isCoach: boolean) => {
    if (isCoach) return clamp01((pps - cLow) / (cHigh - cLow));
    const own = clamp01((pps - low) / (high - low));
    return (1 - s.teamWeight) * own + s.teamWeight * clamp01((teamShare - tLow) / (tHigh - tLow));
  };
  const topBlend = Math.max(...ownPoints.map((p, i) => blend(p, teamShares[i]!, false)));
  const [gapLow, gapHigh] = s.gap;
  // Inside the gap, a price goes to whichever edge is nearer.
  const jump = (x: number) => (x <= gapLow || x >= gapHigh ? x : x - gapLow < gapHigh - x ? gapLow : gapHigh);
  return (pps: number, teamShare: number, isCoach: boolean) =>
    jump(Math.max(s.floor, roundTo(s.floor + ((isCoach ? s.coachTop : s.top) - s.floor) * clamp01(blend(pps, teamShare, isCoach) / (isCoach ? 1 : topBlend)) ** s.bend, 0.5)));
}

interface Priced { pick: Pick; price: number }

/** The cheapest legal fill of `slots` players and maybe the coach, around the picks already chosen. */
function cheapestFill(pool: Priced[], chosen: Priced[], slots: number, needCoach: boolean): Priced[] {
  const taken = new Set(chosen.map((c) => c.pick.key));
  const free = pool.filter((p) => !taken.has(p.pick.key));
  const fill: Priced[] = [];
  if (needCoach) fill.push([...free].filter((p) => p.pick.role === "coach").sort((a, b) => a.price - b.price)[0]!);
  // Academy players sit on the bench only: two at most.
  const isAcademy = (p: Priced) => p.pick.team === "Academy";
  const players = free.filter((p) => p.pick.role !== "coach" && !isAcademy(p)).sort((a, b) => a.price - b.price);
  const bench = free.filter(isAcademy).slice(0, BENCH);
  for (const role of ROLES) {
    if ([...chosen, ...fill].some((c) => c.pick.role === role)) continue;
    fill.push(players.find((p) => p.pick.role === role && !fill.includes(p))!);
  }
  for (const p of [...bench, ...players]) if (fill.filter((f) => f.pick.role !== "coach").length < slots && !fill.includes(p)) fill.push(p);
  return fill;
}
const cost = (xs: Priced[]) => xs.reduce((a, x) => a + x.price, 0);

/** Craig's goal, 17 Nov 2026: 2 stars, 1–2 mid, the rest cheap; 3 stars leave only the worst. */
function squadCheck(pool: Priced[]) {
  const players = pool.filter((p) => p.pick.role !== "coach").sort((a, b) => b.price - a.price);
  const stars = players.slice(0, 3);
  const mids = players.slice(8, 24); // ranks 9–24 of 40-odd: the middle of the market
  const midPrice = mids[Math.floor(mids.length / 2)]!.price;
  const threeStars = cost(stars) + cost(cheapestFill(pool, stars, SQUAD_PLAYERS - 3, true));
  const twoStars = stars.slice(0, 2);
  const twoMid = [mids[Math.floor(mids.length / 2)]!, mids[Math.floor(mids.length / 2) + 1]!];
  const twoTwo = cost([...twoStars, ...twoMid]) + cost(cheapestFill(pool, [...twoStars, ...twoMid], SQUAD_PLAYERS - 4, true));
  const cheapest = cost(cheapestFill(pool, [], SQUAD_PLAYERS, true));
  return { stars, midPrice, threeStars, twoTwo, cheapest };
}

type Season = ReturnType<typeof seasonScores>;

/** Weighted mean over the seasons that have a value, most recent first. */
function weighted(weights: readonly number[], values: (number | undefined)[]) {
  const pairs = values.flatMap((v, i) => (v === undefined ? [] : [[weights[i] ?? 0, v] as const]));
  const w = pairs.reduce((a, [wi]) => a + wi, 0);
  return w === 0 ? undefined : pairs.reduce((a, [wi, v]) => a + wi * v, 0) / w;
}

function firstPrices(s: Settings, past: Season[], now: Season) {
  const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]!;
  // A pick is priced on his own points over past seasons and his current team's record, recent seasons weighing more.
  const rows = [...now.picks.values()].flatMap((pick) => {
    const bySeason = past.map((season) => season.scores.filter((x) => x.key === pick.key).map((x) => x.points));
    if (bySeason.reduce((a, xs) => a + xs.length, 0) < s.minSeries) return [];
    const pps = weighted(s.seasonWeights, bySeason.map((xs) => (xs.length ? mean(xs) : undefined)))!;
    const teamShare = weighted(s.seasonWeights, past.map((season) => season.winShare.get(pick.teamId))) ?? median([...past[0]!.winShare.values()]);
    return [{ pick, pps, teamShare }];
  });
  const players = rows.filter((r) => r.pick.role !== "coach");
  const coaches = rows.filter((r) => r.pick.role === "coach");
  const price = pricer(s, players.map((r) => r.pps), players.map((r) => r.teamShare), coaches.map((r) => r.pps));
  const priced = rows.map((r) => ({ pick: r.pick, price: s.byHand[r.pick.name] ?? price(r.pps, r.teamShare, r.pick.role === "coach"), pps: r.pps, teamShare: r.teamShare, pricer: price }));
  // Stars from the formula are spaced out, in order, a step under the dearest hand price above them.
  const handTop = Math.max(0, ...Object.values(s.byHand));
  const stars = priced.filter((p) => !(p.pick.name in s.byHand) && p.pick.role !== "coach" && p.price >= s.gap[1]).sort((a, b) => b.price - a.price || b.pps - a.pps);
  let next = Math.min(s.top, handTop > 0 ? handTop - s.starStep : s.top);
  for (const star of stars) { star.price = Math.max(s.gap[1], next); next -= s.starStep; }
  // Each role's starters (each team's most-played player in it), and the coaches, get different
  // prices: from the cheapest up, each at least a step above the one under him, never into the gap.
  const played = (key: string) => now.scores.filter((x) => x.key === key).length;
  for (const role of [...ROLES, "coach"]) {
    const byTeam = new Map<string, (typeof priced)[number]>();
    for (const p of priced.filter((x) => x.pick.role === role)) {
      const held = byTeam.get(p.pick.teamId);
      if (!held || played(p.pick.key) > played(held.pick.key)) byTeam.set(p.pick.teamId, p);
    }
    const starters = [...byTeam.values()].sort((a, b) => a.price - b.price || a.pps - b.pps);
    const below = starters.filter((p) => p.price <= s.gap[0] && !(p.pick.name in s.byHand));
    below.forEach((p, i) => { if (i > 0) p.price = Math.min(s.gap[0], Math.max(p.price, below[i - 1]!.price + s.starStep)); });
    // A step that would land in the gap is taken down instead, from the gap's foot.
    for (let i = below.length - 2; i >= 0; i--) below[i]!.price = Math.min(below[i]!.price, below[i + 1]!.price - s.starStep);
  }
  return priced;
}

/**
 * The best squad over a season, set once and kept: one starter per role, a flex player, the coach
 * and the two cheapest players left on the bench, within budget. Points are each starter's season
 * total, with the Captain (×1.5) on the top-scoring player. No transfers, chips or auto-subs.
 */
function bestSquad(pool: Priced[], seasonPoints: Map<string, number>, budget: number, captain: number, stars?: { count: number; price: number }) {
  const pts = (p: Priced) => seasonPoints.get(p.pick.key) ?? 0;
  const byRole = (role: string) => pool.filter((p) => p.pick.role === role && p.pick.team !== "Academy");
  const players = pool.filter((p) => p.pick.role !== "coach" && p.pick.team !== "Academy");
  const cheap = pool.filter((p) => p.pick.role !== "coach").sort((a, b) => a.price - b.price);
  let best = { points: -1, squad: [] as Priced[], bench: [] as Priced[] };
  const [tops, jgs, mids, bots, sups, coaches] = [...ROLES, "coach"].map(byRole);
  for (const c of coaches!) for (const t of tops!) for (const j of jgs!) for (const m of mids!) for (const b of bots!) for (const s of sups!) {
    const five = [c, t, j, m, b, s];
    const spent = cost(five);
    if (spent + 3 * cheap[0]!.price > budget) continue;
    for (const f of players) {
      if (five.includes(f)) continue;
      const starters = [...five, f];
      if (stars && starters.filter((p) => p.price >= stars.price).length !== stars.count) continue;
      const bench = cheap.filter((p) => !starters.includes(p)).slice(0, 2);
      if (spent + f.price + cost(bench) > budget) continue;
      const scores = starters.map(pts);
      const captainPoints = Math.max(...starters.filter((p) => p.pick.role !== "coach").map(pts)); // a coach can't be Captain
      const points = scores.reduce((a, x) => a + x, 0) + (captain - 1) * captainPoints;
      if (points > best.points) best = { points, squad: starters, bench };
    }
  }
  return best;
}

/** Academy players: no LCK data, priced by hand, two a role, free to fill a bench. They score 0 here. */
function academy(s: Settings): Priced[] {
  return ROLES.flatMap((role) => [1, 2].map((i) => ({ pick: { key: `academy:${role}:${i}`, name: `Academy ${role}`, role, teamId: "", team: "Academy" }, price: s.academy })));
}

function pearson(xs: number[], ys: number[]) {
  const mx = mean(xs), my = mean(ys);
  const cov = xs.reduce((a, x, i) => a + (x - mx) * (ys[i]! - my), 0);
  return cov / Math.sqrt(xs.reduce((a, x) => a + (x - mx) ** 2, 0) * ys.reduce((a, y) => a + (y - my) ** 2, 0));
}

function main(thisFile: string, pastFiles: string[], grid: boolean) {
  const now = seasonScores(thisFile);
  const past = pastFiles.map((f) => (f === thisFile ? now : seasonScores(f)));
  const lastFile = pastFiles.map((f) => f.match(/\d{4}/)?.[0]).join(" and ");

  if (grid) {
    console.log("gap bend | stars | mid | 3 stars + cheapest | 2 stars + 2 mid + cheapest | cheapest squad");
    for (const gap of [[17.5, 21], [17, 21], [17, 20.5], [16.5, 20]] as const) for (const bend of [1, 1.1, 1.2]) {
      const c = squadCheck([...firstPrices({ ...SETTINGS, gap, bend }, past, now), ...academy(SETTINGS)]);
      console.log(`gap ${gap.join("-")} bend ${bend} | ${c.stars.map((x) => fixed(x.price)).join(" ")} | ${fixed(c.midPrice)} | ${fixed(c.threeStars)} | ${fixed(c.twoTwo)} | ${fixed(c.cheapest)}`);
    }
    return;
  }

  const priced = firstPrices(SETTINGS, past, now).sort((a, b) => b.price - a.price);
  console.log(`## First prices (${lastFile} data, ${thisFile.match(/\d{4}/)?.[0]} rosters)\n`);
  console.log(`Priced: ${priced.length}. Settings: top ₩${SETTINGS.top}m, floor ₩${SETTINGS.floor}m, team weight ${SETTINGS.teamWeight}, bend ${SETTINGS.bend}.\n`);
  console.log("| # | Pick | Role | Team | Own pts/series | Team won | Price |\n|---|---|---|---|---|---|---|");
  priced.forEach((p, i) => console.log(`| ${i + 1} | ${p.pick.name} | ${p.pick.role} | ${p.pick.team} | ${fixed(p.pps)} | ${Math.round(p.teamShare * 100)}% | ${fixed(p.price)} |`));
  const pool = [...priced, ...academy(SETTINGS)];
  const c = squadCheck(pool);
  console.log(`\nSquads (budget ₩${SETTINGS.budget}m):`);
  console.log(`- 3 stars (${c.stars.map((x) => x.pick.name).join(", ")}) + the cheapest legal 6: ₩${fixed(c.threeStars)}m.`);
  console.log(`- 2 stars + 2 mid-priced (₩${fixed(c.midPrice)}m) + the cheapest legal 5: ₩${fixed(c.twoTwo)}m.`);
  console.log(`- The cheapest legal squad: ₩${fixed(c.cheapest)}m.`);

  const both = priced.filter((p) => now.scores.filter((s) => s.key === p.pick.key).length >= SETTINGS.minSeries);
  const r = pearson(both.map((p) => p.price), both.map((p) => mean(now.scores.filter((s) => s.key === p.pick.key).map((s) => s.points))));
  // Weekly moves on points only: the form price is the same pricer applied to his last few series.
  const weekOf = (t: number) => Math.floor((t - 2 * MS_PER_DAY) / (7 * MS_PER_DAY)); // weeks from Monday
  const weeks = [...new Set(now.scores.map((x) => weekOf(x.endedAt)))].sort((a, b) => a - b);
  const price = new Map(priced.map((p) => [p.pick.key, p.price]));
  let moves = 0;
  for (const week of weeks) for (const p of priced) {
    const mine = now.scores.filter((x) => x.key === p.pick.key && weekOf(x.endedAt) <= week);
    if (!mine.some((x) => weekOf(x.endedAt) === week)) continue;
    const form = p.pricer(mean(mine.slice(-SETTINGS.formSeries).map((x) => x.points)), p.teamShare, p.pick.role === "coach");
    const gap = form - price.get(p.pick.key)!;
    if (Math.abs(gap) < SETTINGS.threshold) continue;
    moves++;
    price.set(p.pick.key, Math.max(SETTINGS.floor, roundTo(price.get(p.pick.key)! + Math.sign(gap) * SETTINGS.step, 0.1)));
  }
  const change = priced.map((p) => ({ name: p.pick.name, d: price.get(p.pick.key)! - p.price })).sort((a, b) => b.d - a.d);
  const ends = [...price.values()].sort((a, b) => a - b);
  console.log(`\nWeekly moves over ${weeks.length} weeks: ${(moves / weeks.length).toFixed(1)} a week. Risers: ${change.slice(0, 4).map((c) => `${c.name} +${fixed(c.d)}`).join(", ")}. Fallers: ${change.slice(-4).reverse().map((c) => `${c.name} ${fixed(c.d)}`).join(", ")}. End: ₩${fixed(ends[0]!)}m to ₩${fixed(ends.at(-1)!)}m.`);
  const seasonPoints = new Map<string, number>();
  for (const x of now.scores) seasonPoints.set(x.key, (seasonPoints.get(x.key) ?? 0) + x.points);
  const top = bestSquad(pool, seasonPoints, SETTINGS.budget, SETTINGS.captain);
  const line = (p: Priced) => `${p.pick.name} (${p.pick.role}, ₩${fixed(p.price)}m, ${Math.round(seasonPoints.get(p.pick.key) ?? 0)} pts)`;
  console.log(`\nBest squad for ${thisFile.match(/\d{4}/)?.[0]}, set once: ${Math.round(top.points)} pts, ₩${fixed(cost([...top.squad, ...top.bench]))}m. Starters: ${top.squad.map(line).join(", ")}. Bench: ${top.bench.map(line).join(", ")}.`);
  for (const count of [0, 1, 2, 3]) {
    const ex = bestSquad(pool, seasonPoints, SETTINGS.budget, SETTINGS.captain, { count, price: SETTINGS.star });
    if (ex.points < 0) { console.log(`\nBest with ${count} stars: none fits.`); continue; }
    console.log(`\nBest with ${count} stars: ${Math.round(ex.points)} pts, ₩${fixed(cost([...ex.squad, ...ex.bench]))}m. ${ex.squad.map(line).join(", ")}. Bench: ${ex.bench.map(line).join(", ")}.`);
  }
  console.log(`\nDearest 10, season points: ${priced.slice(0, 10).map(line).join(", ")}.`);
  console.log(`\nFirst price against ${thisFile.match(/\d{4}/)?.[0]}'s points per series (${both.length} picks): r = ${r.toFixed(2)}.`);
}

/** How far a team's share of series won goes with its players' points per series, season by season. */
function teamCorrelation(files: string[], minSeries: number) {
  for (const file of files) {
    const season = seasonScores(file);
    const rows = [...season.picks.values()].flatMap((pick) => {
      const xs = season.scores.filter((x) => x.key === pick.key).map((x) => x.points);
      return xs.length >= minSeries ? [{ role: pick.role, pps: mean(xs), share: season.winShare.get(pick.teamId)! }] : [];
    });
    const players = rows.filter((r) => r.role !== "coach");
    const r = pearson(players.map((x) => x.share), players.map((x) => x.pps));
    const byRole = [...ROLES, "coach"].map((role) => {
      const rr = rows.filter((x) => x.role === role);
      return `${role} ${pearson(rr.map((x) => x.share), rr.map((x) => x.pps)).toFixed(2)}`;
    });
    console.log(`${file.match(/\d{4}/)?.[0]}: players r = ${r.toFixed(2)} (r² ${(r * r).toFixed(2)}), ${players.length} players. By role: ${byRole.join(", ")}.`);
  }
}

const args = process.argv.slice(2);
if (args[0] === "corr") { teamCorrelation(args.slice(1), SETTINGS.minSeries); process.exit(0); }
const grid = args.at(-1) === "grid";
main(args[0]!, args.slice(1, grid ? -1 : undefined), grid);
