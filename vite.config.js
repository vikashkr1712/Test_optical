import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: { entries: ['index.html'] },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
