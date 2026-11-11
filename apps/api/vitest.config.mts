import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC is required so Nest's decorator metadata (used for DI) is emitted in tests.
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    restoreMocks: true,
  },
});
