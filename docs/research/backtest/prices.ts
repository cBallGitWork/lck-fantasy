// Price formula backtest (#23): first prices from one season, then weekly moves over the next,
// scored with the game's own code (convex/scoring) on Oracle's Elixir's files.
// Run: npx esbuild docs/research/backtest/prices.ts --bundle --platform=node --format=esm \
//        --outfile=<scratch>/prices.mjs && node <scratch>/prices.mjs <last-season.csv> <this-season.csv>
// Solo kills and steals score 0: the files don't hold them (Leaguepedia does).
import { readFileSync } from "node:fs";
import { oeGames, oeSeriesGame, parseOeCsv, type OeGame } from "../../../convex/feeds/oraclesElixir";
import { groupSeries } from "../../../convex/lck/series";
import { scoreCoachGame, scorePlayerGame, total } from "../../../convex/scoring/game";
import { coachSeriesPoints, playerSeriesPoints } from "../../../convex/scoring/series";
import { SPEC_COACH_TABLE, SPEC_PLAYER_TABLE, SPEC_SERIES_RULES } from "../../../convex/scoring/fixtures";
import { teamGameStats } from "../../../convex/stats/gameStats";

/** The draft settings Craig would tune: all data, in 억. */
const SETTINGS = {
  floor: 5, // the cheapest pick (spec/02's guide: about 5억)
  top: 20, // the dearest (spec/02's guide: stars at about 18–22억)
  minSeries: 10, // fewer series last season: priced by hand, as a rookie
  lowPercentile: 0.1, // points per series at this percentile map to the floor
  formSeries: 8, // form is the last 8 series (about 4 weeks)
  threshold: 3, // a pick moves when his form price is 3억 or more from his price
  step: 0.2, // by one step a week, up or down
};
const LEAGUE = "LCK";
const MS_PER_DAY = 86_400_000;

interface Pick { key: string; name: string; role: string }
interface SeriesScore { key: string; endedAt: number; points: number }

function seasonScores(file: string): { picks: Map<string, Pick>; scores: SeriesScore[] } {
  const games: OeGame[] = oeGames(parseOeCsv(readFileSync(file, "utf8")), LEAGUE).filter((g) => g.complete);
  const picks = new Map<string, Pick>();
  const scores: SeriesScore[] = [];
  for (const series of groupSeries(games.map(oeSeriesGame)).series) {
    const perPick = new Map<string, number[]>();
    const add = (key: string, points: number) => perPick.set(key, [...(perPick.get(key) ?? []), points]);
    for (const game of series.games) {
      for (const player of game.players) {
        const key = `player:${player.playerId}`;
        picks.set(key, { key, name: player.playerName, role: player.role });
        const stats = { role: player.role, kills: player.kills, deaths: player.deaths, assists: player.assists, goldDiffAt15: player.goldDiffAt15, soloKills: 0, firstBlood: player.firstBloodKill, biggestMultikill: player.biggestMultikill, steals: 0 };
        add(key, total(scorePlayerGame(stats, SPEC_PLAYER_TABLE)));
      }
      for (const team of game.teams) {
        const key = `coach:${team.teamId}`;
        picks.set(key, { key, name: team.teamName, role: "coach" });
        add(key, total(scoreCoachGame(teamGameStats(game, team.teamId), SPEC_COACH_TABLE)));
      }
    }
    const winner = series.score[0] > series.score[1] ? series.teamIds[0] : series.teamIds[1];
    for (const [key, points] of perPick) {
      const isCoach = key.startsWith("coach:");
      const seriesPoints = isCoach
        ? coachSeriesPoints(points, key === `coach:${winner}`, SPEC_SERIES_RULES)
        : playerSeriesPoints(points, SPEC_SERIES_RULES);
      scores.push({ key, endedAt: series.endedAt, points: seriesPoints });
    }
  }
  return { picks, scores };
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const roundTo = (x: number, unit: number) => Math.round(x / unit) * unit;
const fixed = (x: number) => x.toFixed(1);

function priceScale(perSeries: number[]) {
  const sorted = [...perSeries].sort((a, b) => a - b);
  const low = sorted[Math.floor(SETTINGS.lowPercentile * (sorted.length - 1))]!;
  const high = sorted.at(-1)!;
  return (pointsPerSeries: number) => {
    const share = (pointsPerSeries - low) / (high - low);
    return Math.min(SETTINGS.top, Math.max(SETTINGS.floor, roundTo(SETTINGS.floor + share * (SETTINGS.top - SETTINGS.floor), 0.5)));
  };
}

function pearson(xs: number[], ys: number[]) {
  const mx = mean(xs), my = mean(ys);
  const cov = xs.reduce((s, x, i) => s + (x - mx) * (ys[i]! - my), 0);
  const sx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const sy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return cov / (sx * sy);
}

function main(lastFile: string, thisFile: string) {
  const last = seasonScores(lastFile);
  const now = seasonScores(thisFile);
  const perSeries = (scores: SeriesScore[], key: string) => scores.filter((s) => s.key === key).map((s) => s.points);

  // First prices from last season.
  const lastPps = new Map([...last.picks.keys()].map((key) => [key, perSeries(last.scores, key)] as const).filter(([, xs]) => xs.length >= SETTINGS.minSeries).map(([key, xs]) => [key, mean(xs)]));
  const scale = priceScale([...lastPps.values()]);
  const first = new Map([...lastPps].map(([key, pps]) => [key, scale(pps)]));

  console.log(`## First prices (${lastFile.match(/\d{4}/)?.[0]} data)\n`);
  const priced = [...now.picks.values()].filter((p) => first.has(p.key));
  const byHand = [...now.picks.values()].filter((p) => !first.has(p.key) && perSeries(now.scores, p.key).length >= SETTINGS.minSeries);
  console.log(`Priced by the formula: ${priced.length}. Played 10+ series this season with no price (rookies, by hand): ${byHand.length}.\n`);
  console.log("| Role | picks | cheapest | median | dearest |\n|---|---|---|---|---|");
  for (const role of ["top", "jungle", "mid", "bot", "support", "coach"]) {
    const prices = priced.filter((p) => p.role === role).map((p) => first.get(p.key)!).sort((a, b) => a - b);
    if (prices.length) console.log(`| ${role} | ${prices.length} | ${fixed(prices[0]!)} | ${fixed(prices[Math.floor(prices.length / 2)]!)} | ${fixed(prices.at(-1)!)} |`);
  }
  const dearest = [...priced].sort((a, b) => first.get(b.key)! - first.get(a.key)!).slice(0, 10);
  console.log(`\nDearest 10: ${dearest.map((p) => `${p.name} (${p.role}) ${fixed(first.get(p.key)!)}억`).join(", ")}.\n`);

  // Does last season's price predict this season's points?
  const both = priced.filter((p) => perSeries(now.scores, p.key).length >= SETTINGS.minSeries);
  const r = pearson(both.map((p) => first.get(p.key)!), both.map((p) => mean(perSeries(now.scores, p.key))));
  console.log(`First price against this season's points per series (${both.length} picks with 10+ series): r = ${r.toFixed(2)}.\n`);

  // Weekly moves on points only: the form price is the scale applied to the last few series.
  const weekOf = (t: number) => Math.floor((t - 2 * MS_PER_DAY) / (7 * MS_PER_DAY)); // weeks from Monday
  const weeks = [...new Set(now.scores.map((s) => weekOf(s.endedAt)))].sort((a, b) => a - b);
  const price = new Map(first);
  const moves: number[] = [];
  for (const week of weeks) {
    for (const [key, current] of price) {
      const recent = now.scores.filter((s) => s.key === key && weekOf(s.endedAt) <= week).slice(-SETTINGS.formSeries).map((s) => s.points);
      if (recent.length === 0 || !now.scores.some((s) => s.key === key && weekOf(s.endedAt) === week)) continue;
      const formGap = scale(mean(recent)) - current;
      const move = Math.abs(formGap) < SETTINGS.threshold ? 0 : Math.sign(formGap) * SETTINGS.step;
      if (move !== 0) moves.push(move);
      price.set(key, Math.max(SETTINGS.floor, roundTo(current + move, 0.1)));
    }
  }
  const changes = priced.map((p) => ({ p, change: price.get(p.key)! - first.get(p.key)! })).sort((a, b) => b.change - a.change);
  console.log(`## Weekly moves over ${weeks.length} weeks (points only)\n`);
  console.log(`Moves made: ${moves.length}, ${(moves.length / weeks.length).toFixed(1)} a week, of ${price.size} priced picks.`);
  console.log(`Biggest risers: ${changes.slice(0, 5).map(({ p, change }) => `${p.name} +${fixed(change)}`).join(", ")}.`);
  console.log(`Biggest fallers: ${changes.slice(-5).reverse().map(({ p, change }) => `${p.name} ${fixed(change)}`).join(", ")}.`);
  const ends = [...price.values()].sort((a, b) => a - b);
  console.log(`End of season: cheapest ${fixed(ends[0]!)}억, dearest ${fixed(ends.at(-1)!)}억.\n`);
}

main(process.argv[2]!, process.argv[3]!);
