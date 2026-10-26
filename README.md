# Mode Panggung, Prof. Anna Gustina Zainal

Web mandiri untuk debat Bakal Calon Rektor Universitas Lampung 2027–2031: empat slide layar penuh, total bicara sekitar tujuh menit (7:15). Terpisah dari dasbor `unila-impact-dashboard`. Seluruh antarmuka berbahasa Indonesia.

Isi dan urutan slide mengikuti `PPT_DEBAT_REKTOR_PROF_ANNA_261026.pptx`: 1 Cover, 2 Landasan, 3 Strategi dan Program Unggulan, 4 Penutup. Mesin Mode Panggung (animasi, navigasi) dipindahkan dari dasbor.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit lalu vite build, hasil di dist/
npm run preview    # menyajikan dist/
```

Folder ini berada di iCloud. Agar iCloud tidak menyinkronkan puluhan ribu berkas, `node_modules` dibuat sebagai tautan simbolik ke `node_modules.nosync`:

```bash
mkdir node_modules.nosync && ln -s node_modules.nosync node_modules && npm install
```

## Kendali saat tampil

| Tombol | Fungsi |
|---|---|
| ← → ↑ ↓, Spasi, PageUp, PageDown | Slide sebelumnya atau berikutnya |
| Home, End | Slide pertama atau terakhir |
| F | Masuk atau keluar layar penuh |
| Esc | Keluar dari layar penuh |
| N | Panel catatan pembicara dan penghitung waktu 7:00 |

Alamat `#/1` sampai `#/4` membuka slide yang sesuai. Dock navigasi di bawah muncul saat ada gerakan lalu menghilang sendiri. Di layar sempit (≤ 960 px) atau saat sistem meminta gerak dikurangi, slide ditumpuk ke bawah dan tidak memakai animasi sematan.

Penghitung waktu mulai berjalan saat slide 1 pertama kali digeser dan menghitung mundur dari 7:00. Panel catatan tidak ikut tercetak ke PDF dan tidak tampil sebelum tombol N ditekan.

## Mengubah isi slide

Semua isi ada di [`src/data/narasi.ts`](src/data/narasi.ts):

- `VISI`, `TAGLINE`, `RPJP`, `MISI`, `STRATEGI`: teks slide 1, 2, dan 3.
- `PROGRAM`: 13 program unggulan (label pendek di diagram, kalimat narasi lengkap di `penuh`, serta misi dan strateginya).
- `visiBesar2045`, `VISI_PENDEK`: kutipan slide 2. `ANGKA` menyimpan angka kunci beserta sumbernya; angka itu tampil hanya di catatan pembicara slide 3.
- `SLIDE`: judul, `durasi` (detik), dan `catatan` pembicara tiap slide. Total durasi harus 435 detik. Catatan slide 1 dan 4 berasal dari catatan PPT; slide 2 dan 3 dari narasi docx.

Istilah asing dicetak miring otomatis lewat daftar di [`src/lib/ital.tsx`](src/lib/ital.tsx); tambahkan istilah baru di sana. Tampilan slide ada di `src/slides/`, gayanya di `src/styles/app.css`. Judul slide 3 dihitung dari panjang larik data, jadi menambah program unggulan otomatis mengubah "tiga belas". 

Setelah mengubah data, jalankan `npm test`.

## Pengujian dan cadangan

```bash
npm test           # vitest: data, label sesuai PPT, tanda pisah panjang, durasi
npm run typecheck
npm run qa         # Playwright + Chrome sistem; potret ke shots/
npm run pdf        # cadangan/mode-panggung.pdf
npm run pptx       # cadangan/mode-panggung.pptx
```

`npm run qa`, `pdf`, dan `pptx` menyalakan server Vite sendiri (port 5199) dan memakai Chrome di `/Applications/Google Chrome.app`; ubah dengan `CHROME=/jalur/chrome`. Chrome dijalankan dengan `--headless=old` karena mode headless baru macet saat memotret halaman ber-`backdrop-filter` di mesin ini; setel `HEADLESS_BARU=1` untuk mencoba mode baru.

Cadangan dibuat dari tampilan web yang sama: PDF empat halaman 1920×1080 dengan teks yang bisa dicari; PPTX berisi satu gambar penuh per slide dan catatan pembicara dari `catatan`. Keduanya disimpan di `cadangan/` dan ikut di-commit. Buat ulang setiap kali isi slide berubah.

## Deploy ke Vercel

Hubungkan repositori GitHub ini ke Vercel sebagai proyek Vite:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Routing memakai hash (`#/3`) dan `base: './'`, jadi tidak perlu aturan rewrite.

## Berkas HTML mandiri (tanpa internet, tanpa server)

```bash
npm run html
```

Menghasilkan `cadangan/Panggung-Prof-Anna.html` (sekitar 3 MB) dan menyalinnya ke folder Balrek 2027-2031. Satu berkas itu berisi seluruh kode, gambar, dan font (Instrument Sans), sehingga bisa dibuka dengan klik dua kali dari `file://`, tanpa internet, tanpa Node, dan tanpa Vercel.

- Konfigurasi terpisah: `vite.mandiri.config.ts` (memakai `vite-plugin-singlefile` yang dipatok di 2.3.3). Build Vercel (`vite.config.ts`) tidak berubah.
- `scripts/html-mandiri.mjs` memindahkan skrip ke akhir body sebagai skrip klasik (bukan modul) dan memeriksa tidak ada rujukan berkas luar atau http(s).
- `npm run qa:mandiri` menguji berkas itu secara offline (tanpa jaringan) di tiga ukuran layar: font, gambar, empat slide, navigasi, klik peta alir, N, ?, F, geser sentuh, cetak 4 halaman, dan tidak ada permintaan jaringan.
- Panduan untuk pengguna akhir: `cadangan/CARA-PAKAI.md`.
