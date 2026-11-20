// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, test } from "vitest";
import { game } from "./game";
import { leagues, type League } from "./league";
import { color, leagueOf, size, themeCss, themeVars, tokensOf } from "./tokens";

const SRC = join(import.meta.dirname, "..");
const THEME = import.meta.dirname + sep;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const CODE = /\.(m?[jt]sx?|css)$/;
/** Every source file under src/, and those outside src/theme/, which may hold no colour or size. */
const SOURCES = files(SRC).filter((path) => CODE.test(path) && !/\.test\.[jt]sx?$/.test(path));
const OUTSIDE_THEME = SOURCES.filter((path) => !path.startsWith(THEME));

/** Code with its comments taken out, so a comment may say `40px` or cite issue #135. */
const uncomment = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
const code = (path: string) => uncomment(readFileSync(path, "utf8"));

const NAMED = ["white", "black", "red", "blue", "green", "gray", "grey", "gold", "navy", "teal", "silver", "orange", "yellow", "purple", "pink", "brown"];
const COLOUR_LITERAL = new RegExp(
  [
    // A hex colour as a CSS value or inside a string.
    String.raw`(?:["'\x60:\s(,])#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b`,
    String.raw`\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix|color)\(`,
    // A named colour as a CSS value.
    String.raw`:\s*(?:[^;{}]*\s)?(?:${NAMED.join("|")})\s*[;}!]`,
  ].join("|"),
  "i",
);

const offenders = (pattern: RegExp) => OUTSIDE_THEME.filter((path) => pattern.test(code(path))).map((path) => relative(SRC, path));

test("nothing outside src/theme/ holds a colour", () => {
  expect(offenders(COLOUR_LITERAL)).toEqual([]);
});

test("the colour check catches hex, functions and names, but not an issue number", () => {
  const hasColour = (source: string) => COLOUR_LITERAL.test(uncomment(source));
  for (const bad of ["a { color: #fff; }", 'const c = "#C89B3C";', "a { color: oklch(0.7 0.1 80); }", "a { background: white; }", "a { color: color-mix(in srgb, red, blue); }"]) {
    expect(hasColour(bad)).toBe(true);
  }
  for (const fine of ["// Built for issue #133.", "/* #135 */", "a { color: var(--ink); }", "a { background: transparent; }", "a { color: currentColor; }", ".gold-rule { border: 0; }"]) {
    expect(hasColour(fine)).toBe(false);
  }
});

// A size in px, or a line height written as a bare number, outside the theme. SVG geometry in a
// viewBox's own units (`strokeWidth="44"`) is drawing, not a size, and is allowed.
const SIZE_LITERAL = /\b\d+(?:\.\d+)?px\b|line-height:\s*[\d.]+\s*[;}]|\/\s*[\d.]+\s+var\(--font/;

test("nothing outside src/theme/ holds a size", () => {
  expect(offenders(SIZE_LITERAL)).toEqual([]);
  expect("a { width: 64px; }").toMatch(SIZE_LITERAL);
  expect("a { line-height: 1.3; }").toMatch(SIZE_LITERAL);
  expect("a { line-height: var(--lh-mid); }").not.toMatch(SIZE_LITERAL);
});

test("every var(--name) the app uses is a token", () => {
  const tokens = new Set(themeVars().map(([name]) => name));
  const unknown = SOURCES.flatMap((path) =>
    [...code(path).matchAll(/var\((--[\w-]+)\s*[,)]/g)].map((m) => m[1] as string).filter((name) => !tokens.has(name)).map((name) => `${relative(SRC, path)}: ${name}`),
  );
  expect(unknown).toEqual([]);
});

const BASE = code(join(THEME, "base.css"));
const rule = (selector: string) => BASE.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^{]*\\{([^}]*)\\}`))?.[1] ?? "";

test("no type size is under the plate's smallest, so every tag is 12px", () => {
  expect(Math.min(...Object.values(size))).toBe(size.small);
  expect(size.small).toBe(12);
  const underSmallest = new RegExp(String.raw`\b${size.small - 1}px\b`);
  expect(SOURCES.filter((path) => underSmallest.test(code(path))).map((path) => relative(SRC, path))).toEqual([]);
  expect(themeCss()).not.toMatch(underSmallest);
});

test("a hover underline has one look, .hover-line: 1px, 4px below, and no page draws its own", () => {
  expect(rule(".hover-line:hover")).toContain("text-decoration-thickness: var(--m-rule)");
  expect(rule(".hover-line:hover")).toContain("text-underline-offset: var(--s-1)");
  expect(themeVars()).toContainEqual(["--m-rule", "1px"]);
  expect(themeVars()).toContainEqual(["--s-1", "4px"]);
  expect(offenders(/:hover[^{]*\{[^}]*text-decoration/)).toEqual([]);
});

test("a key that can't be pressed has one look, .key-off: mid on fill, no edge, and no part draws its own", () => {
  expect(rule(".key-off:disabled")).toMatch(/color: var\(--mid\);\s*background: var\(--fill\);\s*border-color: var\(--fill\);/);
  expect(offenders(/:disabled\s*[,{]/)).toEqual([]);
});

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS = [
  ["text", "bg"],
  ["text", "paper"],
  ["text", "fill"],
  ["mid", "bg"],
  ["mid", "paper"],
  ["mid", "fill"],
  ["ink", "paper"],
  ["onInk", "ink"],
  ["rise", "paper"],
  ["fall", "paper"],
  ["over", "bg"],
  ["banner", "stage"],
  ["stageText", "stage"],
  ["onTilePlate", "tilePlate"],
] as const;

describe.each(Object.keys(leagues))("in the %s's colours", (name) => {
  const { color: theirs } = tokensOf(leagueOf(name));
  test.each(PAIRS)("%s reads on %s at 4.5:1 or more", (fg, bg) => {
    expect(contrast(theirs[fg], theirs[bg])).toBeGreaterThanOrEqual(4.5);
  });
});

test("every league's map has every key the LCK's has, and none of the game's", () => {
  const keysOf = (league: League) => Object.fromEntries(Object.entries(league).map(([group, values]) => [group, Object.keys(values).sort()]));
  for (const league of Object.values(leagues)) {
    expect(keysOf(league)).toEqual(keysOf(leagueOf("LCK")));
    expect(Object.keys(league.color).filter((key) => key in game.color)).toEqual([]);
  }
});

test("the type refuses a league map with a key missing or a key too many", () => {
  const lck = leagueOf("LCK");
  const { signal, ...short } = lck.color;
  // @ts-expect-error a colour missing: `signal`
  const missing: League = { ...lck, color: short };
  // @ts-expect-error a colour too many
  const extra: League = { ...lck, color: { ...lck.color, accent: signal } };
  expect([missing, extra]).toHaveLength(2);
});

test("a league with no map is an error, never another league's look", () => {
  expect(() => leagueOf("LEC")).toThrow(/No theme for the league LEC/);
});

// Every token's value before the split into layers (#417), the colours renamed by job:
// `gold` is `banner`, `goldRule` is `bannerRule`, `teal` is `signal`.
const BEFORE_SPLIT =
  ':root{--bg:#010A13;--paper:#0A1428;--line:#1E2D40;--fill:#14233A;--ink:#C89B3C;--on-ink:#010A13;--text:#F0E6D2;--mid:#A09B8C;--soft:#5B5A56;--rise:#FF5C6C;--fall:#6EA2FF;--over:#FF5C6C;--banner:#F0D58C;--banner-rule:#785A28;--stage:#000508;--stage-text:#A09B8C;--signal:#0AC8B9;--dim:rgba(1, 10, 19, 0.72);--map-ground:#0B1A2C;--map-river:#0D2B3E;--map-lane:#1A2C42;--map-base:#22374F;--map-tower:#5B5A56;--tile-card:rgba(240, 230, 210, 0.12);--tile-plate:#FFFFFF;--on-tile-plate:#010A13;--font-sans:"IBM Plex Sans KR", sans-serif;--font-mono:"IBM Plex Mono", monospace;--size-small:12px;--size-body:14px;--size-lead:16px;--size-head:20px;--size-title:28px;--size-card:40px;--size-key:44px;--w-regular:400;--w-semi:600;--w-bold:700;--s-1:4px;--s-2:8px;--s-3:12px;--s-4:16px;--s-5:24px;--s-6:32px;--s-7:48px;--m-rule:1px;--m-rule-heavy:2px;--m-row:40px;--m-target:24px;--m-top-bar:56px;--m-side:360px;--m-modal-card:1056px;--m-modal-sheet:544px;--m-dot:8px;--m-mark:20px;--m-mark-card:28px;--m-mark-sheet:32px;--m-role-icon:28px;--m-role-icon-small:20px;--m-shirt-w:56px;--m-shirt-h:50px;--m-shirt-small-w:40px;--m-shirt-small-h:36px;--m-rift:720px;--m-tile-w:124px;--m-tile-radius:6px;--m-bench-title-w:56px;--m-tag-line:16px;--m-col-name:244px;--m-go-col:48px;--m-col-figure:72px;--m-col-price:80px;--m-col-role:112px;--m-col-rank:64px;--m-col-tier:152px;--m-col-captain:152px;--m-col-score:120px;--m-col-slot:150px;--m-col-player:230px;--m-col-pts:60px;--m-col-swap:90px;--m-col-out:240px;--m-col-arrow:30px;--m-col-in:260px;--m-menu-w:220px;--m-card-head:48px;--m-card-photo:176px;--m-crest:96px;--m-crest-small:20px;--m-crest-sheet:56px;--m-row-sheet:32px;--m-sponsor-h:112px;--m-sponsor-top-w:120px;--lh-tight:1;--lh-snug:1.2;--lh-mid:1.3;--lh-body:1.4;--opacity-tier-band:0.45;--opacity-dim:0.5;--opacity-empty-shirt:0.25;--stroke-shirt:1.6;--stroke-dash:3;--ratio-stream:16 / 9;--ratio-rift:720 / 720;}';

test("the LCK's three layers merged hold every token the one layer held, at the same value", () => {
  const before = Object.fromEntries(
    BEFORE_SPLIT.slice(":root{".length, -";}".length)
      .split(";")
      .map((pair) => [pair.slice(0, pair.indexOf(":")), pair.slice(pair.indexOf(":") + 1)]),
  );
  expect(Object.fromEntries(themeVars())).toEqual(before);
});

/** The colour a rule in a stylesheet draws a property with, from its token: `border: … var(--mid)` gives mid's hex. */
function colourIn(css: string, selector: string, property: string): string {
  const body = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
  const name = body.match(new RegExp(`(?:^|;|\\s)${property}:[^;]*(var\\(--[\\w-]+\\))\\s*;`))?.[1]?.slice(4, -1);
  const value = themeVars().find(([token]) => token === name)?.[1];
  if (!value) throw new Error(`${selector} draws no colour token for ${property}`);
  return value;
}

test("a search field's edge reads at 3:1 or more on its ground (WCAG 1.4.11)", () => {
  expect(contrast(colourIn(BASE, 'input[type="search"]', "border"), color.paper)).toBeGreaterThanOrEqual(3);
});

test("a dimmed tile's team code stays at 4.5:1 or more, and only the shirt's drawing dims (WCAG 1.4.3)", () => {
  const tile = code(join(SRC, "rift", "Tile.css"));
  expect(contrast(colourIn(tile, ".tile--dim .shirt__code", "color"), color.paper)).toBeGreaterThanOrEqual(4.5);
  expect(tile).toContain(".tile--dim .shirt__svg {\n  opacity: var(--opacity-dim);");
  expect(tile).not.toMatch(/\.tile--dim \.shirt\s*\{/);
});

test("the plate's colour roles all stay as tokens", () => {
  const names = themeVars().map(([name]) => name);
  for (const role of ["ink", "mid", "soft", "line", "fill", "bg", "paper", "rise", "fall", "banner", "stage"]) {
    expect(names).toContain(`--${role}`);
  }
  expect(themeCss()).toMatch(/^:root\{--bg:#010A13;/);
});

test("a stream's frame shape is a token", () => {
  expect(themeVars()).toContainEqual(["--ratio-stream", "16 / 9"]);
});
