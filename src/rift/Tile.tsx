import type { ReactNode } from "react";
import { cx, MeDot, selectable } from "../parts";
import { measure } from "../theme/tokens";
import { RiftMap } from "./RiftMap";
import { Shirt } from "./Shirt";
import type { SlotKey } from "./roles";
import { slotLabel } from "./roles";
import { SlotName } from "./SlotName";
import type { RiftPoint } from "./slots";
import { MarkBadge, type Mark } from "./MarkBadge";
import "./Tile.css";

interface TileProps {
  /** His slot; a Flex's tile says Flex, never the role he plays, which his card says (Craig, 16 Nov 2026). */
  slot?: SlotKey;
  name: string;
  team: string;
  /** Where the tile's centre stands on the Rift; a bench tile stands in its bar. */
  at?: RiftPoint;
  mark?: Mark;
  /** His news flag (`Not starting`): a `!` at the shirt's top left, the word in his card. */
  flag?: string;
  /** One of your players. */
  me?: boolean;
  birthday?: boolean;
  /** His price in a dark chip over the card (Transfers). */
  price?: ReactNode;
  /** A `×` at the card's top left: tapping the tile sells him (Transfers). */
  sell?: boolean;
  /** A `↺` in the same corner: tapping the tile puts a sold player back (Transfers). */
  restore?: boolean;
  /** The week's points, in the dark band under the name (Points, Perfect game). */
  points?: ReactNode;
  /** The band's line: the week's fixtures (Pick Team, Transfers), or each series' points under the points. */
  line?: ReactNode;
  selected?: boolean;
  /** `dim` while another tile is being moved, or a bench player who didn't play; `fit` where it could go. */
  state?: "dim" | "fit";
  /** An empty slot (front door, a sold one on Transfers): dashed, `name` its role, `+` under it. */
  empty?: boolean;
  onSelect?: () => void;
}

/** A point on the square Rift as a share of it, so the tiles stay on their lanes at any width. */
const share = (px: number) => `${(px / measure.rift) * 100}%`;

/**
 * One player on the Rift or the bench, as FPL's tile (Craig, 16 Nov 2026): his price chip on Transfers,
 * the Flex's or Coach's label, his shirt on a faint card with C and his flag at its top corners, a
 * white name plate, then a band: his points and series, or his fixtures.
 */
export function Tile(p: TileProps) {
  const label = p.slot && slotLabel(p.slot);
  return (
    <div
      className={cx("tile", !p.at && "tile--bench", p.selected && "tile--selected", p.state && `tile--${p.state}`, p.empty && "tile--empty")}
      style={p.at && { left: share(p.at[0]), top: share(p.at[1]) }}
      {...selectable(p.onSelect, p.selected)}
    >
      {p.price !== undefined && <div className="tile__price num">{p.price}</div>}
      {p.slot && label && (
        <div className={cx("tile__slot", p.slot === "flex" && "tile__slot--flex")}>
          <SlotName slot={p.slot} label={label} />
        </div>
      )}
      <div className="tile__card">
        {(p.sell || p.restore) && (
          <span className="tile__sell" aria-hidden="true">
            {p.restore ? "↺" : "×"}
          </span>
        )}
        <div className="tile__kit">
          <Shirt team={p.team} />
          {p.flag && (
            <span className="tile__flag" role="img" aria-label={p.flag} title={p.flag}>
              !
            </span>
          )}
          {p.mark && (
            <MarkBadge mark={p.mark} className="tile__mark" />
          )}
        </div>
      </div>
      <div className="tile__name" title={p.name}>
        {p.name}
        {p.me && <MeDot />}
        {p.birthday && " 🎂"}
      </div>
      {p.points !== undefined && <div className="tile__points num">{p.points}</div>}
      {p.line !== undefined && <div className={cx("tile__line quiet", p.points === undefined && "tile__line--fixtures")}>{p.line}</div>}
    </div>
  );
}

/** The Rift: the square map, centred in the main column, with the starters' tiles stood on it. */
export function Rift({ children }: { children: ReactNode }) {
  return (
    <div className="rift">
      <RiftMap />
      {children}
    </div>
  );
}
