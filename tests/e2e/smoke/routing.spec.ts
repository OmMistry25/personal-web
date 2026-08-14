import { expect, test } from '@playwright/test';

test('admin root preserves the unauthenticated redirect baseline', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
});

test('protected admin route preserves the unauthenticated redirect baseline', async ({
  page,
}) => {
  await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
});

test('unknown route preserves the current empty-main baseline', async ({ page }) => {
  await page.goto('/migration-parity-unknown-route', {
    waitUntil: 'domcontentloaded',
  });

  await expect(page).toHaveURL(/\/migration-parity-unknown-route$/);
  await expect(page.locator('main')).toBeAttached();
  await expect(page.locator('main')).toBeHidden();
  await expect(page.locator('main > *')).toHaveCount(0);
});
