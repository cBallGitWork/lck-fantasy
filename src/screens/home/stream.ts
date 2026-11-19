import { DEFAULT_STREAM, type Stream } from "../../fixtures/streams";

/**
 * The stream that plays as a series starts (spec/12, Live): the manager's remembered pick while it
 * is live, else the official English stream. The pick itself is kept for next time.
 */
export function streamToPlay(streams: readonly Stream[], remembered: string, fallback = DEFAULT_STREAM): string {
  return streams.some((s) => s.id === remembered && s.live) ? remembered : fallback;
}
