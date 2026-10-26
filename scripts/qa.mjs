/**
 * QA otomatis (Playwright + Chrome sistem). Menyalakan server Vite sendiri; atur BASE untuk memakai server lain.
 * Memeriksa: tanpa luapan di tiap slide (1920x1080, 1440x810, 1280x720, 390x844), tanpa galat konsol, navigasi,
 * #/3, F dan Esc, sorotan jalur di slide 3, ukuran teks program unggulan, catatan pembicara.
 */
import { writeFileSync } from 'node:fs';
import { PROGRAM } from '../src/data/narasi.ts';
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
  for (let i = 1; i <= 4; i++) {
    const page = await buka(ctx, `#/${i}`);
    const dock = await page.textContent('.pg-nomor-dock');
    cek(`#/${i} membuka slide ke-${i} (${nama})`, dock?.trim() === `${i} / 4`, `dock "${dock}"`);
    await page.screenshot({ path: `shots/slide-${i}-${nama}.png` });
    const sw = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    cek(`tanpa luapan horizontal slide ${i} (${nama})`, sw.sw <= sw.iw + 1, `${sw.sw}/${sw.iw}`);
    if (!seluler && i >= 2 && i <= 3) {
      const l = await page.evaluate(periksaLuapan, i - 1);
      cek(`slide ${i} muat satu layar tanpa teks terpotong (${nama})`, l.keluar.length === 0 && l.terpotong.length === 0, JSON.stringify(l));
    }
    if (!seluler && i === 3) {
      const fs = await page.evaluate(() => Math.min(...[...document.querySelectorAll('.simpul-a')].map((e) => parseFloat(getComputedStyle(e).fontSize))));
      const min = w >= 1920 ? 22 : w >= 1440 ? 16 : 15;
      cek(`teks program unggulan >= ${min}px (${nama})`, fs >= min - 0.2, `${fs.toFixed(1)}px`);
    }
    if (seluler && i >= 2 && i <= 3) {
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
  cek('panah kanan memindahkan ke slide 2', (await dock()) === '2 / 4', await dock());
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(1800);
  cek('panah kiri kembali ke slide 1', (await dock()) === '1 / 4', await dock());
  await page.keyboard.press('End');
  await page.waitForTimeout(2200);
  cek('End membuka slide 4', (await dock()) === '4 / 4', await dock());
  await page.keyboard.press('Home');
  await page.waitForTimeout(2200);
  cek('Home membuka slide 1', (await dock()) === '1 / 4', await dock());
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
  cek('N menampilkan catatan pembicara dan penghitung waktu', /Waktu 0:30/.test(panel) && /\d:\d\d/.test(panel), panel.slice(0, 60));
  await page.keyboard.press('n');
  await page.close();

  const p3 = await buka(ctx, '#/3');
  const sebelum = await p3.evaluate(() => document.querySelectorAll('.simpul.redup').length);
  await p3.locator('.simpul-m').first().click();
  await p3.waitForTimeout(400);
  const sesudah = await p3.evaluate(() => ({ redup: document.querySelectorAll('.simpul.redup').length, jalur: document.querySelectorAll('.jalur.redup').length, tekan: document.querySelector('.simpul-m[aria-pressed="true"]') !== null, dock: document.querySelector('.pg-nomor-dock')?.textContent?.trim() }));
  cek('klik simpul misi menyorot jalur', sebelum === 0 && sesudah.redup > 0 && sesudah.jalur > 0 && sesudah.tekan, JSON.stringify(sesudah));
  cek('klik di diagram tidak memindahkan slide', sesudah.dock === '3 / 4', sesudah.dock);
  await p3.locator('.simpul-u').nth(3).click();
  await p3.waitForTimeout(300);
  const aktifA = await p3.evaluate(() => [...document.querySelectorAll('.simpul-a:not(.redup)')].length);
  cek('klik simpul strategi 04 menyisakan 2 program unggulan', aktifA === 2, String(aktifA));
  await p3.locator('.simpul-u').nth(3).click();
  await p3.waitForTimeout(300);
  cek('klik lagi melepas sorotan', (await p3.evaluate(() => document.querySelectorAll('.simpul.redup').length)) === 0);
  await p3.close();

  const p2 = await buka(ctx, '#/2');
  const t2 = await p2.evaluate(() => document.querySelectorAll('.pg-slide')[1].textContent.replace(/\s+/g, ' '));
  cek('slide 2 memuat judul, Visi Besar 2045, Visi 2027-2031, dan 4 misi sesuai PPT', ['Dari Peta Besar RPJP Menuju Agenda Lima Tahun', 'Visi Besar Universitas Lampung 2045', 'Universitas Lampung Berkelas Dunia, Unggul, dan Berkelanjutan', 'Visi 2027-2031', 'Universitas Lampung sebagai Ekosistem Hilirisasi Inovasi, Berdaya Saing Dunia, Berakar pada Budaya dan Kemandirian Bangsa', 'Penguatan Tata Kelola PTN', 'Kepemimpinan Berbasis Nilai Budaya'].every((k) => t2.includes(k)));
  cek('slide 2 tanpa kalimat keterangan lama dan tanpa pita tagline', !t2.includes('jatuh di pergantian') && !/Impactful for Leading/.test(t2));
  await p2.close();
  const p3b = await buka(ctx, '#/3');
  const lab = await p3b.evaluate(() => [...document.querySelectorAll('.simpul-a')].map((e) => [...e.children].map((c) => c.textContent.trim()).join(' ')));
  const harap = PROGRAM.map((p) => `${p.id} ${p.label}`);
  cek('13 label program unggulan sama dengan PPT', JSON.stringify(lab) === JSON.stringify(harap), lab.filter((l, i) => l !== harap[i]).join(' | '));
  const jd = await p3b.evaluate(() => document.querySelectorAll('.pg-slide')[2].querySelector('h2').textContent);
  cek('judul slide 3 sesuai PPT', jd === 'Enam Strategi dan Tiga Belas Program Unggulan', jd);
  await p3b.close();
  await ctx.close();
}

// ---------- reduced motion ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  const page = await buka(ctx, '#/1');
  const m = await page.evaluate(() => ({ kelas: document.querySelector('.panggung')?.className, n: [...document.querySelectorAll('.pg-slide')].filter((s) => getComputedStyle(s).opacity === '1').length }));
  cek('reduced motion: slide ditumpuk dan semuanya terlihat', /pg-tumpuk/.test(m.kelas ?? '') && m.n === 4, JSON.stringify(m));
  await page.close();
  await ctx.close();
}

cek('tanpa galat konsol', galat.length === 0, galat.slice(0, 3).join(' || '));
await browser.close();
await tutup();
const gagal = hasil.filter((h) => !h.ok);
writeFileSync('shots/hasil-qa.json', JSON.stringify(hasil, null, 2));
console.log(`\n${hasil.length - gagal.length} dari ${hasil.length} lulus`);
process.exit(gagal.length ? 1 : 0);
