import { useReducer } from "react";
import { cx, Deadline, MainAction, PageFrame, PageHead, Panel, Placeholder, SeriesList, SponsorNote, useAnnounce, ViewToggle } from "../../parts";
import { VIEWS as BOARD_VIEWS } from "../../rift";
import { Bench, CardBoard, RiftBoard } from "./boards";
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

/**
 * Pick Team, drawn from its state (docs/design/approved/pick-team/): the title line with the week, the
 * deadline and the views; in Rift view the Rift at the left with the buffs, bench and Save in a column
 * beside it; in Card view (1440-cards.png) the seven cards in a row, the bench's two cards with the buffs
 * beside them under it, then Save as one bar.
 * The side column holds the tapped player's card and the week's series, both panels.
 */
export function PickTeamView({ data, state, dispatch }: ViewProps) {
  const selected = state.selected ? data.players[state.selected] : undefined;
  const props = { data, state, dispatch };
  const rift = state.view === "rift";
  return (
    <PageFrame
      screen="pick-team"
      active="pickTeam"
      account={data.account}
      side={
        <>
          {selected && <PlayerCard state={state} dispatch={dispatch} player={selected} />}
          <Panel title={WORDS.seriesTitle} className="pick-team__series">
            <SeriesList series={data.series} />
          </Panel>
          <Placeholder word={WORDS.sponsor} height="sponsorH" />
          <SponsorNote />
        </>
      }
    >
      <PageHead
        title={WORDS.title}
        hangul={WORDS.hangul}
        line={
          <>
            <span className="pick-team__week quiet">{data.week}</span>
            <span className="pick-team__deadline">
              <Deadline {...data.deadline} />
            </span>
            <span className="pick-team__views">
              <ViewToggle label={WORDS.view} options={VIEWS} chosen={state.view} onChoose={(view: PickView) => dispatch({ type: "view", view })} />
            </span>
          </>
        }
      />
      <div className={cx("pick-team__object", `pick-team__object--${state.view}`)}>
        {rift ? (
          <>
            <Buffs {...props} />
            <RiftBoard {...props} />
            <Bench {...props} />
          </>
        ) : (
          <>
            <CardBoard {...props} />
            <Bench {...props} />
            <Buffs {...props} />
          </>
        )}
        <SavePanel {...props} />
      </div>
    </PageFrame>
  );
}

/** The changes not saved yet (a buff's card says it is on), Reset, then Save team (spec/12: nothing counts until Save). */
function SavePanel({ state, dispatch }: ViewProps) {
  const changes = changeCount(state.saved, state.draft);
  return (
    <Panel label={WORDS.saveLabel} className="pick-team__save">
      <div className="pick-team__changes">
        {changes === 0 ? <span>{WORDS.noChanges}</span> : <b>{changesWord(changes)}</b>}
        {/* With nothing to clear Reset stands in --mid, as the picture, and does nothing. */}
        <button type="button" className={cx("pick-team__reset key-bare hover-line", changes === 0 && "pick-team__reset--idle")} onClick={() => dispatch({ type: "reset" })}>
          {WORDS.reset}
        </button>
      </div>
      {/* `No changes` already leads the panel, so the disabled key's own reason stays empty. */}
      <div className="pick-team__save-key">
        <MainAction wide disabledReason={changes === 0 ? "" : undefined} onClick={() => dispatch({ type: "save" })}>
          {WORDS.save}
        </MainAction>
      </div>
    </Panel>
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
