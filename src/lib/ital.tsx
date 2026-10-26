import type { ReactNode } from 'react';

/**
 * Istilah asing dicetak miring (EYD). Nama diri seperti QS World University Rankings,
 * UI GreenMetric, dan QS sengaja tidak masuk daftar.
 */
const ISTILAH = [
  'smart campus', 'research downstreaming', 'innovation based university', 'blended learning', 'graduate employability',
  'science techno park', 'scale up', 'zero waste', 'revenue generating activities', 'business judgement rule',
  'once only principle', 'roadshow', 'income generator', 'maturity rating', 'visiting scholar', 'tracer study',
  'start-up', 'podcast', 'tax center', 'living lab', 'gold standard', 'benchmarking', 'downstreaming', 'inbound', 'online',
  'research downstreaming orientation', 'entrepreneurial based innovation university', 'entrepreneurial with high-tech university', 'student mobility', 'revenue generating activity',
];
const POLA = new RegExp(`(?<![\\p{L}-])(${[...ISTILAH].sort((a, b) => b.length - a.length).map((t) => t.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})(?![\\p{L}-])`, 'giu');

/** Mengembalikan teks dengan istilah asing dalam <i>. Tanpa istilah, hasilnya string biasa. */
export function ital(teks: string | null | undefined): ReactNode {
  if (!teks) return teks ?? null;
  const bagian = teks.split(POLA);
  if (bagian.length === 1) return teks;
  return bagian.map((b, i) => (i % 2 === 1 ? <i key={i}>{b}</i> : b));
}
