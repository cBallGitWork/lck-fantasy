import { Panel, signed } from "../../parts";
import type { Confirm } from "./plan";
import { confirmedIn, whenCost, WORDS } from "./words";

/** The hit a transfer cost, or `No cost`. */
export const costLabel = (hit: number) => (hit > 0 ? signed(-hit) : WORDS.free);

/**
 * Confirmed · Week 4, the panel under Your transfers (approved/transfers/, What binds 5): each confirm
 * this week, newest first, with when and what it cost; only the newest has Undo (spec/03).
 */
export function Confirmed({ week, confirms, onUndo }: { week: string; confirms: Confirm[]; onUndo: (id: string) => void }) {
  if (confirms.length === 0) return null;
  return (
    <Panel title={confirmedIn(week)} band className="transfers__confirmed">
      {confirms.map((c, i) => (
        <div key={c.id} className="transfers__confirm">
          <div>
            <b>{c.moves.map((m) => `${m.out} → ${m.in}`).join(", ")}</b>
            <span className="transfers__when quiet">{whenCost(c.local, costLabel(c.hit))}</span>
          </div>
          {i === 0 && (
            <button type="button" className="transfers__undo" onClick={() => onUndo(c.id)}>
              {WORDS.undo}
            </button>
          )}
        </div>
      ))}
    </Panel>
  );
}
