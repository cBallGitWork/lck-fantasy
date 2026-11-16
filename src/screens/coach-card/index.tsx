import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { Modal, PageFrame, useDevState } from "../../parts";
import { PATHS } from "../../paths";
import { CoachCard } from "./CoachCard";
import "./CoachCard.css";
import { FROM_PICK_TEAM, FROM_POINTS } from "./fixtures";
import type { CoachCardData, CoachFrom, CoachTab } from "./types";

/** The tab each opening starts on, as the picture draws it: History from Pick Team, This week from Points. */
export const FIRST_TAB: Record<CoachFrom, CoachTab> = { pickTeam: "History", points: "This week" };

/** Where ✕ goes back to. */
const OPENER = { pickTeam: PATHS.pickTeam, points: PATHS.points } as const;

/** The coach card as a page: the card over the page that opened it, its tabs working on the data. */
export function CoachCardPage({
  data,
  from,
  initialTab = FIRST_TAB[from],
  onClose,
  onTransferOut,
}: {
  data: CoachCardData;
  from: CoachFrom;
  initialTab?: CoachTab;
  onClose: () => void;
  onTransferOut?: () => void;
}) {
  const [tab, setTab] = useState<CoachTab>(initialTab);
  return (
    <PageFrame screen="coach-card" active={from} account={MANAGER.team}>
      <Modal kind="card" title={`${data.head.name}, coach`} onClose={onClose}>
        <CoachCard data={data} from={from} tab={tab} onTab={setTab} onTransferOut={onTransferOut} />
      </Modal>
    </PageFrame>
  );
}

/** The coach card route, on Week 3's made-up data until the backend feeds it. `?from=points` opens it as Points does; in dev, `?state=roster` on Roster. */
export function CoachCardScreen() {
  const search: { from?: unknown } = useSearch({ strict: false });
  const from: CoachFrom = search.from === "points" ? "points" : "pickTeam";
  const navigate = useNavigate();
  return (
    <CoachCardPage
      data={from === "points" ? FROM_POINTS : FROM_PICK_TEAM}
      from={from}
      initialTab={useDevState<CoachTab>({ roster: "Roster" })}
      onClose={() => void navigate({ to: OPENER[from] })}
    />
  );
}
