// The made-up Split 1's streams list: admin data, per competition (spec/12). Home's and Live's
// pickers both show this one list, in its order.

/** One stream in the picker. Twitch and YouTube only in the beta. */
export interface Stream {
  id: string;
  name: string;
  /** The language, named in itself: `한국어`. */
  language: string;
  /** Its code, so a screen reader reads the name in its own language: `ko`. */
  lang: string;
  platform: "Twitch" | "YouTube";
  channel: string;
  live: boolean;
}

/** Split 1's streams. The first is the official English stream the pickers open on. */
export const STREAMS: Stream[] = [
  { id: "lck-en-twitch", name: "LCK", language: "English", lang: "en", platform: "Twitch", channel: "twitch.tv/lck", live: true },
  { id: "lck-en-youtube", name: "LCK", language: "English", lang: "en", platform: "YouTube", channel: "youtube.com/@LCKglobal", live: true },
  { id: "lck-ko-youtube", name: "LCK", language: "한국어", lang: "ko", platform: "YouTube", channel: "youtube.com/@LCK", live: true },
  { id: "caedrel", name: "Caedrel", language: "English", lang: "en", platform: "Twitch", channel: "twitch.tv/caedrel", live: true },
  { id: "lck-vi-youtube", name: "LCK", language: "Tiếng Việt", lang: "vi", platform: "YouTube", channel: "youtube.com/@LCKVietnam", live: false },
  { id: "kameto", name: "Kameto", language: "Français", lang: "fr", platform: "Twitch", channel: "twitch.tv/kamet0", live: false },
];

export const DEFAULT_STREAM = STREAMS[0]!.id;

/** The words between a stream's parts: `LCK · English`. */
export const STREAM_DOT = " · ";

/** A stream as a picker names it: `LCK · English`. */
export const streamLabel = (s: Stream) => `${s.name}${STREAM_DOT}${s.language}`;
