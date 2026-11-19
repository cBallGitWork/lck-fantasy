// The coach card's tabs: This week, Fixtures, History and Roster (coach.html; Fixtures as the player card's).
import { Fragment } from "react";
import { gameNo, LiveTag, money, MeDot, NONE, pct, perGame, seriesResult, seriesTitle, signed, sum, Table, Time, YOUR_TIME } from "../../parts";
import { ROLE_NAME } from "../../rift";
import type { CoachHistory, CoachWeek, FixtureRow, HistoryRow, PastSeason, PlayedSeries, RosterRow, WeekSeries } from "./types";
import { dot, scoredBy, seriesIfs, versus, weekNo, WORDS } from "./words";


const isPlayed = (s: WeekSeries): s is PlayedSeries => s.state !== "upcoming";

/**
 * This week: each series (the strip carries its Live tag), its games with the lines they scored, the series line, then the week.
 * A series not yet started shows its time and — for points, and the week is — until his team's first series starts (spec/12).
 */
export function CoachThisWeek({ week }: { week: CoachWeek }) {
  const started = week.series.some(isPlayed);
  return (
    <div className="coach-card__week">
      {week.series.map((s) => (
        <Fragment key={s.id}>
          <h2 className="coach-card__block">
            <span>
              {seriesTitle(s.day, s.opponent)}{" "}
              <span className="coach-card__soft">{isPlayed(s) ? seriesResult(s.score, s.state === "live") : <Time local={s.local} />}</span>
            </span>
            <b className="num">{isPlayed(s) ? s.points : NONE}</b>
          </h2>
          {isPlayed(s) && (
            <table className="coach-card__games">
              <tbody>
                {s.games.map((g, i) => (
                  <tr key={i} className={g.counts ? undefined : "coach-card__drop"}>
                    <td className="coach-card__g coach-card__soft">{gameNo(i + 1)}</td>
                    <td className="coach-card__g coach-card__soft">{g.result ?? ""}</td>
                    <td className="coach-card__soft">{g.clock ?? (g.lines.length > 0 ? g.lines.join(" · ") : NONE)}</td>
                    <td className="coach-card__pts num">{g.points}</td>
                  </tr>
                ))}
                <SeriesLine series={s} week={week} />
              </tbody>
            </table>
          )}
        </Fragment>
      ))}
      <table className="coach-card__games">
        <tbody>
          <tr className="coach-card__total">
            <td>{weekNo(week.week)}</td>
            <td className="coach-card__pts num">{started ? week.total : NONE}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/** The series line: +3 won, −1 lost; while live, both. */
function SeriesLine({ series, week }: { series: PlayedSeries; week: CoachWeek }) {
  const [label, points] =
    series.state === "live"
      ? [seriesIfs(signed(week.seriesWon), signed(week.seriesLost)), NONE]
      : series.score[0] > series.score[1]
        ? [WORDS.seriesWon, signed(week.seriesWon)]
        : [WORDS.seriesLost, signed(week.seriesLost)];
  return (
    <tr>
      <td className="coach-card__soft" colSpan={3}>
        {label}
      </td>
      <td className="coach-card__pts num">{points}</td>
    </tr>
  );
}

/** The team's next series: each week's number once, and your time. */
export function CoachFixtures({ rows, team }: { rows: FixtureRow[]; team: string }) {
  return (
    <Table<FixtureRow>
      label={WORDS.fixtures}
      rows={rows}
      rowKey={(r) => `${r.week}-${r.day}`}
      columns={[
        { key: "week", head: WORDS.week, width: "goCol", cell: (r) => (firstOfWeek(rows, r) ? <span className="coach-card__soft">{r.week}</span> : "") },
        {
          key: "series",
          head: WORDS.series,
          cell: (r) => (
            <>
              {r.day}
              {dot}
              <b>{versus(team, r.opponent)}</b>
              {dot}
              {r.format}
            </>
          ),
        },
        { key: "local", head: YOUR_TIME, figure: true, cell: (r) => r.local },
      ]}
    />
  );
}

/**
 * History: each series' points, the week's price and total once; then past seasons, the team's.
 * `shown` is the rows the strip doesn't show, and a live one; a week's total still counts them all.
 */
export function CoachHistoryTab({ history, shown, team }: { history: CoachHistory; shown: HistoryRow[]; team: string }) {
  const weekTotal = (week: number) => sum(history.rows.filter((r) => r.week === week).map((r) => r.points));
  return (
    <div className="coach-card__history">
      <h2 className="coach-card__block coach-card__block--first">{history.competition}</h2>
      <Table<HistoryRow>
        label={history.competition}
        rows={shown}
        rowKey={(r) => `${r.week}-${r.day}`}
        ruleAbove={(r) => r !== shown[0] && firstOfWeek(shown, r)}
        columns={[
          { key: "week", head: WORDS.week, width: "goCol", cell: (r) => (firstOfWeek(shown, r) ? <span className="coach-card__soft">{r.week}</span> : "") },
          {
            key: "series",
            head: WORDS.series,
            cell: (r) => (
              <>
                {`${r.day}${dot}${seriesResult(r.score, r.live ?? false)} ${r.opponent}`}
                {r.live && <> <LiveTag /></>}
              </>
            ),
          },
          { key: "games", head: WORDS.games, figure: true, cell: (r) => r.games },
          { key: "price", head: WORDS.weekPrice, figure: true, cell: (r) => (firstOfWeek(shown, r) ? <span className="coach-card__soft">{money(r.priceM)}</span> : "") },
          { key: "pts", head: WORDS.pts, figure: true, cell: (r) => <b>{r.points}</b> },
          { key: "weekPts", head: WORDS.weekPts, figure: true, cell: (r) => (firstOfWeek(shown, r) ? <b>{weekTotal(r.week)}</b> : "") },
        ]}
      />
      <h2 className="coach-card__block">
        {WORDS.pastSeasons} <span className="coach-card__soft">{scoredBy(team)}</span>
      </h2>
      <Table<PastSeason>
        label={WORDS.pastSeasons}
        rows={history.past}
        rowKey={(r) => r.season}
        columns={[
          { key: "season", head: WORDS.season, cell: (r) => r.season },
          { key: "games", head: WORDS.games, figure: true, cell: (r) => r.games },
          { key: "per", head: WORDS.perGame, figure: true, cell: (r) => <span className="coach-card__soft">{perGame(r.points, r.games)}</span> },
          { key: "pts", head: WORDS.pts, figure: true, cell: (r) => <b>{r.points}</b> },
        ]}
      />
    </div>
  );
}

/** Roster: the team's players with role, price, season points and owned; yours marked. */
export function CoachRoster({ rows }: { rows: RosterRow[] }) {
  return (
    <div className="coach-card__roster">
      <Table<RosterRow>
        label={WORDS.roster}
        rows={rows}
        rowKey={(r) => r.name}
        columns={[
          { key: "role", head: WORDS.role, cell: (r) => <span className="coach-card__soft">{ROLE_NAME[r.role]}</span> },
          {
            key: "player",
            head: WORDS.player,
            cell: (r) => (
              <>
                {r.name}
                {r.mine && <MeDot />}
              </>
            ),
          },
          { key: "price", head: WORDS.rosterPrice, figure: true, cell: (r) => money(r.priceM) },
          { key: "season", head: WORDS.seasonPts, figure: true, cell: (r) => <b>{r.points}</b> },
          { key: "owned", head: WORDS.owned, figure: true, cell: (r) => <span className="coach-card__soft">{pct(r.ownedPct)}</span> },
        ]}
      />
    </div>
  );
}

/** A row that opens its week, where the week's number, price and total show once. */
function firstOfWeek<R extends { week: number }>(rows: R[], row: R): boolean {
  const i = rows.indexOf(row);
  return i === 0 || rows[i - 1]?.week !== row.week;
}
