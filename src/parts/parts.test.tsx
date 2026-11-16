// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MANAGER, TEAMS, WEEK3_SERIES_AT_POINTS, WEEK4_DEADLINE } from "../fixtures/week3";
import { html, text } from "../testing/render";
import {
  BuffCard,
  Crest,
  Deadline,
  Empty,
  Field,
  LinkGo,
  Loading,
  MainAction,
  MeDot,
  Menu,
  Modal,
  OutlinedKey,
  PageFrame,
  PageHead,
  Placeholder,
  SeriesList,
  SideSection,
  SponsorNote,
  Table,
  Tabs,
  Tag,
  Time,
  Toast,
  TopBar,
  ViewToggle,
} from ".";

describe("top bar", () => {
  test("names Flol, the eight items in order, the sponsor and the account", () => {
    const out = text(<TopBar active="points" account={MANAGER.team} />);
    expect(out).toBe("FlolHomePick TeamTransfersPointsLeaguesStatsLCKLivepresented by SponsorBaron Steal FC ▾");
  });

  test("marks the active item and offers Sign in to a visitor", () => {
    const out = html(<TopBar active="leagues" account={null} />);
    expect(out).toMatch(/aria-current="page"[^>]*>Leagues/);
    expect(out).toContain('href="/leagues"');
    expect(out).toContain(">Sign in<");
  });
});

test("page head shows title, hangul, week, key figure, tags and up to three figures", () => {
  const head = (
    <PageHead
      title={MANAGER.team}
      hangul={MANAGER.hangul}
      week={{ label: "Split 1 · Week 3", prev: { to: "/points" } }}
      figure={94}
      tags={<Tag kind="notFinal">Not final</Tag>}
      figures={[
        { label: "Average", value: 74 },
        { label: "Highest", value: 131, go: { to: "/perfect-game" } },
      ]}
    />
  );
  const out = text(head);
  for (const part of ["Baron Steal FC", "바론 스틸 FC", "Split 1 · Week 3", "94", "Not final", "Average 74", "Highest 131›"]) {
    expect(out).toContain(part);
  }
  const four = [1, 2, 3, 4].map((n) => ({ label: `F${n}`, value: n }));
  expect(() => html(<PageHead title="Stats" figures={four} />)).toThrow("up to three");
});

test("a tag is plain, Live filled, or Not final dashed", () => {
  expect(html(<Tag>Bo3</Tag>)).toBe('<span class="tag">Bo3</span>');
  expect(html(<Tag kind="live">Live</Tag>)).toContain("tag--live");
  expect(html(<Tag kind="notFinal">Not final</Tag>)).toContain("tag--not-final");
});

test("view toggle and tabs mark the chosen one", () => {
  const toggle = html(<ViewToggle options={["Rift view", "Card view"]} chosen="Card view" />);
  expect(toggle).toContain('aria-pressed="true">Card view');
  expect(toggle).toContain('aria-pressed="false">Rift view');
  const tabs = html(<Tabs tabs={["Players", "Coaches"]} chosen="Players" />);
  expect(tabs).toContain('aria-pressed="true">Players');
});

test("a toggle's key can show more than a word", () => {
  const out = html(<ViewToggle options={[{ value: "mid", label: <i>Mid</i> }, "All"]} chosen="mid" />);
  expect(out).toContain('aria-pressed="true"><i>Mid</i>');
});

test("a link ends with ›, and one leaving Flol with ↗", () => {
  expect(text(<LinkGo go={{ to: "/stats" }}>Full stats</LinkGo>)).toBe("Full stats ›");
  expect(html(<LinkGo go={{ to: "/series/$seriesId", params: { seriesId: "w3 sat" } }}>Series</LinkGo>)).toContain(
    'href="/series/w3%20sat"',
  );
  const out = html(<LinkGo out="https://sheepesports.com">More on Sheep Esports</LinkGo>);
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
        { key: "total", head: "Total", cell: (r) => r.total, figure: true, width: "goCol", sorted: true, group: true },
      ]}
    />,
  );
  expect(out).toContain('title="Chovy Was Right There"');
  expect(out).toContain('class="table__figure num table__group">1187');
  expect(out).toContain("table__row--selected");
  expect(out).toContain("table--sticky-head");
  expect(out).toContain('aria-sort="descending"');
  expect(out).toContain("width:var(--m-go-col)");
});

test("a row that opens something ends with a named ›", () => {
  const rows = [{ id: "minji", name: "Chovy Was Right There" }];
  const columns = [{ key: "name", head: "Team", cell: (r: (typeof rows)[number]) => r.name }];
  const linked = html(
    <Table rows={rows} rowKey={(r) => r.id} columns={columns} open={{ name: (r) => r.name, go: (r) => ({ to: "/manager/$managerId", params: { managerId: r.id } }) }} />,
  );
  expect(linked).toMatch(/<a[^>]*href="\/manager\/minji"[^>]*aria-label="Open Chovy Was Right There"|<a[^>]*aria-label="Open Chovy Was Right There"[^>]*href="\/manager\/minji"/);
  const keyed = html(<Table rows={rows} rowKey={(r) => r.id} columns={columns} open={{ name: (r) => r.name, onOpen: () => {} }} />);
  expect(keyed).toContain('<button type="button" aria-label="Open Chovy Was Right There">›</button>');
});

test("a side section has its title and note", () => {
  expect(text(<SideSection title="This week's series" note="your time · KST">x</SideSection>)).toBe(
    "This week's seriesyour time · KSTx",
  );
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

test("a strong sheet stands out with its own frame", () => {
  expect(html(<Modal kind="sheet" title="Confirm" onClose={() => {}} strong>x</Modal>)).toContain("modal__box--strong");
  expect(html(<Modal kind="sheet" title="Confirm" onClose={() => {}}>x</Modal>)).not.toContain("modal__box--strong");
});

test("a toast is a polite status with its message", () => {
  const out = html(<Toast message="Kingen added" n={1} onDone={() => {}} />);
  expect(out).toContain('role="status"');
  expect(out).toContain("Kingen added");
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

test("a menu is a key that opens its list", () => {
  const out = html(<Menu label="Admin ▾" items={[{ label: "Rename", onChoose: () => {} }, { label: "Delete league…", onChoose: () => {}, apart: true }]} />);
  expect(out).toContain('aria-expanded="false"');
  expect(out).toContain("Admin ▾");
});

test("loading draws its bars; empty shows its title", () => {
  expect(html(<Loading rows={2} />).match(/state-loading__bar/g)).toHaveLength(2);
  expect(text(<Empty title="No moves yet" />)).toBe("No moves yet");
});

test("a placeholder is one word; the sponsor note is the spec's line", () => {
  expect(text(<Placeholder word="Sponsor" />)).toBe("Sponsor");
  expect(html(<Placeholder word="Photo" width="cardPhoto" />)).toContain("width:var(--m-card-photo)");
  expect(text(<SponsorNote />)).toBe("All sponsors are made up.");
});

test("every LCK team has its crest; a team without one shows its code in a dashed box", () => {
  for (const team of Object.keys(TEAMS)) {
    expect(html(<Crest team={team} />)).toMatch(new RegExp(`<img[^>]+src="[^"]+"[^>]+alt="${team} crest"`));
  }
  expect(html(<Crest team="T1" size="cardHead" />)).toContain("width:var(--m-card-head)");
  expect(text(<Crest team="XYZ" />)).toBe("XYZ");
});

test("the series list shows scores with their state, and times for the next", () => {
  const out = text(<SeriesList series={WEEK3_SERIES_AT_POINTS} />);
  expect(out).toContain("SatGEN v HLE2–1 Not final");
  expect(out).toContain("SatT1 v DK1–0 Live");
  expect(out).toContain("SunKRX v BRO08:00 17:00 KST");
});

test("the page frame puts the side column after the main", () => {
  const right = html(
    <PageFrame screen="points" active="points" account={MANAGER.team} side={<p>side</p>}>
      <p>main</p>
    </PageFrame>,
  );
  expect(right.indexOf("main")).toBeLessThan(right.indexOf("side</p>"));
  expect(right).toContain("page-frame--two");
  expect(right).toContain('data-screen="points"');
});
