import { useReducer } from "react";
import type { TeamCode } from "../../fixtures/week3";
import { Deadline, Empty, PageFrame, PageHead, Tabs, ViewToggle } from "../../parts";
import { Fixtures } from "./FixturesTab";
import { nextHub, startHub, weeksOf, type HubAction, type HubState, type WeekTab } from "./hubState";
import { News } from "./News";
import { Results } from "./ResultsTab";
import { Standings } from "./StandingsTab";
import { Teams } from "./TeamsTab";
import { HUB_TABS, type HubTab, type LckHubData } from "./types";
import "./lck-hub.css";

/** A stage with nothing to show yet: the Play-In before it starts. */
const NOT_STARTED = "Not started";

const recordsOf = (data: LckHubData, stage: number): Partial<Record<TeamCode, string>> =>
  Object.fromEntries((data.stages[stage]?.groups ?? []).flatMap((g) => g.rows.map((r) => [r.team, `${r.won}–${r.lost}`])));

/** The chosen tab's view, in the chosen stage. */
function TabView({ data, state, act }: { data: LckHubData; state: HubState; act: (a: HubAction) => void }) {
  if (state.tab === "Teams") return <Teams teams={data.teams} chosen={state.team} onChoose={(team) => act({ type: "team", team })} />;
  if (state.tab === "Standings") {
    const groups = data.stages[state.stage]?.groups ?? [];
    return groups.length ? <Standings groups={groups} /> : <Empty title={NOT_STARTED} />;
  }
  const tab: WeekTab = state.tab;
  const weeks = weeksOf(data, state, tab);
  const at = tab === "Fixtures" ? state.fixturesWeek : state.resultsWeek;
  const week = weeks[at];
  if (!week) return <Empty title={NOT_STARTED} />;
  const step = (s: -1 | 1) => (weeks[at + s] ? () => act({ type: "week", tab, step: s }) : undefined);
  return tab === "Fixtures" ? (
    <Fixtures week={week} bestOf={data.bestOf} records={recordsOf(data, state.stage)} onPrev={step(-1)} onNext={step(1)} />
  ) : (
    <Results week={week} bestOf={data.bestOf} onPrev={step(-1)} onNext={step(1)} />
  );
}

/**
 * The LCK hub (docs/design/approved/lck-hub/): the competition and the deadline; Fixtures,
 * Results, Standings and Teams, with the stage under them save on Teams; Sheep Esports' news beside.
 */
export function LckHub({ data, account, tab }: { data: LckHubData; account: string | null; tab?: HubTab }) {
  const [state, act] = useReducer((s: HubState, a: HubAction) => nextHub(data, s, a), undefined, () => startHub(data, tab));
  const stageNames = data.stages.map((s) => s.name);
  return (
    <PageFrame screen="lck-hub" active="lckHub" account={account}>
      <div className="lck-hub__head">
        <PageHead title={data.title} hangul={data.hangul} />
        <Deadline {...data.deadline} />
      </div>
      <Tabs tabs={HUB_TABS} chosen={state.tab} onChoose={(t) => act({ type: "tab", tab: t })} label="LCK hub" />
      {state.tab !== "Teams" && (
        <div className="lck-hub__stages">
          <ViewToggle
            options={stageNames}
            chosen={stageNames[state.stage] ?? ""}
            onChoose={(name) => act({ type: "stage", stage: stageNames.indexOf(name) })}
            label="Stage"
          />
        </div>
      )}
      <div className="lck-hub__body">
        <div>
          <TabView data={data} state={state} act={act} />
        </div>
        <aside>
          <News news={data.news} />
        </aside>
      </div>
    </PageFrame>
  );
}
