import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  globalTeardown: './src/utils/global-teardown.ts',
  reporter: [
    ['html', { 
      outputFolder: 'test-results/playwright-report',
      attachmentsBaseURL: './', // Use relative paths for attachments
      open: 'never' // Don't auto-open browser
    }]
  ],
  use: {
    baseURL: 'https://www.ebay.com',
    headless: true,
    screenshot: 'only-on-failure', // or 'only-on-failure'
    video: 'off',      // <--- THIS IS CRITICAL
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: /@skip-webkit/, // Skip WebKit tests for now
    },
  ],
}); 