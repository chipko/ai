import { defineConfig, devices } from '@playwright/test';
import { authFile, configPath, loadConfig } from './lib/config';

const booking = loadConfig();
const isMock = configPath.includes('mock');

export default defineConfig({
  testDir: './tests',
  // Bookings compete for the same slots, so run rows one at a time by default.
  // Raise with: npx playwright test --workers=4
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 120_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: booking.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'bookings',
      testMatch: /booking\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: authFile },
    },
  ],
  webServer: isMock
    ? { command: 'node mock-site/server.js', url: 'http://localhost:4321', reuseExistingServer: true }
    : undefined,
});
