import { useState } from "react";
import { Deadline, formatEok, MainAction, Menu, OutlinedKey, PageFrame, PageHead, ViewToggle } from "../../parts";
import { BenchBar, BenchTile, Lineup, RIFT_SLOTS, Rift, Tile, type RiftPoint, type RoleKey, type SlotKey } from "../../rift";
import { ConfirmSheet } from "./ConfirmSheet";
import { Confirmed, costLabel } from "./Confirmed";
import {
  bankNow,
  buy,
  EMPTY_PLAN,
  emptySlots,
  freeLeft,
  inSlot,
  moves,
  pendingHit,
  roleFilterFor,
  sell,
  transfersMade,
  type Confirm,
  type Fixture,
  type ListFilters,
  type ListPlayer,
  type Plan,
  type SquadPlayer,
  type SquadSlot,
  type TransferRules,
} from "./plan";
import { ALL_TEAMS, PlayerList } from "./PlayerList";
import "./transfers.css";

export type View = "Rift view" | "Card view";
export type Show = "Fixtures" | "Price" | "Owned";

export interface TransfersPageProps {
  /** The account menu's team name. */
  account: string;
  competition: string;
  /** `Week 4`. */
  week: string;
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
  buffs: string[];
  initialPlan?: Plan;
  /** The manager's last choice; Rift view on his first visit (spec/12). */
  view?: View;
  onViewChange?: (view: View) => void;
  /** Opens on the confirm sheet. */
  reviewing?: boolean;
  onConfirm?: (transfers: { slot: SquadSlot; out: string; in: string }[]) => void;
  onUndo?: (confirmId: string) => void;
  onBuff?: (buff: string) => void;
}

const VIEWS: readonly View[] = ["Rift view", "Card view"];
const SHOWS: readonly Show[] = ["Fixtures", "Price", "Owned"];
const BENCH: readonly SquadSlot[] = ["bench1", "bench2"];
/** Where each starter stands on Transfers' Rift (transfers.html): Points' places, the Flex a little left. */
const TRANSFERS_SLOTS: Record<SlotKey, RiftPoint> = { ...RIFT_SLOTS, flex: [238, 468] };
const STARTERS = Object.keys(TRANSFERS_SLOTS) as SlotKey[];

type Standing = SquadPlayer | ListPlayer;

/** What sits under a player, by Show: his fixtures (`v DNS · v HLE`), price or owned. */
export function under(show: Show, p: Standing, fixtures: Record<string, Fixture[]>): string {
  if (show === "Price") return formatEok(p.price);
  if (show === "Owned") return `${p.ownedPct}%`;
  return (fixtures[p.team] ?? []).map((f) => `v ${f.against}`).join(" · ");
}

const playsOf = (slot: SquadSlot, p: Standing): RoleKey | undefined => (slot === "flex" && p.role !== "coach" ? p.role : undefined);
const markOf = (p: Standing) => ("mark" in p ? p.mark : undefined);
const hitLabel = (hit: number) => (hit > 0 ? `−${hit}` : "0");

/** Transfers, Rift view mid-transfer (transfers.html): the squad, the bench, the changes, the list and the week's confirms. */
export function TransfersPage(props: TransfersPageProps) {
  const { squad, rules, fixtures } = props;
  const [plan, setPlan] = useState<Plan>(props.initialPlan ?? EMPTY_PLAN);
  const [view, setView] = useState<View>(props.view ?? "Rift view");
  const [show, setShow] = useState<Show>("Fixtures");
  const [reviewing, setReviewing] = useState(props.reviewing ?? false);
  const [filters, setFilters] = useState<ListFilters>({
    role: plan.replacing ? roleFilterFor(plan.replacing) : "all",
    search: "",
    team: ALL_TEAMS,
    sort: "points",
  });

  const made = transfersMade(squad, plan);
  const hit = pendingHit(rules, made);
  const bank = bankNow(squad, plan, rules.bank);
  const done = moves(squad, plan).filter((m): m is { out: SquadPlayer; in: ListPlayer } => m.in !== null);
  const reviewReason = made === 0 ? "No changes" : emptySlots(plan) > 0 ? "Slot empty" : undefined;

  const reset = () => setPlan(EMPTY_PLAN);
  const chooseView = (next: View) => {
    setView(next);
    props.onViewChange?.(next);
  };
  /** A slot as drawn: who stands there (the sold player while it is empty), and whether it is chosen. */
  const slotView = (slot: SquadSlot) => ({
    p: inSlot(squad, plan, slot) ?? (squad.find((s) => s.slot === slot) as SquadPlayer),
    empty: slot in plan.sold && !plan.sold[slot],
    selected: plan.replacing === slot,
    onSelect: () => {
      setPlan(sell(plan, slot));
      setFilters({ ...filters, role: roleFilterFor(slot) });
    },
  });

  const side = (
    <>
      <PlayerList {...props} plan={plan} filters={filters} onFilters={setFilters} onBuy={(p) => setPlan(buy(plan, p))} />
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
      />
      <div className="transfers__strip">
        <span className="transfers__figure">
          Free transfers <b className="num">{freeLeft(rules, made)}</b>
        </span>
        <span className="transfers__figure">
          Pending hit <b className="num">{hitLabel(hit)}</b>
        </span>
        <span className="transfers__figure">
          Bank <b className="num">{formatEok(bank)}</b>
        </span>
        <span className="transfers__buffs">
          {props.buffs.map((buff) => (
            <OutlinedKey key={buff} onClick={() => props.onBuff?.(buff)}>
              {buff}
            </OutlinedKey>
          ))}
        </span>
      </div>
      <div className="transfers__controls">
        <ViewToggle options={VIEWS} chosen={view} onChoose={chooseView} label="View" />
        <Menu className="transfers__show" label={`Show: ${show} ▾`} items={SHOWS.map((s) => ({ label: s, onChoose: () => setShow(s) }))} />
      </div>
      {view === "Rift view" ? (
        <Rift>
          {STARTERS.map((slot) => {
            const s = slotView(slot);
            return (
              <Tile
                key={slot}
                slot={slot}
                plays={playsOf(slot, s.p)}
                name={s.p.name}
                team={s.p.team}
                at={TRANSFERS_SLOTS[slot]}
                mark={markOf(s.p)}
                line={under(show, s.p, fixtures)}
                selected={s.selected}
                state={s.empty ? "dim" : undefined}
                onSelect={s.onSelect}
              />
            );
          })}
        </Rift>
      ) : (
        <Lineup
          cards={STARTERS.map((slot) => {
            const s = slotView(slot);
            return {
              slot,
              plays: playsOf(slot, s.p),
              name: s.p.name,
              team: s.p.team,
              mark: markOf(s.p),
              next: under(show, s.p, fixtures),
              selected: s.selected,
              onSelect: s.onSelect,
            };
          })}
        />
      )}
      <BenchBar>
        {BENCH.map((slot, i) => {
          const s = slotView(slot);
          return (
            <BenchTile
              key={slot}
              order={i + 1}
              role={s.p.role}
              name={s.p.name}
              team={s.p.team}
              line={under(show, s.p, fixtures)}
              selected={s.selected}
              state={s.empty ? "dim" : undefined}
              onSelect={s.onSelect}
            />
          );
        })}
      </BenchBar>
      <div className="transfers__changes">
        <span>
          {done.length > 0 && (
            <>
              <b>
                {made} transfer{made === 1 ? "" : "s"}
              </b>
              {` · ${costLabel(hit)} · `}
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
              {` · bank ${formatEok(rules.bank)} → ${formatEok(bank)}`}
            </>
          )}
        </span>
        <span className="transfers__actions">
          <button type="button" className="transfers__reset" onClick={reset}>
            Reset
          </button>
          <MainAction disabledReason={reviewReason} onClick={() => setReviewing(true)}>
            Review and confirm ›
          </MainAction>
        </span>
      </div>
      {reviewing && (
        <ConfirmSheet
          transfers={done}
          hit={hit}
          freeLeft={freeLeft(rules, made)}
          bankFrom={rules.bank}
          bankTo={bank}
          deadline={props.deadline}
          onBack={() => setReviewing(false)}
          onConfirm={() => {
            props.onConfirm?.(done.map((m) => ({ slot: m.out.slot, out: m.out.id, in: m.in.id })));
            setReviewing(false);
            reset();
          }}
        />
      )}
    </PageFrame>
  );
}
