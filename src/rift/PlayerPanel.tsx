import type { ReactNode } from "react";
import { cx, gameNo, LinkGo } from "../parts";
import type { Go } from "../paths";
import { Shirt } from "./Shirt";
import { WORDS } from "./words";
import "./PlayerPanel.css";

/**
 * A tapped player's panel, at the top of the side column: shirt, name and meta (`T1 · Mid · Captain`),
 * ✕, then the page's own body.
 */
export function PlayerPanel({
  name,
  meta,
  onClose,
  children,
}: {
  name: string;
  meta: ReactNode;
  onClose?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="player-panel" aria-label={name}>
      <header className="player-panel__head">
        <Shirt small />
        <div>
          <b className="player-panel__name">{name}</b>
          <span className="player-panel__meta">{meta}</span>
        </div>
        <button type="button" className="player-panel__close key-bare" aria-label={WORDS.close} onClick={onClose}>
          ✕
        </button>
      </header>
      {children}
    </section>
  );
}

/** One series in the panel: `v HLE`, then its result (a span, in mid grey), then its games. */
export function PanelSeries({ title, result, children }: { title: string; result: ReactNode; children?: ReactNode }) {
  return (
    <div className="player-panel__series">
      <h4 className="player-panel__series-head">
        {title}
        {result}
      </h4>
      {children}
    </div>
  );
}

/** A game: `G1  Azir · W  [5]`; counted points boxed, a dropped game in mid grey. */
export function PanelGame({ no, what, points, counted }: { no: number; what: ReactNode; points: number; counted: boolean }) {
  return (
    <div className={cx("player-panel__game", !counted && "player-panel__game--dropped")}>
      <span className="quiet">{gameNo(no)}</span>
      <span className="player-panel__game-what">{what}</span>
      <span className="player-panel__game-points num">{counted ? <span className="counted">{points}</span> : points}</span>
    </div>
  );
}

/** The sum: its lines on the left, the figure on the right. */
export function PanelSum({ lines, figure }: { lines: ReactNode; figure: ReactNode }) {
  return (
    <div className="player-panel__sum">
      <span>{lines}</span>
      <b className="player-panel__sum-figure num">{figure}</b>
    </div>
  );
}

/** A label inside the sum's lines, in mid grey: `Your Captain`. */
export function PanelSumLabel({ children }: { children: ReactNode }) {
  return <span className="quiet">{children}</span>;
}

/** `Full stats ›`, to the player's card. */
export function PanelFoot({ go }: { go: Go }) {
  return (
    <div className="player-panel__foot">
      <LinkGo go={go}>{WORDS.fullStats}</LinkGo>
    </div>
  );
}
