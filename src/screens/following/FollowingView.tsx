import { Columns, Deadline, GoLink, Led, NotFinalTag, OutlinedKey, PageFrame, PageHead, score, SideSection, signed, SponsorNote, Tag, Time } from "../../parts";
import { MANAGER } from "../../fixtures/week3";
import { profileGo } from "../../paths";
import {
  movesSummary,
  playersLine,
  SWAPS_SHOWN,
  TRUCK_WORD,
  type DeadlineItem,
  type FeedItem,
  type FeedWeek,
  type FollowingData,
  type Manager,
  type ReceivedTruck,
  type SeriesItem,
} from "./feed";
import "./following.css";

export interface FollowingActions {
  onTruck: (managerId: string) => void;
  onAccept: (managerId: string) => void;
  onDecline: (managerId: string) => void;
  onUnfollow: (managerId: string) => void;
  onRemove: (managerId: string) => void;
  onBlock: (managerId: string) => void;
}

/** The Following page (1440.png): the feed on the left; requests, trucks, following and followers on the right. */
export function FollowingView({ data, ...act }: { data: FollowingData } & FollowingActions) {
  return (
    <PageFrame screen="following" account={MANAGER.team}>
      <PageHead title="Following" hangul="팔로잉" />
      <Columns className="following__grid">
        <div className="following__feed">
          {data.feed.map((week) => (
            <Week key={week.week} week={week} data={data} onTruck={act.onTruck} />
          ))}
        </div>
        <div className="following__side">
          <SideSection title="Requests" note={data.requests.length}>
            {data.requests.map((m) => (
              <div key={m.id} className="following__request">
                <Who manager={m} />
                <OutlinedKey onClick={() => act.onAccept(m.id)}>Accept</OutlinedKey>
                <OutlinedKey onClick={() => act.onDecline(m.id)}>Decline</OutlinedKey>
              </div>
            ))}
          </SideSection>
          <SideSection title="Trucks">
            {data.trucks.map((t) => (
              <Truck key={t.id} truck={t} />
            ))}
          </SideSection>
          <SideSection title="Following" note={`${data.following.length} of ${data.followCap}`}>
            <People people={data.following} actions={[{ label: "Unfollow", on: act.onUnfollow }]} />
          </SideSection>
          <SideSection title="Followers" note={data.followers.length}>
            <People
              people={data.followers}
              actions={[
                { label: "Remove", on: act.onRemove },
                { label: "Block", on: act.onBlock },
              ]}
            />
          </SideSection>
        </div>
      </Columns>
      <SponsorNote />
    </PageFrame>
  );
}

/** A manager's name, opening their profile, with their team under it. */
function Who({ manager }: { manager: Manager }) {
  return (
    <span className="following__who">
      <GoLink className="following__name hover-line" go={profileGo(manager.id)}>
        {manager.name}
      </GoLink>
      <small className="following__team">{manager.team}</small>
    </span>
  );
}

function Week({ week, data, onTruck }: { week: FeedWeek; data: FollowingData; onTruck: (id: string) => void }) {
  return (
    <section className="following__week">
      <h2 className="following__week-head">
        Week {week.week}
        {week.notFinal && <NotFinalTag />}
      </h2>
      {week.deadline && (
        <p className="following__deadline">
          <Deadline {...week.deadline} />
        </p>
      )}
      {week.items.map((item) => (
        <div key={item.id} className="following__item">
          <Who manager={item.manager} />
          <div className="following__what">
            {item.kind === "series" ? <Series item={item} multiplier={data.carryMultiplier} /> : <Moves item={item} />}
          </div>
          <TruckCell item={item} week={week} data={data} onTruck={onTruck} />
        </div>
      ))}
    </section>
  );
}

function Series({ item, multiplier }: { item: SeriesItem; multiplier: number }) {
  return (
    <>
      <span className="following__pts num">{item.points}</span>
      {item.home} {score(item.score)} {item.away}
      {item.bigCarry && (
        <>
          {" "}
          <Tag>Big Carry</Tag>
        </>
      )}
      <small className="following__sub">{playersLine(item.players, multiplier)}</small>
      <span className="following__when">
        Ended <Time {...item.ended} />
      </span>
    </>
  );
}

function Moves({ item }: { item: DeadlineItem }) {
  const shown = item.swaps.slice(0, SWAPS_SHOWN);
  const more = item.swaps.length - shown.length;
  return (
    <>
      {movesSummary(item)}
      {item.swaps.length > 0 && <span className="following__so-far">so far</span>}
      {shown.length > 0 && (
        <span className="following__swaps num">
          {shown.map((s) => (
            <span key={s.out} className="following__swap">
              <span>
                {s.out} → {s.in}
              </span>
              <b>{signed(s.soFar)}</b>
            </span>
          ))}
        </span>
      )}
      {more > 0 && <small className="following__sub">+ {more} more</small>}
    </>
  );
}

/** `Truck ›` on a truckable week's row, or the truck already sent to that manager this week. */
function TruckCell({ item, week, data, onTruck }: { item: FeedItem; week: FeedWeek; data: FollowingData; onTruck: (id: string) => void }) {
  if (!week.truckable) return <span />;
  const sent = data.sent[item.manager.id];
  if (sent) return <span className="following__sent">{TRUCK_WORD[sent]} sent</span>;
  return (
    <button type="button" className="following__truck key-bare hover-line" onClick={() => onTruck(item.manager.id)}>
      Truck ›
    </button>
  );
}

function Truck({ truck }: { truck: ReceivedTruck }) {
  return (
    <div className="following__parked">
      <Led>{truck.text}</Led>
      <div className="following__by quiet">
        {truck.kind === "sponsor" ? (
          <>
            <span>
              Sponsor truck, <b>{truck.league} top</b>
            </span>
            <span>{truck.sponsor}</span>
          </>
        ) : (
          <span>
            {TRUCK_WORD[truck.kind]} from{" "}
            <GoLink className="following__name hover-line" go={profileGo(truck.from.id)}>
              {truck.from.name}
            </GoLink>
          </span>
        )}
      </div>
    </div>
  );
}

function People({ people, actions }: { people: Manager[]; actions: { label: string; on: (id: string) => void }[] }) {
  return (
    <div className="following__people">
      {people.map((m) => (
        <div key={m.id} className="following__person">
          <Who manager={m} />
          <span className="following__acts">
            {actions.map((a) => (
              <button key={a.label} type="button" className="following__act key-bare hover-line" onClick={() => a.on(m.id)}>
                {a.label}
              </button>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
