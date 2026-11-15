import { cx, Menu, Tag, Time } from "../../parts";
import type { FinalBug, LiveBug, NextSeries, Picker, Stream } from "./types";
import { dash, dot, WORDS } from "./words";

/** One chip per stream; the one you're watching filled, those not live dashed and greyed. More ▾ lists each channel. */
export function StreamPicker({ streams, picked, onPick }: Picker) {
  const label = (s: Stream) => `${s.name}${dot}${s.language}`;
  return (
    <div className="live__picker">
      {streams.map((s) => (
        <button
          key={s.id}
          type="button"
          className={cx("live__chip", s.id === picked && s.live && "live__chip--on", !s.live && "live__chip--off")}
          aria-pressed={s.id === picked}
          onClick={() => onPick(s.id)}
        >
          {label(s)}
          <small className="live__chip-platform">{s.platform}</small>
        </button>
      ))}
      <Menu
        label={WORDS.more}
        className="live__chip"
        items={streams.map((s) => ({ label: `${label(s)}${dot}${s.platform}${dot}${s.channel}`, onChoose: () => onPick(s.id) }))}
      />
    </div>
  );
}

function Score({ home, away, score }: { home: string; away: string; score: readonly [number, number] }) {
  return (
    <span className="live__bug-score">
      <span className="live__bug-team">{home}</span>
      <span className="live__bug-figure num">{score.join(dash)}</span>
      <span className="live__bug-team">{away}</span>
    </span>
  );
}

export function BugNow({ bug }: { bug: LiveBug }) {
  return (
    <>
      <Score {...bug} />
      <span className="live__bug-game">
        <b className="live__bug-state num">
          <Tag kind="live">{WORDS.live}</Tag>
          {WORDS.game} {bug.game}
        </b>
        {bug.format}
        {dot}
        {bug.stage}
      </span>
    </>
  );
}

export function BugFinal({ bug }: { bug: FinalBug }) {
  return (
    <>
      <Score {...bug} />
      <span className="live__bug-game">
        <b className="live__bug-state num">
          <Tag>{WORDS.final}</Tag>
          {WORDS.lastSeries}
        </b>
        {[bug.day, bug.format, bug.stage].join(dot)}
      </span>
    </>
  );
}

export function Idle({ next }: { next: NextSeries }) {
  return (
    <div className="live__idle">
      <span className="live__idle-line">{[WORDS.next, next.day, next.stage, next.format].join(dot)}</span>
      <div className="live__idle-teams">
        {next.home}
        <span className="live__idle-v">{WORDS.versus}</span>
        {next.away}
      </div>
      <span className="live__idle-line">
        <Time local={next.local} kst={next.kst} />
      </span>
      <div className="live__idle-count num">
        {next.countdown.hours}
        <small className="live__idle-unit">{WORDS.hours}</small>
        {next.countdown.minutes}
        <small className="live__idle-unit">{WORDS.minutes}</small>
      </div>
    </div>
  );
}

