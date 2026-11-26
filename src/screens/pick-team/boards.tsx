import { photoOf } from "../../fixtures/photos";
import { money, oneDecimal } from "../../parts";
import { BENCH_SLOTS, BenchBar, benchPlace, BenchTile, flexPlays, Lineup, LineupCard, LINEUP_ORDER, RIFT_SLOTS, Rift, Tile, type LineupCardProps } from "../../rift";
import type { PickPlayer } from "./fixtures";
import { fixtureLine, markOf, type ViewProps } from "./format";
import { swapIds } from "./model";
import { WORDS } from "./words";

/** The starter in each slot, in the broadcast's order. */
const starters = ({ data, state }: ViewProps) =>
  LINEUP_ORDER.map((slot) => ({
    slot,
    p: data.players[state.draft.slots[slot]] as PickPlayer,
  }));

/**
 * Who the tapped player can swap with, lit; the rest dim (FPL's one-tap swap). Nothing changes
 * when he can swap with nobody, as the coach.
 */
function swapState({ data, state }: ViewProps): (id: string) => "fit" | "dim" | undefined {
  const lit = state.selected ? swapIds(state.draft, state.selected, (id) => (data.players[id] as PickPlayer).role) : new Set<string>();
  return (id) => (lit.size === 0 || id === state.selected ? undefined : lit.has(id) ? "fit" : "dim");
}

/** Rift view: the seven starters on the Rift. */
export function RiftBoard(props: ViewProps) {
  const { data, state, dispatch } = props;
  const swap = swapState(props);
  return (
    <div className="pick-team__rift">
      <Rift>
        {starters(props).map(({ slot, p }) => (
          <Tile
            key={slot}
            slot={slot}
            name={p.name}
            team={p.team}
            at={RIFT_SLOTS[slot]}
            mark={markOf(state, p.id)}
            line={fixtureLine(data.series, p.team)}
            flag={p.news?.flag}
            selected={p.id === state.selected}
            state={swap(p.id)}
            onSelect={() => dispatch({ type: "select", id: p.id })}
          />
        ))}
      </Rift>
    </div>
  );
}

/** A player's lineup card, as Card view draws him (approved/pick-team/1440-cards.png). */
function cardOf(props: ViewProps, swap: ReturnType<typeof swapState>, p: PickPlayer): Omit<LineupCardProps, "slot"> {
  const { data, state, dispatch } = props;
  return {
    name: p.name,
    team: p.team,
    photo: photoOf(p.name),
    mark: markOf(state, p.id),
    news: p.news?.flag,
    next: fixtureLine(data.series, p.team),
    footer: (
      <>
        <span>
          {WORDS.form} <b>{oneDecimal(p.form)}</b>
        </span>
        <b>{money(p.priceM)}</b>
      </>
    ),
    selected: p.id === state.selected,
    state: swap(p.id),
    onSelect: () => dispatch({ type: "select", id: p.id }),
  };
}

/** Card view: the seven starters as the LCK broadcast's lineup. */
export function CardBoard(props: ViewProps) {
  const swap = swapState(props);
  const cards: LineupCardProps[] = starters(props).map(({ slot, p }) => ({ ...cardOf(props, swap, p), slot, plays: flexPlays(slot, p.role) }));
  return (
    <div className="pick-team__cards">
      <Lineup cards={cards} />
    </div>
  );
}

/**
 * The bench: each bench player; tap one then the other to swap their order. Lit when the tapped player
 * can swap with him. In Rift view the Rift's own tiles on its green; in Card view the starters' own card,
 * its strip the bench order and role, in a panel (Craig, 25 Nov 2026: "Same cards").
 */
export function Bench(props: ViewProps) {
  const { data, state, dispatch } = props;
  const swap = swapState(props);
  const cards = state.view === "cards";
  return (
    <BenchBar className="pick-team__bench" cards={cards}>
      {BENCH_SLOTS.map((slot, i) => {
        const p = data.players[state.draft.slots[slot]] as PickPlayer;
        return cards ? (
          <LineupCard key={slot} {...cardOf(props, swap, p)} slot={p.role} strip={benchPlace(i + 1, p.role)} />
        ) : (
          <BenchTile
            key={slot}
            order={i + 1}
            role={p.role}
            name={p.name}
            team={p.team}
            line={fixtureLine(data.series, p.team)}
            state={swap(p.id)}
            selected={p.id === state.selected}
            onSelect={() => dispatch({ type: "select", id: p.id })}
          />
        );
      })}
    </BenchBar>
  );
}
