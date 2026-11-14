// Test fixtures for the squad rules: picks and settings, never product data.
import { allPicks, pickKey, type Pick, type PlayerRole, type Squad, type SquadSettings, type StarterSlot } from "./squad";

export const player = (id: string, teamId: string, role: PlayerRole): Pick => ({ id, teamId, role });
export const coach = (teamId: string): Pick => ({ id: teamId, teamId, role: "coach" });

export const REGULAR_SETTINGS: SquadSettings = {
  starterSlots: { top: 1, jungle: 1, mid: 1, bot: 1, support: 1, flex: 1, coach: 1 },
  benchSize: 2,
  teamCap: 2,
};

export const zeus = player("zeus", "hle", "top");
export const oner = player("oner", "t1", "jungle");
export const chovy = player("chovy", "gen", "mid");
export const gumayusi = player("gumayusi", "hle", "bot");
export const keria = player("keria", "t1", "support");
export const ruler = player("ruler", "gen", "bot");
export const ktCoach = coach("kt");
export const bdd = player("bdd", "kt", "mid");
export const lucid = player("lucid", "dk", "jungle");

/** A valid squad under REGULAR_SETTINGS: two from each of HLE, T1, GEN and KT, one from DK. */
export function validSquad(): Squad {
  return {
    starters: [
      { slot: "top", pick: zeus },
      { slot: "jungle", pick: oner },
      { slot: "mid", pick: chovy },
      { slot: "bot", pick: gumayusi },
      { slot: "support", pick: keria },
      { slot: "flex", pick: ruler },
      { slot: "coach", pick: ktCoach },
    ],
    bench: [bdd, lucid],
  };
}

/** The squad with one starter slot's pick swapped. */
export function withStarter(squad: Squad, slot: StarterSlot, pick: Pick): Squad {
  return { ...squad, starters: squad.starters.map((s) => (s.slot === slot ? { ...s, pick } : s)) };
}

/** The `pickKey`s of everyone in the squad who played, all but `sitOut`. */
export function playedExcept(squad: Squad, ...sitOut: Pick[]): Set<string> {
  const out = new Set(sitOut.map(pickKey));
  return new Set(allPicks(squad).map(pickKey).filter((key) => !out.has(key)));
}
