// @vitest-environment node
import { expect, test } from "vitest";
import { PICK_TEAM_SQUAD } from "../fixtures/week3";
import { html, text } from "../testing/render";
import {
  BENCH_SLOTS,
  BenchBar,
  BenchSwap,
  BenchTile,
  flexPlays,
  isBench,
  Lineup,
  LineupCard,
  LINEUP_ORDER,
  ROLE_KEYS,
  SQUAD_SIZE,
  VIEWS,
  PanelFoot,
  PanelGame,
  PanelSeries,
  PanelSum,
  PanelSumLabel,
  PlayerPanel,
  RIFT_SLOTS,
  RIFT_SLOTS_PICK,
  RIFT_VIEW,
  Rift,
  RiftMap,
  RoleIcon,
  Tile,
  type SlotKey,
} from ".";

test("the map draws the river, three lanes, two bases and ten towers", () => {
  const out = html(<RiftMap />);
  expect(out.match(/rift-map__lane/g)).toHaveLength(3);
  expect(out.match(/rift-map__base/g)).toHaveLength(2);
  expect(out.match(/<rect /g)).toHaveLength(11);
  // Drawn in the Rift's own shape and never stretched to its box.
  expect(out).toContain('viewBox="0 0 984 560"');
  expect(out).not.toContain("preserveAspectRatio");
});

test("only a Flex plays a role: a mid there plays mid; elsewhere, and a coach, play none", () => {
  expect(flexPlays("flex", "mid")).toBe("mid");
  expect(flexPlays("mid", "mid")).toBeUndefined();
  expect(flexPlays("bench1", "top")).toBeUndefined();
  expect(flexPlays("flex", "coach")).toBeUndefined();
});

test("each role has its icon, named for screen readers", () => {
  for (const role of ["top", "jng", "mid", "bot", "sup", "coach", "flex"] as const) {
    expect(html(<RoleIcon role={role} />)).toMatch(/aria-label="(Top|Jungle|Mid|Bot|Support|Coach|Flex)"/);
  }
});

test("a Points tile shows team, role, C, name, your dot, points (the Carry's result only), line, and stands at its slot", () => {
  const out = html(
    <Rift>
      <Tile slot="mid" name="Faker" team="T1" at={RIFT_SLOTS.mid} mark="C" me points={25} line="v HLE 12 · v DK 5" selected />
    </Rift>,
  );
  expect(out).toContain("rift-map");
  expect(out).toContain('class="shirt__code">T1');
  expect(out).toContain('aria-label="Mid"');
  expect(out).toContain('title="Carry">C');
  expect(out).toContain('aria-label="Your player"');
  expect(out).toContain('class="tile__points num">25</div>');
  expect(out).toContain("v HLE 12 · v DK 5");
  expect(out).toContain("tile--selected");
  // 500 of 984 across, 260 of 560 down: the same share of the Rift at any width.
  expect(out).toMatch(/left:50\.81\d*%;top:46\.42\d*%/);
  expect(out).toContain('title="Faker"');
});

test("a tile or a lineup card that can be chosen is a key the keyboard reaches", () => {
  const tile = html(<Tile slot="mid" name="Faker" team="T1" at={RIFT_SLOTS.mid} onSelect={() => {}} />);
  expect(tile).toContain('role="button"');
  expect(tile).toContain('tabindex="0"');
  const card = html(<LineupCard slot="mid" name="Faker" team="T1" onSelect={() => {}} selected />);
  expect(card).toContain('aria-pressed="true"');
  expect(card).toContain('tabindex="0"');
});

test("a Flex tile shows the role he plays, a Coach tile its hangul", () => {
  expect(text(<Tile slot="flex" plays="top" name="Siwoo" team="DK" at={RIFT_SLOTS_PICK.flex} line="v HLE · v KT" />)).toContain(
    "Flex · plays Top",
  );
  expect(text(<Tile slot="coach" name="kkOma" team="T1" at={RIFT_SLOTS.coach} mark="V" />)).toContain("Coach 감독");
});

test("the five roles lead the lineup, and the squad is the seven and the bench", () => {
  expect(ROLE_KEYS).toEqual(["top", "jng", "mid", "bot", "sup"]);
  expect(LINEUP_ORDER).toEqual([...ROLE_KEYS, "flex", "coach"]);
  expect(SQUAD_SIZE).toBe(9);
});

test("the two views, the Rift first", () => {
  expect(VIEWS).toEqual(["Rift view", "Card view"]);
  expect(RIFT_VIEW).toBe("Rift view");
});

test("both slot sets place all seven starters", () => {
  for (const slots of [RIFT_SLOTS, RIFT_SLOTS_PICK]) expect(Object.keys(slots).sort()).toEqual([...LINEUP_ORDER].sort());
});

test("Card view shows the seven in broadcast order, with photo, crest, C and V, and footer", () => {
  const starters = PICK_TEAM_SQUAD.filter((p): p is typeof p & { slot: SlotKey } => LINEUP_ORDER.includes(p.slot as SlotKey));
  // Given out of order, drawn in the broadcast's order.
  const cards = [...starters].reverse().map((p) => ({
    slot: p.slot,
    plays: p.slot === "flex" && p.role !== "coach" ? p.role : undefined,
    name: p.name,
    team: p.team,
    mark: p.mark,
    news: p.news ? "Not starting" : undefined,
    next: "v KT · v GEN",
    footer: <span>Form {p.form}</span>,
  }));
  const out = text(<Lineup cards={cards} />);
  const order = ["Zeus", "Canyon", "Faker", "Ruler", "Delight", "Siwoo", "kkOma"].map((n) => out.indexOf(n));
  expect(order).toEqual([...order].sort((a, b) => a - b));
  expect(out).toContain("Flexplays Top");
  expect(out).toContain("Coach감독");
  expect(html(<Lineup cards={cards} />)).toContain('alt="T1 crest"');
  expect(out).toContain("Photo");
  expect(out).toContain("Not starting");
  expect(out).toContain("Form 19.3");
  expect(html(<Lineup cards={cards} />)).toContain('title="Vice-carry">V');
});

test("the player panel shows name, meta, ✕ and its body", () => {
  const out = text(
    <PlayerPanel name="Faker" meta="T1 · Mid · Carry">
      <p>Full stats</p>
    </PlayerPanel>,
  );
  expect(out).toContain("Faker");
  expect(out).toContain("T1 · Mid · Carry");
  expect(out).toContain("✕");
  expect(out).toContain("Full stats");
});

test("the panel's body: a series head, its games with the counted boxed, the sum and Full stats", () => {
  const out = html(
    <PlayerPanel name="Faker" meta="T1 · Mid">
      <PanelSeries title="Wed · v HLE" result={<span>W 2–1</span>}>
        <PanelGame no={1} what="Azir · W" points={5} counted />
        <PanelGame no={2} what="Ahri · L" points={2} counted={false} live={<i>Live</i>} />
      </PanelSeries>
      <PanelSum lines={<PanelSumLabel>Carry</PanelSumLabel>} figure={40} />
      <PanelFoot go={{ to: "/player/$playerId", params: { playerId: "faker" } }} />
    </PlayerPanel>,
  );
  expect(out).toContain('<h4 class="player-panel__series-head">Wed · v HLE<span>W 2–1</span></h4>');
  const linked = html(<PanelSeries title="v HLE" result={<span>W 2–1</span>} go={{ to: "/series/$seriesId", params: { seriesId: "w3-wed-1" } }} />);
  expect(linked).toMatch(/<a [^>]*href="\/series\/w3-wed-1"[^>]*>v HLE<\/a>/);
  expect(out).toContain('<span class="player-panel__counted">5</span>');
  expect(out.match(/player-panel__counted/g)).toHaveLength(1);
  expect(out).toContain('class="player-panel__game player-panel__game--dropped"');
  expect(out).toContain("Ahri · L<i>Live</i>");
  expect(out).toContain('<span class="player-panel__sum-label">Carry</span>');
  expect(out).toContain('<b class="player-panel__sum-figure num">40</b>');
  expect(out).toContain('href="/player/faker"');
  expect(text(<PanelFoot go={{ to: "/points" }} />)).toBe("Full stats ›");
});

test("the bench bar holds slim tiles and the swap key; a bench tile can be chosen", () => {
  const out = text(
    <BenchBar>
      <BenchTile order={1} role="mid" name="Bdd" team="KT" detail="Didn't play" points="—" state="out" />
      <BenchSwap />
      <BenchTile order={2} role="jng" name="Cuzz" team="KT" line="v DK · v T1" />
    </BenchBar>,
  );
  expect(out).toBe("Bench1Bdd KT · Didn't play—⇅ Swap2Cuzz KTv DK · v T1");
  const chosen = html(<BenchTile order={1} role="mid" name="Bdd" team="KT" selected onSelect={() => {}} />);
  expect(chosen).toContain("bench-tile--selected");
  expect(chosen).toContain('role="button"');
});

test("a squad is the seven starters and two bench places, and the bench is told apart", () => {
  expect(BENCH_SLOTS).toEqual(["bench1", "bench2"]);
  expect(LINEUP_ORDER.length + BENCH_SLOTS.length).toBe(9);
  expect([isBench("bench2"), isBench("flex"), isBench(undefined)]).toEqual([true, false, false]);
});
