import { Placeholder } from "../frame/Placeholder";
import { cx } from "../util/cx";
import "./Led.css";

/** A cheer's or jeer's line on its dotted LED panel, in capitals, the same on every screen (plate.md, Never 2); `big` for the picker's preview. */
export function Led({ big, children }: { big?: boolean; children: string }) {
  return <div className={cx("led", big && "led--big")}>{children}</div>;
}

/** The kinds a manager sends; a sponsor cheer sends itself (spec/14). */
export type CheerKind = "cheer" | "jeer";

export const CHEER_KINDS: readonly CheerKind[] = ["cheer", "jeer"];

export const CHEER_WORD: Record<CheerKind, string> = { cheer: "Cheer", jeer: "Jeer" };

/** The key on a feed row, on Home and on Following (spec/14). */
export const CHEER_KEY = "Cheer / Jeer";

/** The picker's title and the key's name for a screen reader, with the manager's name: `Cheer or jeer Jae Kim`. */
export const CHEER_LABEL = "Cheer or jeer";

/** The head over the cheers and jeers received, on Following and on a profile. */
export const CHEERS_RECEIVED = "Cheers and jeers";

/** The only place a screen says Truck (plate.md, One name per thing): the credit's words. */
export const TRUCK_HIRE = "Truck hire by";

/** The small credit under a cheer or jeer received: a made-up truck-hire sponsor, its slot's placeholder until Craig approves its name (spec/14). */
export function TruckHire() {
  return (
    <small className="led-hire quiet">
      {TRUCK_HIRE} <Placeholder word="Sponsor" />
    </small>
  );
}
