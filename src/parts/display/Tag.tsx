import type { ReactNode } from "react";
import { cx } from "../util/cx";
import "./Tag.css";

/** `live` is filled; `notFinal` is dashed. */
export type TagKind = "plain" | "live" | "notFinal";

/** A square box, 11px, sentence case: `Live`, `Not final`, `Final`. Never the team cap (plate.md). */
export function Tag({ kind = "plain", children }: { kind?: TagKind; children: ReactNode }) {
  return <span className={cx("tag", kind === "live" && "tag--live", kind === "notFinal" && "tag--not-final")}>{children}</span>;
}

/** The state tags' words, written once. */
export const TAG_WORD = { live: "Live", final: "Final", notFinal: "Not final" } as const;

/** `Live`, filled. */
export const LiveTag = () => <Tag kind="live">{TAG_WORD.live}</Tag>;

/** `Not final`, dashed. */
export const NotFinalTag = () => <Tag kind="notFinal">{TAG_WORD.notFinal}</Tag>;

/** A week's or a series' state: `Final`, or `Not final` until it is. */
export const FinalTag = ({ final }: { final: boolean }) => (final ? <Tag>{TAG_WORD.final}</Tag> : <NotFinalTag />);
