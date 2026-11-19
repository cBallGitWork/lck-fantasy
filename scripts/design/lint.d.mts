// Types for lint.mjs, for the TypeScript tests that import it.
export type Level = "off" | "flag" | "fail";
export interface Finding {
  rule: string;
  what: string;
}
export const CONFIG_PATH: string;
export const LEVELS: Level[];
export const RULES: Record<string, { level: Level; fix: string }>;
export function readConfig(path: string): object;
export function levelsOf(config: object): Record<string, Level>;
export function findings(html: string, config?: object): Finding[];
export function lintPage(file: string, html: string, config?: object): { lines: string[]; failed: boolean };
export function pagesUnder(paths: string[]): string[];
