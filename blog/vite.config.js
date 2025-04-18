import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      // '@root': path.resolve(__dirname, )
    },
  },
  build: {
    outDir: 'dist',
  },
});
