import { useState } from "react";
import { useDevState } from "../../parts";
import { CARD_VIEW, RIFT_VIEW, type BoardView, type SlotKey } from "../../rift";
import { PERFECT_WEEK3 } from "./fixtures";
import { PerfectGame } from "./PerfectGame";

/**
 * The week's best team (docs/design/approved/perfect-game/), on made-up Week 3 until the backend
 * picks it. Rift view until Points' saved view is wired here; no one tapped until a tap.
 * `?state=rift` (Faker tapped) or `card` opens those pictures, in dev.
 */
export function PerfectGameScreen() {
  const dev = useDevState<{ view: BoardView; selected?: SlotKey }>({ rift: { view: RIFT_VIEW, selected: "mid" }, card: { view: CARD_VIEW } });
  const [view, setView] = useState<BoardView>(dev?.view ?? RIFT_VIEW);
  const [selected, setSelected] = useState<SlotKey | undefined>(dev?.selected);
  return <PerfectGame game={PERFECT_WEEK3} view={view} onView={setView} selected={selected} onSelect={setSelected} />;
}
