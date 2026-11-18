import type { ReactNode } from "react";
import "./States.css";

/** Loading: the layout drawn with `--fill` bars where the figures will go; no spinners. */
export function Loading({ rows = 3, label = "Loading" }: { rows?: number; label?: string }) {
  return (
    <div className="state-loading" role="status" aria-label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className="state-loading__bar" />
      ))}
    </div>
  );
}

/** Empty: a title and at most one short line (`No moves yet`), then at most one way on (`LCK hub ›`). */
export function Empty({ title, line, children }: { title: string; line?: string; children?: ReactNode }) {
  return (
    <div className="state">
      <b className="state__title">{title}</b>
      {line && <p className="state__line">{line}</p>}
      {children}
    </div>
  );
}

/** Error: a title and one line, and `Try again ›` where trying again can help. */
export function ErrorState({ title, line, onRetry }: { title: string; line: string; onRetry?: () => void }) {
  return (
    <div className="state" role="alert">
      <b className="state__title">{title}</b>
      <p className="state__line">{line}</p>
      {onRetry && (
        <button type="button" className="state__retry key-bare" onClick={onRetry}>
          Try again ›
        </button>
      )}
    </div>
  );
}
