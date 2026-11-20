import { BUFFS } from "../../fixtures/competition";
import { cx, DIVISION_NUMERAL, LinkGo, NONE, signed, TIER_WORDS, Time } from "../../parts";
import { helpGo, PATHS, type Go } from "../../paths";
import { MarkBadge } from "../../rift";
import { coachRows, deadlineIn, playerRows, tierRows, type CoachRow, type HelpData } from "./facts";
import { GLOSSARY } from "./guide";
import { SCORING_RULE } from "./rules";
import {
  BUFF_HEADS,
  BUFF_LIKE,
  buffDoes,
  COACH_HEADS,
  coachLine,
  DEADLINE_HEADS,
  LINKS,
  NOTES,
  PLAYER_HEADS,
  playerLine,
  TIER_HEAD,
  weekName,
  type Block,
} from "./words";

const fig = "help__n num";

function PlayersTable({ data }: { data: HelpData }) {
  return (
    <table className="help__table">
      <thead>
        <tr>
          <th>{PLAYER_HEADS.what}</th>
          <th className="help__n">{PLAYER_HEADS.points}</th>
          <th className="help__n">{PLAYER_HEADS.cap}</th>
        </tr>
      </thead>
      <tbody>
        {playerRows(data.player).map((row) => (
          <tr key={row.line === "multikill" ? `multikill-${row.size}` : row.line}>
            <td>{playerLine(row)}</td>
            <td className={fig}>{signed(row.points)}</td>
            <td className={cx(fig, "quiet")}>{"cap" in row ? signed(row.cap) : NONE}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CoachRows({ rows, minutes }: { rows: CoachRow[]; minutes: number }) {
  return rows.map((row) => (
    <tr key={row.line}>
      <td>{coachLine(row.line, minutes)}</td>
      <td className={fig}>{signed(row.points)}</td>
    </tr>
  ));
}

function CoachTable({ data }: { data: HelpData }) {
  const { game, series } = coachRows(data.coach, data.series);
  const minutes = data.coach.quickWin.underMinutes;
  return (
    <table className="help__table">
      <tbody>
        <tr>
          <th>{COACH_HEADS.game}</th>
          <th className="help__n">{COACH_HEADS.points}</th>
        </tr>
        <CoachRows rows={game} minutes={minutes} />
        <tr>
          <th colSpan={2}>{COACH_HEADS.series}</th>
        </tr>
        <CoachRows rows={series} minutes={minutes} />
      </tbody>
    </table>
  );
}

function BuffsTable() {
  return (
    <table className="help__table help__table--named">
      <thead>
        <tr>
          <th>{BUFF_HEADS.buff}</th>
          <th>{BUFF_HEADS.does}</th>
          <th>{BUFF_HEADS.like}</th>
        </tr>
      </thead>
      <tbody>
        {BUFFS.map((buff) => (
          <tr key={buff}>
            <td>{buff}</td>
            <td>{buffDoes(buff)}</td>
            <td className="quiet">{BUFF_LIKE[buff]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TiersTable({ data }: { data: HelpData }) {
  return (
    <table className="help__table help__table--named">
      <thead>
        <tr>
          <th>{TIER_HEAD}</th>
          {DIVISION_NUMERAL.map((n) => (
            <th key={n} className="help__n">
              {n}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tierRows(data.tiers).map((row) => (
          <tr key={row.tier}>
            <td>{TIER_WORDS[row.tier].name}</td>
            {DIVISION_NUMERAL.map((n, i) => {
              const top = row.tops[i];
              return (
                <td key={n} className={cx(fig, top === undefined && "quiet")}>
                  {top ?? NONE}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DeadlinesTable({ data }: { data: HelpData }) {
  return (
    <table className="help__table help__table--named">
      <thead>
        <tr>
          <th>{DEADLINE_HEADS.week}</th>
          <th>{DEADLINE_HEADS.deadline}</th>
        </tr>
      </thead>
      <tbody>
        {data.deadlines.map(({ week, deadline }) => (
          <tr key={week}>
            <td>{weekName(week)}</td>
            <td>
              <Time {...deadlineIn(deadline, data.zone)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Glossary() {
  return (
    <table className="help__table help__table--named help__glossary">
      {GLOSSARY.map(({ group, terms }) => (
        <tbody key={group}>
          <tr>
            <th colSpan={2}>{group}</th>
          </tr>
          {terms.map(([term, meaning]) => (
            <tr key={term}>
              <td>{term}</td>
              <td>{meaning}</td>
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

const TABLES = { players: PlayersTable, coach: CoachTable, buffs: BuffsTable, tiers: TiersTable, deadlines: DeadlinesTable, glossary: Glossary };

function List({ items, captainMark, check }: { items: readonly string[]; captainMark?: boolean; check?: boolean }) {
  return (
    <ul className={cx("help__list", check && "help__list--check")}>
      {items.map((item, i) => (
        <li key={item}>
          {captainMark && i === 0 && <MarkBadge mark="C" className="help__mark" />}
          {item}
        </li>
      ))}
    </ul>
  );
}

/** One piece of a guide page or a rule. */
export function BlockView({ block, data }: { block: Block; data: HelpData }) {
  if ("p" in block) return <p className="help__p">{block.p}</p>;
  if ("list" in block) return <List items={block.list} captainMark={block.captainMark} check={block.check} />;
  if ("ex" in block) return <p className="help__ex quiet">{block.ex}</p>;
  if ("notes" in block) return <List items={NOTES[block.notes](data.series.bestGames)} />;
  if ("facts" in block) {
    return (
      <table className="help__table help__facts">
        <tbody>
          {block.facts.map(([name, value, note]) => (
            <tr key={name}>
              <td>{name}</td>
              {note === undefined ? <td>{value}</td> : <td className="num">{value}</td>}
              {note !== undefined && <td className="quiet">{note}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if ("table" in block) {
    const Table = TABLES[block.table];
    return <Table data={data} />;
  }
  const go: Go = block.link === "priceChanges" ? { to: PATHS.priceChanges } : helpGo(SCORING_RULE);
  return (
    <p className="help__p">
      <LinkGo go={go}>{LINKS[block.link]}</LinkGo>
    </p>
  );
}
