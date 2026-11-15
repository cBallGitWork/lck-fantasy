import { eok, Tag } from "../../parts";
import { BENCH_SLOTS, BenchBar, BenchSwap, BenchTile, Lineup, RIFT_SLOTS_PICK, Rift, Tile, type LineupCardProps, type RoleKey } from "../../rift";
import type { PickPlayer } from "./fixtures";
import { fixtureLine, markOf, type ViewProps } from "./format";
import { fitIds, STARTER_SLOTS } from "./model";

/** The role a Flex plays; the coach plays none. */
const playsFor = (p: PickPlayer): RoleKey | undefined => (p.role === "coach" ? undefined : p.role);

/** The starter in each slot, in the broadcast's order. */
const starters = ({ data, state }: ViewProps) =>
  STARTER_SLOTS.map((slot) => ({ slot, p: data.players[state.draft.slots[slot]] as PickPlayer }));

/** Rift view: the seven starters on the Rift, the bench bar under it. Mid-swap, the rest dim. */
export function RiftBoard(props: ViewProps) {
  const { data, state, dispatch } = props;
  return (
    <>
      <Rift>
        {starters(props).map(({ slot, p }) => {
          const isSelected = p.id === state.selected;
          return (
            <Tile
              key={slot}
              slot={slot}
              plays={slot === "flex" ? playsFor(p) : undefined}
              name={p.name}
              team={p.team}
              at={RIFT_SLOTS_PICK[slot]}
              mark={markOf(state, p.id)}
              line={fixtureLine(data.series, p.team)}
              tags={p.news && <Tag>{p.news.flag}</Tag>}
              selected={isSelected}
              state={state.swapping && !isSelected ? "dim" : undefined}
              onSelect={() => dispatch({ type: "select", id: p.id })}
            />
          );
        })}
      </Rift>
      <Bench {...props} />
    </>
  );
}

/** Card view: the seven starters as the LCK broadcast's lineup, the bench bar under it. */
export function CardBoard(props: ViewProps) {
  const { data, state, dispatch } = props;
  const cards: LineupCardProps[] = starters(props).map(({ slot, p }) => ({
    slot,
    plays: slot === "flex" ? playsFor(p) : undefined,
    name: p.name,
    team: p.team,
    mark: markOf(state, p.id),
    news: p.news?.flag,
    next: fixtureLine(data.series, p.team),
    footer: (
      <>
        <span>
          Form <b>{p.form.toFixed(1)}</b>
        </span>
        <b>{eok(p.priceEok)}</b>
      </>
    ),
    selected: p.id === state.selected,
    onSelect: () => dispatch({ type: "select", id: p.id }),
  }));
  return (
    <div className="pick-team__cards">
      <Lineup cards={cards} />
      <Bench {...props} />
    </div>
  );
}

/** The bench bar: each bench player, with ⇅ Swap between them. Mid-swap, those who fit are outlined, the rest dimmed. */
function Bench({ data, state, dispatch }: ViewProps) {
  const fit = state.swapping ? fitIds(state.draft, state.swapping, (id) => (data.players[id] as PickPlayer).role) : undefined;
  const [first, second] = BENCH_SLOTS.map((slot, i) => {
    const p = data.players[state.draft.slots[slot]] as PickPlayer;
    const fits = fit?.has(p.id) ?? false;
    const choose = !fit ? () => dispatch({ type: "select", id: p.id }) : fits ? () => dispatch({ type: "swapIn", id: p.id }) : undefined;
    return (
      <BenchTile
        key={slot}
        order={i + 1}
        role={p.role}
        name={p.name}
        team={p.team}
        line={fixtureLine(data.series, p.team)}
        state={fit && (fits ? "fit" : "dim")}
        selected={!fit && p.id === state.selected}
        onSelect={choose}
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
