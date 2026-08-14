import { expect, test } from '@playwright/test';
import {
  parityRoutes,
  waitForRouteReady,
} from '../support/parity-routes';

for (const route of parityRoutes) {
  test(`${route.name} reaches its expected structure`, async ({ page }) => {
    const runtimeErrors: string[] = [];

    page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(`console: ${message.text()}`);
      }
    });

    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`${route.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    await waitForRouteReady(page, route);

    expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
  });
}
