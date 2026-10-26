import { useEffect, useState } from 'react';
import { TOTAL_SLIDE } from './data/narasi.ts';

/** Alamat `#/N` membuka slide ke-N (1 sampai TOTAL_SLIDE). Selain itu slide 1. */
export function bacaSlide(hash: string): number {
  const n = Number(hash.replace(/^#\/?/, '').split('/')[0]);
  return Number.isInteger(n) && n >= 1 && n <= TOTAL_SLIDE ? n : 1;
}

export function useSlideAwal(): number {
  const [n] = useState(() => bacaSlide(window.location.hash));
  return n;
}

export const href = (n: number): string => `#/${n}`;

export function useHash(f: (n: number) => void): void {
  useEffect(() => {
    const g = () => f(bacaSlide(window.location.hash));
    window.addEventListener('hashchange', g);
    return () => window.removeEventListener('hashchange', g);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
