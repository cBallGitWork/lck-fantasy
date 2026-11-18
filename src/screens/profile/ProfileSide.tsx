import { CHEER_WORD, CHEERS_RECEIVED, count, GoLink, Led, RankMove, SideSection, TierShield, TruckHire } from "../../parts";
import { leagueGo } from "../../paths";
import type { LeagueRow, Parked } from "./fixtures";

/** The side column: her leagues, her tier beside Overall, and on Points the cheers and jeers parked on her that week. */
export function ProfileSide({ leagues, cheers }: { leagues: LeagueRow[]; cheers?: { week: number; list: Parked[] } }) {
  return (
    <>
      <SideSection title="Leagues">
        <ul className="profile__leagues">
          {leagues.map((league) => (
            <li key={league.id}>
              <GoLink className="profile__league" go={leagueGo(league.id)}>
                <span className="profile__league-name">
                  {league.name}
                  {league.tier && (
                    <>
                      <TierShield className="profile__tier" />
                      <b>
                        {league.tier.name} {league.tier.division}
                      </b>
                    </>
                  )}
                </span>
                <span>
                  <b className="num">{count(league.rank)}</b> <RankMove move={league.move} />
                </span>
              </GoLink>
            </li>
          ))}
        </ul>
      </SideSection>
      {cheers && cheers.list.length > 0 && (
        <SideSection title={`${CHEERS_RECEIVED} · Week ${cheers.week}`} note={cheers.list.length}>
          {cheers.list.map((cheer) => (
            <div key={cheer.from} className="profile__cheer">
              <Led>{cheer.line}</Led>
              <p className="profile__cheer-by quiet">
                {CHEER_WORD[cheer.kind]} from <b>{cheer.from}</b>
                <TruckHire />
              </p>
            </div>
          ))}
        </SideSection>
      )}
    </>
  );
}

