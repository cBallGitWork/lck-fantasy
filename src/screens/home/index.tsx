import { useNavigate } from "@tanstack/react-router";
import { useDevState } from "../../parts";
import { PATHS } from "../../paths";
import type { FollowingData } from "../following/feed";
import { FOLLOWING } from "../following/fixtures";
import { useCheerPicker, type Picking } from "../following/useCheerPicker";
import { HOME_LIVE, HOME_STATES } from "./fixtures";
import { HomePage } from "./Home";
import type { HomeData } from "./types";

/**
 * Home in whichever state its data is in: a series live, or nothing live. `following` feeds the
 * cheer picker its Following panel opens (spec/14), Following's made-up Week 3 until the backend
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
    onPickStream,
    sent: cheering.data.sent,
    onCheer: cheering.open,
  };
  return (
    <>
      <HomePage data={data} actions={actions} />
      {cheering.sheet}
    </>
  );
}

/** The route: made-up data until the backend's query feeds it (issue #80). `?state=idle`, `boost` or `boost-live` opens the pictures' other states, in dev. */
export function HomeScreen() {
  return <Home data={useDevState(HOME_STATES) ?? HOME_LIVE} />;
}
