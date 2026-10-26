export type IdMisi = 'M1' | 'M2' | 'M3' | 'M4';
export type IdStrategi = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';

export interface Misi { id: IdMisi; no: string; nama: string }
export interface Strategi { id: IdStrategi; no: string; nama: string }

/** Satu butir program unggulan. `penuh` adalah kalimat narasi apa adanya, dipakai di catatan pembicara. */
export interface Program {
  id: string;
  label: string;
  strategi: IdStrategi;
  misi: IdMisi;
  butir: string;
  penuh: string;
}

export interface TahapRpjp { no: string; tahun: string; nama: string }

export interface AngkaKunci {
  id: string;
  label: string;
  nilai: number;
  satuan: string;
  keterangan: string;
  sumber: string;
}

export interface InfoSlide {
  no: number;
  kunci: 'cover' | 'landasan' | 'strategi' | 'penutup';
  judul: string;
  durasi: number;
  catatan: string;
}
