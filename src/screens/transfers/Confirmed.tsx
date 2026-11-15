import { cx, SideSection } from "../../parts";
import type { Confirm } from "./plan";

/** The hit a transfer cost, or `Free`. */
export const costLabel = (hit: number) => (hit > 0 ? `−${hit}` : "Free");

/** This week's confirms, newest first; only the newest has Undo, and none made under a buff (spec/03). */
export function Confirmed({ week, confirms, onUndo }: { week: string; confirms: Confirm[]; onUndo: (id: string) => void }) {
  if (confirms.length === 0) return null;
  return (
    <SideSection title={`Confirmed · ${week}`} note="your time · KST">
      {confirms.map((c, i) => {
        const undo = i === 0 && c.buff === undefined;
        return (
          <div key={c.id} className={cx("transfers__confirm", i > 0 && "transfers__confirm--old")}>
            <span className="transfers__when">
              {c.local}
              <small>{c.kst} KST</small>
            </span>
            <b>{c.moves.map((m) => `${m.out} → ${m.in}`).join(", ")}</b>
            <span className={cx("transfers__cost", c.hit > 0 && "num")}>{costLabel(c.hit)}</span>
            <span>
              {undo && (
                <button type="button" className="transfers__undo" onClick={() => onUndo(c.id)}>
                  Undo
                </button>
              )}
            </span>
          </div>
        );
      })}
    </SideSection>
  );
}
