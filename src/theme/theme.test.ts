// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, test } from "vitest";
import { color, themeCss, themeVars } from "./tokens";

const SRC = join(import.meta.dirname, "..");
const THEME = import.meta.dirname;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const COLOUR_LITERAL = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b|\brgba?\(|\bhsla?\(/i;

test("nothing outside src/theme/ holds a colour", () => {
  const offenders = files(SRC)
    .filter((path) => !path.startsWith(THEME) && /\.(tsx?|css)$/.test(path))
    .filter((path) => COLOUR_LITERAL.test(readFileSync(path, "utf8")))
    .map((path) => relative(SRC, path));
  expect(offenders).toEqual([]);
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
