import type { ReactNode } from "react";
import { Crest, cx, MeDot, PlayerPhoto, selectable, Tag } from "../parts";
import "./Lineup.css";
import type { RoleKey, SlotKey } from "./roles";
import { LINEUP_ORDER } from "./roles";
import { MarkBadge, type Mark } from "./MarkBadge";
import { SlotName } from "./SlotName";
import { ROLE_NAME, teamPlays } from "./words";

export interface LineupCardProps {
  slot: SlotKey;
  /** The strip's words in place of the slot's: a bench card's order and role, `1. Mid`. */
  strip?: string;
  /** The role a Flex plays, said after his team: `DK · Top`. */
  plays?: RoleKey;
  name: string;
  team: string;
  /** His media-day portrait for the split; his team's crest until it is saved. */
  photo?: string;
  mark?: Mark;
  me?: boolean;
  /** A tag at the portrait's foot, such as `Not starting`. */
  news?: string;
  /** The line above the footer: the week's fixtures or series points. */
  next?: ReactNode;
  /** The footer: Form and price on Pick Team, points on Points. */
  footer?: ReactNode;
  selected?: boolean;
  /** `dim` while another card is being moved; `fit` where it could go. */
  state?: "dim" | "fit";
  onSelect?: () => void;
}

/**
 * One card in Card view (not the Player card screen), as approved/pick-team/1440-cards.png: the role
 * strip, the portrait (a crest for the Coach, or until his photo is saved) with the C in its corner and
 * a news tag at its foot, name, team (a Flex's role after it), next, footer.
 */
export function LineupCard(p: LineupCardProps) {
  const mark = p.mark && <MarkBadge mark={p.mark} size="card" className="pcard__mark" />;
  return (
    <div className={cx("pcard", p.selected && "pcard--selected", p.state && `pcard--${p.state}`)} {...selectable(p.onSelect, p.selected)}>
      <div className="pcard__role">{p.strip ?? <SlotName slot={p.slot} label={ROLE_NAME[p.slot]} />}</div>
      <div className="pcard__photo">
        {p.slot === "coach" ? <Crest team={p.team} size="crestPortrait" /> : <PlayerPhoto photo={p.photo} name={p.name} team={p.team} crest="crestPortrait" />}
        {mark}
        {p.news && (
          <span className="pcard__news">
            <Tag>{p.news}</Tag>
          </span>
        )}
      </div>
      <div className="pcard__name" title={p.name}>
        {p.name}
        {p.me && <MeDot />}
      </div>
      <div className="pcard__team quiet">{p.plays ? teamPlays(p.team, p.plays) : p.team}</div>
      {p.next !== undefined && <div className="pcard__next">{p.next}</div>}
      {p.footer !== undefined && <div className="pcard__foot">{p.footer}</div>}
    </div>
  );
}

/** Card view: the seven starters in one row, in the LCK broadcast's order. */
export function Lineup({ cards }: { cards: LineupCardProps[] }) {
  const bySlot = new Map(cards.map((c) => [c.slot, c]));
  return (
    <div className="lineup">
      {LINEUP_ORDER.map((slot) => {
        const card = bySlot.get(slot);
        return card ? <LineupCard key={slot} {...card} /> : null;
      })}
    </div>
  );
}
