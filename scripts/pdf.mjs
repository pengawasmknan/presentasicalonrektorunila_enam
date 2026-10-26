/**
 * Cadangan PDF: lima slide, satu halaman 16:9 (1920x1080) per slide, teks tetap teks.
 * Slide dibuka dalam mode tanpa gerak (semua animasi mati, angka di nilai akhir), dock disembunyikan.
 * Setelah dibuat, PDF dibuka lagi dengan pdf.js: jumlah halaman, teks yang bisa dicari, dan kemiripan tiap halaman
 * dengan potret webnya diperiksa (shots/pdf-*.png).
 */
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
import { bukaTumpuk, luncurkan, nyalakanServer, potretSlide } from './lib.mjs';

const KELUAR = 'cadangan/mode-panggung.pdf';
mkdirSync('cadangan', { recursive: true });
mkdirSync('shots', { recursive: true });

const { base, tutup } = await nyalakanServer();
const browser = await luncurkan();
const { ctx, page } = await bukaTumpuk(browser, base);
const web = await potretSlide(page);
await page.emulateMedia({ media: 'print' });
const pdf = await page.pdf({ width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
writeFileSync(KELUAR, pdf);
await ctx.close();
console.log(`Menulis ${KELUAR} (${(pdf.length / 1024).toFixed(0)} KB)`);

// ---------- baca ulang dengan pdf.js di Chrome ----------
const pdfjs = resolve('node_modules/pdfjs-dist/build');
const berkas = { '/pdf.mjs': [`${pdfjs}/pdf.min.mjs`, 'text/javascript'], '/pdf.worker.mjs': [`${pdfjs}/pdf.worker.min.mjs`, 'text/javascript'], '/doc.pdf': [resolve(KELUAR), 'application/pdf'], '/': [null, 'text/html'] };
const srv = createServer((req, res) => {
  const e = berkas[req.url ?? '/'];
  if (!e) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': e[1] });
  res.end(e[0] ? readFileSync(e[0]) : '<!doctype html><canvas id="c"></canvas>');
});
await new Promise((r) => srv.listen(0, 'localhost', r));
const port = srv.address().port;
const p2 = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await p2.goto(`http://localhost:${port}/`);
const info = await p2.evaluate(async () => {
  const pdfjsLib = await import('/pdf.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
  const doc = await pdfjsLib.getDocument('/doc.pdf').promise;
  const halaman = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const pg = await doc.getPage(i);
    const vp1 = pg.getViewport({ scale: 1 });
    const vp = pg.getViewport({ scale: 1920 / vp1.width });
    const c = document.getElementById('c');
    c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    const teks = (await pg.getTextContent()).items.map((t) => t.str).join(' ');
    halaman.push({ lebar: vp1.width, tinggi: vp1.height, teks, png: c.toDataURL('image/png') });
  }
  return { n: doc.numPages, halaman };
});
srv.close();
await p2.close();

let semuaLulus = true;
const lapor = (ok, t) => { if (!ok) semuaLulus = false; console.log(`${ok ? 'LULUS' : 'GAGAL'}  ${t}`); };
lapor(info.n === 5, `PDF berisi ${info.n} halaman`);
// pdf.js memecah teks berjarak huruf negatif per glyph, jadi spasi diabaikan saat mencocokkan.
const kunci = ['Ekosistem Hilirisasi Inovasi', 'Masa bakti', 'Empat misi', 'Langkah dan angka kunci'];
kunci.forEach((k, i) => lapor((info.halaman[i]?.teks.replace(/\s+/g, '') ?? '').includes(k.replace(/\s+/g, '')), `halaman ${i + 1} memuat teks yang bisa dicari: "${k}"`));
lapor(info.halaman.every((h) => Math.abs(h.lebar / h.tinggi - 16 / 9) < 0.01), 'semua halaman 16:9');
for (let i = 0; i < info.halaman.length; i++) {
  const png = Buffer.from(info.halaman[i].png.split(',')[1], 'base64');
  writeFileSync(`shots/pdf-${i + 1}.png`, png);
  writeFileSync(`shots/web-${i + 1}.png`, web[i]);
  const a = await sharp(png).resize(1920, 1080).removeAlpha().greyscale().raw().toBuffer();
  const b = await sharp(web[i]).removeAlpha().greyscale().raw().toBuffer();
  let jumlah = 0, besar = 0;
  for (let k = 0; k < a.length; k++) { const d = Math.abs(a[k] - b[k]); jumlah += d; if (d > 40) besar++; }
  const rerata = jumlah / a.length;
  lapor(rerata < 3 && besar / a.length < 0.02, `halaman ${i + 1} mirip potret web (selisih rerata ${rerata.toFixed(2)}/255, piksel beda besar ${(besar / a.length * 100).toFixed(2)}%)`);
}
await browser.close();
await tutup();
process.exit(semuaLulus ? 0 : 1);
