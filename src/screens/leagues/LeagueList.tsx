import { count, cx, GoLink, MainAction, NONE, ordinal, OutlinedKey, Panel, plural, RankMove, tierName } from "../../parts";
import { leagueGo } from "../../paths";
import { capReason } from "./forms";
import "./LeagueList.css";
import { GroupMark, LeagueMark } from "./Marks";
import type { LeagueSummary, PrivateCount } from "./types";
import { ofSize, privateCountLine, withTier, WORDS } from "./words";

/**
 * Every league you're in, in the side column's panel: general (Overall with your tier, your country, your
 * team), then private, each with its mark, your rank and its move; the open one marked. The private
 * leagues scroll in place past eight, Create and Join staying in view below; at the cap both are off,
 * with the count and the reason under them (spec/08; plate.md, Parts).
 */
export function LeagueList({
  leagues,
  openId,
  privates,
  onCreate,
  onJoin,
}: {
  leagues: LeagueSummary[];
  openId: string;
  privates: PrivateCount;
  onCreate: () => void;
  onJoin: () => void;
}) {
  const general = leagues.filter((league) => league.kind === "general");
  const mine = leagues.filter((league) => league.kind === "private");
  const atCap = capReason(privates.count, privates.cap);
  const off = atCap === undefined ? undefined : "";
  const row = (league: LeagueSummary) => <ListRow key={league.id} league={league} open={league.id === openId} />;
  return (
    <Panel title={WORDS.yourLeagues} band className="leagues__list">
      <nav aria-label={WORDS.yourLeagues}>
        <h3 className="leagues__list-sub">{WORDS.general}</h3>
        {general.map(row)}
        <h3 className="leagues__list-sub">{WORDS.private}</h3>
        <div className="leagues__list-scroll">
          {mine.length > 0 ? (
            mine.map(row)
          ) : (
            <p className="leagues__list-none quiet">
              <GroupMark />
              {WORDS.noneYet}
            </p>
          )}
        </div>
      </nav>
      <div className="leagues__list-actions">
        <MainAction onClick={onCreate} disabledReason={off}>
          {WORDS.create}
        </MainAction>
        <OutlinedKey onClick={onJoin} disabledReason={off}>
          {WORDS.join}
        </OutlinedKey>
      </div>
      {atCap && (
        <p className="leagues__list-cap">
          {privateCountLine(privates.count, privates.cap)}
          <span className="quiet">{atCap}</span>
        </p>
      )}
    </Panel>
  );
}

/** A league's line: its mark and name, Overall's with your tier; your rank and its move; its size under. Before gameweek 1 is final, no rank (spec/08). */
function ListRow({ league, open }: { league: LeagueSummary; open: boolean }) {
  const { mark, rank, size } = league;
  const name = mark.kind === "tier" ? withTier(league.name, tierName(mark.tier)) : league.name;
  const isPrivate = league.kind === "private";
  const ranked = rank !== null;
  const unrankedOverall = !ranked && mark.kind === "tier";
  return (
    <GoLink go={leagueGo(league.id)} className={cx("leagues__list-row", open && "leagues__list-row--on")} current={open}>
      <span className="leagues__list-name">
        <LeagueMark mark={mark} />
        {name}
      </span>
      <b className="num">{unrankedOverall ? "" : !ranked ? NONE : isPrivate ? ordinal(rank) : count(rank)}</b>
      <span className="leagues__list-move">{!unrankedOverall && <RankMove move={league.move} />}</span>
      {(isPrivate || ranked) && <small>{isPrivate ? plural(size, WORDS.manager) : ofSize(count(size))}</small>}
    </GoLink>
  );
}
