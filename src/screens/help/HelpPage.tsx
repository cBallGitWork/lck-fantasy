import { useId } from "react";
import { COMPETITION_TITLE, MANAGER } from "../../fixtures/competition";
import { Columns, cx, GoLink, PageFrame, PageHead, SideSection, TabPanel, Tabs } from "../../parts";
import { helpGo, RULES_HASH, SCREEN_NAME } from "../../paths";
import { BlockView } from "./Blocks";
import type { HelpData } from "./facts";
import { GUIDE, INTRO } from "./guide";
import { FIRST_RULE, RULES } from "./rules";
import { HANGUL, MENU_TITLE, RULES_MENU_TITLE, TABS, type HelpTab, type Item } from "./words";

/** What a link's hash opens: a guide page on Help, or a rule open on Rules. Anything else is the guide's first page. */
export type HelpView = { tab: "Help"; page: Item } | { tab: "Rules"; open: string };

const RULE_IDS = new Set(RULES.flatMap((group) => group.items.map((item) => item.id)));

export function viewOf(hash: string): HelpView {
  if (hash === RULES_HASH) return { tab: "Rules", open: FIRST_RULE };
  if (RULE_IDS.has(hash)) return { tab: "Rules", open: hash };
  const page = GUIDE.find((item) => item.id === hash) ?? GUIDE[0];
  if (!page) throw new Error("Help's guide has no pages.");
  return { tab: "Help", page };
}

/** The guide page with its title, the intro above the first, and Back and Next under it. */
function GuidePage({ page, data }: { page: Item; data: HelpData }) {
  const at = GUIDE.indexOf(page);
  const back = GUIDE[at - 1];
  const next = GUIDE[at + 1];
  return (
    <article className="help__page">
      {at === 0 && (
        <div className="help__intro">
          <p className="help__p help__p--big">{INTRO.big}</p>
          <p className="help__p">{INTRO.rest}</p>
        </div>
      )}
      <h2 className="help__page-title">{page.title}</h2>
      {page.blocks.map((block, i) => (
        <BlockView key={i} block={block} data={data} />
      ))}
      <nav className="help__pager">
        {back && (
          <GoLink go={helpGo(back.id)} className="help__pager-link">
            ‹ {back.title}
          </GoLink>
        )}
        {next && (
          <GoLink go={helpGo(next.id)} className="help__pager-link help__pager-link--next">
            {next.title} ›
          </GoLink>
        )}
      </nav>
    </article>
  );
}

/** Every rule in its group, each opening and closing; the one asked for starts open. */
function RulesList({ open, data }: { open: string; data: HelpData }) {
  return RULES.map(({ group, items }) => (
    <section key={group} className="help__group">
      <h2 className="help__group-title">{group}</h2>
      {items.map((item) => (
        <details key={item.id} id={item.id} className="help__rule" open={item.id === open}>
          <summary className="help__rule-title">{item.title}</summary>
          <div className="help__rule-body">
            {item.blocks.map((block, i) => (
              <BlockView key={i} block={block} data={data} />
            ))}
          </div>
        </details>
      ))}
    </section>
  ));
}

/** The side menu: the guide's pages on Help, the rule groups on Rules. */
function Menu({ view }: { view: HelpView }) {
  const lines =
    view.tab === "Help"
      ? GUIDE.map((item) => ({ id: item.id, label: item.title, step: item.step, on: item === view.page }))
      : RULES.map(({ group, items }) => ({ id: items[0]?.id ?? RULES_HASH, label: group, step: undefined, on: false }));
  return (
    <SideSection title={view.tab === "Help" ? MENU_TITLE : RULES_MENU_TITLE}>
      <ol className="help__menu">
        {lines.map((line) => (
          <li key={line.id}>
            <GoLink go={helpGo(line.id)} className={cx("help__menu-line", line.on && "help__menu-line--on")} current={line.on}>
              {line.step !== undefined && <i className="help__step num">{line.step}</i>}
              {line.label}
            </GoLink>
          </li>
        ))}
      </ol>
    </SideSection>
  );
}

/**
 * Help, as FPL's (spec/12, Help; docs/design/approved/help/): two tabs. Help is the guide, one page
 * at a time from the Help menu, with Back and Next; Rules is every rule in groups that open and
 * close. The hash picks the page or the rule: `/help#prices` opens Player prices.
 */
export function HelpPage({ hash, data, account = MANAGER.team, onTab }: { hash: string; data: HelpData; account?: string | null; onTab?: (tab: HelpTab) => void }) {
  const tabsId = useId();
  const view = viewOf(hash);
  return (
    <PageFrame screen="help" account={account}>
      <PageHead title={SCREEN_NAME.help} hangul={HANGUL} sub={COMPETITION_TITLE} />
      <Tabs id={tabsId} tabs={TABS} chosen={view.tab} onChoose={onTab} label={SCREEN_NAME.help} />
      <Columns className="help">
        <TabPanel id={tabsId} className="help__main">
          {view.tab === "Help" ? <GuidePage page={view.page} data={data} /> : <RulesList key={view.open} open={view.open} data={data} />}
        </TabPanel>
        <aside className="help__side">
          <Menu view={view} />
        </aside>
      </Columns>
    </PageFrame>
  );
}
