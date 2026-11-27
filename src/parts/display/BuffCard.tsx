import type { BuffEffect } from "../../../convex/squads/buffs";
import { BUFF_STATE, cancelBuff, playBuff, playedWeek, WORDS } from "../words";
import "./BuffCard.css";
import { BuffIcon } from "./BuffIcon";
import { Hint } from "./Hint";

/** Where a buff stands this week (plate.md, A buff): played in an earlier week, on this week, off while another is on, or free to play. */
export type BuffState = { kind: "available" } | { kind: "on" } | { kind: "unavailable" } | { kind: "played"; week: number };

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
      <BuffIcon effect={effect} className="buff-card__icon" />
      <h3 className="buff-card__name">
        <Hint line={does}>{name}</Hint>
      </h3>
      <span className="buff-card__state quiet">{stateWord(state)}</span>
      {key}
    </div>
  );
}
