import { useState } from "react";
import type { SlotKey } from "../../rift";
import { PERFECT_WEEK3 } from "./fixtures";
import { PerfectGame } from "./PerfectGame";
import { RIFT_VIEW, type PerfectView } from "./types";

/**
 * The week's best team (docs/design/approved/perfect-game/), on made-up Week 3 until the backend
 * picks it. Rift view until Points' saved view is wired here; no one tapped until a tap.
 */
export function PerfectGameScreen() {
  const [view, setView] = useState<PerfectView>(RIFT_VIEW);
  const [selected, setSelected] = useState<SlotKey>();
  return <PerfectGame game={PERFECT_WEEK3} view={view} onView={setView} selected={selected} onSelect={setSelected} />;
}
