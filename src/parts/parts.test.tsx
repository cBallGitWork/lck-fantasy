// @vitest-environment node
import { describe, expect, test } from "vitest";
import { MANAGER, TEAMS, WEEK3_SERIES_AT_POINTS, WEEK4_DEADLINE } from "../fixtures/week3";
import { html, text } from "../testing/render";
import {
  BuffCard,
  Crest,
  TeamBar,
  Deadline,
  Empty,
  ErrorState,
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
  RIOT_NOTICE,
  SeriesList,
  SideSection,
  SponsorNote,
  Table,
  TabPanel,
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

  test("marks the active item", () => {
    const out = html(<TopBar active="leagues" account={MANAGER.team} />);
    expect(out).toMatch(/aria-current="page"[^>]*>Leagues/);
    expect(out).toContain('href="/leagues"');
  });

  test("a visitor's bar: Stats and LCK, then Log in (front door picture)", () => {
    expect(text(<TopBar account={null} />)).toBe("FlolStatsLCKpresented by SponsorLog in ›");
  });

  test("opens the account menu when it has items", () => {
    const out = html(<TopBar account={MANAGER.team} accountMenu={[{ label: "Settings", go: { to: "/settings" } }]} />);
    expect(out).toContain('aria-expanded="false"');
    expect(out).toContain("Baron Steal FC ▾");
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
});

test("tabs are a tab list whose chosen tab names the panel it controls", () => {
  const out = html(
    <>
      <Tabs id="t" tabs={["Players", "Coaches"]} chosen="Players" label="Players or coaches" />
      <TabPanel id="t">Table</TabPanel>
    </>,
  );
  expect(out).toContain('role="tablist" aria-label="Players or coaches"');
  expect(out).toContain('role="tab" id="t-tab" class="tabs__tab key-bare tabs__tab--on" aria-selected="true" aria-controls="t-panel">Players');
  expect(out).toContain('role="tab" class="tabs__tab key-bare" aria-selected="false" aria-controls="t-panel">Coaches');
  expect(out).toContain('<div role="tabpanel" id="t-panel" aria-labelledby="t-tab">Table</div>');
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

test("deadline and time show your time alone, with no zone and no league time (Craig, 19 Nov 2026)", () => {
  expect(text(<Deadline {...WEEK4_DEADLINE} />)).toBe("Deadline Wed 07:45 9h 45m");
  expect(text(<Time local="Sat 22:00" />)).toBe("Sat 22:00");
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

test("a table draws a sub-row above a row: a group's head with its aside, or a ⋯ gap", () => {
  const rows = [
    { slot: "Top", group: "Week 3" },
    { slot: "Bot", group: "" },
    { slot: "Mid", group: "gap" },
  ];
  const out = html(
    <Table
      rows={rows}
      rowKey={(r) => r.slot}
      columns={[{ key: "slot", head: "Slot", cell: (r) => r.slot }]}
      subAbove={(r) => (r.group === "gap" ? "gap" : r.group ? { head: <b>{r.group}</b>, aside: "1 free" } : undefined)}
      open={{ name: (r) => r.slot, onOpen: () => {} }}
    />,
  );
  expect(out).toContain('<tr class="table__sub"><td colSpan="2"><b>Week 3</b><span class="table__sub-aside">1 free</span></td></tr><tr><td>Top</td>');
  expect(out).toContain('<td>Bot</td>');
  expect(out).toContain('<tr class="table__gap"><td colSpan="2">⋯</td></tr><tr><td>Mid</td>');
  expect(out.match(/table__sub"/g)).toHaveLength(1);
});

test("a side section has its title and note", () => {
  expect(text(<SideSection title="Following" note="3 of 50">x</SideSection>)).toBe("Following3 of 50x");
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

test("a toast shows its message, and leaves saying it to the page's one live region", () => {
  const out = html(<Toast message="Kingen added" n={1} onDone={() => {}} />);
  expect(out).not.toContain('role="status"');
  expect(out).toContain('aria-hidden="true"');
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
  expect(html(<BuffCard name="Double Captain" does="A second Captain; both score ×1.5" left="1 left" state="off" />)).not.toContain("Play");
});

test("the main action is one filled key, disabled with its reason", () => {
  expect(text(<MainAction>Save team</MainAction>)).toBe("Save team");
  const off = html(<MainAction disabledReason="No changes">Save team</MainAction>);
  expect(off).toContain("No changes");
  expect(off).toContain('class="main-action__key key-off" disabled=""');
  expect(html(<MainAction>Save team</MainAction>)).not.toContain("key-off");
  expect(text(<OutlinedKey>Join a league</OutlinedKey>)).toBe("Join a league");
  const keyOff = html(<OutlinedKey disabledReason="League full">Join a league</OutlinedKey>);
  expect(keyOff).toContain('class="outlined-key key-off" disabled=""');
  expect(text(<OutlinedKey disabledReason="League full">Join a league</OutlinedKey>)).toBe("Join a leagueLeague full");
});

test("a menu is a key that opens its list", () => {
  const out = html(<Menu label="Admin ▾" items={[{ label: "Rename", onChoose: () => {} }, { label: "Delete league…", onChoose: () => {}, apart: true }]} />);
  expect(out).toContain('aria-expanded="false"');
  expect(out).toContain("Admin ▾");
});

test("loading draws bars, empty a title and a line, error a title, a line and Try again", () => {
  expect(html(<Loading rows={2} />).match(/state-loading__bar/g)).toHaveLength(2);
  expect(text(<Empty title="No moves yet" />)).toBe("No moves yet");
  expect(text(<ErrorState title="Couldn't load" line="The server didn't answer." onRetry={() => {}} />)).toBe(
    "Couldn't loadThe server didn't answer.Try again ›",
  );
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

test("a team's bar is its kit's first colour that shows on the ground, unseen by a screen reader; no bar for a team with no kit", () => {
  expect(html(<TeamBar team="T1" />)).toBe('<i class="team-bar" style="background:#E2012D" aria-hidden="true"></i>');
  // GEN's body is black and KRX's navy: each takes its kit's next colour.
  expect(html(<TeamBar team="GEN" />)).toContain("background:#AA8A00");
  expect(html(<TeamBar team="KRX" />)).toContain("background:#E4007F");
  expect(html(<TeamBar team="XYZ" />)).toBe("");
});

test("the series list shows scores with their state, and times for the next", () => {
  const out = text(<SeriesList series={WEEK3_SERIES_AT_POINTS} />);
  expect(out).toContain("SatGEN v HLE2–1 Not final");
  expect(out).toContain("SatT1 v DK1–0 Live");
  expect(out).toContain("SunKRX v BRO08:00SunBFX v DNS10:30");
  expect(html(<SeriesList series={WEEK3_SERIES_AT_POINTS} go={(s) => ({ to: "/series/$seriesId", params: { seriesId: s.id } })} />)).toContain(
    'href="/series/w3-sat-1"',
  );
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

test("every page's foot carries Riot's Legal Jibber Jabber notice, after the page (spec/13)", () => {
  const out = text(
    <PageFrame screen="points" account={null}>
      <p>main</p>
    </PageFrame>,
  );
  expect(out.endsWith(RIOT_NOTICE)).toBe(true);
  expect(RIOT_NOTICE).toBe(
    `Flol was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.`,
  );
});
