import { useState } from "react";
import { useDevState } from "../../parts";
import { BlockSheet } from "./BlockSheet";
import { accept, decline, removeFollower, unfollow, type FollowingData } from "./feed";
import { FOLLOWING, PICKER_AS_DRAWN } from "./fixtures";
import { FollowingView } from "./FollowingView";
import { useCheerPicker, type Picking } from "./useCheerPicker";

/** The Following page's route, on the picture's made-up Week 3 until the backend feeds it (#89, #90). `?state=truck` (its picture's name) opens the cheer picker, in dev. */
export function FollowingScreen() {
  return <FollowingPage data={FOLLOWING} initialPicking={useDevState<Picking>({ truck: PICKER_AS_DRAWN })} />;
}

/** The Following page with its controls working, from the data it is fed; `initialPicking` opens the cheer picker, `initialBlocking` Block's confirm on that follower. */
export function FollowingPage({
  data: initial,
  initialPicking = null,
  initialBlocking = null,
}: {
  data: FollowingData;
  initialPicking?: Picking | null;
  initialBlocking?: string | null;
}) {
  const { data, setData, open, closeOn, sheet } = useCheerPicker(initial, initialPicking);
  const [blocking, setBlocking] = useState<string | null>(initialBlocking);
  const blocked = blocking && data.followers.find((m) => m.id === blocking);
  return (
    <>
      <FollowingView
        data={data}
        onCheer={open}
        onAccept={(id) => setData((d) => accept(d, id))}
        onDecline={(id) => setData((d) => decline(d, id))}
        onUnfollow={(id) => {
          setData((d) => unfollow(d, id));
          closeOn(id);
        }}
        onRemove={(id) => setData((d) => removeFollower(d, id))}
        onBlock={setBlocking}
      />
      {sheet}
      {blocked && (
        <BlockSheet
          follower={blocked}
          onBlock={() => {
            setData((d) => removeFollower(d, blocked.id));
            setBlocking(null);
          }}
          onClose={() => setBlocking(null)}
        />
      )}
    </>
  );
}
