// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MANAGER } from "../../fixtures/week3";
import { PATHS, pathTo, seriesGo } from "../../paths";
import { expectInOrder, html, htmlAt, plain, text } from "../../testing/render";
import { WORDS } from "./words";
import { SERIES_BY_ID, SERIES_VIEWS } from "./fixtures";
import { SeriesFinal, SeriesLive, SeriesNext } from "./SeriesPage";

const account = MANAGER.team;

/** The rows of the n-th table, as text. */
const rows = (out: string, n: number) =>
  (out.split("<table")[n + 1] ?? "")
    .split("</table>")[0]!
    .split("<tr")
    .slice(1)
    .map((row) => plain(`<tr${row}`));

/** Whether the name's row carries your-player dot. */
const dotted = (out: string, name: string) => ((out.split(`>${name}</b>`)[1] ?? "").split("</tr>")[0] ?? "").includes("me-dot");

describe("final, 2–0 (1440.png)", () => {
  const view = <SeriesFinal series={SERIES_VIEWS.final.series} account={account} />;
  const out = html(view);
  const words = text(view);

  test("is the series screen, under LCK", () => {
    expect(out).toContain('data-screen="series"');
    expect(out).toMatch(/aria-current="page"[^>]*>LCK/);
    expect(out).toContain('href="/lck"');
  });

  test("shows the back link, scorebug, the final line, then both grids, in order", () => {
    expectInOrder(words, [
      "‹ LCK",
      "T1",
      "5–1",
      "2–0",
      "3–3 · Dplus KIA",
      "DK",
      "Final",
      "Bo3 · Split 1 · Week 3 · Sat 16 Jan",
      "10:30",
      "19:30 KST",
      "T1",
      "G1 W · 31:42 · VOD ↗",
      "G2 W · 27:10 · VOD ↗",
      "Series",
      "DK",
      "G1 L",
      "G2 L",
      "Series",
    ]);
    expect(words).not.toContain("Watch");
  });

  test("names each team once and gives each game's length and VOD once", () => {
    expect(words.match(/Dplus KIA/g)).toHaveLength(1);
    expect(words.match(/31:42/g)).toHaveLength(1);
    expect(words.match(/VOD/g)).toHaveLength(2);
  });

  test("drops the loser's code to plain weight", () => {
    expect(out).toMatch(/series__bug-team series__bug-team--away series__bug-team--lost/);
  });

  test("each player in role order with his games, POG and best-2 total, then the coach", () => {
    expect(rows(out, 0).slice(1)).toEqual([
      "TopDoran최현준K'Sante2/1/73Rumble3/0/647",
      "JungleOner문현준Viego3/2/93Xin Zhao2/2/836",
      "MidFaker이상혁Orianna5/2/8POG4Sylas7/0/6POG610",
      "BotPeyz김수환Kalista6/1/54Varus5/0/748",
      "SupportKeria류민석Rell0/3/122Nautilus1/2/1335",
      "CoachkkOma김정균First tower · Most barons2First tower · Most drakes · Most barons38W +3",
    ]);
    expect(rows(out, 1).at(-1)).toBe("CoachcvMax김대호—0—0-1L −1");
  });

  test("dots your players and links each to his card", () => {
    expect(dotted(out, "Faker")).toBe(true);
    expect(dotted(out, "kkOma")).toBe(true);
    expect(dotted(out, "Doran")).toBe(false);
    expect(out).toContain('href="/player/faker"');
    expect(out).toContain('href="/coach/kkoma"');
  });

  test("boxes every game of a two-game series", () => {
    expect(out).not.toContain("series__dropped");
  });
});

describe("final, 2–1 (1440-21.png)", () => {
  const view = <SeriesFinal series={SERIES_VIEWS.final21.series} account={account} />;
  const out = html(view);

  test("names the teams in the scorebug and the three games", () => {
    expectInOrder(text(view), ["GEN", "Gen.G · 5–1", "2–1", "4–2 · Hanwha Life", "HLE", "Final", "08:00", "17:00 KST", "GEN", "G1 W · 29:05", "G2 L · 34:48", "G3 W · 26:31", "HLE", "G1 L", "G2 W", "G3 L"]);
  });

  test("greys and unboxes a dropped game", () => {
    const kiin = (out.split("Kiin")[1] ?? "").split("</tr>")[0]!;
    expect(kiin).toMatch(/<td class="series__dropped">.*Jax.*>-1<\/span>/);
    expect(kiin).toContain('class="counted">3<');
  });

  test("shows a dash where a player sat out, and the sub on his own row", () => {
    expect(rows(out, 1).slice(1)).toEqual([
      "TopZeus최우제Aatrox2/2/42Renekton5/1/5POG5Jayce1/2/207",
      "JungleKanavi서진혁Xin Zhao1/4/3-1Viego4/2/83Maokai1/6/3-22",
      "MidZeka김건우Taliyah2/3/2-1Ahri5/1/73—2",
      "Mid · subKael김태율——Azir2/4/3-1-1",
      "BotGumayusi이민형Ezreal1/3/3-1Varus5/1/63Zeri2/4/2-12",
      "SupportDelight유환중Rell0/2/71Leona1/1/122Braum0/3/824",
      "CoachHomme윤성영—0First tower · Most drakes · Most barons3Most drakes13L −1",
    ]);
  });
});

describe("live (1440-live.png)", () => {
  const view = <SeriesLive series={SERIES_VIEWS.live.series} account={account} />;
  const out = html(view);

  test("shows the score so far, Live and Not final, and Watch ›", () => {
    expectInOrder(text(view), ["T1", "4–1", "1–0", "3–2 · Dplus KIA", "DK", "Live", "Not final", "Solo kills, steals at final", "Bo3 · Split 1 · Week 3 · Sat 16 Jan", "10:30", "19:30 KST", "Watch ›", "G1 W · 31:42 · VOD ↗", "G2 14:20", "Series", "DK", "G1 L", "G2", "Series"]);
    expect(out).toContain('href="/live"');
    expect(out.match(/tag--live/g)).toHaveLength(1);
    expect(text(view).match(/14:20/g)).toHaveLength(1);
  });

  test("drops neither team's code while live, and adds no series result", () => {
    expect(out).not.toContain("series__bug-team--lost");
    expect(text(view)).not.toMatch(/W \+3|L −1/);
  });

  test("shows the live game's lines", () => {
    expect(rows(out, 1)[1]).toBe("TopSiwoo전시우K'Sante2/2/42Rumble2/1/113");
  });
});

describe("before it starts (1440-next.png)", () => {
  const view = <SeriesNext series={SERIES_VIEWS.next.series} account={account} />;
  const out = html(view);

  test("shows v, the format tag, the day and time, Watch ›, then both rosters", () => {
    expectInOrder(text(view), ["HLE", "Hanwha Life · 4–2", "v", "3–3 · Dplus KIA", "DK", "Bo3", "Split 1 · Week 4 · Wed 20 Jan", "08:00", "17:00 KST", "Watch ›", "HLE", "Zeus", "DK"]);
    expect(text(view).match(/Hanwha Life/g)).toHaveLength(1);
  });

  test("lists each roster in role order, coach last", () => {
    expect(rows(out, 0)).toEqual(["TopZeus최우제", "JungleKanavi서진혁", "MidZeka김건우", "BotGumayusi이민형", "SupportDelight유환중", "CoachHomme윤성영"]);
    expect(rows(out, 1).at(-1)).toBe("CoachcvMax김대호");
    expect(dotted(out, "Delight")).toBe(true);
  });
});

test("a link to a series that doesn't exist shows No such series and LCK hub › (spec/12, Series page)", async () => {
  const out = await htmlAt(pathTo(seriesGo("w99-sun-9")));
  expect(out).toContain('data-screen="series"');
  expectInOrder(plain(out), [WORDS.noSuchSeries, `${WORDS.hub} ›`]);
  expect(out).toMatch(new RegExp(`href="${PATHS.hub}"[^>]*>${WORDS.hub} ›`));
});

test("each series a link opens is in the fixture, at the hub's moment", () => {
  expect(Object.keys(SERIES_BY_ID).sort()).toEqual(["w3-sat-1", "w3-sat-2", "w4-wed-1"]);
  expect(SERIES_BY_ID["w3-sat-2"]?.state).toBe("final");
});
