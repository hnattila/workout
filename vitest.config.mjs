import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    environmentMatchGlobs: [
      ['src/app/**.test.ts', 'jsdom'],
      ['src/lib/**.test.ts', 'jsdom'],
      ['src/server/**/*.test.ts', 'node'],
    ],
    setupFiles: ['./src/tests/setup.ts'],
    globalSetup: './src/tests/globalSetup.ts',
  },
})
