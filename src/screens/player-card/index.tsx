import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { Modal, PageFrame, useAnnounce, useDevState } from "../../parts";
import { playerId } from "../../fixtures/competition";
import { compareGo, PATHS } from "../../paths";
import { markNews, type Mark } from "../../rift";
import type { CardMark, CardTab, PlayerCardData } from "./card";
import { CARD_FROM_PICK_TEAM, CARD_FROM_POINTS, CARD_WITH_NEWS, MARK_AT_PICK_TEAM } from "./fixtures";
import { PlayerCard } from "./PlayerCard";

/** The route: until the backend feeds it, the pictures' Faker, opened from Pick Team on History. `?state=week`, `fixtures` or `champs` opens those pictures, in dev. */
export function PlayerCardScreen() {
  const dev = useDevState<Parameters<typeof PlayerCardPage>[0]>({
    week: { card: CARD_FROM_POINTS, initialTab: "This week", openedFrom: "points" },
    fixtures: { card: CARD_WITH_NEWS, initialTab: "Fixtures" },
    champs: { initialTab: "Champions" },
  });
  return <PlayerCardPage {...dev} />;
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
  const announce = useAnnounce();
  const actions =
    openedFrom === "pickTeam"
      ? {
          mark,
          onMark: (next: Mark) => {
            if (next !== mark) announce(markNews(card.name, next));
            setMark(next);
          },
          onSwap: () => void navigate({ to: PATHS.pickTeam }),
          onTransferOut: () => void navigate({ to: PATHS.transfers }),
        }
      : undefined;
  return (
    <PageFrame screen="player-card" account={MANAGER.team}>
      <Modal kind="card" title={card.name} onClose={() => router.history.back()}>
        <PlayerCard card={card} actions={actions} compare={compareGo(playerId(card.name))} initialTab={initialTab} />
      </Modal>
    </PageFrame>
  );
}
