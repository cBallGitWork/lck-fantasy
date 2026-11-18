import { Navigate, redirect, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { PageFrame, useDevState } from "../../parts";
import { PATHS } from "../../paths";
import { CompareSheet, HeadToHead } from "./HeadToHead";
import { COMPARE_PLAYERS, FAKER, fixtureSecond, SEARCH_ROWS, type ComparePlayer, type SearchRow } from "./fixtures";
import { PickSecond } from "./PickSecond";

/**
 * Compare (docs/design/approved/compare/): two players side by side, a card over the card it
 * opened from. Change › reopens the search; picking a player compares him; ✕ goes back to the
 * first player's card. The made-up Faker v Chovy until the backend feeds these props.
 */
export function ComparePage({
  left = FAKER,
  right = fixtureSecond(left),
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

/** The first player Compare has lines for, by id; none for a bare /compare or a player it has no lines for. */
const firstPlayer = (id: string | undefined): ComparePlayer | undefined => Object.values(COMPARE_PLAYERS).find((p) => p.id === id);

/** Before Compare loads: with no player, it goes to Stats (spec/12, Compare). */
export function toStatsWithNoPlayer(playerId: string | undefined): void {
  if (!firstPlayer(playerId)) throw redirect({ to: PATHS.stats });
}

/** The route `/compare/$playerId`: him v the fixture's second player (`/compare/kkoma` is kkOma v Ryu). `?state=pick` opens the search, in dev. */
export function CompareScreen() {
  const { playerId } = useParams({ strict: false });
  const dev = useDevState({ pick: { right: null } });
  const left = firstPlayer(playerId);
  if (!left) return <Navigate to={PATHS.stats} replace />;
  return <ComparePage left={left} {...dev} />;
}
