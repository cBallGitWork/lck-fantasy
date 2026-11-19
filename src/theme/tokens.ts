// Every colour, font, size, weight, gap and width the app draws with (docs/design/plate.md), in three
// layers with the same keys: Flol's core (`core.ts`), the game (`game.ts`) and the league
// (`league.ts`). Nothing outside src/theme/ holds a colour: parts and screens use the CSS custom
// properties these become (`var(--ink)`), so a reskin changes src/theme/ only.

import { REGION } from "../region";
import { core } from "./core";
import { game } from "./game";
import { leagues, type League } from "./league";

const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** A league's map, by its competition's name; a name with no map is an error, never a fallback. */
export function leagueOf(name: string): League {
  const league = leagues[name];
  if (!league) throw new Error(`No theme for the league ${name}: add its map to src/theme/league.ts`);
  return league;
}

/** The three layers merged for one league: its colours with the game's, its fonts, and the core. */
export const tokensOf = (league: League) => ({ ...core, color: { ...league.color, ...game.color }, font: league.font });

type Tokens = ReturnType<typeof tokensOf>;

/** The active league's tokens: the region the app shows. */
const active: Tokens = tokensOf(leagueOf(REGION.name));
export const { color, font, size, weight, lineHeight, space, measure, opacity, stroke, ratio } = active;

export type MeasureKey = keyof typeof measure;

/** A measure as CSS, for the few sizes a part takes as a prop. */
export const measureVar = (key: MeasureKey) => `var(--m-${kebab(key)})`;

/** Every token as a CSS custom property name and value, in the order they are declared: by default the active league's. */
export function themeVars(tokens: Tokens = active): [string, string][] {
  return [
    ...Object.entries(tokens.color).map(([k, v]): [string, string] => [`--${kebab(k)}`, v]),
    ...Object.entries(tokens.font).map(([k, v]): [string, string] => [`--font-${k}`, v]),
    ...Object.entries(tokens.size).map(([k, v]): [string, string] => [`--size-${k}`, `${v}px`]),
    ...Object.entries(tokens.weight).map(([k, v]): [string, string] => [`--w-${k}`, String(v)]),
    ...Object.entries(tokens.space).map(([k, v]): [string, string] => [`--s-${k}`, `${v}px`]),
    ...Object.entries(tokens.measure).map(([k, v]): [string, string] => [`--m-${kebab(k)}`, `${v}px`]),
    ...Object.entries(tokens.lineHeight).map(([k, v]): [string, string] => [`--lh-${k}`, String(v)]),
    ...Object.entries(tokens.opacity).map(([k, v]): [string, string] => [`--opacity-${kebab(k)}`, String(v)]),
    ...Object.entries(tokens.stroke).map(([k, v]): [string, string] => [`--stroke-${k}`, String(v)]),
    ...Object.entries(tokens.ratio).map(([k, v]): [string, string] => [`--ratio-${k}`, v]),
  ];
}

/** The `:root` block that applies every token. */
export function themeCss(): string {
  return `:root{${themeVars()
    .map(([name, value]) => `${name}:${value};`)
    .join("")}}`;
}
