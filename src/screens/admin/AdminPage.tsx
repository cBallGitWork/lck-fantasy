import { useId, useState, type FormEvent, type ReactNode } from "react";
import type { Played, SimState } from "../../../convex/admin/sim";
import { Empty, ErrorState, Field, Loading, PageFrame, PageHead, TabPanel, Tabs } from "../../parts";
import { SCREEN_NAME } from "../../paths";
import { REGION } from "../../region";
import { TABS, WORDS, type AdminTab } from "./words";
import "./admin.css";

/** A read from the server: undefined while loading, else its value or why it failed. */
export type Read<T> = T | undefined | Error;

export type Alert = { at: number; message: string };
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

/** The key form: the admin types the key once a visit; it is never stored. */
export function KeyForm({ onKey, refused }: { onKey: (key: string) => void; refused?: string }) {
  const [key, setKey] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onKey(key);
  };
  return (
    <form className="admin__key" onSubmit={submit}>
      <Field label={WORDS.keyLabel} type="password" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} error={refused} />
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

function Alerts({ alerts }: { alerts: Read<Alert[]> }) {
  if (alerts === undefined) return <Loading />;
  if (alerts instanceof Error) return <Failed error={alerts} />;
  if (alerts.length === 0) return <Empty title={WORDS.noAlerts} />;
  return (
    <table className="admin__alerts">
      <tbody>
        {alerts.map((alert, i) => (
          <tr key={i}>
            <td className="num quiet">{simMoment(alert.at)}</td>
            <td>{alert.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The admin section (Craig, 19 Nov 2026): a plain page with no picture, its Sim tab and its Alerts. */
export function AdminPage({
  sim,
  alerts,
  onPress,
  tab: firstTab = TABS[0],
}: {
  sim: Read<SimState>;
  alerts: Read<Alert[]>;
  onPress: (press: Press) => Promise<Played>;
  tab?: AdminTab;
}) {
  const id = useId();
  const [tab, setTab] = useState(firstTab);
  return (
    <AdminFrame>
      <Tabs id={id} tabs={TABS} chosen={tab} onChoose={setTab} />
      <TabPanel id={id} className="admin__panel">
        {tab === "Sim" ? <Sim state={sim} onPress={onPress} /> : <Alerts alerts={alerts} />}
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
