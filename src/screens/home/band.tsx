import { count, Led, LinkGo, ordinal, RankMove, SideSection, Table } from "../../parts";
import { PATHS } from "../../paths";
import type { FeedItem, HomeLeague } from "./types";

function FeedRow({ item, onTruck }: { item: FeedItem; onTruck?: (item: FeedItem) => void }) {
  if (item.kind === "truck") {
    return (
      <div className="home__feed-row home__feed-row--truck">
        <Led>{item.line}</Led>
        <div>
          <b>Truck from {item.from}</b>
          <small className="home__feed-small quiet">Week {item.week}</small>
        </div>
      </div>
    );
  }
  const what = item.kind === "captain" ? `Captain ${item.player}` : item.series;
  const small = item.kind === "captain" ? `${item.points} pts in ${item.series}` : `${item.points} pts`;
  return (
    <div className="home__feed-row">
      <div>
        <b>{item.manager}</b> · {what}
        <small className="home__feed-small quiet">{small}</small>
      </div>
      <button type="button" className="home__truck key-bare hover-line" onClick={() => onTruck?.(item)}>
        Truck ›
      </button>
    </div>
  );
}

export function Following({ items, onTruck }: { items: FeedItem[]; onTruck?: (item: FeedItem) => void }) {
  return (
    <SideSection title="Following">
      {items.map((item) => (
        <FeedRow key={item.id} item={item} onTruck={onTruck} />
      ))}
      <div className="home__more">
        <LinkGo go={{ to: PATHS.following }}>Following</LinkGo>
      </div>
    </SideSection>
  );
}

/** Each league's rank and move; Overall is left out, since the head shows it. */
export function Leagues({ leagues }: { leagues: HomeLeague[] }) {
  return (
    <SideSection title="Leagues">
      <Table
        label="Leagues"
        rows={leagues}
        rowKey={(l) => l.id}
        columns={[
          { key: "name", head: "League", cell: (l) => l.name, fullText: (l) => l.name },
          { key: "rank", head: "Rank", figure: true, cell: (l) => (l.kind === "private" ? ordinal(l.rank) : count(l.rank)) },
          { key: "move", head: "Move", figure: true, width: "goCol", cell: (l) => <RankMove move={l.move} /> },
        ]}
      />
      <div className="home__more">
        <LinkGo go={{ to: PATHS.leagues }}>All leagues</LinkGo>
      </div>
    </SideSection>
  );
}
