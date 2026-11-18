// The front door's rules (spec/09, Picking as a guest): a guest picks nine into an empty squad, each
// pick to his own role's slot, then the Flex, then the bench, within the team cap; Auto-fill fills
// the rest; Save team is offered once all nine are picked and they fit the budget.
import { autoFill, randomChooser } from "../../../convex/signIn/autoFill";
import { budgetProblems, type Prices } from "../../../convex/squads/budget";
import { allPicks, pickKey, picksPerTeam, type Pick, type PlayerRole, type Role, type Squad, type SquadSettings, type StarterSlot } from "../../../convex/squads/squad";
import { formatWon } from "../../parts";
import { BENCH_SLOTS, type PersonRole, type RoleKey, type SquadSlot } from "../../rift";
import { WORDS, teamFull, toPick } from "./words";

/** A player or coach the list offers. A coach is his team's pick (spec/01), shown by his name. */
export interface GuestPlayer {
  name: string;
  team: string;
  role: PersonRole;
  priceWon: number;
  points: number;
  ownedPct: number;
}

/** The season's values the front door works from: data, never code (spec/10). */
export interface FrontDoorRules {
  squad: SquadSettings;
  budget: number | null;
  autoFillGap: number;
}

export const EMPTY_SQUAD: Squad = { starters: [], bench: [] };

/** The Rift's role keys as the squad's roles. */
const ROLE_OF: Record<PersonRole, Role> = { top: "top", jng: "jungle", mid: "mid", bot: "bot", sup: "support", coach: "coach" };

/** The squad's starter slots as the Rift's. */
const RIFT_SLOT: Record<StarterSlot, SquadSlot> = { top: "top", jungle: "jng", mid: "mid", bot: "bot", support: "sup", flex: "flex", coach: "coach" };
const STARTER_OF = Object.fromEntries(Object.entries(RIFT_SLOT).map(([starter, rift]) => [rift, starter])) as Partial<Record<SquadSlot, StarterSlot>>;

/** A player's pick, as the server prices it: a player by handle, a coach by team (convex/lck/season.ts). */
export const pickOf = (p: GuestPlayer): Pick => ({ id: p.role === "coach" ? p.team : p.name, teamId: p.team, role: ROLE_OF[p.role] });

/** Every listed pick's price, keyed as the rules key them. */
export const pricesOf = (players: readonly GuestPlayer[]): Prices => new Map(players.map((p) => [pickKey(pickOf(p)), p.priceWon]));

/** Who holds each of the nine places; an empty place is absent. */
export function holders(squad: Squad, players: readonly GuestPlayer[]): Partial<Record<SquadSlot, GuestPlayer>> {
  const byKey = new Map(players.map((p) => [pickKey(pickOf(p)), p]));
  const held: Partial<Record<SquadSlot, GuestPlayer>> = {};
  for (const { slot, pick } of squad.starters) held[RIFT_SLOT[slot]] = byKey.get(pickKey(pick));
  squad.bench.forEach((pick, i) => (held[BENCH_SLOTS[i]!] = byKey.get(pickKey(pick))));
  return held;
}

/** How many places the squad has: the starters' slots and the bench. */
const size = (settings: SquadSettings) => Object.values(settings.starterSlots).reduce((a, b) => a + b, 0) + settings.benchSize;

/** How many places are still empty. */
export const leftToPick = (squad: Squad, settings: SquadSettings) => size(settings) - allPicks(squad).length;

const isPicked = (squad: Squad, pick: Pick) => allPicks(squad).some((held) => pickKey(held) === pickKey(pick));

/** The players the list offers: everyone not already picked. */
export const unpicked = (squad: Squad, players: readonly GuestPlayer[]) => players.filter((p) => !isPicked(squad, pickOf(p)));

export type Picked = { squad: Squad; news: string } | { refused: string };

/** A `+`: the player goes to his role's slot, else the Flex, else the bench; refused, saying why,
 *  past the team cap or with no place he fits (front door picture: as Transfers). */
export function add(squad: Squad, player: GuestPlayer, settings: SquadSettings): Picked {
  const pick = pickOf(player);
  const cap = settings.teamCap;
  if (cap !== null && (picksPerTeam(allPicks(squad)).get(pick.teamId) ?? 0) >= cap) return { refused: teamFull(cap, pick.teamId) };
  const filled = (slot: StarterSlot) => squad.starters.filter((s) => s.slot === slot).length >= settings.starterSlots[slot];
  const news = `${player.name} ${WORDS.added}`;
  if (pick.role === "coach") {
    return filled("coach") ? { refused: WORDS.oneCoach } : { squad: { ...squad, starters: [...squad.starters, { slot: "coach", pick }] }, news };
  }
  const slot = [pick.role as PlayerRole, "flex" as const].find((s) => !filled(s));
  if (slot) return { squad: { ...squad, starters: [...squad.starters, { slot, pick }] }, news };
  if (squad.bench.length < settings.benchSize) return { squad: { ...squad, bench: [...squad.bench, pick] }, news };
  return { refused: WORDS.noRoom };
}

/** `×` on a picked tile: that place is empty again. */
export function removeAt(squad: Squad, slot: SquadSlot): Squad {
  const bench = BENCH_SLOTS.indexOf(slot as (typeof BENCH_SLOTS)[number]);
  if (bench >= 0) return { ...squad, bench: squad.bench.filter((_, i) => i !== bench) };
  return { ...squad, starters: squad.starters.filter((s) => RIFT_SLOT[s.slot] !== slot) };
}

/** Auto-fill: the empty places filled at random, close to the budget (convex/signIn/autoFill.ts). */
export function autoFilled(squad: Squad, players: readonly GuestPlayer[], rules: FrontDoorRules, random: () => number = Math.random): Squad {
  return autoFill(squad, players.map(pickOf), pricesOf(players), rules.squad, { budget: rules.budget, gap: rules.autoFillGap }, randomChooser(random));
}

/** The bank: the budget less what the squad costs; below zero when over. Null with no budget. */
export function bankOf(squad: Squad, players: readonly GuestPlayer[], budget: number | null): number | null {
  if (budget === null) return null;
  const prices = pricesOf(players);
  return allPicks(squad).reduce((left, pick) => left - (prices.get(pickKey(pick)) ?? 0), budget);
}

/** The Team cap figure: the team with the most picks against the cap, `T1 2 / 2`; `0 / 2` with none. */
export function teamCapLine(squad: Squad, cap: number | null): string {
  const counts = [...picksPerTeam(allPicks(squad))].sort((a, b) => b[1] - a[1]);
  const [team, most] = counts[0] ?? [null, 0];
  const of = `${most} / ${cap ?? "—"}`;
  return team === null ? of : `${team} ${of}`;
}

/** Why Save team is off, for the bar: `5 to pick`, or `₩0.3m over` (spec/09); none when it can save. */
export function saveBlock(squad: Squad, players: readonly GuestPlayer[], rules: FrontDoorRules): string | undefined {
  const left = leftToPick(squad, rules.squad);
  if (left > 0) return toPick(left);
  const [over] = budgetProblems(squad, pricesOf(players), rules.budget);
  if (over?.rule === "overBudget") return `${formatWon(over.cost - over.budget)} ${WORDS.over}`;
  return undefined;
}

/** The country the sign-up sheet starts on: where the visitor is, from the browser's language
 *  (`en-GB` is United Kingdom), when it is one offered; else none, to choose (spec/09). */
export function countryFrom(locale: string | undefined, countries: readonly string[]): string {
  if (!locale) return "";
  const region = new Intl.Locale(locale).maximize().region;
  const name = region && new Intl.DisplayNames(["en"], { type: "region" }).of(region);
  return name && countries.includes(name) ? name : "";
}

/** The role filter an empty slot sets: its own role, or every role for the Flex and the bench. */
export const filterFor = (slot: SquadSlot): RoleKey | "coach" | null => {
  const starter = STARTER_OF[slot];
  if (starter === undefined || starter === "flex") return null;
  return slot as RoleKey | "coach";
};
