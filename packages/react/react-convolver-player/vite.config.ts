import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ConvolverPlayerReact',
      fileName: (format) => `react-convolver-player.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@convolver-player/core': resolve(__dirname, '../../core/convolver-player-core/dist/index.js'),
    },
  },
});