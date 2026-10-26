/**
 * Cadangan PPTX: empat slide 16:9, masing-masing satu gambar PNG penuh (potret web 1920x1080, animasi selesai, dock
 * disembunyikan) dengan catatan pembicara dari `catatan` di src/data/narasi.ts. Tidak ada teks atau gambar lain.
 * Setelah dibuat, berkas dibuka lagi (JSZip): jumlah slide, urutan, gambar sama dengan potret web, dan catatan terisi.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import JSZip from 'jszip';
import PptxGenJS from 'pptxgenjs';
import { bukaTumpuk, luncurkan, nyalakanServer, potretSlide } from './lib.mjs';
import { SLIDE } from '../src/data/narasi.ts';

const KELUAR = 'cadangan/mode-panggung.pptx';
mkdirSync('cadangan', { recursive: true });
mkdirSync('shots', { recursive: true });

const { base, tutup } = await nyalakanServer();
const browser = await luncurkan();
const { ctx, page } = await bukaTumpuk(browser, base);
const foto = await potretSlide(page);
await ctx.close();
await browser.close();
await tutup();

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13,333 x 7,5 inci = 16:9
pptx.title = 'Mode Panggung, Prof. Anna Gustina Zainal';
SLIDE.forEach((s, i) => {
  writeFileSync(`shots/pptx-sumber-${s.no}.png`, foto[i]);
  const sl = pptx.addSlide();
  sl.addImage({ data: `image/png;base64,${foto[i].toString('base64')}`, x: 0, y: 0, w: 13.3333, h: 7.5, altText: `Slide ${s.no}: ${s.judul}` });
  sl.addNotes(s.catatan);
});
await pptx.writeFile({ fileName: KELUAR });
console.log(`Menulis ${KELUAR}`);

// ---------- buka lagi dan periksa ----------
let semuaLulus = true;
const lapor = (ok, t) => { if (!ok) semuaLulus = false; console.log(`${ok ? 'LULUS' : 'GAGAL'}  ${t}`); };
const zip = await JSZip.loadAsync(readFileSync(KELUAR));
const urut = (n) => Number(n.match(/(\d+)\.xml$/)[1]);
const slideXml = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => urut(a) - urut(b));
lapor(slideXml.length === 4, `PPTX berisi ${slideXml.length} slide`);
const pres = await zip.file('ppt/presentation.xml').async('string');
const sz = pres.match(/<p:sldSz cx="(\d+)" cy="(\d+)"/);
lapor(!!sz && Math.abs(Number(sz[1]) / Number(sz[2]) - 16 / 9) < 0.01, `ukuran slide ${sz?.[1]} x ${sz?.[2]} EMU (16:9)`);
const norm = (t) => t.replace(/\s+/g, ' ').trim();
for (let i = 0; i < slideXml.length; i++) {
  const nama = slideXml[i];
  const no = urut(nama);
  const xml = await zip.file(nama).async('string');
  const rels = await zip.file(`ppt/slides/_rels/slide${no}.xml.rels`).async('string');
  const gambar = [...xml.matchAll(/<p:pic>/g)].length;
  const teksSlide = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]).join('');
  lapor(gambar === 1 && teksSlide === '', `slide ${i + 1}: satu gambar, tanpa teks lain`);
  const off = xml.slice(xml.indexOf("<p:pic>")).match(/<a:off x="(\d+)" y="(\d+)"\/>\s*<a:ext cx="(\d+)" cy="(\d+)"/);
  lapor(!!off && off[1] === '0' && off[2] === '0' && Math.abs(Number(off[3]) - Number(sz?.[1])) < 1000 && Math.abs(Number(off[4]) - Number(sz?.[2])) < 1000, `slide ${i + 1}: gambar menutup penuh slide (selisih di bawah 0,001 inci)`);
  const media = rels.match(/Target="\.\.\/media\/([^"]+)"/)?.[1];
  const bytes = await zip.file(`ppt/media/${media}`).async('nodebuffer');
  const sha = (b) => createHash('sha256').update(b).digest('hex');
  lapor(sha(bytes) === sha(foto[i]), `slide ${i + 1}: gambar sama dengan potret web slide ${i + 1}`);
  const nrel = rels.match(/Target="\.\.\/notesSlides\/(notesSlide\d+\.xml)"/)?.[1];
  const nx = nrel ? await zip.file(`ppt/notesSlides/${nrel}`).async('string') : '';
  const catatan = [...nx.replace(/<a:fld[\s\S]*?<\/a:fld>/g, '').matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]).join(' ').replace(/&amp;/g, '&');
  lapor(norm(catatan) === norm(SLIDE[i].catatan), `slide ${i + 1}: catatan pembicara terisi dan sama dengan narasi (${norm(catatan).length} karakter)`);
}
process.exit(semuaLulus ? 0 : 1);
