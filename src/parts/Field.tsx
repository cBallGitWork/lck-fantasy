import { useId, type InputHTMLAttributes } from "react";
import { cx } from "./cx";
import "./Field.css";

/** A form field: its label above, the field 40px tall; an error is one line under it, the field edged. */
export function Field({
  label,
  error,
  aside,
  ...input
}: {
  label: string;
  error?: string;
  /** A count or unit at the field's right (`11 / 30`). */
  aside?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <span className={cx("field__box", error !== undefined && "field__box--error")}>
        <input
          id={id}
          className="field__input"
          aria-invalid={error !== undefined}
          aria-describedby={error !== undefined ? errorId : undefined}
          {...input}
        />
        {aside && <span className="field__aside num">{aside}</span>}
      </span>
      {error !== undefined && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
