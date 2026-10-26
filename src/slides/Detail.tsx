import { KARTU, STRATEGI } from '../data/narasi.ts';
import { ital } from '../lib/ital.tsx';
import { AngkaHidup } from '../lib/gerak.tsx';

export function Detail() {
  return (
    <section className="pg-slide pg-slide-isi" aria-label="Langkah dan angka kunci">
      <div className="pg-isi">
        <header className="pg-kepala">
          <p className="pg-kicker" data-masuk>Detail strategi</p>
          <h2 className="pg-judul lebar" data-masuk>Langkah dan angka kunci</h2>
        </header>
        <div className="dt-grid">
          {KARTU.map((k) => {
            const s = STRATEGI.find((x) => x.id === k.strategi)!;
            return (
              <article key={k.strategi} className="dt-kartu" data-masuk>
                <div className="dt-kop">
                  <span className="no num">{s.no}</span>
                  <h3>{ital(s.nama)}</h3>
                </div>
                {k.angka && (
                  <p className="dt-angka"><b className="num"><AngkaHidup teks={k.angka.besar} durasi={900} /></b><span>{k.angka.label}</span></p>
                )}
                {k.kalimat && <p className="dt-posisi">{ital(k.kalimat)}</p>}
                {k.poin.length > 0 && <ul className="dt-poin">{k.poin.map((p) => <li key={p}>{ital(p)}</li>)}</ul>}
                {k.chip && <ul className="dt-chip" aria-label="Contoh pusat penelitian">{k.chip.map((c) => <li key={c}>{c}</li>)}</ul>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
