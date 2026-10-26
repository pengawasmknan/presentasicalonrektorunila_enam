import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ANGKA, GURU_BESAR, KARTU, MISI, PROGRAM, PUSAT_PENELITIAN, RPJP, SLIDE, STRATEGI, TAGLINE, TOTAL_DURASI, TUGAS_REKTOR, VISI, persenGuruBesar } from '../src/data/narasi.ts';
import { terbilang } from '../src/lib/terbilang.ts';

const semuaTeks = (): string[] => [
  VISI, TAGLINE, TUGAS_REKTOR,
  ...RPJP.flatMap((t) => [t.tahun, t.nama]),
  ...MISI.map((m) => m.nama),
  ...STRATEGI.map((s) => s.nama),
  ...PROGRAM.flatMap((p) => [p.label, p.penuh]),
  ...PUSAT_PENELITIAN,
  ...ANGKA.flatMap((a) => [a.label, a.keterangan]),
  ...KARTU.flatMap((k) => [k.angka?.besar ?? '', k.angka?.label ?? '', k.kalimat ?? '', ...k.poin, ...(k.chip ?? [])]),
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
    expect(SLIDE[3]!.catatan).toMatch(/650 miliar/);
  });
  it('slide tidak menampilkan angka kondisi saat ini', () => {
    const tampil = KARTU.flatMap((k) => [k.angka?.besar ?? '', k.kalimat ?? '', ...k.poin]).join(' ');
    expect(tampil).not.toMatch(/1\.418|11,7|36%|UKT/);
  });
});

describe('teks', () => {
  it('tanpa tanda pisah panjang di seluruh teks slide', () => {
    for (const t of semuaTeks()) expect(t).not.toContain('—');
    const dir = new URL('../src/slides/', import.meta.url);
    for (const f of readdirSync(dir)) expect(readFileSync(new URL(f, dir), 'utf8'), f).not.toContain('—');
  });
  it('tanpa nomor urut calon', () => {
    for (const t of semuaTeks()) expect(t.toLowerCase()).not.toMatch(/nomor urut/);
  });
  it('judul slide 3 ditulis dengan huruf dari jumlah data', () => {
    expect(terbilang(PROGRAM.length)).toBe('tiga belas');
    expect(terbilang(MISI.length)).toBe('empat');
    expect(terbilang(STRATEGI.length)).toBe('enam');
  });
});

describe('durasi', () => {
  it('total 420 detik dengan lima slide', () => {
    expect(SLIDE).toHaveLength(5);
    expect(TOTAL_DURASI).toBe(420);
    expect(SLIDE.map((s) => s.durasi)).toEqual([45, 105, 105, 120, 45]);
  });
});
