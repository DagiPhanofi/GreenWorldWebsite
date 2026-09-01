import { pathToFileURL } from 'node:url';
import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PUPPETEER_ROOT = 'C:/Users/DagmawiAlemayehuBeke/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
const { default: puppeteer } = await import(pathToFileURL(PUPPETEER_ROOT).href);

const [, , urlArg, labelArg, modeArg] = process.argv;
if (!urlArg) {
  console.error('usage: node screenshot.mjs <url> [label] [mobile]');
  process.exit(1);
}

const isMobile = /^(mobile|m|phone)$/i.test(modeArg ?? '');

const outDir = path.resolve('temporary screenshots');
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

const existing = await readdir(outDir);
const nums = existing
  .map(f => f.match(/^screenshot-(\d+)(?:-.*)?\.png$/i))
  .filter(Boolean)
  .map(m => parseInt(m[1], 10));
const next = (nums.length ? Math.max(...nums) : 0) + 1;

const tag = [labelArg, isMobile ? 'mobile' : null].filter(Boolean).join('-');
const suffix = tag ? `-${tag.replace(/[^a-z0-9._-]+/gi, '-')}` : '';
const outFile = path.join(outDir, `screenshot-${next}${suffix}.png`);

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
  defaultViewport: isMobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 },
});
try {
  const page = await browser.newPage();
  await page.goto(urlArg, { waitUntil: 'networkidle2', timeout: 60000 });

  // Uden dette bliver alt under folden tomt i et fullPage-screenshot:
  // loading="lazy" hentes først, når elementet nærmer sig viewporten.
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const cap = (p, ms) => Promise.race([p, wait(ms)]);

    document.querySelectorAll('[loading="lazy"]').forEach((el) => { el.loading = 'eager'; });

    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += window.innerHeight * 0.8) {
      window.scrollTo(0, y);
      await wait(50);
    }
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = prev;

    await cap(Promise.all(
      [...document.images]
        .filter((i) => !i.complete)
        .map((i) => new Promise((r) => { i.onload = i.onerror = r; }))
    ), 10000);
    await cap(document.fonts ? document.fonts.ready : Promise.resolve(), 5000);
  });
  await new Promise((r) => setTimeout(r, 2500));

  await page.screenshot({ path: outFile, fullPage: true, captureBeyondViewport: false });
  console.log(outFile);
} finally {
  await browser.close();
}
