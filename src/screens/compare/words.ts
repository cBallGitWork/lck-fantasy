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
  /** The search's hint and its name for a reader. */
  find: "Find a player",
  otherRoles: "Other roles ›",
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
export const among = (n: number, role: PersonRole) => `${n} ${ROLE_PLURAL[role].toLowerCase()}`;

/** `v KT`: a series' other side. */
export const versus = (opponent: string) => `${WORDS.versus} ${opponent}`;

/** `W4 · Wed`: a series' week and day, as the card's strip shows it. */
export const seriesWhen = (week: number, day: string) => `W${week} · ${day}`;

/** `All mids · Other roles ›`: opens the rest of the search. */
export const allOf = (role: PersonRole) => `All ${ROLE_PLURAL[role].toLowerCase()} · ${WORDS.otherRoles}`;

/** `Faker v Chovy`: the card's title, for a reader. */
export const faceOff = (left: string, right: string) => `${left} ${WORDS.versus} ${right}`;

/** `Compare Faker`: the card's title before the second player is picked. */
export const compareOne = (name: string) => `Compare ${name}`;
