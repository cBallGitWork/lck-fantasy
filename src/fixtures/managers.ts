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

/** Minji's Week 3 at Points' moment, not final, and her season total then: her profile and Pub League show them. */
export const MINJI_WEEK3 = { points: 93, total: 250 } as const;
