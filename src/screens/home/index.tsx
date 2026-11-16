import { useNavigate } from "@tanstack/react-router";
import { useDevState } from "../../parts";
import { PATHS } from "../../paths";
import { HOME_IDLE, HOME_LIVE } from "./fixtures";
import { HomeIdle } from "./Idle";
import { HomeLive } from "./Live";
import type { HomeData } from "./types";

/** Home in whichever state its data is in: a series live, or nothing live. */
export function Home({ data }: { data: HomeData }) {
  const navigate = useNavigate();
  const actions = {
    onPickTeam: () => void navigate({ to: PATHS.pickTeam }),
    onTransfers: () => void navigate({ to: PATHS.transfers }),
  };
  return data.state === "live" ? <HomeLive data={data} {...actions} /> : <HomeIdle data={data} {...actions} />;
}

/** The route: made-up data until the backend's query feeds it (issue #80). `?state=idle` opens nothing live, in dev. */
export function HomeScreen() {
  return <Home data={useDevState({ idle: HOME_IDLE }) ?? HOME_LIVE} />;
}
