#!/usr/bin/env node
// The slop lint: fails a drawn page (a mock-up's HTML) that shows a tell a script can see.
// Nine checks, read from the page's source: middle dots, key headings, typed stars, a source named on
// screen, radius, gradients, tracked capitals, blur and soft shadows. Every value that is a project's
// own (names, allowed parts, each rule's level) is read from its .studio/design.json, so this file
// carries nothing of any one project's and moves between repos as is.
//
//   node scripts/design/lint.mjs [--config <design.json>] <file or folder>...
//
// Prints `file: problem` per finding, or `file: clean`. Exit 0 clean (or only flags), 1 a `fail`
// finding, 2 usage: no pages given, a path or the config unreadable, a level badly set.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { drawnRuns, headings, splitTop, styleRules } from "./page.mjs";

export const CONFIG_PATH = ".studio/design.json";
export const LEVELS = ["off", "flag", "fail"];

/** Each rule's default level, and what to do instead. A project lowers one in its config's `levels`. */
export const RULES = {
  "middle-dot": { level: "fail", fix: "use a gap or a rule between items, not ·" },
  "key-heading": { level: "fail", fix: "drop the key: the heads and marks carry it" },
  "typed-star": { level: "fail", fix: "drop the star, or draw the mark the page means" },
  "hidden-name": { level: "fail", fix: "drop the name, or make it a link out ending ↗" },
  radius: { level: "fail", fix: "use the house radius, or allow the part in config with a reason" },
  gradient: { level: "fail", fix: "use a flat token colour" },
  "tracked-caps": { level: "fail", fix: "use sentence case, or drop the letter-spacing" },
  blur: { level: "fail", fix: "use a flat ground, not backdrop blur" },
  "soft-shadow": { level: "fail", fix: "use a rule or a fill, not a shadow" },
};

/** Shadows with a blur this size or more read as soft. */
const SOFT_BLUR_PX = 10;
/** Headings this short that end in a key word are a key. */
const KEY_HEADING_WORDS = 4;
const KEY_WORDS = /\b(key|legend)$/i;
/** A run that names where its data came from: `Source: …`, `Data from …`. */
const SOURCE_LINE = /^(sources?|data)\s*(:|from\b|via\b)/i;
const STARS = /[★☆]/;
const MIDDLE_DOT = /·/;

/** Whether a rule's selector names an allowed part: `.led` matches `.led`, `.panel .led` and `.led.on`, never `.ledger`. */
function selectorAllowed(selector, allowed) {
  return allowed.some((entry) =>
    entry
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .some((part) => new RegExp(`(^|[^\\w-])${part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`).test(selector)),
  );
}

const sameValue = (a, b) => a.replace(/\s+/g, " ").trim().toLowerCase() === b.replace(/\s+/g, " ").trim().toLowerCase();
const isZero = (value) => /^0(px|%|r?em)?$/i.test(value.trim());

/** The blur of each shadow in a box-shadow value, in px; a shadow with no blur length reads as 0. */
function shadowBlurs(value) {
  if (/^none$/i.test(value.trim())) return [];
  return splitTop(value, ",").map((shadow) => {
    const lengths = shadow
      .replace(/\b(rgba?|hsla?|color-mix|var|oklch|oklab|lab|lch)\([^()]*(\([^()]*\)[^()]*)*\)/gi, " ")
      .split(/\s+/)
      .filter((word) => /^-?[\d.]+(px|r?em)?$/i.test(word));
    const blur = lengths[2] ?? "0";
    const n = parseFloat(blur);
    return /r?em$/i.test(blur) ? n * 16 : n;
  });
}

/** Read and check a design config; throws an Error saying what's wrong. */
export function readConfig(path) {
  if (!existsSync(path)) throw new Error(`${path} is missing`);
  let config;
  try {
    config = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${path} is not valid JSON (${error.message})`, { cause: error });
  }
  levelsOf(config);
  return config;
}

/** Each rule's level: its default, or the config's; lowering one needs a reason (`"off: waits on P3"`). */
export function levelsOf(config) {
  const levels = Object.fromEntries(Object.entries(RULES).map(([id, rule]) => [id, rule.level]));
  for (const [id, setting] of Object.entries(config.levels ?? {})) {
    if (!(id in RULES)) continue; // a rule this script doesn't hold yet
    const match = /^(off|flag|fail)(?::\s*(\S.*))?$/.exec(String(setting));
    if (!match) throw new Error(`levels.${id} is "${setting}": write off, flag or fail, then a colon and the reason`);
    const [, level, reason] = match;
    if (LEVELS.indexOf(level) < LEVELS.indexOf(RULES[id].level) && !reason) {
      throw new Error(`levels.${id} lowers ${RULES[id].level} to ${level} with no reason: write "${level}: <who and when, or the call it waits on>"`);
    }
    levels[id] = level;
  }
  return levels;
}

/** Every finding on one page, as { rule, what }, before levels. */
export function findings(html, config = {}) {
  const found = [];
  const add = (rule, what) => found.push({ rule, what });
  const runs = drawnRuns(html);
  const hidden = config.names?.hidden ?? [];

  for (const run of runs) {
    if (MIDDLE_DOT.test(run)) add("middle-dot", `"${run}"`);
    if (STARS.test(run)) add("typed-star", `"${run}"`);
    if (!run.endsWith("↗")) {
      const name = hidden.find((n) => run.toLowerCase().includes(n.toLowerCase()));
      if (name) add("hidden-name", `"${name}" in "${run}"`);
      else if (SOURCE_LINE.test(run)) add("hidden-name", `a source line "${run}"`);
    }
  }

  for (const heading of headings(html)) {
    const bare = heading.replace(/[:.]$/, "");
    if (bare.split(" ").length <= KEY_HEADING_WORDS && KEY_WORDS.test(bare)) add("key-heading", `"${heading}"`);
  }

  const radius = config.radius ?? {};
  const radiusDefault = String(radius.default ?? 0);
  const radiusAllow = radius.allow ?? [];
  const gradientAllow = (config.gradient?.allow ?? []).map((entry) => entry.selector);
  const capsAllow = config.caps?.allow ?? [];

  for (const { selector, decls } of styleRules(html)) {
    const prop = (name) => decls.filter(([p]) => p === name).map(([, v]) => v);
    for (const [p, v] of decls) {
      if (/^border(-(top|bottom)-(left|right)|-(start|end)-(start|end))?-radius$/.test(p)) {
        const house = sameValue(v, radiusDefault) || (isZero(radiusDefault) && v.split(/\s+/).every(isZero));
        const allowed = radiusAllow.some(
          (entry) => (!entry.selector || selectorAllowed(selector, [entry.selector])) && (!entry.value || entry.value === "any" || sameValue(v, entry.value)),
        );
        if (!house && !allowed) add("radius", `${selector} { ${p}: ${v} }`);
      }
      if (/gradient\(/i.test(v) && !selectorAllowed(selector, gradientAllow)) add("gradient", `${selector} { ${p}: ${v.slice(0, 60)} }`);
      if (/^(-webkit-)?backdrop-filter$/.test(p) && /blur\(/i.test(v)) add("blur", `${selector} { ${p}: ${v} }`);
      if (p === "box-shadow" && shadowBlurs(v).some((blur) => blur >= SOFT_BLUR_PX)) add("soft-shadow", `${selector} { ${p}: ${v} }`);
    }
    const upper = prop("text-transform").some((v) => /^uppercase\b/i.test(v));
    const tracked = prop("letter-spacing").some((v) => parseFloat(v) > 0);
    if (upper && tracked && !selectorAllowed(selector, capsAllow)) add("tracked-caps", `${selector} { text-transform: uppercase; letter-spacing: ${prop("letter-spacing").at(-1)} }`);
  }
  return found;
}

/** One page's output lines and whether any of them fails, with each rule at its level. */
export function lintPage(file, html, config = {}) {
  const levels = levelsOf(config);
  const lines = [];
  let failed = false;
  for (const { rule, what } of findings(html, config)) {
    const level = levels[rule];
    if (level === "off") continue;
    if (level === "fail") failed = true;
    lines.push(`${file}: ${rule} ${level}: ${what}: ${RULES[rule].fix}`);
  }
  return { lines: lines.length ? lines : [`${file}: clean`], failed };
}

/** The .html files under each path given; a missing path throws. */
export function pagesUnder(paths) {
  return paths.flatMap((path) => {
    if (!existsSync(path)) throw new Error(`${path} does not exist`);
    if (!statSync(path).isDirectory()) return [path];
    return readdirSync(path, { recursive: true })
      .map((name) => join(path, String(name)))
      .filter((file) => file.endsWith(".html") && statSync(file).isFile())
      .sort();
  });
}

function main(args) {
  const usage = "usage: node scripts/design/lint.mjs [--config <design.json>] <file or folder>...";
  let configPath = CONFIG_PATH;
  const paths = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--config") configPath = args[++i];
    else paths.push(args[i]);
  }
  if (!configPath || !paths.length) {
    console.error(usage);
    return 2;
  }
  let config;
  let pages;
  try {
    config = readConfig(configPath);
    pages = pagesUnder(paths);
  } catch (error) {
    console.error(`design lint: ${error.message}`);
    return 2;
  }
  let failed = false;
  for (const page of pages) {
    const result = lintPage(page, readFileSync(page, "utf8"), config);
    failed ||= result.failed;
    for (const line of result.lines) (line.endsWith(": clean") ? console.log : console.error)(line);
  }
  return failed ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
