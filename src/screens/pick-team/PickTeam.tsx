import { useReducer } from "react";
import { Deadline, MainAction, PageFrame, PageHead, Placeholder, SeriesList, SideSection, SponsorNote, ViewToggle } from "../../parts";
import { CardBoard, RiftBoard } from "./boards";
import { Buffs } from "./Buffs";
import type { PickPlayer, PickTeamData } from "./fixtures";
import type { ViewProps } from "./format";
import { changeCount, pickReducer, type PickAction, type PickState, type PickTeam, type PickView } from "./model";
import { PlayerCard } from "./PlayerCard";
import "./PickTeam.css";

const VIEWS = [
  { value: "rift", label: "Rift view" },
  { value: "cards", label: "Card view" },
] as const;

/** Pick Team, drawn from its state: Rift or Card view, the bench bar, the bar under the pitch, the side column. */
export function PickTeamView({ data, state, dispatch }: ViewProps) {
  const selected = state.selected ? data.players[state.selected] : undefined;
  const props = { data, state, dispatch };
  return (
    <PageFrame
      screen="pick-team"
      active="pickTeam"
      account={data.account}
      side={
        <>
          {selected && <PlayerCard {...props} player={selected} />}
          <Buffs {...props} />
          <SideSection title="This week's series" note="your time · KST">
            <SeriesList series={data.series} />
          </SideSection>
          <Placeholder word="Sponsor" height="sponsorH" />
          <SponsorNote />
        </>
      }
    >
      <PageHead title="Pick Team" hangul="팀 선택" sub={data.week} />
      <ViewToggle label="View" options={VIEWS} chosen={state.view} onChoose={(view: PickView) => dispatch({ type: "view", view })} />
      {state.view === "rift" ? <RiftBoard {...props} /> : <CardBoard {...props} />}
      <ChangeBar {...props} />
    </PageFrame>
  );
}

/** The bar under the pitch: what changed, Reset, the deadline, Save team (spec/12: nothing counts until Save). */
function ChangeBar({ data, state, dispatch }: ViewProps) {
  const changes = changeCount(state.saved, state.draft);
  const buff = state.draft.buff !== state.saved.buff ? data.buffs.find((b) => b.here !== undefined && b.here === state.draft.buff) : undefined;
  return (
    <div className="pick-team__bar">
      {changes === 0 ? (
        <span className="pick-team__changes">No changes</span>
      ) : (
        <>
          <span className="pick-team__changes">
            <b>
              {changes} {changes === 1 ? "change" : "changes"}
            </b>
            {buff && ` · ${buff.name} on`}
          </span>
          <button type="button" className="pick-team__reset" onClick={() => dispatch({ type: "reset" })}>
            Reset
          </button>
        </>
      )}
      <span className="pick-team__deadline">
        <Deadline {...data.deadline} />
      </span>
      <span className="pick-team__save">
        {/* `No changes` already leads the bar, so the disabled key's own reason stays empty. */}
        <MainAction disabledReason={changes === 0 ? "" : undefined} onClick={() => dispatch({ type: "save" })}>
          Save team
        </MainAction>
      </span>
    </div>
  );
}

/** The page with its state: it starts from `initial`, and hands a saved team to `onSave` and a chosen view to `onView`. */
export function PickTeamPage({
  data,
  initial,
  onSave,
  onView,
}: {
  data: PickTeamData;
  initial: PickState;
  onSave?: (team: PickTeam) => void;
  /** The backend remembers each manager's view (spec/12). */
  onView?: (view: PickView) => void;
}) {
  const [state, dispatch] = useReducer(
    pickReducer((id) => (data.players[id] as PickPlayer).role),
    initial,
  );
  const send = (action: PickAction) => {
    if (action.type === "save") onSave?.(state.draft);
    if (action.type === "view") onView?.(action.view);
    dispatch(action);
  };
  return <PickTeamView data={data} state={state} dispatch={send} />;
}
