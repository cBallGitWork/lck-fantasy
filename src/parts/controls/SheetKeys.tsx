import type { ReactNode } from "react";
import "./SheetKeys.css";

/** A sheet's way out, the same in every sheet. */
export const BACK = "Back";

/** A sheet's foot: Back, a text link (as in the Transfers confirm), then the sheet's main action. */
export function SheetKeys({ onBack, children }: { onBack: () => void; children: ReactNode }) {
  return (
    <div className="sheet-keys">
      <button type="button" className="sheet-keys__back key-bare" onClick={onBack}>
        {BACK}
      </button>
      {children}
    </div>
  );
}
