/**
 * Langkah pasca-build untuk HTML mandiri (dijalankan setelah `vite build -c vite.mandiri.config.ts`):
 * 1. Skrip modul dipindah ke akhir <body> sebagai skrip klasik, supaya jalan dari file:// dan elemen #root sudah ada.
 * 2. Hasil disalin ke cadangan/Panggung-Prof-Anna.html dan ke folder Balrek 2027-2031.
 */
import { copyFileSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DIST = 'dist-mandiri';
const KELUAR = 'cadangan/Panggung-Prof-Anna.html';
const SALIN = '../Panggung-Prof-Anna.html';

let html = readFileSync(join(DIST, 'index.html'), 'utf8');

const BUKA = '<script type="module" crossorigin>';
const awal = html.indexOf(BUKA);
if (awal < 0) throw new Error('Skrip modul tidak ditemukan di index.html hasil build');
const isiAwal = awal + BUKA.length;
const akhir = html.indexOf('</script>', isiAwal);
const isi = html.slice(isiAwal, akhir);
if (isi.includes('</script')) throw new Error('Isi skrip memuat </script>');
// Skrip dipindah ke akhir body (sesudah #root). Posisi </body> dicari dari belakang, supaya tidak masuk ke isi skrip.
const sisa = html.slice(0, awal) + html.slice(akhir + '</script>'.length);
const tutupBody = sisa.lastIndexOf('</body>');
if (tutupBody < 0) throw new Error('Tag </body> tidak ditemukan');
html = sisa.slice(0, tutupBody) + `<script>${isi}</script>\n  ` + sisa.slice(tutupBody);

if (/\b(src|href)="(?!data:|#)[^"]+/.test(html.replace(/<script>[\s\S]*?<\/script>/g, ''))) {
  const sisa = html.match(/(src|href)="(?!data:|#)[^"]+"/g);
  throw new Error(`Masih ada referensi berkas luar: ${sisa?.slice(0, 3).join(', ')}`);
}
if (/https?:\/\//.test(html.replace(/xmlns="[^"]*"/g, '').replace(/<script>[\s\S]*?<\/script>/g, ''))) {
  throw new Error('Ada tautan http(s) di HTML');
}

// Sintaks skrip diperiksa sebagai skrip klasik (bukan modul).
const berkasJs = join(tmpdir(), `panggung-mandiri-${process.pid}.js`);
writeFileSync(berkasJs, isi);
execFileSync(process.execPath, ['--check', berkasJs]);
rmSync(berkasJs);

mkdirSync('cadangan', { recursive: true });
writeFileSync(KELUAR, html);
copyFileSync(KELUAR, SALIN);
for (const f of readdirSync(DIST)) if (f !== 'index.html') rmSync(join(DIST, f));
// Tidak boleh ada berkas sisa yang dirujuk dari HTML (sudah dicek di atas).

const mb = (statSync(KELUAR).size / 1024 / 1024).toFixed(2);
console.log(`Menulis ${KELUAR} (${mb} MB) dan ${SALIN}`);
