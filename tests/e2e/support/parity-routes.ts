import { expect, type Page } from '@playwright/test';

export type ParityRoute = {
  name: string;
  path: string;
  kind:
    | 'home'
    | 'about'
    | 'projects'
    | 'writing'
    | 'writing-detail'
    | 'work'
    | 'work-detail'
    | 'now'
    | 'contact'
    | 'admin-login';
};

export const writingDetailPath = '/writing/be-delusional';
export const workDetailPath = '/work/4524a5f3-5dcb-4103-9163-0c840875d98a';

export const parityRoutes: ParityRoute[] = [
  { name: 'home', path: '/', kind: 'home' },
  { name: 'about', path: '/about', kind: 'about' },
  { name: 'projects', path: '/projects', kind: 'projects' },
  { name: 'writing', path: '/writing', kind: 'writing' },
  {
    name: 'writing-detail',
    path: writingDetailPath,
    kind: 'writing-detail',
  },
  { name: 'work', path: '/work', kind: 'work' },
  { name: 'work-detail', path: workDetailPath, kind: 'work-detail' },
  { name: 'now', path: '/now', kind: 'now' },
  { name: 'contact', path: '/contact', kind: 'contact' },
  { name: 'admin-login', path: '/admin/login', kind: 'admin-login' },
];

export async function waitForRouteReady(page: Page, route: ParityRoute) {
  await expect(page.locator('main')).toBeVisible();

  switch (route.kind) {
    case 'home':
      await expect(
        page.getByRole('heading', {
          level: 1,
          name: 'I build simple things that matter.',
        }),
      ).toBeVisible();
      await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
      break;
    case 'about':
      await expect(page.locator('main iframe')).toBeVisible();
      await expect(page.locator('main h2').first()).toBeVisible();
      await expect(page.locator('main a[href="/"]')).toBeVisible();
      break;
    case 'projects':
      await expect(page.locator('main a[target="_blank"]').first()).toBeVisible();
      await expect(page.locator('main a[href="/"]')).toBeVisible();
      break;
    case 'writing':
      await expect(page.locator(`main a[href="${writingDetailPath}"]`)).toBeVisible();
      await expect(page.locator('main a[href="/"]')).toBeVisible();
      break;
    case 'writing-detail':
      await expect(page.locator('main article h1')).toHaveText('Be Delusional');
      await expect(page.locator('main article time')).toBeVisible();
      await expect(page.locator('main a[href="/writing"]')).toBeVisible();
      break;
    case 'work':
      await expect(page.locator(`main a[href="${workDetailPath}"]`)).toBeVisible();
      await expect(page.locator('main a[href="/"]')).toBeVisible();
      break;
    case 'work-detail':
      await expect(page.locator('main article h1')).toHaveText('Founding GTM Engineer');
      await expect(page.locator('main article h2')).toBeVisible();
      await expect(page.locator('main article time')).toBeVisible();
      await expect(page.locator('main a[href="/work"]')).toBeVisible();
      break;
    case 'now':
      await expect(page.locator('main h2').first()).toBeVisible();
      await expect(page.locator('main a[href="/"]')).toBeVisible();
      break;
    case 'contact':
      await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();
      await expect(page.locator('main a[href="/"]')).toBeVisible();
      break;
    case 'admin-login':
      await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
      await expect(page.getByPlaceholder('Email address')).toBeVisible();
      await expect(page.getByPlaceholder('Password')).toBeVisible();
      break;
  }

  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1_800);
}

export function externalVideoMask(page: Page, route: ParityRoute) {
  return route.kind === 'about' ? [page.locator('main iframe')] : [];
}
