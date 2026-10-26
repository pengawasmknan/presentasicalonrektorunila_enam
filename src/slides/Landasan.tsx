import { MISI, TAGLINE, VISI } from '../data/narasi.ts';
import { Rpjp } from '../components/Rpjp.tsx';

export function Landasan() {
  return (
    <section className="pg-slide pg-slide-isi" aria-label="Landasan">
      <div className="pg-isi">
        <header className="pg-kepala">
          <p className="pg-kicker" data-masuk>Landasan</p>
          <h2 className="pg-judul lebar" data-masuk>Masa bakti 2027–2031 ada di titik pergantian Tahap I ke Tahap II</h2>
        </header>
        <div className="ld-badan">
          <Rpjp masuk />
          <div className="ld-visi" data-masuk>
            <q>{VISI}</q>
            <p>{TAGLINE}</p>
          </div>
          <ol className="ld-misi" data-masuk aria-label="Empat misi">
            {MISI.map((m) => (
              <li key={m.id}>
                <span className="no num">{m.no}</span>
                <b>{m.nama}</b>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
