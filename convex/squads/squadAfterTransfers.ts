// A squad after transfers (spec/03, Roles in a transfer): any role out for any role in, as long as
// the squad keeps its minimum of each role, and the coach only for a coach. Flol then arranges the
// squad by role itself, as FPL does.
import type { Transfer } from "./budget";
import {
  allPicks, fitsSlot, pickKey, pickKeysOf, roleShortfalls, squadProblems,
  type Pick, type Squad, type SquadProblem, type SquadSettings, type StarterSlot,
} from "./squad";

export type TransferProblem =
  | SquadProblem
  | { rule: "notInSquad"; pickId: string }
  | { rule: "coachForCoach"; outId: string; inId: string };

/** Every rule a set of transfers breaks; empty when the squad after them is valid. The transfers
 *  are the gameweek's netted ones (`netTransfers`), so each pick out is in the squad now. */
export function transferProblems(squad: Squad, transfers: readonly Transfer[], settings: SquadSettings): TransferProblem[] {
  const problems: TransferProblem[] = [];
  const unsold = pickKeysOf(squad);
  for (const { out, in: pickIn } of transfers) {
    if (!unsold.delete(pickKey(out))) problems.push({ rule: "notInSquad", pickId: out.id });
    if ((out.role === "coach") !== (pickIn.role === "coach")) {
      problems.push({ rule: "coachForCoach", outId: out.id, inId: pickIn.id });
    }
  }
  if (problems.length > 0) return problems;

  const sold = new Set(transfers.map((transfer) => pickKey(transfer.out)));
  const picksAfter = [...allPicks(squad).filter((pick) => !sold.has(pickKey(pick))), ...transfers.map((transfer) => transfer.in)];
  const shortfalls = roleShortfalls(picksAfter, settings);
  if (shortfalls.length > 0) return shortfalls;
  return squadProblems(arrangeByRole(squad, transfers), settings);
}

interface Seat<Slot extends StarterSlot | "bench" = StarterSlot | "bench"> {
  slot: Slot;
  pick: Pick | null;
}

/** The squad after valid transfers, arranged by role (spec/03):
 *  1. a pick in takes the seat of the pick he replaced where he fits it, as in FPL;
 *  2. each role slot left empty takes a player of that role: a pick in first, then the bench in
 *     bench order, and the flex only last, since a player already starting keeps his place;
 *  3. the picks in left over fill the seats left over, the flex before the bench, in transfer order.
 *  Every other pick keeps his seat, so the bench order holds where it can. Throws when no
 *  arrangement exists: check `transferProblems` first. */
export function arrangeByRole(squad: Squad, transfers: readonly Transfer[]): Squad {
  const starters: Seat<StarterSlot>[] = squad.starters.map(({ slot, pick }) => ({ slot, pick }));
  const bench: Seat<"bench">[] = squad.bench.map((pick) => ({ slot: "bench", pick }));
  const seats: Seat[] = [...starters, ...bench];
  const unplaced: Pick[] = [];

  for (const { out, in: pickIn } of transfers) {
    const seat = seats.find((s) => s.pick !== null && pickKey(s.pick) === pickKey(out));
    if (!seat) throw new Error(`${pickKey(out)} is not in the squad.`);
    if (fitsSlot(pickIn.role, seat.slot)) {
      seat.pick = pickIn;
    } else {
      seat.pick = null;
      unplaced.push(pickIn);
    }
  }

  for (const seat of starters) {
    if (seat.pick || seat.slot === "flex" || seat.slot === "coach") continue;
    const role = seat.slot;
    const pickIn = unplaced.findIndex((pick) => pick.role === role);
    if (pickIn >= 0) {
      seat.pick = unplaced.splice(pickIn, 1)[0]!;
      continue;
    }
    const donor = [...bench, ...starters.filter((s) => s.slot === "flex")].find((s) => s.pick?.role === role);
    if (!donor) throw new Error(`No ${role} left to fill the ${role} slot.`);
    seat.pick = donor.pick;
    donor.pick = null;
  }

  for (const seat of seats.filter((s) => !s.pick)) {
    const fit = unplaced.findIndex((pick) => fitsSlot(pick.role, seat.slot));
    if (fit < 0) throw new Error(`No pick in fits the ${seat.slot} seat.`);
    seat.pick = unplaced.splice(fit, 1)[0]!;
  }

  return {
    starters: starters.map(({ slot, pick }) => ({ slot, pick: pick! })),
    bench: bench.map(({ pick }) => pick!),
  };
}
