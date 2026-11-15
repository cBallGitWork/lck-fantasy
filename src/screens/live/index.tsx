import { useState } from "react";
import { DEFAULT_STREAM, LIVE_NOW, LIVE_STREAMS } from "./fixtures";
import { LiveNow } from "./Live";

export { LiveDown, LiveIdle, LiveNow } from "./Live";

/**
 * Live (docs/design/approved/live/), on the made-up Week 3 until the backend feeds it. It opens on
 * the official English stream; remembering the pick for next time waits on the backend (spec/12).
 */
export function LiveScreen() {
  const [picked, setPicked] = useState(DEFAULT_STREAM);
  return <LiveNow {...LIVE_NOW} picker={{ streams: LIVE_STREAMS, picked, onPick: setPicked }} />;
}
