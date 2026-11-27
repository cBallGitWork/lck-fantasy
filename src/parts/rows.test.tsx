// @vitest-environment node
import { expect, test } from "vitest";
import { html, text } from "../testing/render";
import { FactMark, RowPlayer, type Fact } from ".";

test("a player named in a row reads as his tile's plate: his team's bar and code, then his name", () => {
  const row = <RowPlayer team="T1" name="Faker" />;
  expect(text(row)).toBe("T1 Faker");
  expect(html(row)).toMatch(/^<i class="team-bar"[^>]*><\/i>T1 <b>Faker<\/b>$/);
});

test("each fact's mark is its own drawing in its own colour's class, unseen by a screen reader; only Star's is filled", () => {
  const facts: Fact[] = ["Star", "Flop", "Killer"];
  const marks = facts.map((fact) => html(<FactMark fact={fact} />));
  facts.forEach((fact, i) => {
    expect(marks[i]).toContain(`class="fact-mark fact-mark--${fact.toLowerCase()}"`);
    expect(marks[i]).toContain('aria-hidden="true"');
  });
  expect(new Set(marks.map((m) => m.match(/ d="([^"]+)"/)?.[1])).size).toBe(3);
  expect(marks.map((m) => m.includes('fill="currentColor"'))).toEqual([true, false, false]);
});
