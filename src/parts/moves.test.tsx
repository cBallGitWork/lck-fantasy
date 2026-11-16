// @vitest-environment node
import { expect, test } from "vitest";
import { html } from "../testing/render";
import { PriceMove, RankMove } from ".";

test("a price move is ▲ rise or ▼ fall to one decimal, said in words, nothing when it held", () => {
  expect(html(<PriceMove money={0.5} />)).toBe('<span class="rise" role="img" aria-label="up 0.5">0.5</span>');
  expect(html(<PriceMove money={-1} />)).toBe('<span class="fall" role="img" aria-label="down 1.0">1.0</span>');
  expect(html(<PriceMove money={0} />)).toBe("");
  expect(html(<PriceMove money={0.5} className="compare__move" />)).toContain('<span class="rise compare__move" role="img" aria-label="up 0.5">0.5</span>');
});

test("a rank move is rank-up or rank-down with its places marked and said in words", () => {
  expect(html(<RankMove move={6904} />)).toBe('<span class="rank-up" role="img" aria-label="up 6,904">6,904</span>');
  expect(html(<RankMove move={-1} />)).toBe('<span class="rank-down" role="img" aria-label="down 1">1</span>');
});

test("a held rank, or one with no move yet, is one rank-held —, never ▲ 0", () => {
  for (const move of [0, null, undefined]) expect(html(<RankMove move={move} />)).toBe('<span class="rank-held">—</span>');
});
