// Free transfers, the bank of them, hits, and undoing a transfer (spec/03-transfers.md). Every
// number is the competition's data; whether a gameweek is unlimited or topped up is the gameweek's.
import type { Transfer } from "./budget";
import { transfersUnlimited, type BuffEffect } from "./buffs";
import { pickKey } from "./squad";

export interface TransferSettings {
  /** Free transfers gained each gameweek. */
  freePerGameweek: number;
  /** The most free transfers a manager can bank. */
  bankCap: number;
  /** Points taken off for each transfer beyond the free ones. */
  hitPoints: number;
  /** Free transfers for the gameweek after an unlimited one: 2 for gameweek 2 (spec/03). */
  freeAfterUnlimited: number;
}

export interface TransferGameweek {
  /** When transfers for this gameweek open (UTC ms): the previous deadline, or for Split 2's first
   *  gameweek its window's start, so the break between the splits is locked (spec/03). */
  opensAt: number;
  deadline: number;
  /** Free and unlimited, with no hits: before a season's or Split 2's first deadline, and in
   *  knockout stages (spec/03). */
  unlimited: boolean;
  /** The season's or Split 2's first gameweek, after which every manager has `freeAfterUnlimited`. */
  opensSplit: boolean;
  /** An admin topped every bank up to the cap for this gameweek (spec/03, Top-ups). */
  toppedUp: boolean;
}

/** Whether a transfer at `now` counts for this gameweek: from its opening to its deadline. */
export function transfersOpen(gameweek: TransferGameweek, now: number): boolean {
  return now >= gameweek.opensAt && now < gameweek.deadline;
}

/** The free transfers a manager has for a gameweek: what he carried in, or the cap if topped up. */
export function freeTransfersFor(carried: number, gameweek: TransferGameweek, settings: TransferSettings): number {
  return gameweek.toppedUp ? settings.bankCap : carried;
}

/** A transfer as confirmed, with the prices it was made at (spec/03, Undoing a transfer). */
export interface ConfirmedTransfer extends Transfer {
  /** What the pick out sold for, in won. */
  outPrice: number;
  /** What the pick in cost, in won. */
  inPrice: number;
}

/** Transfers a manager confirmed together (spec/03). */
export interface Confirm {
  transfers: readonly ConfirmedTransfer[];
  /** Made under Remake or Limitless, so it can't be undone. */
  underBuff: boolean;
}

/** The gameweek's confirmed transfers, netted: a pick sold then bought back cancels out, as in FPL,
 *  keeping his old price, and a chain A → B, B → C is the one transfer A → C (spec/03). */
export function netTransfers(confirmed: readonly ConfirmedTransfer[]): ConfirmedTransfer[] {
  const net: ConfirmedTransfer[] = [];
  for (const transfer of confirmed) {
    let pending: ConfirmedTransfer | null = transfer;
    while (pending) {
      const current: ConfirmedTransfer = pending;
      // The pick sold now was bought earlier this gameweek, or the pick bought now was sold earlier.
      const boughtEarlier = net.findIndex((earlier) => pickKey(earlier.in) === pickKey(current.out));
      const soldEarlier = net.findIndex((earlier) => pickKey(earlier.out) === pickKey(current.in));
      if (boughtEarlier < 0 && soldEarlier < 0) {
        net.push(current);
        break;
      }
      const index = boughtEarlier >= 0 ? boughtEarlier : soldEarlier;
      const earlier = net.splice(index, 1)[0]!;
      const [first, second] = boughtEarlier >= 0 ? [earlier, current] : [current, earlier];
      pending = pickKey(first.out) === pickKey(second.in) ? null : {
        out: first.out,
        in: second.in,
        outPrice: first.outPrice,
        inPrice: second.inPrice,
      };
    }
  }
  return net;
}

/** Every transfer of the gameweek's confirms, oldest first, for `settleTransfers`. */
export const transfersOf = (confirms: readonly Confirm[]): ConfirmedTransfer[] =>
  confirms.flatMap((confirm) => confirm.transfers);

/** Undo a whole confirm, never one transfer of it: only the latest, then the one before, and never
 *  one made under Remake or Limitless (spec/03). Returns the confirms left: its old players come
 *  back at the prices it sold them for, and settling the rest gives back exactly the free transfers
 *  and hits it used. */
export function undoConfirm(confirms: readonly Confirm[], index: number): Confirm[] {
  const confirm = confirms[index];
  if (!confirm) throw new Error(`No confirm ${index} this gameweek.`);
  if (index !== confirms.length - 1) throw new Error(`Only the latest confirm can be undone, not confirm ${index}.`);
  if (confirm.underBuff) throw new Error(`Confirm ${index} was made under Remake or Limitless, so it can't be undone.`);
  return confirms.slice(0, index);
}

export interface GameweekTransferResult {
  /** Points taken off this gameweek's score. */
  hit: number;
  /** Free transfers carried into the next gameweek. */
  nextFree: number;
}

/** The hit for the gameweek's netted transfers, a coach swap counting like any other, and the free
 *  transfers carried on: those unused bank up to the cap, plus the weekly one (spec/03). */
export function settleTransfers(
  free: number,
  confirmed: readonly ConfirmedTransfer[],
  gameweek: TransferGameweek,
  settings: TransferSettings,
  buff: BuffEffect | null = null,
): GameweekTransferResult {
  // spec/03 and spec/06: Remake or Limitless wipes the week's hits; its free transfer doesn't roll
  // over, and the bank is kept: 2 banked stay 2.
  if (transfersUnlimited(buff)) return { hit: 0, nextFree: free };
  // spec/03: a knockout week keeps the bank as it was: 1 banked stays 1.
  if (gameweek.unlimited) return { hit: 0, nextFree: gameweek.opensSplit ? settings.freeAfterUnlimited : free };
  const made = netTransfers(confirmed).length;
  const extra = Math.max(0, made - free);
  const unused = Math.max(0, free - made);
  return {
    hit: extra * settings.hitPoints,
    nextFree: Math.min(settings.bankCap, unused + settings.freePerGameweek),
  };
}
