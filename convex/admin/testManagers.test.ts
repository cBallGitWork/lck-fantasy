import { describe, expect, test } from "vitest";
import { WON_PER_M } from "../../src/parts/text/money";
import { bankAfterTransfers, budgetProblems, type Prices } from "../squads/budget";
import { buffLineup, buffProblems, type Buff, type BuffPlay } from "../squads/buffs";
import { armbandProblems } from "../squads/carry";
import {
  byPick, CARRY_MULTIPLIER, coach, faker, player, REGULAR_SETTINGS, seeded, TRANSFER_SETTINGS, validSquad,
} from "../squads/fixtures";
import { allPicks, pickKey, pickKeysOf, PLAYER_ROLES, squadProblems, type Pick, type Squad } from "../squads/squad";
import { arrangeByRole, transferProblems } from "../squads/squadAfterTransfers";
import { freeTransfersFor, netTransfers, settleTransfers, type TransferGameweek } from "../squads/transfers";
import {
  TEST_MANAGER_STYLES, testManagerWeek,
  type TestManager, type TestManagerDecisions, type TestManagerGameweek, type TestManagerHabits,
} from "./testManagers";

// A made-up season: ten teams, each a coach and one player per role, 18 gameweeks over two splits
// with three knockout weeks at the end. Every value is a fixture; the sim's are its data.
const TEAMS = Array.from({ length: 10 }, (_, i) => `t${i}`);
const POOL: Pick[] = TEAMS.flatMap((team) => [coach(team), ...PLAYER_ROLES.map((role) => player(`${team}-${role}`, team, role))]);
const GAMEWEEKS = 18;
const SPLIT_2_OPENS = 10;
const KNOCKOUTS_OPEN = 16;
const BUDGET = 100 * WON_PER_M;
const KNOCKOUT_RAISE = 5 * WON_PER_M;
const KNOCKOUT_SETTINGS = { ...REGULAR_SETTINGS, teamCap: 3 };
const STAGES = ["groups", "playoffs"];
const BUFFS: Buff[] = [
  { id: "bb", name: "Bench Boost", effect: "benchBoost", perSplit: 1, stageIds: STAGES },
  { id: "dc", name: "Double Captain", effect: "doubleCaptain", multiplier: 2, perSplit: 1, stageIds: STAGES },
  { id: "cd", name: "Coach Diff", effect: "coachMultiplier", multiplier: 3, perSplit: 1, stageIds: STAGES },
];
const HABITS: TestManagerHabits = { bankChance: 0.3, hitChance: 0.15, buffChance: 0.25, unlimitedTransfers: 3, shortlist: 3 };

/** Gameweek `n` (1-based): its split, stage, and whether transfers are unlimited. */
function gameweekOf(n: number): TestManagerGameweek & TransferGameweek {
  const knockout = n >= KNOCKOUTS_OPEN;
  const opensSplit = n === 1 || n === SPLIT_2_OPENS;
  return {
    id: `gw${n}`, splitId: n < SPLIT_2_OPENS ? "split1" : "split2", stageId: knockout ? "playoffs" : "groups",
    unlimited: opensSplit || knockout, opensSplit, toppedUp: false, opensAt: 0, deadline: 1,
  };
}

/** Each week's prices, 5m to 20m, drifting by up to 0.5m a week; and each pick's points last week. */
function madeUpWeeks(random: () => number): { prices: Prices; form: Map<string, number> }[] {
  const price = new Map(POOL.map((pick, i) => [pickKey(pick), (5 + ((i * 7) % 31) / 2) * WON_PER_M]));
  return Array.from({ length: GAMEWEEKS }, () => {
    for (const [key, won] of price) price.set(key, Math.max(4 * WON_PER_M, won + Math.round((random() - 0.5) * 10) * WON_PER_M / 10));
    return { prices: new Map(price), form: new Map(POOL.map((pick) => [pickKey(pick), Math.floor(random() * 16)])) };
  });
}

interface Played {
  manager: TestManager;
  gameweek: number;
  decisions: TestManagerDecisions;
  hit: number;
  form: ReadonlyMap<string, number>;
}

/** Forty test managers, ten of each style, play the made-up season; every week is checked by the
 *  rules a manager's is, and what each did is returned. */
function playSeason(): Played[] {
  const weeks = madeUpWeeks(seeded(99));
  const managers: TestManager[] = Array.from({ length: 40 }, (_, i) => ({ style: TEST_MANAGER_STYLES[i % 4]!, teamId: TEAMS[i % 10] }));
  const played: Played[] = [];
  managers.forEach((manager, i) => {
    const random = seeded(i + 1);
    let squad: Squad | null = null;
    let bank = 0;
    let carried = 0;
    const buffPlays: BuffPlay[] = [];
    for (let n = 1; n <= GAMEWEEKS; n += 1) {
      const gameweek = gameweekOf(n);
      const { prices, form } = weeks[n - 1]!;
      const knockout = n >= KNOCKOUTS_OPEN;
      const settings = knockout ? KNOCKOUT_SETTINGS : REGULAR_SETTINGS;
      const budget = knockout ? BUDGET + KNOCKOUT_RAISE : BUDGET;
      if (n === KNOCKOUTS_OPEN) bank += KNOCKOUT_RAISE;
      const free = freeTransfersFor(carried, gameweek, TRANSFER_SETTINGS);
      const week = { gameweek, squadSettings: settings, budget, autoFillGap: 2 * WON_PER_M, pool: POOL, prices, form, buffs: BUFFS };
      const decisions = testManagerWeek(manager, { squad, bank, free, buffPlays }, week, HABITS, random);

      expect(squadProblems(decisions.squad, settings)).toEqual([]);
      expect(decisions.bank).toBeGreaterThanOrEqual(0);
      if (squad === null) {
        expect(budgetProblems(decisions.squad, prices, budget)).toEqual([]);
        expect(decisions.transfers).toEqual([]);
      } else {
        expect(transferProblems(squad, decisions.transfers, settings)).toEqual([]);
        expect(arrangeByRole(squad, decisions.transfers)).toEqual(decisions.squad);
        expect(decisions.bank).toBe(bankAfterTransfers(bank, decisions.transfers, prices));
      }
      expect(armbandProblems(decisions.squad, decisions.armband)).toEqual([]);
      const buff = BUFFS.find((b) => b.id === decisions.buffId) ?? null;
      if (buff) {
        expect(buffProblems(buff, buffPlays, gameweek)).toEqual([]);
        buffPlays.push({ buffId: buff.id, gameweekId: gameweek.id, splitId: gameweek.splitId });
      }
      expect(() => buffLineup(buff, decisions.squad, decisions.armband, pickKeysOf(decisions.squad), CARRY_MULTIPLIER)).not.toThrow();

      const confirmed = decisions.transfers.map((t) => ({ ...t, outPrice: prices.get(pickKey(t.out))!, inPrice: prices.get(pickKey(t.in))! }));
      expect(netTransfers(confirmed)).toHaveLength(confirmed.length);
      const { hit, nextFree } = settleTransfers(free, confirmed, gameweek, TRANSFER_SETTINGS);
      played.push({ manager, gameweek: n, decisions, hit, form });
      squad = decisions.squad;
      bank = decisions.bank;
      carried = nextFree;
    }
  });
  return played;
}

describe("test managers play a made-up season", () => {
  const season = playSeason();

  test("every style plays every week with a legal squad, transfers, money, armband and buffs", () => {
    for (const style of TEST_MANAGER_STYLES) {
      expect(season.filter((week) => week.manager.style === style)).toHaveLength(10 * GAMEWEEKS);
    }
  });

  test("they make transfers, take the odd −6, and play every buff", () => {
    expect(season.filter((week) => week.decisions.transfers.length > 0).length).toBeGreaterThan(season.length / 2);
    const hits = season.filter((week) => week.hit > 0);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.length).toBeLessThan(season.length / 4);
    expect(new Set(season.map((week) => week.decisions.buffId))).toEqual(new Set([null, ...BUFFS.map((buff) => buff.id)]));
  });

  test("a loyal fan always holds his own team", () => {
    for (const week of season.filter((w) => w.manager.style === "loyal")) {
      expect(allPicks(week.decisions.squad).some((pick) => pick.teamId === week.manager.teamId)).toBe(true);
    }
  });

  test("a form chaser captains one of his three starting players in best form", () => {
    for (const week of season.filter((w) => w.manager.style === "form")) {
      const form = (pick: Pick) => week.form.get(pickKey(pick)) ?? 0;
      const starting = week.decisions.squad.starters.filter((s) => s.slot !== "coach").map((s) => s.pick);
      const third = starting.map(form).sort((a, b) => b - a)[HABITS.shortlist - 1]!;
      expect(form(starting.find((pick) => pick.id === week.decisions.armband.captain)!)).toBeGreaterThanOrEqual(third);
    }
  });

  test("no two managers think alike: first squads differ", () => {
    const firsts = season.filter((week) => week.gameweek === 1).map((week) => allPicks(week.decisions.squad).map(pickKey).sort().join());
    expect(new Set(firsts).size).toBeGreaterThan(firsts.length / 2);
  });
});

describe("testManagerWeek", () => {
  test("with no transfer he can afford he makes none, rather than go under", () => {
    // His nine at 10m each and nothing in the bank; the only pick on offer besides is Faker at 20m.
    const squad = validSquad();
    const prices = byPick([...allPicks(squad).map((pick): [Pick, number] => [pick, 10 * WON_PER_M]), [faker, 20 * WON_PER_M]]);
    const week = {
      gameweek: gameweekOf(2), squadSettings: REGULAR_SETTINGS, budget: BUDGET, autoFillGap: 0,
      pool: [...allPicks(squad), faker], prices, form: new Map<string, number>(), buffs: [],
    };
    const decisions = testManagerWeek({ style: "form" }, { squad, bank: 0, free: 3, buffPlays: [] }, week, { ...HABITS, bankChance: 0 }, seeded(1));
    expect(decisions.transfers).toEqual([]);
    expect(decisions.squad).toEqual(squad);
    expect(decisions.bank).toBe(0);
  });
});
