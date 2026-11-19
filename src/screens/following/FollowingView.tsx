import {
  CHEER_KEY,
  CHEER_LABEL,
  CHEER_WORD,
  CHEERS_RECEIVED,
  Columns,
  Deadline,
  Empty,
  GoLink,
  Led,
  NotFinalTag,
  OutlinedKey,
  PageFrame,
  PageHead,
  score,
  SideSection,
  signed,
  SponsorNote,
  Tag,
  Time,
  TruckHire,
} from "../../parts";
import { MANAGER } from "../../fixtures/week3";
import { profileGo } from "../../paths";
import {
  movesSummary,
  playersLine,
  SWAPS_SHOWN,
  type DeadlineItem,
  type FeedItem,
  type FeedWeek,
  type FollowingData,
  type Manager,
  type ReceivedCheer,
  type SeriesItem,
} from "./feed";
import { followCount, more, named, sent, topping, WORDS, weekHead } from "./words";
import "./following.css";

export interface FollowingActions {
  onCheer: (managerId: string) => void;
  onAccept: (managerId: string) => void;
  onDecline: (managerId: string) => void;
  onUnfollow: (managerId: string) => void;
  onRemove: (managerId: string) => void;
  onBlock: (managerId: string) => void;
}

/** The Following page (1440.png): the feed on the left; requests, cheers and jeers, following and followers on the right. */
export function FollowingView({ data, ...act }: { data: FollowingData } & FollowingActions) {
  return (
    <PageFrame screen="following" account={MANAGER.team}>
      <PageHead title={WORDS.following} hangul={WORDS.hangul} />
      <Columns className="following__grid">
        <div className="following__feed">
          {data.following.length === 0 ? (
            <Empty title={WORDS.followNoOne} />
          ) : (
            data.feed.map((week) => <Week key={week.week} week={week} data={data} onCheer={act.onCheer} />)
          )}
        </div>
        <div className="following__side">
          <SideSection title={WORDS.requests} note={data.requests.length}>
            {data.requests.length === 0 && <Empty title={WORDS.noRequests} />}
            {data.requests.map((m) => (
              <div key={m.id} className="following__request">
                <Who manager={m} />
                <OutlinedKey onClick={() => act.onAccept(m.id)} label={named(WORDS.accept, m.name)}>
                  {WORDS.accept}
                </OutlinedKey>
                <OutlinedKey onClick={() => act.onDecline(m.id)} label={named(WORDS.decline, m.name)}>
                  {WORDS.decline}
                </OutlinedKey>
              </div>
            ))}
          </SideSection>
          <SideSection title={CHEERS_RECEIVED}>
            {data.cheers.length === 0 && <Empty title={WORDS.noCheers} />}
            {data.cheers.map((c) => (
              <Received key={c.id} cheer={c} />
            ))}
          </SideSection>
          <SideSection title={WORDS.following} note={followCount(data.following.length, data.followCap)}>
            <People people={data.following} actions={[{ label: WORDS.unfollow, on: act.onUnfollow }]} />
          </SideSection>
          <SideSection title={WORDS.followers} note={data.followers.length}>
            <People
              people={data.followers}
              actions={[
                { label: WORDS.remove, on: act.onRemove },
                { label: WORDS.block, on: act.onBlock },
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

function Week({ week, data, onCheer }: { week: FeedWeek; data: FollowingData; onCheer: (id: string) => void }) {
  return (
    <section className="following__week">
      <h2 className="following__week-head">
        {weekHead(week.week)}
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
            {item.kind === "series" ? <Series item={item} multiplier={data.captainMultiplier} /> : <Moves item={item} />}
          </div>
          <CheerCell item={item} week={week} data={data} onCheer={onCheer} />
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
      {item.bigCaptain && (
        <>
          {" "}
          <Tag>{WORDS.bigCaptain}</Tag>
        </>
      )}
      <small className="following__sub">{playersLine(item.players, multiplier)}</small>
      <span className="following__when">
        {WORDS.ended} <Time {...item.ended} />
      </span>
    </>
  );
}

function Moves({ item }: { item: DeadlineItem }) {
  const shown = item.swaps.slice(0, SWAPS_SHOWN);
  const hidden = item.swaps.length - shown.length;
  return (
    <>
      {movesSummary(item)}
      {item.swaps.length > 0 && <span className="following__so-far">{WORDS.soFar}</span>}
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
      {hidden > 0 && <small className="following__sub">{more(hidden)}</small>}
    </>
  );
}

/** `Cheer / Jeer ›` on a cheerable week's row, or the cheer or jeer already sent to that manager this week. */
function CheerCell({ item, week, data, onCheer }: { item: FeedItem; week: FeedWeek; data: FollowingData; onCheer: (id: string) => void }) {
  if (!week.cheerable) return <span />;
  const kind = data.sent[item.manager.id];
  if (kind) return <span className="following__sent">{sent(CHEER_WORD[kind])}</span>;
  return (
    <button
      type="button"
      className="following__cheer key-bare hover-line"
      aria-label={named(CHEER_LABEL, item.manager.name)}
      onClick={() => onCheer(item.manager.id)}
    >
      {CHEER_KEY} ›
    </button>
  );
}

function Received({ cheer }: { cheer: ReceivedCheer }) {
  return (
    <div className="following__parked">
      <Led>{cheer.text}</Led>
      <div className="following__by quiet">
        {cheer.kind === "sponsor" ? (
          <>
            <span>
              {WORDS.sponsorCheer} <b>{topping(cheer.league)}</b>
            </span>
            <span>{cheer.sponsor}</span>
          </>
        ) : (
          <>
            <span>
              {CHEER_WORD[cheer.kind]} {WORDS.from}{" "}
              <GoLink className="following__name hover-line" go={profileGo(cheer.from.id)}>
                {cheer.from.name}
              </GoLink>
            </span>
            <TruckHire />
          </>
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
              <button key={a.label} type="button" className="following__act key-bare hover-line" aria-label={named(a.label, m.name)} onClick={() => a.on(m.id)}>
                {a.label}
              </button>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
