import { useCallback, useState } from "react";
import { allPicks, type Squad } from "../../../convex/squads/squad";
import type { TeamCode } from "../../fixtures/week3";
import { cx, Deadline, formatWon, MainAction, NONE, OutlinedKey, PageFrame, PageHead, Toast, ViewToggle } from "../../parts";
import { BENCH_SLOTS, BenchBar, BenchTile, isBench, LINEUP_ORDER, Rift, RIFT_SLOTS, RIFT_VIEW, ROLE_NAME, Tile, type SquadSlot } from "../../rift";
import { PlayerList, type ListFilters } from "./PlayerList";
import {
  add,
  autoFilled,
  bankOf,
  filterFor,
  holders,
  leftToPick,
  removeAt,
  saveBlock,
  teamCapLine,
  unpicked,
  type FrontDoorRules,
  type GuestPlayer,
} from "./pick";
import { SignUpStepOne, SignUpStepTwo, type Provider, type SignUpAnswers } from "./SignUp";
import { keyFor, WORDS } from "./words";
import "./pick-team-signed-out.css";

/** The front door's two views, as Transfers'. */
const VIEWS = [RIFT_VIEW, WORDS.listView] as const;
type View = (typeof VIEWS)[number];

/** What Save team hands the host: the squad, the sign-up answers and the provider signed in with. */
export interface SavedTeam {
  squad: Squad;
  answers: SignUpAnswers & { favouriteTeam: TeamCode };
  provider: Provider;
}

export interface FrontDoorProps {
  players: GuestPlayer[];
  rules: FrontDoorRules;
  /** Each team's next opponent this week. */
  next: Record<string, string>;
  /** The teams the Team filter offers. */
  teams: string[];
  competition: string;
  week: string;
  deadline: { local: string; countdown: string };
  countries: string[];
  /** Where the visitor is (spec/09: country is filled in from it). */
  country: string;
  nameMax: number;
  initialSquad: Squad;
  /** Each change to the squad, so the host keeps it in the browser (spec/09). */
  onSquad?: (squad: Squad) => void;
  /** Auto-fill's random, seeded in tests. */
  random?: () => number;
  /** Opens on a sign-up step, in dev and tests. */
  initialStep?: 1 | 2;
  onSave: (saved: SavedTeam) => void;
}

/** The front door (front-door/, Craig 17 Nov 2026): the squad on the Rift, its bench and the bar; the list beside it. */
export function FrontDoor(props: FrontDoorProps) {
  const { players, rules } = props;
  const [squad, setSquad] = useState(props.initialSquad);
  const [view, setView] = useState<View>(RIFT_VIEW);
  const [filters, setFilters] = useState<ListFilters>({ role: null, search: "", team: null, sort: "points" });
  const [toast, setToast] = useState<{ message: string; n: number } | null>(null);
  const [step, setStep] = useState<0 | 1 | 2>(props.initialStep ?? 0);
  const [provider, setProvider] = useState<Provider>("Google");
  const [answers, setAnswers] = useState<SignUpAnswers>({ teamName: "", favouriteTeam: null, country: props.country, ticked: false });
  const endToast = useCallback(() => setToast(null), []);

  const say = (message: string) => setToast({ message, n: (toast?.n ?? 0) + 1 });
  const change = (next: Squad) => {
    setSquad(next);
    props.onSquad?.(next);
  };
  const pick = (player: GuestPlayer) => {
    const done = add(squad, player, rules.squad);
    if ("refused" in done) return say(done.refused);
    change(done.squad);
    say(done.news);
  };
  /** A picked tile's `×` empties it; an empty one filters the list to its role. */
  const tap = (slot: SquadSlot, held: GuestPlayer | undefined) => {
    if (held) change(removeAt(squad, slot));
    else setFilters({ ...filters, role: filterFor(slot) });
  };

  const held = holders(squad, players);
  const left = leftToPick(squad, rules.squad);
  const bank = bankOf(squad, players, rules.budget);
  const block = saveBlock(squad, players, rules);
  const tileOf = (slot: SquadSlot) => {
    const p = held[slot];
    return p
      ? { name: p.name, team: p.team, price: formatWon(p.priceWon), sell: true, line: props.next[p.team] ? `${WORDS.versus} ${props.next[p.team]}` : NONE }
      : { name: slot === "flex" || isBench(slot) ? WORDS.anyRole : ROLE_NAME[slot as keyof typeof ROLE_NAME], team: "", empty: true, line: "+" };
  };

  return (
    <PageFrame
      screen="pick-team-signed-out"
      account={null}
      side={<PlayerList players={unpicked(squad, players)} next={props.next} teams={props.teams} filters={filters} onFilters={setFilters} onPick={pick} />}
    >
      <PageHead title={WORDS.title} hangul={WORDS.hangul} sub={<>{props.competition} {props.week} · <Deadline {...props.deadline} /></>}>
        <div className="pick-team-signed-out__figures">
          <span className="pick-team-signed-out__figure quiet">
            {WORDS.picked} <b className="num">{allPicks(squad).length} / {allPicks(squad).length + left}</b>
          </span>
          {bank !== null && (
            <span className={cx("pick-team-signed-out__figure quiet", bank < 0 && "pick-team-signed-out__figure--over")}>
              {WORDS.bank} <b className="num">{formatWon(bank)}</b>
            </span>
          )}
          <span className="pick-team-signed-out__figure quiet">
            {WORDS.teamCap} <b className="num">{teamCapLine(squad, rules.squad.teamCap)}</b>
          </span>
        </div>
      </PageHead>
      <div className="pick-team-signed-out__controls">
        <ViewToggle options={VIEWS} chosen={view} onChoose={setView} label={WORDS.view} />
        <span className="pick-team-signed-out__keys">
          {allPicks(squad).length > 0 && <OutlinedKey onClick={() => change({ starters: [], bench: [] })}>{WORDS.reset}</OutlinedKey>}
          <OutlinedKey onClick={() => change(autoFilled(squad, players, rules, props.random))} disabledReason={left === 0 ? "" : undefined}>
            {WORDS.autoFill}
          </OutlinedKey>
        </span>
      </div>
      {view === RIFT_VIEW ? (
        <>
          <Rift>
            {LINEUP_ORDER.map((slot) => (
              <Tile key={slot} slot={slot} at={RIFT_SLOTS[slot]} {...tileOf(slot)} onSelect={() => tap(slot, held[slot])} />
            ))}
          </Rift>
          <BenchBar>
            {BENCH_SLOTS.map((slot, i) => {
              const p = held[slot];
              return <BenchTile key={slot} order={i + 1} role={p?.role} {...tileOf(slot)} onSelect={() => tap(slot, p)} />;
            })}
          </BenchBar>
        </>
      ) : (
        <table className="pick-team-signed-out__squad">
          <tbody>
            {[...LINEUP_ORDER, ...BENCH_SLOTS].map((slot, i) => {
              const p = held[slot];
              const name = i < LINEUP_ORDER.length ? ROLE_NAME[slot as keyof typeof ROLE_NAME] : `${WORDS.bench} ${i - LINEUP_ORDER.length + 1}`;
              return (
                <tr key={slot}>
                  <td className="quiet">{name}</td>
                  <td>{p ? <b>{p.name}</b> : NONE} {p?.team}</td>
                  <td className="pick-team-signed-out__num num">{p ? formatWon(p.priceWon) : ""}</td>
                  <td>
                    <button type="button" className="pick-team-signed-out__add" aria-label={p ? keyFor(WORDS.remove, p.name) : name} onClick={() => tap(slot, p)}>
                      {p ? "×" : "+"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="pick-team-signed-out__bar">
        <span className="quiet">{block}</span>
        <MainAction disabledReason={block === undefined ? undefined : ""} onClick={() => setStep(1)}>
          {WORDS.save}
        </MainAction>
      </div>
      {step === 1 && (
        <SignUpStepOne
          onContinue={(chosen) => {
            setProvider(chosen);
            setStep(2);
          }}
          onClose={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <SignUpStepTwo
          answers={answers}
          onChange={(patch) => setAnswers({ ...answers, ...patch })}
          countries={props.countries}
          nameMax={props.nameMax}
          deadline={props.deadline}
          onBack={() => setStep(1)}
          onSave={() => answers.favouriteTeam && props.onSave({ squad, answers: { ...answers, favouriteTeam: answers.favouriteTeam }, provider })}
          onClose={() => setStep(0)}
        />
      )}
      {toast && <Toast message={toast.message} n={toast.n} onDone={endToast} />}
    </PageFrame>
  );
}
