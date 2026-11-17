import { useState } from "react";
import { useDevState } from "../../parts";
import { accept, decline, receiverLine, removeFollower, sendTruck, unfollow, type FollowingData, type SentKind } from "./feed";
import { FOLLOWING, PICKER_AS_DRAWN } from "./fixtures";
import { FollowingView } from "./FollowingView";
import { TruckPicker } from "./TruckPicker";

/** The picker's state: whose truck, which kind, which line. */
interface Picking {
  managerId: string;
  kind: SentKind;
  lineId?: string;
}

/** The first line of a kind, picked when the picker opens or the kind changes. */
const firstLine = (data: FollowingData, managerId: string, kind: SentKind) => data.receivers[managerId]?.lines.find((l) => l.kind === kind)?.id;

/** The Following page's route, on the picture's made-up Week 3 until the backend feeds it (#89, #90). `?state=truck` opens the truck picker, in dev. */
export function FollowingScreen() {
  return <FollowingPage data={FOLLOWING} initialPicking={useDevState<Picking>({ truck: PICKER_AS_DRAWN })} />;
}

/** The Following page with its controls working, from the data it is fed; `initialPicking` opens the truck picker. */
function FollowingPage({ data: initial, initialPicking = null }: { data: FollowingData; initialPicking?: Picking | null }) {
  const [data, setData] = useState(initial);
  const [picking, setPicking] = useState<Picking | null>(initialPicking);
  const receiver = picking && data.following.find((m) => m.id === picking.managerId);
  const choose = (managerId: string, kind: SentKind) => setPicking({ managerId, kind, lineId: firstLine(data, managerId, kind) });
  return (
    <>
      <FollowingView
        data={data}
        onTruck={(id) => choose(id, "coffee")}
        onAccept={(id) => setData((d) => accept(d, id))}
        onDecline={(id) => setData((d) => decline(d, id))}
        onUnfollow={(id) => {
          setData((d) => unfollow(d, id));
          setPicking((p) => (p?.managerId === id ? null : p));
        }}
        onRemove={(id) => setData((d) => removeFollower(d, id))}
        onBlock={(id) => setData((d) => removeFollower(d, id))}
      />
      {picking && receiver && (
        <TruckPicker
          receiver={receiver}
          line={receiverLine(data, receiver)}
          lines={data.receivers[receiver.id]?.lines ?? []}
          kind={picking.kind}
          picked={picking.lineId}
          onKind={(kind) => choose(receiver.id, kind)}
          onPick={(lineId) => setPicking({ ...picking, lineId })}
          onSend={() => {
            setData((d) => sendTruck(d, receiver.id, picking.kind));
            setPicking(null);
          }}
          onClose={() => setPicking(null)}
        />
      )}
    </>
  );
}
