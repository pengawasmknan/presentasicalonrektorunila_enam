import { PROGRAM, STRATEGI } from '../data/narasi.ts';
import { PetaAlir } from '../components/PetaAlir.tsx';
import { ital } from '../lib/ital.tsx';
import { tebal } from '../lib/tebal.tsx';
import { Bingkai } from '../components/Bingkai.tsx';
import { judulKapital, terbilang } from '../lib/terbilang.ts';

export function Strategi() {
  const judul = judulKapital(`${terbilang(STRATEGI.length)} strategi dan ${terbilang(PROGRAM.length)} program unggulan`).replace(' Dan ', ' dan ');
  return (
    <section className="pg-slide pg-slide-isi" aria-label="Strategi dan program unggulan">
      <div className="pg-isi">
        <header className="pg-kepala">
          <p className="pg-kicker" data-masuk>Strategi dan program unggulan</p>
          <h2 className="pg-judul lebar" data-masuk>{judul}</h2>
          <p className="pg-sub" data-masuk>Setiap program unggulan melayani satu strategi.</p>
        </header>
        <div className="st-badan" data-masuk>
          <PetaAlir />
          <div className="st-daftar">
            {STRATEGI.map((s) => (
              <div key={s.id}>
                <h3>{s.no} {ital(s.nama)}</h3>
                <ul>
                  {PROGRAM.filter((p) => p.strategi === s.id).map((p) => (
                    <li key={p.id}><span className="num">{p.id}</span><span>{tebal(p.labelTebal)}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="st-petunjuk" aria-hidden="true">Klik simpul untuk menyorot jalur</p>
      </div>
      <Bingkai />
    </section>
  );
}
