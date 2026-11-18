import { useState } from "react";
import { helpGo, PRICES_RULE } from "../../paths";
import { PRICE_WEEKS } from "./fixtures";
import { PriceChangesPage } from "./PriceChangesPage";

/** The week a step of ‹ or › reaches from `at`, or none past either end. */
export function stepWeek(at: number, step: -1 | 1, weekCount: number): number | undefined {
  const to = at + step;
  return to >= 0 && to < weekCount ? to : undefined;
}

/** Price changes on the made-up weeks, opening on the latest prices. */
export function PriceChangesScreen() {
  const [at, setAt] = useState(PRICE_WEEKS.length - 1);
  const week = PRICE_WEEKS[at];
  if (!week) throw new Error(`Price changes has no week at ${at}`);
  const stepTo = (step: -1 | 1) => {
    const to = stepWeek(at, step, PRICE_WEEKS.length);
    return to === undefined ? undefined : () => setAt(to);
  };
  return <PriceChangesPage week={week} onPrev={stepTo(-1)} onNext={stepTo(1)} howPricesMove={helpGo(PRICES_RULE)} />;
}
