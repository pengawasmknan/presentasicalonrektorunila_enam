# Keputusan

Materi program untuk debat, bukan produk resmi Universitas Lampung. Isi slide bersumber dari `Narasi_Presentasi_Prof_Anna_Debat_Rektor.docx`.

## Isi dan istilah

- Istilah resmi: empat misi, enam strategi, tiga belas program unggulan. Di dasbor, "program unggulan" berarti enam strategi dan "action plan" berarti enam belas butir; di web ini namanya digeser sesuai narasi (strategi dan program unggulan).
- Dua koreksi atas docx: target PNBP 2029 Rp650 miliar (docx menyebut Rp750 miliar) dan 13 program unggulan (docx menyebut 16). Keduanya sudah berlaku di `catatan`.
- Frasa "dengan nomor urut 6" pada narasi slide 1 tidak dimasukkan ke catatan, karena web ini tidak memuat nomor urut calon di mana pun.
- Pemetaan 13 program unggulan ke misi dan strategi mengikuti tabel dari pemilik materi dan dipakai apa adanya (misalnya 02.3 Studi Lanjut Tendik ke Misi 1, 02.4 Anggaran Kemahasiswaan ke Misi 3).
- Angka posisi April 2026 (dosen S3 36%, Guru Besar 166 dari 1.418 dosen atau 11,7%) dan keterangan pendapatan yang masih bertumpu pada UKT tidak ditampilkan di slide, atas arahan pemilik materi: slide hanya memuat target dan langkah. Angka itu tetap ada di narasi lisan (`catatan`) dan di `GURU_BESAR` untuk tes. Angka ini mengikuti narasi, sedangkan dasbor memakai 1.351 dosen dari myUnila (19 Okt 2026); keduanya sengaja tidak disamakan diam-diam.
- Pusat penelitian ditulis sebagai contoh (narasi memakai kata "misalnya"), tanpa menyebut jumlah.
- (Diganti, lihat bagian terakhir) Catatan slide 3 dan 4 lama memuat strategi 1 dan strategi 2 sampai 6; durasi lama 45, 105, 105, 120, 45 detik.

## Tampilan dan gerak

- Latar putih, aksen `#1e90ff`, teks biru di atas putih memakai `--accent-ink` `#0a6ad6`. Tanpa latar gelap, emas, kuning, atau oranye.
- Slide 1 dan 5 disalin dari `Panggung.tsx` dasbor tanpa perubahan. Perbandingan 1920×1080 dengan adegan pertama dan terakhir dasbor menghasilkan nol piksel berbeda. Agar itu terjadi, aturan `body` dasbor (`-webkit-font-smoothing: antialiased`, `letter-spacing: -0.008em`, ukuran 15 px) ikut disalin.
- Font: dasbor memakai tumpukan font sistem (SF di perangkat Apple), bukan Instrument Sans. Agar slide 1 dan 5 identik, Instrument Sans tidak dimuat; paketnya tetap ada di `package.json` sesuai rencana.
- Gerak mengikuti keputusan Mode Panggung dasbor (skill animation-systems jalur Apple dengan batas baseline-ui, serta gsap-scrolltrigger-storytelling): GSAP ScrollTrigger dengan pin dan scrub 0,3, hanya `transform` dan `opacity`, panah, spasi, Home, End, titik navigasi, dock yang muncul saat ada gerakan lalu hilang, mode tumpuk untuk layar sempit dan `prefers-reduced-motion`, kaca dengan alternatif `prefers-reduced-transparency`.
- Perbedaan dengan dasbor: animasi masuk memakai atribut `data-masuk`, bukan kelas `.cerita-teks` dan `.cerita-visual`. Semua tween dijadwalkan selesai paling lambat di waktu slide itu (durasi timeline tepat N-1); di dasbor tween slide berikutnya masih berjalan saat slide diam, sehingga slide terlihat sedikit pudar bila jumlah slide kecil. Angka besar di slide 4 naik dari nol saat slide itu aktif (satu momen utama).
- Slide 3: diagram mengukur tinggi wadahnya lewat `ResizeObserver`. Teks program unggulan minimal 22 px di 1920×1080 dan 15 px di 1280×720 (`max(15px, min(1.146vw, 2.04vh))`). Di bawah 861 px lebar, diagram diganti daftar bertingkat per strategi.
- Cadangan PDF dan PPTX dibuat dari mode tumpuk (gerak dimatikan) pada 1920×1080 supaya sama dengan tampilan web.
- Chrome QA dijalankan dengan `--headless=old`: dengan headless baru, pemotretan halaman ber-`backdrop-filter` macet di mesin ini.

## Sinkron dengan PPT_DEBAT_REKTOR_PROF_ANNA_261026 (26 Okt 2026)

PPT ini sumber kebenaran untuk teks; web tetap berbentuk Mode Panggung. Perubahan terhadap keputusan di atas:

- **Empat slide.** Slide "Langkah dan angka kunci" dihapus (tidak ada di PPT). Durasi 30, 105, 225, 75 detik (total 435, sekitar 7:15). Angkanya pindah ke catatan pembicara slide 3: S3 50% dan Guru Besar 15–20% (target 2029), posisi April 2026 (S3 36%, Guru Besar 166 dari 1.418 dosen = 11,7%), 1 Dosen 1 Penelitian sekitar Rp35 M bertahap, kemahasiswaan 10% PAGU, target PNBP Rp650 M, dan contoh pusat penelitian. Angka posisi tetap tidak tampil di slide.
- **Catatan.** Slide 1 dan 4 memakai catatan PPT apa adanya, termasuk pengingat "nomor urut masih tempat kosong". Itu hanya catatan pembicara; tidak ada nomor urut di teks slide. Slide 2 dan 3 tetap memakai narasi docx dengan dua koreksi (Rp650 miliar, 13 program unggulan).
- **Cover** mengikuti slide 1 PPT: "Universitas Lampung" biru dan "Impactful for Leading" miring oranye `#F98513`, blok "Visi 2027-2031", tanpa nomor urut. Ini mengganti keputusan lama (slogan biru, tanpa oranye); PPT yang diikuti. Cover tidak lagi identik dengan adegan pertama dasbor. Penutup (slide 4) juga memakai slogan oranye seperti di PPT; sebelum perubahan ini, slide 1 dan 5 pernah diuji identik piksel dengan dasbor (0 piksel berbeda).
- **Slide 2** mengikuti urutan PPT: kicker "Landasan", judul "Dari Peta Besar RPJP Menuju Agenda Lima Tahun", pita masa bakti dan empat tahap RPJP (Tahap III dan IV abu-abu), kartu "Visi Besar Universitas Lampung 2045" (`visiBesar2045`), pita biru muda "Visi 2027-2031", dan empat misi bernomor. Kalimat keterangan "Masa bakti 2027–2031 jatuh di pergantian ..." dan pita tagline dihapus dari slide; isinya ada di catatan. Teks pita "MASA BAKTI REKTOR 2027-2031: TITIK TRANSISI TAHAP I → II" dibagi dua: bagian pertama di dalam penanda (10% sampai 35% sumbu, rumus `Rpjp` tidak diubah), bagian kedua di sebelah kanannya, karena satu kalimat penuh tidak muat di penanda sepanjang 25% sumbu.
- **Slide 3**: diagram tidak diubah; hanya label program unggulan (Title Case seperti PPT, termasuk kapitalisasi tidak konsisten di 02.1, 02.4, dan 05.1) dan judul ("Enam Strategi dan Tiga Belas Program Unggulan", dihitung dari data). Kicker dan label kecil memakai huruf kapital berjarak lebar. Logo Unila dan Diktisaintek di kanan atas serta baris "Rancangan Strategis Kepemimpinan Unila 2027–2031 · ..." di bawah ditambahkan di slide 2 dan 3 seperti di PPT. Subjudul "Setiap program unggulan melayani satu misi dan satu strategi" dipertahankan walau tidak ada di PPT.
- **Font**: tetap font yang sudah dipakai (font sistem), atas arahan pemilik materi; Be Vietnam Pro tidak dipasang. Hierarki tebal dan tipis mengikuti PPT (judul dan label bobot 800, label program bobot biasa, nomor program tebal biru).
- Latar tapis samar (opasitas 2%) di slide 2 dan 3 PPT tidak dibawa; slide web tetap putih polos.

## Revisi label program unggulan (tulisan tangan Bu Anna)

Label 02.2, 03.1, 04.1, 04.2, dan 05.1 diganti sesuai revisi (04.2 kini memuat RSPTN; 05.1 menyebut luaran dosen: Paten/HAKI, Jurnal, Buku, dan Pengabdian). Pemetaan misi dan strategi serta jumlah 13 tidak berubah. Rujukan font 'Be Vietnam Pro' dan 'Inter' di CSS dihapus; semua teks memakai font yang sama dengan bagian web lain. Kapitalisasi 02.1, 02.4 mengikuti PPT dan belum diseragamkan.

## Berkas HTML mandiri (26 Okt 2026)

- Tambahan, bukan pengganti: web Vercel dan cadangan PDF/PPTX tetap ada. Berkas `cadangan/Panggung-Prof-Anna.html` (sekitar 3 MB) dibuat lewat `npm run html`.
- Satu berkas tanpa jaringan: semua JS (skrip klasik, bukan modul, supaya jalan dari file://), CSS, gambar, dan font ditanam. Tidak ada CDN, Google Fonts, analitik, atau service worker. Diuji offline (`npm run qa:mandiri`) di 1920×1080, 1440×810, dan 1280×720.
- Font: Instrument Sans (paket yang sudah terpasang), latin dan latin-ext, dimuat lewat `main.tsx`. Tidak ada font baru. Ini mengubah font web juga (sebelumnya font sistem, SF di Mac), supaya tampilan sama di laptop mana pun.
- Aset dipindah dari `public/` ke `src/assets/pptx/` agar Vite menanamnya. Ikon tab memakai impor yang sama.
- Tombol `?` menampilkan daftar tombol. Geser kiri/kanan di layar sentuh untuk pindah slide.
- Sumber slide 2 dan 3 dipindah ke kiri bawah dengan lebar terbatas agar tidak tertutup dock navigasi di 1920×1080.
- Cetak (Ctrl/Cmd+P) menghasilkan 4 halaman; diuji lewat Playwright.
- Belum diuji di Safari: Playwright WebKit tidak terpasang di mesin ini. Perlu uji manual di Safari sebelum dikirim ke penerima.
