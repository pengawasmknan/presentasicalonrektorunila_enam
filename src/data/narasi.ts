import type { AngkaKunci, InfoSlide, KartuDetail, Misi, Program, Strategi, TahapRpjp } from './types.ts';

/**
 * Sumber tunggal isi slide: Narasi_Presentasi_Prof_Anna_Debat_Rektor.docx.
 * Dua koreksi atas teks docx: "Rp750 miliar" menjadi "Rp650 miliar" dan "16 program unggulan" menjadi "13 program unggulan".
 * Satu penyesuaian lain: frasa "dengan nomor urut 6" tidak dimasukkan ke catatan, karena web ini tidak memuat nomor urut calon.
 */
export const VISI = 'Menjadikan Universitas Lampung sebagai Ekosistem Hilirisasi Inovasi, Berdaya Saing Dunia, Berakar pada Budaya dan Kemandirian Bangsa';
export const TAGLINE = 'Impactful for Leading';

export const RPJP: TahapRpjp[] = [
  { no: 'I', tahun: '2025–2029', nama: 'Innovation Based University' },
  { no: 'II', tahun: '2030–2034', nama: 'Research Downstreaming Orientation' },
  { no: 'III', tahun: '2035–2039', nama: 'Entrepreneurial Based Innovation University' },
  { no: 'IV', tahun: '2040–2044', nama: 'Entrepreneurial with High-Tech University' },
];
export const TUGAS_REKTOR = 'Masa bakti 2027–2031 jatuh di pergantian Tahap I ke Tahap II. Tugas Rektor terpilih: menuntaskan Tahap I sambil membuka jalan hilirisasi riset pada Tahap II.';

export const MISI: Misi[] = [
  { id: 'M1', no: '01', nama: 'Penguatan Tata Kelola PTN' },
  { id: 'M2', no: '02', nama: 'Inovasi Berdampak & Hilirisasi Riset' },
  { id: 'M3', no: '03', nama: 'Jaringan dan Rekognisi Global' },
  { id: 'M4', no: '04', nama: 'Kepemimpinan Berbasis Nilai Budaya' },
];

export const STRATEGI: Strategi[] = [
  { id: 'S1', no: '01', nama: 'Penguatan Tata Kelola dan Transparansi' },
  { id: 'S2', no: '02', nama: 'Penguatan SDM dan Kinerja Penelitian' },
  { id: 'S3', no: '03', nama: 'Pusat Penelitian Berbasis Kepakaran' },
  { id: 'S4', no: '04', nama: 'Revitalisasi Laboratorium dan Pendapatan Mandiri' },
  { id: 'S5', no: '05', nama: 'Hilirisasi Tridarma untuk Semua Unsur' },
  { id: 'S6', no: '06', nama: 'Penguatan Budaya dan Kampus Nyaman' },
];

export const PROGRAM: Program[] = [
  { id: '01.1', label: 'Pengelolaan Anggaran & Perencanaan Keuangan', strategi: 'S1', misi: 'M1', butir: '1a',
    penuh: 'Pengelolaan anggaran dan perencanaan keuangan' },
  { id: '01.2', label: 'Penerimaan Mahasiswa Baru yang Transparan & Akuntabel', strategi: 'S1', misi: 'M1', butir: '1b',
    penuh: 'sistem penerimaan mahasiswa baru yang transparan, akuntabel, responsif, independen dan fairness.' },
  { id: '02.1', label: '1 Dosen 1 Penelitian secara Bertahap', strategi: 'S2', misi: 'M2', butir: '2a',
    penuh: 'Salah satu strategi yang akan kami jalankan menuju untuk membantu dosen dalam kenaikan Jabatan fungsional dan pemenuhan BKD adalah meningkatkan dana penelitian dan pengabdian (Fisip sejak 2025 sudah melakukan program 1 dosen 1 penelitian berdasarkan jabfung, dan program ini bukan tidak mungkin kita terapkan di Universitas secara bertahap, dengan jumlah dosen Unila saat ini kita memerlukan dana sekitar 35 M),' },
  { id: '02.2', label: 'Innovation Based University: Riset sampai Hilirisasi', strategi: 'S2', misi: 'M2', butir: '2b',
    penuh: 'Innovation based university, dimana hasil riset dosen tidak hanya berhenti di dokumen laporan penelitian dan artikel, namun di hilirisasi yang dapat digunakan oleh pemerintah, DUDI, khalayak atau masyarakat.' },
  { id: '02.3', label: 'Studi Lanjut & Sertifikasi Kompetensi Tendik', strategi: 'S2', misi: 'M1', butir: '2c',
    penuh: 'Untuk tendik pengembangan SDM juga akan diberikan kesempatan yang melalui studi lanjut dan pelatihan sertifikasi kompetensi yang relevan.' },
  { id: '02.4', label: 'Anggaran Kemahasiswaan 10% PAGU', strategi: 'S2', misi: 'M3', butir: '2d',
    penuh: 'Di kemahasiswaan kita akan mendudukan anggaran 10% dari PAGU secara bertahap, sehingga kegiatan student mobility, pemberian bantuan modal kewirausahaan dengan output NIB (Nomor Induk Berwirausaha), dan persiapan karir lulusan bagi para yudisium.' },
  { id: '03.1', label: 'Pusat Penelitian dari Kepakaran Dosen', strategi: 'S3', misi: 'M3', butir: '3a',
    penuh: 'Pusat penelitian dibentuk berdasarkan optimalisasi penelitian kerjasama baik nasional maupun internasional sebagai basic pengembangan kepakaran dosen yang ada misalnya Puslit Sawit, Cassava, Kopi, Anggrek, Robotik, Kebencanaan, Ketahanan pangan, mangrove, Perempuan dan anak serta Resolusi Konflik)' },
  { id: '04.1', label: 'Revitalisasi Bisnis Laboratorium Terpadu (LTSIT)', strategi: 'S4', misi: 'M1', butir: '4a',
    penuh: 'Meneruskan Program Revitalisasi Perguruan Tinggi (PRPTN) melalui revitalisasi tata kelola bisnis Laboratorium Terpadu & Sentra Inovasi Teknologi (LTSIT), untuk memastikan ketersediaan dana untuk pengembangan dan operasional Laboratorium agar menghasilkan pendapatan (revenue generate activity),' },
  { id: '04.2', label: 'Optimalisasi Aset: Balai Bahasa, CCED, Puskom, Olahraga', strategi: 'S4', misi: 'M1', butir: '4b',
    penuh: 'Memastikan balai bahasa, CCED, Puskom, fasilitas olahraga dan pemanfaatan aset-aset Unila lainnya baik yang ada di kampus utama diluar kampus utama secara optimal.' },
  { id: '05.1', label: 'Hilirisasi Karya Dosen: Penelitian, Pendidikan, Pengabdian', strategi: 'S5', misi: 'M2', butir: '5a',
    penuh: 'Hilirisasi ini hendaknya tidak hanya difokuskan pada hasil penelitian tetapi juga pada karya-karya dosen berkaitan dengan bidang pendidikan dan pengabdian.' },
  { id: '06.1', label: 'Identitas Kampus: Nama Gedung dan Jalan dari Tokoh Lampung', strategi: 'S6', misi: 'M4', butir: '6a',
    penuh: 'Menguatkan budaya melalui identitas kampus yang jelas, penamaan Gedung dan Jalan di dalam kampus mengacu pada tokoh pendiri Unila dan Lampung.' },
  { id: '06.2', label: 'SDGs, Green Metric, dan Kampus Ramah Semua', strategi: 'S6', misi: 'M4', butir: '6b',
    penuh: 'Dalam mewujudkan kampus yang nyaman, Penguatan SDGs dan Green Metric, menjadi prioritas dalam penyelenggaraan Tridharma. Terkait SDGs di FISIP kami sudah menjawab beberapa kebutuhan mahasiswa termasuk makan siang gratis ketika PKKMB, kemudahan akses bagi kaum disabilitas, dan ketersedian peminjaman laptop bagi mahasiswa tingkat akhir skripsi.' },
  { id: '06.3', label: 'Konseling dan Pencegahan Kekerasan', strategi: 'S6', misi: 'M4', butir: '6c',
    penuh: 'Konseling bagi dosen, tendik dan mahasiswa disediakan bukan hanya bagi korban tetapi dalam rangka pencegahan tindak kekerasan di dalam kampus.' },
];

export const PUSAT_PENELITIAN = ['Sawit', 'Cassava', 'Kopi', 'Anggrek', 'Robotik', 'Kebencanaan', 'Ketahanan Pangan', 'Mangrove', 'Perempuan dan Anak', 'Resolusi Konflik'];

const SUMBER_NARASI = 'Narasi Presentasi Prof. Anna, slide Strategi dan Program Unggulan';
/** Posisi April 2026 hanya dipakai di catatan pembicara dan tes; tidak ditampilkan di slide (keputusan pemilik materi). */
export const GURU_BESAR = { jumlah: 166, dosen: 1418, per: 'April 2026' };
export const ANGKA: AngkaKunci[] = [
  { id: 'dosen-s3', label: 'Target dosen S3', nilai: 50, satuan: '%', keterangan: 'target Renstra 2029', sumber: SUMBER_NARASI },
  { id: 'guru-besar', label: 'Target Guru Besar', nilai: 20, satuan: '%', keterangan: 'target Renstra 2029 sebesar 15–20%', sumber: SUMBER_NARASI },
  { id: 'dana-1d1p', label: 'Dana 1 Dosen 1 Penelitian tingkat universitas', nilai: 35, satuan: 'miliar rupiah', keterangan: 'sekitar Rp35 miliar; FISIP menjalankannya sejak 2025', sumber: SUMBER_NARASI },
  { id: 'kemahasiswaan', label: 'Anggaran kemahasiswaan', nilai: 10, satuan: '% PAGU', keterangan: 'bertahap', sumber: SUMBER_NARASI },
  { id: 'pnbp', label: 'Target PNBP 2029', nilai: 650, satuan: 'miliar rupiah', keterangan: 'keputusan tim; narasi lisan menyebut Rp750 miliar', sumber: `${SUMBER_NARASI} (dikoreksi tim menjadi Rp650 miliar)` },
];

export const persenGuruBesar = (): number => Math.round((GURU_BESAR.jumlah / GURU_BESAR.dosen) * 1000) / 10;
export const koma = (n: number): string => String(n).replace('.', ',');

export const KARTU: KartuDetail[] = [
  {
    strategi: 'S2',
    angka: { besar: '50% S3 · 15–20% Guru Besar', label: 'target Renstra 2029' },
    poin: [
      '1 Dosen 1 Penelitian berdasarkan jabatan fungsional, bertahap di tingkat universitas. Kebutuhan dana sekitar Rp35 M; FISIP sudah menjalankannya sejak 2025.',
      'Hasil riset berlanjut ke hilirisasi bagi pemerintah, DUDI, dan masyarakat.',
      'Tendik mendapat studi lanjut dan sertifikasi kompetensi.',
      'Kemahasiswaan 10% PAGU, bertahap, untuk student mobility, modal kewirausahaan dengan luaran NIB, dan persiapan karier lulusan.',
    ],
  },
  {
    strategi: 'S3',
    kalimat: 'Pusat dibentuk dari kerja sama penelitian nasional dan internasional serta kepakaran dosen yang sudah ada. Contohnya:',
    poin: [],
    chip: PUSAT_PENELITIAN,
  },
  {
    strategi: 'S4',
    angka: { besar: 'Rp650 M', label: 'target PNBP 2029' },
    poin: [
      'PRPTN diteruskan lewat tata kelola bisnis LTSIT, agar laboratorium menghasilkan pendapatan (revenue generating activity).',
      'Balai Bahasa, CCED, Puskom, fasilitas olahraga, dan aset lain dimanfaatkan optimal, di kampus utama maupun di luar.',
    ],
  },
  {
    strategi: 'S6',
    poin: [
      'Identitas kampus lewat nama gedung dan jalan dari tokoh pendiri Unila dan Lampung.',
      'SDGs dan Green Metric jadi prioritas tridharma. Di FISIP sudah ada makan siang gratis saat PKKMB, akses bagi penyandang disabilitas, dan peminjaman laptop untuk mahasiswa skripsi.',
      'Konseling untuk dosen, tendik, dan mahasiswa, juga untuk mencegah kekerasan di kampus.',
    ],
  },
];

const bersih = (t: string): string => t.replace(/[ \t]{2,}/g, ' ').replace(/ ,/g, ',').trim();

const C1 = bersih(`Bapak dan Ibu sekalian, salam sejahtera. Saya Anna Gustina Zainal, Guru Besar bidang Komunikasi Pembangunan dan Budaya. Hari ini saya hadir sebagai bakal calon Rektor Universitas Lampung periode 2027-2031. Membawa visi Universitas Lampung sebagai Ekosistem Hilirisasi Inovasi, berdaya saing dunia, dan berakar pada budaya dan kemandirian bangsa.`);

const C2 = bersih(`Sebelum masuk ke program, izinkan saya menyampaikan RPJP Unila 2025-2045, dimulai dari Innovation Based University pada 2025-2029, dilanjutkan Research Downstreaming Orientation pada 2030-2034, kemudian Entrepreneurial Based Innovation University pada 2035-2039, dan ditutup Entrepreneurial with High-Tech University pada 2040-2044. Masa bakti 2027-2031 jatuh tepat di titik pergantian dari Tahap I ke Tahap II. Tugas Rektor terpilih adalah menuntaskan Tahap I sambil membuka jalan bagi hilirisasi riset pada Tahap II.

Untuk mencapai hal tersebut melalui visi saya Universitas Lampung sebagai Ekosistem Hilirisasi Inovasi, berdaya saing dunia, dan berakar pada budaya dan kemandirian bangsa, maka telah dirumuskan 4 misi. Pertama: penguatan tata kelola PTN. Kedua, inovasi berdampak dan hilirisasi riset, disusul jaringan dan rekognisi global, dan kepemimpinan berbasis nilai budaya.`);

const C3 = bersih(`Keempat misi itu kami terjemahkan ke dalam 6 strategi dan 13 program unggulan.

Tata kelola dan transparansi.
Pengelolaan anggaran dan perencanaan keuangan
sistem penerimaan mahasiswa baru yang transparan, akuntabel, responsif, independen dan fairness.`);

const C4 = bersih(`Penguatan SDM dan kinerja penelitian.
Target Renstra dosen S3 sebesar 50% dan GB 15-20% pada 2029, saat ini GB 166 per april 2026 dari 1418 dosen atau 11,7%, serta baru 36% dosen dengan pendidikan S3.
${PROGRAM[2]!.penuh}
${PROGRAM[3]!.penuh}
${PROGRAM[4]!.penuh}
${PROGRAM[5]!.penuh}

Mengembangkan pusat penelitian berbasis kepakaran,
${PROGRAM[6]!.penuh}

Revitalisasi Laboratorium dan Pendapatan Mandiri.
Pendapatan Unila masih bertumpu pada UKT, sementara Renstra menargetkan PNBP sebesar 650 miliar rupiah pada 2029.
${PROGRAM[7]!.penuh}
${PROGRAM[8]!.penuh}

Menghilirkan hasil tridharma.
${PROGRAM[9]!.penuh}

Penguatan budaya dan kampus yang nyaman.
${PROGRAM[10]!.penuh}
${PROGRAM[11]!.penuh}
${PROGRAM[12]!.penuh}`);

const C5 = bersih(`Bapak dan Ibu, Perkenankan dengan segala kerendahan hati Saya mengajak seluruh sivitas akademika melangkah bersama menuju Unila yang Unggul, berdaya saing global dan berakar pada budaya dengan tagline IMPACTFUL FOR LEADING. Terima kasih.`);

export const SLIDE: InfoSlide[] = [
  { no: 1, kunci: 'cover', judul: 'Cover', durasi: 45, catatan: C1 },
  { no: 2, kunci: 'landasan', judul: 'Landasan', durasi: 105, catatan: C2 },
  { no: 3, kunci: 'strategi', judul: 'Strategi dan program unggulan', durasi: 105, catatan: C3 },
  { no: 4, kunci: 'detail', judul: 'Langkah dan angka kunci', durasi: 120, catatan: C4 },
  { no: 5, kunci: 'penutup', judul: 'Penutup', durasi: 45, catatan: C5 },
];
export const TOTAL_SLIDE = SLIDE.length;
export const TOTAL_DURASI = SLIDE.reduce((a, s) => a + s.durasi, 0);
