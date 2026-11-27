import { PageFrame, PageHead, Placeholder, SeriesPanel, SponsorNote, TierMark } from "../../parts";
import { AllManagers, Following, type Cheering } from "./band";
import "./home.css";
import { LineupPanel } from "./Idle";
import { StreamPanel } from "./Live";
import { DeadlinePanel, Leagues, WeekPanel, type DeadlineKeys } from "./side";
import type { HomeData } from "./types";
import { seriesTitle, WORDS } from "./words";

/** What Home's keys do; the route wires them. */
export interface HomeActions extends Cheering, DeadlineKeys {
  onPickStream?: (id: string) => void;
}

/** The head (What binds 1): the team's name and hangul; beside it Overall as a tier, its rank and move, the sponsor's badge. */
function HomeHead({ data }: { data: HomeData }) {
  return (
    <div className="home__head">
      <PageHead title={data.team} hangul={data.hangul} />
      <div className="home__tier">
        <TierMark standing={data.overall} />
        <span className="home__badge">
          <Placeholder word={WORDS.badge} fill />
        </span>
      </div>
    </div>
  );
}

/**
 * Home (docs/design/approved/home/): the head; the object (the stream while a series is live, else
 * the week's lineup); under it the week's series, Following and All managers; in the side column the
 * Deadline panel, the week's, Leagues and the sponsor.
 */
export function HomePage({ data, actions }: { data: HomeData; actions: HomeActions }) {
  const side = (
    <>
      <DeadlinePanel deadline={data.deadline} onPickTeam={actions.onPickTeam} onTransfers={actions.onTransfers} />
      <WeekPanel week={data.week} />
      <Leagues leagues={data.leagues} />
      <Placeholder word={WORDS.sponsor} height="sponsorH" />
      <SponsorNote />
    </>
  );
  return (
    <PageFrame screen="home" active="home" account={data.team} side={side}>
      <HomeHead data={data} />
      {data.state === "live" ? <StreamPanel data={data} onPickStream={actions.onPickStream} /> : <LineupPanel data={data} buff={data.deadline.buff} />}
      <div className="home__under">
        <SeriesPanel title={seriesTitle(data.series.week)} series={data.series.rows} className="home__panel" />
        <Following following={data.following} sent={actions.sent} onCheer={actions.onCheer} />
        <AllManagers weeks={data.managers} />
      </div>
    </PageFrame>
  );
}
