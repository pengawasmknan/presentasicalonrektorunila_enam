import logoUnila from '../assets/pptx/logo-unila.png';
import diktisaintek from '../assets/pptx/diktisaintek-berdampak.png';

/** Logo di pojok kanan atas dan baris sumber di bawah, seperti slide 2 dan 3 di PPT. */
export function Bingkai() {
  return (
    <>
      <img className="pg-logo pg-logo-u" src={`${logoUnila}`} alt="Logo Universitas Lampung" />
      <img className="pg-logo pg-logo-d" src={`${diktisaintek}`} alt="Diktisaintek Berdampak" />
      <p className="pg-sumber">Rancangan Strategis Kepemimpinan Unila 2027–2031 · Prof. Dr. Anna Gustina Zainal, S.Sos., M.Si.</p>
    </>
  );
}
