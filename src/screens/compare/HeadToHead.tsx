import type { ReactNode } from "react";
import { cx, eok, Modal, oneDecimal, pct, perGame, Placeholder, placeOf, PriceMove, signed, Tag } from "../../parts";
import { ROLE_NAME } from "../../rift";
import { better, ROLE_PLURAL, type Side } from "./rules";
import type { ComparePlayer, NextSeries, PastSeries } from "./fixtures";
import "./compare.css";

/** One side's lower third: portrait, role and team, name and hangul; Change › under the second player. */
function Face({ player, right, onChange }: { player: ComparePlayer; right?: boolean; onChange?: () => void }) {
  return (
    <div className={cx("compare__face", right && "compare__face--right")}>
      <span className="compare__portrait">
        <Placeholder word="portrait" fill />
      </span>
      <div>
        <span className="compare__tag">
          <Tag>
            {ROLE_NAME[player.role]} · {player.team}
          </Tag>
        </span>
        <h2 className="compare__name">
          {player.name}
          <span className="compare__hangul">{player.hangul}</span>
        </h2>
        {onChange && (
          <button type="button" className="compare__go key-bare" onClick={onChange}>
            Change ›
          </button>
        )}
      </div>
    </div>
  );
}

/** The head: the two lower thirds facing each other across a `v`; the second empty until picked. */
function Faces({ left, right, onChange }: { left: ComparePlayer; right: ComparePlayer | null; onChange?: () => void }) {
  return (
    <div className="compare__faces">
      <Face player={left} />
      <span className="compare__v">v</span>
      {right ? <Face player={right} right onChange={onChange} /> : <span />}
    </div>
  );
}

/** A row of the top table: the left side's figure, the line's name, the right side's figure; the better bold. */
function Row({ label, left, right, mark = null, kind }: { label: string; left: ReactNode; right: ReactNode; mark?: Side; kind?: "big" | "strip" }) {
  return (
    <tr className={cx(kind && `compare__row--${kind}`)}>
      <td className={cx("compare__left", mark === "left" && "compare__better")}>{left}</td>
      <td className="compare__label">{label}</td>
      <td className={cx("compare__right", mark === "right" && "compare__better")}>{right}</td>
    </tr>
  );
}

function Price({ player }: { player: ComparePlayer }) {
  return (
    <>
      {eok(player.priceEok)}
      {player.riseEok !== undefined && <PriceMove eok={player.riseEok} className="compare__move" />}
    </>
  );
}

function Season({ player }: { player: ComparePlayer }) {
  const { points, rank, among } = player.season;
  return (
    <>
      {points}
      <small className="compare__rank">
        {placeOf(rank, `${among} ${ROLE_PLURAL[player.role].toLowerCase()}`)}
      </small>
    </>
  );
}

/** The last 3 series, as the card's strip: when, points, opponent. */
function Past({ series }: { series: PastSeries[] }) {
  return (
    <span className="compare__strip">
      {series.map((s) => (
        <span key={s.when + s.opp} className="compare__series">
          {s.when}
          <b className="compare__series-points">{s.points}</b>v {s.opp}
        </span>
      ))}
    </span>
  );
}

/** The next 3 series: when and opponent, the first in `--text`. */
function Next({ series }: { series: NextSeries[] }) {
  return (
    <span className="compare__strip">
      {series.map((s, i) => (
        <span key={s.when + s.opp} className="compare__series">
          {s.when}
          <em className={cx("compare__series-opp", i === 0 && "compare__series-opp--first")}>v {s.opp}</em>
        </span>
      ))}
    </span>
  );
}

/**
 * Two players, or two coaches, side by side: Season, Form, Price, Owned, Last 3 and Next 3, then
 * each scoring line's total, per game and points, mirrored so the points sit by the line's name.
 * Only Season, Form and line points are marked; there is no overall verdict.
 */
export function HeadToHead({ left, right }: { left: ComparePlayer; right: ComparePlayer }) {
  return (
    <div className="compare__body">
      <table className="compare__top">
        <colgroup>
          <col />
          <col className="compare__label-col" />
          <col />
        </colgroup>
        <tbody>
          <Row label="Season" kind="big" left={<Season player={left} />} right={<Season player={right} />} mark={better(left.season.points, right.season.points)} />
          <Row label="Form" left={oneDecimal(left.form)} right={oneDecimal(right.form)} mark={better(left.form, right.form)} />
          <Row label="Price" left={<Price player={left} />} right={<Price player={right} />} />
          <Row label="Owned" left={pct(left.ownedPct)} right={pct(right.ownedPct)} />
          <Row label="Last 3" kind="strip" left={<Past series={left.last3} />} right={<Past series={right.last3} />} />
          <Row label="Next 3" kind="strip" left={<Next series={left.next3} />} right={<Next series={right.next3} />} />
        </tbody>
      </table>
      <table className="compare__lines">
        <colgroup>
          <col />
          <col className="compare__per-game-col" />
          <col className="compare__points-col" />
          <col className="compare__label-col" />
          <col className="compare__points-col" />
          <col className="compare__per-game-col" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th className="compare__left">Total</th>
            <th className="compare__left">Per game</th>
            <th className="compare__left">Pts</th>
            <th />
            <th className="compare__right">Pts</th>
            <th className="compare__right">Per game</th>
            <th className="compare__right">Total</th>
          </tr>
        </thead>
        <tbody>
          {left.lines.map((line, i) => {
            const other = right.lines[i];
            if (!other || other.line !== line.line) throw new Error(`Compare: ${right.name} has no ${line.line} line`);
            const mark = better(line.points, other.points);
            return (
              <tr key={line.line}>
                <td className="compare__left">{line.total}</td>
                <td className="compare__left">{line.series ? "" : perGame(line.total, left.games)}</td>
                <td className={cx("compare__left", mark === "left" && "compare__better")}>{signed(line.points)}</td>
                <td className="compare__label">{line.line}</td>
                <td className={cx("compare__right", mark === "right" && "compare__better")}>{signed(other.points)}</td>
                <td className="compare__right">{other.series ? "" : perGame(other.total, right.games)}</td>
                <td className="compare__right">{other.total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Compare, as a card over the card it opened from: the faces, then the head-to-head or the search. ✕ closes back to the card. */
export function CompareSheet({
  left,
  right,
  onChange,
  onClose,
  children,
}: {
  left: ComparePlayer;
  right: ComparePlayer | null;
  onChange?: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal kind="card" title={right ? `${left.name} v ${right.name}` : `Compare ${left.name}`} onClose={onClose}>
      <div className="compare">
        <Faces left={left} right={right} onChange={onChange} />
        {children}
      </div>
    </Modal>
  );
}
