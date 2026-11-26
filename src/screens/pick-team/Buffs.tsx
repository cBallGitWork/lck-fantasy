import { BuffCard, Panel, type BuffState } from "../../parts";
import type { PickBuffInfo } from "./fixtures";
import type { ViewProps } from "./format";
import { WORDS } from "./words";

/**
 * The three buffs (spec/06): each plays here, then cancels until the deadline. One a week, so while one
 * is on the rest are unavailable; one played in an earlier week says which. A panel beside the Rift on a
 * desk, and a row of three tiles over it on a phone (approved/pick-team/); beside the bench under the
 * cards in Card view (1440-cards.png).
 */
export function Buffs({ data, state, dispatch }: ViewProps) {
  const on = state.draft.buff;
  const stateOf = (b: PickBuffInfo): BuffState => {
    if (b.here === on) return { kind: "on" };
    if (b.playedWeek !== undefined) return { kind: "played", week: b.playedWeek };
    return on ? { kind: "unavailable" } : { kind: "available" };
  };
  return (
    <Panel title={WORDS.buffs} className="pick-team__buffs">
      <div className="pick-team__buff-list">
        {data.buffs.map((b) => (
          <BuffCard
            key={b.name}
            effect={b.here}
            name={b.name}
            does={b.does}
            state={stateOf(b)}
            onPlay={() => dispatch({ type: "playBuff", buff: b.here })}
            onCancel={() => dispatch({ type: "cancelBuff" })}
          />
        ))}
      </div>
    </Panel>
  );
}
