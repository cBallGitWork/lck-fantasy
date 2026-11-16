import { useState } from "react";
import { useDevState } from "../../parts";
import type { SlotKey } from "../../rift";
import { PERFECT_WEEK3 } from "./fixtures";
import { PerfectGame } from "./PerfectGame";
import { RIFT_VIEW, VIEWS, type PerfectView } from "./types";

/**
 * The week's best team (docs/design/approved/perfect-game/), on made-up Week 3 until the backend
 * picks it. Rift view until Points' saved view is wired here; no one tapped until a tap.
 * `?state=rift` (Faker tapped) or `card` opens those pictures, in dev.
 */
export function PerfectGameScreen() {
  const dev = useDevState<{ view: PerfectView; selected?: SlotKey }>({ rift: { view: RIFT_VIEW, selected: "mid" }, card: { view: VIEWS[1] } });
  const [view, setView] = useState<PerfectView>(dev?.view ?? RIFT_VIEW);
  const [selected, setSelected] = useState<SlotKey | undefined>(dev?.selected);
  return <PerfectGame game={PERFECT_WEEK3} view={view} onView={setView} selected={selected} onSelect={setSelected} />;
}
