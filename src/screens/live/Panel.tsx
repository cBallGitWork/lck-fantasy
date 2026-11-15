import { cx, GoLink, LinkGo, Tag } from "../../parts";
import { PATHS, type Go } from "../../paths";
import { RoleIcon } from "../../rift";
import type { Panel, PanelPlayer, RestPlayer } from "./types";
import { dash, dot, WORDS } from "./words";

/** A player's card, or a coach's. */
const cardGo = (p: RestPlayer): Go =>
  p.role === "coach" ? { to: PATHS.coachCard, params: { coachId: p.id } } : { to: PATHS.playerCard, params: { playerId: p.id } };

function Mark({ mark }: { mark?: "C" | "V" }) {
  return mark ? <span className={cx("live__mark", mark === "C" && "live__mark--c")}>{mark}</span> : null;
}

/** This series' games: `G1 4 · G2 1 Live 3/0/2`, dashes where the feed is down. */
function GameLine({ player }: { player: PanelPlayer }) {
  const games = player.games.map((g, i) => `${WORDS.gameShort}${i + 1} ${g ?? WORDS.noPoints}`).join(dot);
  return (
    <span className="live__games num">
      {games}
      {player.won !== undefined && `${dot}${WORDS.won} +${player.won}`}
      {player.liveGame && <Tag kind="live">{WORDS.live}</Tag>}
      {player.kda}
    </span>
  );
}

function PlayerRow({ player }: { player: PanelPlayer }) {
  return (
    <GoLink go={cardGo(player)} className="live__row">
      <RoleIcon role={player.role} className="live__row-icon" />
      <span>
        <span className="live__name">
          {player.name}
          <small className="live__team">{player.team}</small>
          <Mark mark={player.mark} />
        </span>
        <GameLine player={player} />
      </span>
      <span className="live__points num">{player.points}</span>
    </GoLink>
  );
}

function RestRow({ player }: { player: RestPlayer }) {
  return (
    <GoLink go={cardGo(player)} className="live__rest">
      <span className="live__rest-name">
        <RoleIcon role={player.role} className="live__rest-icon" />
        {player.name}
        <small className="live__team">{player.team}</small>
        <Mark mark={player.mark} />
      </span>
      <span className="live__points num">{player.points}</span>
    </GoLink>
  );
}

/** Your week with Average and Highest, your players in the series, the rest of your week, Points ›. */
export function PointsPanel({ panel, down }: { panel: Panel; down?: boolean }) {
  const { week, series } = panel;
  return (
    <>
      {down && (
        <div className="live__down" role="status">
          <b className="live__down-title">{WORDS.downTitle}</b>
          {WORDS.downNote}
        </div>
      )}
      <h2 className="live__head">
        {WORDS.yourWeek}
        {week.notFinal && <Tag kind="notFinal">{WORDS.notFinal}</Tag>}
      </h2>
      <div className="live__total">
        <span className="live__key num">{week.total}</span>
        <span className="live__avg">
          {WORDS.average} <b className="live__figure num">{week.average}</b>
        </span>
        <span className="live__avg">
          {WORDS.highest} <b className="live__figure num">{week.highest}</b>
          <span className="live__go">›</span>
        </span>
      </div>
      <h2 className="live__head">
        {series.home} {series.score ? series.score.join(dash) : WORDS.versus} {series.away}
      </h2>
      {panel.players.map((p) => (
        <PlayerRow key={p.id} player={p} />
      ))}
      <h2 className="live__head live__head--apart">{WORDS.rest}</h2>
      {panel.rest.map((p) => (
        <RestRow key={p.id} player={p} />
      ))}
      <span className="live__more">
        <LinkGo go={{ to: PATHS.points }}>{WORDS.points}</LinkGo>
      </span>
    </>
  );
}
