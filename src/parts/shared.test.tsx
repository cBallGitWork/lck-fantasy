// @vitest-environment node
import { expect, test } from "vitest";
import { html } from "../testing/render";
import { Columns, SectionHead, SeriesStrip, TierShield, WeekArrow } from ".";

test("a week arrow links, steps, or sits off as a disabled key or a hidden glyph", () => {
  expect(html(<WeekArrow label="Week before" go={{ to: "/points" }}>‹</WeekArrow>)).toMatch(/<a[^>]*class="week-arrow"[^>]*aria-label="Week before"[^>]*>‹<\/a>/);
  expect(html(<WeekArrow label="Week after" onStep={() => {}}>›</WeekArrow>)).toBe('<button type="button" class="week-arrow" aria-label="Week after">›</button>');
  expect(html(<WeekArrow label="Week after" button>›</WeekArrow>)).toBe('<button type="button" class="week-arrow week-arrow--off" aria-label="Week after" disabled="">›</button>');
  expect(html(<WeekArrow label="Week after">›</WeekArrow>)).toBe('<span class="week-arrow week-arrow--off" aria-hidden="true">›</span>');
});

test("columns hold the main then the side, the side first when asked, with the page's own class", () => {
  expect(html(<Columns className="home__row"><p>main</p><p>side</p></Columns>)).toBe('<div class="columns home__row"><p>main</p><p>side</p></div>');
  expect(html(<Columns sideFirst><p>side</p></Columns>)).toBe('<div class="columns columns--side-first"><p>side</p></div>');
});

test("a section head is an h2 with its note, if any, in a small", () => {
  expect(html(<SectionHead note="Gen.G">GEN</SectionHead>)).toBe('<h2 class="section-head">GEN<small class="section-head__note">Gen.G</small></h2>');
  expect(html(<SectionHead className="live__apart">The rest</SectionHead>)).toBe('<h2 class="section-head live__apart">The rest</h2>');
});

test("a series strip holds the last series with points, the rule, then the next with their length, the first in ink", () => {
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
  expect(out).toContain('<span class="series-strip__when">W3 · Wed</span><b class="series-strip__points num">12</b><span class="series-strip__when">v HLE</span>');
  expect(out).toContain('<b class="series-strip__points num">10<span class="tag tag--live">Live</span></b>');
  expect(out.indexOf("v DK")).toBeLessThan(out.indexOf('<span class="series-strip__now"></span>'));
  expect(out).toContain('W4 · Wed · Bo3</span><span class="series-strip__next num series-strip__next--first">v KT</span>');
  expect(out).toContain('<span class="series-strip__next num">v GEN</span>');
});

test("the tier shield draws its body, band and division under the page's class", () => {
  const out = html(<TierShield className="home__shield" />);
  expect(out).toContain('<svg class="home__shield" viewBox="0 0 40 46" aria-hidden="true">');
  expect(out).toContain('class="home__shield-body"');
  expect(out).toContain('<path class="home__shield-band" d="M5 15 H35"></path>');
  expect(out).not.toContain("<text");
});
