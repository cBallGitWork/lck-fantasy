import { gameNo, GoLink, LinkGo, LiveTag, NONE, NotFinalTag, SectionHead } from "../../parts";
import { cardGo, PATHS } from "../../paths";
import { MarkBadge, RoleIcon } from "../../rift";
import type { Panel, PanelPlayer, RestPlayer } from "./types";
import { dot, WORDS } from "./words";

/** This series' games: `G1 4 · G2 1 Live 3/0/2`, dashes where the feed is down. */
function GameLine({ player }: { player: PanelPlayer }) {
  const games = player.games.map((g, i) => `${gameNo(i + 1)} ${g ?? NONE}`).join(dot);
  return (
    <span className="live__games quiet num">
      {games}
      {player.won !== undefined && `${dot}${WORDS.won} +${player.won}`}
      {player.liveGame && <LiveTag />}
      {player.kda}
    </span>
  );
}

function PlayerRow({ player }: { player: PanelPlayer }) {
  return (
    <GoLink go={cardGo(player.id, player.role === "coach")} className="live__row">
      <RoleIcon role={player.role} className="live__row-icon" />
      <span>
        <span className="live__name">
          {player.name}
          <small className="live__team quiet">{player.team}</small>
          {player.mark && <MarkBadge mark={player.mark} className="live__mark" />}
        </span>
        <GameLine player={player} />
      </span>
      <span className="live__points num">{player.points}</span>
    </GoLink>
  );
}

function RestRow({ player }: { player: RestPlayer }) {
  return (
    <GoLink go={cardGo(player.id, player.role === "coach")} className="live__rest">
      <span className="live__rest-name">
        <RoleIcon role={player.role} className="live__rest-icon" />
        {player.name}
        <small className="live__team quiet">{player.team}</small>
        {player.mark && <MarkBadge mark={player.mark} className="live__mark" />}
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
      <SectionHead>
        {WORDS.yourWeek}
        {week.notFinal && <NotFinalTag />}
      </SectionHead>
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
      <SectionHead>
        {series.home} {WORDS.versus} {series.away}
      </SectionHead>
      {panel.players.map((p) => (
        <PlayerRow key={p.id} player={p} />
      ))}
      <SectionHead className="live__apart">{WORDS.rest}</SectionHead>
      {panel.rest.map((p) => (
        <RestRow key={p.id} player={p} />
      ))}
      <span className="live__more">
        <LinkGo go={{ to: PATHS.points }}>{WORDS.points}</LinkGo>
      </span>
    </>
  );
}
