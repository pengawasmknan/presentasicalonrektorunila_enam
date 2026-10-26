import { MISI, VISI_PENDEK, visiBesar2045 } from '../data/narasi.ts';
import { Bingkai } from '../components/Bingkai.tsx';
import { Rpjp } from '../components/Rpjp.tsx';

/** Slide 2: urutan dan teks mengikuti slide 2 PPT_DEBAT_REKTOR_PROF_ANNA_261026. */
export function Landasan() {
  return (
    <section className="pg-slide pg-slide-isi" aria-label="Landasan">
      <div className="pg-isi">
        <header className="pg-kepala">
          <p className="pg-kicker" data-masuk>Landasan</p>
          <h2 className="pg-judul lebar" data-masuk>Dari Peta Besar RPJP Menuju Agenda Lima Tahun</h2>
        </header>
        <div className="ld-badan">
          <Rpjp masuk />
          <div className="ld-besar" data-masuk>
            <p className="ld-label">Visi Besar Universitas Lampung 2045</p>
            <q><span className="aksen">{visiBesar2045.awal}</span> {visiBesar2045.sisa}</q>
          </div>
          <div className="ld-visi" data-masuk>
            <p className="ld-label">Visi 2027-2031</p>
            <q>{VISI_PENDEK}</q>
          </div>
          <div className="ld-misi-blok" data-masuk>
            <p className="ld-label">4 Misi</p>
            <ol className="ld-misi" aria-label="Empat misi">
              {MISI.map((m) => (
                <li key={m.id}>
                  <span className="no num">{Number(m.no)}</span>
                  <b>{m.nama}</b>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <Bingkai />
    </section>
  );
}
