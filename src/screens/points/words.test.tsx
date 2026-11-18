// @vitest-environment node
import { expect, test } from "vitest";
import { CAPTAIN_MULTIPLIER } from "../../fixtures/competition";
import { hovers, html } from "../../testing/render";
import { POINTS_FIXTURE } from "./fixtures";
import { PointsPage } from "./PointsPage";

// Points' words and their hovers (spec/12, Words).
test("Points' C, Flex, tiers and Killer each carry their hover's line", () => {
  const out = hovers(html(<PointsPage data={POINTS_FIXTURE} open="Faker" />));
  expect(out).toContainEqual(["C", `Scores ×${CAPTAIN_MULTIPLIER} this week`]);
  expect(out).toContainEqual(["Flex", "Any role"]);
  expect(out).toContainEqual(["Emerald I", "Overall rank as a LoL tier"]);
  expect(out).toContainEqual(["Diamond IV", "Overall rank as a LoL tier"]);
  expect(out).toContainEqual(["Killer", "Top scorer you don't own"]);
  expect(out.map(([word]) => word)).not.toContain("Star");
});
