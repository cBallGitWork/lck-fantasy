import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import season from "../../../data/lck/season-2027.json";
import { SPEC_TIER_CUTOFFS } from "../../../convex/leagues/fixtures";
import { SPEC_COACH_TABLE, SPEC_PLAYER_TABLE, SPEC_SERIES_RULES } from "../../../convex/scoring/fixtures";
import { browserZone } from "../../parts";
import { PATHS, RULES_HASH } from "../../paths";
import type { HelpData } from "./facts";
import { HelpPage } from "./HelpPage";
import "./help.css";

/**
 * The scoring tables and tier cut-offs the game's own tests score with (spec/05, spec/08), and the
 * split's deadlines from the season's data, until the backend serves the competition's live ones.
 */
export const HELP_DATA: Omit<HelpData, "zone"> = {
  player: SPEC_PLAYER_TABLE,
  coach: SPEC_COACH_TABLE,
  series: SPEC_SERIES_RULES,
  tiers: SPEC_TIER_CUTOFFS,
  deadlines: season.gameweeks.map((gw) => ({ week: gw.number, deadline: gw.deadline })),
};

/** Help's route: the hash picks the guide page or the rule, which is brought into view. */
export function HelpScreen() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const navigate = useNavigate();
  useEffect(() => {
    const target = hash ? document.getElementById(hash) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [hash]);
  return (
    <HelpPage
      hash={hash}
      data={{ ...HELP_DATA, zone: browserZone() }}
      onTab={(tab) => void navigate({ to: PATHS.help, hash: tab === "Rules" ? RULES_HASH : "" })}
    />
  );
}
