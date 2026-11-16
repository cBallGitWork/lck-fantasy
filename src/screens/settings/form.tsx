import type { ReactNode } from "react";
import { TEAMS, type TeamCode } from "../../fixtures/week3";
import { capName, counter, type Account } from "./settings";

// The form pieces Settings and the sign-up sheets share.

/** A row of the form: its label at the left, the control at the right. */
export function Row({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div className="settings__row">
      <span className="settings__label">
        {label}
        {note && <small className="settings__label-note">{note}</small>}
      </span>
      <div>{children}</div>
    </div>
  );
}

/** A text field capped at 20 characters, its count at the right. */
export function CappedInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <span className="settings__input">
      <input className="settings__input-text" aria-label={label} value={value} onChange={(e) => onChange(capName(e.target.value))} />
      <span className="quiet num">{counter(value)}</span>
    </span>
  );
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  empty,
}: {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  /** The words shown before anything is chosen (`Choose a team`). */
  empty?: string;
}) {
  return (
    <select className="settings__select" aria-label={label} value={value ?? ""} onChange={(e) => onChange(e.target.value as T)}>
      {value === null && (
        <option value="" disabled>
          {empty}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export const TEAM_OPTIONS = (Object.keys(TEAMS) as TeamCode[]).map((code) => ({ value: code, label: TEAMS[code] }));
export const plainOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

/** The sign-in provider's mark: `G`, `D`. */
export const ProviderMark = ({ provider }: { provider: Account["provider"] }) => (
  <span className="settings__provider" aria-hidden="true">
    {provider[0]}
  </span>
);

/**
 * Privacy and Terms are plain text pages (docs/legal/) with no route yet, so they are named, not
 * linked; the privacy email waits for Flol's domain.
 */
export function LegalNames() {
  return (
    <>
      <span className="settings__go">Privacy ›</span>
      <span className="settings__go">Terms ›</span>
    </>
  );
}
