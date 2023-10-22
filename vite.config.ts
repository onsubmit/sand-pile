/// <reference types="vitest" />
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/sand-pile/',
  test: {
    mockReset: true,
  },
});
