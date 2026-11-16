import { useReducer } from "react";
import { Deadline, MainAction, PageFrame, PageHead, Placeholder, SeriesList, SideSection, SponsorNote, TIME_NOTE, ViewToggle } from "../../parts";
import { BOARD_VIEWS, RIFT_VIEW, type BoardView } from "../../rift";
import { CardBoard, RiftBoard } from "./boards";
import { Buffs } from "./Buffs";
import type { PickTeamData } from "./fixtures";
import type { ViewProps } from "./format";
import { changeCount, pickReducer, type PickAction, type PickState, type PickTeam } from "./model";
import { PlayerCard } from "./PlayerCard";
import "./pick-team.css";

/** Pick Team, drawn from its state: Rift or Card view, the bench bar, the buffs above it, the bar under the pitch, the side column. */
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
          {selected && <PlayerCard state={state} dispatch={dispatch} player={selected} />}
          <SideSection title="This week's series" note={TIME_NOTE}>
            <SeriesList series={data.series} />
          </SideSection>
          <Placeholder word="Sponsor" height="sponsorH" />
          <SponsorNote />
        </>
      }
    >
      <PageHead title="Pick Team" hangul="팀 선택" sub={data.week} />
      <Buffs {...props} />
      <ViewToggle label="View" options={BOARD_VIEWS} chosen={state.view} onChoose={(view: BoardView) => dispatch({ type: "view", view })} />
      {state.view === RIFT_VIEW ? <RiftBoard {...props} /> : <CardBoard {...props} />}
      <ChangeBar {...props} />
    </PageFrame>
  );
}

/** The bar under the pitch: how many changes (a buff's card says it is on), Reset, the deadline, Save team (spec/12: nothing counts until Save). */
function ChangeBar({ data, state, dispatch }: ViewProps) {
  const changes = changeCount(state.saved, state.draft);
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
          </span>
          <button type="button" className="pick-team__reset key-bare" onClick={() => dispatch({ type: "reset" })}>
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
  onView?: (view: BoardView) => void;
}) {
  const [state, dispatch] = useReducer(
    pickReducer((id) => {
      const player = data.players[id];
      if (!player) throw new Error(`No player with id ${id}`);
      return player.role;
    }),
    initial,
  );
  const send = (action: PickAction) => {
    if (action.type === "save") onSave?.(state.draft);
    if (action.type === "view") onView?.(action.view);
    dispatch(action);
  };
  return <PickTeamView data={data} state={state} dispatch={send} />;
}
