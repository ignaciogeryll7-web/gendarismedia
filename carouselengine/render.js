const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { build, T } = require('./engine.js');
const DAYS = require('./slides.js');
const FPS = 24;
const day = process.argv[2];
const only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const stillOnly = process.argv[4] === 'still';

(async () => {
  const slides = DAYS[day];
  const base = __dirname;
  const out = path.join(base, 'out', (process.env.OUTTAG || 'day') + day);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (let i = 0; i < slides.length; i++) {
    const n = i + 1;
    if (only && !only.includes(n)) continue;
    const DAYSTYLE = { 1: 'silk', 2: 'glass', 3: 'loop', 4: 'bars', 5: 'wave' };
    const OV = process.env.STYLE ? { style: process.env.STYLE } : {};
    const sl = Object.assign({ style: DAYSTYLE[day] || 'silk', seed: n * 1.37 + Number(day) * 0.61, toff: n * 2.0 }, slides[i], OV);
    const html = build(sl, n, slides.length);
    const hp = path.join(base, `html_${process.env.OUTTAG || "day"}${day}_s${n}.html`);
    fs.writeFileSync(hp, html);
    await page.goto('file://' + hp);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.logoReady);
    await page.waitForTimeout(300);
    // final still at fully in, before out
    await page.evaluate(t => window.setT(t), 3.6);
    await page.screenshot({ path: path.join(out, `slide${n}.png`), type: 'png' });
    const ev = await page.evaluate(() => window.events);
    fs.writeFileSync(path.join(out, `events${n}.json`), JSON.stringify(ev));
    if (stillOnly) { console.log('still', day, n); continue; }
    const fd = path.join(out, `frames${n}`);
    fs.rmSync(fd, { recursive: true, force: true }); fs.mkdirSync(fd);
    const N = T * FPS;
    for (let f = 0; f < N; f++) {
      await page.evaluate(t => window.setT(t), f / FPS);
      await page.screenshot({ path: path.join(fd, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 94 });
    }
    console.log('done', day, n);
  }
  await browser.close();
})();
