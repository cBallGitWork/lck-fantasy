// The sim's check on made-up managers and games (Craig, 19 Nov 2026, #401: build it now, run it on
// the sim's season once #399 and #400 land).
import { describe, expect, test } from "vitest";
import { scoreWeek, type ManagerWeek, type PickSeries, type ScoringRules, type WeekGames } from "../gameweeks/weekPoints";
import { playerGame, SPEC_COACH_TABLE, SPEC_PLAYER_TABLE, SPEC_SERIES_RULES } from "../scoring/fixtures";
import type { TeamGameStats } from "../scoring/game";
import type { PlayedBuff } from "../squads/buffs";
import { bdd, chovy, keria, lucid, ruler, seeded, validSquad, zeus } from "../squads/fixtures";
import { allPicks, pickKey, type Pick, type PlayerRole } from "../squads/squad";
import { LCK_2027 } from "../world/season";
import { rederiveWeek } from "./backtestScorer";
import { mismatchAlert, weekMismatches } from "./seasonCheck";

const SETTINGS = LCK_2027.settings;
const RULES: ScoringRules = {
  player: SPEC_PLAYER_TABLE,
  coach: SPEC_COACH_TABLE,
  series: SPEC_SERIES_RULES,
  captainMultiplier: SETTINGS.carryMultiplier,
  hitPoints: SETTINGS.transfers.hitPoints,
};
const buffOf = (effect: PlayedBuff["effect"]): PlayedBuff => SETTINGS.buffs.find((buff) => buff.effect === effect)!;
const BUFFS = [null, buffOf("benchBoost"), buffOf("doubleCaptain"), buffOf("coachMultiplier")];

const upTo = (random: () => number, n: number) => Math.floor(random() * (n + 1));

/** A made-up game for a pick: a player's stats, or his team's for the coach. */
function madeUpSeries(pick: Pick, random: () => number): PickSeries {
  const games = 2 + upTo(random, 1);
  if (pick.role === "coach") {
    const side = () => ({ drakes: upTo(random, 4), barons: upTo(random, 2), elders: upTo(random, 1) });
    const team = (): TeamGameStats => ({ won: random() < 0.5, lengthSeconds: 1300 + upTo(random, 1300), firstTower: random() < 0.5, ...side(), opponent: side() });
    return { games: Array.from({ length: games }, team), wonSeries: random() < 0.5 };
  }
  const role = pick.role as PlayerRole;
  return {
    games: Array.from({ length: games }, () =>
      playerGame({
        role,
        kills: upTo(random, 9),
        deaths: upTo(random, 7),
        assists: upTo(random, 16),
        goldDiffAt15: random() < 0.1 ? null : upTo(random, 3000) - 1500,
        soloKills: upTo(random, 2),
        firstBlood: random() < 0.1,
        biggestMultikill: [0, 0, 0, 2, 3, 4, 5][upTo(random, 6)]!,
        steals: Number(random() < 0.05),
      }),
    ),
  };
}

/** A made-up manager's week: the valid squad, some picks sitting out, a random armband, buff and hits. */
function madeUpWeek(seed: number): { week: ManagerWeek; games: WeekGames } {
  const random = seeded(seed);
  const squad = validSquad();
  const games = new Map<string, PickSeries[]>();
  for (const pick of allPicks(squad)) {
    const series = random() < 0.2 ? 0 : 1 + upTo(random, 1);
    games.set(pickKey(pick), Array.from({ length: series }, () => madeUpSeries(pick, random)));
  }
  const players = squad.starters.filter((s) => s.slot !== "coach").map((s) => s.pick.id);
  const captain = players[upTo(random, players.length - 1)]!;
  const buff = BUFFS[upTo(random, BUFFS.length - 1)]!;
  const others = players.filter((id) => id !== captain);
  const secondCaptain = buff?.effect === "doubleCaptain" ? others[upTo(random, others.length - 1)] : undefined;
  const armband = secondCaptain === undefined ? { captain } : { captain, secondCaptain };
  return { week: { manager: `Manager ${seed}`, gameweek: 1 + (seed % 9), squad, armband, buff, hits: upTo(random, 1) }, games };
}

const series = (role: PlayerRole, ...kills: number[]): PickSeries => ({ games: kills.map((k) => playerGame({ role, kills: k, deaths: 1 })) });

describe("the backtest scorer re-derives the game's points", () => {
  test("500 made-up managers' weeks match exactly: totals, game points, the Captain's and the buff's shares", () => {
    for (let seed = 1; seed <= 500; seed++) {
      const { week, games } = madeUpWeek(seed);
      expect(weekMismatches(week.manager, week.gameweek, scoreWeek(week, games, RULES), rederiveWeek(week, games, RULES))).toEqual([]);
    }
  });

  test("a week worked by hand: the Captain's multiplier, auto-subs, a hit", () => {
    // Chovy (Captain): a mid's kills over 3, so 2, 2 and 0; his best 2 make 4, ×1.5 makes 6. Keria:
    // a support's 2 kills, 1. Only they of the starters played: Bench 1 Bdd, a mid, takes the flex,
    // Bench 2 Lucid the jungle, 1 each. The hit costs 6.
    const games = new Map([
      [pickKey(chovy), [series("mid", 6, 6, 0)]],
      [pickKey(keria), [series("support", 2)]],
      [pickKey(bdd), [series("mid", 3)]],
      [pickKey(lucid), [series("jungle", 3)]],
    ]);
    const week: ManagerWeek = { manager: "Hand", gameweek: 3, squad: validSquad(), armband: { captain: chovy.id }, buff: null, hits: 1 };
    const score = scoreWeek(week, games, RULES);
    expect(score.gamePoints.get(pickKey(chovy))).toEqual([2, 2, 0]);
    expect(score.captainShare).toBe(2);
    expect(score.buffShare).toBe(0);
    expect(score.total).toBe(6 + 1 + 1 + 1 - 6);
    expect(weekMismatches("Hand", 3, score, rederiveWeek(week, games, RULES))).toEqual([]);
  });
});

describe("a seeded mismatch is caught", () => {
  const { week, games } = madeUpWeek(7);
  const backtest = rederiveWeek(week, games, RULES);

  test("the game scoring the Captain ×2 gives a Captain's share and week total mismatch", () => {
    const captained = { ...week, armband: { captain: ruler.id }, buff: null };
    const withRuler = new Map([...games, [pickKey(ruler), [series("bot", 9, 9)]]]);
    const app = scoreWeek(captained, withRuler, { ...RULES, captainMultiplier: 2 });
    const found = weekMismatches("Seeded", 1, app, rederiveWeek(captained, withRuler, RULES));
    expect(found.map((m) => m.part)).toEqual(["total", "captainShare"]);
    expect(found[1]).toMatchObject({ app: 6, backtest: 3 });
  });

  test("one game's points off by one gives one game points mismatch, named by pick and game", () => {
    const app = scoreWeek(week, games, RULES);
    const [pick, points] = [...app.gamePoints].find(([, list]) => list.length > 1)!;
    app.gamePoints.set(pick, points.map((p, i) => (i === 1 ? p + 1 : p)));
    const found = weekMismatches("Seeded", 2, app, backtest);
    expect(found).toEqual([{ manager: "Seeded", gameweek: 2, part: "gamePoints", pick, game: 2, app: points[1]! + 1, backtest: points[1] }]);
  });

  test("a game only one side has is a mismatch too", () => {
    const app = { ...scoreWeek(week, games, RULES), gamePoints: new Map(backtest.gamePoints) };
    app.gamePoints.set(pickKey(zeus), [...(backtest.gamePoints.get(pickKey(zeus)) ?? []), 4]);
    const found = weekMismatches("Seeded", 2, app, backtest);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ pick: pickKey(zeus), app: 4, backtest: null });
  });

  test("each mismatch is a points mismatch alert naming the manager, the gameweek and the pick", () => {
    expect(mismatchAlert({ manager: "Faker fan", gameweek: 3, part: "gamePoints", pick: "player:zeus", game: 2, app: 5, backtest: 6 })).toEqual({
      kind: "pointsMismatch",
      message: "Faker fan, Week 3: player:zeus game 2's game points 5 in the game, 6 in the backtest.",
      names: ["Faker fan", "Week 3", "player:zeus"],
    });
    expect(mismatchAlert({ manager: "Faker fan", gameweek: 3, part: "total", app: 47, backtest: 46 }).message).toBe(
      "Faker fan, Week 3: week total 47 in the game, 46 in the backtest.",
    );
  });
});
