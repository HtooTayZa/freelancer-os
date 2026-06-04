import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './')
    },
    // Tell Vitest to ignore Playwright's E2E directories
    exclude: ['node_modules', 'e2e', 'tests', 'tests-examples'],
  }
})