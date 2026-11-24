// Shoots a drawn page at 1440 and 390: node shoot.mjs <page.html> <out-prefix>
// Writes <out-prefix>-1440.png and -390.png (the first screen, as a manager lands) and -1440-full.png
// and -390-full.png (the whole page, the window as tall as it, so a sticky bar sits in its own place).
// Prints any console error or sideways scroll.
import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [page, out] = process.argv.slice(2);
if (!page || !out) {
  console.error("usage: node shoot.mjs <page.html> <out-prefix>");
  process.exit(2);
}
// Any Chromium will do: the project's pinned one if installed, else Chrome itself.
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const tab = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  tab.on("console", (m) => m.type() === "error" && console.error(`${width}: ${m.text()}`));
  tab.on("pageerror", (e) => console.error(`${width}: ${e.message}`));
  await tab.goto(pathToFileURL(resolve(page)).href, { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  const wide = await tab.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (wide) console.error(`${width}: sideways scroll`);
  await tab.screenshot({ path: `${out}-${width}.png` });
  // Hold the Rift at its first-screen size: the whole-page shot makes the window as tall as the page, and the Rift sizes to the window.
  await tab.evaluate(() => {
    const r = document.querySelector(".rift");
    if (r) document.documentElement.style.setProperty("--rift-fit", `${r.getBoundingClientRect().width}px`);
  });
  const tall = await tab.evaluate(() => document.documentElement.scrollHeight);
  await tab.setViewportSize({ width, height: tall });
  await tab.waitForTimeout(400);
  await tab.screenshot({ path: `${out}-${width}-full.png` });
  await tab.close();
}
await browser.close();
