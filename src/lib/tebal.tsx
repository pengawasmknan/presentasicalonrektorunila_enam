import { Fragment } from 'react';
import { ital } from './ital.tsx';

/**
 * Label program unggulan dengan kata kunci tebal biru (`**kata**` di labelTebal, sama seperti PPT).
 * Bagian biasa tetap melewati ital() supaya istilah asing dicetak miring.
 */
export function tebal(teks: string) {
  return teks.split(/\*\*(.+?)\*\*/).map((bagian, i) =>
    i % 2 === 1 ? <b key={i} className="kunci">{ital(bagian)}</b> : <Fragment key={i}>{ital(bagian)}</Fragment>,
  );
}
