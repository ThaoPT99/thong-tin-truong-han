import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['lib/**/*.test.ts', 'api/**/*.test.ts', 'scripts/**/*.test.ts', 'public/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'public/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'vitest.config.ts',
        '*.config.ts',
      ],
    },
    testTimeout: 10000,
    hookTimeout: 5000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});