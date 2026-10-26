# Keputusan

Materi program untuk debat, bukan produk resmi Universitas Lampung. Isi slide bersumber dari `Narasi_Presentasi_Prof_Anna_Debat_Rektor.docx`.

## Isi dan istilah

- Istilah resmi: empat misi, enam strategi, tiga belas program unggulan. Di dasbor, "program unggulan" berarti enam strategi dan "action plan" berarti enam belas butir; di web ini namanya digeser sesuai narasi (strategi dan program unggulan).
- Dua koreksi atas docx: target PNBP 2029 Rp650 miliar (docx menyebut Rp750 miliar) dan 13 program unggulan (docx menyebut 16). Keduanya sudah berlaku di `catatan`.
- Frasa "dengan nomor urut 6" pada narasi slide 1 tidak dimasukkan ke catatan, karena web ini tidak memuat nomor urut calon di mana pun.
- Pemetaan 13 program unggulan ke misi dan strategi mengikuti tabel dari pemilik materi dan dipakai apa adanya (misalnya 02.3 Studi Lanjut Tendik ke Misi 1, 02.4 Anggaran Kemahasiswaan ke Misi 3).
- Angka posisi April 2026 (dosen S3 36%, Guru Besar 166 dari 1.418 dosen atau 11,7%) dan keterangan pendapatan yang masih bertumpu pada UKT tidak ditampilkan di slide, atas arahan pemilik materi: slide hanya memuat target dan langkah. Angka itu tetap ada di narasi lisan (`catatan`) dan di `GURU_BESAR` untuk tes. Angka ini mengikuti narasi, sedangkan dasbor memakai 1.351 dosen dari myUnila (19 Okt 2026); keduanya sengaja tidak disamakan diam-diam.
- Pusat penelitian ditulis sebagai contoh (narasi memakai kata "misalnya"), tanpa menyebut jumlah.
- Catatan slide 3 memuat kalimat pembuka dan strategi 1; catatan slide 4 memuat strategi 2 sampai 6, mengikuti urutan narasi. Durasi: 45, 105, 105, 120, 45 detik (total 420).

## Tampilan dan gerak

- Latar putih, aksen `#1e90ff`, teks biru di atas putih memakai `--accent-ink` `#0a6ad6`. Tanpa latar gelap, emas, kuning, atau oranye.
- Slide 1 dan 5 disalin dari `Panggung.tsx` dasbor tanpa perubahan. Perbandingan 1920×1080 dengan adegan pertama dan terakhir dasbor menghasilkan nol piksel berbeda. Agar itu terjadi, aturan `body` dasbor (`-webkit-font-smoothing: antialiased`, `letter-spacing: -0.008em`, ukuran 15 px) ikut disalin.
- Font: dasbor memakai tumpukan font sistem (SF di perangkat Apple), bukan Instrument Sans. Agar slide 1 dan 5 identik, Instrument Sans tidak dimuat; paketnya tetap ada di `package.json` sesuai rencana.
- Gerak mengikuti keputusan Mode Panggung dasbor (skill animation-systems jalur Apple dengan batas baseline-ui, serta gsap-scrolltrigger-storytelling): GSAP ScrollTrigger dengan pin dan scrub 0,3, hanya `transform` dan `opacity`, panah, spasi, Home, End, titik navigasi, dock yang muncul saat ada gerakan lalu hilang, mode tumpuk untuk layar sempit dan `prefers-reduced-motion`, kaca dengan alternatif `prefers-reduced-transparency`.
- Perbedaan dengan dasbor: animasi masuk memakai atribut `data-masuk`, bukan kelas `.cerita-teks` dan `.cerita-visual`. Semua tween dijadwalkan selesai paling lambat di waktu slide itu (durasi timeline tepat N-1); di dasbor tween slide berikutnya masih berjalan saat slide diam, sehingga slide terlihat sedikit pudar bila jumlah slide kecil. Angka besar di slide 4 naik dari nol saat slide itu aktif (satu momen utama).
- Slide 3: diagram mengukur tinggi wadahnya lewat `ResizeObserver`. Teks program unggulan minimal 22 px di 1920×1080 dan 15 px di 1280×720 (`max(15px, min(1.146vw, 2.04vh))`). Di bawah 861 px lebar, diagram diganti daftar bertingkat per strategi.
- Cadangan PDF dan PPTX dibuat dari mode tumpuk (gerak dimatikan) pada 1920×1080 supaya sama dengan tampilan web.
- Chrome QA dijalankan dengan `--headless=old`: dengan headless baru, pemotretan halaman ber-`backdrop-filter` macet di mesin ini.
