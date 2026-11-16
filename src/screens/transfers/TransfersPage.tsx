import { useCallback, useState } from "react";
import type { BuffName } from "../../fixtures/week3";
import { cx, Deadline, formatEok, MainAction, MINUS, OutlinedKey, PageFrame, PageHead, Toast, ViewToggle } from "../../parts";
import { Rift, RIFT_VIEW, Tile, type SquadSlot } from "../../rift";
import { ConfirmSheet } from "./ConfirmSheet";
import { Confirmed } from "./Confirmed";
import { arrange, byRole, type Standing } from "./lineup";
import {
  add,
  bankNow,
  EMPTY_PLAN,
  freeLeft,
  freeUsed,
  moves,
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
import { ALL_TEAMS, PlayerList } from "./PlayerList";
import { spotOf } from "./spots";
import { SquadList } from "./SquadList";
import "./transfers.css";

/** Transfers' two views: the nine on the Rift, or listed by role (Craig, 16 Nov 2026). */
export const TRANSFER_VIEWS = [RIFT_VIEW, "List view"] as const;
export type View = (typeof TRANSFER_VIEWS)[number];

export interface TransfersPageProps {
  /** The account menu's team name. */
  account: string;
  competition: string;
  /** `Week 4`. */
  week: string;
  /** The last week whose points the List view shows: `Wk 3`. */
  lastWeek: string;
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
  /** The transfer buffs the manager can still play. */
  buffs: BuffName[];
  initialPlan?: Plan;
  /** The manager's last choice; Rift view on his first visit (spec/12). */
  view?: View;
  onViewChange?: (view: View) => void;
  /** Opens on the confirm sheet. */
  reviewing?: boolean;
  /** Each transfer by id, and the nine after them, arranged by role. */
  onConfirm?: (transfers: { out: string; in: string }[], lineup: Record<SquadSlot, string>) => void;
  onUndo?: (confirmId: string) => void;
  onBuff?: (buff: BuffName) => void;
}

const hitLabel = (hit: number) => (hit > 0 ? `${MINUS}${hit}` : "0");

/** Transfers (transfers.html, changed by Craig 16 Nov 2026): the nine by role, the changes, the list and the week's confirms. */
export function TransfersPage(props: TransfersPageProps) {
  const { squad, rules, fixtures } = props;
  const [plan, setPlan] = useState<Plan>(props.initialPlan ?? EMPTY_PLAN);
  const [view, setView] = useState<View>(props.view ?? RIFT_VIEW);
  const [reviewing, setReviewing] = useState(props.reviewing ?? false);
  const [toast, setToast] = useState<{ message: string; n: number } | null>(null);
  const [filters, setFilters] = useState<ListFilters>({
    role: plan.replacing ? roleFilterFor(squad, plan.replacing) : "all",
    search: "",
    team: ALL_TEAMS,
    sort: "points",
  });
  const endToast = useCallback(() => setToast(null), []);

  const made = transfersMade(squad, plan);
  const hit = pendingHit(rules, made);
  const bank = bankNow(squad, plan, rules.bank);
  const done = moves(squad, plan).filter((m): m is { out: SquadPlayer; in: ListPlayer } => m.in !== null);
  const groups = byRole(squad, plan);

  const take = (step: Step) => {
    if (step.plan !== plan && step.plan.replacing && step.plan.replacing !== plan.replacing) {
      setFilters({ ...filters, role: roleFilterFor(squad, step.plan.replacing) });
    }
    setPlan(step.plan);
    setToast({ message: step.toast, n: (toast?.n ?? 0) + 1 });
  };
  /** Tapping one of the nine: an empty slot gets its player back; anyone else is taken out. */
  const tap = (s: Standing) => take(s.empty ? restore(squad, plan, s.slot) : remove(squad, plan, s.slot));
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
        title="Transfers"
        hangul="이적"
        sub={
          <>
            {props.competition} {props.week} · <Deadline {...props.deadline} />
          </>
        }
      >
        <div className="transfers__figures">
          <span className="transfers__figure">
            Free transfers <b className="num">{freeLeft(rules, made)}</b>
          </span>
          <span className="transfers__figure">
            Cost <b className="num">{hitLabel(hit)}</b>
          </span>
          <span className={cx("transfers__figure", bank < 0 && "transfers__figure--over")}>
            Bank <b className="num">{formatEok(bank)}</b>
          </span>
        </div>
      </PageHead>
      <div className="transfers__controls">
        <ViewToggle options={TRANSFER_VIEWS} chosen={view} onChoose={chooseView} label="View" />
        <span className="transfers__keys">
          {props.buffs.map((buff) => (
            <OutlinedKey key={buff} onClick={() => props.onBuff?.(buff)}>
              {buff}
            </OutlinedKey>
          ))}
        </span>
      </div>
      {view === RIFT_VIEW ? (
        <Rift>
          {groups.flatMap(({ role, standing }) =>
            standing.map((s, i) => (
              <Tile
                key={s.slot}
                slot={role}
                name={s.p.name}
                team={s.p.team}
                at={spotOf(role, i, standing.length)}
                mark={s.mark}
                line={formatEok(s.p.price)}
                selected={plan.replacing === s.slot}
                state={s.empty ? "dim" : undefined}
                onSelect={() => tap(s)}
              />
            )),
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
                {m.out.name} {formatEok(m.out.price)}
              </s>
              {" → "}
              <b>
                {m.in.name} {formatEok(m.in.price)}
              </b>
            </span>
          ))}
        </span>
        <span className="transfers__actions">
          <button type="button" className="transfers__reset" onClick={reset}>
            Reset
          </button>
          <MainAction disabledReason={reviewBlock(squad, plan, rules)} onClick={() => setReviewing(true)}>
            Review and confirm ›
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
            const lineup = Object.fromEntries(Object.entries(arrange(squad, plan)).map(([slot, p]) => [slot, p.id])) as Record<SquadSlot, string>;
            props.onConfirm?.(
              done.map((m) => ({ out: m.out.id, in: m.in.id })),
              lineup,
            );
            setReviewing(false);
            reset();
          }}
        />
      )}
      {toast && <Toast message={toast.message} n={toast.n} onDone={endToast} />}
    </PageFrame>
  );
}
