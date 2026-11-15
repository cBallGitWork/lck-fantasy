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
