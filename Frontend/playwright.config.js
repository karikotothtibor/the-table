// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({

  testDir: './tests/e2e',

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 800 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
