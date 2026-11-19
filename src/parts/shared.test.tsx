// @vitest-environment node
import { expect, test } from "vitest";
import { html } from "../testing/render";
import { captainHint, Columns, Hint, HINTS, Led, SectionHead, SeriesStrip, TierShield, WeekArrow } from ".";

test("a week arrow is a key: it links, steps, or sits off as a disabled key", () => {
  expect(html(<WeekArrow label="Previous week" go={{ to: "/points" }}>‹</WeekArrow>)).toMatch(/<a[^>]*class="week-arrow"[^>]*aria-label="Previous week"[^>]*>‹<\/a>/);
  expect(html(<WeekArrow label="Next week" onStep={() => {}}>›</WeekArrow>)).toBe('<button type="button" class="week-arrow" aria-label="Next week">›</button>');
  expect(html(<WeekArrow label="Next week">›</WeekArrow>)).toBe('<button type="button" class="week-arrow key-off" aria-label="Next week" disabled="">›</button>');
});

test("a hover is one line tied to its word, which a tap focuses; a key takes the focus itself", () => {
  const word = html(<Hint line={HINTS.killer}>Killer</Hint>);
  expect(word).toMatch(/^<span class="hint" tabindex="0" aria-describedby="([^"]+)">Killer<span class="hint__line" role="tooltip" id="\1">Top scorer you don&#x27;t own<\/span><\/span>$/);
  expect(html(<Hint line="One line" onKey><button type="button">Remake</button></Hint>)).toMatch(/^<span class="hint"><button/);
  expect(captainHint(1.5)).toBe("Scores ×1.5 this week");
});

test("columns hold the main then the side, with the page's own class", () => {
  expect(html(<Columns className="home__row"><p>main</p><p>side</p></Columns>)).toBe('<div class="columns home__row"><p>main</p><p>side</p></div>');
});

test("a section head is an h2 with its note, if any, in a small", () => {
  expect(html(<SectionHead note="Gen.G">GEN</SectionHead>)).toBe('<h2 class="section-head">GEN<small class="section-head__note quiet">Gen.G</small></h2>');
  expect(html(<SectionHead className="live__apart">The rest</SectionHead>)).toBe('<h2 class="section-head live__apart">The rest</h2>');
});

test("a series strip holds the last series with points, the rule, then the next with their length, the first in --text", () => {
  const out = html(
    <SeriesStrip
      past={[
        { week: 3, day: "Wed", opponent: "HLE", points: 12 },
        { week: 3, day: "Sat", opponent: "DK", points: 10, live: true },
      ]}
      next={[
        { week: 4, day: "Wed", opponent: "KT", bestOf: 3 },
        { week: 4, day: "Sat", opponent: "GEN", bestOf: 3 },
      ]}
    />,
  );
  expect(out).toMatch(/^<div class="series-strip">/);
  expect(out).toContain('<span class="series-strip__when quiet">W3 · Wed</span><b class="series-strip__points num">12</b><span class="series-strip__when quiet">v HLE</span>');
  expect(out).toContain('<b class="series-strip__points num">10<span class="tag tag--live">Live</span></b>');
  expect(out.indexOf("v DK")).toBeLessThan(out.indexOf('<span class="series-strip__now"></span>'));
  expect(out).toContain('W4 · Wed · Bo3</span><span class="series-strip__next num series-strip__next--first">v KT</span>');
  expect(out).toContain('<span class="series-strip__next num">v GEN</span>');
});

test("the tier shield draws its own outlined body and band, sized by the page's class, and no text", () => {
  const out = html(<TierShield className="home__shield" />);
  expect(out).toContain('<svg class="tier-shield home__shield" viewBox="0 0 40 46" aria-hidden="true">');
  expect(out).toContain('class="tier-shield__body"');
  expect(out).toContain('<path class="tier-shield__band" d="M5 15 H35"></path>');
  expect(out).not.toContain("<text");
});

test("the LED panel is one part, its line as given; big for the picker's preview", () => {
  expect(html(<Led>Sell your bot laner</Led>)).toBe('<div class="led">Sell your bot laner</div>');
  expect(html(<Led big>Sell your bot laner</Led>)).toBe('<div class="led led--big">Sell your bot laner</div>');
});
