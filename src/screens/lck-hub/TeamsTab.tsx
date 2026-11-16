import type { TeamCode } from "../../fixtures/week3";
import { cx, formatEok, GoLink, NONE, SectionHead, ViewToggle } from "../../parts";
import { cardGo } from "../../paths";
import { RoleIcon, ROLE_NAME } from "../../rift";
import type { Roster, TeamRosters } from "./types";


function RosterTable({ roster }: { roster: Roster }) {
  return (
    <section>
      <SectionHead className="lck-hub__title" note={roster.league}>{roster.name}</SectionHead>
      <table className="lck-hub__roster" aria-label={roster.name}>
        <tbody>
          {roster.members.map((m) => (
            <tr key={m.id} className={cx(m.role === "coach" && "lck-hub__roster-coach")}>
              <td className="lck-hub__role quiet">
                <RoleIcon role={m.role} className="lck-hub__role-icon" />
                {ROLE_NAME[m.role]}
              </td>
              <td>
                <GoLink className="lck-hub__person" go={cardGo(m.id, m.role === "coach")}>
                  <b>{m.name}</b>{" "}
                  <small className="lck-hub__hangul quiet" lang="ko">
                    {m.hangul}
                  </small>
                </GoLink>
              </td>
              <td className={cx("lck-hub__price", "num", m.priceWon === undefined && "lck-hub__price--none")}>
                {m.priceWon === undefined ? NONE : formatEok(m.priceWon)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/** Teams: a team picker, then its LCK roster beside its academy (LCK CL) roster, role order, the coach last. */
export function Teams({ teams, chosen, onChoose }: { teams: TeamRosters[]; chosen: TeamCode; onChoose?: (team: TeamCode) => void }) {
  const shown = teams.find((t) => t.team === chosen);
  return (
    <div>
      <div className="lck-hub__picker">
        <ViewToggle options={teams.map((t) => t.team)} chosen={chosen} onChoose={onChoose} label="Team" />
      </div>
      {shown && (
        <div className="lck-hub__two">
          <RosterTable roster={shown.lck} />
          {shown.academy && <RosterTable roster={shown.academy} />}
        </div>
      )}
    </div>
  );
}
