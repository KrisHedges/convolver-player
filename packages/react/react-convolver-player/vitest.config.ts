import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      exclude: ['node_modules/', 'demo/', 'dist/', '**/*.d.ts'],
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@testing-library/jest-dom': resolve(
        __dirname,
        '../../../node_modules/@testing-library/jest-dom'
      ),
    },
  },
});
