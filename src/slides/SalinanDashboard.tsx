import { KanvasPenutup, Sudut } from '../components/KanvasPptx.tsx';

/**
 * Slide 1 dan 5: salinan persis SlideAwal dan SlideAkhir dari Mode Panggung dashboard
 * (unila-impact-dashboard/src/pages/Panggung.tsx). Jangan diubah.
 */
const BASE = import.meta.env.BASE_URL;
const A = `${BASE}assets/pptx/`;

/** Adegan pertama: mengikuti slide 1 PPTX materi Prof. Anna, kanvas 16:9 yang diskalakan ke layar. */
export function SlideAwal() {
  return (
    <section className="pg-slide pg-slide-pptx" aria-label="Pembuka: Universitas Lampung, Ekosistem Hilirisasi Inovasi">
      <div className="px-kanvas">
        <div className="px-gedung" style={{ backgroundImage: `url(${A}gedung-rektorat.jpeg)` }} aria-hidden="true" />
        <Sudut />
        <img className="px-logo-unila a1" src={`${A}logo-unila.png`} alt="Logo Universitas Lampung" />
        <img className="px-logo-dikti a1" src={`${A}diktisaintek-berdampak.png`} alt="Diktisaintek Berdampak" />
        <div className="px-glow a1" aria-hidden="true" />
        <img className="px-anna-jas" src={`${A}anna-jas.png`} alt="Prof. Dr. Anna Gustina Zainal" />
        <h1 className="px-judul a1">Universitas Lampung<br />Ekosistem Hilirisasi Inovasi</h1>
        <p className="px-sub a1">Visi, Misi &amp; Program Unggulan<br />Bakal Calon Rektor Universitas Lampung<br />Periode 2027 – 2031</p>
        <p className="px-slogan a1">Impactful for Leading</p>
        <span className="px-garis" aria-hidden="true" />
        <p className="px-nama a1">Prof. Dr. Anna Gustina Zainal, S.Sos., M.Si.</p>
        <p className="px-jabatan a1">Dekan Fakultas Ilmu Sosial dan Ilmu Politik, Guru Besar bidang Komunikasi Pembangunan dan Budaya, Universitas Lampung</p>
        <p className="px-calon a1">Bakal Calon Rektor Universitas Lampung 2027-2031</p>
        <p className="px-tanggal">Bandar Lampung, Oktober 2026</p>
      </div>
    </section>
  );
}

/** Adegan terakhir: slide 4 PPTX (slogan besar di belakang foto Prof. Anna). */
export function SlideAkhir() {
  return (
    <section className="pg-slide pg-slide-pptx" aria-label="Penutup: Impactful for Leading">
      <KanvasPenutup />
    </section>
  );
}
