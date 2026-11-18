import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

/** The repo's root, from this file's place in it. */
export const ROOT = join(import.meta.dirname, "..", "..");

/** One string a player can read, from a words file. */
export interface ShownString {
  /** The words file, from the repo's root. */
  file: string;
  line: number;
  /** The text; a template literal's placeholders read as `${}`. */
  text: string;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

/** Every words file: each screen's or part's `words.ts` under `src/`. */
export function wordsFiles(): string[] {
  return walk(join(ROOT, "src")).filter((path) => path.endsWith("/words.ts"));
}

/**
 * Every string and template literal a words file holds, read through the TypeScript AST, so a
 * comment or an import's path is never text. A template's placeholders read as `${}`.
 */
export function shownStrings(path: string): ShownString[] {
  const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
  const file = relative(ROOT, path);
  const found: ShownString[] = [];
  const add = (node: ts.Node, text: string) =>
    found.push({ file, line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1, text });
  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node, node.text);
    else if (ts.isTemplateExpression(node)) add(node, [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join("${}"));
    else ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

/** Every shown string in every words file. */
export const allShownStrings = (): ShownString[] => wordsFiles().flatMap(shownStrings);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A matcher for a word or phrase as a whole word, in any case: `click` finds `Click`, not `clicked`. */
export const wholeWord = (word: string) => new RegExp(`(?<![\\p{L}\\p{N}])${escape(word)}(?![\\p{L}\\p{N}])`, "iu");

/** The text with each allowed phrase cut out, so a banned word inside one is not seen. */
export const without = (text: string, phrases: readonly string[]) =>
  phrases.reduce((t, phrase) => t.replace(new RegExp(wholeWord(phrase).source, "giu"), " "), text);

/** The rows of the first markdown table under a `## heading` in a file, as trimmed cells. */
export function tableUnder(path: string, heading: string): string[][] {
  const lines = readFileSync(join(ROOT, path), "utf8").split("\n");
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (start < 0) throw new Error(`No "## ${heading}" in ${path}`);
  const rows: string[][] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    if (!line.startsWith("|")) {
      if (rows.length > 0) break;
      continue;
    }
    rows.push(line.split("|").slice(1, -1).map((c) => c.trim()));
  }
  if (rows.length < 3) throw new Error(`No table under "## ${heading}" in ${path}`);
  return rows.slice(2);
}

/** A cell's comma-separated words, without backticks. */
export const cellWords = (cell: string) =>
  cell
    .split(",")
    .map((w) => w.replace(/`/g, "").trim())
    .filter(Boolean);
