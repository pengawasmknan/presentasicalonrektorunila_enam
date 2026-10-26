import type { ReactNode } from 'react';

/**
 * Komposisi dari slide PPTX materi Prof. Anna (kanvas 16:9, ukuran dalam cqw), dipakai bersama
 * oleh Mode Panggung dan Beranda. Aset ada di src/assets/pptx (dimasukkan Vite ke build).
 */
import gedungRektorat from '../assets/pptx/gedung-rektorat.jpeg';
import logoUnila from '../assets/pptx/logo-unila.png';
import diktisaintek from '../assets/pptx/diktisaintek-berdampak.png';
import annaSalam from '../assets/pptx/anna-salam.png';
import ornamenSudut from '../assets/pptx/ornamen-sudut.svg';
export { gedungRektorat, logoUnila, diktisaintek };

/** Empat ornamen tapis di sudut, memakai berkas desain apa adanya; hanya dicerminkan seperti di PPTX. */
export function Sudut() {
  return (
    <>
      <img className="px-sudut px-bl" src={`${ornamenSudut}`} alt="" aria-hidden="true" />
      <img className="px-sudut px-tl" src={`${ornamenSudut}`} alt="" aria-hidden="true" />
      <img className="px-sudut px-br" src={`${ornamenSudut}`} alt="" aria-hidden="true" />
      <img className="px-sudut px-tr" src={`${ornamenSudut}`} alt="" aria-hidden="true" />
    </>
  );
}

/**
 * Slide 4: slogan besar di belakang foto salam Prof. Anna. `judul` memakai h1 di Beranda dan teks dekoratif di Panggung.
 * `isi` adalah elemen tambahan (kicker, nama, tombol) yang diletakkan di atas kanvas.
 */
export function KanvasPenutup({ judul = false, isi, footer = true }: { judul?: boolean; isi?: ReactNode; footer?: boolean }) {
  const slogan = <>Impactful<br />for<br />Leading</>;
  return (
    <div className="px-kanvas">
      <div className="px-gedung" style={{ backgroundImage: `url(${gedungRektorat})` }} aria-hidden="true" />
      <div className="px-glow px-glow-akhir" aria-hidden="true" />
      {judul ? <h1 className="px-slogan-besar a1">{slogan}</h1> : <p className="px-slogan-besar a1" aria-hidden="true">{slogan}</p>}
      <img className="px-anna-salam" src={`${annaSalam}`} alt="Prof. Dr. Anna Gustina Zainal memberi salam" />
      <span className="px-garis-atas" aria-hidden="true" />
      <Sudut />
      <img className="px-logo-unila px-logo-unila-akhir" src={`${logoUnila}`} alt="Logo Universitas Lampung" />
      <img className="px-logo-dikti px-logo-dikti-akhir" src={`${diktisaintek}`} alt="Diktisaintek Berdampak" />
      {footer && <p className="px-footer">Rancangan Strategis Kepemimpinan Unila 2027–2031 · Prof. Dr. Anna Gustina Zainal, S.Sos., M.Si.</p>}
      {isi}
    </div>
  );
}
