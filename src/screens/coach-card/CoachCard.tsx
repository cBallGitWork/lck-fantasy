import type { ReactNode } from "react";
import { count, Crest, Empty, eok, inOut, LinkGo, oneDecimal, ordinal, OutlinedKey, pct, perGame, placeOf, PriceMove, SideSection, signed, Table, Tabs, Tag } from "../../parts";
import { PATHS } from "../../paths";
import { ROLE_NAME } from "../../rift";
import { CoachFixtures, CoachHistoryTab, CoachRoster, CoachThisWeek } from "./CoachTabs";
import { COACH_TABS, type CoachCardData, type CoachFrom, type CoachSeason, type CoachTab, type SeasonLine, type StripNext, type StripPast } from "./types";

/**
 * The coach card's body, inside the card the page opens (spec/12, The coach card): the header,
 * the meta line, the series strip and tabs on the left, the Season panel on the right.
 */
export function CoachCard({
  data,
  from,
  tab,
  onTab,
  onTransferOut,
}: {
  data: CoachCardData;
  from: CoachFrom;
  tab: CoachTab;
  onTab: (tab: CoachTab) => void;
  onTransferOut?: () => void;
}) {
  const { head, meta, season } = data;
  return (
    <article className="coach-card">
      {data.news && <p className="coach-card__news">! {data.news}</p>}
      <header className="coach-card__head">
        <Crest team={head.team} />
        <div className="coach-card__who">
          <Tag>{`${ROLE_NAME.coach} · ${head.team}`}</Tag>
          <h1 className="coach-card__name">
            {head.name}
            <span className="coach-card__hangul">{head.hangul}</span>
          </h1>
          <p className="coach-card__legal">{head.legal} · head coach</p>
        </div>
        <div className="coach-card__side">
          <p className="coach-card__hero">
            <b className="coach-card__hero-figure num">{season.points}</b>
            <span className="coach-card__hero-label">
              Season · {placeOf(season.rank, `${season.of} coaches`)}
            </span>
          </p>
          <div className="coach-card__acts">
            {from === "pickTeam" && <OutlinedKey onClick={onTransferOut}>Transfer out</OutlinedKey>}
            <LinkGo go={{ to: PATHS.compare }}>Compare</LinkGo>
          </div>
        </div>
      </header>
      <div className="coach-card__meta">
        <Figure figure={eok(meta.priceEok)}>
          <PriceMove eok={meta.moveEok} />
        </Figure>
        <Figure figure={oneDecimal(meta.form)}>form · {ordinal(meta.formRank)}</Figure>
        <Figure figure={pct(meta.ownedPct)}>owned · {ordinal(meta.ownedRank)}</Figure>
        <span className="coach-card__kv">{inOut(meta.transfersIn, meta.transfersOut)} this week</span>
      </div>
      <div className="coach-card__body">
        <div className="coach-card__left">
          <Strip past={data.past} next={data.next} />
          <Tabs tabs={COACH_TABS} chosen={tab} onChoose={onTab} label="Coach card" />
          <div className="coach-card__main">
            <TabPanel data={data} tab={tab} />
          </div>
        </div>
        <div className="coach-card__rail">
          <SeasonPanel season={season} />
        </div>
      </div>
    </article>
  );
}

/** What an opening without data for a tab shows there, so the panel is never blank. */
export const EMPTY_TAB: Record<CoachTab, string> = {
  "This week": "No series yet",
  Fixtures: "No fixtures left",
  History: "No history yet",
  Roster: "No roster yet",
};

/** The chosen tab's panel, or its empty state when this opening has no data for it. */
function TabPanel({ data, tab }: { data: CoachCardData; tab: CoachTab }) {
  const team = data.head.team;
  if (tab === "This week" && data.week) return <CoachThisWeek week={data.week} />;
  if (tab === "Fixtures" && data.fixtures) return <CoachFixtures rows={data.fixtures} team={team} />;
  if (tab === "History" && data.history) return <CoachHistoryTab history={data.history} team={team} />;
  if (tab === "Roster" && data.roster) return <CoachRoster rows={data.roster} />;
  return <Empty title={EMPTY_TAB[tab]} />;
}

function Figure({ figure, children }: { figure: string; children: ReactNode }) {
  return (
    <span className="coach-card__kv">
      <b className="coach-card__kv-figure num">{figure}</b>
      {children}
    </span>
  );
}

/** The last series with points, a rule, then the next series, the first in ink. */
function Strip({ past, next }: { past: StripPast[]; next: StripNext[] }) {
  return (
    <div className="coach-card__strip">
      {past.map((s) => (
        <div key={`${s.week}-${s.day}`} className="coach-card__strip-cell">
          <span className="coach-card__strip-when">
            W{s.week} · {s.day}
          </span>
          <b className="coach-card__strip-points num">
            {s.points}
            {s.live && <Tag kind="live">Live</Tag>}
          </b>
          <span className="coach-card__strip-when">v {s.opponent}</span>
        </div>
      ))}
      <span className="coach-card__strip-now" />
      {next.map((s, i) => (
        <div key={`${s.week}-${s.day}`} className="coach-card__strip-cell">
          <span className="coach-card__strip-when">
            W{s.week} · {s.day} · {s.format}
          </span>
          <span className={i === 0 ? "coach-card__strip-next coach-card__strip-next--first num" : "coach-card__strip-next num"}>v {s.opponent}</span>
        </div>
      ))}
    </div>
  );
}

/** Each coach line's season: total, per game (blank on the series lines) and points. */
function SeasonPanel({ season }: { season: CoachSeason }) {
  return (
    <SideSection title="Season" note={`${count(season.games)} games`}>
      <Table<SeasonLine>
        label="Season"
        rowKey={(l) => l.name}
        rows={season.lines}
        columns={[
          { key: "line", head: "", cell: (l) => l.name },
          { key: "total", head: "Total", figure: true, cell: (l) => l.total },
          { key: "per", head: "Per game", figure: true, cell: (l) => (l.series ? "" : <span className="coach-card__soft">{perGame(l.total, season.games)}</span>) },
          { key: "pts", head: "Pts", figure: true, cell: (l) => <b>{signed(l.points)}</b> },
        ]}
      />
    </SideSection>
  );
}
