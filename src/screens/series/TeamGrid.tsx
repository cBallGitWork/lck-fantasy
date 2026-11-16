import { cx, GoLink, LinkGo, MeDot, NONE, outcome, SectionHead, signed, Tag } from "../../parts";
import { cardGo, type Go } from "../../paths";
import { RoleIcon, ROLE_NAME, type IconKey } from "../../rift";
import type { CoachLine, Game, Person, PlayerLine, Roster, TeamSheet } from "./types";

/** The coach's series result as the picture draws it: `W +3`, `L −1`. */
const resultLabel = (points: number) => `${outcome(points > 0)} ${signed(points)}`;

export const gameWon = (game: Game, code: string) => "winner" in game && game.winner === code;

function Name({ person, go }: { person: Person; go: Go }) {
  return (
    <td className="series__name">
      <GoLink go={go}>
        <b>{person.name}</b>
        <small className="series__hangul" lang="ko">
          {person.hangul}
        </small>
      </GoLink>
      {person.mine && <MeDot />}
    </td>
  );
}

function Role({ icon, label }: { icon: IconKey; label: string }) {
  return (
    <td className="series__role">
      <RoleIcon role={icon} className="series__role-icon" />
      {label}
    </td>
  );
}

function Points({ points, counts, pog }: { points: number; counts: boolean; pog?: boolean }) {
  return (
    <span className="series__points num">
      {pog && <Tag>POG</Tag>}
      <span className={cx(counts && "series__box")}>{points}</span>
    </span>
  );
}

function GameHead({ game, n, code }: { game: Game; n: number; code: string }) {
  if ("clock" in game)
    return (
      <th scope="col">
        G{n} <Tag kind="live">Live</Tag> <b className="num">{game.clock}</b>
      </th>
    );
  return (
    <th scope="col">
      G{n} <b>{outcome(gameWon(game, code))}</b> · <span className="num">{game.length}</span> · <LinkGo out={game.vod}>VOD</LinkGo>
    </th>
  );
}

function PlayerRow({ p }: { p: PlayerLine }) {
  return (
    <tr>
      <Role icon={p.role} label={p.sub ? `${ROLE_NAME[p.role]} · sub` : ROLE_NAME[p.role]} />
      <Name person={p} go={cardGo(p.id, false)} />
      {p.games.map((game, i) =>
        game ? (
          <td key={i} className={cx(!game.counts && "series__dropped")}>
            <div className="series__game">
              <span className="series__champ">
                {game.champion}
                <small className="num">{game.kda}</small>
              </span>
              <Points points={game.points} counts={game.counts} pog={game.pog} />
            </div>
          </td>
        ) : (
          <td key={i} className="series__none">
            —
          </td>
        ),
      )}
      <td className="series__total num">{p.total}</td>
    </tr>
  );
}

function CoachRow({ coach }: { coach: CoachLine }) {
  return (
    <tr className="series__coach">
      <Role icon="coach" label={ROLE_NAME.coach} />
      <Name person={coach} go={cardGo(coach.id, true)} />
      {coach.games.map((game, i) => (
        <td key={i} className={cx(!game.counts && "series__dropped")}>
          <div className="series__game">
            <span className={game.lines.length > 0 ? "series__coach-lines" : "series__none"}>{game.lines.join(" · ") || NONE}</span>
            <Points points={game.points} counts={game.counts} />
          </div>
        </td>
      ))}
      <td className="series__total num">
        {coach.total}
        {coach.result !== undefined && <small>{resultLabel(coach.result)}</small>}
      </td>
    </tr>
  );
}

/** One team's grid: a row per player in role order, then the coach; a column per game, then Series. */
export function TeamGrid({ team, games }: { team: TeamSheet; games: Game[] }) {
  return (
    <section className="series__team">
      <SectionHead>{team.name}</SectionHead>
      <table className={cx("series__grid", games.length > 2 && "series__grid--three")}>
        <colgroup>
          <col className="series__col-role" />
          <col className="series__col-name" />
          {games.map((_, i) => (
            <col key={i} />
          ))}
          <col className="series__col-total" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" aria-label="Role" />
            <th scope="col" aria-label="Name" />
            {games.map((game, i) => (
              <GameHead key={i} game={game} n={i + 1} code={team.code} />
            ))}
            <th scope="col" className="series__figure">
              Series
            </th>
          </tr>
        </thead>
        <tbody>
          {team.players.map((p) => (
            <PlayerRow key={p.id} p={p} />
          ))}
          <CoachRow coach={team.coach} />
        </tbody>
      </table>
    </section>
  );
}

/** Before it starts: the team's roster in role order, the coach last. */
export function RosterList({ team }: { team: Roster }) {
  return (
    <section className="series__team">
      <SectionHead note={team.name}>{team.code}</SectionHead>
      <table className="series__roster">
        <colgroup>
          <col className="series__col-roster-role" />
          <col />
        </colgroup>
        <tbody>
          {team.players.map((p) => (
            <tr key={p.id}>
              <Role icon={p.role} label={ROLE_NAME[p.role]} />
              <Name person={p} go={cardGo(p.id, false)} />
            </tr>
          ))}
          <tr className="series__coach">
            <Role icon="coach" label={ROLE_NAME.coach} />
            <Name person={team.coach} go={cardGo(team.coach.id, true)} />
          </tr>
        </tbody>
      </table>
    </section>
  );
}
