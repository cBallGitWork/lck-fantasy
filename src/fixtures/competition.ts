// The made-up LCK Cup's teams and values, and the sample manager, as the approved pictures share
// them. Every name and number is an example.

export const TEAMS = {
  T1: "T1",
  GEN: "Gen.G",
  HLE: "Hanwha Life",
  DK: "Dplus KIA",
  KT: "KT Rolster",
  DNS: "DN SOOPers",
  NS: "Nongshim RedForce",
  KRX: "Kiwoom DRX",
  BRO: "HANJIN BRION",
  BFX: "BNK FEARX",
} as const;

export type TeamCode = keyof typeof TEAMS;

export const COMPETITION = "LCK Cup";

/**
 * The competition's values the pictures share: the Carry's multiplier, each series' length, the
 * most players from one team, the points a transfer over the free ones costs, the four buffs (spec/06).
 */
export const CARRY_MULTIPLIER = 1.5;
export const BEST_OF = 3;
export const TEAM_CAP = 2;
export const HIT_POINTS = 6;
export const BUFFS = ["Bench Boost", "Dual Carry", "Remake", "Limitless"] as const;
export type BuffName = (typeof BUFFS)[number];

/** The sample manager every picture shows. */
export const MANAGER = {
  team: "Baron Steal FC",
  hangul: "바론 스틸 FC",
  name: "Sam Lee",
} as const;

/** A player's or coach's id, as his card is reached by: his name in lower case. */
export const playerId = (name: string) => name.toLowerCase();
