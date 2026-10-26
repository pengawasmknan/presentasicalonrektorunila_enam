import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ANGKA, GURU_BESAR, MISI, PROGRAM, PUSAT_PENELITIAN, RPJP, SLIDE, STRATEGI, TAGLINE, TOTAL_DURASI, VISI, VISI_PENDEK, persenGuruBesar, visiBesar2045 } from '../src/data/narasi.ts';
import { judulKapital, terbilang } from '../src/lib/terbilang.ts';

const semuaTeks = (): string[] => [
  VISI, VISI_PENDEK, TAGLINE, visiBesar2045.awal, visiBesar2045.sisa,
  ...RPJP.flatMap((t) => [t.tahun, t.nama]),
  ...MISI.map((m) => m.nama),
  ...STRATEGI.map((s) => s.nama),
  ...PROGRAM.flatMap((p) => [p.label, p.penuh]),
  ...PUSAT_PENELITIAN,
  ...ANGKA.flatMap((a) => [a.label, a.keterangan]),
  ...SLIDE.flatMap((s) => [s.judul, s.catatan]),
];

describe('program unggulan', () => {
  it('berjumlah 13 dengan id unik', () => {
    expect(PROGRAM).toHaveLength(13);
    expect(new Set(PROGRAM.map((p) => p.id)).size).toBe(13);
  });
  it('tiap misi dan tiap strategi punya minimal satu program unggulan', () => {
    for (const m of MISI) expect(PROGRAM.some((p) => p.misi === m.id), m.id).toBe(true);
    for (const s of STRATEGI) expect(PROGRAM.some((p) => p.strategi === s.id), s.id).toBe(true);
  });
  it('tiap program unggulan merujuk misi dan strategi yang ada', () => {
    const misi = new Set(MISI.map((m) => m.id));
    const strategi = new Set(STRATEGI.map((s) => s.id));
    for (const p of PROGRAM) {
      expect(misi.has(p.misi), p.id).toBe(true);
      expect(strategi.has(p.strategi), p.id).toBe(true);
      expect(p.id.startsWith(p.strategi.replace('S', '0')), p.id).toBe(true);
    }
  });
  it('empat misi dan enam strategi', () => {
    expect(MISI).toHaveLength(4);
    expect(STRATEGI).toHaveLength(6);
  });
});

describe('angka kunci', () => {
  it('target PNBP 2029 bernilai 650', () => {
    expect(ANGKA.find((a) => a.id === 'pnbp')?.nilai).toBe(650);
  });
  it('166 dari 1.418 dosen membulat ke 11,7%', () => {
    expect(GURU_BESAR.jumlah).toBe(166);
    expect(GURU_BESAR.dosen).toBe(1418);
    expect(persenGuruBesar()).toBe(11.7);
  });
  it('tiap angka punya sumber', () => {
    for (const a of ANGKA) expect(a.sumber.length, a.id).toBeGreaterThan(0);
  });
  it('koreksi atas docx berlaku: tanpa Rp750 miliar dan tanpa 16 program unggulan', () => {
    for (const s of SLIDE) {
      expect(s.catatan).not.toMatch(/750/);
      expect(s.catatan).not.toMatch(/16\s+program/);
    }
    expect(SLIDE[2]!.catatan).toMatch(/13 program unggulan/);
    expect(SLIDE[2]!.catatan).toMatch(/650 miliar/);
    expect(SLIDE[2]!.catatan).toMatch(/Rp650 M/);
  });
  it('angka kunci ada di catatan slide 3, bukan di slide', () => {
    const c = SLIDE[2]!.catatan;
    expect(c).toMatch(/36%/);
    expect(c).toMatch(/166 dari 1\.418 dosen \(11,7%\)/);
    expect(c).toMatch(/Rp35 M/);
    expect(c).toMatch(/10% dari PAGU/);
    for (const k of PUSAT_PENELITIAN) expect(c).toContain(k);
  });
});

describe('teks', () => {
  it('tanpa tanda pisah panjang di seluruh teks slide', () => {
    for (const t of semuaTeks()) expect(t).not.toContain('—');
    const dir = new URL('../src/slides/', import.meta.url);
    for (const f of readdirSync(dir)) expect(readFileSync(new URL(f, dir), 'utf8'), f).not.toContain('—');
  });
  it('tanpa nomor urut calon di teks slide (catatan PPT menyebutnya sebagai pengingat pembicara)', () => {
    const tampil = semuaTeks().filter((t) => !SLIDE.some((s) => s.catatan === t));
    for (const t of tampil) expect(t.toLowerCase()).not.toMatch(/nomor urut/);
  });
  it('labelTebal sama dengan label setelah penanda ** dibuang', () => {
    for (const p of PROGRAM) expect(p.labelTebal.replace(/\*\*/g, ''), p.id).toBe(p.label);
  });
  it('label program unggulan sama dengan PPT', () => {
    expect(PROGRAM.map((p) => `${p.id} ${p.label}`)).toEqual([
      '01.1 Pengelolaan Anggaran dan Perencanaan Keuangan',
      '01.2 Penerimaan Mahasiswa Baru yang Transparan',
      '02.1 1 Dosen 1 Penelitian secara bertahap',
      '02.2 Perluasan Kolaborasi Riset Internasional & Multidisiplin',
      '02.3 Studi Lanjut dan Sertifikasi Kompetensi Tendik',
      '02.4 Anggaran kemahasiswaan 10% PAGU, bertahap',
      '03.1 Pusat Penelitian dari Kepakaran Dosen dan Kerjasama',
      '04.1 Revitalisasi Bisnis Laboratorium dan Upgrading Sapras',
      '04.2 Optimalisasi Aset Balai Bahasa, CCED, Puskom, RSPTN, Olahraga',
      '05.1 Hilirisasi Karya Dosen: Paten/HAKI, Jurnal, Buku, dan Pengabdian',
      '06.1 Penamaan Gedung dan Jalan dari Tokoh Lampung',
      '06.2 SDGs dan Green Metric untuk Kampus yang Nyaman',
      '06.3 Konseling dan Pencegahan Kekerasan',
    ]);
  });
  it('visi besar 2045 dan visi 2027-2031', () => {
    expect(`${visiBesar2045.awal} ${visiBesar2045.sisa}`).toBe('Universitas Lampung Berkelas Dunia, Unggul, dan Berkelanjutan');
    expect(visiBesar2045.sumber).toBe('PPT_DEBAT_REKTOR_PROF_ANNA_261026');
    expect(VISI_PENDEK).toBe('Universitas Lampung sebagai Ekosistem Hilirisasi Inovasi, Berdaya Saing Dunia, Berakar pada Budaya dan Kemandirian Bangsa');
  });
  it('catatan slide 1 dan 4 berasal dari PPT', () => {
    expect(SLIDE[0]!.catatan).toMatch(/^Waktu 0:30\./);
    expect(SLIDE[3]!.catatan).toMatch(/^Waktu 1:15\./);
  });
  it('judul slide 3 ditulis dengan huruf dari jumlah data', () => {
    expect(terbilang(PROGRAM.length)).toBe('tiga belas');
    expect(terbilang(MISI.length)).toBe('empat');
    expect(terbilang(STRATEGI.length)).toBe('enam');
    expect(judulKapital('enam strategi dan tiga belas program unggulan').replace(' Dan ', ' dan ')).toBe('Enam Strategi dan Tiga Belas Program Unggulan');
  });
});

describe('durasi', () => {
  it('total 435 detik dengan empat slide', () => {
    expect(SLIDE).toHaveLength(4);
    expect(TOTAL_DURASI).toBe(435);
    expect(SLIDE.map((s) => s.durasi)).toEqual([30, 105, 225, 75]);
  });
});
