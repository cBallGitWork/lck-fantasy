import { cx, SideSection, signed, TIME_NOTE } from "../../parts";
import type { Confirm } from "./plan";
import { confirmedIn, WORDS } from "./words";

/** The hit a transfer cost, or `No cost`. */
export const costLabel = (hit: number) => (hit > 0 ? signed(-hit) : WORDS.free);

/** This week's confirms, newest first; only the newest has Undo (spec/03). */
export function Confirmed({ week, confirms, onUndo }: { week: string; confirms: Confirm[]; onUndo: (id: string) => void }) {
  if (confirms.length === 0) return null;
  return (
    <SideSection title={confirmedIn(week)} note={TIME_NOTE}>
      {confirms.map((c, i) => {
        return (
          <div key={c.id} className={cx("transfers__confirm", i > 0 && "transfers__confirm--old")}>
            <span className="transfers__when">
              {c.local}
              <small>
                {c.kst} {WORDS.kst}
              </small>
            </span>
            <b>{c.moves.map((m) => `${m.out} → ${m.in}`).join(", ")}</b>
            <span className={cx("transfers__cost", c.hit > 0 && "num")}>{costLabel(c.hit)}</span>
            <span>
              {i === 0 && (
                <button type="button" className="transfers__undo" onClick={() => onUndo(c.id)}>
                  {WORDS.undo}
                </button>
              )}
            </span>
          </div>
        );
      })}
    </SideSection>
  );
}
