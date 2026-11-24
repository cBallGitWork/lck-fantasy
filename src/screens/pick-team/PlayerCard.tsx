import type { ReactNode } from "react";
import { cx, money, LinkGo, oneDecimal, ordinal, pct, PriceMove, Tag } from "../../parts";
import { cardGo } from "../../paths";
import { isBench, markKey, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PickPlayer } from "./fixtures";
import type { ViewProps } from "./format";
import { slotOf } from "./model";
import { among, dot, WORDS } from "./words";

/**
 * The tapped player's card, as the approved picture: his crest, price and last move; news; form, owned
 * and season each with its rank, the group said once over the ranks; last 3 series; his keys. His series
 * are on his tile.
 */
export function PlayerCard({ state, player: p, dispatch }: Omit<ViewProps, "data"> & { player: PickPlayer }) {
  const slot = slotOf(state.draft, p.id);
  const role = slot === "flex" ? `${ROLE_NAME.flex}${dot}${WORDS.plays} ${ROLE_NAME[p.role]}` : ROLE_NAME[p.role];
  const move = p.priceMove;
  return (
    <PlayerPanel
      name={p.name}
      team={p.team}
      meta={
        <>
          {p.team} · {role} · {money(p.priceM)} {move !== undefined && <PriceMove money={move} />}
        </>
      }
      onClose={() => dispatch({ type: "close" })}
    >
      {p.news && (
        <div className="pick-team__news">
          <Tag>{p.news.flag}</Tag> {p.news.note}
        </div>
      )}
      <p className="pick-team__among quiet">{among(p.among)}</p>
      <dl className="pick-team__rows">
        <Row k={WORDS.form} figure={oneDecimal(p.form)} rank={p.formRank} />
        <Row k={WORDS.owned} figure={pct(p.ownedPct)} rank={p.ownedRank} />
        <Row k={WORDS.season} figure={p.season} rank={p.seasonRank} />
        <div className="pick-team__row">
          <dt className="pick-team__label">{WORDS.last3}</dt>
          <dd className="pick-team__last3 num">
            {p.last3.map((points, i) => (
              <b key={i}>{points}</b>
            ))}
          </dd>
        </div>
      </dl>
      <CardKeys state={state} player={p} starter={slot !== undefined && !isBench(slot)} dispatch={dispatch} />
    </PlayerPanel>
  );
}

/** A figure and its rank in its own column: `Form  19.3  1st`. */
function Row({ k, figure, rank }: { k: string; figure: ReactNode; rank: number }) {
  return (
    <div className="pick-team__row">
      <dt className="pick-team__label">{k}</dt>
      <dd className="num">
        <b>{figure}</b>
        <span className="pick-team__rank quiet">{ordinal(rank)}</span>
      </dd>
    </div>
  );
}

/**
 * The card's keys: Make Captain, or `✓ Captain` as a state on the Captain (gold edge and words on
 * `--fill`, never filled); Full card ›. A swap needs no key: the players he can swap with are lit on the
 * board. The coach, and a bench player, have only Full card.
 */
function CardKeys({ state, player: p, starter, dispatch }: Omit<ViewProps, "data"> & { player: PickPlayer; starter: boolean }) {
  const full = <LinkGo go={cardGo(p.id, p.role === "coach")}>{WORDS.fullCard}</LinkGo>;
  if (p.role === "coach" || !starter) return <div className="pick-team__keys">{full}</div>;
  const on = state.draft.captain === p.id;
  return (
    <div className="pick-team__keys">
      <button
        type="button"
        className={cx("pick-team__key", on && "pick-team__key--on")}
        aria-pressed={on}
        onClick={() => dispatch({ type: "makeCaptain", id: p.id })}
      >
        {markKey("C", on)}
      </button>
      {full}
    </div>
  );
}
