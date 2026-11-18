import { MANAGER } from "../../fixtures/competition";
import { GoLink, PageFrame, PageHead } from "../../parts";
import { PATHS, SCREEN_NAME } from "../../paths";
import privacy from "../../../docs/legal/privacy.md?raw";
import terms from "../../../docs/legal/terms.md?raw";
import { blocks, type Block, type LegalPage, type Run } from "./legal";
import "./legal.css";

const TEXT: Record<LegalPage, string> = { privacy, terms };

function Runs({ runs }: { runs: Run[] }) {
  return runs.map((run, i) =>
    run.page ? (
      <GoLink key={i} go={{ to: PATHS[run.page] }} className="legal__link">
        {run.text}
      </GoLink>
    ) : run.bold ? (
      <b key={i}>{run.text}</b>
    ) : (
      run.text
    ),
  );
}

function Body({ block }: { block: Block }) {
  if (block.kind === "paragraph")
    return (
      <p>
        <Runs runs={block.runs} />
      </p>
    );
  return (
    <ul className="legal__list">
      {block.items.map((item, i) => (
        <li key={i}>
          <Runs runs={item} />
        </li>
      ))}
    </ul>
  );
}

/** Privacy or Terms: a plain page of docs/legal/'s text, with no picture (spec/12, Settings). */
export function LegalScreen({ page, account = MANAGER.team }: { page: LegalPage; account?: string | null }) {
  return (
    <PageFrame screen="legal" account={account}>
      <PageHead title={SCREEN_NAME[page]} />
      <article className="legal">
        {blocks(TEXT[page]).map((block, i) => (
          <Body key={i} block={block} />
        ))}
      </article>
    </PageFrame>
  );
}

export const PrivacyScreen = () => <LegalScreen page="privacy" />;
export const TermsScreen = () => <LegalScreen page="terms" />;
