import type { ReactNode } from "react";
import { TEAMS, type TeamCode } from "../../fixtures/week3";
import { GoLink } from "../../parts";
import { PATHS } from "../../paths";
import { capName, counter } from "./settings";

// Settings' form pieces.

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

export const TEAM_OPTIONS = (Object.keys(TEAMS) as TeamCode[]).map((code) => ({ value: code, label: TEAMS[code] }));

/** Links to Privacy and Terms, the plain pages of docs/legal/; the privacy email waits for Flol's domain. */
export function LegalNames() {
  return (
    <>
      <GoLink go={{ to: PATHS.privacy }} className="settings__go">
        Privacy ›
      </GoLink>
      <GoLink go={{ to: PATHS.terms }} className="settings__go">
        Terms ›
      </GoLink>
    </>
  );
}
