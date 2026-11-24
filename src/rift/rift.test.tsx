// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { PICK_TEAM_SQUAD } from "../fixtures/week3";
import { CAPTAIN_MULTIPLIER } from "../fixtures/competition";
import { hovers, html, text } from "../testing/render";
import { game } from "../theme/game";
import { PLAN } from "./riftPlan";
import {
  BENCH_SLOTS,
  BenchBar,
  BenchTile,
  flexPlays,
  isBench,
  Lineup,
  LineupCard,
  LINEUP_ORDER,
  markNews,
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
  Rift,
  RiftMap,
  RoleIcon,
  Tile,
  type SlotKey,
} from ".";

test("the map is the minimap's plan: lanes, the river's two halves and pits, two stone courts, the lanes' towers, six inhibitors, two nexus", () => {
  const out = html(<RiftMap />);
  expect(out.match(/<path d="M184 60 H660/g)).toHaveLength(1);
  expect(out.match(/url\(#[^)]*river-\d\)/g)).toHaveLength(2);
  expect(out.match(/rift-map__pit/g)).toHaveLength(2);
  // Each court: five rings and its well's two discs.
  expect(out.match(/rift-map__stone--/g)).toHaveLength(14);
  // Each lane's three towers on each side; the pair by each nexus is left out.
  expect(out.match(/rift-map__tower/g)).toHaveLength(18);
  expect(out.match(/rift-map__inhib/g)).toHaveLength(6);
  expect(out.match(/rift-map__nexus/g)).toHaveLength(2);
  // Drawn square, in the plan's own shape, and never stretched to its box.
  expect(out).toContain('viewBox="0 0 720 720"');
  expect(out).not.toContain("preserveAspectRatio");
});

test("the map draws in the game's colours alone, the same for every league", () => {
  const css = readFileSync(join(import.meta.dirname, "RiftMap.css"), "utf8");
  const used = [...css.matchAll(/var\(--([\w-]+)\)/g)].map((m) => m[1]);
  const gameTokens = new Set(Object.keys(game.color).map((key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)));
  expect(used.filter((name) => !name?.startsWith("opacity-") && !gameTokens.has(name ?? ""))).toEqual([]);
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

test("a Points tile shows its kit, team, C, name, your dot, points (the Captain's result only), line, and stands at its slot", () => {
  const out = html(
    <Rift>
      <Tile slot="mid" name="Faker" team="T1" at={RIFT_SLOTS.mid} mark="C" me points={25} line="v HLE 12 · v DK 5" selected />
    </Rift>,
  );
  expect(out).toContain("rift-map");
  expect(out).toMatch(/class="shirt shirt--kit" src="[^"]*T1\.svg"/);
  expect(out).toContain('<span class="tile__team">T1 </span>Faker');
  expect(out).toContain('aria-label="Captain">C');
  expect(out).toContain('aria-label="Your player"');
  expect(out).toContain('class="tile__points num">25</div>');
  expect(out).toContain("v HLE 12 · v DK 5");
  expect(out).toContain("tile--selected");
  // 372 of 720 across and down: the same share of the square Rift at any width.
  expect(out).toMatch(/left:51\.66\d*%;top:51\.66\d*%/);
  // FPL's tile: no role icon, a white name plate, the points in a dark band.
  expect(out).not.toContain("role-icon");
  expect(out).toContain('title="Faker"');
});

test("C reads as Captain, as the ! reads Not starting; the C is the only mark, never outlined", () => {
  const out = html(
    <>
      <Tile slot="mid" name="Faker" team="T1" mark="C" />
      <Tile slot="bot" name="Gumayusi" team="T1" flag="Not starting" />
    </>,
  );
  expect(out).toContain('role="img" aria-label="Captain">C</span>');
  expect(out).not.toContain("mark-badge--v");
  expect(out).toContain('role="img" aria-label="Not starting"');
  expect(markNews("Faker", "C")).toBe("Faker is your Captain");
});

test("C's hover is the competition's multiplier, and the Flex's label says Any role (spec/12, Words)", () => {
  const out = html(
    <>
      <Tile slot="mid" name="Faker" team="T1" mark="C" />
      <Tile slot="flex" name="Zeus" team="T1" at={RIFT_SLOTS.flex} />
    </>,
  );
  expect(hovers(out)).toEqual([
    ["C", `Scores ×${CAPTAIN_MULTIPLIER} this week`],
    ["Flex", "Any role"],
  ]);
  expect(hovers(html(<LineupCard slot="flex" plays="top" name="Zeus" team="T1" mark="C" />))).toEqual([
    ["Flex", "Any role"],
    ["C", `Scores ×${CAPTAIN_MULTIPLIER} this week`],
  ]);
});

test("a tile or a lineup card that can be chosen is a key the keyboard reaches", () => {
  const tile = html(<Tile slot="mid" name="Faker" team="T1" at={RIFT_SLOTS.mid} onSelect={() => {}} />);
  expect(tile).toContain('role="button"');
  expect(tile).toContain('tabindex="0"');
  const card = html(<LineupCard slot="mid" name="Faker" team="T1" onSelect={() => {}} selected />);
  expect(card).toContain('aria-pressed="true"');
  expect(card).toContain('tabindex="0"');
});

test("a tile on the Rift is its role strip, team code and name, then its band: a Flex says Flex, not the role he plays", () => {
  expect(text(<Tile slot="flex" name="Siwoo" team="DK" at={RIFT_SLOTS.flex} line="v HLE · v KT" />)).toBe("FlexDK Siwoov HLE · v KT");
  expect(text(<Tile slot="coach" name="kkOma" team="T1" at={RIFT_SLOTS.coach} />)).toBe("CoachT1 kkOma");
  expect(text(<Tile slot="mid" name="Faker" team="T1" at={RIFT_SLOTS.mid} />)).toBe("MidT1 Faker");
  // A bench tile stands under its order and role, so it has no strip.
  expect(text(<Tile slot="mid" name="Bdd" team="KT" />)).toBe("KT Bdd");
});

test("a player with news carries the yellow warning triangle, named by his news", () => {
  const out = html(<Tile slot="bot" name="Gumayusi" team="T1" at={RIFT_SLOTS.bot} flag="Not starting" />);
  expect(out).toMatch(/class="tile__flag" role="img" aria-label="Not starting"[^>]*><svg class="tile__flag-icon"/);
  expect(out).toContain("tile__flag-sign");
});

test("the five roles lead the lineup, and the squad is the seven and the bench", () => {
  expect(ROLE_KEYS).toEqual(["top", "jng", "mid", "bot", "sup"]);
  expect(LINEUP_ORDER).toEqual([...ROLE_KEYS, "flex", "coach"]);
  expect(SQUAD_SIZE).toBe(9);
});

test("the two views, the Rift first", () => {
  expect(VIEWS).toEqual(["Rift view", "Card view"]);
});

test("the slots place all seven starters, inside the square Rift, on a desk and on a phone", () => {
  expect(Object.keys(RIFT_SLOTS).sort()).toEqual([...LINEUP_ORDER].sort());
  for (const { desk, phone } of Object.values(RIFT_SLOTS)) expect([...desk, ...phone].every((v) => v > 0 && v < PLAN)).toBe(true);
  // Top level with Flex, Coach under Top, Bot beside Support under Flex (Craig, 19 Nov 2026).
  expect(RIFT_SLOTS.top.desk[1]).toBe(RIFT_SLOTS.flex.desk[1]);
  expect(RIFT_SLOTS.coach.desk[0]).toBe(RIFT_SLOTS.top.desk[0]);
  expect(RIFT_SLOTS.sup.desk[0]).toBe(RIFT_SLOTS.flex.desk[0]);
  expect(RIFT_SLOTS.bot.desk[1]).toBe(RIFT_SLOTS.sup.desk[1]);
});

test("a lineup card shows his split's photo credited Photo: LCK, or his team's crest without one (spec/13)", () => {
  const withPhoto = html(<LineupCard slot="mid" name="Faker" team="T1" photo="/photos/faker.jpg" />);
  expect(withPhoto).toContain('src="/photos/faker.jpg" alt="Faker"');
  expect(text(<LineupCard slot="mid" name="Faker" team="T1" photo="/photos/faker.jpg" />)).toContain("Photo: LCK");
  expect(withPhoto).not.toContain("T1 crest");
  const without = html(<LineupCard slot="mid" name="Faker" team="T1" />);
  expect(without).toContain('alt="T1 crest"');
  expect(without).not.toContain("Photo: LCK");
});

test("Card view shows the seven in broadcast order, with photo, crest, C, and footer", () => {
  const starters = PICK_TEAM_SQUAD.filter((p): p is typeof p & { slot: SlotKey } => LINEUP_ORDER.includes(p.slot as SlotKey));
  // Given out of order, drawn in the broadcast's order.
  const cards = [...starters].reverse().map((p) => ({
    slot: p.slot,
    plays: p.slot === "flex" && p.role !== "coach" ? p.role : undefined,
    name: p.name,
    team: p.team,
    photo: p.name === "Faker" ? "/photos/faker.jpg" : undefined,
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
  expect(html(<Lineup cards={cards} />)).toContain('alt="Faker"');
  expect(html(<Lineup cards={cards} />)).toContain('alt="GEN crest"');
  expect(out).toContain("Not starting");
  expect(out).toContain("Form 19.3");
  expect(html(<Lineup cards={cards} />)).toContain('aria-label="Captain">C');
});

test("the player panel shows name, meta, ✕ and its body", () => {
  const out = text(
    <PlayerPanel name="Faker" meta="T1 · Mid · Captain">
      <p>Full stats</p>
    </PlayerPanel>,
  );
  expect(out).toContain("Faker");
  expect(out).toContain("T1 · Mid · Captain");
  expect(out).toContain("✕");
  expect(out).toContain("Full stats");
});

test("the panel's body: a series head, its games with the counted boxed, the sum and Full stats", () => {
  const out = html(
    <PlayerPanel name="Faker" meta="T1 · Mid">
      <PanelSeries title="Wed · v HLE" result={<span>W 2–1</span>}>
        <PanelGame no={1} what="Azir · W" points={5} counted />
        <PanelGame no={2} what="Ahri · L" points={2} counted={false} />
      </PanelSeries>
      <PanelSum lines={<PanelSumLabel>Captain</PanelSumLabel>} figure={40} />
      <PanelFoot go={{ to: "/player/$playerId", params: { playerId: "faker" } }} />
    </PlayerPanel>,
  );
  expect(out).toContain('<h4 class="player-panel__series-head">Wed · v HLE<span>W 2–1</span></h4>');
  expect(out).toContain('<span class="counted">5</span>');
  expect(out.match(/class="counted"/g)).toHaveLength(1);
  expect(out).toContain('class="player-panel__game player-panel__game--dropped"');
  expect(out).toContain('<span class="quiet">Captain</span>');
  expect(out).toContain('<b class="player-panel__sum-figure num">40</b>');
  expect(out).toContain('href="/player/faker"');
  expect(text(<PanelFoot go={{ to: "/points" }} />)).toBe("Full stats ›");
});

test("the bench bar holds the Rift's tiles, each under its order and role, with no swap key; a bench tile can be chosen", () => {
  const out = text(
    <BenchBar>
      <BenchTile order={1} role="mid" name="Bdd" team="KT" detail="Didn't play" points="—" state="out" />
      <BenchTile order={2} role="jng" name="Cuzz" team="KT" line="v DK · v T1" />
    </BenchBar>,
  );
  expect(out).toBe("Bench1. MidKT Bdd—Didn't play2. JungleKT Cuzzv DK · v T1");
  // The bench shows the Rift's own tiles, as FPL's bench under the pitch (Craig, 16 Nov 2026).
  const chosen = html(<BenchTile order={1} role="mid" name="Bdd" team="KT" selected onSelect={() => {}} />);
  expect(chosen).toContain("tile tile--bench tile--selected");
  expect(chosen).toContain('role="button"');
});

test("the bench is two places, told apart", () => {
  expect(BENCH_SLOTS).toEqual(["bench1", "bench2"]);
  expect([isBench("bench2"), isBench("flex"), isBench(undefined)]).toEqual([true, false, false]);
});
