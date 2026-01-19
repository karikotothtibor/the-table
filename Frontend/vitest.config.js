import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    include: ['tests/unit/**/*.test.{js,ts,jsx,tsx}'],
    exclude: ['tests/e2e/**/*.e2e.spec.{js,ts,jsx,tsx}','**/node_modules/**', '**/dist/**'],
    environment: 'happy-dom',  // Gyors unit tesztek
    setupFiles: ['./tests/setup.js'],
     css: false,
    pool: 'threads',
  },
  define: {
    global: 'globalThis'
  },
 server: {
    fs: {
      allow: ['..']
    }
  }
})