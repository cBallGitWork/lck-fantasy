import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { Modal, PageFrame } from "../../parts";
import { PATHS } from "../../paths";
import type { CardMark, CardTab, PlayerCardData } from "./card";
import { CARD_FROM_PICK_TEAM, MARK_AT_PICK_TEAM } from "./fixtures";
import { PlayerCard } from "./PlayerCard";

/** The route: until the backend feeds it, the pictures' Faker, opened from Pick Team on History. */
export function PlayerCardScreen() {
  return <PlayerCardPage />;
}

/** The full player card over the page that opened it (docs/design/approved/player-card/). */
export function PlayerCardPage({
  card = CARD_FROM_PICK_TEAM,
  initialTab = "History",
  openedFrom = "pickTeam",
  initialMark = MARK_AT_PICK_TEAM,
}: {
  card?: PlayerCardData;
  initialTab?: CardTab;
  /** From Pick Team the card carries its keys; from Points only Compare. */
  openedFrom?: "pickTeam" | "points";
  initialMark?: CardMark;
}) {
  const router = useRouter();
  const navigate = useNavigate();
  const [mark, setMark] = useState<CardMark>(initialMark);
  const actions =
    openedFrom === "pickTeam"
      ? {
          mark,
          onMark: setMark,
          onSwap: () => void navigate({ to: PATHS.pickTeam }),
          onTransferOut: () => void navigate({ to: PATHS.transfers }),
        }
      : undefined;
  return (
    <PageFrame screen="player-card" account={MANAGER.team}>
      <Modal kind="card" title={card.name} onClose={() => router.history.back()}>
        <PlayerCard card={card} actions={actions} compare={{ to: PATHS.compare }} initialTab={initialTab} />
      </Modal>
    </PageFrame>
  );
}
