// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { MANAGER, WEEK3_SERIES_AT_POINTS, WEEK4_DEADLINE } from "../fixtures/week3";
import {
  BenchBar,
  BenchSwap,
  BenchTile,
  BuffCard,
  Deadline,
  Field,
  LinkGo,
  MainAction,
  MeDot,
  Modal,
  OutlinedKey,
  PageFrame,
  PageHead,
  Placeholder,
  PlayerPanel,
  SeriesList,
  SideSection,
  SponsorNote,
  Table,
  Tabs,
  Tag,
  Time,
  TopBar,
  ViewToggle,
} from ".";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);
const text = (node: React.ReactNode) =>
  html(node)
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");

describe("top bar", () => {
  test("names Flol, the eight items in order, the sponsor and the account", () => {
    const out = text(<TopBar active="points" account={MANAGER.team} />);
    expect(out).toBe("FlolHomePick TeamTransfersPointsLeaguesStatsLCKLivepresented by SponsorBaron Steal FC ▾");
  });

  test("marks the active item and offers Sign in to a visitor", () => {
    const out = html(<TopBar active="leagues" account={null} />);
    expect(out).toContain('aria-current="page">Leagues');
    expect(out).toContain(">Sign in<");
  });
});

test("page head shows title, hangul, week, key figure, tags and up to three figures", () => {
  const head = (
    <PageHead
      title={MANAGER.team}
      hangul={MANAGER.hangul}
      week={{ label: "LCK Cup · Week 3", prevHref: "/points" }}
      figure={94}
      tags={<Tag kind="notFinal">Not final</Tag>}
      figures={[
        { label: "Average", value: 74 },
        { label: "Highest", value: 131, href: "/perfect-game" },
      ]}
    />
  );
  const out = text(head);
  for (const part of ["Baron Steal FC", "바론 스틸 FC", "LCK Cup · Week 3", "94", "Not final", "Average 74", "Highest 131›"]) {
    expect(out).toContain(part);
  }
  const four = [1, 2, 3, 4].map((n) => ({ label: `F${n}`, value: n }));
  expect(() => html(<PageHead title="Stats" figures={four} />)).toThrow("up to three");
});

test("a tag is plain, Live filled, or Not final dashed", () => {
  expect(html(<Tag>Cap 2</Tag>)).toBe('<span class="tag">Cap 2</span>');
  expect(html(<Tag kind="live">Live</Tag>)).toContain("tag--live");
  expect(html(<Tag kind="notFinal">Not final</Tag>)).toContain("tag--not-final");
});

test("view toggle and tabs mark the chosen one", () => {
  const toggle = html(<ViewToggle options={["Rift view", "Card view"]} chosen="Card view" />);
  expect(toggle).toContain('aria-pressed="true">Card view');
  expect(toggle).toContain('aria-pressed="false">Rift view');
  const tabs = html(<Tabs tabs={["Players", "Coaches"]} chosen="Players" />);
  expect(tabs).toContain('aria-selected="true">Players');
});

test("a link ends with ›, and one leaving Flol with ↗", () => {
  expect(text(<LinkGo href="/stats">Full stats</LinkGo>)).toBe("Full stats ›");
  const out = html(
    <LinkGo href="https://sheepesports.com" out>
      More on Sheep Esports
    </LinkGo>,
  );
  expect(out).toContain("↗");
  expect(out).toContain('target="_blank"');
});

test("deadline and time put your time first, then KST", () => {
  expect(text(<Deadline {...WEEK4_DEADLINE} />)).toBe("Deadline Wed 07:45 16:45 KST 9h 45m");
  expect(text(<Time local="Sat 22:00" kst="07:00" />)).toBe("Sat 22:00 07:00 KST");
});

test("your player is a dot named for screen readers", () => {
  expect(html(<MeDot />)).toContain('aria-label="Your player"');
});

test("a table right-aligns figures and truncates a long name with its full text", () => {
  const rows = [
    { name: "Chovy Was Right There", total: 1187 },
    { name: "Baron Steal FC", total: 1198 },
  ];
  const out = html(
    <Table
      rows={rows}
      rowKey={(r) => r.name}
      selected={(r) => r.name === MANAGER.team}
      stickyHead
      columns={[
        { key: "name", head: "Team", cell: (r) => r.name, fullText: (r) => r.name },
        { key: "total", head: "Total", cell: (r) => r.total, figure: true },
      ]}
    />,
  );
  expect(out).toContain('title="Chovy Was Right There"');
  expect(out).toContain('class="table__figure num">1187');
  expect(out).toContain("table__row--selected");
  expect(out).toContain("table--sticky-head");
});

test("a side section has its title and note", () => {
  expect(text(<SideSection title="This week's series" note="your time · KST">x</SideSection>)).toBe(
    "This week's seriesyour time · KSTx",
  );
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

test("the bench bar holds slim tiles and the swap key", () => {
  const out = text(
    <BenchBar>
      <BenchTile order={1} role="mid" name="Bdd" team="KT" detail="Didn't play" points="—" state="out" />
      <BenchSwap />
      <BenchTile order={2} role="jng" name="Cuzz" team="KT" line="v DK · v T1" />
    </BenchBar>,
  );
  expect(out).toBe("Bench1Bdd KT · Didn't play—⇅ Swap2Cuzz KTv DK · v T1");
});

test("a modal names itself, has ✕, and is a card or a sheet", () => {
  const out = html(
    <Modal kind="sheet" title="Create a league" onClose={() => {}}>
      <Field label="Name" defaultValue="Office Rift" aside="11 / 30" />
    </Modal>,
  );
  expect(out).toContain('role="dialog"');
  expect(out).toContain('aria-label="Create a league"');
  expect(out).toContain("modal__box--sheet");
  expect(out).toContain("✕");
  expect(html(<Modal kind="card" title="Faker" onClose={() => {}}>x</Modal>)).toContain("modal__box--card");
});

test("a form field has its label above and an error under it", () => {
  const out = html(<Field label="Team name" error="Taken" />);
  expect(out.indexOf("Team name")).toBeLessThan(out.indexOf("<input"));
  expect(out).toContain('aria-invalid="true"');
  expect(text(<Field label="Team name" error="Taken" />)).toBe("Team nameTaken");
});

test("a buff shows name, what it does, how many are left, and Play", () => {
  expect(text(<BuffCard name="Bench Boost" does="Your bench scores too" left="1 left" />)).toBe(
    "Bench BoostYour bench scores too1 leftPlay",
  );
  expect(html(<BuffCard name="Dual Carry" does="Vice-carry ×1.5 too" left="1 left" state="off" />)).not.toContain("Play");
});

test("the main action is one filled key, disabled with its reason", () => {
  expect(text(<MainAction>Save team</MainAction>)).toBe("Save team");
  const off = html(<MainAction disabledReason="No changes">Save team</MainAction>);
  expect(off).toContain("No changes");
  expect(off).toContain("disabled");
  expect(text(<OutlinedKey>Join a league</OutlinedKey>)).toBe("Join a league");
});

test("a placeholder is one word; the sponsor note is the spec's line", () => {
  expect(text(<Placeholder word="Sponsor" />)).toBe("Sponsor");
  expect(text(<SponsorNote />)).toBe("All sponsors are made up.");
});

test("the series list shows scores with their state, and times for the next", () => {
  const out = text(<SeriesList series={WEEK3_SERIES_AT_POINTS} />);
  expect(out).toContain("SatGEN v HLE2–1 Not final");
  expect(out).toContain("SatT1 v DK1–0 Live");
  expect(out).toContain("SunKRX v BRO08:00 17:00 KST");
});

test("the page frame puts the side column after the main, save Leagues", () => {
  const right = html(
    <PageFrame active="points" account={MANAGER.team} side={<p>side</p>}>
      <p>main</p>
    </PageFrame>,
  );
  expect(right.indexOf("main")).toBeLessThan(right.indexOf("side</p>"));
  expect(right).toContain("page-frame--two");
  const left = html(
    <PageFrame active="leagues" account={MANAGER.team} side={<p>side</p>} sideFirst>
      <p>main</p>
    </PageFrame>,
  );
  expect(left).toContain("page-frame--side-first");
});
