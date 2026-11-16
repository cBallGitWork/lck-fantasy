// The made-up managers the sample manager follows and plays with: Following, Profile, Leagues' Pub
// League and Home's feed show the same three. Names and teams are examples.

export interface MadeUpManager {
  id: string;
  name: string;
  /** How Home's feed names him: the first name. */
  first: string;
  team: string;
}

export const MANAGERS = {
  minji: { id: "minji", name: "Minji Park", first: "Minji", team: "Chovy Was Right There" },
  jae: { id: "jae", name: "Jae Kim", first: "Jae", team: "Deft Tomorrow" },
  dan: { id: "dan", name: "Dan Okafor", first: "Dan", team: "Peanut Butter Gank" },
} as const satisfies Record<string, MadeUpManager>;

/** Minji's Weeks 1 and 2, final: her profile shows them. */
export const MINJI_EARLIER_WEEKS = [110, 112] as const;

/** Minji's Week 3 at Points' moment, not final, and her season total then: her profile and Pub League show them. */
const MINJI_WEEK3_POINTS = 93;
export const MINJI_WEEK3 = { points: MINJI_WEEK3_POINTS, total: MINJI_EARLIER_WEEKS[0] + MINJI_EARLIER_WEEKS[1] + MINJI_WEEK3_POINTS } as const;
