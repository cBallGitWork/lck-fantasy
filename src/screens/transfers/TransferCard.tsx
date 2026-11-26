import type { ReactNode } from "react";
import { bestOf, Crest, formatWon, LinkGo, ordinal, pct, perGame } from "../../parts";
import { cardGo } from "../../paths";
import { ROLE_NAME } from "../../rift";
import type { CardFacts } from "./card";
import type { ListPlayer } from "./plan";
import { against, dayLength, of, seasonAmong, WORDS } from "./words";
import "./TransferCard.css";

/**
 * The tapped player's card under the Rift (approved/transfers/, What binds 6): crest, name, team, role and
 * price; `× Sell` for one of yours or `+ Buy` for one from the list, and Full card ›; season Points and
 * Owned with their rank among his role, the scoring lines' season figures and no Form; his last 3
 * series each with its opponent, and his next 3.
 */
export function TransferCard({ player: p, facts, mine, onKey }: { player: ListPlayer; facts?: CardFacts; mine: boolean; onKey: () => void }) {
  const s = facts?.season;
  return (
    <section className="transfers__card" aria-label={p.name}>
      <div className="transfers__card-who">
        <div className="transfers__card-head">
          <Crest team={p.team} size="crestCard" />
          <div>
            <h2 className="transfers__card-name">{p.name}</h2>
            <span className="quiet">
              {p.team} · {ROLE_NAME[p.role]} · <span className="num">{formatWon(p.priceWon)}</span>
            </span>
          </div>
        </div>
        <div className="transfers__card-keys">
          <button type="button" className={mine ? "transfers__card-sell" : "transfers__card-buy"} onClick={onKey}>
            {mine ? WORDS.sellKey : WORDS.buyKey}
          </button>
          <LinkGo go={cardGo(p.id, p.role === "coach")}>{WORDS.fullCard}</LinkGo>
        </div>
      </div>
      {facts && (
        <>
          <div className="transfers__card-mid">
            <p className="transfers__card-label quiet">{seasonAmong(facts.among, p.role)}</p>
            <dl className="transfers__card-stats">
              <Stat k={WORDS.points} figure={p.points} rank={ordinal(facts.pointsRank)} />
              <Stat k={WORDS.owned} figure={pct(p.ownedPct)} rank={ordinal(facts.ownedRank)} />
              {s && (
                <>
                  <Stat k={WORDS.goldLead} figure={of(s.goldLead, s.games)} rank={WORDS.games} />
                  <Stat k={WORDS.soloKills} figure={s.soloKills} />
                  <Stat k={WORDS.killsPerGame} figure={perGame(s.kills, s.games)} />
                  <Stat k={WORDS.deathsPerGame} figure={perGame(s.deaths, s.games)} />
                  <Stat k={WORDS.assistsPerGame} figure={perGame(s.assists, s.games)} />
                  <Stat k={WORDS.firstBlood} figure={s.firstBlood} />
                </>
              )}
            </dl>
          </div>
          <div className="transfers__card-series">
            <p className="transfers__card-label quiet">{WORDS.last3}</p>
            <ul className="transfers__card-cells">
              {facts.last3.map((g, i) => (
                <li key={i}>
                  <b className="num">{g.points}</b>
                  <span className="quiet">{against([g.opponent])}</span>
                </li>
              ))}
            </ul>
            <p className="transfers__card-label quiet">{WORDS.next3}</p>
            <ul className="transfers__card-cells">
              {facts.next3.map((g, i) => (
                <li key={i}>
                  <b>{against([g.opponent])}</b>
                  <span className="quiet">{dayLength(g.day, bestOf(g.bestOf))}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}

/** One figure in its cell: its name, the figure, and its rank or unit after it. */
function Stat({ k, figure, rank }: { k: string; figure: ReactNode; rank?: string }) {
  return (
    <div className="transfers__card-stat">
      <dt className="quiet">{k}</dt>
      <dd>
        <b className="num">{figure}</b>
        {rank && <span className="quiet">{rank}</span>}
      </dd>
    </div>
  );
}
