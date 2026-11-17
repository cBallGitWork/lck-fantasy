import { useState, type ReactNode } from "react";
import type { CheerKind } from "../../parts";
import { CheerPicker } from "./CheerPicker";
import { receiverLine, sendCheer, type FollowingData } from "./feed";

/** The picker's state: whose cheer or jeer, which kind, which line. */
export interface Picking {
  managerId: string;
  kind: CheerKind;
  lineId?: string;
}

/** The kind the picker opens on. */
const OPENS_ON: CheerKind = "cheer";

/** The picker on a manager and kind, its first line of that kind picked: as it opens, or as the kind changes. */
export function pickerOn(data: FollowingData, managerId: string, kind: CheerKind = OPENS_ON): Picking {
  return { managerId, kind, lineId: data.receivers[managerId]?.lines.find((l) => l.kind === kind)?.id };
}

/**
 * The cheer picker with its state, on Following and on Home (spec/14): `open` it from a row's
 * `Cheer / Jeer ›`; `sheet` is the picker while open; sending marks the manager in `data.sent`.
 */
export function useCheerPicker(initial: FollowingData, initialPicking: Picking | null = null) {
  const [data, setData] = useState(initial);
  const [picking, setPicking] = useState<Picking | null>(initialPicking);
  const receiver = picking && data.following.find((m) => m.id === picking.managerId);
  const choose = (managerId: string, kind?: CheerKind) => setPicking(pickerOn(data, managerId, kind));
  const sheet: ReactNode = picking && receiver && (
    <CheerPicker
      receiver={receiver}
      line={receiverLine(data, receiver)}
      lines={data.receivers[receiver.id]?.lines ?? []}
      kind={picking.kind}
      picked={picking.lineId}
      onKind={(kind) => choose(receiver.id, kind)}
      onPick={(lineId) => setPicking({ ...picking, lineId })}
      onSend={() => {
        setData((d) => sendCheer(d, receiver.id, picking.kind));
        setPicking(null);
      }}
      onClose={() => setPicking(null)}
    />
  );
  return {
    data,
    setData,
    open: (managerId: string) => choose(managerId),
    /** Closes the picker when it is open on `managerId`. */
    closeOn: (managerId: string) => setPicking((p) => (p?.managerId === managerId ? null : p)),
    sheet,
  };
}
