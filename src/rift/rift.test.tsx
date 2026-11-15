// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { PICK_TEAM_SQUAD } from "../fixtures/week3";
import { Lineup, LINEUP_ORDER, RIFT_SLOTS, RIFT_SLOTS_PICK, Rift, RiftMap, RoleIcon, Tile, type SlotKey } from ".";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);
const text = (node: React.ReactNode) => html(node).replace(/<[^>]+>/g, "");

test("the map draws the river, three lanes, two bases and ten towers", () => {
  const out = html(<RiftMap />);
  expect(out.match(/rift-map__lane/g)).toHaveLength(3);
  expect(out.match(/rift-map__base/g)).toHaveLength(2);
  expect(out.match(/<rect /g)).toHaveLength(11);
});

test("each role has its icon, named for screen readers", () => {
  for (const role of ["top", "jng", "mid", "bot", "sup", "coach", "flex"] as const) {
    expect(html(<RoleIcon role={role} />)).toMatch(/aria-label="(Top|Jungle|Mid|Bot|Support|Coach|Flex)"/);
  }
});

test("a Points tile shows team, role, C, name, your dot, points with ×1.5, line, and stands at its slot", () => {
  const out = html(
    <Rift>
      <Tile slot="mid" name="Faker" team="T1" at={RIFT_SLOTS.mid} mark="C" me points={25} carrySum="17×1.5" line="v HLE 12 · v DK 5" selected />
    </Rift>,
  );
  expect(out).toContain("rift-map");
  expect(out).toContain('class="shirt__code">T1');
  expect(out).toContain('aria-label="Mid"');
  expect(out).toContain('title="Carry">C');
  expect(out).toContain('aria-label="Your player"');
  expect(out).toContain("25<small>17×1.5</small>");
  expect(out).toContain("v HLE 12 · v DK 5");
  expect(out).toContain("tile--selected");
  expect(out).toContain("left:500px;top:260px");
});

test("a Flex tile shows the role he plays, a Coach tile its hangul", () => {
  expect(text(<Tile slot="flex" plays="top" name="Siwoo" team="DK" at={RIFT_SLOTS_PICK.flex} line="v HLE · v KT" />)).toContain(
    "Flex · plays Top",
  );
  expect(text(<Tile slot="coach" name="kkOma" team="T1" at={RIFT_SLOTS.coach} mark="V" />)).toContain("Coach 감독");
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
  expect(out).toContain("Crest");
  expect(out).toContain("Photo");
  expect(out).toContain("Not starting");
  expect(out).toContain("Form 19.3");
  expect(html(<Lineup cards={cards} />)).toContain('title="Vice-carry">V');
});
