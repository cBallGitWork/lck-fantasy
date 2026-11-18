import { useState } from "react";
import { bestOf, cx, FinalTag, LinkGo, LiveTag, Menu, score, SideSection } from "../../parts";
import { PATHS } from "../../paths";
import { HomeFrame, type HomeActions } from "./Home";
import "./Live.css";
import { PlayerList, WeekTotal } from "./side";
import { STREAM_DOT, streamLabel, type Stream } from "../../fixtures/streams";
import { streamToPlay } from "./stream";
import type { HomeLiveData, LiveSeries } from "./types";

/** The picker's rows before `More ▾`, as the picture draws them. */
const PICKER_ROWS = 5;

const streamName = (s: Stream) => `${streamLabel(s)}${STREAM_DOT}${s.platform}`;

/** The stream, muted, 16:9; the series and Live › over it. Until the embed is wired it names the stream. */
function StreamScreen({ series, stream }: { series: LiveSeries; stream: Stream | undefined }) {
  return (
    <div className="home__screen">
      <div className="home__screen-bar">
        <LiveTag />
        <b>
          {series.home} {score(series.score)} {series.away}
        </b>
        <small className="home__screen-small">
          Game {series.game} · {bestOf(series.bestOf)} · {series.label}
        </small>
        <span className="home__screen-space" />
        <LinkGo go={{ to: PATHS.live }}>Live</LinkGo>
      </div>
      <div className="home__screen-video">{stream && streamName(stream)}</div>
    </div>
  );
}

/** The Live page's picker (spec/12): each stream and its platform, the pick in `--text`, one not live greyed out. */
function StreamPicker({ streams, picked, onPick }: { streams: Stream[]; picked: string; onPick: (id: string) => void }) {
  const shown = streams.slice(0, PICKER_ROWS);
  const more = streams.slice(PICKER_ROWS);
  return (
    <div className="home__picker" role="group" aria-label="Stream">
      {shown.map((s) => (
        <button
          key={s.id}
          type="button"
          className={cx("home__stream", s.id === picked && "home__stream--on", !s.live && "home__stream--off")}
          aria-pressed={s.id === picked}
          disabled={!s.live}
          onClick={() => onPick(s.id)}
        >
          {streamLabel(s)}
          <small className="home__stream-platform quiet">{s.platform}</small>
        </button>
      ))}
      {more.length > 0 && (
        <Menu
          className="home__stream home__stream--more"
          label="More ▾"
          items={more.map((s) => ({ label: streamName(s), onChoose: () => onPick(s.id) }))}
        />
      )}
    </div>
  );
}

/** Home while a series is live: the stream and its picker; your week, your players in this series, who is still to play. */
export function HomeLive({ data, onPickStream, ...actions }: { data: HomeLiveData; onPickStream?: (id: string) => void } & HomeActions) {
  // The remembered pick plays if it is live; else English plays, and the remembered pick is kept.
  const [picked, setPicked] = useState(() => streamToPlay(data.streams, data.pickedStream));
  const pick = (id: string) => {
    setPicked(id);
    onPickStream?.(id);
  };
  return (
    <HomeFrame
      data={data}
      actions={actions}
      hero={
        <div className="home__tv">
          <StreamScreen series={data.series} stream={data.streams.find((s) => s.id === picked)} />
          <StreamPicker streams={data.streams} picked={picked} onPick={pick} />
        </div>
      }
      side={
        <SideSection title={data.week.label} note={<FinalTag final={data.week.final} />}>
          <WeekTotal week={data.week} />
          <h3 className="home__sub">In this series</h3>
          <PlayerList players={data.inSeries} label="In this series" />
          <h3 className="home__sub">
            Still to play
            {data.stillToPlay.length === 0 && <span className="home__sub-note quiet">None</span>}
          </h3>
          {data.stillToPlay.length > 0 && <PlayerList players={data.stillToPlay} label="Still to play" />}
          <div className="home__more">
            <LinkGo go={{ to: PATHS.points }}>Points</LinkGo>
          </div>
        </SideSection>
      }
    />
  );
}
