import type { ReactNode } from "react";
import { cx } from "../util/cx";
import { WORDS } from "../words";
import { WarnMark } from "./WarnMark";
import "./States.css";

/** Loading: the layout drawn with `--fill` bars where the figures will go; no spinners. */
export function Loading({ rows = 3, label = WORDS.loading }: { rows?: number; label?: string }) {
  return (
    <div className="state-loading" role="status" aria-label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className="state-loading__bar" />
      ))}
    </div>
  );
}

/** Empty: a mark over it where the page draws one, a title and at most one short line (`No moves yet`), then at most one way on (`LCK hub ›`). `centre`: centred in a table's place, as Leagues'. */
export function Empty({ title, line, mark, centre = false, children }: { title: string; line?: string; mark?: ReactNode; centre?: boolean; children?: ReactNode }) {
  return (
    <div className={cx("state", centre && "state--centre")}>
      {mark}
      <b className="state__title">{title}</b>
      {line && <p className="state__line">{line}</p>}
      {children}
    </div>
  );
}

/** Error: the warning mark over a title and one line, and `Try again ›` where trying again can help (plate.md, States). `centre` as Empty's. */
export function ErrorState({ title, line, onRetry, centre = false }: { title: string; line: string; onRetry?: () => void; centre?: boolean }) {
  return (
    <div className={cx("state", centre && "state--centre")} role="alert">
      <WarnMark big />
      <b className="state__title">{title}</b>
      <p className="state__line">{line}</p>
      {onRetry && (
        <button type="button" className="state__retry key-bare" onClick={onRetry}>
          {WORDS.tryAgain}
        </button>
      )}
    </div>
  );
}
