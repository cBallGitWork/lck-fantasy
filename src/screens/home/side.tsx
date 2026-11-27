import { BuffIcon, count, FinalTag, GoLink, LinkGo, MainAction, OutlinedKey, ordinal, Panel, pct, RankMove, Tag, Time } from "../../parts";
import { PATHS } from "../../paths";
import { NewsFlag, ROLE_NAME } from "../../rift";
import type { HomeDeadline, HomeLeague, HomeWeek, WeekPick } from "./types";
import "./side.css";
import { FactLabel, Who } from "./who";
import { COUNTDOWN_UNIT, deadlineTitle, weekName, WORDS } from "./words";

/** What the Deadline panel's keys do; the route wires them. */
export interface DeadlineKeys {
  onPickTeam?: () => void;
  onTransfers?: () => void;
}

/** The countdown, Home's one key figure: its numbers large, its units small and grey; days only while there are any. */
function CountdownFigure({ countdown }: { countdown: HomeDeadline["countdown"] }) {
  const units = (["days", "hours", "minutes"] as const).filter((unit, i) => i > 0 || countdown[unit] > 0);
  return (
    <p className="home__count num">
      {units.map((unit) => (
        <span key={unit}>
          {countdown[unit]}
          <small>{COUNTDOWN_UNIT[unit]}</small>
        </span>
      ))}
    </p>
  );
}

/**
 * The side column's first panel (approved/home/, What binds 6): the countdown and the time under it,
 * Pick Team (the page's one filled key) and Transfers, free transfers, the played buff, a row for each
 * starter who may not play (opening Pick Team), then the next three deadlines.
 */
export function DeadlinePanel({ deadline, onPickTeam, onTransfers }: { deadline: HomeDeadline } & DeadlineKeys) {
  return (
    <Panel title={deadlineTitle(deadline.week)} band className="home__panel">
      <CountdownFigure countdown={deadline.countdown} />
      <p className="home__when home__mid">
        <Time local={deadline.local} />
      </p>
      <div className="home__keys">
        <MainAction wide onClick={onPickTeam}>{WORDS.pickTeam}</MainAction>
        <OutlinedKey onClick={onTransfers}>{WORDS.transfers}</OutlinedKey>
      </div>
      <dl className="home__figs">
        <div>
          <dt>{WORDS.freeTransfers}</dt>
          <dd className="num">{deadline.freeTransfers}</dd>
        </div>
        {deadline.buff && (
          <div>
            <dt>{WORDS.buff}</dt>
            <dd className="home__buff">
              <BuffIcon effect={deadline.buff.effect} className="home__buff-icon" />
              {deadline.buff.name}
            </dd>
          </div>
        )}
      </dl>
      {deadline.doubts.map((d) => (
        <GoLink key={d.name} go={{ to: PATHS.pickTeam }} className="home__doubt hover-line">
          <NewsFlag flag={d.flag} className="home__flag" />
          <Who who={d} />
          <span className="home__mid">{ROLE_NAME[d.role]}</span>
          <span className="home__doubt-end">
            <Tag>{d.flag}</Tag>
            <span className="home__mid">{d.note}</span>›
          </span>
        </GoLink>
      ))}
      <dl className="home__figs">
        <div className="home__sub">
          <dt>{WORDS.next}</dt>
        </div>
        {deadline.next.map((n) => (
          <div key={n.week}>
            <dt>{weekName(n.week)}</dt>
            <dd className="home__plain">
              <Time local={n.local} />
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/** A star's or flop's row: his mark and word, who, points, effective ownership. */
function PickRow({ kind, pick }: { kind: "star" | "flop"; pick: WeekPick }) {
  return (
    <tr>
      <td>
        <FactLabel kind={kind} />
      </td>
      <td>
        <Who who={pick} />
      </td>
      <td className="home__fig num">
        <b>{pick.points}</b>
      </td>
      <td className="home__fig home__owned num quiet">{pct(pick.eoPct)}</td>
    </tr>
  );
}

/**
 * The week's panel (What binds 7): titled with its week, Points › in its band; the total with its
 * tags (the buff on, then `Final` or `Not final`); Average; Highest ›; then the last finished week's
 * star and flop, each with points and effective ownership, under a band naming that week.
 */
export function WeekPanel({ week }: { week: HomeWeek }) {
  const { starFlop } = week;
  return (
    <Panel title={weekName(week.week)} band go={<LinkGo go={{ to: PATHS.points }}>{WORDS.points}</LinkGo>} className="home__panel">
      <p className="home__total">
        <b className="num">{week.points}</b>
        {week.buff && <Tag>{week.buff}</Tag>}
        <FinalTag final={week.final} />
      </p>
      <dl className="home__figs">
        <div>
          <dt>{WORDS.average}</dt>
          <dd className="num">{week.average}</dd>
        </div>
        <div>
          <dt>{WORDS.highest}</dt>
          <dd>
            <LinkGo go={{ to: PATHS.perfectGame }}>
              <span className="num">{week.highest}</span>
            </LinkGo>
          </dd>
        </div>
      </dl>
      <table className="home__rows">
        <thead>
          <tr className="home__sub">
            <th colSpan={2}>{weekName(starFlop.week)}</th>
            <th className="home__fig num">{WORDS.pts}</th>
            <th className="home__fig num">{WORDS.owned}</th>
          </tr>
        </thead>
        <tbody>
          {starFlop.stars.map((p) => (
            <PickRow key={`star-${p.name}`} kind="star" pick={p} />
          ))}
          {starFlop.flops.map((p) => (
            <PickRow key={`flop-${p.name}`} kind="flop" pick={p} />
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

/** Each league's rank and move (What binds 8); Overall is left out, since the head shows it. */
export function Leagues({ leagues }: { leagues: HomeLeague[] }) {
  return (
    <Panel title={WORDS.leagues} band go={<LinkGo go={{ to: PATHS.leagues }}>{WORDS.allLeagues}</LinkGo>} className="home__panel">
      <table className="home__rows">
        <tbody>
          {leagues.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td className="home__fig num">
                <b>{l.kind === "private" ? ordinal(l.rank) : count(l.rank)}</b>
              </td>
              <td className="home__fig home__move num">
                <RankMove move={l.move} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
