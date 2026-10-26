const SATUAN = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

/** Angka 0–99 dalam huruf Indonesia, huruf kecil. */
export function terbilang(n: number): string {
  if (n < 12) return SATUAN[n] ?? String(n);
  if (n < 20) return `${SATUAN[n - 10]} belas`;
  if (n < 100) {
    const p = Math.floor(n / 10);
    const s = n % 10;
    return `${SATUAN[p]} puluh${s ? ` ${SATUAN[s]}` : ''}`;
  }
  return String(n);
}

export const kapital = (t: string): string => t.charAt(0).toUpperCase() + t.slice(1);

/** Huruf kapital di awal tiap kata (Title Case), seperti judul di PPT. */
export const judulKapital = (t: string): string => t.replace(/(^|\s)(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());
