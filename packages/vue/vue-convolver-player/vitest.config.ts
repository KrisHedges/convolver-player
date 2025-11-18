import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
    },
  },
      resolve: {
        alias: {
          '@convolver-player/core': path.resolve(__dirname, '../../core/convolver-player-core/src'),
          '@convolver-player/core/vitest.shared-mocks': path.resolve(__dirname, '../../core/convolver-player-core/vitest.shared-mocks.ts'),
        },
      },});
