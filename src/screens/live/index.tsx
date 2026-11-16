import { useState } from "react";
import { useDevState } from "../../parts";
import { DEFAULT_STREAM, STREAMS } from "../../fixtures/streams";
import { IDLE_STREAMS, LIVE_DOWN, LIVE_IDLE, LIVE_NOW } from "./fixtures";
import { LiveDown, LiveIdle, LiveNow } from "./Live";

export { LiveDown, LiveIdle, LiveNow } from "./Live";

/**
 * Live (docs/design/approved/live/), on the made-up Week 3 until the backend feeds it. It opens on
 * the official English stream; remembering the pick for next time waits on the backend (spec/12).
 * `?state=idle` or `down` opens those pictures, in dev.
 */
export function LiveScreen() {
  const [picked, setPicked] = useState(DEFAULT_STREAM);
  const picker = { streams: STREAMS, picked, onPick: setPicked };
  const dev = useDevState({
    idle: <LiveIdle {...LIVE_IDLE} picker={{ ...picker, streams: IDLE_STREAMS }} />,
    down: <LiveDown {...LIVE_DOWN} picker={picker} />,
  });
  return dev ?? <LiveNow {...LIVE_NOW} picker={picker} />;
}
