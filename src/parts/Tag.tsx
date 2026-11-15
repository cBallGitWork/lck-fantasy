import type { ReactNode } from "react";
import { cx } from "./cx";
import "./Tag.css";

/** `live` is filled; `notFinal` is dashed. */
export type TagKind = "plain" | "live" | "notFinal";

/** A square box, 11px, sentence case: `Live`, `Not final`, `Final`, `Cap 2`. */
export function Tag({ kind = "plain", children }: { kind?: TagKind; children: ReactNode }) {
  return <span className={cx("tag", kind === "live" && "tag--live", kind === "notFinal" && "tag--not-final")}>{children}</span>;
}
