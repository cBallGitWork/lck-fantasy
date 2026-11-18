import { useNavigate } from "@tanstack/react-router";
import { useDevState } from "../../parts";
import { PATHS } from "../../paths";
import type { FollowingData } from "../following/feed";
import { FOLLOWING } from "../following/fixtures";
import { useCheerPicker, type Picking } from "../following/useCheerPicker";
import { HOME_IDLE, HOME_LIVE } from "./fixtures";
import { HomeIdle } from "./Idle";
import { HomeLive } from "./Live";
import type { HomeData } from "./types";

/**
 * Home in whichever state its data is in: a series live, or nothing live. `following` feeds the
 * cheer picker its Following card opens (spec/14), Following's made-up Week 3 until the backend
 * feeds it (#89, #90); `initialPicking` opens the picker.
 */
export function Home({
  data,
  onPickStream,
  following = FOLLOWING,
  initialPicking = null,
}: {
  data: HomeData;
  onPickStream?: (id: string) => void;
  following?: FollowingData;
  initialPicking?: Picking | null;
}) {
  const navigate = useNavigate();
  const cheering = useCheerPicker(following, initialPicking);
  const actions = {
    onPickTeam: () => void navigate({ to: PATHS.pickTeam }),
    onTransfers: () => void navigate({ to: PATHS.transfers }),
    sent: cheering.data.sent,
    onCheer: cheering.open,
  };
  return (
    <>
      {data.state === "live" ? <HomeLive data={data} onPickStream={onPickStream} {...actions} /> : <HomeIdle data={data} {...actions} />}
      {cheering.sheet}
    </>
  );
}

/** The route: made-up data until the backend's query feeds it (issue #80). `?state=idle` opens nothing live, in dev. */
export function HomeScreen() {
  return <Home data={useDevState({ idle: HOME_IDLE }) ?? HOME_LIVE} />;
}
