import { MANAGER } from "../../fixtures/week3";
import { PageFrame, PageHead, Placeholder, SeriesList, SideSection, SponsorNote, Tag, ViewToggle, type WeekNav } from "../../parts";
import { PATHS } from "../../paths";
import { flexPlays, Lineup, Rift, RIFT_SLOTS, Tile } from "../../rift";
import { GamesPanel } from "./GamesPanel";
import "./PerfectGame.css";
import { RIFT_VIEW, VIEWS, type PerfectGameData, type PerfectView, type Selection } from "./types";

/** Rift view: the seven on the Rift, each with his points and series, C on the Carry. */
export function PerfectGameRift({ game, selected, onSelect }: { game: PerfectGameData } & Selection) {
  return (
    <Rift>
      {game.players.map((p) => (
        <Tile
          key={p.slot}
          slot={p.slot}
          name={p.name}
          team={p.team}
          at={RIFT_SLOTS[p.slot]}
          mark={p.carry ? "C" : undefined}
          me={p.mine}
          points={p.points}
          line={p.line}
          selected={selected === p.slot}
          onSelect={onSelect && (() => onSelect(p.slot))}
        />
      ))}
    </Rift>
  );
}

/** Card view: the seven as the broadcast lineup, each card's series and points at its foot. */
export function PerfectGameCards({ game, selected, onSelect }: { game: PerfectGameData } & Selection) {
  return (
    <div className="perfect-game__cards">
      <Lineup
        cards={game.players.map((p) => ({
          slot: p.slot,
          plays: flexPlays(p.slot, p.role),
          name: p.name,
          team: p.team,
          mark: p.carry ? "C" : undefined,
          me: p.mine,
          next: p.line.split(" · ").map((series) => (
            <span key={series} className="perfect-game__card-series">
              {series}
            </span>
          )),
          footer: <b className="perfect-game__card-points">{p.points}</b>,
          selected: selected === p.slot,
          onSelect: onSelect && (() => onSelect(p.slot)),
        }))}
      />
    </div>
  );
}

/** Perfect game: the week's best team in the view saved on Points, the tapped starter's games on the right. */
export function PerfectGame({
  game,
  view,
  onView,
  weekNav,
  selected,
  onSelect,
}: {
  game: PerfectGameData;
  view: PerfectView;
  onView?: (view: PerfectView) => void;
  /** The week before and after; the route takes no week yet. */
  weekNav?: Omit<WeekNav, "label">;
} & Selection) {
  const total = game.players.reduce((sum, p) => sum + p.points, 0);
  const tapped = game.players.find((p) => p.slot === selected);
  const viewProps = { game, selected, onSelect };
  return (
    <PageFrame
      screen="perfect-game"
      active="points"
      account={MANAGER.team}
      side={
        <>
          {tapped && <GamesPanel player={tapped} week={game.series} onClose={onSelect && (() => onSelect(undefined))} />}
          <SideSection title={game.seriesTitle}>
            <SeriesList series={game.series} />
          </SideSection>
          <Placeholder word="Sponsor" height="sponsorH" />
          <SponsorNote />
        </>
      }
    >
      <PageHead
        title="Perfect game"
        hangul="퍼펙트 게임"
        week={{ label: game.week, ...weekNav }}
        figure={total}
        tags={
          <>
            {game.final ? <Tag>Final</Tag> : <Tag kind="notFinal">Not final</Tag>}
            <Tag>Cap {game.cap}</Tag>
          </>
        }
        figures={[
          { label: "Average", value: game.average },
          { label: "Highest", value: game.highest },
          { label: "Your points", value: game.yours, go: { to: PATHS.points } },
        ]}
      />
      <div className="perfect-game__toggle">
        <ViewToggle options={VIEWS} chosen={view} onChoose={onView} label="View" />
      </div>
      {view === RIFT_VIEW ? <PerfectGameRift {...viewProps} /> : <PerfectGameCards {...viewProps} />}
    </PageFrame>
  );
}
