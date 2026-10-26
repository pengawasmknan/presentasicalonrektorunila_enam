import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

export const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const WAKTU_SLIDE = 2400;

/** Menyalakan server Vite sendiri (port 5199) bila BASE tidak diberikan. */
export async function nyalakanServer() {
  if (process.env.BASE) return { base: process.env.BASE, tutup: async () => undefined };
  const server = await createServer({ server: { port: 5199, strictPort: false, host: 'localhost' }, logLevel: 'error' });
  await server.listen();
  const alamat = server.resolvedUrls?.local?.[0] ?? 'http://localhost:5199/';
  return { base: alamat.replace(/\/$/, ''), tutup: () => server.close() };
}

/** Chrome sistem. `--headless=old` dipakai karena headless baru macet saat memotret halaman dengan backdrop-filter. */
export async function luncurkan() {
  return chromium.launch({ executablePath: CHROME, args: process.env.HEADLESS_BARU ? [] : ['--headless=old'] });
}

export const siapkanDir = (...d) => d.forEach((x) => mkdirSync(x, { recursive: true }));

/** Konteks tanpa gerak: slide ditumpuk, semua teks sudah di nilai akhir, dock disembunyikan. Dipakai PDF dan PPTX. */
export async function bukaTumpuk(browser, base, lebar = 1920, tinggi = 1080) {
  const ctx = await browser.newContext({ viewport: { width: lebar, height: tinggi }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}/#/1`, { waitUntil: 'load' });
  await page.addStyleTag({ content: '.pg-foot, .cp-panel, .st-petunjuk { display: none !important; } html { scroll-behavior: auto !important; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  return { ctx, page };
}

/** Potret tiap slide (elemen `.pg-slide`) pada halaman mode tumpuk. Mengembalikan larik buffer PNG 1920x1080. */
export async function potretSlide(page) {
  const slide = await page.$$('.pg-slide');
  const hasil = [];
  for (const el of slide) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    hasil.push(await el.screenshot({ type: 'png' }));
  }
  return hasil;
}
