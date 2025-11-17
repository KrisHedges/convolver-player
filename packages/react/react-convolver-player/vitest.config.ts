import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'demo/', 'dist/', '**/*.d.ts'],
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@convolver-player/core': resolve(
        __dirname,
        '../../../core/convolver-player-core/dist/index.js'
      ),
      '@testing-library/jest-dom': resolve(
        __dirname,
        '../../../node_modules/@testing-library/jest-dom'
      ),
    },
  },
});
