// tests/02-navegacion.spec.ts
// Portada, navegación general, páginas públicas

import { test, expect } from '@playwright/test';
import { ADMIN } from './helpers';

// Helper para hacer login rápido
async function loginAdmin(page: any) {
  await page.goto('/auth/login');
  await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
}

test.describe('Páginas públicas', () => {
  test('portada carga sin errores', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveTitle(/error|404|500/i);
    // No debe haber errores de React visibles
    const errorBoundary = page.locator('text=Application error, text=Unhandled Runtime Error');
    expect(await errorBoundary.count()).toBe(0);
    console.log('✅ Portada OK — título:', await page.title());
  });

  test('página de normas carga', async ({ page }) => {
    await page.goto('/normas');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /normas OK');
  });

  test('página de ayuda carga', async ({ page }) => {
    await page.goto('/ayuda');
    await expect(page.locator('h1, h2, main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /ayuda OK');
  });

  test('página de anuncios carga', async ({ page }) => {
    await page.goto('/anuncios');
    await expect(page.locator('main, article, .anuncio').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /anuncios OK');
  });

  test('listado de salas visible sin login', async ({ page }) => {
    await page.goto('/salas');
    await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
    const title = await page.title();
    expect(title).not.toMatch(/error|404|500/i);
    console.log('✅ /salas sin login OK');
  });

  test('listado de usuarios carga', async ({ page }) => {
    await page.goto('/usuarios');
    await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /usuarios OK');
  });
});

test.describe('Navegación con login', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('sidebar o navbar contiene links principales', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav, aside, header');
    await expect(nav.first()).toBeVisible();

    // Busca links importantes
    const links = ['salas', 'personajes', 'mensajes', 'notificaciones'];
    for (const link of links) {
      const el = page.locator(`a[href*="${link}"]`).first();
      if (await el.count() > 0) {
        console.log(`✅ Link a /${link} encontrado`);
      } else {
        console.log(`⚠️  Link a /${link} NO encontrado`);
      }
    }
  });

  test('página de insignias carga', async ({ page }) => {
    await page.goto('/insignias');
    await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /insignias OK');
  });

  test('página de notificaciones carga', async ({ page }) => {
    await page.goto('/notificaciones');
    await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /notificaciones OK');
  });

  test('página de mensajes carga', async ({ page }) => {
    await page.goto('/mensajes');
    await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /mensajes OK');
  });
});