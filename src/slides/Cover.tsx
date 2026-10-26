import { Sudut, gedungRektorat, logoUnila, diktisaintek } from '../components/KanvasPptx.tsx';
import annaJas from '../assets/pptx/anna-jas.png';
import { VISI } from '../data/narasi.ts';

/**
 * Slide 1: mengikuti slide 1 PPT_DEBAT_REKTOR_PROF_ANNA_261026. Kanvas 16:9 dalam cqw (kelas px-*), diskalakan ke layar.
 * Tanpa nomor urut calon.
 */
export function Cover() {
  return (
    <section className="pg-slide pg-slide-pptx" aria-label="Pembuka: Universitas Lampung, Impactful for Leading">
      <div className="px-kanvas">
        <div className="px-gedung" style={{ backgroundImage: `url(${gedungRektorat})` }} aria-hidden="true" />
        <Sudut />
        <img className="px-logo-unila a1" src={`${logoUnila}`} alt="Logo Universitas Lampung" />
        <img className="px-logo-dikti a1" src={`${diktisaintek}`} alt="Diktisaintek Berdampak" />
        <div className="px-glow a1" aria-hidden="true" />
        <img className="px-anna-jas" src={`${annaJas}`} alt="Prof. Dr. Anna Gustina Zainal" />
        <h1 className="px-judul a1">Universitas Lampung<br /><em className="px-slogan-judul">Impactful for Leading</em></h1>
        <p className="px-visi-label a1">Visi 2027-2031</p>
        <p className="px-visi a1">“{VISI}”</p>
        <span className="px-garis" aria-hidden="true" />
        <p className="px-nama a1">Prof. Dr. Anna Gustina Zainal, S.Sos., M.Si.</p>
        <p className="px-jabatan a1">Dekan Fakultas Ilmu Sosial dan Ilmu Politik, Guru Besar bidang Komunikasi Pembangunan dan Budaya, Universitas Lampung</p>
        <p className="px-calon a1">Bakal Calon Rektor Universitas Lampung 2027-2031</p>
        <p className="px-tanggal">Bandar Lampung, Oktober 2026</p>
      </div>
    </section>
  );
}
