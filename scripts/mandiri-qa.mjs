/**
 * Uji offline untuk cadangan/Panggung-Prof-Anna.html (dibuka dari file://).
 * Semua jaringan diblokir; setiap permintaan yang bukan file:, data:, atau blob: dicatat sebagai galat.
 * Hasil tangkapan layar: shots/mandiri-<lebar>-<slide>.png
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { luncurkan, siapkanDir } from './lib.mjs';

siapkanDir('shots');
const BERKAS = resolve('cadangan/Panggung-Prof-Anna.html');
const URL_BERKAS = `file://${BERKAS}`;
const hasil = [];
const cek = (nama, ok, detail = '') => { hasil.push(ok); console.log(`${ok ? 'LULUS' : 'GAGAL'}  ${nama}${detail ? ` | ${detail}` : ''}`); };

if (!existsSync(BERKAS)) { console.log('berkas tidak ada, jalankan npm run html'); process.exit(1); }
const html = readFileSync(BERKAS, 'utf8');
cek('berkas tanpa tautan http(s) eksternal dan tanpa <script src>', !/<script[^>]+src=/.test(html) && !/https?:\/\/(?!www\.w3\.org)/.test(html.replace(/<script>[\s\S]*?<\/script>/g, '')));
cek('font Instrument Sans tertanam sebagai data-URI', /data:font\/woff2;base64,/.test(html) || /data:application\/font-woff2;base64,/.test(html));

const browser = await luncurkan();
const galat = [];
const jaringan = [];

for (const [lebar, tinggi] of [[1920, 1080], [1440, 810], [1280, 720]]) {
  const ctx = await browser.newContext({ viewport: { width: lebar, height: tinggi }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  await ctx.setOffline(true);
  const page = await ctx.newPage();
  const cat = (tag) => (m) => { if (m.type() === 'error') galat.push(`${tag}: ${m.text().slice(0, 140)}`); };
  page.on('console', cat(`${lebar}`));
  page.on('pageerror', (e) => galat.push(`${lebar} pageerror: ${e.message.slice(0, 140)}`));
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url())) jaringan.push(r.url().slice(0, 120)); });

  await page.goto(`${URL_BERKAS}#/1`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);

  const fon = await page.evaluate(() => ({
    kelas: [...document.fonts].filter((f) => f.family.includes('Instrument') && f.status === 'loaded').length,
    cek: document.fonts.check('16px "Instrument Sans Variable"'),
  }));
  cek(`font Instrument Sans terpakai (${lebar}x${tinggi})`, fon.kelas > 0 && fon.cek, JSON.stringify(fon));
  const gambar = await page.evaluate(() => [...document.images].map((i) => i.complete && i.naturalWidth > 0));
  cek(`semua gambar termuat (${lebar}x${tinggi})`, gambar.length > 0 && gambar.every(Boolean), `${gambar.filter(Boolean).length}/${gambar.length}`);
  const jumlah = await page.evaluate(() => document.querySelectorAll('.pg-slide').length);
  cek(`empat slide ada (${lebar}x${tinggi})`, jumlah === 4, String(jumlah));

  for (let i = 1; i <= 4; i++) {
    if (i > 1) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(2000); }
    const dock = (await page.textContent('.pg-nomor-dock'))?.trim();
    cek(`slide ${i} tampil (${lebar}x${tinggi})`, dock === `${i} / 4`, dock);
    await page.screenshot({ path: `shots/mandiri-${lebar}-${i}.png` });
  }
  if (lebar === 1920) {
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(1600);
    cek('panah kiri kembali ke slide 3', (await page.textContent('.pg-nomor-dock'))?.trim() === '3 / 4');
    await page.keyboard.press('Home');
    await page.waitForTimeout(2000);
    cek('Home membuka slide 1', (await page.textContent('.pg-nomor-dock'))?.trim() === '1 / 4');
    await page.keyboard.press('End');
    await page.waitForTimeout(2000);
    cek('End membuka slide 4', (await page.textContent('.pg-nomor-dock'))?.trim() === '4 / 4');
    await page.keyboard.press('Home');
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(2000);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(2000);
    cek('dua panah dari slide 1 membuka slide 3', (await page.textContent('.pg-nomor-dock'))?.trim() === '3 / 4');
    const kunci = await page.evaluate(() => [...document.querySelectorAll('.simpul-a .kunci')].map((e) => getComputedStyle(e).color + ' ' + getComputedStyle(e).fontWeight));
    cek('kata kunci tebal biru pada label program (slide 3)', kunci.length > 0 && kunci.every((k) => /rgb\(30, 144, 255\) 700/.test(k)), `${kunci.length} kata kunci`);
    await page.click('.simpul-m >> nth=0');
    await page.waitForTimeout(400);
    const redup = await page.evaluate(() => document.querySelectorAll('.simpul.redup').length);
    cek('klik simpul misi menyorot jalur', redup > 0, `${redup} simpul redup`);
    await page.click('.simpul-m >> nth=0');
    await page.waitForTimeout(300);
    await page.keyboard.press('n');
    await page.waitForTimeout(300);
    cek('N membuka catatan pembicara', (await page.$('.cp-panel')) !== null);
    await page.keyboard.press('n');
    await page.keyboard.press('?');
    await page.waitForTimeout(200);
    cek('? membuka daftar tombol', (await page.$('.bantuan')) !== null);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    cek('Esc menutup daftar tombol', (await page.$('.bantuan')) === null);
    await page.keyboard.press('f');
    await page.waitForTimeout(500);
    const penuh = await page.evaluate(() => !!document.fullscreenElement);
    cek('F membuka layar penuh', penuh, penuh ? '' : 'mungkin dibatasi headless; cek manual');
    if (penuh) await page.keyboard.press('Escape');
    // geser sentuh: kiri, lalu kanan
    await page.keyboard.press('Home');
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      const el = document.querySelector('.panggung');
      const sentuh = (tipe, x, y) => el.dispatchEvent(new TouchEvent(tipe, { bubbles: true, cancelable: true, touches: tipe === 'touchend' ? [] : [new Touch({ identifier: 1, target: el, clientX: x, clientY: y })], changedTouches: [new Touch({ identifier: 1, target: el, clientX: x, clientY: y })] }));
      sentuh('touchstart', 900, 500); sentuh('touchend', 600, 510);
    });
    await page.waitForTimeout(1800);
    cek('geser sentuh ke kiri pindah ke slide 2', (await page.textContent('.pg-nomor-dock'))?.trim() === '2 / 4');
  }
  await ctx.close();
}

// cetak: 4 halaman
{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await page.goto(`${URL_BERKAS}#/1`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.emulateMedia({ media: 'print' });
  const pdf = await page.pdf({ width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  const halaman = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  cek('cetak menghasilkan 4 halaman', halaman === 4, `${halaman} halaman`);
  await ctx.close();
}

cek('tanpa galat konsol', galat.length === 0, galat.slice(0, 3).join(' || '));
cek('tanpa permintaan jaringan', jaringan.length === 0, jaringan.slice(0, 3).join(' || '));
await browser.close();
console.log(`\n${hasil.filter(Boolean).length} dari ${hasil.length} lulus`);
process.exit(hasil.every(Boolean) ? 0 : 1);
