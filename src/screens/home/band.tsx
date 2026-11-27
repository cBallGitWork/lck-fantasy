import { CHEER_KEY, CHEER_LABEL, CHEER_WORD, count, Led, NotFinalTag, LinkGo, Panel, pct, TruckHire, type CheerKind } from "../../parts";
import { PATHS } from "../../paths";
import type { FeedItem, HomeFollowing, ManagersWeek } from "./types";
import { FactLabel, Who } from "./who";
import { dot, fromLine, sentWord, weekName, weekSoFar, WORDS } from "./words";

/** The Following panel's cheering: the cheer or jeer sent each manager this week, by manager id, and the key's action. */
export interface Cheering {
  sent?: Record<string, CheerKind>;
  /** `Cheer / Jeer ›` on a row: opens the picker (spec/14). */
  onCheer?: (managerId: string) => void;
}

/** One followed manager's row: his name, the series, his points in it, and `Cheer / Jeer ›`, or what was sent him this week. */
export function FeedRow({ item, sent, onCheer }: { item: FeedItem } & Cheering) {
  const already = sent?.[item.managerId];
  return (
    <tr>
      <td>
        <b>{item.manager}</b>
        <span className="home__mid">
          {dot}
          {item.series}
        </span>
      </td>
      <td className="home__fig num">
        <b>{item.points}</b>
      </td>
      <td className="home__fig num">
        {already ? (
          <span className="home__sent quiet">{sentWord(CHEER_WORD[already])}</span>
        ) : (
          <button type="button" className="home__cheer key-bare hover-line" aria-label={`${CHEER_LABEL} ${item.manager}`} onClick={() => onCheer?.(item.managerId)}>
            {CHEER_KEY} ›
          </button>
        )}
      </td>
    </tr>
  );
}

/** Following (What binds 4): the latest feed items, each with its points and `Cheer / Jeer ›`; the latest cheer or jeer on its LED panel; Following ›. */
export function Following({ following, ...cheering }: { following: HomeFollowing } & Cheering) {
  const { received } = following;
  return (
    <Panel title={WORDS.following} band className="home__panel">
      <table className="home__rows home__feed">
        <thead>
          <tr className="home__sub">
            <th>
              {weekName(following.week)}
              {!following.final && (
                <>
                  {" "}
                  <NotFinalTag />
                </>
              )}
            </th>
            <th className="home__fig num">{WORDS.pts}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {following.items.map((item) => (
            <FeedRow key={item.id} item={item} {...cheering} />
          ))}
        </tbody>
      </table>
      {received && (
        <div className="home__received">
          <Led>{received.line}</Led>
          <p className="home__received-by quiet">
            {fromLine(CHEER_WORD[received.cheer], received.from)}
            {dot}
            {weekName(received.week)}
          </p>
          <TruckHire />
        </div>
      )}
      <p className="home__foot">
        <LinkGo go={{ to: PATHS.following }}>{WORDS.following}</LinkGo>
      </p>
    </Panel>
  );
}

/** All managers (What binds 4): Most captained as a share under the week it was set for; Most bought and Most sold as counts under `Week N so far`. */
export function AllManagers({ weeks }: { weeks: ManagersWeek[] }) {
  return (
    <Panel title={WORDS.allManagers} band className="home__panel">
      <table className="home__rows home__managers">
        {weeks.map((w) => (
          <tbody key={w.week}>
            <tr className="home__sub">
              <th colSpan={3}>{w.soFar ? weekSoFar(w.week) : weekName(w.week)}</th>
            </tr>
            {w.facts.map((f) => (
              <tr key={f.kind}>
                <td>
                  <FactLabel kind={f.kind} />
                </td>
                <td>
                  <Who who={f} />
                </td>
                <td className="home__fig num">{f.kind === "captained" ? pct(f.value) : count(f.value)}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </Panel>
  );
}
