import { useState } from "react";
import { PRICE_WEEKS } from "./fixtures";
import { PatchUpdatePage } from "./PatchUpdatePage";

/** The week a step of ‹ or › reaches from `at`, or none past either end. */
export function stepWeek(at: number, step: -1 | 1, weekCount: number): number | undefined {
  const to = at + step;
  return to >= 0 && to < weekCount ? to : undefined;
}

/** Patch update on the made-up weeks, opening on the latest prices. */
export function PatchUpdateScreen() {
  const [at, setAt] = useState(PRICE_WEEKS.length - 1);
  const week = PRICE_WEEKS[at];
  if (!week) throw new Error(`Patch update has no week at ${at}`);
  const stepTo = (step: -1 | 1) => {
    const to = stepWeek(at, step, PRICE_WEEKS.length);
    return to === undefined ? undefined : () => setAt(to);
  };
  return <PatchUpdatePage week={week} onPrev={stepTo(-1)} onNext={stepTo(1)} />;
}
