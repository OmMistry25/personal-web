import { defineConfig } from '@playwright/test';
import { parityProjects } from './playwright.config';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/capture-production.spec.ts',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  timeout: 45_000,
  use: {
    baseURL: 'https://ommistry.netlify.app',
    browserName: 'chromium',
    deviceScaleFactor: 1,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  projects: parityProjects,
});
