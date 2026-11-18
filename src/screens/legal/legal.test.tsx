// @vitest-environment node
import { describe, expect, test } from "vitest";
import { expectInOrder, html } from "../../testing/render";
import { LegalScreen } from "./index";
import { blocks, runs } from "./legal";

describe("Privacy and Terms, docs/legal/'s text as a plain page", () => {
  test("Privacy shows its text below the file's note, bold heads and lists kept", () => {
    const out = html(<LegalScreen page="privacy" />);
    expect(out).toContain('data-screen="legal"');
    expect(out).not.toContain("A first draft for the beta");
    expectInOrder(out, ["Privacy", "<b>Who we are.</b> Flol is a free fantasy game", "<li>Convex: our database and sign-in.</li>", "Last updated: [date]."]);
  });

  test("Terms links its Privacy page", () => {
    const out = html(<LegalScreen page="terms" />);
    expectInOrder(out, ["Terms", "<b>The game.</b>", 'href="/privacy"', ">Privacy</a> page says"]);
  });
});

describe("reading the markdown", () => {
  test("a line's bold, its links to the other page, and any other link as words", () => {
    expect(runs("**Age.** Read [Terms](terms.md) or [this](other.md).")).toEqual([
      { text: "Age.", bold: true },
      { text: " Read " },
      { text: "Terms", page: "terms" },
      { text: " or " },
      { text: "this" },
      { text: "." },
    ]);
  });

  test("text starts below ---, wrapped lines join, a list's items split", () => {
    const md = "# T\n\nNote.\n\n---\n\nOne\n  two.\n\n- A\n  b.\n- C.\n";
    expect(blocks(md)).toEqual([
      { kind: "paragraph", runs: [{ text: "One two." }] },
      { kind: "list", items: [[{ text: "A b." }], [{ text: "C." }]] },
    ]);
  });

  test("a file without its --- line fails loudly", () => {
    expect(() => blocks("# T\n\nText.")).toThrow(/no "---" line/);
  });
});
