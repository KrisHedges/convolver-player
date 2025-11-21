import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ConvolverPlayerReact',
      fileName: (format) => `react-convolver-player.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  resolve: {
    alias: {
      '@convolver-player/core': resolve(
        __dirname,
        '../../core/convolver-player-core/src/index.ts'
      ),
    },
  },
});