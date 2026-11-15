import { useNavigate } from "@tanstack/react-router";
import { PATHS } from "../../paths";
import { HOME_LIVE } from "./fixtures";
import { HomeIdle } from "./Idle";
import { HomeLive } from "./Live";
import type { HomeData } from "./types";

/** Home in whichever state its data is in: a series live, or nothing live. */
export function Home({ data, onPickStream }: { data: HomeData; onPickStream?: (id: string) => void }) {
  const navigate = useNavigate();
  const actions = {
    onPickTeam: () => void navigate({ to: PATHS.pickTeam }),
    onTransfers: () => void navigate({ to: PATHS.transfers }),
  };
  return data.state === "live" ? <HomeLive data={data} onPickStream={onPickStream} {...actions} /> : <HomeIdle data={data} {...actions} />;
}

/** The route: made-up data until the backend's query feeds it (issue #80). */
export function HomeScreen() {
  return <Home data={HOME_LIVE} />;
}
