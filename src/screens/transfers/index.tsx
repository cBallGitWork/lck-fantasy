import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { browserZone, rememberedView, rememberView, timeIn, useDevState, VIEW_KEYS } from "../../parts";
import { SELL_SEARCH } from "../../paths";
import { TRANSFERS_PICTURE } from "./fixtures";
import { confirmTransfers, EMPTY_PLAN, remove, SQUAD_SLOTS, type Confirm, type SquadPlayer, type TransferRules } from "./plan";
import { TRANSFER_VIEWS, TransfersPage, type TransfersPageProps, type View } from "./TransfersPage";

/** Transfers keeps its own view, apart from the one Pick Team, Points and Perfect game share (spec/12). */
const keepView = (view: View) => rememberView(VIEW_KEYS.transfers, view);

/** What a confirm changes: the nine, the bank and free transfers, and the week's confirms. */
type Week = { squad: SquadPlayer[]; rules: TransferRules; confirms: Confirm[] };

/**
 * Transfers, on the picture's made-up week until the backend feeds its props. A confirm changes the squad
 * and heads Confirmed · Week 4 until a reload; Undo puts back the week before it. `?sell=coach` opens
 * with that slot sold, as the coach card's Transfer out does. `?state=confirm` opens the confirm sheet, in dev.
 */
export function TransfersScreen() {
  const reviewing = useDevState({ confirm: true });
  const search: Record<string, unknown> = useSearch({ strict: false });
  const { squad, rules, confirms } = TRANSFERS_PICTURE;
  const selling = SQUAD_SLOTS.find((slot) => slot === search[SELL_SEARCH]);
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

  const initialPlan = selling ? remove(squad, EMPTY_PLAN, selling).plan : TRANSFERS_PICTURE.initialPlan;
  return (
    <TransfersPage
      {...TRANSFERS_PICTURE}
      {...week}
      initialPlan={initialPlan}
      view={rememberedView(VIEW_KEYS.transfers, TRANSFER_VIEWS)}
      onViewChange={keepView}
      reviewing={reviewing}
      onConfirm={onConfirm}
      onUndo={onUndo}
    />
  );
}
