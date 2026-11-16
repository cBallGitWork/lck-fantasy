import type { ReactNode } from "react";
import { cx, MeDot, selectable, Tag } from "../parts";
import { measure } from "../theme/tokens";
import { RiftMap } from "./RiftMap";
import { RoleIcon } from "./RoleIcon";
import { Shirt } from "./Shirt";
import type { RoleKey, SlotKey } from "./roles";
import { ROLE_NAME, slotIcon, slotTag } from "./roles";
import type { RiftPoint } from "./slots";
import "./Tile.css";

export type Mark = "C" | "V";

export const MARK_NAME: Record<Mark, string> = { C: "Carry", V: "Vice-carry" };

export interface TileProps {
  slot: SlotKey;
  /** The role a Flex plays. */
  plays?: RoleKey;
  name: string;
  team: string;
  /** Where the tile's centre stands on the Rift. */
  at: RiftPoint;
  mark?: Mark;
  /** Dual Carry is played: the V is gold as the C, as the Vice-carry scores ×1.5 too (spec/06). */
  dual?: boolean;
  /** A `Flex` label over the Flex's shirt, so his place reads at a glance (Pick Team). */
  flexLabel?: boolean;
  /** One of your players. */
  me?: boolean;
  birthday?: boolean;
  /** The week's points; Pick Team's tiles have none. */
  points?: ReactNode;
  /** The series line: `v HLE 12 · v DK 5`, or the week's fixtures. */
  line?: ReactNode;
  /** Tags under the tile, after the Flex's or Coach's own. */
  tags?: ReactNode;
  selected?: boolean;
  /** `dim` while another tile is being moved; `fit` where it could go. */
  state?: "dim" | "fit";
  onSelect?: () => void;
}

/** A point on the 984 × 560 Rift as a share of it, so the tiles stay on their lanes at any width. */
const share = (px: number, of: number) => `${(px / of) * 100}%`;

/** One starter on the Rift: shirt, team code, role icon, C or V, name, points, series line, tags. */
export function Tile(p: TileProps) {
  const slotLabel = slotTag(p.slot, p.plays);
  const hasPoints = p.points !== undefined;
  return (
    <div
      className={cx("tile", !hasPoints && "tile--narrow", p.selected && "tile--selected", p.state && `tile--${p.state}`)}
      style={{
        left: share(p.at[0], measure.riftW),
        top: share(p.at[1], measure.riftH),
      }}
      {...selectable(p.onSelect, p.selected)}
    >
      {p.flexLabel && p.slot === "flex" && <span className="tile__flex">{ROLE_NAME.flex}</span>}
      <div className="tile__kit">
        <Shirt team={p.team} />
        <span className="tile__role">
          <RoleIcon role={slotIcon(p.slot, p.plays)} />
        </span>
        {p.mark && (
          <span className={cx("tile__mark", p.mark === "V" && !p.dual && "tile__mark--v")} title={MARK_NAME[p.mark]}>
            {p.mark}
          </span>
        )}
      </div>
      <div className="tile__name" title={p.name}>
        {p.name}
        {p.me && <MeDot />}
        {p.birthday && " 🎂"}
      </div>
      {hasPoints && (
        <div className="tile__points num">
          {p.points}
        </div>
      )}
      {p.line !== undefined && <div className={cx("tile__line", !hasPoints && "tile__line--fixtures")}>{p.line}</div>}
      {p.tags}
      {slotLabel && <Tag>{slotLabel}</Tag>}
    </div>
  );
}

/** The Rift: the map, with the starters' tiles stood on it. */
export function Rift({ children }: { children: ReactNode }) {
  return (
    <div className="rift">
      <RiftMap />
      {children}
    </div>
  );
}
