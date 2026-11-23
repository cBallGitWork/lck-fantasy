// Cuts a drawn page into its parts at 1440 and 390, for a pick of parts across directions (Craig, 19 Nov 2026):
// node crop.mjs <page.html> <out-prefix>  writes <out-prefix>-<part>-<width>.png for each part below.
// A part is the box round every element its selectors find; the control's own markup has its own names.
import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const PARTS = {
  top: ".top, .topbar",
  head: ".head, .buffs",
  rift: ".rift-stage, body:not(:has(.rift-stage)) .rift",
  foot: ".squad-foot, .savebar, .bench, .bar",
  card: "section.card, .pcard",
  series: "section.series, .pcard + .sec",
};

const [page, out] = process.argv.slice(2);
if (!page || !out) {
  console.error("usage: node crop.mjs <page.html> <out-prefix>");
  process.exit(2);
}
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const tab = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await tab.goto(pathToFileURL(resolve(page)).href, { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  // As shoot.mjs: hold the Rift at its first-screen size, then make the window as tall as the page.
  await tab.evaluate(() => {
    const r = document.querySelector(".rift");
    if (r) document.documentElement.style.setProperty("--rift-fit", `${r.getBoundingClientRect().width}px`);
  });
  await tab.setViewportSize({ width, height: await tab.evaluate(() => document.documentElement.scrollHeight) });
  await tab.waitForTimeout(400);
  for (const [part, sel] of Object.entries(PARTS)) {
    const box = await tab.evaluate((s) => {
      const rs = [...document.querySelectorAll(s)].map((e) => e.getBoundingClientRect()).filter((r) => r.width && r.height);
      if (!rs.length) return null;
      const x = Math.min(...rs.map((r) => r.left)), y = Math.min(...rs.map((r) => r.top));
      return { x, y, width: Math.max(...rs.map((r) => r.right)) - x, height: Math.max(...rs.map((r) => r.bottom)) - y };
    }, sel);
    if (!box) console.error(`${width}: no ${part}`);
    else await tab.screenshot({ path: `${out}-${part}-${width}.png`, clip: box });
  }
  await tab.close();
}
await browser.close();
