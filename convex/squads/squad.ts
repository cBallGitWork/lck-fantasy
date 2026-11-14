// A squad's shape (spec/01-squad-and-slots.md): which slots it has, who may fill them, and the cap
// on picks from one team. The sizes and the cap are the competition's settings, never code.

/** LoL's five roles: a rule of the sport, like FPL's four positions (docs/data-model.md). */
export const PLAYER_ROLES = ["top", "jungle", "mid", "bot", "support"] as const;
export type PlayerRole = (typeof PLAYER_ROLES)[number];

/** A pick's listed role on its team's roster. A coach pick is the team itself. */
export type Role = PlayerRole | "coach";
export type StarterSlot = PlayerRole | "flex" | "coach";

/** One pick. `id` is the player's, or for a coach the team's: the pick is the team, not the
 *  person, so a new head coach changes no pick (spec/01, The coach). */
export interface Pick {
  id: string;
  teamId: string;
  /** The role on the roster, not the one played on the day (spec/01, Roles). */
  role: Role;
}

export interface SquadPick {
  slot: StarterSlot;
  pick: Pick;
}

export interface Squad {
  starters: SquadPick[];
  /** In bench order: the first is bench 1. */
  bench: Pick[];
}

export interface SquadSettings {
  /** How many of each starter slot a squad has. */
  starterSlots: Record<StarterSlot, number>;
  benchSize: number;
  /** The most picks from one team, the coach included; null for no cap. */
  teamCap: number | null;
}

export type SquadProblem =
  | { rule: "slotCount"; slot: StarterSlot | "bench"; expected: number; actual: number }
  | { rule: "wrongRole"; slot: StarterSlot | "bench"; pickId: string }
  | { rule: "pickedTwice"; pickId: string }
  | { rule: "overTeamCap"; teamId: string; cap: number; actual: number };

export const STARTER_SLOTS = [...PLAYER_ROLES, "flex", "coach"] as const satisfies readonly StarterSlot[];

/** Whether a pick of `role` may fill `slot`: its own role, a player in the flex, a coach in the
 *  coach slot, and only players on the bench (spec/01: there is no bench coach). */
export function fitsSlot(role: Role, slot: StarterSlot | "bench"): boolean {
  if (slot === "flex" || slot === "bench") return role !== "coach";
  return role === slot;
}

/** Every rule the squad breaks; empty when it is valid. */
export function squadProblems(squad: Squad, settings: SquadSettings): SquadProblem[] {
  const problems: SquadProblem[] = [];

  for (const slot of STARTER_SLOTS) {
    const actual = squad.starters.filter((starter) => starter.slot === slot).length;
    const expected = settings.starterSlots[slot];
    if (actual !== expected) problems.push({ rule: "slotCount", slot, expected, actual });
  }
  if (squad.bench.length !== settings.benchSize) {
    problems.push({ rule: "slotCount", slot: "bench", expected: settings.benchSize, actual: squad.bench.length });
  }

  for (const { slot, pick } of squad.starters) {
    if (!fitsSlot(pick.role, slot)) problems.push({ rule: "wrongRole", slot, pickId: pick.id });
  }
  for (const pick of squad.bench) {
    if (!fitsSlot(pick.role, "bench")) problems.push({ rule: "wrongRole", slot: "bench", pickId: pick.id });
  }

  const picks = allPicks(squad);
  const seen = new Set<string>();
  for (const pick of picks) {
    const key = pickKey(pick);
    if (seen.has(key)) problems.push({ rule: "pickedTwice", pickId: pick.id });
    seen.add(key);
  }

  if (settings.teamCap !== null) {
    for (const [teamId, actual] of picksPerTeam(picks)) {
      if (actual > settings.teamCap) problems.push({ rule: "overTeamCap", teamId, cap: settings.teamCap, actual });
    }
  }
  return problems;
}

/** A pick's key, apart from a player and a team sharing an id: prices and ownership are keyed by it. */
export function pickKey(pick: Pick): string {
  return pick.role === "coach" ? `coach:${pick.id}` : playerKey(pick.id);
}

export function playerKey(playerId: string): string {
  return `player:${playerId}`;
}

export function allPicks(squad: Squad): Pick[] {
  return [...squad.starters.map((starter) => starter.pick), ...squad.bench];
}

/** How many picks each team fills, the coach counting as one (spec/01, The coach). */
export function picksPerTeam(picks: Pick[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const pick of picks) counts.set(pick.teamId, (counts.get(pick.teamId) ?? 0) + 1);
  return counts;
}
