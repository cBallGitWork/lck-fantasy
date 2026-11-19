import type { ReactNode } from "react";
import { Columns, count, Hint, HINTS, MainAction, OutlinedKey, PageFrame, PageHead, Placeholder, RankMove, SectionHead, SponsorNote, TierShield, Time } from "../../parts";
import { Following, Leagues, type Cheering } from "./band";
import "./home.css";
import type { Countdown, HomeShared, OverallTier } from "./types";
import { deadlineHead, freeTransfers, WORDS } from "./words";

/** What Home's keys do; the route wires them. */
export interface HomeActions extends Cheering {
  onPickTeam?: () => void;
  onTransfers?: () => void;
}

/** The team name and hangul; beside it, Overall as a tier, its rank and move, the sponsor's badge. */
function HomeHead({ team, hangul, overall }: { team: string; hangul: string; overall: OverallTier }) {
  return (
    <div className="home__head">
      <PageHead title={team} hangul={hangul} />
      <div className="home__tier">
        <TierShield className="home__shield" />
        <div>
          <div className="home__tier-name">
            <Hint line={HINTS.tier}>{overall.tier}</Hint>
            <span className="home__tier-hangul quiet" lang="ko">
              {overall.hangul}
            </span>
          </div>
          <div className="home__tier-rank">
            <b className="num">{count(overall.rank)}</b>
            <RankMove move={overall.move} />
          </div>
        </div>
        <span className="home__badge">
          <Placeholder word={WORDS.badge} fill />
        </span>
      </div>
    </div>
  );
}

function CountdownFigure({ countdown }: { countdown: Countdown }) {
  return (
    <div className="home__countdown num">
      {countdown.days}
      <small>{WORDS.days}</small>
      {countdown.hours}
      <small>{WORDS.hours}</small>
      {countdown.minutes}
      <small>{WORDS.minutes}</small>
    </div>
  );
}

/** The full-width deadline bar: the countdown, your time and the league's; on the side column's line, Pick Team, Transfers, free transfers. */
function DeadlineBar({ data, actions }: { data: HomeShared; actions: HomeActions }) {
  const { deadline } = data;
  return (
    <section className="home__deadline">
      <SectionHead note={deadline.competition} className="home__deadline-title">
        {deadlineHead(deadline.week)}
      </SectionHead>
      <div className="home__deadline-left">
        <CountdownFigure countdown={data.countdown} />
        <div className="home__deadline-when">
          <Time local={deadline.local} kst={deadline.kst} />
        </div>
      </div>
      <div className="home__deadline-keys">
        <MainAction onClick={actions.onPickTeam}>{WORDS.pickTeam}</MainAction>
        <OutlinedKey onClick={actions.onTransfers}>{WORDS.transfers}</OutlinedKey>
        <span className="home__free">
          <b className="num">{data.freeTransfers}</b> {freeTransfers(data.freeTransfers)}
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
        <Following items={data.following} sent={actions.sent} onCheer={actions.onCheer} />
        <Leagues leagues={data.leagues} />
      </Columns>
      <div className="home__sponsor">
        <Placeholder word={WORDS.sponsor} fill />
      </div>
      <SponsorNote />
    </PageFrame>
  );
}
