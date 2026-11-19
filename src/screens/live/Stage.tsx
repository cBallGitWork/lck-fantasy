import { cx, FinalTag, LiveTag, Menu, score as scoreText, Time } from "../../parts";
import { STREAM_DOT, streamLabel } from "../../fixtures/streams";
import type { FinalBug, LiveBug, NextSeries, Picker } from "./types";
import { dot, WORDS } from "./words";

/** The chips the picture draws before `More ▾`. */
const CHIP_ROWS = 6;

/**
 * One chip per stream up to the picture's six; the one you're watching filled, those not live dashed
 * and greyed. More ▾, only when there are more, lists the rest with their channels.
 */
export function StreamPicker({ streams, picked, onPick }: Picker) {
  const more = streams.slice(CHIP_ROWS);
  return (
    <div className="live__picker">
      {streams.slice(0, CHIP_ROWS).map((s) => (
        <button
          key={s.id}
          type="button"
          className={cx("live__chip", s.id === picked && s.live && "live__chip--on", !s.live && "live__chip--off")}
          aria-pressed={s.id === picked}
          onClick={() => onPick(s.id)}
        >
          {s.name}
          {STREAM_DOT}
          <span lang={s.lang}>{s.language}</span>
          <small className="live__chip-platform">{s.platform}</small>
        </button>
      ))}
      {more.length > 0 && (
        <Menu
          label={WORDS.more}
          className="live__chip"
          items={more.map((s) => ({ label: `${streamLabel(s)}${dot}${s.platform}${dot}${s.channel}`, onChoose: () => onPick(s.id) }))}
        />
      )}
    </div>
  );
}

function Score({ home, away, score }: { home: string; away: string; score: readonly [number, number] }) {
  return (
    <span className="live__bug-score">
      <span className="live__bug-team">{home}</span>
      <span className="live__bug-figure num">{scoreText(score)}</span>
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
          <LiveTag />
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
          <FinalTag final />
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
        <Time local={next.local} />
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
