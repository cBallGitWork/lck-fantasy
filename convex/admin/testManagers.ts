// Test managers (spec/10, The road to launch, steps 1 and 2): 1,000 of them play the sim and the
// January tests beside the real managers, each in one style. A week's decisions come from one pure
// function, and pass the same squad, money, transfer, armband and buff rules a manager's do.
import { autoFill } from "../signIn/autoFill";
import { arrangeByRole, transferProblems } from "../squads/squadAfterTransfers";
import { bankAfterTransfers, priceOf, requirePrice, type Prices, type Transfer } from "../squads/budget";
import { buffProblems, type Buff, type BuffGameweek, type BuffPlay } from "../squads/buffs";
import type { Armband } from "../squads/carry";
import { allPicks, pickKey, pickKeysOf, type Pick, type Squad, type SquadSettings } from "../squads/squad";
import { sum } from "../../src/parts/util/sum";

/** Chases form; loyal to one team; the cheap stars, the most points for the money; close to random. */
export const TEST_MANAGER_STYLES = ["form", "loyal", "cheapStars", "random"] as const;
export type TestManagerStyle = (typeof TEST_MANAGER_STYLES)[number];

export interface TestManager {
  style: TestManagerStyle;
  /** The team a loyal manager favours. */
  teamId?: string;
}

/** How test managers play, the same for every style: the sim's data, never code. */
export interface TestManagerHabits {
  /** The chance he banks this week's free transfers rather than use them. */
  bankChance: number;
  /** The chance he makes one transfer more than he has free: the odd −6. */
  hitChance: number;
  /** The chance he plays a buff he may play this week. */
  buffChance: number;
  /** How many transfers he makes in a week with unlimited transfers. */
  unlimitedTransfers: number;
  /** How many of the best picks for his style he chooses from at random, so no two think alike. */
  shortlist: number;
}

/** What he holds going into the week: no squad before his first deadline. */
export interface TestManagerEntry {
  squad: Squad | null;
  /** Money in the bank, in won. */
  bank: number;
  /** Free transfers this week (`freeTransfersFor`). */
  free: number;
  buffPlays: readonly BuffPlay[];
}

export interface TestManagerGameweek extends BuffGameweek {
  /** Free and unlimited transfers, with no hits (spec/03). */
  unlimited: boolean;
}

/** The week's data: the stage's settings, the picks on offer, their prices and form. */
export interface TestManagerWeek {
  gameweek: TestManagerGameweek;
  squadSettings: SquadSettings;
  /** In won; null when the stage has the budget off. */
  budget: number | null;
  /** How far under the budget a first squad aims to spend at most (Auto-fill's gap, spec/09). */
  autoFillGap: number;
  pool: readonly Pick[];
  prices: Prices;
  /** Each pick's recent points, by `pickKey`; a pick with none has 0. */
  form: ReadonlyMap<string, number>;
  buffs: readonly Buff[];
}

export interface TestManagerDecisions {
  squad: Squad;
  /** This week's transfers, already netted (none bought back), in the order made. */
  transfers: Transfer[];
  /** The bank after them, in won. */
  bank: number;
  armband: Armband;
  buffId: string | null;
}

/** The week's decisions before the deadline. `random` returns a number in [0, 1), as Math.random
 *  does; the sim seeds it per manager. */
export function testManagerWeek(
  manager: TestManager,
  entry: TestManagerEntry,
  week: TestManagerWeek,
  habits: TestManagerHabits,
  random: () => number,
): TestManagerDecisions {
  const best = bestFirst(manager, week, random);
  const shortlisted = (picks: readonly Pick[]) => {
    const ranked = best(picks);
    // A loyal fan takes his own team's best whenever he can.
    const top = ranked[0];
    if (manager.style === "loyal" && top !== undefined && top.teamId === manager.teamId) return top;
    return ranked[Math.floor(random() * Math.min(habits.shortlist, ranked.length))]!;
  };

  let squad: Squad;
  let transfers: Transfer[] = [];
  let bank: number;
  if (entry.squad === null) {
    const money = { budget: week.budget, gap: week.autoFillGap };
    squad = autoFill({ starters: [], bench: [] }, week.pool, week.prices, week.squadSettings, money, shortlisted);
    bank = week.budget === null ? entry.bank : week.budget - sum(allPicks(squad).map((pick) => requirePrice(pick, week.prices)));
  } else {
    transfers = weekTransfers(entry.squad, entry.bank, transferCount(entry, week, habits, random), week, best, shortlisted);
    squad = arrangeByRole(entry.squad, transfers);
    bank = bankAfterTransfers(entry.bank, transfers, week.prices);
  }

  const buff = playableBuff(entry, week, habits, random);
  // The armband goes on a starting player, never the coach (spec/04).
  const startingPlayers = squad.starters.filter((starter) => starter.slot !== "coach").map((starter) => starter.pick);
  const captain = shortlisted(startingPlayers).id;
  const armband: Armband = buff?.effect === "doubleCaptain"
    ? { captain, secondCaptain: shortlisted(startingPlayers.filter((pick) => pick.id !== captain)).id }
    : { captain };
  return { squad, transfers, bank, armband, buffId: buff?.id ?? null };
}

/** The picks in the style's order, best first: by form; the favourite team's first, then form; by
 *  form for the price; or shuffled. */
function bestFirst(manager: TestManager, week: TestManagerWeek, random: () => number) {
  const form = (pick: Pick) => week.form.get(pickKey(pick)) ?? 0;
  const value = (pick: Pick) => form(pick) / (priceOf(pick, week.prices) ?? Infinity);
  const loyal = (pick: Pick) => Number(pick.teamId === manager.teamId);
  return (picks: readonly Pick[]): Pick[] => {
    switch (manager.style) {
      case "form":
        return [...picks].sort((a, b) => form(b) - form(a));
      case "loyal":
        return [...picks].sort((a, b) => loyal(b) - loyal(a) || form(b) - form(a));
      case "cheapStars":
        return [...picks].sort((a, b) => value(b) - value(a));
      case "random":
        return picks.map((pick) => ({ pick, key: random() })).sort((a, b) => a.key - b.key).map(({ pick }) => pick);
    }
  };
}

/** Unlimited weeks: his set number. Otherwise his free ones, unless he banks them, and the odd one
 *  more for a hit. */
function transferCount(entry: TestManagerEntry, week: TestManagerWeek, habits: TestManagerHabits, random: () => number): number {
  if (week.gameweek.unlimited) return habits.unlimitedTransfers;
  const free = random() < habits.bankChance ? 0 : entry.free;
  return free + Number(random() < habits.hitChance);
}

/** Up to `count` transfers, each selling one of his worst for the style and buying one of the
 *  best he can afford whose squad stays legal. A pick bought this week is never sold, nor one sold
 *  bought back, so the list is already netted. Fewer when no legal transfer is left. */
function weekTransfers(
  squad: Squad,
  bank: number,
  count: number,
  week: TestManagerWeek,
  best: (picks: readonly Pick[]) => Pick[],
  shortlisted: (picks: readonly Pick[]) => Pick,
): Transfer[] {
  const made: Transfer[] = [];
  while (made.length < count) {
    const transfer = nextTransfer(squad, bank, made, week, best, shortlisted);
    if (!transfer) break;
    made.push(transfer);
  }
  return made;
}

/** The next transfer after `made`: his worst unsold pick that has a legal, affordable buy. */
function nextTransfer(
  squad: Squad,
  bank: number,
  made: readonly Transfer[],
  week: TestManagerWeek,
  best: (picks: readonly Pick[]) => Pick[],
  shortlisted: (picks: readonly Pick[]) => Pick,
): Transfer | null {
  const sold = new Set(made.map((transfer) => pickKey(transfer.out)));
  const owned = pickKeysOf(arrangeByRole(squad, made));
  const left = bankAfterTransfers(bank, [...made], week.prices);
  for (const out of best(allPicks(squad).filter((pick) => !sold.has(pickKey(pick)))).reverse()) {
    const affordable = week.pool.filter((pickIn) => {
      const price = priceOf(pickIn, week.prices);
      return price !== undefined
        && !owned.has(pickKey(pickIn))
        && !sold.has(pickKey(pickIn))
        && (week.budget === null || price <= left + requirePrice(out, week.prices))
        && transferProblems(squad, [...made, { out, in: pickIn }], week.squadSettings).length === 0;
    });
    if (affordable.length > 0) return { out, in: shortlisted(affordable) };
  }
  return null;
}

/** A buff he may play this week, now and then. */
function playableBuff(entry: TestManagerEntry, week: TestManagerWeek, habits: TestManagerHabits, random: () => number): Buff | null {
  const playable = week.buffs.filter((buff) => buffProblems(buff, entry.buffPlays, week.gameweek).length === 0);
  if (playable.length === 0 || random() >= habits.buffChance) return null;
  return playable[Math.floor(random() * playable.length)]!;
}
