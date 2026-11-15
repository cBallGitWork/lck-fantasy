import type { KeyboardEvent, ReactNode } from "react";
import { RiftMap } from "./RiftMap";
import { MeDot } from "../parts/MeDot";
import { Tag } from "../parts/Tag";
import { cx } from "../parts/cx";
import { RoleIcon } from "./RoleIcon";
import { Shirt } from "./Shirt";
import type { RoleKey, SlotKey } from "./roles";
import { slotIcon, slotTag } from "./roles";
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
  /** One of your players. */
  me?: boolean;
  birthday?: boolean;
  /** The week's points; Pick Team's tiles have none. */
  points?: ReactNode;
  /** The Carry's sum before ×1.5, small after the points: `17×1.5`. */
  carrySum?: string;
  /** The series line: `v HLE 12 · v DK 5`, or the week's fixtures. */
  line?: ReactNode;
  /** Tags under the tile, after the Flex's or Coach's own. */
  tags?: ReactNode;
  selected?: boolean;
  /** `dim` while another tile is being moved; `fit` where it could go. */
  state?: "dim" | "fit";
  onSelect?: () => void;
}

/** One starter on the Rift: shirt, team code, role icon, C or V, name, points, series line, tags. */
export function Tile(p: TileProps) {
  const slotLabel = slotTag(p.slot, p.plays);
  const hasPoints = p.points !== undefined;
  return (
    <div
      className={cx("tile", !hasPoints && "tile--narrow", p.selected && "tile--selected", p.state && `tile--${p.state}`)}
      style={{ left: p.at[0], top: p.at[1] }}
      {...(p.onSelect && {
        role: "button",
        tabIndex: 0,
        "aria-pressed": p.selected ?? false,
        onClick: p.onSelect,
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") p.onSelect?.();
        },
      })}
    >
      <div className="tile__kit">
        <Shirt team={p.team} />
        <span className="tile__role">
          <RoleIcon role={slotIcon(p.slot, p.plays)} />
        </span>
        {p.mark && (
          <span className={cx("tile__mark", p.mark === "V" && "tile__mark--v")} title={MARK_NAME[p.mark]}>
            {p.mark}
          </span>
        )}
      </div>
      <div className="tile__name">
        {p.name}
        {p.me && <MeDot />}
        {p.birthday && " 🎂"}
      </div>
      {hasPoints && (
        <div className="tile__points num">
          {p.points}
          {p.carrySum && <small>{p.carrySum}</small>}
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
