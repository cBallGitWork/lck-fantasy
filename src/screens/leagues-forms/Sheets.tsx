// The league forms as the pictures draw them (docs/design/approved/leagues/): each a sheet over the
// Leagues page, or the maker's Admin menu. Each is fed by props; the page (index.tsx) holds the data.
import { useId, useState, type ReactNode } from "react";
import { Field, GoLink, MainAction, Menu, Modal, OutlinedKey } from "../../parts";
import { PATHS } from "../../paths";
import type { PrivateLeague, ScoringWeek, ScoringWeeks } from "./fixtures";
import { ordinal, privateCountLine } from "./leagueForms";

/** Back, a text link in every sheet (as in the Transfers confirm), then the sheet's main action. */
function SheetKeys({ onBack, children }: { onBack: () => void; children: ReactNode }) {
  return (
    <div className="leagues-forms__keys">
      <button type="button" className="leagues-forms__back" onClick={onBack}>
        Back
      </button>
      {children}
    </div>
  );
}

function CountLine({ count, cap }: { count: number; cap: number }) {
  return <p className="leagues-forms__count">{privateCountLine(count, cap)}</p>;
}

const weekLabel = ({ week, starts }: ScoringWeek) => `Week ${week} · ${starts}`;

/** Create a league: its name, and the week scoring starts, this week by default (create.html). */
export function CreateSheet({
  weeks,
  nameMax,
  privateCount,
  privateCap,
  initialName = "",
  onCreate,
  onClose,
}: {
  weeks: ScoringWeeks;
  nameMax: number;
  privateCount: number;
  privateCap: number;
  initialName?: string;
  onCreate: (name: string, scoringFrom: number) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [week, setWeek] = useState(weeks[0].week);
  const weekId = useId();
  const trimmed = name.trim();
  return (
    <Modal kind="sheet" title="Create a league" onClose={onClose}>
      <Field label="Name" value={name} maxLength={nameMax} aside={`${name.length} / ${nameMax}`} onChange={(e) => setName(e.target.value)} />
      <div className="leagues-forms__week">
        <label className="leagues-forms__label" htmlFor={weekId}>
          Scoring starts
        </label>
        <select id={weekId} className="leagues-forms__select" value={week} onChange={(e) => setWeek(Number(e.target.value))}>
          {weeks.map((w) => (
            <option key={w.week} value={w.week}>
              {weekLabel(w)}
            </option>
          ))}
        </select>
      </div>
      <SheetKeys onBack={onClose}>
        <MainAction disabledReason={trimmed === "" ? "No name" : undefined} onClick={() => onCreate(trimmed, week)}>
          Create
        </MainAction>
      </SheetKeys>
      <CountLine count={privateCount} cap={privateCap} />
    </Modal>
  );
}

/** The league made: its code, Copy code, Copy link and Open league (created.html). */
export function CreatedSheet({
  league,
  onCopyCode,
  onCopyLink,
  onClose,
}: {
  league: PrivateLeague;
  onCopyCode: () => void;
  onCopyLink: () => void;
  onClose: () => void;
}) {
  return (
    <Modal kind="sheet" title={league.name} onClose={onClose}>
      <p className="leagues-forms__sub">Scoring from Week {league.scoringFrom}</p>
      <div className="leagues-forms__made">
        <b className="leagues-forms__made-code num">{league.code}</b>
        <OutlinedKey onClick={onCopyCode}>Copy code</OutlinedKey>
        <OutlinedKey onClick={onCopyLink}>Copy link</OutlinedKey>
      </div>
      <div className="leagues-forms__keys">
        <GoLink className="leagues-forms__open" go={{ to: PATHS.league, params: { leagueId: league.id } }}>
          Open league
        </GoLink>
      </div>
    </Modal>
  );
}

/** Join a league with a code or a link (join.html). */
export function JoinSheet({
  privateCount,
  privateCap,
  initialCode = "",
  error,
  onJoin,
  onClose,
}: {
  privateCount: number;
  privateCap: number;
  initialCode?: string;
  /** Why the last code found nothing. */
  error?: string;
  onJoin: (codeOrLink: string) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState(initialCode);
  return (
    <Modal kind="sheet" title="Join a league" onClose={onClose}>
      <div className="leagues-forms__code-field">
        <Field label="Code or link" value={code} error={error} onChange={(e) => setCode(e.target.value)} />
      </div>
      <SheetKeys onBack={onClose}>
        <MainAction disabledReason={code.trim() === "" ? "No code" : undefined} onClick={() => onJoin(code)}>
          Join
        </MainAction>
      </SheetKeys>
      <CountLine count={privateCount} cap={privateCap} />
    </Modal>
  );
}

/** A member leaving: the league, their rank in it, then Leave (leave.html). */
export function LeaveSheet({ league, onLeave, onClose }: { league: PrivateLeague; onLeave: () => void; onClose: () => void }) {
  return (
    <Modal kind="sheet" title={`Leave ${league.name}?`} onClose={onClose}>
      <p>
        {ordinal(league.rank)} of {league.managers}
      </p>
      <SheetKeys onBack={onClose}>
        <MainAction onClick={onLeave}>Leave</MainAction>
      </SheetKeys>
    </Modal>
  );
}

/** The maker deleting their league: its size and first week, then Delete league (delete.html). */
export function DeleteSheet({ league, onDelete, onClose }: { league: PrivateLeague; onDelete: () => void; onClose: () => void }) {
  return (
    <Modal kind="sheet" title={`Delete ${league.name}?`} onClose={onClose}>
      <p>
        {league.managers} managers · scoring from Week {league.scoringFrom}
      </p>
      <SheetKeys onBack={onClose}>
        <MainAction onClick={onDelete}>Delete league</MainAction>
      </SheetKeys>
    </Modal>
  );
}

/** The maker's Admin menu: Rename, Remove a manager, then Delete league… under a rule (admin.html). */
export function AdminMenu({ onRename, onRemove, onDelete }: { onRename: () => void; onRemove: () => void; onDelete: () => void }) {
  return (
    <Menu
      label="Admin ▾"
      className="leagues-forms__menu-key"
      items={[
        { label: "Rename", onChoose: onRename },
        { label: "Remove a manager", onChoose: onRemove },
        { label: "Delete league…", apart: true, onChoose: onDelete },
      ]}
    />
  );
}
