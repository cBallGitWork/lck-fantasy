import { useState } from "react";
import { cx, FinalTag, LinkGo, LiveTag, PageFrame, PageHead, Panel, Placeholder, SeriesPanel, SponsorNote, ViewToggle, WeekStep } from "../../parts";
import { PATHS } from "../../paths";
import { BenchBar, BenchTile } from "../../rift";
import "./points.css";
import { PointsCard } from "./PointsCard";
import { Leagues, YourWeek } from "./PointsSide";
import { PointsCards, PointsRift, TileTotal } from "./PointsTeam";
import { POINTS_VIEWS, type PointsData, type PointsView } from "./types";
import { liveGame, WORDS } from "./words";

/** The Total panel beside the Rift (approved/points/, What binds 3): the week's points, `Not final` until the week is, Average, Highest ›, the live game with Watch ›. */
function Total({ data }: { data: PointsData }) {
  return (
    <Panel title={WORDS.total} band className="points__total">
      <p className="points__total-big">
        <b className="num">{data.total}</b>
        <FinalTag final={data.final} />
      </p>
      <dl className="points__figs">
        <div>
          <dt>{WORDS.average}</dt>
          <dd className="num">{data.average}</dd>
        </div>
        <div>
          <dt>{WORDS.highest}</dt>
          <dd>
            <LinkGo go={{ to: PATHS.perfectGame }}>
              <span className="num">{data.highest}</span>
            </LinkGo>
          </dd>
        </div>
      </dl>
      {data.live && (
        <p className="points__live">
          <LiveTag />
          <b>{liveGame(data.live.home, data.live.away, data.live.game)}</b>
          <LinkGo go={{ to: PATHS.live }}>{WORDS.watch}</LinkGo>
        </p>
      )}
    </Panel>
  );
}

/**
 * Points (docs/design/approved/points/): the head with ‹ week › and the views; the Rift at the main
 * column's left with Total and the bench beside it; under both, the tapped player's week, the Captain's
 * before any tap. The main column stays on screen while the side column (leagues, the week's series,
 * your week, the sponsor) scrolls.
 */
export function PointsPage({
  data,
  view: firstView = "Rift view",
  onView,
  open: firstOpen,
}: {
  data: PointsData;
  /** The view it opens on: Rift on the first visit, then the manager's last choice. */
  view?: PointsView;
  /** Called with each view the manager chooses, so it can be remembered. */
  onView?: (view: PointsView) => void;
  /** The player whose week shows, by name; the Captain's until a tap. */
  open?: string;
}) {
  const [view, setView] = useState(firstView);
  const [open, setOpen] = useState(firstOpen ?? data.starters.find((p) => p.captain)?.name);
  const opened = [...data.starters, ...data.bench].find((p) => p.name === open);
  const chooseView = (next: PointsView) => {
    setView(next);
    onView?.(next);
  };

  const side = (
    <>
      <Leagues leagues={data.leagues} tierGaps={data.tierGaps} />
      {/* This week's series (What binds 8), the panel Home shares. */}
      <SeriesPanel title={WORDS.seriesTitle} series={data.series} className="points__side" />
      <YourWeek picks={data.yourWeek} />
      <Placeholder word={WORDS.sponsor} height="sponsorH" />
      <SponsorNote />
    </>
  );

  const bench = (
    <BenchBar band className="points__bench">
      {data.bench.map((p, i) => {
        const played = p.series.length > 0;
        return (
          <BenchTile
            key={p.name}
            order={i + 1}
            role={p.role}
            name={p.name}
            team={p.team}
            detail={played ? undefined : WORDS.didntPlay}
            points={
              <span className={cx(!p.counts && "points__off")}>
                <TileTotal player={p} />
              </span>
            }
            state={played ? undefined : "out"}
            selected={p.name === open}
            onSelect={() => setOpen(p.name)}
          />
        );
      })}
    </BenchBar>
  );

  return (
    <PageFrame screen="points" active="points" account={data.team} side={side} stickMain>
      <PageHead
        title={data.team}
        hangul={data.hangul}
        line={
          <>
            <WeekStep prev={data.week.prev} next={data.week.next} className="points__week">
              <span className="quiet">{data.week.label}</span>
            </WeekStep>
            <span className="points__views">
              <ViewToggle options={POINTS_VIEWS} chosen={view} onChoose={chooseView} label={WORDS.view} />
            </span>
          </>
        }
      />
      {view === "Rift view" ? (
        <div className="points__object">
          <PointsRift starters={data.starters} open={open} onOpen={setOpen} />
          <div className="points__column">
            <Total data={data} />
            {bench}
          </div>
        </div>
      ) : (
        <>
          <Total data={data} />
          <PointsCards starters={data.starters} open={open} onOpen={setOpen} />
          {bench}
        </>
      )}
      {opened && <PointsCard player={opened} />}
    </PageFrame>
  );
}
