// The league forms as the pictures draw them (docs/design/approved/leagues/): each a sheet over the
// Leagues page. Each is fed by props; the screen (index.tsx) holds the leagues.
import { useId, useState, type ReactNode } from "react";
import { count, Field, GoLink, MainAction, Modal, OutlinedKey, placeOf } from "../../parts";
import { PATHS } from "../../paths";
import { capReason, privateCountLine } from "./forms";
import type { PrivateLeague, ScoringWeek, ScoringWeeks } from "./types";
import "./Sheets.css";

/** Back, a text link in every sheet (as in the Transfers confirm), then the sheet's main action. */
function SheetKeys({ onBack, children }: { onBack: () => void; children: ReactNode }) {
  return (
    <div className="leagues__sheet-keys">
      <button type="button" className="leagues__back" onClick={onBack}>
        Back
      </button>
      {children}
    </div>
  );
}

/** How many private leagues you're in, and the cap. */
interface PrivateCount {
  count: number;
  cap: number;
}

const CountLine = ({ count, cap }: PrivateCount) => <p className="leagues__count">{privateCountLine(count, cap)}</p>;

const weekLabel = ({ week, starts }: ScoringWeek) => `Week ${week} · ${starts}`;

/** Create a league: its name, and the week scoring starts, this week by default (create.html). */
export function CreateSheet({
  weeks,
  nameMax,
  privates,
  initialName = "",
  onCreate,
  onClose,
}: {
  weeks: ScoringWeeks;
  nameMax: number;
  privates: PrivateCount;
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
      <div className="leagues__week">
        <label className="leagues__label" htmlFor={weekId}>
          Scoring starts
        </label>
        <select id={weekId} className="leagues__select" value={week} onChange={(e) => setWeek(Number(e.target.value))}>
          {weeks.map((w) => (
            <option key={w.week} value={w.week}>
              {weekLabel(w)}
            </option>
          ))}
        </select>
      </div>
      <SheetKeys onBack={onClose}>
        <MainAction disabledReason={capReason(privates.count, privates.cap) ?? (trimmed === "" ? "No name" : undefined)} onClick={() => onCreate(trimmed, week)}>
          Create
        </MainAction>
      </SheetKeys>
      <CountLine {...privates} />
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
      <p className="leagues__sheet-sub">Scoring from Week {league.scoringFrom}</p>
      <div className="leagues__made">
        <b className="leagues__made-code num">{league.code}</b>
        <OutlinedKey onClick={onCopyCode}>Copy code</OutlinedKey>
        <OutlinedKey onClick={onCopyLink}>Copy link</OutlinedKey>
      </div>
      <div className="leagues__sheet-keys">
        <GoLink className="leagues__open" go={{ to: PATHS.league, params: { leagueId: league.id } }}>
          Open league
        </GoLink>
      </div>
    </Modal>
  );
}

/** Join a league with a code or a link (join.html). */
export function JoinSheet({
  privates,
  initialCode = "",
  error,
  onJoin,
  onClose,
}: {
  privates: PrivateCount;
  initialCode?: string;
  /** Why the last code found nothing. */
  error?: string;
  onJoin: (codeOrLink: string) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState(initialCode);
  return (
    <Modal kind="sheet" title="Join a league" onClose={onClose}>
      <div className="leagues__code-field">
        <Field label="Code or link" value={code} error={error} onChange={(e) => setCode(e.target.value)} />
      </div>
      <SheetKeys onBack={onClose}>
        <MainAction disabledReason={capReason(privates.count, privates.cap) ?? (code.trim() === "" ? "No code" : undefined)} onClick={() => onJoin(code)}>
          Join
        </MainAction>
      </SheetKeys>
      <CountLine {...privates} />
    </Modal>
  );
}

/** A member leaving: the league, their rank in it, then Leave (leave.html). */
export function LeaveSheet({ name, rank, size, onLeave, onClose }: { name: string; rank: number; size: number; onLeave: () => void; onClose: () => void }) {
  return (
    <Modal kind="sheet" title={`Leave ${name}?`} onClose={onClose}>
      <p>
        {placeOf(rank, count(size))}
      </p>
      <SheetKeys onBack={onClose}>
        <MainAction onClick={onLeave}>Leave</MainAction>
      </SheetKeys>
    </Modal>
  );
}

/** The maker deleting their league: its size and first week, then Delete league (delete.html). */
export function DeleteSheet({
  name,
  size,
  scoringFrom,
  onDelete,
  onClose,
}: {
  name: string;
  size: number;
  scoringFrom: number;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <Modal kind="sheet" title={`Delete ${name}?`} onClose={onClose}>
      <p>
        {count(size)} managers · scoring from Week {scoringFrom}
      </p>
      <SheetKeys onBack={onClose}>
        <MainAction onClick={onDelete}>Delete league</MainAction>
      </SheetKeys>
    </Modal>
  );
}
