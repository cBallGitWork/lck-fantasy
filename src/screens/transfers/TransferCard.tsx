import type { ReactNode } from "react";
import { Crest, formatWon, LinkGo, ordinal, pct, perGame } from "../../parts";
import { cardGo } from "../../paths";
import { RiftCard } from "../../rift";
import type { CardFacts } from "./card";
import type { ListPlayer } from "./plan";
import { of, seasonRank, WORDS } from "./words";
import "./TransferCard.css";

/**
 * The tapped player's card under the Rift (approved/transfers/, What binds 6), the card Points shares: its
 * head his crest, role, team, name and price, his season points at the right with their rank among his
 * role; a ruled strip of season figures, the rank under where there is one, and no Form; Last 3 and Next 3,
 * each series a crest, a code and its points or its day; Full card ›, and `× Sell` for one of yours or
 * `+ Buy` for one from the list.
 */
export function TransferCard({ player: p, facts, mine, onKey }: { player: ListPlayer; facts?: CardFacts; mine: boolean; onKey: () => void }) {
  const s = facts?.season;
  return (
    <RiftCard
      className="transfers__card"
      name={p.name}
      team={p.team}
      role={p.role}
      marks={<span className="num">{formatWon(p.priceWon)}</span>}
      note={facts && seasonRank(facts.pointsRank, facts.among, p.role)}
      figure={p.points}
    >
      {facts && (
        <dl className="transfers__card-strip">
          <Stat k={WORDS.owned} figure={pct(p.ownedPct)} rank={ordinal(facts.ownedRank)} />
          {s && (
            <>
              <Stat k={WORDS.goldLead} figure={of(s.goldLead, s.games)} />
              <Stat k={WORDS.soloKills} figure={s.soloKills} />
              <Stat k={WORDS.firstBlood} figure={s.firstBlood} />
              <Stat k={WORDS.killsPerGame} figure={perGame(s.kills, s.games)} />
              <Stat k={WORDS.deathsPerGame} figure={perGame(s.deaths, s.games)} />
              <Stat k={WORDS.assistsPerGame} figure={perGame(s.assists, s.games)} />
            </>
          )}
        </dl>
      )}
      <div className="transfers__card-foot">
        {facts && (
          <>
            <Run label={WORDS.last3}>
              {facts.last3.map((g, i) => (
                <SeriesCell key={i} team={g.opponent}>
                  <b className="num">{g.points}</b>
                </SeriesCell>
              ))}
            </Run>
            <Run label={WORDS.next3}>
              {facts.next3.map((g, i) => (
                <SeriesCell key={i} team={g.opponent}>
                  <span className="quiet">{g.day}</span>
                </SeriesCell>
              ))}
            </Run>
          </>
        )}
        <span className="transfers__card-keys">
          <LinkGo go={cardGo(p.id, p.role === "coach")}>{WORDS.fullCard}</LinkGo>
          <button type="button" className={mine ? "transfers__card-sell" : "transfers__card-buy"} onClick={onKey}>
            {mine ? WORDS.sellKey : WORDS.buyKey}
          </button>
        </span>
      </div>
    </RiftCard>
  );
}

/** One figure in the strip: its name, the figure, and its rank under it. */
function Stat({ k, figure, rank }: { k: string; figure: ReactNode; rank?: string }) {
  return (
    <div className="transfers__card-stat">
      <dt className="quiet">{k}</dt>
      <dd className="num">{figure}</dd>
      {rank && <dd className="quiet">{rank}</dd>}
    </div>
  );
}

/** `Last 3` or `Next 3`, then its series. */
function Run({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="transfers__card-run">
      <span className="quiet">{label}</span>
      <ul className="transfers__card-cells">{children}</ul>
    </span>
  );
}

/** A series in a run: the opponent's crest and code, then his points or the day. */
function SeriesCell({ team, children }: { team: string; children: ReactNode }) {
  return (
    <li>
      <Crest team={team} size="crestCell" />
      <span>{team}</span>
      {children}
    </li>
  );
}
