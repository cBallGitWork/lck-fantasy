import { BuffCard, LinkGo } from "../../parts";
import { PATHS } from "../../paths";
import type { ViewProps } from "./format";

/**
 * The four buffs (spec/06). Bench Boost and Dual Carry play here, then cancel until the deadline;
 * Remake and Limitless link to Transfers. One a week, so once one is chosen the rest grey. In one
 * row at the top of the page, above the Rift, as FPL's chips (Craig, 16 Nov 2026).
 */
export function Buffs({ data, state, dispatch }: ViewProps) {
  const played = state.draft.buff;
  return (
    <section className="pick-team__buffs" aria-label="Buffs">
      {data.buffs.map((b) => {
        const common = { name: b.name, does: b.does };
        if (b.here !== undefined && b.here === played) {
          const cancel = (
            <button type="button" onClick={() => dispatch({ type: "cancelBuff" })}>
              Cancel
            </button>
          );
          return <BuffCard key={b.name} {...common} left={played === state.saved.buff ? "On" : "On · unsaved"} state="on" action={cancel} />;
        }
        const left = `${b.left} left`;
        if (played || b.left === 0) return <BuffCard key={b.name} {...common} left={left} state="off" />;
        const here = b.here;
        if (here) return <BuffCard key={b.name} {...common} left={left} onPlay={() => dispatch({ type: "playBuff", buff: here })} />;
        return <BuffCard key={b.name} {...common} left={left} action={<LinkGo go={{ to: PATHS.transfers }}>Transfers</LinkGo>} />;
      })}
    </section>
  );
}
