import { expect, test } from '@playwright/test';
import {
  writingDetailPath,
  workDetailPath,
} from '../support/parity-routes';

const failureResponse = JSON.stringify({
  code: 'XX000',
  details: null,
  hint: null,
  message: 'Controlled read failure',
});

const failureScenarios = [
  { name: 'about', path: '/about', table: 'about_items', backTo: '/' },
  { name: 'projects', path: '/projects', table: 'projects', backTo: '/' },
  { name: 'writing', path: '/writing', table: 'notes', backTo: '/' },
  {
    name: 'writing detail',
    path: writingDetailPath,
    table: 'notes',
    backTo: '/writing',
  },
  { name: 'work', path: '/work', table: 'work_experience', backTo: '/' },
  {
    name: 'work detail',
    path: workDetailPath,
    table: 'work_experience',
    backTo: '/work',
  },
  { name: 'now', path: '/now', table: 'now_items', backTo: '/' },
  { name: 'contact', path: '/contact', table: 'contact_methods', backTo: '/' },
];

for (const scenario of failureScenarios) {
  test(`${scenario.name} displays the public read failure state`, async ({ page }) => {
    await page.route(`**/rest/v1/${scenario.table}*`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: failureResponse,
      });
    });

    await page.goto(scenario.path, { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('alert')).toHaveText('Unable to load this page.');
    await expect(page.locator(`main a[href="${scenario.backTo}"]`)).toBeVisible();
    await expect(page.locator('main')).not.toContainText('Controlled read failure');
  });
}

test('writing detail preserves its missing-record state', async ({ page }) => {
  await page.goto('/writing/migration-parity-missing-note', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.getByText('Note not found', { exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('work detail preserves its missing-record state', async ({ page }) => {
  await page.goto('/work/00000000-0000-0000-0000-000000000000', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page.getByText('Experience not found', { exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('about preserves loaded items when only its video request fails', async ({ page }) => {
  await page.route('**/rest/v1/about_video*', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: failureResponse,
    });
  });

  await page.goto('/about', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('main h2').first()).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('main iframe')).toHaveCount(0);
});
