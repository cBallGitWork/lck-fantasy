import { useState } from "react";
import { browserZone, timeIn, useDevState } from "../../parts";
import { TRANSFERS_PICTURE } from "./fixtures";
import { confirmTransfers, type Confirm, type SquadPlayer, type TransferRules } from "./plan";
import { TransfersPage, type TransfersPageProps } from "./TransfersPage";

/** What a confirm changes: the nine, the bank and free transfers, and the week's confirms. */
type Week = { squad: SquadPlayer[]; rules: TransferRules; confirms: Confirm[] };

/**
 * Transfers, on the picture's made-up week until the backend feeds its props. A confirm changes the squad
 * and heads Confirmed · Week 4 until a reload; Undo puts back the week before it. `?state=confirm` opens
 * the confirm sheet, in dev.
 */
export function TransfersScreen() {
  const reviewing = useDevState({ confirm: true });
  const { squad, rules, confirms } = TRANSFERS_PICTURE;
  const [week, setWeek] = useState<Week>({ squad, rules, confirms });
  /** The week before each confirm made here, by its id. */
  const [before, setBefore] = useState<Record<string, Week>>({});

  const onConfirm: TransfersPageProps["onConfirm"] = (transfers, lineup) => {
    const after = confirmTransfers(week.squad, TRANSFERS_PICTURE.players, week.rules, transfers, lineup);
    const confirm: Confirm = { id: `c${week.confirms.length + 1}`, ...timeIn(new Date().toISOString(), browserZone()), moves: after.moves, hit: after.hit };
    setBefore({ ...before, [confirm.id]: week });
    setWeek({ squad: after.squad, rules: after.rules, confirms: [confirm, ...week.confirms] });
  };
  const onUndo = (id: string) => {
    const prior = before[id];
    if (prior) setWeek(prior);
  };

  return <TransfersPage {...TRANSFERS_PICTURE} {...week} reviewing={reviewing} onConfirm={onConfirm} onUndo={onUndo} />;
}
