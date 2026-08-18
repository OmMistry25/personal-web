import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import {
  externalVideoMask,
  parityRoutes,
  waitForRouteReady,
} from './support/parity-routes';

const allowReferenceUpdate = process.env.UPDATE_PRODUCTION_REFERENCES === '1';

for (const route of parityRoutes) {
  test(`capture ${route.name} production reference`, async ({ page }, testInfo) => {
    const runtimeErrors: string[] = [];
    const referencePath = resolve(
      process.cwd(),
      'tests/e2e/references',
      testInfo.project.name,
      `${route.name}.png`,
    );

    if (existsSync(referencePath) && !allowReferenceUpdate) {
      throw new Error(
        `Production reference already exists: ${referencePath}. ` +
          'Set UPDATE_PRODUCTION_REFERENCES=1 only when intentionally approving a baseline update.',
      );
    }

    page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(`console: ${message.text()}`);
      }
    });

    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await waitForRouteReady(page, route);

    mkdirSync(dirname(referencePath), { recursive: true });
    await page.screenshot({
      path: referencePath,
      animations: 'allow',
      caret: 'hide',
      fullPage: true,
      mask: externalVideoMask(page, route),
      maskColor: '#ff00ff',
    });

    expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
  });
}

test('production baseline keeps the unauthenticated admin-root redirect', async ({
  page,
}) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
});

test('production baseline keeps the unauthenticated protected-route redirect', async ({
  page,
}) => {
  await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
});

test('production baseline keeps unknown routes as an empty main element', async ({
  page,
}) => {
  await page.goto('/migration-parity-unknown-route', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page).toHaveURL(/\/migration-parity-unknown-route$/);
  await expect(page.locator('main')).toBeAttached();
  await expect(page.locator('main')).toBeHidden();
  await expect(page.locator('main > *')).toHaveCount(0);
});
