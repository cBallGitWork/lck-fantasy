import { useState, type ReactNode } from "react";
import { eok, inOut, LinkGo, oneDecimal, ordinal, OutlinedKey, pct, Placeholder, placeOf, PriceMove, Tabs, Tag } from "../../parts";
import type { Go } from "../../paths";
import { ROLE_NAME } from "../../rift";
import { CARD_TABS, type CardActions, type CardTab, type PlayerCardData } from "./card";
import { Champions } from "./Champions";
import { FixturesTab } from "./FixturesTab";
import { History } from "./History";
import { SeasonRail } from "./SeasonRail";
import { SeriesStrip } from "./SeriesStrip";
import { ThisWeek } from "./ThisWeek";
import "./PlayerCard.css";


/** Each tab's content; a tab whose data hasn't come yet shows nothing. */
function tabBody(tab: CardTab, card: PlayerCardData): ReactNode {
  switch (tab) {
    case "This week":
      return card.thisWeek && <ThisWeek week={card.thisWeek} />;
    case "Fixtures":
      return card.fixtures && <FixturesTab team={card.team} rows={card.fixtures} />;
    case "History":
      return card.history && <History history={card.history} />;
    case "Champions":
      return card.champions && <Champions rows={card.champions} />;
  }
}

/**
 * The full player card (docs/design/approved/player-card/): the lower third with the season's
 * points, the meta line, the series strip, the tabs and the Season panel. From Pick Team it carries
 * the Pick Team keys (`actions`); from Points, only Compare.
 */
export function PlayerCard({
  card,
  actions,
  compare,
  initialTab,
}: {
  card: PlayerCardData;
  actions?: CardActions;
  compare: Go;
  initialTab: CardTab;
}) {
  const [tab, setTab] = useState(initialTab);
  return (
    <div className="player-card">
      {card.news !== undefined && <p className="player-card__news">! {card.news}</p>}
      <header className="player-card__head">
        <span className="player-card__portrait">
          <Placeholder word="portrait" fill />
        </span>
        <div>
          <Tag>
            {ROLE_NAME[card.role]} · {card.team}
          </Tag>
          <h1 className="player-card__name">
            {card.name}
            <span className="player-card__hangul">{card.hangul}</span>
          </h1>
          <p className="player-card__quiet">{card.legalName}</p>
        </div>
        <div className="player-card__side">
          <p className="player-card__hero">
            <b className="num">{card.season.points}</b>
            <span className="player-card__quiet">
              Season · {placeOf(card.season.place, card.season.field)}
            </span>
          </p>
          <div className="player-card__actions">
            {actions && <PickTeamKeys actions={actions} />}
            <LinkGo go={compare}>Compare</LinkGo>
          </div>
        </div>
      </header>
      <div className="player-card__meta">
        <span className="player-card__quiet">
          <b className="player-card__figure num">{eok(card.priceEok)}</b>
          <PriceMove eok={card.priceMove} />
        </span>
        <span className="player-card__quiet">
          <b className="player-card__figure num">{oneDecimal(card.form)}</b>form · {ordinal(card.formPlace)}
        </span>
        <span className="player-card__quiet">
          <b className="player-card__figure num">{pct(card.ownedPct)}</b>owned · {ordinal(card.ownedPlace)}
        </span>
        <span className="player-card__quiet">{inOut(card.transfersIn, card.transfersOut)} this week</span>
      </div>
      <div className="player-card__body">
        <div className="player-card__main">
          <SeriesStrip past={card.past} next={card.next} />
          <Tabs tabs={CARD_TABS} chosen={tab} onChoose={setTab} label="Player card" />
          <div className="player-card__tab">{tabBody(tab, card)}</div>
        </div>
        <SeasonRail season={card.season} />
      </div>
    </div>
  );
}

/** ✓ Carry (or Make Carry), Make Vice-carry, Swap with bench, Transfer out. */
function PickTeamKeys({ actions }: { actions: CardActions }) {
  return (
    <>
      <OutlinedKey onClick={() => actions.onMark("C")}>{actions.mark === "C" ? "✓ Carry" : "Make Carry"}</OutlinedKey>
      <OutlinedKey onClick={() => actions.onMark("V")}>{actions.mark === "V" ? "✓ Vice-carry" : "Make Vice-carry"}</OutlinedKey>
      <OutlinedKey onClick={actions.onSwap}>Swap with bench</OutlinedKey>
      <OutlinedKey onClick={actions.onTransferOut}>Transfer out</OutlinedKey>
    </>
  );
}
