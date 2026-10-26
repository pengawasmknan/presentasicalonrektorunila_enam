import { RPJP } from '../data/narasi.ts';
import { ital } from '../lib/ital.tsx';

/**
 * Garis waktu RPJP Unila 2025–2045 (varian ringkas). Lebar tiap tahap sama (5 tahun), dan penanda 2027–2031
 * ditempatkan menurut sumbu tahun: mulai di 10% dan lebar 25% dari total 20 tahun.
 * Tahap I dan II (masa bakti) berwarna aksen; Tahap III dan IV abu-abu seperti di PPT.
 */
const AWAL = 2025;
const SPAN = 20;

export function Rpjp({ masuk = false }: { masuk?: boolean }) {
  const kiri = ((2027 - AWAL) / SPAN) * 100;
  const lebar = ((2032 - 2027) / SPAN) * 100;
  return (
    <figure className="rpjp rpjp-ringkas" aria-label="Garis waktu RPJP Unila 2025 sampai 2045" data-masuk={masuk ? '' : undefined}>
      <div className="rpjp-jalur">
        <span className="rpjp-masa" style={{ left: `${kiri}%`, width: `${lebar}%` }}><b>Masa bakti Rektor 2027-2031:</b></span>
        <span className="rpjp-transisi" style={{ left: `${kiri + lebar}%` }}>Titik transisi Tahap I → II</span>
      </div>
      <ol className="rpjp-tahap">
        {RPJP.map((t, i) => (
          <li key={t.no} className={i <= 1 ? 'rpjp-dekat' : 'rpjp-jauh'}>
            <span className="rpjp-label">Tahap {t.no}</span>
            <b className="rpjp-tahun num">{t.tahun}</b>
            <span className="rpjp-nama">{ital(t.nama)}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
