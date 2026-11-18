import type { ReactNode } from "react";
import { Crest, cx, money, LinkGo, oneDecimal, pct, PriceMove, Tag } from "../../parts";
import { cardGo } from "../../paths";
import { isBench, markKey, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PickPlayer } from "./fixtures";
import { ranked, type ViewProps } from "./format";
import { slotOf } from "./model";
import { dot, WORDS } from "./words";

/** The tapped player's card: price and last move, news, form, owned and season with ranks, last 3 series, his keys (his series are on his tile). */
export function PlayerCard({ state, player: p, dispatch }: Omit<ViewProps, "data"> & { player: PickPlayer }) {
  const slot = slotOf(state.draft, p.id);
  const role = slot === "flex" ? `${ROLE_NAME.flex}${dot}${WORDS.plays} ${ROLE_NAME[p.role]}` : ROLE_NAME[p.role];
  const move = p.priceMove;
  return (
    <PlayerPanel
      name={p.name}
      meta={
        <>
          <span className="pick-team__crest">
            <Crest team={p.team} size="crestSmall" />
          </span>
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
      <dl className="pick-team__rows">
        <Row k={WORDS.form}>
          <b className="num">{oneDecimal(p.form)}</b> · {ranked(p.formRank)}
        </Row>
        <Row k={WORDS.owned}>
          <b className="num">{pct(p.ownedPct)}</b> · {ranked(p.ownedRank)}
        </Row>
        <Row k={WORDS.season}>
          <b className="num">{p.season}</b> · {ranked(p.seasonRank)}
        </Row>
      </dl>
      <dl className="pick-team__rows">
        <Row k={WORDS.last3}>
          <span className="num">{p.last3.join(dot)}</span>
        </Row>
      </dl>
      <CardKeys state={state} player={p} starter={slot !== undefined && !isBench(slot)} dispatch={dispatch} />
    </PlayerPanel>
  );
}

function Row({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="pick-team__row">
      <dt className="pick-team__label">{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/**
 * The card's keys: Make Captain (or ✓ Captain), Full card ›. A swap needs no key: the players he
 * can swap with are lit on the board. The coach, and a bench player, have only Full card.
 */
function CardKeys({ state, player: p, starter, dispatch }: Omit<ViewProps, "data"> & { player: PickPlayer; starter: boolean }) {
  const full = <LinkGo go={cardGo(p.id, p.role === "coach")}>{WORDS.fullCard}</LinkGo>;
  if (p.role === "coach" || !starter) return <div className="pick-team__keys">{full}</div>;
  const on = state.draft.captain === p.id;
  return (
    <div className="pick-team__keys">
      <CardKey on={on} onClick={() => dispatch({ type: "makeCaptain", id: p.id })}>
        {markKey("C", on)}
      </CardKey>
      {full}
    </div>
  );
}

function CardKey({ on, onClick, children }: { on?: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" className={cx("pick-team__key", on && "pick-team__key--on")} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}
