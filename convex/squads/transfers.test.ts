import { describe, expect, test } from "vitest";
import {
  chovy, coach, confirmed, confirmedTransfers as transfers, ktCoach, player, TRANSFER_SETTINGS as SETTINGS,
} from "./fixtures";
import { freeTransfersFor, netTransfers, settleTransfers, transfersOpen, undoTransfer, type TransferGameweek } from "./transfers";

// Fixture values: the real ones are the competition's data.
const DAY = 24 * 60 * 60 * 1000;
const DEADLINE = Date.UTC(2027, 3, 7, 7, 45); // a Wednesday, 16:45 KST

const counted: TransferGameweek = {
  opensAt: DEADLINE - 7 * DAY, deadline: DEADLINE, unlimited: false, opensSplit: false, toppedUp: false,
};
const splitOpener: TransferGameweek = { ...counted, unlimited: true, opensSplit: true };
const knockout: TransferGameweek = { ...counted, unlimited: true };


describe("settleTransfers", () => {
  test("one free transfer a gameweek; each beyond it costs 6", () => {
    expect(settleTransfers(1, transfers(1), counted, SETTINGS)).toEqual({ hit: 0, nextFree: 1 });
    expect(settleTransfers(1, transfers(3), counted, SETTINGS)).toEqual({ hit: 12, nextFree: 1 });
  });

  test("swapping the coach counts as a transfer", () => {
    const coachSwap = [confirmed(ktCoach, coach("t1"))];
    expect(settleTransfers(0, coachSwap, counted, SETTINGS).hit).toBe(6);
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

  test("a knockout gameweek is unlimited with no hits and keeps the bank: 1 stays 1", () => {
    expect(settleTransfers(1, transfers(6), knockout, SETTINGS)).toEqual({ hit: 0, nextFree: 1 });
  });

  test("the numbers are the competition's", () => {
    const generous = { freePerGameweek: 2, bankCap: 5, hitPoints: 3, freeAfterUnlimited: 4 };
    expect(settleTransfers(2, transfers(4), counted, generous)).toEqual({ hit: 6, nextFree: 2 });
  });

  test("playing Remake or Limitless wipes the gameweek's hits", () => {
    expect(settleTransfers(1, transfers(4), counted, SETTINGS, "remake").hit).toBe(0);
    expect(settleTransfers(1, transfers(4), counted, SETTINGS, "limitless").hit).toBe(0);
  });
});

describe("undoing a transfer", () => {
  const faker = player("faker", "t1", "mid");
  const showmaker = player("showmaker", "dk", "mid");
  const kingen = player("kingen", "kt", "top");
  const siwoo = player("siwoo", "dk", "top");

  test("selling a player and buying him back cancels out: no free transfer used, no hit, his old price kept", () => {
    const sold = confirmed(chovy, faker, { outPrice: 20, inPrice: 19 });
    const boughtBack = confirmed(faker, chovy, { outPrice: 19, inPrice: 21 });
    expect(netTransfers([sold, boughtBack])).toEqual([]);
    expect(settleTransfers(1, [sold, boughtBack], counted, SETTINGS)).toEqual({ hit: 0, nextFree: 2 });
    // Sold, then bought back after another move: the chain keeps his first sale price.
    const onward = confirmed(faker, showmaker, { outPrice: 19, inPrice: 15 });
    expect(netTransfers([sold, onward])).toEqual([confirmed(chovy, showmaker, { outPrice: 20, inPrice: 15 })]);
  });

  test("sell A, buy B, sell B, buy A nets to nothing", () => {
    const aToB = confirmed(chovy, faker);
    const bToA = confirmed(faker, chovy);
    expect(netTransfers([aToB, bToA])).toEqual([]);
    expect(settleTransfers(0, [aToB, bToA], counted, SETTINGS).hit).toBe(0);
  });

  test("a bought player swapped back in another slot still nets: A → B, C → A is the one C → B", () => {
    const net = netTransfers([confirmed(chovy, faker), confirmed(showmaker, chovy)]);
    expect(net).toEqual([confirmed(showmaker, faker)]);
  });

  test("an undo after a second transfer brings the old player back at his old price, and the hit back", () => {
    const first = confirmed(chovy, faker, { outPrice: 20, inPrice: 19 });
    const second = confirmed(siwoo, kingen, { outPrice: 8, inPrice: 9 });
    expect(settleTransfers(1, [first, second], counted, SETTINGS).hit).toBe(6);
    const undone = undoTransfer([first, second], netTransfers([first, second])[0]!);
    expect(netTransfers(undone)).toEqual([second]);
    expect(settleTransfers(1, undone, counted, SETTINGS)).toEqual({ hit: 0, nextFree: 1 });
  });

  test("an undo gives back the free transfer", () => {
    const only = confirmed(siwoo, kingen);
    expect(settleTransfers(1, undoTransfer([only], only), counted, SETTINGS)).toEqual({ hit: 0, nextFree: 2 });
  });

  test("a transfer made under Remake or Limitless can't be undone", () => {
    const buffed = confirmed(siwoo, kingen, {}, true);
    expect(() => undoTransfer([buffed], buffed)).toThrow("A transfer made under a buff can't be undone: player:siwoo.");
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

