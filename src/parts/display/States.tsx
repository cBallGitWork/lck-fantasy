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

/** Empty: a title (`No moves yet`). */
export function Empty({ title }: { title: string }) {
  return (
    <div className="state">
      <b className="state__title">{title}</b>
    </div>
  );
}
