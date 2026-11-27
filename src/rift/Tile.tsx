import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cx, MeDot, selectable } from "../parts";
import { measure } from "../theme/tokens";
import { MarkBadge, type Mark } from "./MarkBadge";
import { RiftMap } from "./RiftMap";
import { PLAN } from "./riftPlan";
import type { SlotKey } from "./roles";
import { Shirt } from "./Shirt";
import { SlotName } from "./SlotName";
import type { RiftPlace, RiftPoint } from "./slots";
import { ROLE_NAME } from "./words";
import "./Tile.css";

interface TileProps {
  /** His slot: its role strip on the Rift says Top, Flex or Coach, never the role a Flex plays, which his card says (Craig, 16 Nov 2026). */
  slot?: SlotKey;
  name: string;
  team: string;
  /** Where the tile's centre stands on the Rift, the same or a desk's and a phone's; a bench tile stands in its bar. */
  at?: RiftPoint | RiftPlace;
  mark?: Mark;
  /** His news (`Not starting`): a yellow warning triangle on his role strip, the word in his card. */
  flag?: string;
  /** One of your players. */
  me?: boolean;
  birthday?: boolean;
  /** His price in a dark chip over the card (Transfers). */
  price?: ReactNode;
  /** A dark strip across the card's top, over the shirt: Transfers' `×` to sell and the price (approved/transfers/). */
  strip?: ReactNode;
  /** The page's own mark on the tile: Transfers' bought player. */
  className?: string;
  /** Stands in a row of its role's group on the Rift, at the Rift's tile size (Transfers). */
  grouped?: boolean;
  /** A `×` at the card's top left: tapping the tile sells him (front door). */
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

/** Whether the Rift a tile stands on is a phone's (narrower than `measure.riftPhone`). */
const PhoneRift = createContext(false);

/** A point on the square Rift as a share of it, so the tiles stay on their lanes at any width. */
const ofRift = (v: number) => `${(v / PLAN) * 100}%`;

/** The yellow warning triangle, as the picture draws it: on a tile's role strip, or where a page places it with `className` (Home's warning row). */
export function NewsFlag({ flag, className = "tile__flag" }: { flag: string; className?: string }) {
  return (
    <span className={className} role="img" aria-label={flag} title={flag}>
      <svg className="tile__flag-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path className="tile__flag-sign" d="M8 1.5 15 14.5H1z" strokeWidth="1" strokeLinejoin="round" />
        <rect className="tile__flag-mark" x="7.25" y="5.5" width="1.5" height="5" />
        <rect className="tile__flag-mark" x="7.25" y="11.5" width="1.5" height="1.5" />
      </svg>
    </span>
  );
}

/**
 * One player on the Rift or the bench, as the approved picture draws him (docs/design/approved/pick-team/):
 * his price chip on Transfers; on the Rift, his role strip; his team's kit on a solid card with C past its
 * top right corner and his news on the strip; his team code and name on a white plate; then a band: his
 * points and series, or his fixtures.
 */
export function Tile(p: TileProps) {
  const phone = useContext(PhoneRift);
  const point = p.at && ("desk" in p.at ? (phone ? p.at.phone : p.at.desk) : p.at);
  return (
    <div
      className={cx("tile", p.className, p.grouped ? "tile--grouped" : !point && "tile--bench", p.selected && "tile--selected", p.state && `tile--${p.state}`, p.empty && "tile--empty")}
      style={point && { left: ofRift(point[0]), top: ofRift(point[1]) }}
      {...selectable(p.onSelect, p.selected)}
    >
      {p.price !== undefined && <div className="tile__price num">{p.price}</div>}
      <div className="tile__card">
        {p.strip !== undefined && <div className="tile__strip">{p.strip}</div>}
        {point && p.slot && (
          <div className="tile__slot">
            <SlotName slot={p.slot} label={ROLE_NAME[p.slot]} />
          </div>
        )}
        {(p.sell || p.restore) && (
          <span className="tile__sell" aria-hidden="true">
            {p.restore ? "↺" : "×"}
          </span>
        )}
        {p.flag && <NewsFlag flag={p.flag} />}
        {p.mark && <MarkBadge mark={p.mark} size="tile" className="tile__mark" />}
        <Shirt team={p.team} kit />
      </div>
      <div className="tile__name" title={p.name}>
        {p.team && <span className="tile__team">{p.team} </span>}
        {p.name}
        {p.me && <MeDot />}
        {p.birthday && " 🎂"}
      </div>
      {p.points !== undefined && <div className="tile__points num">{p.points}</div>}
      {p.line !== undefined && <div className={cx("tile__line quiet", p.points === undefined && "tile__line--fixtures")}>{p.line}</div>}
    </div>
  );
}

/** The Rift: the square map, as big as the first screen allows, with the starters' tiles stood on it. */
export function Rift({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const rift = ref.current;
    if (!rift || typeof ResizeObserver === "undefined") return;
    const watch = new ResizeObserver(([entry]) => entry && setPhone(entry.contentRect.width < measure.riftPhone));
    watch.observe(rift);
    return () => watch.disconnect();
  }, []);
  return (
    <div ref={ref} className={cx("rift", phone && "rift--phone")}>
      <RiftMap />
      <PhoneRift.Provider value={phone}>{children}</PhoneRift.Provider>
    </div>
  );
}
