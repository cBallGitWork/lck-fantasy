import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { PageFrame, useDevState } from "../../parts";
import { PATHS } from "../../paths";
import { CompareSheet, HeadToHead } from "./HeadToHead";
import { CHOVY, COMPARE_PLAYERS, FAKER, KKOMA, RYU, SEARCH_ROWS, type ComparePlayer, type SearchRow } from "./fixtures";
import { PickSecond } from "./PickSecond";

/**
 * Compare (docs/design/approved/compare/): two players side by side, a card over the card it
 * opened from. Change › reopens the search; picking a player compares him; ✕ goes back to the
 * first player's card. The made-up Faker v Chovy until the backend feeds these props.
 */
export function ComparePage({
  left = FAKER,
  right = CHOVY,
  players = COMPARE_PLAYERS,
  rows = SEARCH_ROWS,
  onClose,
}: {
  left?: ComparePlayer;
  /** The second player; null opens on the search. */
  right?: ComparePlayer | null;
  /** The players Compare has lines for, by name. */
  players?: Record<string, ComparePlayer>;
  rows?: readonly SearchRow[];
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const [second, setSecond] = useState(right);
  const backToCard = () =>
    left.role === "coach"
      ? void navigate({ to: PATHS.coachCard, params: { coachId: left.id } })
      : void navigate({ to: PATHS.playerCard, params: { playerId: left.id } });
  return (
    <PageFrame screen="compare" active="pickTeam" account={MANAGER.team}>
      <CompareSheet left={left} right={second} onChange={() => setSecond(null)} onClose={onClose ?? backToCard}>
        {second ? (
          <HeadToHead left={left} right={second} />
        ) : (
          <PickSecond first={left} rows={rows} canPick={(name) => name in players} onPick={(name) => setSecond(players[name] ?? null)} />
        )}
      </CompareSheet>
    </PageFrame>
  );
}

/** The route: Faker v Chovy, from the fixture. `?state=pick` or `coaches` opens those pictures, in dev. */
export function CompareScreen() {
  return <ComparePage {...useDevState({ pick: { right: null }, coaches: { left: KKOMA, right: RYU } })} />;
}
