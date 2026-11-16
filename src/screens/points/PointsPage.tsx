import { useState } from "react";
import { LinkGo, NONE, PageFrame, PageHead, Placeholder, SeriesList, SideSection, SponsorNote, Tag, ViewToggle } from "../../parts";
import { PATHS } from "../../paths";
import { BenchBar, BenchTile } from "../../rift";
import { BreakdownSheet } from "./BreakdownSheet";
import "./Points.css";
import { Leagues, YourWeek } from "./PointsSide";
import { PointsCards, PointsRift } from "./PointsTeam";
import { DIDNT_PLAY, POINTS_VIEWS, type PointsData, type PointsView } from "./types";

/**
 * Points: your week. The head and the live bar; Rift or Card view with the bench under it; on the
 * right leagues, the week's series, your week and the sponsor. A tapped player's breakdown opens
 * as a sheet over the page.
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
  /** The player whose breakdown is open, by name; none until a tap. */
  open?: string;
}) {
  const [view, setView] = useState(firstView);
  const [open, setOpen] = useState(firstOpen);
  const opened = [...data.starters, ...data.bench].find((p) => p.name === open);
  const chooseView = (next: PointsView) => {
    setView(next);
    onView?.(next);
  };

  const side = (
    <>
      <Leagues leagues={data.leagues} nextTier={data.nextTier} />
      <SideSection title="This week's series" note="your time · KST">
        <SeriesList series={data.series} />
      </SideSection>
      <YourWeek picks={data.yourWeek} />
      <div className="points__sponsor">
        <Placeholder word="Sponsor" fill />
      </div>
      <SponsorNote />
    </>
  );

  return (
    <PageFrame screen="points" active="points" account={data.team} side={side}>
      <PageHead
        title={data.team}
        hangul={data.hangul}
        week={data.week}
        figure={data.total}
        tags={data.final ? <Tag>Final</Tag> : <Tag kind="notFinal">Not final</Tag>}
        figures={[
          { label: "Average", value: data.average },
          { label: "Highest", value: data.highest, go: { to: PATHS.perfectGame } },
        ]}
      >
        {data.live && (
          <div className="points__live">
            <Tag kind="live">Live</Tag>
            <b>
              {data.live.home} v {data.live.away}, game {data.live.game}
            </b>
            <LinkGo go={{ to: PATHS.live }}>Watch</LinkGo>
          </div>
        )}
      </PageHead>
      <ViewToggle options={POINTS_VIEWS} chosen={view} onChoose={chooseView} label="View" />
      {view === "Rift view" ? (
        <PointsRift starters={data.starters} open={open} onOpen={setOpen} />
      ) : (
        <PointsCards starters={data.starters} open={open} onOpen={setOpen} />
      )}
      <BenchBar>
        {data.bench.map((p, i) => {
          const played = p.series.length > 0;
          return (
            <BenchTile
              key={p.name}
              order={i + 1}
              role={p.role}
              name={p.name}
              team={p.team}
              detail={played ? undefined : DIDNT_PLAY}
              points={p.points ?? NONE}
              state={played ? undefined : "out"}
              selected={p.name === open}
              onSelect={played ? () => setOpen(p.name) : undefined}
            />
          );
        })}
      </BenchBar>
      {opened && <BreakdownSheet player={opened} onClose={() => setOpen(undefined)} />}
    </PageFrame>
  );
}
