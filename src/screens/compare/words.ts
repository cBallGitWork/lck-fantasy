// Compare's words, named once. Every word a player reads on this screen lives here.

import type { PersonRole } from "../../rift";

export const WORDS = {
  /** Under the second player: reopens the search. */
  change: "Change ›",
  /** Between the two faces, and before an opponent (`v KT`). */
  versus: "v",
  season: "Season",
  form: "Form",
  price: "Price",
  owned: "Owned",
  last3: "Last 3",
  next3: "Next 3",
  total: "Total",
  perGame: "Per game",
  pts: "Pts",
} as const;

/** A role named as a group of players: the search's heads and the season rank (`2nd of 10 mids`). */
export const ROLE_PLURAL: Record<PersonRole, string> = {
  top: "Tops",
  jng: "Junglers",
  mid: "Mids",
  bot: "Bots",
  sup: "Supports",
  coach: "Coaches",
};

/** `10 mids`: who a season rank is among. */
export const rankedAmong = (n: number, role: PersonRole) => `${n} ${ROLE_PLURAL[role].toLowerCase()}`;

/** `v KT`: a series' other side. */
export const versus = (opponent: string) => `${WORDS.versus} ${opponent}`;

/** `All mids · Other roles ›`: under the second player's role in the search, opens the rest. */
export const moreRoles = (role: PersonRole) => `All ${ROLE_PLURAL[role].toLowerCase()} · Other roles ›`;

/** `Week 4 · Wed`: a series' week and day, in the Last 3 and Next 3 strips. */
export const seriesWhen = (week: number, day: string) => `Week ${week} · ${day}`;

/** `Find a player`, `Find a coach`: the search's hint and its name for a reader. */
export const findA = (role: PersonRole) => (role === "coach" ? "Find a coach" : "Find a player");

/** `Faker v Chovy`: the card's title, for a reader. */
export const faceOff = (left: string, right: string) => `${left} ${WORDS.versus} ${right}`;

/** `Compare Faker`: the card's title before the second player is picked. */
export const compareOne = (name: string) => `Compare ${name}`;
