// Free transfers, the bank of them, and hits (spec/03-transfers.md). Every number is the
// competition's data; whether a gameweek is unlimited or topped up is the gameweek's.
import type { Transfer } from "./budget";
import { transfersUnlimited, type ChipEffect } from "./chips";

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

export interface GameweekTransferResult {
  /** Points taken off this gameweek's score. */
  hit: number;
  /** Free transfers carried into the next gameweek. */
  nextFree: number;
}

/** The hit for the gameweek's transfers, a coach swap counting like any other, and the free
 *  transfers carried on: those unused bank up to the cap, plus the weekly one (spec/03). */
export function settleTransfers(
  free: number,
  transfers: readonly Transfer[],
  gameweek: TransferGameweek,
  settings: TransferSettings,
  chip: ChipEffect | null = null,
): GameweekTransferResult {
  // spec/06: a Remake or Limitless week's free transfer doesn't roll over, and the bank is kept:
  // 2 banked stay 2.
  if (transfersUnlimited(chip)) return { hit: 0, nextFree: free };
  const made = transfers.length;
  // spec/03: a knockout week keeps the bank as it was: 1 banked stays 1.
  if (gameweek.unlimited) return { hit: 0, nextFree: gameweek.opensSplit ? settings.freeAfterUnlimited : free };
  const extra = Math.max(0, made - free);
  const unused = Math.max(0, free - made);
  return {
    hit: extra * settings.hitPoints,
    nextFree: Math.min(settings.bankCap, unused + settings.freePerGameweek),
  };
}
