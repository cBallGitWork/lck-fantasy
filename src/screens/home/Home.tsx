import type { ReactNode } from "react";
import { Columns, count, MainAction, OutlinedKey, PageFrame, PageHead, Placeholder, SponsorNote, TierShield, Time } from "../../parts";
import { Following, Leagues } from "./band";
import { Move } from "./format";
import "./home.css";
import type { Countdown, FeedItem, HomeShared, OverallTier } from "./types";

/** What Home's keys do; the route wires them. */
export interface HomeActions {
  onPickTeam?: () => void;
  onTransfers?: () => void;
  /** Truck › on a Following item: opens the truck picker (spec/14). */
  onTruck?: (item: FeedItem) => void;
}

/** The team name and hangul; beside it, Overall as a tier, its rank and move, the sponsor's badge. */
function HomeHead({ team, hangul, overall }: { team: string; hangul: string; overall: OverallTier }) {
  return (
    <div className="home__head">
      <PageHead title={team} hangul={hangul} />
      <div className="home__tier">
        <TierShield className="home__shield" division={overall.division} />
        <div>
          <div className="home__tier-name">
            {overall.tier}
            <span className="home__tier-hangul" lang="ko">
              {overall.hangul}
            </span>
          </div>
          <div className="home__tier-rank">
            <b className="num">{count(overall.rank)}</b>
            <Move move={overall.move} />
          </div>
        </div>
        <span className="home__badge">
          <Placeholder word="Badge" fill />
        </span>
      </div>
    </div>
  );
}

function CountdownFigure({ countdown }: { countdown: Countdown }) {
  return (
    <div className="home__countdown num">
      {countdown.days}
      <small>d</small>
      {countdown.hours}
      <small>h</small>
      {countdown.minutes}
      <small>m</small>
    </div>
  );
}

/** The full-width deadline bar: the countdown, your time and KST; on the side column's line, Pick Team, Transfers, free transfers. */
function DeadlineBar({ data, actions }: { data: HomeShared; actions: HomeActions }) {
  const { deadline } = data;
  return (
    <section className="home__deadline">
      <h2 className="home__deadline-title">
        Week {deadline.week} deadline <span className="home__deadline-competition">{deadline.competition}</span>
      </h2>
      <div className="home__deadline-left">
        <CountdownFigure countdown={data.countdown} />
        <div className="home__deadline-when">
          Deadline <Time local={deadline.local} kst={deadline.kst} />
        </div>
      </div>
      <div className="home__deadline-keys">
        <MainAction onClick={actions.onPickTeam}>Pick Team</MainAction>
        <OutlinedKey onClick={actions.onTransfers}>Transfers</OutlinedKey>
        <span className="home__free">
          <b className="num">{data.freeTransfers}</b> free {data.freeTransfers === 1 ? "transfer" : "transfers"}
        </span>
      </div>
    </section>
  );
}

/**
 * Home in either state: the head, the deadline bar, then the state's own main and side (`hero`,
 * `side`), then Following and Leagues, then the sponsor.
 */
export function HomeFrame({
  data,
  actions,
  hero,
  side,
}: {
  data: HomeShared;
  actions: HomeActions;
  hero: ReactNode;
  side: ReactNode;
}) {
  return (
    <PageFrame screen="home" active="home" account={data.team}>
      <HomeHead team={data.team} hangul={data.hangul} overall={data.overall} />
      <DeadlineBar data={data} actions={actions} />
      <Columns className="home__row">
        <div className="home__main">{hero}</div>
        <aside className="home__side">{side}</aside>
      </Columns>
      <Columns className="home__row home__row--band">
        <Following items={data.following} onTruck={actions.onTruck} />
        <Leagues leagues={data.leagues} />
      </Columns>
      <div className="home__sponsor">
        <Placeholder word="Sponsor" fill />
      </div>
      <SponsorNote />
    </PageFrame>
  );
}
