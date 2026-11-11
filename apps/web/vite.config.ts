import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export const alias = {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  server: {
    port: 5173,
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
});
