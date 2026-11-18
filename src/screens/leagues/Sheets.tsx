// The league forms as the pictures draw them (docs/design/approved/leagues/): each a sheet over the
// Leagues page. Each is fed by props; the screen (index.tsx) holds the leagues.
import { useId, useState, type ReactNode } from "react";
import { count, Field, GoLink, MainAction, Modal, OutlinedKey, placeOf, plural } from "../../parts";
import { leagueGo } from "../../paths";
import { capReason } from "./forms";
import type { PrivateLeague, ScoringWeeks } from "./types";
import { deleteLine, deleteTitle, leaveTitle, nameCount, privateCountLine, scoringFrom, weekStarts, WORDS } from "./words";
import "./Sheets.css";

/** Back, a text link in every sheet (as in the Transfers confirm), then the sheet's main action. */
function SheetKeys({ onBack, children }: { onBack: () => void; children: ReactNode }) {
  return (
    <div className="leagues__sheet-keys">
      <button type="button" className="leagues__back key-bare" onClick={onBack}>
        {WORDS.back}
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

const CountLine = ({ count, cap }: PrivateCount) => <p className="leagues__count quiet">{privateCountLine(count, cap)}</p>;

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
    <Modal kind="sheet" title={WORDS.create} onClose={onClose}>
      <Field label={WORDS.name} value={name} maxLength={nameMax} aside={nameCount(name.length, nameMax)} onChange={(e) => setName(e.target.value)} />
      <div className="leagues__week">
        <label className="leagues__label" htmlFor={weekId}>
          {WORDS.scoringStarts}
        </label>
        <select id={weekId} className="leagues__select" value={week} onChange={(e) => setWeek(Number(e.target.value))}>
          {weeks.map((w) => (
            <option key={w.week} value={w.week}>
              {weekStarts(w.week, w.starts)}
            </option>
          ))}
        </select>
      </div>
      <SheetKeys onBack={onClose}>
        <MainAction disabledReason={capReason(privates.count, privates.cap) ?? (trimmed === "" ? WORDS.noName : undefined)} onClick={() => onCreate(trimmed, week)}>
          {WORDS.createKey}
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
      <p className="leagues__sheet-sub">{scoringFrom(league.scoringFrom)}</p>
      <div className="leagues__made">
        <b className="leagues__made-code num">{league.code}</b>
        <OutlinedKey onClick={onCopyCode}>{WORDS.copyCode}</OutlinedKey>
        <OutlinedKey onClick={onCopyLink}>{WORDS.copyLink}</OutlinedKey>
      </div>
      <div className="leagues__sheet-keys">
        <GoLink className="leagues__open" go={leagueGo(league.id)}>
          {WORDS.openLeague}
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
    <Modal kind="sheet" title={WORDS.join} onClose={onClose}>
      <div className="leagues__code-field">
        <Field label={WORDS.codeOrLink} value={code} error={error} onChange={(e) => setCode(e.target.value)} />
      </div>
      <SheetKeys onBack={onClose}>
        <MainAction disabledReason={capReason(privates.count, privates.cap) ?? (code.trim() === "" ? WORDS.noCode : undefined)} onClick={() => onJoin(code)}>
          {WORDS.joinKey}
        </MainAction>
      </SheetKeys>
      <CountLine {...privates} />
    </Modal>
  );
}

/** A member leaving: the league, their rank in it, then Leave (leave.html). */
export function LeaveSheet({ name, rank, size, onLeave, onClose }: { name: string; rank: number; size: number; onLeave: () => void; onClose: () => void }) {
  return (
    <Modal kind="sheet" title={leaveTitle(name)} onClose={onClose}>
      <p>
        {placeOf(rank, count(size))}
      </p>
      <SheetKeys onBack={onClose}>
        <MainAction onClick={onLeave}>{WORDS.leave}</MainAction>
      </SheetKeys>
    </Modal>
  );
}

/** The maker deleting their league: its size and first week, then Delete league (delete.html). */
export function DeleteSheet({
  name,
  size,
  scoringFrom: firstWeek,
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
    <Modal kind="sheet" title={deleteTitle(name)} onClose={onClose}>
      <p>{deleteLine(plural(size, WORDS.manager), firstWeek)}</p>
      <SheetKeys onBack={onClose}>
        <MainAction onClick={onDelete}>{WORDS.deleteKey}</MainAction>
      </SheetKeys>
    </Modal>
  );
}
