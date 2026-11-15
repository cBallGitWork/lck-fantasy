// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { expect, test } from "vitest";
import { color, themeCss, themeVars } from "./tokens";

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

test.each([
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
  ["gold", "stage"],
  ["stageText", "stage"],
] as const)("%s reads on %s at 4.5:1 or more", (fg, bg) => {
  expect(contrast(color[fg], color[bg])).toBeGreaterThanOrEqual(4.5);
});

test("the plate's colour roles all stay as tokens", () => {
  const names = themeVars().map(([name]) => name);
  for (const role of ["ink", "mid", "soft", "line", "fill", "bg", "paper", "rise", "fall", "gold", "stage"]) {
    expect(names).toContain(`--${role}`);
  }
  expect(themeCss()).toMatch(/^:root\{--bg:#010A13;/);
});

test("a stream's frame shape is a token", () => {
  expect(themeVars()).toContainEqual(["--ratio-stream", "16 / 9"]);
});
