import { useId, type ReactNode } from "react";
import { beyondStrip, count, Crest, Empty, money, inOut, LinkGo, oneDecimal, ordinal, OutlinedKey, pct, perGame, placeOf, PriceMove, SeriesStrip, SideSection, signed, Table, TabPanel, Tabs, Tag } from "../../parts";
import { playerId } from "../../fixtures/competition";
import { compareGo } from "../../paths";
import { ROLE_NAME } from "../../rift";
import { CoachFixtures, CoachHistoryTab, CoachRoster, CoachThisWeek } from "./CoachTabs";
import { COACH_TABS, type CoachCardData, type CoachFrom, type CoachSeason, type CoachTab, type SeasonLine } from "./types";
import { coachesOf, EMPTY_TAB, formPlace, gamesCount, ownedPlace, seasonPlace, transfersThisWeek, WORDS } from "./words";

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
  const tabsId = useId();
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
          <p className="coach-card__legal quiet">{head.legal}</p>
        </div>
        <div className="coach-card__side">
          <p className="coach-card__hero">
            <b className="coach-card__hero-figure num">{season.points}</b>
            <span className="quiet">
              {seasonPlace(placeOf(season.rank, coachesOf(season.of)))}
            </span>
          </p>
          <div className="coach-card__acts">
            {from === "pickTeam" && <OutlinedKey onClick={onTransferOut}>{WORDS.transferOut}</OutlinedKey>}
            <LinkGo go={compareGo(playerId(head.name))}>{WORDS.compare}</LinkGo>
          </div>
        </div>
      </header>
      <div className="coach-card__meta">
        <Figure figure={money(meta.priceM)}>
          {WORDS.price} <PriceMove money={meta.moveM} />
        </Figure>
        <Figure figure={oneDecimal(meta.form)}>{formPlace(ordinal(meta.formRank))}</Figure>
        <Figure figure={pct(meta.ownedPct)}>{ownedPlace(ordinal(meta.ownedRank))}</Figure>
        <span className="quiet">{transfersThisWeek(inOut(meta.transfersIn, meta.transfersOut))}</span>
      </div>
      <div className="coach-card__body">
        <div className="coach-card__left">
          <SeriesStrip past={data.past} next={data.next} />
          <Tabs id={tabsId} tabs={COACH_TABS} chosen={tab} onChoose={onTab} label={WORDS.card} />
          <TabPanel id={tabsId} className="coach-card__main">
            <TabBody data={data} tab={tab} />
          </TabPanel>
        </div>
        <div className="coach-card__rail">
          <SeasonPanel season={season} />
        </div>
      </div>
    </article>
  );
}

/** The chosen tab's panel, or its empty state when this opening has no data for it. */
function TabBody({ data, tab }: { data: CoachCardData; tab: CoachTab }) {
  const team = data.head.team;
  if (tab === "This week" && data.week) return <CoachThisWeek week={data.week} />;
  if (tab === "Fixtures" && data.fixtures) return <CoachFixtures rows={beyondStrip(data.fixtures, data.next)} team={team} />;
  if (tab === "History" && data.history) {
    // A series being played shows in History too, tagged Live (spec/12, The coach card).
    const shown = beyondStrip(data.history.rows, data.past.filter((s) => !s.live));
    return <CoachHistoryTab history={data.history} shown={shown} team={team} />;
  }
  if (tab === "Roster" && data.roster) return <CoachRoster rows={data.roster} />;
  return <Empty title={EMPTY_TAB[tab]} />;
}

function Figure({ figure, children }: { figure: string; children: ReactNode }) {
  return (
    <span className="quiet">
      <b className="coach-card__kv-figure num">{figure}</b>
      {children}
    </span>
  );
}

/** Each coach line's season: total, per game (blank on the series lines) and points. */
function SeasonPanel({ season }: { season: CoachSeason }) {
  return (
    <SideSection title={WORDS.season} note={gamesCount(count(season.games))}>
      <Table<SeasonLine>
        label={WORDS.season}
        rowKey={(l) => l.name}
        rows={season.lines}
        columns={[
          { key: "line", head: "", cell: (l) => l.name },
          { key: "total", head: WORDS.total, figure: true, cell: (l) => l.total },
          { key: "per", head: WORDS.perGame, figure: true, cell: (l) => (l.series ? "" : <span className="coach-card__soft">{perGame(l.total, season.games)}</span>) },
          { key: "pts", head: WORDS.pts, figure: true, cell: (l) => <b>{signed(l.points)}</b> },
        ]}
      />
    </SideSection>
  );
}
