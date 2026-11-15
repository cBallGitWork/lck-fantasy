import { GoLink, ordinal, SideSection, TierShield } from "../../parts";
import { PATHS } from "../../paths";
import type { LeagueRow, Truck } from "./fixtures";
import { count } from "./format";
import { Move } from "./ProfileHistory";

const TRUCK_KIND: Record<Truck["kind"], string> = { coffee: "Coffee", protest: "Protest" };

/** The side column: her leagues, her tier beside Overall, and on Points the trucks parked on her that week. */
export function ProfileSide({ leagues, trucks }: { leagues: LeagueRow[]; trucks?: { week: number; list: Truck[] } }) {
  return (
    <>
      <SideSection title="Leagues">
        <ul className="profile__leagues">
          {leagues.map((league) => (
            <li key={league.id}>
              <GoLink className="profile__league" go={{ to: PATHS.league, params: { leagueId: league.id } }}>
                <span className="profile__league-name">
                  {league.name}
                  {league.tier && (
                    <>
                      <TierShield className="profile__tier" division={league.tier.division} />
                      <b>
                        {league.tier.name} {league.tier.division}
                      </b>
                    </>
                  )}
                </span>
                <span>
                  <b className="num">{league.ordinal ? ordinal(league.rank) : count(league.rank)}</b> <Move places={league.move} />
                </span>
              </GoLink>
            </li>
          ))}
        </ul>
      </SideSection>
      {trucks && trucks.list.length > 0 && (
        <SideSection title={`Trucks · Week ${trucks.week}`} note={trucks.list.length}>
          {trucks.list.map((truck) => (
            <div key={truck.from} className="profile__truck">
              <p className="profile__led">{truck.line}</p>
              <p className="profile__truck-by">
                {TRUCK_KIND[truck.kind]} from <b>{truck.from}</b>
              </p>
            </div>
          ))}
        </SideSection>
      )}
    </>
  );
}

