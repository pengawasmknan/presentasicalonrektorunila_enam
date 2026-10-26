# Mode Panggung, Prof. Anna Gustina Zainal

Web mandiri untuk debat Bakal Calon Rektor Universitas Lampung 2027–2031: lima slide layar penuh, total bicara sekitar tujuh menit. Terpisah dari dasbor `unila-impact-dashboard`. Seluruh antarmuka berbahasa Indonesia.

Slide 1 (Cover) dan slide 5 (Penutup) adalah salinan persis adegan pertama dan terakhir Mode Panggung dasbor. Slide 2 (Landasan), 3 (Strategi dan program unggulan), dan 4 (Langkah dan angka kunci) dibuat khusus.

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

Alamat `#/1` sampai `#/5` membuka slide yang sesuai. Dock navigasi di bawah muncul saat ada gerakan lalu menghilang sendiri. Di layar sempit (≤ 960 px) atau saat sistem meminta gerak dikurangi, slide ditumpuk ke bawah dan tidak memakai animasi sematan.

Penghitung waktu mulai berjalan saat slide 1 pertama kali digeser dan menghitung mundur dari 7:00. Panel catatan tidak ikut tercetak ke PDF dan tidak tampil sebelum tombol N ditekan.

## Mengubah isi slide

Semua isi ada di [`src/data/narasi.ts`](src/data/narasi.ts):

- `VISI`, `TAGLINE`, `RPJP`, `MISI`, `STRATEGI`: teks slide 2 dan 3.
- `PROGRAM`: 13 program unggulan (label pendek di diagram, kalimat narasi lengkap di `penuh`, serta misi dan strateginya).
- `KARTU`: empat kartu slide 4. `ANGKA` menyimpan angka kunci beserta sumbernya.
- `SLIDE`: judul, `durasi` (detik), dan `catatan` pembicara tiap slide. Total durasi harus 420 detik.

Istilah asing dicetak miring otomatis lewat daftar di [`src/lib/ital.tsx`](src/lib/ital.tsx); tambahkan istilah baru di sana. Tampilan slide 2–4 ada di `src/slides/`, gayanya di `src/styles/app.css`. Judul slide 3 dihitung dari panjang larik data, jadi menambah program unggulan otomatis mengubah "tiga belas". Slide 1 dan 5 (`src/slides/SalinanDashboard.tsx`) tidak boleh diubah.

Setelah mengubah data, jalankan `npm test`.

## Pengujian dan cadangan

```bash
npm test           # vitest: data, angka, tanda pisah panjang, durasi
npm run typecheck
npm run qa         # Playwright + Chrome sistem; potret ke shots/
npm run pdf        # cadangan/mode-panggung.pdf
npm run pptx       # cadangan/mode-panggung.pptx
```

`npm run qa`, `pdf`, dan `pptx` menyalakan server Vite sendiri (port 5199) dan memakai Chrome di `/Applications/Google Chrome.app`; ubah dengan `CHROME=/jalur/chrome`. Chrome dijalankan dengan `--headless=old` karena mode headless baru macet saat memotret halaman ber-`backdrop-filter` di mesin ini; setel `HEADLESS_BARU=1` untuk mencoba mode baru.

Bila dasbor menyala di `http://localhost:5173` (atau alamat dari `DASH`), `npm run qa` juga membandingkan slide 1 dan 5 dengan adegan pertama dan terakhir dasbor, piksel demi piksel pada 1920×1080.

Cadangan dibuat dari tampilan web yang sama: PDF satu halaman 1920×1080 per slide dengan teks yang bisa dicari; PPTX berisi satu gambar penuh per slide dan catatan pembicara dari `catatan`. Keduanya disimpan di `cadangan/` dan ikut di-commit. Buat ulang setiap kali isi slide berubah.

## Deploy ke Vercel

Hubungkan repositori GitHub ini ke Vercel sebagai proyek Vite:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Routing memakai hash (`#/3`) dan `base: './'`, jadi tidak perlu aturan rewrite.
