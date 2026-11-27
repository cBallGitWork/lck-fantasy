// @vitest-environment node
import { expect, test } from "vitest";
import { html, text } from "../testing/render";
import { FactMark, RowPlayer, type FactKind } from ".";

test("a player named in a row reads as his tile's plate: his team's bar and code, then his name", () => {
  const row = <RowPlayer team="T1" name="Faker" />;
  expect(text(row)).toBe("T1 Faker");
  expect(html(row)).toMatch(/^<i class="team-bar"[^>]*><\/i>T1 <b>Faker<\/b>$/);
});

test("each fact's mark is its own drawing in its own colour's class, unseen by a screen reader; only Star's is filled", () => {
  const kinds: FactKind[] = ["star", "flop", "bought", "sold", "killer"];
  const marks = kinds.map((kind) => html(<FactMark kind={kind} />));
  kinds.forEach((kind, i) => {
    expect(marks[i]).toContain(`class="fact-mark fact-mark--${kind}"`);
    expect(marks[i]).toContain('aria-hidden="true"');
  });
  expect(new Set(marks.map((m) => m.replace(/class="[^"]*"/, ""))).size).toBe(kinds.length);
  expect(marks.map((m) => m.includes("fact-mark__fill"))).toEqual([true, false, false, false, false]);
});
