import { defineConfig } from '@playwright/test';

export const parityProjects = [
  {
    name: 'mobile',
    use: { viewport: { width: 390, height: 844 } },
  },
  {
    name: 'tablet',
    use: { viewport: { width: 768, height: 1024 } },
  },
  {
    name: 'desktop',
    use: { viewport: { width: 1440, height: 900 } },
  },
];

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: '**/capture-production.spec.ts',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  snapshotPathTemplate: '{testDir}/references/{projectName}/{arg}{ext}',
  expect: {
    timeout: 20_000,
    toHaveScreenshot: {
      animations: 'allow',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    deviceScaleFactor: 1,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  projects: parityProjects,
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
