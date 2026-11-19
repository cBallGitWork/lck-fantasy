import { useCallback, useState } from "react";
import { cx, Deadline, formatWon, MainAction, NONE, PageFrame, PageHead, signed, Toast, ViewToggle } from "../../parts";
import { Rift, RIFT_VIEW, ROLE_NAME, Tile, type SquadSlot } from "../../rift";
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
  moves,
  nextAgainst,
  pendingHit,
  remove,
  restore,
  reviewBlock,
  roleFilterFor,
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
import { spotOf } from "./spots";
import { SquadList } from "./SquadList";
import "./transfers.css";
import { WORDS } from "./words";

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
  deadline: { local: string; kst: string; countdown: string };
  squad: SquadPlayer[];
  players: ListPlayer[];
  rules: TransferRules;
  /** This week's confirms, newest first. */
  confirms: Confirm[];
  /** Each team's opponents this week. */
  fixtures: Record<string, Fixture[]>;
  /** The teams the Team filter offers. */
  teams: string[];
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


/** Transfers (transfers.html, changed by Craig 16 Nov 2026): the nine by role, the changes, the list and the week's confirms. */
export function TransfersPage(props: TransfersPageProps) {
  const { squad, rules, fixtures } = props;
  const [plan, setPlan] = useState<Plan>(props.initialPlan ?? EMPTY_PLAN);
  const [view, setView] = useState<View>(props.view ?? RIFT_VIEW);
  const [reviewing, setReviewing] = useState(props.reviewing ?? false);
  const [toast, setToast] = useState<{ message: string; n: number } | null>(null);
  const [filters, setFilters] = useState<ListFilters>({
    role: plan.replacing ? roleFilterFor(squad, plan.replacing) : ALL,
    search: "",
    team: ALL,
    sort: "points",
  });
  const endToast = useCallback(() => setToast(null), []);

  const made = transfersMade(squad, plan);
  const hit = pendingHit(rules, made);
  const bank = bankNow(squad, plan, rules.bank);
  const done = moves(squad, plan).filter((m): m is { out: SquadPlayer; in: ListPlayer } => m.in !== null);
  const groups = byRole(squad, plan);

  const say = (message: string) => setToast({ message, n: (toast?.n ?? 0) + 1 });
  const take = (step: Step) => {
    if (step.plan !== plan && step.plan.replacing && step.plan.replacing !== plan.replacing) {
      setFilters({ ...filters, role: roleFilterFor(squad, step.plan.replacing) });
    }
    setPlan(step.plan);
    say(step.toast);
  };
  /** Tapping one of the nine: an empty slot gets its player back; anyone else is taken out. */
  const tap = (holder: SlotHolder) => take(holder.empty ? restore(squad, plan, holder.slot) : remove(squad, plan, holder.slot));
  const reset = () => setPlan(EMPTY_PLAN);
  const chooseView = (next: View) => {
    setView(next);
    props.onViewChange?.(next);
  };

  const side = (
    <>
      <PlayerList {...props} plan={plan} filters={filters} onFilters={setFilters} onBuy={(p) => take(add(squad, plan, p, rules))} />
      <Confirmed
        week={props.week}
        confirms={props.confirms}
        onUndo={(id) => {
          reset();
          props.onUndo?.(id);
        }}
      />
    </>
  );

  return (
    <PageFrame screen="transfers" active="transfers" account={props.account} side={side}>
      <PageHead
        title={WORDS.title}
        hangul={WORDS.hangul}
        sub={
          <>
            {props.competition} {props.week} · <Deadline {...props.deadline} />
          </>
        }
      >
        <div className="transfers__figures">
          <span className="transfers__figure quiet">
            {WORDS.freeTransfers} <b className="num">{freeLeft(rules, made)}</b>
          </span>
          <span className="transfers__figure quiet">
            {WORDS.cost} <b className="num">{signed(-hit)}</b>
          </span>
          <span className={cx("transfers__figure quiet", bank < 0 && "transfers__figure--over")}>
            {WORDS.bank} <b className="num">{formatWon(bank)}</b>
          </span>
        </div>
      </PageHead>
      <div className="transfers__controls">
        <ViewToggle options={TRANSFER_VIEWS} chosen={view} onChoose={chooseView} label={WORDS.view} />
      </div>
      {view === RIFT_VIEW ? (
        <Rift>
          {groups.flatMap(({ role, holders }) =>
            holders.map((holder, i) => {
              const at = spotOf(role, i, holders.length);
              const selected = plan.replacing === holder.slot;
              const onSelect = () => tap(holder);
              // A sold player's slot: dashed and empty with his role and `+`, as the front door's; ↺ puts him back (Craig, 18 Nov 2026).
              if (holder.empty)
                return <Tile key={holder.slot} slot={role} name={ROLE_NAME[role]} team="" at={at} empty restore line="+" selected={selected} onSelect={onSelect} />;
              return (
                <Tile
                  key={holder.slot}
                  slot={role}
                  name={holder.player.name}
                  team={holder.player.team}
                  at={at}
                  mark={holder.mark}
                  price={formatWon(holder.player.priceWon)}
                  sell
                  line={nextAgainst(fixtures, holder.player.team) || NONE}
                  selected={selected}
                  onSelect={onSelect}
                />
              );
            }),
          )}
        </Rift>
      ) : (
        <SquadList groups={groups} fixtures={fixtures} lastWeek={props.lastWeek} replacing={plan.replacing} onTap={tap} />
      )}
      <div className="transfers__changes">
        <span>
          {done.map((m, i) => (
            <span key={m.out.slot}>
              {i > 0 && ", "}
              <s className="transfers__out">
                {m.out.name} {formatWon(m.out.priceWon)}
              </s>
              {" → "}
              <b>
                {m.in.name} {formatWon(m.in.priceWon)}
              </b>
            </span>
          ))}
        </span>
        <span className="transfers__actions">
          <button type="button" className="transfers__reset" onClick={reset}>
            {WORDS.reset}
          </button>
          <MainAction disabledReason={reviewBlock(squad, plan, rules)} onClick={() => setReviewing(true)}>
            {WORDS.review}
          </MainAction>
        </span>
      </div>
      {reviewing && (
        <ConfirmSheet
          transfers={done}
          hit={hit}
          freeUsed={freeUsed(rules, made)}
          freeHad={rules.freeTransfers}
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
            say(WORDS.confirmed);
          }}
        />
      )}
      {toast && <Toast message={toast.message} n={toast.n} onDone={endToast} />}
    </PageFrame>
  );
}
