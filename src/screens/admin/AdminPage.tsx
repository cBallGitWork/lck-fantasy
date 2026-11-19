import { useId, useState, type FormEvent, type ReactNode } from "react";
import { ALERT_KINDS } from "../../../convex/admin/alertKinds";
import type { ListedAlert } from "../../../convex/admin/alerts";
import type { RoleSpread } from "../../../convex/admin/priceSpread";
import type { SeasonReport } from "../../../convex/admin/seasonReport";
import type { Played, SimState } from "../../../convex/admin/sim";
import { Empty, ErrorState, Field, formatWon, Loading, NONE, PageFrame, PageHead, TabPanel, Tabs } from "../../parts";
import { SCREEN_NAME } from "../../paths";
import { REGION } from "../../region";
import { TABS, WORDS, type AdminTab } from "./words";
import "./admin.css";

/** A read from the server: undefined while loading, else its value or why it failed. */
export type Read<T> = T | undefined | Error;

export type Alert = ListedAlert;
export type Press = "nextDay" | "playToEnd";

/** A moment as the Sim page shows it, in the region's zone: `Thu 15 Jan 00:00 KST`, or the day alone. */
export function simMoment(at: number, withTime = true): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: REGION.timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: withTime ? "2-digit" : undefined,
    minute: withTime ? "2-digit" : undefined,
    hourCycle: "h23",
  }).formatToParts(at);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const day = `${part("weekday")} ${part("day")} ${part("month")}`;
  return withTime ? `${day} ${part("hour")}:${part("minute")} ${REGION.timeZoneLabel}` : day;
}

/** What a press played, as one line: the clock stops at the midnight after the day it played. */
export function playedLine({ to, series, deadlines }: Played): string {
  return to === null ? WORDS.noGamesLeft : WORDS.played(simMoment(to - 1, false), series, deadlines);
}

/** The password form: the admin types it once a visit; it is never stored. */
export function PasswordForm({ onPassword, refused }: { onPassword: (password: string) => void; refused?: string }) {
  const [password, setPassword] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onPassword(password);
  };
  return (
    <form className="admin__password" onSubmit={submit}>
      <Field
        label={WORDS.passwordLabel}
        type="password"
        autoComplete="off"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={refused}
      />
      <button type="submit" className="admin__press">
        {WORDS.open}
      </button>
    </form>
  );
}

function Failed({ error }: { error: Error }) {
  return <ErrorState title={WORDS.failed} line={error.message} />;
}

function Sim({ state, onPress }: { state: Read<SimState>; onPress: (press: Press) => Promise<Played> }) {
  const [pressing, setPressing] = useState(false);
  const [result, setResult] = useState<Read<Played>>();
  if (state === undefined) return <Loading rows={2} />;
  if (state instanceof Error) return <Failed error={state} />;
  if (!state.sim) return <Empty title={WORDS.notSim} />;
  if (state.now === null) return <Empty title={WORDS.notStarted} />;
  const press = async (which: Press) => {
    setPressing(true);
    setResult(undefined);
    try {
      setResult(await onPress(which));
    } catch (e) {
      setResult(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setPressing(false);
    }
  };
  // Greyed out while a press plays, and once no game is left.
  const off = pressing || !state.gamesLeft;
  return (
    <section className="admin__sim">
      <p>
        {WORDS.simDate}: <b className="num">{simMoment(state.now)}</b>
      </p>
      <div className="admin__presses">
        {(["nextDay", "playToEnd"] as const).map((which) => (
          <button key={which} type="button" className="admin__press key-off" disabled={off} onClick={() => void press(which)}>
            {WORDS[which]}
          </button>
        ))}
        {pressing && <span className="quiet">{WORDS.pressing}</span>}
        {!pressing && !state.gamesLeft && <span className="quiet">{WORDS.noGamesLeft}</span>}
      </div>
      {result instanceof Error ? <Failed error={result} /> : result && <p role="status">{playedLine(result)}</p>}
    </section>
  );
}

function Alerts({ alerts, onClose }: { alerts: Read<Alert[]>; onClose: (id: string) => Promise<unknown> }) {
  const [closeFailed, setCloseFailed] = useState<Error>();
  if (alerts === undefined) return <Loading />;
  if (alerts instanceof Error) return <Failed error={alerts} />;
  if (alerts.length === 0) return <Empty title={WORDS.noAlerts} />;
  const close = (id: string) => {
    setCloseFailed(undefined);
    onClose(id).catch((e: unknown) => setCloseFailed(e instanceof Error ? e : new Error(String(e))));
  };
  return (
    <>
      {closeFailed && <Failed error={closeFailed} />}
      <table className="admin__alerts">
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td className="num quiet">{simMoment(alert.at)}</td>
              <td>{WORDS.kind[alert.kind]}</td>
              <td>
                {alert.message}
                {alert.names.length > 0 && <div className="quiet">{alert.names.join(" · ")}</div>}
              </td>
              <td>
                {alert.open ? (
                  <button type="button" className="admin__press" onClick={() => close(alert.id)}>
                    {WORDS.close}
                  </button>
                ) : (
                  <span className="quiet">{WORDS.closedAlert}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const priced = (p: { name: string; won: number }) => WORDS.priced(p.name, formatWon(p.won));
const ends = (side: RoleSpread["start"]) => (side === null ? NONE : `${priced(side.dearest)}, ${priced(side.cheapest)}`);
const movers = (list: { name: string; won: number }[]) => (list.length === 0 ? WORDS.none : list.map(priced).join(" · "));

/** The end-of-season report (#401): open alerts by kind, the mismatches, and the prices. */
function Report({ report }: { report: Read<SeasonReport> }) {
  if (report === undefined) return <Loading rows={3} />;
  if (report instanceof Error) return <Failed error={report} />;
  const { openAlerts, mismatches, prices } = report;
  return (
    <section className="admin__report">
      <h2>{report.season ?? WORDS.noSeason}</h2>
      <p>
        {WORDS.openAlerts}: {ALERT_KINDS.map((kind) => `${WORDS.kind[kind]} ${openAlerts[kind]}`).join(" · ")}
      </p>
      <p>
        {WORDS.mismatches}: <b className="num">{mismatches}</b> <span className="quiet">({WORDS.mismatchesNote})</span>
      </p>
      <h3>{WORDS.prices}</h3>
      <table className="admin__alerts">
        <thead>
          <tr>
            <th>{WORDS.role}</th>
            <th>
              {WORDS.start} <span className="quiet">({WORDS.dearestCheapest})</span>
            </th>
            <th>{WORDS.end}</th>
          </tr>
        </thead>
        <tbody>
          {prices.roles.map((role) => (
            <tr key={role.role}>
              <td>{role.role}</td>
              <td className="num">{ends(role.start)}</td>
              <td className="num">{ends(role.end)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        {WORDS.weeks}: {prices.weeks.length === 0 ? WORDS.none : prices.weeks.map((w) => WORDS.week(w.gameweek, w.rises, w.falls)).join(" · ")}
      </p>
      <p>
        {WORDS.risers}: {movers(prices.risers)}
      </p>
      <p>
        {WORDS.fallers}: {movers(prices.fallers)}
      </p>
    </section>
  );
}

/** The admin section (Craig, 19 Nov 2026): a plain page with no picture, its Sim tab, its Alerts and
 *  the season's Report. */
export function AdminPage({
  sim,
  alerts,
  report,
  onPress,
  onClose,
  tab: firstTab = TABS[0],
}: {
  sim: Read<SimState>;
  alerts: Read<Alert[]>;
  report: Read<SeasonReport>;
  onPress: (press: Press) => Promise<Played>;
  onClose: (alert: string) => Promise<unknown>;
  tab?: AdminTab;
}) {
  const id = useId();
  const [tab, setTab] = useState(firstTab);
  return (
    <AdminFrame>
      <Tabs id={id} tabs={TABS} chosen={tab} onChoose={setTab} />
      <TabPanel id={id} className="admin__panel">
        {tab === "Sim" && <Sim state={sim} onPress={onPress} />}
        {tab === "Alerts" && <Alerts alerts={alerts} onClose={onClose} />}
        {tab === "Report" && <Report report={report} />}
      </TabPanel>
    </AdminFrame>
  );
}

/** The admin section's frame: its page and its title. */
export function AdminFrame({ children }: { children: ReactNode }) {
  return (
    <PageFrame screen="admin" account={null}>
      <PageHead title={SCREEN_NAME.admin} />
      <div className="admin">{children}</div>
    </PageFrame>
  );
}
