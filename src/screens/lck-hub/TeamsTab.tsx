import type { TeamCode } from "../../fixtures/week3";
import { cx, formatEok, GoLink, ViewToggle } from "../../parts";
import { PATHS } from "../../paths";
import { RoleIcon, ROLE_NAME } from "../../rift";
import type { Roster, RosterMember, TeamRosters } from "./types";
import { SectionTitle } from "./Week";

const NO_PRICE = "—";

const cardGo = (m: RosterMember) =>
  m.role === "coach" ? { to: PATHS.coachCard, params: { coachId: m.id } } : { to: PATHS.playerCard, params: { playerId: m.id } };

function RosterTable({ roster }: { roster: Roster }) {
  return (
    <section>
      <SectionTitle note={roster.league}>{roster.name}</SectionTitle>
      <table className="lck-hub__roster" aria-label={roster.name}>
        <tbody>
          {roster.members.map((m) => (
            <tr key={m.id} className={cx(m.role === "coach" && "lck-hub__roster-coach")}>
              <td className="lck-hub__role">
                <RoleIcon role={m.role} className="lck-hub__role-icon" />
                {ROLE_NAME[m.role]}
              </td>
              <td>
                <GoLink className="lck-hub__person" go={cardGo(m)}>
                  <b>{m.name}</b>{" "}
                  <small className="lck-hub__hangul" lang="ko">
                    {m.hangul}
                  </small>
                </GoLink>
              </td>
              <td className={cx("lck-hub__price", "num", m.priceWon === undefined && "lck-hub__price--none")}>
                {m.priceWon === undefined ? NO_PRICE : formatEok(m.priceWon)}
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
