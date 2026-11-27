import { Fragment } from "react";
import { FactMark, Hint, HINTS, LinkGo, Panel, pct, RankMove, RowPlayer, tierName, TierShield, type FactKind } from "../../parts";
import { PATHS } from "../../paths";
import type { PointsData, WeekPick } from "./types";
import { approx, dot, PICK_WORDS, WORDS } from "./words";

/** Your week's line and the shared mark it carries. */
const WEEK_FACT: Record<WeekPick["label"], FactKind> = { Star: "star", Flop: "flop", Killer: "killer" };

/** Your week, below the series (approved/points/, What binds 9): Stars, the Flop and Killers, the word and mark on each group's first row only and no rule inside a group, then the player as `T1 Faker`, his points and his effective ownership; no dot. */
export function YourWeek({ picks }: { picks: WeekPick[] }) {
  return (
    <Panel title={WORDS.yourWeek} band className="points__side">
      <table className="points__picks">
        <thead>
          <tr>
            <th />
            <th />
            <th className="points__fig num">{WORDS.pts}</th>
            <th className="points__fig num">{WORDS.owned}</th>
          </tr>
        </thead>
        <tbody>
          {picks.map((p, i) => {
            const first = picks[i - 1]?.label !== p.label;
            return (
              <tr key={`${p.label}-${p.name}`} className={first ? undefined : "points__pick--more"}>
                <td className="quiet">
                  {first && (
                    <span className="points__fact">
                      <FactMark kind={WEEK_FACT[p.label]} />
                      {p.label === "Killer" ? <Hint line={HINTS.killer}>{PICK_WORDS[p.label]}</Hint> : PICK_WORDS[p.label]}
                    </span>
                  )}
                </td>
                <td>
                  <RowPlayer team={p.team} name={p.name} />
                </td>
                <td className="points__fig num">
                  <b>{p.points}</b>
                </td>
                <td className="points__owned num quiet">{pct(p.ownedPct)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}

/** The side column's first panel (What binds 7): each league's rank and its move; under Overall, both tier gaps, the number alone bold; All leagues › alone at the foot. */
export function Leagues({ leagues, tierGaps }: Pick<PointsData, "leagues" | "tierGaps">) {
  const gaps = [
    tierGaps.promote && { ...tierGaps.promote, words: WORDS.ptsTo },
    tierGaps.demote && { ...tierGaps.demote, words: WORDS.ptsClearOf },
  ].filter((gap) => gap !== null);
  return (
    <Panel title={WORDS.leagues} band className="points__side">
      <table className="points__ranks">
        <tbody>
          {leagues.map((l) => (
            <Fragment key={l.name}>
              <tr>
                <td>
                  {l.tier && <TierShield className="points__shield" unranked={l.tier.tier === "unranked"} />}
                  {l.name}
                  {l.tier && (
                    <>
                      {dot}
                      <Hint line={HINTS.tier}>{tierName(l.tier)}</Hint>
                    </>
                  )}
                </td>
                <td className="points__fig num">
                  <b>{l.rank}</b>
                </td>
                <td className="points__move num">
                  <RankMove move={l.move} />
                </td>
              </tr>
              {l.tier && gaps.length > 0 && (
                <tr className="points__gaps">
                  <td colSpan={3}>
                    {gaps.map((gap) => (
                      <span key={gap.words} className="points__gap quiet">
                        <b className="points__fig num">{approx(gap.points)}</b> {gap.words} <Hint line={HINTS.tier}>{tierName(gap.tier)}</Hint>
                      </span>
                    ))}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      <div className="points__leagues-foot">
        <LinkGo go={{ to: PATHS.leagues }}>{WORDS.allLeagues}</LinkGo>
      </div>
    </Panel>
  );
}
