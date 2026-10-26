/**
 * QA otomatis (Playwright + Chrome sistem). Menyalakan server Vite sendiri; atur BASE untuk memakai server lain.
 * Memeriksa: tanpa luapan di tiap slide (1920x1080, 1440x810, 1280x720, 390x844), tanpa galat konsol, navigasi,
 * #/3, F dan Esc, sorotan jalur di slide 3, ukuran teks program unggulan, catatan pembicara.
 * Jika dashboard menyala di DASH (default http://localhost:5173), slide 1 dan 5 dibandingkan piksel demi piksel.
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { luncurkan, nyalakanServer, siapkanDir, WAKTU_SLIDE } from './lib.mjs';

siapkanDir('shots');
const hasil = [];
const cek = (nama, ok, detail = '') => {
  hasil.push({ nama, ok, detail });
  console.log(`${ok ? 'LULUS' : 'GAGAL'}  ${nama}${detail ? ` | ${detail}` : ''}`);
};
const galat = [];

const { base, tutup } = await nyalakanServer();
const browser = await luncurkan();

async function buka(ctx, hash = '#/1') {
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && galat.push(`${hash}: ${m.text().slice(0, 160)}`));
  page.on('pageerror', (e) => galat.push(`${hash}: ${e.message.slice(0, 160)}`));
  await page.goto(`${base}/${hash}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(WAKTU_SLIDE);
  return page;
}

/** Elemen isi slide yang keluar dari bingkai slide, atau kartu yang teksnya terpotong. */
const periksaLuapan = (nomor) => {
  const slide = document.querySelectorAll('.pg-slide')[nomor];
  const r = slide.getBoundingClientRect();
  const keluar = [];
  slide.querySelectorAll('.pg-isi *').forEach((e) => {
    const b = e.getBoundingClientRect();
    if (b.width === 0) return;
    if (b.bottom > r.bottom + 1 || b.right > r.right + 1 || b.left < r.left - 1) keluar.push(`${e.className || e.tagName} b=${Math.round(b.bottom - r.bottom)} r=${Math.round(b.right - r.right)}`);
  });
  const terpotong = [];
  slide.querySelectorAll('.dt-kartu, .simpul, .ld-misi li, .rpjp-tahap li').forEach((e) => {
    if (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1) terpotong.push(`${e.className} ${e.scrollHeight}/${e.clientHeight}`);
  });
  return { keluar: keluar.slice(0, 4), terpotong: terpotong.slice(0, 4) };
};

// ---------- tiap ukuran, tiap slide ----------
for (const [nama, w, h, seluler] of [['1920x1080', 1920, 1080, false], ['1440x810', 1440, 810, false], ['1280x720', 1280, 720, false], ['390x844', 390, 844, true]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: seluler, hasTouch: seluler });
  for (let i = 1; i <= 5; i++) {
    const page = await buka(ctx, `#/${i}`);
    const dock = await page.textContent('.pg-nomor-dock');
    cek(`#/${i} membuka slide ke-${i} (${nama})`, dock?.trim() === `${i} / 5`, `dock "${dock}"`);
    await page.screenshot({ path: `shots/slide-${i}-${nama}.png` });
    const sw = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    cek(`tanpa luapan horizontal slide ${i} (${nama})`, sw.sw <= sw.iw + 1, `${sw.sw}/${sw.iw}`);
    if (!seluler && i >= 2 && i <= 4) {
      const l = await page.evaluate(periksaLuapan, i - 1);
      cek(`slide ${i} muat satu layar tanpa teks terpotong (${nama})`, l.keluar.length === 0 && l.terpotong.length === 0, JSON.stringify(l));
    }
    if (!seluler && i === 3) {
      const fs = await page.evaluate(() => Math.min(...[...document.querySelectorAll('.simpul-a')].map((e) => parseFloat(getComputedStyle(e).fontSize))));
      const min = w >= 1920 ? 22 : w >= 1440 ? 16 : 15;
      cek(`teks program unggulan >= ${min}px (${nama})`, fs >= min - 0.2, `${fs.toFixed(1)}px`);
    }
    if (seluler && i >= 2 && i <= 4) {
      const t = await page.evaluate((nomor) => {
        const s = document.querySelectorAll('.pg-slide')[nomor];
        return { tampak: getComputedStyle(s).visibility === 'visible' && Number(getComputedStyle(s).opacity) === 1, teks: s.innerText.length };
      }, i - 1);
      cek(`mode tumpuk: slide ${i} terbaca penuh (${nama})`, t.tampak && t.teks > 80, `${t.teks} karakter`);
    }
    await page.close();
  }
  await ctx.close();
}

// ---------- perilaku ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await buka(ctx, '#/1');
  const dock = () => page.textContent('.pg-nomor-dock').then((t) => t?.trim());
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1800);
  cek('panah kanan memindahkan ke slide 2', (await dock()) === '2 / 5', await dock());
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(1800);
  cek('panah kiri kembali ke slide 1', (await dock()) === '1 / 5', await dock());
  await page.keyboard.press('End');
  await page.waitForTimeout(2200);
  cek('End membuka slide 5', (await dock()) === '5 / 5', await dock());
  await page.keyboard.press('Home');
  await page.waitForTimeout(2200);
  cek('Home membuka slide 1', (await dock()) === '1 / 5', await dock());
  await page.keyboard.press('f');
  await page.waitForTimeout(600);
  const penuh = await page.evaluate(() => !!document.fullscreenElement);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  const keluar = await page.evaluate(() => !document.fullscreenElement);
  cek('F masuk layar penuh dan Esc keluar', penuh && keluar, `masuk=${penuh} keluar=${keluar}`);
  await page.keyboard.press('n');
  await page.waitForTimeout(300);
  const panel = await page.evaluate(() => document.querySelector('.cp-panel')?.textContent ?? '');
  cek('N menampilkan catatan pembicara dan penghitung waktu', /Bapak dan Ibu sekalian/.test(panel) && /\d:\d\d/.test(panel), panel.slice(0, 60));
  await page.keyboard.press('n');
  await page.close();

  const p3 = await buka(ctx, '#/3');
  const sebelum = await p3.evaluate(() => document.querySelectorAll('.simpul.redup').length);
  await p3.locator('.simpul-m').first().click();
  await p3.waitForTimeout(400);
  const sesudah = await p3.evaluate(() => ({ redup: document.querySelectorAll('.simpul.redup').length, jalur: document.querySelectorAll('.jalur.redup').length, tekan: document.querySelector('.simpul-m[aria-pressed="true"]') !== null, dock: document.querySelector('.pg-nomor-dock')?.textContent?.trim() }));
  cek('klik simpul misi menyorot jalur', sebelum === 0 && sesudah.redup > 0 && sesudah.jalur > 0 && sesudah.tekan, JSON.stringify(sesudah));
  cek('klik di diagram tidak memindahkan slide', sesudah.dock === '3 / 5', sesudah.dock);
  await p3.locator('.simpul-u').nth(3).click();
  await p3.waitForTimeout(300);
  const aktifA = await p3.evaluate(() => [...document.querySelectorAll('.simpul-a:not(.redup)')].length);
  cek('klik simpul strategi 04 menyisakan 2 program unggulan', aktifA === 2, String(aktifA));
  await p3.locator('.simpul-u').nth(3).click();
  await p3.waitForTimeout(300);
  cek('klik lagi melepas sorotan', (await p3.evaluate(() => document.querySelectorAll('.simpul.redup').length)) === 0);
  await p3.close();

  const p4 = await buka(ctx, '#/4');
  await p4.waitForTimeout(1200);
  const angka = await p4.evaluate(() => [...document.querySelectorAll('.dt-angka b')].map((e) => e.textContent?.replace(/\s+/g, ' ').trim()));
  cek('angka kunci slide 4 mencapai nilai akhir', angka.some((t) => /50%.*15–20%.*Guru Besar/.test(t ?? '')) && angka.some((t) => /Rp650 M/.test(t ?? '')), JSON.stringify(angka));
  await p4.close();
  await ctx.close();
}

// ---------- reduced motion ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  const page = await buka(ctx, '#/1');
  const m = await page.evaluate(() => ({ kelas: document.querySelector('.panggung')?.className, n: [...document.querySelectorAll('.pg-slide')].filter((s) => getComputedStyle(s).opacity === '1').length }));
  cek('reduced motion: slide ditumpuk dan semuanya terlihat', /pg-tumpuk/.test(m.kelas ?? '') && m.n === 5, JSON.stringify(m));
  await page.close();
  await ctx.close();
}

// ---------- banding dengan dashboard ----------
{
  const dash = process.env.DASH ?? 'http://localhost:5173';
  const hidup = await fetch(dash).then((r) => r.ok).catch(() => false);
  if (!hidup) console.log(`LEWATI  banding slide 1 dan 5 dengan dashboard (tidak ada server di ${dash})`);
  else {
    const ambil = async (url, tag) => {
      const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2000);
      await page.addStyleTag({ content: '.pg-foot { display: none !important; }' });
      const s = await page.$$('.pg-slide');
      for (const [n, el] of [[1, s[0]], [5, s[s.length - 1]]]) {
        await el.scrollIntoViewIfNeeded();
        await el.screenshot({ path: `shots/banding-${tag}-${n}.png` });
      }
      await ctx.close();
    };
    await ambil(`${dash}/#/panggung/1`, 'dashboard');
    await ambil(`${base}/#/1`, 'baru');
    for (const n of [1, 5]) {
      const A = await sharp(`shots/banding-dashboard-${n}.png`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const B = await sharp(`shots/banding-baru-${n}.png`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      let beda = 0;
      for (let i = 0; i < A.data.length; i++) if (Math.abs(A.data[i] - B.data[i]) > 2) beda++;
      cek(`slide ${n} identik dengan adegan ${n === 1 ? 'pertama' : 'terakhir'} dashboard (1920x1080)`, A.info.width === B.info.width && A.info.height === B.info.height && beda === 0, `${beda} nilai warna beda`);
    }
  }
}

cek('tanpa galat konsol', galat.length === 0, galat.slice(0, 3).join(' || '));
await browser.close();
await tutup();
const gagal = hasil.filter((h) => !h.ok);
writeFileSync('shots/hasil-qa.json', JSON.stringify(hasil, null, 2));
console.log(`\n${hasil.length - gagal.length} dari ${hasil.length} lulus`);
process.exit(gagal.length ? 1 : 0);
