import { eok, oneDecimal, Tag } from "../../parts";
import { BENCH_SLOTS, BenchBar, BenchSwap, BenchTile, flexPlays, Lineup, LINEUP_ORDER, RIFT_SLOTS_PICK, Rift, Tile, type LineupCardProps } from "../../rift";
import type { PickPlayer } from "./fixtures";
import { fixtureLine, markOf, type ViewProps } from "./format";
import { swapIds } from "./model";

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

/** Rift view: the seven starters on the Rift, the Flex labelled, the bench bar under it. */
export function RiftBoard(props: ViewProps) {
  const { data, state, dispatch } = props;
  const swap = swapState(props);
  return (
    <>
      <Rift>
        {starters(props).map(({ slot, p }) => (
          <Tile
            key={slot}
            slot={slot}
            plays={flexPlays(slot, p.role)}
            name={p.name}
            team={p.team}
            flexLabel
            at={RIFT_SLOTS_PICK[slot]}
            mark={markOf(state, p.id)}
            dual={state.draft.buff === "dualCarry"}
            line={fixtureLine(data.series, p.team)}
            tags={p.news && <Tag>{p.news.flag}</Tag>}
            selected={p.id === state.selected}
            state={swap(p.id)}
            onSelect={() => dispatch({ type: "select", id: p.id })}
          />
        ))}
      </Rift>
      <Bench {...props} />
    </>
  );
}

/** Card view: the seven starters as the LCK broadcast's lineup, the bench bar under it. */
export function CardBoard(props: ViewProps) {
  const { data, state, dispatch } = props;
  const swap = swapState(props);
  const cards: LineupCardProps[] = starters(props).map(({ slot, p }) => ({
    slot,
    plays: flexPlays(slot, p.role),
    name: p.name,
    team: p.team,
    mark: markOf(state, p.id),
    dual: state.draft.buff === "dualCarry",
    news: p.news?.flag,
    next: fixtureLine(data.series, p.team),
    footer: (
      <>
        <span>
          Form <b>{oneDecimal(p.form)}</b>
        </span>
        <b>{eok(p.priceEok)}</b>
      </>
    ),
    selected: p.id === state.selected,
    state: swap(p.id),
    onSelect: () => dispatch({ type: "select", id: p.id }),
  }));
  return (
    <div className="pick-team__cards">
      <Lineup cards={cards} />
      <Bench {...props} />
    </div>
  );
}

/** The bench bar: each bench player, with ⇅ Swap between them. Lit when the tapped player can swap with him. */
function Bench(props: ViewProps) {
  const { data, state, dispatch } = props;
  const swap = swapState(props);
  const [first, second] = BENCH_SLOTS.map((slot, i) => {
    const p = data.players[state.draft.slots[slot]] as PickPlayer;
    return (
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
  });
  return (
    <BenchBar>
      {first}
      <BenchSwap onSwap={() => dispatch({ type: "swapBench" })} />
      {second}
    </BenchBar>
  );
}
