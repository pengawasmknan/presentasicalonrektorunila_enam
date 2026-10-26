import { useMemo, useState } from 'react';
import { PROGRAM, STRATEGI } from '../data/narasi.ts';
import { useUkuran } from '../lib/ukuran.ts';
import { ital } from '../lib/ital.tsx';
import { tebal } from '../lib/tebal.tsx';

/**
 * Diagram dua kolom: enam strategi (kiri) dan tiga belas program unggulan (kanan).
 * Tiap program unggulan melayani satu strategi; garis lengkung menghubungkan keduanya dengan tebal seragam.
 * Pilih strategi atau program untuk menyorot jalurnya; pilih lagi untuk melepas sorotan.
 * Kolom misi tidak ditampilkan (field `misi` tetap ada di data).
 */
type Pilihan = { jenis: 'S' | 'P'; id: string } | null;

// Lebar relatif terhadap lebar diagram: tepi kiri 5%, strategi 28%, celah lengkung 7%, program 55%, tepi kanan 5%.
const KOLOM = { xS: 0.05, lS: 0.28, xP: 0.40, lP: 0.55 };
const TEBAL_GARIS = 2.5;

export function PetaAlir() {
  const [ref, w, h] = useUkuran<HTMLDivElement>();
  const [pilih, setPilih] = useState<Pilihan>(null);
  const prog = useMemo(() => [...PROGRAM].sort((a, b) => a.id.localeCompare(b.id)), []);

  const xS = w * KOLOM.xS;
  const lS = w * KOLOM.lS;
  const xP = w * KOLOM.xP;
  const lP = w * KOLOM.lP;
  const gapS = Math.max(5, h * 0.012);
  const gapP = Math.max(3, h * 0.007);
  const pS = h / STRATEGI.length;
  const pP = h / prog.length;
  const yS = (i: number) => i * pS + pS / 2;
  const yP = (i: number) => i * pP + pP / 2;

  const aktifProg = useMemo(() => new Set(prog.filter((x) => !pilih || (pilih.jenis === 'S' ? x.strategi === pilih.id : x.id === pilih.id)).map((x) => x.id)), [pilih, prog]);
  const aktifStrategi = new Set(prog.filter((x) => aktifProg.has(x.id)).map((x) => x.strategi));

  const lengkung = (x1: number, y1: number, x2: number, y2: number) => {
    const t = (x2 - x1) * 0.5;
    return `M${x1},${y1} C${x1 + t},${y1} ${x2 - t},${y2} ${x2},${y2}`;
  };
  const alihkan = (j: 'S' | 'P', id: string) => setPilih(pilih && pilih.jenis === j && pilih.id === id ? null : { jenis: j, id });

  return (
    <div
      className="peta-alir"
      onKeyDown={(e) => e.key === 'Escape' && pilih && (e.stopPropagation(), setPilih(null))}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="peta-kepala" aria-hidden="true" style={{ position: 'relative', display: 'block', height: '1.6em' }}>
        <span style={{ position: 'absolute', left: xS, width: lS }}>Strategi</span>
        <span style={{ position: 'absolute', left: xP, width: lP }}>Program unggulan</span>
      </div>
      <div ref={ref} className="peta-kanvas">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
          {prog.map((x) => {
            const i = STRATEGI.findIndex((s) => s.id === x.strategi);
            const j = prog.indexOf(x);
            return (
              <path
                key={x.id}
                d={lengkung(xS + lS, yS(i), xP, yP(j))}
                className={`jalur${aktifProg.has(x.id) ? '' : ' redup'}`}
                strokeWidth={TEBAL_GARIS}
              />
            );
          })}
        </svg>
        {STRATEGI.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`simpul simpul-u${aktifStrategi.has(s.id) ? '' : ' redup'}`}
            aria-pressed={pilih?.jenis === 'S' && pilih.id === s.id}
            style={{ top: i * pS + gapS / 2, left: xS, width: lS, height: pS - gapS }}
            onClick={() => alihkan('S', s.id)}
          >
            <span className="num no">{s.no}</span>
            <b>{ital(s.nama)}</b>
          </button>
        ))}
        {prog.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={`simpul simpul-a${aktifProg.has(x.id) ? '' : ' redup'}`}
            aria-pressed={pilih?.jenis === 'P' && pilih.id === x.id}
            style={{ top: i * pP + gapP / 2, left: xP, width: lP, height: pP - gapP }}
            onClick={() => alihkan('P', x.id)}
          >
            <span className="num no">{x.id}</span>
            <span>{tebal(x.labelTebal)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
