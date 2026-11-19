import { Placeholder } from "../frame/Placeholder";
import { cx } from "../util/cx";
import { TRUCK_HIRE, WORDS, type CheerKind } from "../words";
import "./Led.css";

/** A cheer's or jeer's line on its dotted LED panel, in capitals, the same on every screen (plate.md, Never 2); `big` for the picker's preview. */
export function Led({ big, children }: { big?: boolean; children: string }) {
  return <div className={cx("led", big && "led--big")}>{children}</div>;
}

export const CHEER_KINDS: readonly CheerKind[] = ["cheer", "jeer"];

/** The small credit under a cheer or jeer received: a made-up truck-hire sponsor, its slot's placeholder until Craig approves its name (spec/14). */
export function TruckHire() {
  return (
    <small className="led-hire quiet">
      {TRUCK_HIRE} <Placeholder word={WORDS.sponsor} />
    </small>
  );
}
