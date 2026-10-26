import { useEffect, useRef, useState } from 'react';

export const kurangiGerak = (): boolean => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/** Pecah teks menjadi awalan, angka (format Indonesia), dan akhiran. */
function pecah(teks: string): { pra: string; nilai: number; desimal: number; pasca: string; ribuan: boolean } | null {
  const m = teks.match(/^(\D*?)(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?(.*)$/s);
  if (!m) return null;
  const bulat = (m[2] as string).replace(/\./g, '');
  return { pra: m[1] ?? '', nilai: Number(`${bulat}.${m[3] ?? '0'}`), desimal: m[3]?.length ?? 0, pasca: m[4] ?? '', ribuan: (m[2] as string).includes('.') };
}

/**
 * Angka besar yang naik dari nol saat pertama terlihat (900 ms, ease-out).
 * Teks akhir selalu sama dengan `teks`; pembaca layar hanya membaca nilai akhir.
 */
export function AngkaHidup({ teks, durasi = 900 }: { teks: string; durasi?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const p = pecah(teks);
  const [tampil, setTampil] = useState(() => (p && !kurangiGerak() ? `${p.pra}0${p.pasca}` : teks));
  useEffect(() => {
    const el = ref.current;
    if (!p || !el || kurangiGerak() || typeof IntersectionObserver === 'undefined') {
      setTampil(teks);
      return;
    }
    let raf = 0;
    const fmt = new Intl.NumberFormat('id-ID', { minimumFractionDigits: p.desimal, maximumFractionDigits: p.desimal, useGrouping: p.ribuan });
    const mulai = () => {
      const t0 = performance.now();
      const langkah = (t: number) => {
        const k = Math.max(0, Math.min(1, (t - t0) / durasi));
        const e = 1 - (1 - k) ** 3;
        setTampil(k >= 1 ? teks : `${p.pra}${fmt.format(p.nilai * e)}${p.pasca}`);
        if (k < 1) raf = requestAnimationFrame(langkah);
      };
      raf = requestAnimationFrame(langkah);
    };
    // Mode sematan: Panggung mengirim `pg-tampil` saat slide ini menjadi slide aktif. Mode tumpuk: saat terlihat.
    const slide = el.closest('.pg-slide');
    let jalan = false;
    const sekali = () => { if (jalan) return; jalan = true; slide?.removeEventListener('pg-tampil', sekali); io.disconnect(); mulai(); };
    // Mode sematan: slide lain tersembunyi (visibility), jadi hanya `pg-tampil` yang memulai. Mode tumpuk: saat terlihat.
    const io = new IntersectionObserver((m) => { if (m[0]?.isIntersecting && !window.matchMedia('(min-width: 961px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)').matches) sekali(); }, { threshold: 0.4 });
    io.observe(el);
    slide?.addEventListener('pg-tampil', sekali);
    return () => {
      slide?.removeEventListener('pg-tampil', sekali);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teks, durasi]);
  return (
    <span ref={ref}>
      <span className="sr-only">{teks}</span>
      <span aria-hidden="true">{tampil}</span>
    </span>
  );
}
