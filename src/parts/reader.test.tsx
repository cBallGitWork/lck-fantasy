// @vitest-environment node
import { expect, test } from "vitest";
import { html } from "../testing/render";
import { BuffCard, LiveRegion, PageFrame } from ".";

// What a screen reader gets from the parts (WCAG 2.2 AA): names, headings, the skip link and the live region.

test("the live region is one polite status, unseen, saying its line", () => {
  expect(html(<LiveRegion line="Saved" n={1} />)).toBe('<div class="unseen" role="status" aria-live="polite"><span>Saved</span></div>');
});

test("Skip to content comes first and jumps to the main column", () => {
  const out = html(
    <PageFrame screen="x" account={null}>
      body
    </PageFrame>,
  );
  expect(out.startsWith('<a class="page-frame__skip" href="#main">Skip to content</a>')).toBe(true);
  expect(out).toContain('<main id="main" class="page-frame__main" tabindex="-1">body</main>');
});

test("a buff's name is a heading, and its Play key names the buff", () => {
  const out = html(<BuffCard effect="benchBoost" name="Bench Boost" does="Your bench scores too" state={{ kind: "available" }} />);
  expect(out).toMatch(/<h3 class="buff-card__name"><span class="hint"[^>]*>Bench Boost/);
  expect(out).toContain('aria-label="Play Bench Boost"');
  expect(html(<BuffCard effect="benchBoost" name="Bench Boost" does="Your bench scores too" state={{ kind: "on" }} />)).toContain('aria-label="Cancel Bench Boost"');
});
