// Privacy and Terms are plain pages whose words are docs/legal/*.md (spec/12, Settings): this reads
// the little markdown they use (paragraphs, `- ` lists, **bold**, links to each other).

export const LEGAL_PAGES = ["privacy", "terms"] as const;
export type LegalPage = (typeof LEGAL_PAGES)[number];

/** A run of a line: plain, bold, or a link to the other legal page. */
export type Run = { text: string; bold?: true; page?: LegalPage };

export type Block = { kind: "paragraph"; runs: Run[] } | { kind: "list"; items: Run[][] };

/** The line after which a legal file's page text starts; above it is a note for the repo. */
const BODY_FROM = "---";

const LIST_ITEM = "- ";

/** `**bold**`, or `[Privacy](privacy.md)`. */
const MARK = /\*\*(.+?)\*\*|\[([^\]]+)\]\((\w+)\.md\)/g;

const isPage = (name: string): name is LegalPage => (LEGAL_PAGES as readonly string[]).includes(name);

/** A line's runs; a link to a file that isn't a legal page stays as its words. */
export function runs(line: string): Run[] {
  const out: Run[] = [];
  let from = 0;
  for (const m of line.matchAll(MARK)) {
    if (m.index > from) out.push({ text: line.slice(from, m.index) });
    const [, bold, label, file] = m;
    if (bold !== undefined) out.push({ text: bold, bold: true });
    else if (label !== undefined && file !== undefined) out.push(isPage(file) ? { text: label, page: file } : { text: label });
    from = m.index + m[0].length;
  }
  if (from < line.length) out.push({ text: line.slice(from) });
  return out;
}

/** A legal file's page text as blocks: everything below its `---` line, wrapped lines joined. */
export function blocks(markdown: string): Block[] {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => line.trim() === BODY_FROM);
  if (start < 0) throw new Error(`A legal page's file has no "${BODY_FROM}" line above its text`);
  const chunks = lines
    .slice(start + 1)
    .join("\n")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  return chunks.map((chunk): Block => {
    if (!chunk.startsWith(LIST_ITEM)) return { kind: "paragraph", runs: runs(joinLines(chunk)) };
    const items = chunk.split(/\n(?=- )/).map((item) => runs(joinLines(item.slice(LIST_ITEM.length))));
    return { kind: "list", items };
  });
}

const joinLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .join(" ");
