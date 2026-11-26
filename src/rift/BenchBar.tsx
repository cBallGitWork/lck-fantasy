import type { ReactNode } from "react";
import { cx, Panel } from "../parts";
import "./BenchBar.css";
import type { PersonRole } from "./roles";
import { Tile } from "./Tile";
import { benchPlace, WORDS } from "./words";

/**
 * The bench, beside or under the Rift: a panel on the Rift's own ground, `Bench`, then each bench
 * player's tile. Under the cards (`cards`), a plain panel of their lineup cards, each a starter's width
 * (plate.md, Card view).
 */
export function BenchBar({ className, cards, children }: { className?: string; cards?: boolean; children: ReactNode }) {
  return (
    <Panel title={WORDS.bench} className={cx("bench-bar", cards && "bench-bar--cards", className)}>
      <div className="bench-bar__tiles">{children}</div>
    </Panel>
  );
}

/**
 * One bench player: his order and role over his tile, as FPL's `1. DEF`, and the Rift's own tile under
 * it, as FPL's bench shows the pitch's cards (Craig, 16 Nov 2026): fixtures, or his points and why not.
 */
export function BenchTile({
  order,
  role,
  name,
  team,
  detail,
  line,
  points,
  state,
  selected,
  onSelect,
  ...tile
}: {
  order: number;
  /** None for an empty bench slot (front door): `1.` alone. */
  role?: PersonRole;
  name: string;
  team: string;
  /** His price chip and `×` (front door), or an empty slot. */
  price?: ReactNode;
  sell?: boolean;
  empty?: boolean;
  /** Under his points, such as `Didn't play`. */
  detail?: string;
  /** The week's fixtures. */
  line?: ReactNode;
  points?: ReactNode;
  /** `out` didn't play; `dim` while another is moved; `fit` where a move could go. */
  state?: "out" | "dim" | "fit";
  /** Chosen to swap or move (Pick Team). */
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <div className="bench-slot">
      <span className="bench-slot__role quiet">
        {benchPlace(order, role)}
      </span>
      <Tile
        {...tile}
        slot={role}
        name={name}
        team={team}
        points={points}
        line={line ?? detail}
        state={state === "out" ? "dim" : state}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
}
