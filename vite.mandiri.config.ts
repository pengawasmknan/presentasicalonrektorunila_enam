import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Build HTML mandiri: satu berkas yang bisa dibuka dari file:// tanpa server dan tanpa internet.
 * Semua JS, CSS, gambar, dan font ditanam (vite-plugin-singlefile). Langkah pasca-build di
 * scripts/html-mandiri.mjs mengubah skrip menjadi klasik dan menanam ikon. Build Vercel memakai vite.config.ts.
 */

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  build: {
    outDir: 'dist-mandiri',
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: { format: 'iife', inlineDynamicImports: true },
    },
  },
});
