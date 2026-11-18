// A guest's squad, kept in this browser until sign-up (spec/09-onboarding.md, Picking as a guest).
// It is only kept, never entered or scored: sign-up turns it into an entry (convex/signIn).
import { PLAYER_ROLES, STARTER_SLOTS, type Pick, type Squad, type SquadPick } from "../../../convex/squads/squad";

/** The browser storage key the guest's squad is kept under. */
export const GUEST_SQUAD_KEY = "flol.guestSquad";

/** What is kept: the squad, part-picked or whole, and the competition it was picked for. */
interface KeptSquad {
  competitionId: string;
  squad: Squad;
}

export type GuestSquadRead =
  | { kept: "squad"; squad: Squad }
  /** Nothing kept, or a squad picked for another competition, which can't be used in this one. */
  | { kept: "none" }
  /** Something is kept but isn't a squad: the caller reports it, then forgets it. */
  | { kept: "unreadable"; reason: string };

/** Keep the guest's squad, replacing any kept before. */
export function keepGuestSquad(storage: Storage, competitionId: string, squad: Squad): void {
  const kept: KeptSquad = { competitionId, squad };
  storage.setItem(GUEST_SQUAD_KEY, JSON.stringify(kept));
}

/** The squad a guest kept for this competition. */
export function readGuestSquad(storage: Storage, competitionId: string): GuestSquadRead {
  const raw = storage.getItem(GUEST_SQUAD_KEY);
  if (raw === null) return { kept: "none" };
  let kept: unknown;
  try {
    kept = JSON.parse(raw);
  } catch (error) {
    return { kept: "unreadable", reason: `not JSON: ${String(error)}` };
  }
  if (!isKeptSquad(kept)) return { kept: "unreadable", reason: "not a kept squad" };
  if (kept.competitionId !== competitionId) return { kept: "none" };
  return { kept: "squad", squad: kept.squad };
}

/** Forget the kept squad: once it has become an entry, or when it can't be read. */
export function forgetGuestSquad(storage: Storage): void {
  storage.removeItem(GUEST_SQUAD_KEY);
}

/** On log-in: an account that already has a team keeps it, and the guest's squad is dropped with no
 *  question; an account with none keeps the squad for sign-up (spec/09, Signing in again). */
export function onLogIn(storage: Storage, accountHasTeam: boolean): void {
  if (accountHasTeam) forgetGuestSquad(storage);
}

const isObject =(value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const ROLES: readonly unknown[] = [...PLAYER_ROLES, "coach"];
const SLOTS: readonly unknown[] = STARTER_SLOTS;

const isPick = (value: unknown): value is Pick =>
  isObject(value) && typeof value.id === "string" && typeof value.teamId === "string" && ROLES.includes(value.role);

const isSquadPick = (value: unknown): value is SquadPick =>
  isObject(value) && SLOTS.includes(value.slot) && isPick(value.pick);

function isKeptSquad(value: unknown): value is KeptSquad {
  if (!isObject(value) || typeof value.competitionId !== "string" || !isObject(value.squad)) return false;
  const { starters, bench } = value.squad;
  return Array.isArray(starters) && starters.every(isSquadPick) && Array.isArray(bench) && bench.every(isPick);
}
