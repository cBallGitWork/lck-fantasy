// @vitest-environment node
import { expect, test } from "vitest";
import { CAPTAIN_MULTIPLIER } from "../../fixtures/competition";
import { hovers, html } from "../../testing/render";
import { PICK_TEAM_DATA, PICK_TEAM_STATES } from "./fixtures";
import { PickTeamView } from "./PickTeam";

// Pick Team's words and their hovers (spec/12, Words).
test("Pick Team's C and Flex carry their hover's line, in Rift view and Card view", () => {
  for (const state of [PICK_TEAM_STATES.rift, { ...PICK_TEAM_STATES.rift, view: "cards" as const }]) {
    const out = hovers(html(<PickTeamView data={PICK_TEAM_DATA} state={state} dispatch={() => {}} />));
    expect(out).toContainEqual(["C", `Scores ×${CAPTAIN_MULTIPLIER} this week`]);
    expect(out).toContainEqual(["Flex", "Any role"]);
  }
});
