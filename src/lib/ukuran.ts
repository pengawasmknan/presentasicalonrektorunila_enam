import { useEffect, useRef, useState } from 'react';

/** Lebar dan tinggi elemen, diperbarui lewat ResizeObserver. */
export function useUkuran<T extends HTMLElement>(awal = { w: 1000, h: 600 }): [React.RefObject<T | null>, number, number] {
  const ref = useRef<T | null>(null);
  const [u, setU] = useState(awal);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => {
      const r = e[0]?.contentRect;
      if (r && r.width && r.height) setU((p) => (p.w === Math.round(r.width) && p.h === Math.round(r.height) ? p : { w: Math.round(r.width), h: Math.round(r.height) }));
    });
    ro.observe(el);
    const b = el.getBoundingClientRect();
    if (b.width && b.height) setU({ w: Math.round(b.width), h: Math.round(b.height) });
    return () => ro.disconnect();
  }, []);
  return [ref, u.w, u.h];
}
