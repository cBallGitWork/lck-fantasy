import { useState } from "react";
import { bestOf, cx, LinkGo, LiveTag, Menu, score } from "../../parts";
import { PATHS } from "../../paths";
import { MarkBadge } from "../../rift";
import { STREAM_DOT, streamLabel, type Stream } from "../../fixtures/streams";
import { streamToPlay } from "./stream";
import type { HomeLiveData } from "./types";
import { Who } from "./who";
import { gameOf, WORDS } from "./words";

/** The picker's rows before `More ▾` (spec/12, Live). */
const PICKER_ROWS = 5;

const streamName = (s: Stream) => `${streamLabel(s)}${STREAM_DOT}${s.platform}`;

/**
 * The object while a series is live (approved/home/, What binds 2): one panel, its head on the blue
 * band (`Live`, the score, the game and series length, Live ›); under it the stream, muted, 16:9, and
 * beside it the Live page's picker, then your players in this series with their points so far.
 */
export function StreamPanel({ data, onPickStream }: { data: HomeLiveData; onPickStream?: (id: string) => void }) {
  // The remembered pick plays if it is live; else English plays, and the remembered pick is kept.
  const [picked, setPicked] = useState(() => streamToPlay(data.streams, data.pickedStream));
  const pick = (id: string) => {
    setPicked(id);
    onPickStream?.(id);
  };
  const { live } = data;
  const playing = data.streams.find((s) => s.id === picked);
  const more = data.streams.slice(PICKER_ROWS);
  return (
    <section className="home__object home__stream" aria-label={WORDS.live}>
      <div className="home__band">
        <LiveTag />
        <b className="home__band-title">
          {live.home} <span className="num">{score(live.score)}</span> {live.away}
        </b>
        <span>{gameOf(live.game, bestOf(live.bestOf))}</span>
        <span className="home__band-go">
          <LinkGo go={{ to: PATHS.live }}>{WORDS.live}</LinkGo>
        </span>
      </div>
      <div className="home__screen quiet">
        {playing && streamName(playing)}
        <span className="home__muted">{WORDS.muted}</span>
      </div>
      <div className="home__picker">
        <div className="home__picker-head">
          <h2>{WORDS.streams}</h2>
          {more.length > 0 && (
            <Menu className="home__picker-more key-bare quiet" label={WORDS.more} items={more.map((s) => ({ label: streamName(s), onChoose: () => pick(s.id) }))} />
          )}
        </div>
        <div role="group" aria-label={WORDS.stream}>
          {data.streams.slice(0, PICKER_ROWS).map((s) => (
            <button
              key={s.id}
              type="button"
              className={cx("home__pick", s.id === picked && "home__pick--on", !s.live && "home__pick--off")}
              aria-pressed={s.id === picked}
              disabled={!s.live}
              onClick={() => pick(s.id)}
            >
              {streamLabel(s)}
              <small className="quiet">{s.platform}</small>
            </button>
          ))}
        </div>
        {data.inSeries.length > 0 && (
          <table className="home__rows home__yours">
            <thead>
              <tr className="home__sub">
                <th>{WORDS.yourPlayers}</th>
                <th className="num">{WORDS.pts}</th>
              </tr>
            </thead>
            <tbody>
              {data.inSeries.map((p) => (
                <tr key={p.name}>
                  <td>
                    <span className="home__yours-who">
                      <Who who={{ name: p.name, team: p.team }} />
                      {p.mark && <MarkBadge mark={p.mark} />}
                    </span>
                  </td>
                  <td className="num">
                    <b>{p.points}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
