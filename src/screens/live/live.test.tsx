// @vitest-environment node
import { describe, expect, test } from "vitest";
import { html, text } from "../../testing/render";
import { DEFAULT_STREAM, IDLE_STREAMS, LIVE_DOWN, LIVE_IDLE, LIVE_NOW, LIVE_STREAMS } from "./fixtures";
import { LiveDown, LiveIdle, LiveNow } from "./Live";

const picker = { streams: LIVE_STREAMS, picked: DEFAULT_STREAM, onPick: () => {} };
const idlePicker = { ...picker, streams: IDLE_STREAMS };

/** Each piece of text appears, in this order. */
function inOrder(out: string, pieces: string[]) {
  let at = 0;
  for (const piece of pieces) {
    const found = out.indexOf(piece, at);
    expect(found, `"${piece}" after position ${at}`).toBeGreaterThanOrEqual(0);
    at = found + piece.length;
  }
}

const CHIPS = [
  "LCK · EnglishTwitch",
  "LCK · EnglishYouTube",
  "LCK · 한국어YouTube",
  "Caedrel · EnglishTwitch",
  "LCK · Tiếng ViệtYouTube",
  "Kameto · FrançaisTwitch",
];
const REST = ["Rest of your week", "ZeusHLE14", "CanyonGEN14", "RulerGENV14", "DelightHLE9", "Points ›"];

describe("a series live", () => {
  const out = text(<LiveNow {...LIVE_NOW} picker={picker} />);
  const page = html(<LiveNow {...LIVE_NOW} picker={picker} />);

  test("holds the picture's content in its order", () => {
    inOrder(out, [
      "Live",
      "stream",
      "T1", "1–0", "DK", "Live", "Game 2", "Bo3 · LCK Cup Week 3",
      ...CHIPS,
      "Your week", "Not final", "94", "Average 74", "Highest 121›",
      "T1 v DK",
      "FakerT1C", "G1 4 · G2 1", "Live", "3/0/2", "25",
      "SiwooDK", "G1 2 · G2 1", "Live", "1/0/1", "8",
      "kkOmaT1", "G1 2 · G2 0", "Live", "10",
      ...REST,
    ]);
  });

  test("fills the picked stream and dashes those not live", () => {
    expect(page.match(/live__chip--on/g)).toHaveLength(1);
    expect(page.match(/live__chip--off/g)).toHaveLength(2);
    const other = html(<LiveNow {...LIVE_NOW} picker={{ ...picker, picked: "caedrel" }} />);
    expect(other).toMatch(/live__chip--on"[^>]*>Caedrel/);
  });

  test("links each player to his card and Points › to Points", () => {
    expect(page).toContain('href="/player/faker"');
    expect(page).toContain('href="/coach/kkoma"');
    expect(page).toContain('href="/player/delight"');
    expect(page).toContain('href="/points"');
  });
});

describe("the live feed down", () => {
  const out = text(<LiveDown {...LIVE_DOWN} picker={picker} />);

  test("says so first, then the total without the live series and dashes for its games", () => {
    inOrder(out, [
      "T1", "1–0", "DK", "Game 2",
      ...CHIPS,
      "Live points down", "Final points follow",
      "Your week", "Not final", "82", "Average 66", "Highest 118›",
      "T1 v DK",
      "FakerT1C", "G1 — · G2 —", "18",
      "SiwooDK", "G1 — · G2 —", "5",
      "kkOmaT1", "G1 — · G2 —", "8",
      ...REST,
    ]);
    expect(out).not.toContain("3/0/2");
  });
});

describe("nothing live", () => {
  const out = text(<LiveIdle {...LIVE_IDLE} picker={idlePicker} />);
  const page = html(<LiveIdle {...LIVE_IDLE} picker={idlePicker} />);

  test("shows the next series and its countdown, the last series final, and the week final", () => {
    inOrder(out, [
      "Next · Sunday · LCK Cup Week 3 · Bo3", "KRXvBRO", "08:00", "17:00 KST", "1h20m",
      "T1", "2–0", "DK", "Final", "Last series", "Saturday · Bo3 · LCK Cup Week 3",
      ...CHIPS,
      "Your week", "109", "Average 79", "Highest 128›",
      "T1 v DK",
      "FakerT1C", "G1 4 · G2 6", "33",
      "SiwooDK", "G1 2 · G2 2", "9",
      "kkOmaT1", "G1 2 · G2 3 · won +3", "16",
      ...REST,
    ]);
    expect(out).not.toContain("Not final");
    expect(out).not.toContain("stream");
  });

  test("greys every chip", () => {
    expect(page).not.toContain("live__chip--on");
    expect(page.match(/live__chip--off/g)).toHaveLength(LIVE_STREAMS.length);
  });
});
