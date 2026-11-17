// The made-up managers the sample manager follows and plays with: Following, Profile, Leagues' Pub
// League and Home's feed show the same three, and Following and the Pub League five more. Names and
// teams are examples.

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
  ella: { id: "ella", name: "Ella Wong", first: "Ella", team: "Ruler of None" },
  joe: { id: "joe", name: "Joe Grant", first: "Joe", team: "BeryL Backup Plan" },
  tom: { id: "tom", name: "Tom Reid", first: "Tom", team: "Kiin Bean" },
  sam: { id: "sam", name: "Sam Hill", first: "Sam", team: "Guma Gang" },
  priya: { id: "priya", name: "Priya Shah", first: "Priya", team: "Zeus Juice" },
} as const satisfies Record<string, MadeUpManager>;

/** Minji's Weeks 1 and 2, final: her profile shows them. */
export const MINJI_EARLIER_WEEKS = [110, 112] as const;

/** Minji's Week 3 at Points' moment, not final, and her season total then: her profile and Pub League show them. */
const MINJI_WEEK3_POINTS = 93;
export const MINJI_WEEK3 = { points: MINJI_WEEK3_POINTS, total: MINJI_EARLIER_WEEKS[0] + MINJI_EARLIER_WEEKS[1] + MINJI_WEEK3_POINTS } as const;

/** One series of each followed manager's Week 3 and his points in it, as Following's and Home's feeds show them; Dan's with his Captain. */
export const FOLLOWED_WEEK3 = {
  minji: { seriesId: "w3-sat-1", points: 20 },
  dan: { seriesId: "w3-wed-1", points: 34, captain: "Faker" },
  jae: { seriesId: "w3-fri-2", points: 9 },
} as const;
