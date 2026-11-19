// The backtest's scorer (spec/10, The road to launch, step 1): a manager's gameweek re-derived from the
// spec's words by code that shares nothing with the game's but its types, as
// docs/research/backtest/score.py scores games on its own. score.py itself is Python and scores the
// research's draft lines, so it can't run in Convex on spec/05's table; this is its successor, kept
// apart on purpose: a rule written twice is the check. Never import the game's scoring here.
import type { ManagerWeek, ScoringRules, WeekGames, WeekScore } from "../gameweeks/weekPoints";
import type { CoachTable, PlayerGameStats, PlayerTable, TeamGameStats } from "../scoring/game";
import type { Pick, SquadPick } from "../squads/squad";

const keyOf = (pick: Pick) => (pick.role === "coach" ? `coach:${pick.id}` : `player:${pick.id}`);

/** spec/05, per game: each line's points if it is on. "Per N" rounds down and stops at its cap. */
function playerGame(g: PlayerGameStats, t: PlayerTable): number {
  let points = 0;
  if (t.kills.on) points += Math.min(Math.floor(g.kills / t.kills.per[g.role]), t.kills.max);
  if (t.assists.on) points += Math.min(Math.floor(g.assists / t.assists.per), t.assists.max);
  if (t.deaths.on) points -= Math.min(Math.floor(g.deaths / t.deaths.per[g.role]), t.deaths.max);
  if (t.goldLeadAt15.on && g.goldDiffAt15 !== null && g.goldDiffAt15 > 0) points += t.goldLeadAt15.points;
  if (t.soloKill.on) points += g.soloKills * t.soloKill.points;
  if (t.firstBlood.on && g.firstBlood) points += t.firstBlood.points;
  if (t.deathless.on && g.deaths === 0) points += t.deathless.points;
  if (t.multikill.on) points += t.multikill.points[g.biggestMultikill] ?? 0;
  if (t.steal.on) points += g.steals * t.steal.points;
  return points;
}

/** spec/05, The coach: first tower, more drakes, barons and elders than the other side, a quick win. */
function coachGame(g: TeamGameStats, t: CoachTable): number {
  let points = 0;
  if (t.firstTower.on && g.firstTower) points += t.firstTower.points;
  if (t.mostDrakes.on && g.drakes > g.opponent.drakes) points += t.mostDrakes.points;
  if (t.mostBarons.on && g.barons > g.opponent.barons) points += t.mostBarons.points;
  if (t.mostElders.on && g.elders > g.opponent.elders) points += t.mostElders.points;
  if (t.quickWin.on && g.won && g.lengthSeconds / 60 < t.quickWin.underMinutes) points += t.quickWin.points;
  return points;
}

const bestOf = (points: number[], n: number) => [...points].sort((a, b) => b - a).slice(0, n).reduce((a, b) => a + b, 0);

/** spec/04 and spec/05: ×1.5 and the like, rounded towards zero. */
const times = (points: number, by: number) => {
  const raw = points * by;
  return raw < 0 ? Math.ceil(raw) : Math.floor(raw);
};

export function rederiveWeek(week: ManagerWeek, games: WeekGames, rules: ScoringRules): WeekScore {
  const gamePoints = new Map<string, number[]>();
  const weekOf = new Map<string, number>();
  for (const [key, list] of games) {
    let points = 0;
    for (const series of list) {
      const each = "wonSeries" in series
        ? series.games.map((g) => coachGame(g, rules.coach))
        : series.games.map((g) => playerGame(g, rules.player));
      gamePoints.set(key, [...(gamePoints.get(key) ?? []), ...each]);
      points += bestOf(each, rules.series.bestGames);
      if ("wonSeries" in series) points += series.wonSeries ? rules.series.coachSeriesWin : rules.series.coachSeriesLoss;
    }
    weekOf.set(key, points);
  }
  const played = (pick: Pick) => (games.get(keyOf(pick)) ?? []).length > 0;
  const effect = week.buff?.effect;

  // spec/01, Auto-subs: in bench order, a bench player who played replaces a starter who didn't, in
  // his own role first, then the flex. The coach is never replaced. Bench Boost: the bench scores too.
  const lineup: SquadPick[] = week.squad.starters.map((s) => ({ ...s }));
  const bench: Pick[] = [];
  if (effect === "benchBoost") bench.push(...week.squad.bench);
  else {
    for (const sub of week.squad.bench.filter(played)) {
      const out = (slot: string) => lineup.find((s) => s.slot === slot && s.slot !== "coach" && !played(s.pick));
      const into = out(sub.role) ?? out("flex");
      if (into) into.pick = sub;
    }
  }

  // spec/04 and spec/06: the Captain's multiplier, or the buff's on both Captains; Coach Diff's on the
  // coach. A Captain who played no game takes nothing.
  const captainBy = effect === "doubleCaptain" ? week.buff!.multiplier! : rules.captainMultiplier;
  const by = new Map<string, number>();
  const captains = [week.armband.captain, week.armband.secondCaptain].filter((id): id is string => id !== undefined);
  for (const id of captains) if ((games.get(`player:${id}`) ?? []).length > 0) by.set(`player:${id}`, captainBy);
  const coach = lineup.find((s) => s.slot === "coach");
  if (effect === "coachMultiplier" && coach) by.set(keyOf(coach.pick), week.buff!.multiplier!);

  const scoreOf = (pick: Pick) => {
    const base = weekOf.get(keyOf(pick)) ?? 0;
    const m = by.get(keyOf(pick));
    return m === undefined ? base : times(base, m);
  };
  const addOf = (key: string) => {
    const pick = lineup.find((s) => keyOf(s.pick) === key)?.pick;
    return pick === undefined ? 0 : scoreOf(pick) - (weekOf.get(key) ?? 0);
  };
  const benchTotal = bench.reduce((a, pick) => a + scoreOf(pick), 0);
  const lineupTotal = lineup.reduce((a, s) => a + scoreOf(s.pick), 0);
  let buffShare = 0;
  if (effect === "benchBoost") buffShare = benchTotal;
  if (effect === "doubleCaptain") buffShare = addOf(`player:${week.armband.secondCaptain}`);
  if (effect === "coachMultiplier" && coach) buffShare = addOf(keyOf(coach.pick));
  return {
    total: lineupTotal + benchTotal - week.hits * rules.hitPoints,
    gamePoints,
    captainShare: addOf(`player:${week.armband.captain}`),
    buffShare,
  };
}
