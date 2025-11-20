import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@convolver-player/core': resolve(
        __dirname,
        '../../core/convolver-player-core/dist'
      ),
    },
  },
});
