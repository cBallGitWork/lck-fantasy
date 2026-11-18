// Reads a drawn page (a mock-up's HTML) as text, for the slop lint (lint.mjs): the words it draws,
// its headings and its style rules. No dependencies; nothing here is any one project's.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·", star: "☆", starf: "★", rarr: "→", nearr: "↗" };

const COMMENT = /<!--[\s\S]*?-->/g;

/** Text with its HTML entities decoded. */
export function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name) => {
    if (name[0] === "#") return String.fromCodePoint(name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : Number(name.slice(1)));
    return ENTITIES[name.toLowerCase()] ?? whole;
  });
}

const tidy = (text) => decode(text).replace(/\s+/g, " ").trim();

/** The page's drawn text, one run per stretch between tags; head, styles, scripts and comments left out. */
export function drawnRuns(html) {
  return html
    .replace(COMMENT, "")
    .replace(/<(head|style|script|template)\b[\s\S]*?<\/\1>/gi, "")
    .split(/<[^>]*>/)
    .map(tidy)
    .filter(Boolean);
}

/** Each heading's (h1 to h6) drawn text. */
export function headings(html) {
  return [...html.replace(COMMENT, "").matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map(([, inner]) => tidy(inner.replace(/<[^>]*>/g, " "))).filter(Boolean);
}

/** Text split at each `sep` outside brackets and quotes, each part trimmed, empty parts dropped. */
export function splitTop(text, sep) {
  const parts = [];
  let depth = 0;
  let quote = "";
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) quote = c === quote ? "" : quote;
    else if (c === '"' || c === "'") quote = c;
    else if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (c === sep && depth === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

/** A rule's declarations as [property, value] pairs. */
function declarations(body) {
  return splitTop(body, ";").flatMap((part) => {
    const colon = part.indexOf(":");
    return colon < 0 ? [] : [[part.slice(0, colon).trim().toLowerCase(), part.slice(colon + 1).trim()]];
  });
}

const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return match ? (match[1] ?? match[2]) : undefined;
};

/** Every style rule on the page as { selector, decls }: each <style> block's rules, and each inline style as `tag.class[style]`. */
export function styleRules(html) {
  const page = html.replace(COMMENT, "");
  const rules = [];
  for (const [, css] of page.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const [, selector, body] of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      rules.push({ selector: selector.trim(), decls: declarations(body) });
    }
  }
  for (const [tag, name] of page.matchAll(/<([a-z][a-z0-9-]*)\b[^>]*\sstyle\s*=\s*(?:"[^"]*"|'[^']*')[^>]*>/gi)) {
    const classes = (attribute(tag, "class") ?? "").split(/\s+/).filter(Boolean);
    const selector = name.toLowerCase() + classes.map((c) => `.${c}`).join("") + "[style]";
    rules.push({ selector, decls: declarations(decode(attribute(tag, "style"))) });
  }
  return rules;
}
