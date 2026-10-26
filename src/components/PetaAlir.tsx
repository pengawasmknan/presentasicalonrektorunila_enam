import { useMemo, useState } from 'react';
import { MISI, PROGRAM, STRATEGI } from '../data/narasi.ts';
import type { IdMisi, IdStrategi } from '../data/types.ts';
import { useUkuran } from '../lib/ukuran.ts';
import { ital } from '../lib/ital.tsx';

/**
 * Diagram tiga kolom: empat misi, enam strategi, dan program unggulan.
 * Satu program unggulan punya satu misi dan satu strategi; garis antarkolom menunjukkan jumlahnya.
 * Pilih satu simpul untuk menyorot jalurnya. Tinggi diagram mengikuti wadahnya.
 */
type Pilihan = { jenis: 'M' | 'S' | 'P'; id: string } | null;

const KOLOM = { lM: 0.2, xS: 0.33, lS: 0.23, xP: 0.62 };

export function PetaAlir() {
  const [ref, w, h] = useUkuran<HTMLDivElement>();
  const [pilih, setPilih] = useState<Pilihan>(null);
  const prog = useMemo(() => [...PROGRAM].sort((a, b) => a.id.localeCompare(b.id)), []);

  const lM = w * KOLOM.lM;
  const xS = w * KOLOM.xS;
  const lS = w * KOLOM.lS;
  const xP = w * KOLOM.xP;
  const lP = w - xP;
  const gap = Math.max(5, h * 0.012);
  const gapP = Math.max(3, h * 0.007);
  const pM = h / MISI.length;
  const pS = h / STRATEGI.length;
  const pP = h / prog.length;
  const tM = Math.min(pM - gap, h * 0.18);
  const yM = (i: number) => i * pM + pM / 2;
  const yS = (i: number) => i * pS + pS / 2;
  const yP = (i: number) => i * pP + pP / 2;
  const iM = (id: IdMisi) => MISI.findIndex((m) => m.id === id);
  const iS = (id: IdStrategi) => STRATEGI.findIndex((s) => s.id === id);

  const aktif = useMemo(() => {
    if (!pilih) return new Set(prog.map((x) => x.id));
    return new Set(prog.filter((x) => (pilih.jenis === 'M' ? x.misi === pilih.id : pilih.jenis === 'S' ? x.strategi === pilih.id : x.id === pilih.id)).map((x) => x.id));
  }, [pilih, prog]);
  const hidup = prog.filter((x) => aktif.has(x.id));
  const aktifM = new Set(hidup.map((x) => x.misi));
  const aktifS = new Set(hidup.map((x) => x.strategi));

  const pasangan = new Map<string, number>();
  for (const x of prog) pasangan.set(`${x.misi}|${x.strategi}`, (pasangan.get(`${x.misi}|${x.strategi}`) ?? 0) + 1);

  const lengkung = (x1: number, y1: number, x2: number, y2: number) => {
    const t = (x2 - x1) * 0.5;
    return `M${x1},${y1} C${x1 + t},${y1} ${x2 - t},${y2} ${x2},${y2}`;
  };
  const alihkan = (j: 'M' | 'S' | 'P', id: string) => setPilih(pilih && pilih.jenis === j && pilih.id === id ? null : { jenis: j, id });

  return (
    <div
      className="peta-alir"
      style={{ '--kol-m': `${KOLOM.xS * 100}%`, '--kol-s': `${(KOLOM.xP - KOLOM.xS) * 100}%`, '--kol-p': `${(1 - KOLOM.xP) * 100}%` } as React.CSSProperties}
      onKeyDown={(e) => e.key === 'Escape' && pilih && (e.stopPropagation(), setPilih(null))}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="peta-kepala" aria-hidden="true"><span>Misi</span><span>Strategi</span><span>Program unggulan</span></div>
      <div ref={ref} className="peta-kanvas">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
          {[...pasangan.entries()].map(([k, n]) => {
            const [m, s] = k.split('|') as [IdMisi, IdStrategi];
            const nyala = hidup.some((x) => x.misi === m && x.strategi === s);
            return <path key={k} d={lengkung(lM, yM(iM(m)), xS, yS(iS(s)))} className={`jalur${nyala ? '' : ' redup'}`} strokeWidth={2 + n * 2.5} />;
          })}
          {prog.map((x, i) => (
            <path key={x.id} d={lengkung(xS + lS, yS(iS(x.strategi)), xP, yP(i))} className={`jalur tipis${aktif.has(x.id) ? '' : ' redup'}`} strokeWidth={2} />
          ))}
        </svg>
        {MISI.map((m, i) => (
          <button key={m.id} type="button" className={`simpul simpul-m${aktifM.has(m.id) ? '' : ' redup'}`} aria-pressed={pilih?.jenis === 'M' && pilih.id === m.id} style={{ top: yM(i) - tM / 2, left: 0, width: lM, height: tM }} onClick={() => alihkan('M', m.id)}>
            <span className="num no">{m.no}</span>
            <b>{ital(m.nama)}</b>
          </button>
        ))}
        {STRATEGI.map((s, i) => (
          <button key={s.id} type="button" className={`simpul simpul-u${aktifS.has(s.id) ? '' : ' redup'}`} aria-pressed={pilih?.jenis === 'S' && pilih.id === s.id} style={{ top: i * pS + gap / 2, left: xS, width: lS, height: pS - gap }} onClick={() => alihkan('S', s.id)}>
            <span className="num no">{s.no}</span>
            <b>{ital(s.nama)}</b>
          </button>
        ))}
        {prog.map((x, i) => (
          <button key={x.id} type="button" className={`simpul simpul-a${aktif.has(x.id) ? '' : ' redup'}`} aria-pressed={pilih?.jenis === 'P' && pilih.id === x.id} style={{ top: i * pP + gapP / 2, left: xP, width: lP, height: pP - gapP }} onClick={() => alihkan('P', x.id)}>
            <span className="num no">{x.id}</span>
            <span>{ital(x.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
