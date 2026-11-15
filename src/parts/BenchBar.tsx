import type { ReactNode } from "react";
import { RoleIcon } from "../rift/RoleIcon";
import type { IconKey } from "../rift/roles";
import "./BenchBar.css";
import { cx } from "./cx";

/** The bench, under the Rift or the cards: one compact bar, `Bench` then a slim tile per player. */
export function BenchBar({ children }: { children: ReactNode }) {
  return (
    <div className="bench-bar">
      <h3 className="bench-bar__title">Bench</h3>
      {children}
    </div>
  );
}

/** One bench player: order, role icon, name, team, then a line of fixtures or his points. */
export function BenchTile({
  order,
  role,
  name,
  team,
  detail,
  line,
  points,
  state,
}: {
  order: number;
  role: IconKey;
  name: string;
  team: string;
  /** After the team, such as `Didn't play`. */
  detail?: string;
  /** A second, mono line: the week's fixtures. */
  line?: ReactNode;
  points?: ReactNode;
  /** `out` didn't play; `dim` while another is moved; `fit` where a move could go. */
  state?: "out" | "dim" | "fit";
}) {
  return (
    <div className={cx("bench-tile", state && `bench-tile--${state}`)}>
      <span className="bench-tile__order num">{order}</span>
      <RoleIcon role={role} />
      <span className="bench-tile__who">
        <b>{name}</b>{" "}
        <span>
          {team}
          {detail && ` · ${detail}`}
        </span>
        {line !== undefined && <small>{line}</small>}
      </span>
      <span className="bench-tile__points num">{points}</span>
    </div>
  );
}

/** The key between bench tiles that swaps their order. */
export function BenchSwap({ onSwap }: { onSwap?: () => void }) {
  return (
    <button type="button" className="bench-swap" onClick={onSwap}>
      ⇅ Swap
    </button>
  );
}
