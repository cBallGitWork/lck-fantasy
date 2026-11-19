import type { ReactNode } from "react";
import { cx, FinalTag, GoLink, LinkGo, LiveTag, NotFinalTag, PageFrame, score, Tag, Time } from "../../parts";
import { PATHS } from "../../paths";
import "./series.css";
import { gameWon, RosterList, TeamGrid } from "./TeamGrid";
import type { NextSeries, PlayedSeries, SeriesView, SeriesWhen, Side } from "./types";
import { weekLine, WORDS } from "./words";

function Frame({ account, children }: { account: string | null; children: ReactNode }) {
  return (
    <PageFrame screen="series" active="hub" account={account}>
      <div className="series__crumb">
        <GoLink go={{ to: PATHS.hub }}>{WORDS.backToHub}</GoLink>
      </div>
      {children}
    </PageFrame>
  );
}

/** The scorebug: each team's code and record in a box, the series score (or `v`) between. */
function Scorebug({ home, away, middle, loser }: { home: Side; away: Side; middle: string; loser?: "home" | "away" }) {
  const named = (s: Side) => s.name !== s.code;
  return (
    <div className="series__bug">
      <div className={cx("series__bug-team", loser === "home" && "series__bug-team--lost")}>
        <b className="series__bug-code">{home.code}</b>
        <small className="quiet num">{named(home) ? `${home.name} · ${home.record}` : home.record}</small>
      </div>
      <div className={cx("series__bug-score num", middle === WORDS.versus && "series__bug-score--v")}>{middle}</div>
      <div className={cx("series__bug-team series__bug-team--away", loser === "away" && "series__bug-team--lost")}>
        <small className="quiet num">{named(away) ? `${away.record} · ${away.name}` : away.record}</small>
        <b className="series__bug-code">{away.code}</b>
      </div>
    </div>
  );
}

const whenLine = (w: SeriesWhen) => `${weekLine(w.competition, w.week)} · ${w.day} ${w.date}`;

/** The line under the scorebug: its tags and words, the time, then Watch › while live or before. */
function Meta({ when, watch, children }: { when: SeriesWhen; watch: boolean; children: ReactNode }) {
  return (
    <div className="series__meta">
      {children}
      <Time local={when.local} />
      {watch && <LinkGo go={{ to: PATHS.live }}>{WORDS.watch}</LinkGo>}
    </div>
  );
}

function Played({ series, live, account }: { series: PlayedSeries; live: boolean; account: string | null }) {
  const { home, away, games, when } = series;
  const wins = (code: string) => games.filter((g) => gameWon(g, code)).length;
  const [h, a] = [wins(home.code), wins(away.code)];
  const loser = live || h === a ? undefined : h < a ? "home" : "away";
  return (
    <Frame account={account}>
      <Scorebug home={home} away={away} middle={score([h, a])} loser={loser} />
      <Meta when={when} watch={live}>
        {live ? (
          <>
            <span className="series__tags">
              <LiveTag />
              <NotFinalTag />
            </span>
            <span>{WORDS.liveNote}</span>
          </>
        ) : (
          <FinalTag final />
        )}
        <span>
          {when.format} · {whenLine(when)}
        </span>
      </Meta>
      <div className="series__two">
        <TeamGrid team={home} games={games} details />
        <TeamGrid team={away} games={games} />
      </div>
    </Frame>
  );
}

/** Final: both grids, the loser's code at plain weight, the coach's W +3 or L −1 (1440.png, 1440-21.png). */
export function SeriesFinal({ series, account }: { series: PlayedSeries; account: string | null }) {
  return <Played series={series} live={false} account={account} />;
}

/** Live: the live game's clock, `Not final`, and Watch › (1440-live.png). */
export function SeriesLive({ series, account }: { series: PlayedSeries; account: string | null }) {
  return <Played series={series} live account={account} />;
}

/** Before it starts: both rosters, coach last (1440-next.png). */
export function SeriesNext({ series, account }: { series: NextSeries; account: string | null }) {
  const { home, away, when } = series;
  return (
    <Frame account={account}>
      <Scorebug home={home} away={away} middle={WORDS.versus} />
      <Meta when={when} watch>
        <Tag>{when.format}</Tag>
        <span>{whenLine(when)}</span>
      </Meta>
      <div className="series__two">
        <RosterList team={home} />
        <RosterList team={away} />
      </div>
    </Frame>
  );
}

/** The Series page in whichever state its series is in. */
export function SeriesPage({ view, account }: { view: SeriesView; account: string | null }) {
  switch (view.state) {
    case "final":
      return <SeriesFinal series={view.series} account={account} />;
    case "live":
      return <SeriesLive series={view.series} account={account} />;
    case "next":
      return <SeriesNext series={view.series} account={account} />;
  }
}
