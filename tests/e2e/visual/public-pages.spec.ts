import { expect, test } from '@playwright/test';
import {
  externalVideoMask,
  parityRoutes,
  waitForRouteReady,
} from '../support/parity-routes';

for (const route of parityRoutes) {
  test(`${route.name} matches the production reference`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await waitForRouteReady(page, route);

    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      animations: 'allow',
      caret: 'hide',
      fullPage: true,
      mask: externalVideoMask(page, route),
      maskColor: '#ff00ff',
      maxDiffPixelRatio: 0.001,
    });
  });
}
