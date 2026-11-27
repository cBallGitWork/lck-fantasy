import type { ReactNode } from "react";
import { Crest, cx, TAG_WORD, TeamBar } from "../parts";
import type { PersonRole, RoleKey } from "./roles";
import { ROLE_NAME } from "./words";
import "./RiftCard.css";

/**
 * The player's card under the Rift, one part for Points and Transfers (plate.md, The player's card;
 * approved/points/, What binds 5): its head the panels' blue band on one line, read as a tile (crest,
 * the role in its dark strip, the team's bar and code, the name, then the page's own marks); the key
 * figure at the right with its note before it. The page's ruled body follows.
 */
export function RiftCard({
  name,
  team,
  role,
  hangul,
  marks,
  note,
  figure,
  className,
  children,
}: {
  name: string;
  team: string;
  /** The role he plays: a Flex's own. */
  role: PersonRole | RoleKey;
  hangul?: string;
  /** After the name: the Captain's C, a price. */
  marks?: ReactNode;
  /** Before the figure: `17 ×1.5 · Captains averaged 19`. */
  note?: ReactNode;
  figure: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section className={cx("rift-card", className)} aria-label={name}>
      <header className="rift-card__head">
        <Crest team={team} size="crestDock" />
        <span className="rift-card__role">{ROLE_NAME[role]}</span>
        <h2 className="rift-card__name">
          <span className="rift-card__team">
            <TeamBar team={team} wide />
            {team}
          </span>{" "}
          {name}
        </h2>
        {hangul && (
          <span className="rift-card__hangul" lang="ko">
            {hangul}
          </span>
        )}
        {marks}
        <span className="rift-card__total">
          {note && <span className="rift-card__note">{note}</span>}
          <b className="rift-card__figure num">{figure}</b>
        </span>
      </header>
      {children}
    </section>
  );
}

/** A result on the card: `W` or `W 2–1` outlined green, `L` red, or the filled `Live` (plate.md, The player's card). */
export function ResultChip({ won, children }: { won?: boolean; children?: ReactNode }) {
  if (won === undefined) return <span className="result-chip result-chip--live">{TAG_WORD.live}</span>;
  return <span className={cx("result-chip num", won ? "result-chip--w" : "result-chip--l")}>{children}</span>;
}

/** Points on the card: boxed when they count, grey with no box when dropped. */
export function CardPoints({ points, counted }: { points: ReactNode; counted: boolean }) {
  return <b className={cx("rift-card__points num", counted ? "counted" : "rift-card__points--dropped")}>{points}</b>;
}
