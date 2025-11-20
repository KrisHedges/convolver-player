import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
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
    deps: {
      interopDefault: true,
    },
  },
  resolve: {
    preserveSymlinks: true,

  },
});
