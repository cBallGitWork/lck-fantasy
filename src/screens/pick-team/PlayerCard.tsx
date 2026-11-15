import type { ReactNode } from "react";
import { cx, eok, LinkGo, PriceMove, Tag, Time } from "../../parts";
import { cardGo } from "../../paths";
import { isBench, PlayerPanel, ROLE_NAME } from "../../rift";
import type { PickPlayer } from "./fixtures";
import { opponent, seriesOf } from "../../fixtures/series";
import { ranked, type ViewProps } from "./format";
import { canSwap, slotOf } from "./model";

/** The tapped player's card: price and last move, news, form, owned and season with ranks, last 3 weeks, the week's series, his keys. */
export function PlayerCard({ data, state, player: p, dispatch }: ViewProps & { player: PickPlayer }) {
  const slot = slotOf(state.draft, p.id);
  const role = slot === "flex" ? `${ROLE_NAME.flex} · plays ${ROLE_NAME[p.role]}` : ROLE_NAME[p.role];
  const move = p.priceMove;
  return (
    <PlayerPanel
      name={p.name}
      meta={
        <>
          {p.team} · {role} · {eok(p.priceEok)}{" "}
          {move !== undefined && <PriceMove eok={move} />}
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
        <Row k="Form">
          <b className="num">{p.form.toFixed(1)}</b> · {ranked(p.formRank)}
        </Row>
        <Row k="Owned">
          <b className="num">{p.ownedPct}%</b> · {ranked(p.ownedRank)}
        </Row>
        <Row k="Season">
          <b className="num">{p.season}</b> · {ranked(p.seasonRank)}
        </Row>
      </dl>
      <dl className="pick-team__rows">
        <Row k="Last 3 weeks">
          <span className="num">{p.lastThree.join(" · ")}</span>
        </Row>
      </dl>
      <div className="pick-team__rows">
        {seriesOf(data.series, p.team).map((s) => (
          <div key={s.id} className="pick-team__row">
            <span>
              {s.day} <Time local={s.local} kst={s.kst} />
            </span>
            <span>
              v {opponent(s, p.team)} · Bo{data.bestOf}
            </span>
          </div>
        ))}
      </div>
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
 * The card's keys: Make Carry (or ✓ Carry), Make Vice-carry, Swap with bench (or Cancel swap),
 * Full card ›. The coach, and a bench player, have only Full card.
 */
function CardKeys({ state, player: p, starter, dispatch }: Omit<ViewProps, "data"> & { player: PickPlayer; starter: boolean }) {
  const full = <LinkGo go={cardGo(p.id, p.role === "coach")}>Full card</LinkGo>;
  if (p.role === "coach" || !starter) return <div className="pick-team__keys">{full}</div>;
  const { carry, vice } = state.draft;
  const marksOff = state.swapping !== undefined;
  return (
    <div className="pick-team__keys">
      <CardKey on={carry === p.id} off={marksOff} onClick={() => dispatch({ type: "makeCarry", id: p.id })}>
        {carry === p.id ? "✓ Carry" : "Make Carry"}
      </CardKey>
      <CardKey on={vice === p.id} off={marksOff} onClick={() => dispatch({ type: "makeVice", id: p.id })}>
        {vice === p.id ? "✓ Vice-carry" : "Make Vice-carry"}
      </CardKey>
      {state.swapping === p.id ? (
        <CardKey onClick={() => dispatch({ type: "cancelSwap" })}>Cancel swap</CardKey>
      ) : (
        <CardKey off={!canSwap(state.draft, p.id)} onClick={() => dispatch({ type: "startSwap", id: p.id })}>
          Swap with bench
        </CardKey>
      )}
      {full}
    </div>
  );
}

function CardKey({ on, off, onClick, children }: { on?: boolean; off?: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" className={cx("pick-team__key", on && "pick-team__key--on")} aria-pressed={on} disabled={off} onClick={onClick}>
      {children}
    </button>
  );
}
