// Who each test manager is (spec/10, The road to launch; Craig, 19 Nov 2026 on #400): his style, a
// made-up manager and team name, his country and, in each region he plays, his favourite team. Pure,
// and the same for test manager n on every run: data/testManagers.json holds every list and weight.
import { sum } from "../../src/parts/util/sum";
import { TEST_MANAGER_STYLES, type TestManagerStyle } from "./testManagers";

/** Which competitions a run's test managers play, and how many play just those. */
export interface TestManagerGroup {
  competitions: readonly string[];
  managers: number;
}

export interface TestManagerNames {
  teamFirst: readonly string[];
  teamLast: readonly string[];
  /** Given names and the surname initials that go with them: Korean, Western. */
  people: readonly { given: readonly string[]; initials: readonly string[] }[];
}

/** A weight per key: a team code, a country. */
export type Weights = Readonly<Record<string, number>>;

export interface TestManagerRoll {
  account: string;
  style: TestManagerStyle;
  /** Shown in tables beside the team name, such as `Minjun K.`: never the words test manager. */
  name: string;
  teamName: string;
  country: string;
}

/** The account a test manager signs up with: never shown to a manager. */
export const testManagerAccount = (n: number) => `test-manager-${n}`;

/** How many test managers a run's groups hold. */
export const testManagerCount = (groups: readonly TestManagerGroup[]) => sum(groups.map((group) => group.managers));

/** The competitions test manager `n` (from 0) plays: his group's, groups taking managers in order. */
export function competitionsOf(n: number, groups: readonly TestManagerGroup[]): readonly string[] {
  let first = 0;
  for (const group of groups) {
    if (n < first + group.managers) return group.competitions;
    first += group.managers;
  }
  throw new Error(`Test manager ${n} is past the run's ${first}.`);
}

/** Test manager `n`: the styles in turn, so each is a quarter; a name and a country at random. */
export function rollTestManager(n: number, names: TestManagerNames, countries: Weights, random: () => number): TestManagerRoll {
  const people = oneOf(names.people, random);
  return {
    account: testManagerAccount(n),
    style: TEST_MANAGER_STYLES[n % TEST_MANAGER_STYLES.length]!,
    name: `${oneOf(people.given, random)} ${oneOf(people.initials, random)}.`,
    teamName: `${oneOf(names.teamFirst, random)} ${oneOf(names.teamLast, random)}`,
    country: weighted(Object.keys(countries), countries, 0, random),
  };
}

/** A favourite team among a season's `teams`, by code, like real fans: each by its weight, a team
 *  with none by `otherTeams`. */
export const rollFavouriteTeam = (teams: readonly string[], weights: Weights, otherTeams: number, random: () => number) =>
  weighted(teams, weights, otherTeams, random);

const oneOf = <T>(list: readonly T[], random: () => number): T => {
  if (list.length === 0) throw new Error("A test manager's word list is empty.");
  return list[Math.floor(random() * list.length)]!;
};

/** One of `keys`, each as likely as its weight, `otherwise` where it has none. */
function weighted(keys: readonly string[], weights: Weights, otherwise: number, random: () => number): string {
  const weightOf = (key: string) => weights[key] ?? otherwise;
  const total = sum(keys.map(weightOf));
  if (total <= 0) throw new Error(`No weight among ${keys.join(", ")}.`);
  let left = random() * total;
  for (const key of keys) {
    left -= weightOf(key);
    if (left < 0) return key;
  }
  // Rounding can leave a sliver: it goes to the last key that has a weight.
  return [...keys].reverse().find((key) => weightOf(key) > 0)!;
}
