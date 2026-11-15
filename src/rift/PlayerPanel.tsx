import type { ReactNode } from "react";
import { Shirt } from "./Shirt";
import "./PlayerPanel.css";

/**
 * A tapped player's panel, at the top of the side column: shirt, name and meta (`T1 · Mid · Carry`),
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
        <button type="button" className="player-panel__close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </header>
      {children}
    </section>
  );
}
