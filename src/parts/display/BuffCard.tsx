import type { ReactNode } from "react";
import type { BuffEffect } from "../../../convex/squads/buffs";
import { BUFF_STATE, cancelBuff, playBuff, playedWeek, WORDS } from "../words";
import "./BuffCard.css";
import { Hint } from "./Hint";

/** Where a buff stands this week (plate.md, A buff): played in an earlier week, on this week, off while another is on, or free to play. */
export type BuffState = { kind: "available" } | { kind: "on" } | { kind: "unavailable" } | { kind: "played"; week: number };

/** Each effect's gold icon, as the approved picture draws them (approved/pick-team/render.js). */
const ICON: Record<BuffEffect, ReactNode> = {
  benchBoost: <path d="M3 16h18M4 13h16M5 16v4M19 16v4M12 10V3M8.5 6.5 12 3l3.5 3.5" />,
  doubleCaptain: (
    <>
      <circle className="buff-card__icon-back" cx="15.5" cy="10" r="6.5" />
      <circle className="buff-card__icon-coin" cx="9.5" cy="14" r="7" />
      <path className="buff-card__icon-cut" d="M12 11.6a3.2 3.2 0 1 0 0 4.8" />
    </>
  ),
  coachMultiplier: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1" />
      <rect x="17" y="13" width="4" height="6" rx="1" />
      <path d="M19 19c0 2-3 2.5-6 2.5" />
    </>
  ),
};

const stateWord = (s: BuffState) => (s.kind === "played" ? playedWeek(s.week) : BUFF_STATE[s.kind]);

/**
 * A buff, as FPL's chip (plate.md, A buff): its gold icon, its name (a heading) with what it does as its
 * hover, its state under it, and an outlined key: Play when available, Cancel when on this week, none
 * otherwise. Never a count.
 */
export function BuffCard({
  effect,
  name,
  does,
  state,
  onPlay,
  onCancel,
}: {
  effect: BuffEffect;
  name: string;
  /** Its one line (spec/06), shown as the name's hover. */
  does: string;
  state: BuffState;
  onPlay?: () => void;
  onCancel?: () => void;
}) {
  const key =
    state.kind === "available" ? (
      <button type="button" className="buff-card__key" aria-label={playBuff(name)} onClick={onPlay}>
        {WORDS.play}
      </button>
    ) : state.kind === "on" ? (
      <button type="button" className="buff-card__key" aria-label={cancelBuff(name)} onClick={onCancel}>
        {WORDS.cancel}
      </button>
    ) : null;
  return (
    <div className={`buff-card buff-card--${state.kind}`}>
      <svg className="buff-card__icon" viewBox="0 0 24 24" aria-hidden="true">
        {ICON[effect]}
      </svg>
      <h3 className="buff-card__name">
        <Hint line={does}>{name}</Hint>
      </h3>
      <span className="buff-card__state quiet">{stateWord(state)}</span>
      {key}
    </div>
  );
}
