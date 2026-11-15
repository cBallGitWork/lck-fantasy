import { useState } from "react";
import { MANAGER } from "../../fixtures/week3";
import { MainAction, OutlinedKey, PageFrame, PageHead } from "../../parts";
import { PATHS, pathTo } from "../../paths";
import {
  JOINABLE_LEAGUES,
  LEAGUE_NAME_MAX,
  NEW_LEAGUE,
  NO_SUCH_CODE,
  PRIVATE_LEAGUE_CAP,
  PRIVATE_LEAGUES,
  SCORING_WEEKS,
  type PrivateLeague,
  type ScoringWeeks,
} from "./fixtures";
import { findByCode, makeLeague, renameLeague, withoutLeague, type OpenForm } from "./leagueForms";
import "./leagues-forms.css";
import { AdminMenu, CreatedSheet, CreateSheet, DeleteSheet, JoinSheet, LeaveSheet } from "./Sheets";

/** A league's link, as Copy link gives it. */
const leagueLink = (league: PrivateLeague) => `${window.location.origin}${pathTo({ to: PATHS.league, params: { leagueId: league.id } })}`;

const copyText = (words: string) => void navigator.clipboard.writeText(words);

/** A league's header where the forms open from: name, first week, code, Copy link, then Admin or Leave. */
function LeagueHead({
  league,
  onRename,
  onRemoveManager,
  onDelete,
  onLeave,
}: {
  league: PrivateLeague;
  onRename: (name: string) => void;
  onRemoveManager: () => void;
  onDelete: () => void;
  onLeave: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const save = (name: string) => {
    setRenaming(false);
    if (name.trim() !== "") onRename(name.trim());
  };
  return (
    <div className="leagues-forms__head">
      {renaming ? (
        <input
          className="leagues-forms__rename"
          aria-label="League name"
          defaultValue={league.name}
          maxLength={LEAGUE_NAME_MAX}
          autoFocus
          onBlur={(e) => save(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save(e.currentTarget.value);
            if (e.key === "Escape") setRenaming(false);
          }}
        />
      ) : (
        <h2 className="leagues-forms__name">{league.name}</h2>
      )}
      <span className="leagues-forms__from">Scoring from Week {league.scoringFrom}</span>
      <span className="leagues-forms__gap" />
      <span className="leagues-forms__code num">{league.code}</span>
      <OutlinedKey onClick={() => copyText(leagueLink(league))}>Copy link</OutlinedKey>
      {league.maker ? (
        <AdminMenu onRename={() => setRenaming(true)} onRemove={onRemoveManager} onDelete={onDelete} />
      ) : (
        <OutlinedKey onClick={onLeave}>Leave</OutlinedKey>
      )}
    </div>
  );
}

/**
 * The league forms (docs/design/approved/leagues/): Create and Join, then each private league's
 * header with Admin or Leave, and the sheet open over them. The Leagues page's list and table are
 * its own screen's (src/screens/leagues/).
 */
export function LeaguesFormsScreen({
  leagues: firstLeagues = PRIVATE_LEAGUES,
  weeks = SCORING_WEEKS,
  joinable = JOINABLE_LEAGUES,
  newCode = NEW_LEAGUE.code,
  firstForm = null,
  onRemoveManager = () => {},
}: {
  leagues?: PrivateLeague[];
  /** Weeks a new league's scoring can start from, this week first. */
  weeks?: ScoringWeeks;
  /** Leagues a code or link can find. */
  joinable?: PrivateLeague[];
  /** The code a new league is given. */
  newCode?: string;
  firstForm?: OpenForm;
  /** Remove a manager picks a row in the league's table, which the Leagues screen draws. */
  onRemoveManager?: () => void;
}) {
  const [leagues, setLeagues] = useState(firstLeagues);
  const [form, setForm] = useState<OpenForm>(firstForm);
  const [joinError, setJoinError] = useState<string>();
  const close = () => {
    setForm(null);
    setJoinError(undefined);
  };
  const drop = (league: PrivateLeague) => {
    setLeagues(withoutLeague(leagues, league.id));
    close();
  };
  const join = (codeOrLink: string) => {
    const found = findByCode(joinable, codeOrLink);
    if (!found) return setJoinError(NO_SUCH_CODE);
    setLeagues([...withoutLeague(leagues, found.id), found]);
    close();
  };
  const create = (name: string, scoringFrom: number) => {
    const league = makeLeague(name, scoringFrom, newCode);
    setLeagues([...leagues, league]);
    setForm({ kind: "created", league });
  };

  return (
    <PageFrame screen="leagues-forms" active="leagues" account={MANAGER.team}>
      <PageHead title="Leagues" hangul="리그" />
      <div className="leagues-forms__acts">
        <MainAction onClick={() => setForm({ kind: "create" })}>Create a league</MainAction>
        <OutlinedKey onClick={() => setForm({ kind: "join" })}>Join a league</OutlinedKey>
      </div>
      {leagues.map((league) => (
        <LeagueHead
          key={league.id}
          league={league}
          onRename={(name) => setLeagues(renameLeague(leagues, league.id, name))}
          onRemoveManager={onRemoveManager}
          onDelete={() => setForm({ kind: "delete", league })}
          onLeave={() => setForm({ kind: "leave", league })}
        />
      ))}

      {form?.kind === "create" && (
        <CreateSheet
          weeks={weeks}
          nameMax={LEAGUE_NAME_MAX}
          privateCount={leagues.length}
          privateCap={PRIVATE_LEAGUE_CAP}
          initialName={NEW_LEAGUE.name}
          onCreate={create}
          onClose={close}
        />
      )}
      {form?.kind === "created" && (
        <CreatedSheet league={form.league} onCopyCode={() => copyText(form.league.code)} onCopyLink={() => copyText(leagueLink(form.league))} onClose={close} />
      )}
      {form?.kind === "join" && (
        <JoinSheet
          privateCount={leagues.length}
          privateCap={PRIVATE_LEAGUE_CAP}
          initialCode={joinable[0]?.code}
          error={joinError}
          onJoin={join}
          onClose={close}
        />
      )}
      {form?.kind === "leave" && <LeaveSheet league={form.league} onLeave={() => drop(form.league)} onClose={close} />}
      {form?.kind === "delete" && <DeleteSheet league={form.league} onDelete={() => drop(form.league)} onClose={close} />}
    </PageFrame>
  );
}
