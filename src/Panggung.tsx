import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SLIDE, TOTAL_DURASI, TOTAL_SLIDE } from './data/narasi.ts';
import { href, useHash, useSlideAwal } from './router.ts';
import { Cover } from './slides/Cover.tsx';
import { Landasan } from './slides/Landasan.tsx';
import { Penutup } from './slides/Penutup.tsx';
import { Strategi } from './slides/Strategi.tsx';

/**
 * Mode Panggung: gulir cerita layar penuh, dipindahkan dari unila-impact-dashboard/src/pages/Panggung.tsx.
 * Bingkai disematkan dan slide bergantian saat digulir (roda mouse, trackpad, sentuh) atau digerakkan dengan
 * panah, spasi, Home, End, dan titik navigasi. Tanpa gerak (reduced motion) atau di layar sempit,
 * slide ditumpuk ke bawah dan panah memindahkan ke slide berikutnya.
 * Isi slide masuk bertahap lewat atribut `data-masuk`.
 */
const N = TOTAL_SLIDE;
const LANGKAH_VH = 0.8;
const MEDIA_PIN = '(min-width: 961px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)';

interface Tangani { ke: (i: number) => void; sekarang: () => number }

const format = (detik: number): string => {
  const a = Math.abs(Math.round(detik));
  return `${detik < 0 ? '+' : ''}${Math.floor(a / 60)}:${String(a % 60).padStart(2, '0')}`;
};

export function Panggung() {
  const akar = useRef<HTMLDivElement | null>(null);
  const kendali = useRef<Tangani>({ ke: () => undefined, sekarang: () => 0 });
  const awal = useSlideAwal() - 1;
  const [kini, setKini] = useState(awal);
  const [catatan, setCatatan] = useState(false);
  const [mulai, setMulai] = useState<number | null>(null);
  const [tik, setTik] = useState(0);

  const ke = useCallback((i: number) => kendali.current.ke(i), []);
  useHash((n) => { if (n - 1 !== kendali.current.sekarang()) kendali.current.ke(n - 1); });

  // Penghitung waktu mulai saat slide 1 pertama kali digeser.
  useEffect(() => { if (kini > 0 && mulai === null) setMulai(Date.now()); }, [kini, mulai]);
  useEffect(() => {
    if (mulai === null) return;
    const t = window.setInterval(() => setTik((x) => x + 1), 500);
    return () => window.clearInterval(t);
  }, [mulai]);
  void tik;

  // Pembersihan ScrollTrigger harus jalan sebelum React menghapus elemen (pin-spacer), jadi useLayoutEffect.
  useLayoutEffect(() => {
    let mm: { revert: () => void } | undefined;
    let batal = false;
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (batal || !akar.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const root = akar.current;
      const slide = gsap.utils.toArray<HTMLElement>('.pg-slide', root);
      const stage = root.querySelector<HTMLElement>('.pg-stage')!;
      const titik = gsap.utils.toArray<HTMLElement>('.pg-nav .pg-titik', root);
      const noEl = root.querySelector<HTMLElement>('.pg-nomor-dock');
      const media = gsap.matchMedia();
      let sekarang = -1;
      let tAlamat = 0;
      const tandai = (i: number) => {
        if (i === sekarang) return;
        sekarang = i;
        setKini(i);
        titik.forEach((t, k) => { if (k === i) t.setAttribute('aria-current', 'step'); else t.removeAttribute('aria-current'); });
        if (noEl) noEl.textContent = `${i + 1} / ${slide.length}`;
        // Alamat diperbarui setelah gulir berhenti; replaceState berulang tiap slide membebani Safari.
        window.clearTimeout(tAlamat);
        tAlamat = window.setTimeout(() => { try { history.replaceState(null, '', href(i + 1)); } catch { /* abaikan */ } }, 250);
      };

      media.add(MEDIA_PIN, () => {
        root.classList.add('pg-pin');
        gsap.set(slide, { autoAlpha: 0 });
        gsap.set(slide[0] as HTMLElement, { autoAlpha: 1 });
        const total = () => (slide.length - 1) * window.innerHeight * LANGKAH_VH;
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${total()}`,
            pin: true,
            scrub: 0.3,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => tandai(Math.round(self.progress * (slide.length - 1))),
          },
        });
        slide.forEach((s, i) => {
          if (i === 0) return;
          const lama = slide[i - 1] as HTMLElement;
          tl.addLabel(`slide-${i + 1}`, i);
          // Semua tween selesai paling lambat di waktu i, sehingga durasi timeline = N-1 dan slide yang diam tampil utuh.
          tl.to(lama, { autoAlpha: 0, scale: 0.96, y: -28, duration: 0.45, ease: 'power2.in' }, i - 0.55);
          tl.fromTo(s, { autoAlpha: 0, scale: 1.04, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5 }, i - 0.5);
          const masuk = s.querySelectorAll('[data-masuk]');
          if (masuk.length) {
            const jeda = Math.min(0.06, 0.18 / Math.max(1, masuk.length - 1));
            tl.fromTo(masuk, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: jeda }, i - 0.5);
          }
        });
        const st = tl.scrollTrigger!;
        const posisi = (i: number) => st.start + (i / (slide.length - 1)) * (st.end - st.start);
        kendali.current = {
          ke: (i) => window.scrollTo({ top: posisi(Math.min(slide.length - 1, Math.max(0, i))), behavior: 'smooth' }),
          sekarang: () => Math.round(st.progress * (slide.length - 1)),
        };
        // Mulai dari slide yang diminta lewat alamat (#/3). Hitung ulang setelah tata letak siap, lalu lompat.
        let lompat = awal > 0;
        const siap = () => {
          if (batal) return;
          ScrollTrigger.refresh();
          if (lompat) { lompat = false; window.scrollTo({ top: posisi(awal) }); tandai(awal); } else tandai(Math.round(st.progress * (slide.length - 1)));
        };
        requestAnimationFrame(siap);
        const t1 = window.setTimeout(siap, 400);
        void document.fonts?.ready.then(siap);
        const t2 = window.setTimeout(() => { lompat = false; }, 1200);
        return () => { window.clearTimeout(t1); window.clearTimeout(t2); root.classList.remove('pg-pin'); };
      });

      media.add('(max-width: 960px), (max-height: 559px), (prefers-reduced-motion: reduce)', () => {
        root.classList.add('pg-tumpuk');
        const io = new IntersectionObserver((es) => {
          for (const e of es) if (e.isIntersecting && e.intersectionRatio > 0.5) tandai(slide.indexOf(e.target as HTMLElement));
        }, { threshold: [0.5, 0.75] });
        slide.forEach((s) => io.observe(s));
        kendali.current = {
          ke: (i) => slide[Math.min(slide.length - 1, Math.max(0, i))]?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          sekarang: () => Math.max(0, sekarang),
        };
        if (awal > 0) slide[awal]?.scrollIntoView({ block: 'start' });
        tandai(Math.max(0, awal));
        return () => { io.disconnect(); root.classList.remove('pg-tumpuk'); };
      });
      mm = media;
    })();
    return () => { batal = true; mm?.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dock navigasi muncul saat ada gerakan atau tombol, lalu menghilang agar tidak menutup slide.
  useEffect(() => {
    const el = akar.current;
    if (!el) return;
    let t = 0;
    const tampil = () => {
      el.classList.add('pg-aktif');
      window.clearTimeout(t);
      t = window.setTimeout(() => el.classList.remove('pg-aktif'), 2600);
    };
    tampil();
    for (const e of ['mousemove', 'keydown', 'touchstart', 'wheel']) window.addEventListener(e, tampil, { passive: true });
    return () => { window.clearTimeout(t); for (const e of ['mousemove', 'keydown', 'touchstart', 'wheel']) window.removeEventListener(e, tampil); };
  }, []);

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = kendali.current;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        k.ke(k.sekarang() + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        k.ke(k.sekarang() - 1);
      } else if (e.key === 'Home') { e.preventDefault(); k.ke(0); }
      else if (e.key === 'End') { e.preventDefault(); k.ke(N - 1); }
      else if (e.key === 'Escape') {
        if (document.fullscreenElement) void document.exitFullscreen();
      } else if (e.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
      } else if (e.key.toLowerCase() === 'n') {
        setCatatan((v) => !v);
      }
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, []);

  const sisa = mulai === null ? TOTAL_DURASI : TOTAL_DURASI - (Date.now() - mulai) / 1000;
  const info = SLIDE[Math.min(N - 1, Math.max(0, kini))]!;

  return (
    <div className={`panggung paksa-terang pg-gulir${catatan ? ' pg-catatan' : ''}`} ref={akar}>
      <main className="pg-stage">
        <Cover />
        <Landasan />
        <Strategi />
        <Penutup />

        <footer className="pg-foot">
          <nav className="pg-nav" aria-label="Navigasi slide">
            <button type="button" onClick={() => ke(kendali.current.sekarang() - 1)} aria-label="Slide sebelumnya">←</button>
            {Array.from({ length: N }, (_, i) => (
              <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={() => ke(i)} className="pg-titik" />
            ))}
            <button type="button" onClick={() => ke(kendali.current.sekarang() + 1)} aria-label="Slide berikutnya">→</button>
            <span className="pg-nomor-dock num" aria-live="polite">1 / {N}</span>
            <button type="button" onClick={() => (document.fullscreenElement ? void document.exitFullscreen() : void document.documentElement.requestFullscreen?.())}>Layar penuh (F)</button>
            <button type="button" aria-pressed={catatan} onClick={() => setCatatan((v) => !v)}>Catatan (N)</button>
          </nav>
        </footer>
      </main>

      {catatan && (
        <aside className="cp-panel" aria-label="Catatan pembicara">
          <div className="cp-kepala">
            <span>Slide {info.no}: {info.judul} · sekitar {format(info.durasi)}</span>
            <span className={`cp-waktu num${sisa < 0 ? ' lewat' : ''}`} aria-label="Sisa waktu">{format(sisa)}</span>
            <span className="cp-aksi"><button type="button" onClick={() => setMulai(Date.now())}>Setel ulang waktu</button></span>
          </div>
          <p className="cp-teks">{info.catatan}</p>
        </aside>
      )}
    </div>
  );
}
