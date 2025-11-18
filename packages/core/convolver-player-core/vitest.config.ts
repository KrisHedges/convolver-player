// packages/core/convolver-player-core/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/__tests__/**/*.js'], // Exclude compiled test files
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
    },
  },
});
