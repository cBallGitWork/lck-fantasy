import type { ReactNode } from "react";
import { Crest, cx, MeDot, Placeholder, selectable, Tag } from "../parts";
import "./Lineup.css";
import { RoleIcon } from "./RoleIcon";
import type { RoleKey, SlotKey } from "./roles";
import { COACH_HANGUL, LINEUP_ORDER, ROLE_NAME, slotIcon } from "./roles";
import { MarkBadge, type Mark } from "./MarkBadge";

export interface LineupCardProps {
  slot: SlotKey;
  /** The role a Flex plays. */
  plays?: RoleKey;
  name: string;
  team: string;
  mark?: Mark;
  /** Dual Carry is played: the V is gold as the C (spec/06). */
  dual?: boolean;
  me?: boolean;
  /** A tag on the photo, such as `Not starting`. */
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

function RoleHead({ slot, plays }: { slot: SlotKey; plays?: RoleKey }) {
  const small = slot === "flex" && plays ? `plays ${ROLE_NAME[plays]}` : slot === "coach" ? COACH_HANGUL : undefined;
  return (
    <div className="pcard__role">
      <RoleIcon role={slotIcon(slot, plays)} />
      <span>
        {ROLE_NAME[slot]}
        {small && <small>{small}</small>}
      </span>
    </div>
  );
}

/** One starter's card in Card view (not the Player card screen): role head, photo (a crest for the Coach), name, team, next, footer. */
export function LineupCard(p: LineupCardProps) {
  const mark = p.mark && (
    <MarkBadge mark={p.mark} size="card" dual={p.dual} className="pcard__mark" />
  );
  return (
    <div className={cx("pcard", p.selected && "pcard--selected", p.state && `pcard--${p.state}`)} {...selectable(p.onSelect, p.selected)}>
      <RoleHead slot={p.slot} plays={p.plays} />
      {p.slot === "coach" ? (
        <div className="pcard__photo pcard__photo--crest">
          <Crest team={p.team} />
          {mark}
        </div>
      ) : (
        <div className="pcard__photo">
          <Placeholder word="Photo" fill />
          {mark}
          {p.news && (
            <span className="pcard__news">
              <Tag>{p.news}</Tag>
            </span>
          )}
        </div>
      )}
      <div className="pcard__name" title={p.name}>
        {p.name}
        {p.me && <MeDot />}
      </div>
      <div className="pcard__team quiet">{p.team}</div>
      {p.next !== undefined && <div className="pcard__next">{p.next}</div>}
      {p.footer !== undefined && <div className="pcard__foot quiet">{p.footer}</div>}
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
