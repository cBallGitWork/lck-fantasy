import type { ReactNode } from "react";
import "./BenchBar.css";
import type { PersonRole } from "./roles";
import { ROLE_NAME } from "./roles";
import { Tile } from "./Tile";

/** The bench, under the Rift or the cards: `Bench`, then each bench player's tile. */
export function BenchBar({ children }: { children: ReactNode }) {
  return (
    <div className="bench-bar">
      <h3 className="bench-bar__title">Bench</h3>
      {children}
    </div>
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
}: {
  order: number;
  role: PersonRole;
  name: string;
  team: string;
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
        {order}. {ROLE_NAME[role]}
      </span>
      <Tile
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
