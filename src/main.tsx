import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/app.css';
import { Panggung } from './Panggung.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Panggung />
  </StrictMode>,
);
