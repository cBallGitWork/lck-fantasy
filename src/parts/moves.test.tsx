// @vitest-environment node
import { expect, test } from "vitest";
import { html } from "../testing/render";
import { PriceMove, RankMove } from ".";

test("a price move is ▲ rise or ▼ fall to one decimal, nothing when it held", () => {
  expect(html(<PriceMove eok={0.5} />)).toBe('<span class="rise">0.5</span>');
  expect(html(<PriceMove eok={-1} />)).toBe('<span class="fall">1.0</span>');
  expect(html(<PriceMove eok={0} />)).toBe("");
});

test("a rank move is rank-up or rank-down with its places marked", () => {
  expect(html(<RankMove move={6904} />)).toBe('<span class="rank-up">6,904</span>');
  expect(html(<RankMove move={-2} />)).toBe('<span class="rank-down">2</span>');
});
