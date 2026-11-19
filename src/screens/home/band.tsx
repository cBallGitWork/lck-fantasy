import { CHEER_KEY, CHEER_LABEL, CHEER_WORD, count, Led, LinkGo, ordinal, RankMove, SideSection, Table, TruckHire, type CheerKind } from "../../parts";
import { PATHS } from "../../paths";
import type { FeedItem, HomeLeague } from "./types";
import { captainOf, ptsIn, scored, sent as sentLine, weekHead, WORDS } from "./words";

/** The Following card's cheering: the cheer or jeer sent each manager this week, by manager id, and the key's action. */
export interface Cheering {
  sent?: Record<string, CheerKind>;
  /** `Cheer / Jeer ›` on an item: opens the picker (spec/14). */
  onCheer?: (managerId: string) => void;
}

/** One Following card item: its key opens the picker on its manager, or says what was sent them this week. */
export function FeedRow({ item, sent, onCheer }: { item: FeedItem } & Cheering) {
  if (item.kind === "received") {
    return (
      <div className="home__feed-row home__feed-row--received">
        <Led>{item.line}</Led>
        <div>
          <b>
            {CHEER_WORD[item.cheer]} {WORDS.from} {item.from}
          </b>
          <small className="home__feed-small quiet">{weekHead(item.week)}</small>
          <TruckHire />
        </div>
      </div>
    );
  }
  const what = item.kind === "captain" ? captainOf(item.player) : item.series;
  const small = item.kind === "captain" ? ptsIn(item.points, item.series) : scored(item.points);
  const already = sent?.[item.managerId];
  return (
    <div className="home__feed-row">
      <div>
        <b>{item.manager}</b> · {what}
        <small className="home__feed-small quiet">{small}</small>
      </div>
      {already ? (
        <span className="home__sent quiet">{sentLine(CHEER_WORD[already])}</span>
      ) : (
        <button
          type="button"
          className="home__cheer key-bare hover-line"
          aria-label={`${CHEER_LABEL} ${item.manager}`}
          onClick={() => onCheer?.(item.managerId)}
        >
          {CHEER_KEY} ›
        </button>
      )}
    </div>
  );
}

export function Following({ items, ...cheering }: { items: FeedItem[] } & Cheering) {
  return (
    <SideSection title={WORDS.following}>
      {items.map((item) => (
        <FeedRow key={item.id} item={item} {...cheering} />
      ))}
      <div className="home__more">
        <LinkGo go={{ to: PATHS.following }}>{WORDS.following}</LinkGo>
      </div>
    </SideSection>
  );
}

/** Each league's rank and move; Overall is left out, since the head shows it. */
export function Leagues({ leagues }: { leagues: HomeLeague[] }) {
  return (
    <SideSection title={WORDS.leagues}>
      <Table
        label={WORDS.leagues}
        rows={leagues}
        rowKey={(l) => l.id}
        columns={[
          { key: "name", head: WORDS.league, cell: (l) => l.name, fullText: (l) => l.name },
          { key: "rank", head: WORDS.rank, figure: true, cell: (l) => (l.kind === "private" ? ordinal(l.rank) : count(l.rank)) },
          { key: "move", head: WORDS.move, figure: true, width: "goCol", cell: (l) => <RankMove move={l.move} /> },
        ]}
      />
      <div className="home__more">
        <LinkGo go={{ to: PATHS.leagues }}>{WORDS.allLeagues}</LinkGo>
      </div>
    </SideSection>
  );
}
