import { describe, expect, test } from "vitest";
import type { Transfer } from "./budget";
import { coach, ktCoach, player } from "./fixtures";
import { freeTransfersFor, settleTransfers, transfersOpen, type TransferGameweek } from "./transfers";

// Fixture values: the real ones are the competition's data.
const SETTINGS = { freePerGameweek: 1, bankCap: 3, hitPoints: 4, freeAfterUnlimited: 2 };
const DAY = 24 * 60 * 60 * 1000;
const DEADLINE = Date.UTC(2027, 3, 7, 7, 45); // a Wednesday, 16:45 KST

const counted: TransferGameweek = {
  opensAt: DEADLINE - 7 * DAY, deadline: DEADLINE, unlimited: false, opensSplit: false, toppedUp: false,
};
const splitOpener: TransferGameweek = { ...counted, unlimited: true, opensSplit: true };
const knockout: TransferGameweek = { ...counted, unlimited: true };

/** `count` transfers; who moves doesn't matter to the count. */
const transfers = (count: number): Transfer[] =>
  Array.from({ length: count }, (_, i) => ({ out: player(`out${i}`, "t1", "mid"), in: player(`in${i}`, "gen", "mid") }));

describe("settleTransfers", () => {
  test("one free transfer a gameweek; each beyond it costs 4", () => {
    expect(settleTransfers(1, transfers(1), counted, SETTINGS)).toEqual({ hit: 0, nextFree: 1 });
    expect(settleTransfers(1, transfers(3), counted, SETTINGS)).toEqual({ hit: 8, nextFree: 1 });
  });

  test("swapping the coach counts as a transfer", () => {
    const coachSwap = [{ out: ktCoach, in: coach("t1") }];
    expect(settleTransfers(0, coachSwap, counted, SETTINGS).hit).toBe(4);
  });

  test("unused free transfers bank, up to 3 and no further", () => {
    expect(settleTransfers(1, [], counted, SETTINGS).nextFree).toBe(2);
    expect(settleTransfers(2, [], counted, SETTINGS).nextFree).toBe(3);
    expect(settleTransfers(3, [], counted, SETTINGS).nextFree).toBe(3);
  });

  test("before the first deadline transfers are free and unlimited, then 2 free for gameweek 2", () => {
    expect(settleTransfers(0, transfers(9), splitOpener, SETTINGS)).toEqual({ hit: 0, nextFree: 2 });
  });

  test("Split 2 starts the same way: unlimited, then 2 free, then 1 a week up to 3", () => {
    const split2First = settleTransfers(0, transfers(5), splitOpener, SETTINGS);
    expect(split2First).toEqual({ hit: 0, nextFree: 2 });
    const split2Second = settleTransfers(split2First.nextFree!, [], counted, SETTINGS);
    expect(split2Second.nextFree).toBe(3);
  });

  test("a knockout gameweek is unlimited with no hits; the bank after it waits for Craig", () => {
    expect(settleTransfers(1, transfers(6), knockout, SETTINGS)).toEqual({ hit: 0, nextFree: null });
  });

  test("the numbers are the competition's", () => {
    const generous = { freePerGameweek: 2, bankCap: 5, hitPoints: 3, freeAfterUnlimited: 4 };
    expect(settleTransfers(2, transfers(4), counted, generous)).toEqual({ hit: 6, nextFree: 2 });
  });
});

describe("freeTransfersFor", () => {
  test("an admin top-up fills every bank to the cap for that gameweek", () => {
    expect(freeTransfersFor(1, { ...counted, toppedUp: true }, SETTINGS)).toBe(3);
    expect(freeTransfersFor(1, counted, SETTINGS)).toBe(1);
  });
});

describe("transfersOpen", () => {
  // Split 2's first gameweek opens 2 weeks before its deadline; the break before is locked.
  const split2First = { ...splitOpener, opensAt: DEADLINE - 14 * DAY };

  test("between the splits, transfers are locked until the window opens", () => {
    expect(transfersOpen(split2First, DEADLINE - 15 * DAY)).toBe(false);
    expect(transfersOpen(split2First, DEADLINE - 14 * DAY)).toBe(true);
  });

  test("transfers close at the deadline", () => {
    expect(transfersOpen(counted, DEADLINE - 1)).toBe(true);
    expect(transfersOpen(counted, DEADLINE)).toBe(false);
  });
});

