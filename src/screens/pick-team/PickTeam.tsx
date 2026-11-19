import { useReducer } from "react";
import { Deadline, MainAction, PageFrame, PageHead, Placeholder, SeriesList, SideSection, SponsorNote, useAnnounce, ViewToggle } from "../../parts";
import { VIEWS as BOARD_VIEWS } from "../../rift";
import { CardBoard, RiftBoard } from "./boards";
import { Buffs } from "./Buffs";
import type { PickTeamData } from "./fixtures";
import type { ViewProps } from "./format";
import { changeCount, pickNews, pickReducer, type PickAction, type PickState, type PickTeam, type PickView } from "./model";
import { PlayerCard } from "./PlayerCard";
import { changes as changesWord, WORDS } from "./words";
import "./pick-team.css";

/** Pick Team's views, each with the shared board view it is kept as (spec/12). */
export const VIEWS = [
  { value: "rift", label: BOARD_VIEWS[0] },
  { value: "cards", label: BOARD_VIEWS[1] },
] as const;

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
          <SideSection title={WORDS.seriesTitle}>
            <SeriesList series={data.series} />
          </SideSection>
          <Placeholder word={WORDS.sponsor} height="sponsorH" />
          <SponsorNote />
        </>
      }
    >
      <PageHead title={WORDS.title} hangul={WORDS.hangul} sub={data.week} />
      <Buffs {...props} />
      <ViewToggle label={WORDS.view} options={VIEWS} chosen={state.view} onChoose={(view: PickView) => dispatch({ type: "view", view })} />
      {state.view === "rift" ? <RiftBoard {...props} /> : <CardBoard {...props} />}
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
        <span className="pick-team__changes">{WORDS.noChanges}</span>
      ) : (
        <>
          <span className="pick-team__changes">
            <b>{changesWord(changes)}</b>
          </span>
          <button type="button" className="pick-team__reset key-bare hover-line" onClick={() => dispatch({ type: "reset" })}>
            {WORDS.reset}
          </button>
        </>
      )}
      <span className="pick-team__deadline">
        <Deadline {...data.deadline} />
      </span>
      <span className="pick-team__save">
        {/* `No changes` already leads the bar, so the disabled key's own reason stays empty. */}
        <MainAction disabledReason={changes === 0 ? "" : undefined} onClick={() => dispatch({ type: "save" })}>
          {WORDS.save}
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
  /** The chosen view, for the browser to remember (spec/12). */
  onView?: (view: PickView) => void;
}) {
  const playerOf = (id: string) => {
    const player = data.players[id];
    if (!player) throw new Error(`No player with id ${id}`);
    return player;
  };
  const reduce = pickReducer((id) => playerOf(id).role);
  const [state, dispatch] = useReducer(reduce, initial);
  const announce = useAnnounce();
  const send = (action: PickAction) => {
    if (action.type === "save") onSave?.(state.draft);
    if (action.type === "view") onView?.(action.view);
    const news = pickNews(action, state, reduce(state, action), (id) => playerOf(id).name);
    if (news) announce(news);
    dispatch(action);
  };
  return <PickTeamView data={data} state={state} dispatch={send} />;
}
