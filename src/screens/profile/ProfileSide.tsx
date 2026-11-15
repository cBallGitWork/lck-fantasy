import { GoLink, SideSection } from "../../parts";
import { PATHS } from "../../paths";
import type { LeagueRow, Truck } from "./fixtures";
import { count, ordinal } from "./format";
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
                      <TierShield division={league.tier.division} />
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

/** Overall's tier as a shield with its division (spec/08). */
function TierShield({ division }: { division: string }) {
  return (
    <svg className="profile__tier" viewBox="0 0 40 46" aria-hidden="true">
      <path d="M20 4 L35 9 V24 C35 33 28 39 20 42 C12 39 5 33 5 24 V9 Z" />
      <path className="profile__tier-band" d="M5 15 H35" />
      <text x="20" y="31" textAnchor="middle" fontSize="14">
        {division}
      </text>
    </svg>
  );
}
