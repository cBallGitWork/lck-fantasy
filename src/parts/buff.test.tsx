// @vitest-environment node
import { expect, test } from "vitest";
import { html, text } from "../testing/render";
import { BuffCard, type BuffState } from ".";

test("a buff shows its name, what it does as its hover, its state and its key, never a count (plate.md, A buff)", () => {
  const buff = (state: BuffState) => <BuffCard effect="benchBoost" name="Bench Boost" does="Your bench scores too" state={state} />;
  expect(text(buff({ kind: "available" }))).toBe("Bench BoostAvailablePlay");
  expect(text(buff({ kind: "on" }))).toBe("Bench BoostOn this weekCancel");
  expect(text(buff({ kind: "unavailable" }))).toBe("Bench BoostUnavailable");
  expect(text(buff({ kind: "played", week: 3 }))).toBe("Bench BoostPlayed Week 3");
  expect(html(buff({ kind: "available" }))).toMatch(/class="buff-icon buff-card__icon".*role="tooltip"[^>]*>Your bench scores too</);
});
