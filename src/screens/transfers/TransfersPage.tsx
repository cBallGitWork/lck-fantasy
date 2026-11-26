import { useState } from "react";
import { Deadline, PageFrame, PageHead, Placeholder, SponsorNote, useAnnounce, ViewToggle } from "../../parts";
import { RIFT_VIEW, type SquadSlot } from "../../rift";
import type { CardFacts } from "./card";
import { ConfirmSheet } from "./ConfirmSheet";
import { Confirmed } from "./Confirmed";
import { byRole, lineupIds, type SlotHolder } from "./lineup";
import {
  add,
  ALL,
  bankNow,
  EMPTY_PLAN,
  freeLeft,
  freeUsed,
  hitOf,
  inSlot,
  moves,
  outOf,
  pendingHit,
  remove,
  restore,
  reviewBlock,
  roleFilterFor,
  slotHolding,
  transfersMade,
  type Confirm,
  type Fixture,
  type ListFilters,
  type ListPlayer,
  type Plan,
  type SquadPlayer,
  type Step,
  type TransferRules,
} from "./plan";
import { PlayerList } from "./PlayerList";
import { RiftSquad } from "./RiftSquad";
import { SquadList } from "./SquadList";
import { TransferCard } from "./TransferCard";
import "./transfers.css";
import { WORDS } from "./words";
import { YourTransfers } from "./YourTransfers";

/** Transfers' two views: the nine on the Rift, or listed by role (Craig, 16 Nov 2026). */
export const TRANSFER_VIEWS = [RIFT_VIEW, WORDS.listView] as const;
export type View = (typeof TRANSFER_VIEWS)[number];

export interface TransfersPageProps {
  /** The account menu's team name. */
  account: string;
  competition: string;
  /** `Week 4`. */
  week: string;
  /** The last week whose points the List view shows. */
  lastWeek: number;
  deadline: { local: string; countdown: string };
  squad: SquadPlayer[];
  players: ListPlayer[];
  rules: TransferRules;
  /** This week's confirms, newest first. */
  confirms: Confirm[];
  /** Each team's opponents this week. */
  fixtures: Record<string, Fixture[]>;
  /** The teams the Team filter offers. */
  teams: string[];
  /** Each person's card figures, by id. */
  cards: Record<string, CardFacts>;
  initialPlan?: Plan;
  /** The manager's last choice; Rift view on his first visit (spec/12). */
  view?: View;
  onViewChange?: (view: View) => void;
  /** Opens on the confirm sheet. */
  reviewing?: boolean;
  /** Each transfer by id, and the nine after them, arranged by role. */
  onConfirm?: (transfers: { out: string; in: string }[], lineup: Record<SquadSlot, string>) => void;
  onUndo?: (confirmId: string) => void;
}

/** Whose card shows before any tap: the latest bought, else the player just sold, else no one. */
function firstShown(squad: SquadPlayer[], plan: Plan): string | null {
  const bought = moves(squad, plan).filter((m) => m.in !== null);
  return bought.at(-1)?.in?.id ?? (plan.replacing ? outOf(squad, plan.replacing).id : null);
}

/**
 * Transfers (docs/design/approved/transfers/): the title line with the week, the deadline and the views;
 * the Rift with all nine by role (or List view's table) and beside it Your transfers and Confirmed; the
 * tapped player's card under both; the player list in the side column. The main column stays on screen
 * while the list scrolls.
 */
export function TransfersPage(props: TransfersPageProps) {
  const { squad, rules, fixtures } = props;
  const announce = useAnnounce();
  const [plan, setPlan] = useState<Plan>(props.initialPlan ?? EMPTY_PLAN);
  const [view, setView] = useState<View>(props.view ?? RIFT_VIEW);
  const [reviewing, setReviewing] = useState(props.reviewing ?? false);
  const [note, setNote] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(() => firstShown(squad, plan));
  const [filters, setFilters] = useState<ListFilters>({ role: roleFilterFor(squad, plan), search: "", team: ALL, sort: "points" });

  const made = transfersMade(squad, plan);
  const hit = pendingHit(rules, made);
  const bank = bankNow(squad, plan, rules.bank);
  const all = moves(squad, plan);
  const done = all.filter((m): m is { out: SquadPlayer; in: ListPlayer } => m.in !== null);
  const groups = byRole(squad, plan);
  const card = shown ? [...squad, ...props.players].find((p) => p.id === shown) : undefined;
  const bought = new Set(done.map((m) => m.in.id));
  const isNew = (holder: SlotHolder) => !holder.empty && bought.has(holder.player.id);
  const show = (holder: SlotHolder) => setShown(holder.player.id);

  /** A step taken: the plan after it; the list moves to a newly sold player's role; his card shows. */
  const take = (step: Step, who: string) => {
    if (step.plan === plan) return;
    if (step.plan.replacing && step.plan.replacing !== plan.replacing) setFilters({ ...filters, role: roleFilterFor(squad, step.plan) });
    setPlan(step.plan);
    setShown(who);
  };
  const sell = (slot: SquadSlot) => {
    const step = remove(squad, plan, slot);
    take(step, (inSlot(squad, plan, slot) ?? outOf(squad, slot)).id);
    announce(step.toast);
  };
  const putBack = (slot: SquadSlot) => {
    const step = restore(squad, plan, slot);
    take(step, outOf(squad, slot).id);
    announce(step.toast);
  };
  /** A `+`: what it did is said at the list's top, where it was pressed (Craig, 26 Nov 2026). */
  const buy = (p: ListPlayer) => {
    const step = add(squad, plan, p, rules);
    take(step, p.id);
    setNote(step.toast);
  };
  /** An empty slot's `+`: the list fills it, on its sold player's role. */
  const fill = (slot: SquadSlot) => {
    const next = { ...plan, replacing: slot };
    setPlan(next);
    setFilters({ ...filters, role: roleFilterFor(squad, next) });
  };
  /** The card's one key: `× Sell` for one of the nine, `+ Buy` for anyone else. */
  const cardKey = (p: ListPlayer) => {
    const slot = slotHolding(squad, plan, p.id);
    if (slot) sell(slot);
    else buy(p);
  };
  const reset = () => setPlan(EMPTY_PLAN);
  const chooseView = (next: View) => {
    setView(next);
    props.onViewChange?.(next);
  };

  const side = (
    <>
      <PlayerList {...props} plan={plan} filters={filters} note={note} shown={shown} onFilters={setFilters} onShow={(p) => setShown(p.id)} onBuy={buy} />
      <Placeholder word={WORDS.sponsor} height="sponsorH" />
      <SponsorNote />
    </>
  );

  return (
    <PageFrame screen="transfers" active="transfers" account={props.account} side={side} wideSide>
      <PageHead
        title={WORDS.title}
        hangul={WORDS.hangul}
        line={
          <>
            <span className="transfers__week quiet">
              {props.competition} {props.week}
            </span>
            <span className="transfers__deadline">
              <Deadline {...props.deadline} />
            </span>
            <span className="transfers__views">
              <ViewToggle options={TRANSFER_VIEWS} chosen={view} onChoose={chooseView} label={WORDS.view} />
            </span>
          </>
        }
      />
      <div className="transfers__object">
        {view === RIFT_VIEW ? (
          <RiftSquad groups={groups} fixtures={fixtures} shown={shown} isNew={isNew} onShow={show} onSell={sell} onFill={fill} onBack={putBack} />
        ) : (
          <SquadList
            groups={groups}
            fixtures={fixtures}
            lastWeek={props.lastWeek}
            shown={shown}
            isNew={isNew}
            onShow={show}
            onTap={(holder) => (holder.empty ? putBack(holder.slot) : sell(holder.slot))}
          />
        )}
        <div className="transfers__column">
          <YourTransfers
            free={freeLeft(rules, made)}
            hit={hit}
            bank={bank}
            draft={all.map((m, i) => ({ ...m, hit: hitOf(rules, i) }))}
            block={reviewBlock(squad, plan, rules)}
            onReset={reset}
            onReview={() => setReviewing(true)}
          />
          <Confirmed
            week={props.week}
            confirms={props.confirms}
            onUndo={(id) => {
              reset();
              props.onUndo?.(id);
            }}
          />
        </div>
      </div>
      {card && <TransferCard player={card} facts={props.cards[card.id]} mine={slotHolding(squad, plan, card.id) !== undefined} onKey={() => cardKey(card)} />}
      {reviewing && (
        <ConfirmSheet
          transfers={done}
          hit={hit}
          freeUsed={freeUsed(rules, made)}
          bankFrom={rules.bank}
          bankTo={bank}
          deadline={props.deadline}
          onBack={() => setReviewing(false)}
          onConfirm={() => {
            props.onConfirm?.(
              done.map((m) => ({ out: m.out.id, in: m.in.id })),
              lineupIds(squad, plan),
            );
            setReviewing(false);
            reset();
            announce(WORDS.confirmed);
          }}
        />
      )}
    </PageFrame>
  );
}
