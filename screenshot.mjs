import { pathToFileURL } from 'node:url';
import { mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const PUPPETEER_ROOT = 'C:/Users/DagmawiAlemayehuBeke/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
const { default: puppeteer } = await import(pathToFileURL(PUPPETEER_ROOT).href);

const [, , urlArg, labelArg] = process.argv;
if (!urlArg) {
  console.error('usage: node screenshot.mjs <url> [label]');
  process.exit(1);
}

const outDir = path.resolve('temporary screenshots');
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

const existing = await readdir(outDir);
const nums = existing
  .map(f => f.match(/^screenshot-(\d+)(?:-.*)?\.png$/i))
  .filter(Boolean)
  .map(m => parseInt(m[1], 10));
const next = (nums.length ? Math.max(...nums) : 0) + 1;

const suffix = labelArg ? `-${labelArg.replace(/[^a-z0-9._-]+/gi, '-')}` : '';
const outFile = path.join(outDir, `screenshot-${next}${suffix}.png`);

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});
try {
  const page = await browser.newPage();
  await page.goto(urlArg, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.screenshot({ path: outFile, fullPage: true });
  console.log(outFile);
} finally {
  await browser.close();
}
