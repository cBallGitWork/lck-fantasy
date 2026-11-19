// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { findings, levelsOf, lintPage, RULES } from "../scripts/design/lint.mjs";
import { ROOT } from "./support/wordsFiles";

// The slop lint (scripts/design/lint.mjs): one page that passes and one that fails per rule, each
// with a fixture config, so the tests hold none of Flol's values (#416).
const CONFIG = {
  names: { hidden: ["Leaguepedia"] },
  radius: { default: "0", allow: [{ value: "50%", reason: "marks" }, { selector: ".card", reason: "the one rounded part" }] },
  gradient: { allow: [{ selector: ".panel", reason: "the dotted panel" }] },
  caps: { allow: [".panel"] },
};

const page = (body: string, css = "") => `<html><head><title>A · B</title><style>${css}</style></head><body>${body}</body></html>`;

const CASES: Record<string, { pass: string; fail: string }> = {
  "middle-dot": { pass: page("<p>GEN 2–0 KT</p><!-- a · b -->"), fail: page("<p>GEN 2–0 KT &middot; Wed</p>") },
  "key-heading": { pass: page("<h2>Overall</h2><span>Legend</span>"), fail: page("<h3>Colour key</h3>") },
  "typed-star": { pass: page("<p>Captain C</p>"), fail: page("<p>Top pick ★</p>") },
  "hidden-name": {
    pass: page("<a>Leaguepedia ↗</a><p>All sponsors are made up.</p>"),
    fail: page("<p>Stats from Leaguepedia</p>"),
  },
  radius: {
    pass: page("", ".box { border-radius: 0 } .dot { border-radius: 50% } .card { border-radius: 6px 6px 0 0 }"),
    fail: page('<div style="border-radius: 8px">x</div>'),
  },
  gradient: { pass: page("", ".panel { background-image: radial-gradient(circle, #fff 1px, transparent 1px) }"), fail: page("", ".hero { background: linear-gradient(#000, #fff) }") },
  "tracked-caps": {
    pass: page("", ".panel { text-transform: uppercase; letter-spacing: 1px } h1 { letter-spacing: -.5px; text-transform: uppercase }"),
    fail: page("", ".eyebrow { text-transform: uppercase; letter-spacing: .08em }"),
  },
  blur: { pass: page("", ".bar { background: #000 }"), fail: page("", ".bar { -webkit-backdrop-filter: blur(12px) }") },
  "soft-shadow": {
    pass: page("", ".radio { box-shadow: inset 0 0 0 3px var(--paper) } .key { box-shadow: 0 1px 2px rgba(0, 0, 0, .3) }"),
    fail: page("", ".card2 { box-shadow: 0 1px 2px #000, 0 8px 24px rgba(0, 0, 0, .25) }"),
  },
};

const rulesFound = (html: string) => findings(html, CONFIG).map((f) => f.rule);
const caseOf = (rule: string) => {
  const found = CASES[rule];
  if (!found) throw new Error(`no pages for ${rule}`);
  return found;
};

describe.each(Object.keys(RULES))("%s", (rule) => {
  test("its passing page passes", () => expect(rulesFound(caseOf(rule).pass)).toEqual([]));
  test("its failing page fails, naming the rule", () => {
    expect(rulesFound(caseOf(rule).fail)).toEqual([rule]);
    const { lines, failed } = lintPage("page.html", caseOf(rule).fail, CONFIG);
    expect(failed).toBe(true);
    expect(lines[0]).toMatch(new RegExp(`^page\\.html: ${rule} fail: `));
  });
});

test("every rule has its two pages", () => expect(Object.keys(CASES).sort()).toEqual(Object.keys(RULES).sort()));

test("a clean page says so", () => expect(lintPage("page.html", page("<p>Week 4</p>"), CONFIG)).toEqual({ lines: ["page.html: clean"], failed: false }));

describe("levels", () => {
  const starred = caseOf("typed-star").fail;
  test("off skips a rule", () => expect(lintPage("p.html", starred, { levels: { "typed-star": "off: waits on Craig" } }).lines).toEqual(["p.html: clean"]));
  test("flag prints it but doesn't fail", () => {
    const { lines, failed } = lintPage("p.html", starred, { levels: { "typed-star": "flag: the panel answers it" } });
    expect(failed).toBe(false);
    expect(lines[0]).toMatch(/^p\.html: typed-star flag: /);
  });
  test("lowering a rule needs a reason", () => expect(() => levelsOf({ levels: { radius: "off" } })).toThrow(/no reason/));
  test("a level must be off, flag or fail", () => expect(() => levelsOf({ levels: { radius: "warn: why" } })).toThrow(/off, flag or fail/));
  test("a rule the script doesn't hold yet is left alone", () => expect(levelsOf({ levels: { "tag-count": "off: later" } }).radius).toBe("fail"));
});

describe("the command", () => {
  const run = (...args: string[]) => spawnSync(process.execPath, [join(ROOT, "scripts/design/lint.mjs"), ...args], { encoding: "utf8" });
  const dir = mkdtempSync(join(tmpdir(), "design-lint-"));
  const config = join(dir, "design.json");
  writeFileSync(config, JSON.stringify(CONFIG));
  writeFileSync(join(dir, "clean.html"), page("<p>Week 4</p>"));

  test("exits 0 on clean pages", () => expect(run("--config", config, join(dir, "clean.html")).status).toBe(0));
  test("exits 1 on a finding", () => {
    writeFileSync(join(dir, "star.html"), caseOf("typed-star").fail);
    expect(run("--config", config, join(dir, "star.html")).status).toBe(1);
  });
  test("exits 2 with no pages, or a missing path", () => {
    expect(run("--config", config).status).toBe(2);
    expect(run("--config", config, join(dir, "nowhere.html")).status).toBe(2);
  });
  test("Flol's approved pictures pass with Flol's config", () => {
    const result = spawnSync(process.execPath, ["scripts/design/lint.mjs", "docs/design/approved"], { cwd: ROOT, encoding: "utf8" });
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
  });
});
