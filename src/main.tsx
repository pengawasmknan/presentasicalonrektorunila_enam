import '@fontsource-variable/instrument-sans/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/app.css';
import { Panggung } from './Panggung.tsx';
import logoUnila from './assets/pptx/logo-unila.png';

// Ikon tab lewat impor, bukan tag di index.html: berkas gambar tetap ikut tertanam di build mandiri.
const ikon = document.createElement('link');
ikon.rel = 'icon';
ikon.type = 'image/png';
ikon.href = logoUnila;
document.head.append(ikon);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Panggung />
  </StrictMode>,
);
