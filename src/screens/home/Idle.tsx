import { LinkGo, SideSection, Time } from "../../parts";
import { PATHS } from "../../paths";
import { MARK_NAME, ROLE_NAME, Shirt } from "../../rift";
import { HomeFrame, type HomeActions } from "./Home";
import "./idle.css";
import { PlayerList, WeekTag, WeekTotal } from "./side";
import type { HomeIdleData, LineupStarter, NextSeries } from "./types";

/** Under a starter's name: his role; a Flex's own role after it (`Flex · Top`). */
function plateRole(s: LineupStarter): string {
  return s.slot === "flex" && s.plays ? `${ROLE_NAME.flex} · ${ROLE_NAME[s.plays]}` : ROLE_NAME[s.slot];
}

/** One starter on the broadcast stage: his shirt, C or V, and his angled name plate. */
function Starter({ starter }: { starter: LineupStarter }) {
  return (
    <li className="home__starter">
      <span className="home__starter-shirt">
        <Shirt team={starter.team} />
      </span>
      {starter.mark && (
        <span className="home__starter-mark" title={MARK_NAME[starter.mark]}>
          {starter.mark}
        </span>
      )}
      <div className="home__plate">
        <b className="home__plate-name">{starter.name}</b>
        <span className="home__plate-role">{plateRole(starter)}</span>
      </div>
    </li>
  );
}

function NextOnStream({ next }: { next: NextSeries }) {
  return (
    <div className="home__next">
      <span className="home__next-label">Next on stream</span>
      <b className="home__next-teams">
        {next.home} v {next.away}
      </b>
      <span className="home__next-when">
        <Time local={`${next.day} ${next.local}`} kst={next.kst} /> · in{" "}
        <b className="num">
          {next.startsIn.days}d {next.startsIn.hours}h
        </b>
      </span>
    </div>
  );
}

/** The week's seven starters as an LCK lineup reveal, the next series on stream, Pick Team ›. */
function LineupStage({ data }: { data: HomeIdleData }) {
  return (
    <div className="home__stage">
      <h2 className="home__stage-title">Week {data.lineupWeek} lineup</h2>
      <span className="home__stage-go">
        <LinkGo go={{ to: PATHS.pickTeam }}>Pick Team</LinkGo>
      </span>
      <NextOnStream next={data.next} />
      <span className="home__floor" />
      <ol className="home__starters" aria-label={`Week ${data.lineupWeek} lineup`}>
        {data.lineup.map((s) => (
          <Starter key={s.slot} starter={s} />
        ))}
      </ol>
    </div>
  );
}

/** Home with nothing live: your lineup on the stage; last week, final, with its star and flop. */
export function HomeIdle({ data, ...actions }: { data: HomeIdleData } & HomeActions) {
  return (
    <HomeFrame
      data={data}
      actions={actions}
      hero={<LineupStage data={data} />}
      side={
        <SideSection title={data.week.label} note={<WeekTag final={data.week.final} />}>
          <WeekTotal week={data.week} />
          <h3 className="home__sub">Star and flop</h3>
          <PlayerList
            label="Star and flop"
            players={[
              { ...data.star, stat: "star" },
              { ...data.flop, stat: "flop" },
            ]}
          />
          <div className="home__more">
            <LinkGo go={{ to: PATHS.points }}>Points</LinkGo>
          </div>
        </SideSection>
      }
    />
  );
}
