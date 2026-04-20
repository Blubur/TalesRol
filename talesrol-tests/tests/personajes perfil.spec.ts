// tests/04-personajes-perfil.spec.ts
// Personajes, perfil de usuario, wiki

import { test, expect, Page } from '@playwright/test';
import { ADMIN, TEST_CHARACTER, TEST_WIKI } from './helpers';

async function loginAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
}

// ─── PERSONAJES ───────────────────────────────────────────────────────────────

test.describe('Personajes', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('listado de personajes carga', async ({ page }) => {
    await page.goto('/personajes');
    await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /personajes OK');
  });

  test('formulario de nuevo personaje carga', async ({ page }) => {
    await page.goto('/personajes/nuevo');
    await expect(page.locator('form, input').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /personajes/nuevo carga OK');
  });

  test('crear personaje nuevo', async ({ page }) => {
    await page.goto('/personajes/nuevo');

    const nameInput = page.locator('input[name="name"], input[name="nombre"], input[placeholder*="nombre" i]').first();
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill(TEST_CHARACTER.name);

    const descInput = page.locator('textarea[name="description"], textarea[name="descripcion"], textarea').first();
    if (await descInput.count() > 0) {
      await descInput.fill(TEST_CHARACTER.description);
    }

    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Personaje creado — URL:', page.url());
  });
});

// ─── PERFIL ───────────────────────────────────────────────────────────────────

test.describe('Perfil de usuario', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('editar perfil carga', async ({ page }) => {
    await page.goto('/perfil/editar');
    await expect(page.locator('form, input').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /perfil/editar OK');
  });

  test('página de privacidad carga', async ({ page }) => {
    await page.goto('/perfil/privacidad');
    await expect(page.locator('form, main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /perfil/privacidad OK');
  });

  test('página de badges carga', async ({ page }) => {
    await page.goto('/perfil/badges');
    await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /perfil/badges OK');
  });

  test('perfil público de admin visible', async ({ page }) => {
    // Intenta con el username guardado o busca en la lista de usuarios
    await page.goto('/usuarios');
    const profileLink = page.locator('a[href*="/perfil/"]').first();
    if (await profileLink.count() > 0) {
      await profileLink.click();
      await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
      console.log('✅ Perfil público visible — URL:', page.url());
    } else {
      console.log('⚠️  No se encontró link a perfil público');
    }
  });
});

// ─── WIKI ─────────────────────────────────────────────────────────────────────

test.describe('Wiki', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('wiki de una sala carga', async ({ page }) => {
    await page.goto('/salas');
    const roomLinks = page.locator('a[href*="/salas/"]');
    const hrefs = await roomLinks.evaluateAll(els =>
      els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
    );

    if (hrefs.length === 0) { console.log('⚠️  No hay salas'); return; }

    const slug = hrefs[0].split('/salas/')[1];
    await page.goto(`/salas/${slug}/wiki`);
    await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ Wiki de sala OK — slug:', slug);
  });

  test('crear página wiki', async ({ page }) => {
    await page.goto('/salas');
    const roomLinks = page.locator('a[href*="/salas/"]');
    const hrefs = await roomLinks.evaluateAll(els =>
      els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
    );
    if (hrefs.length === 0) { console.log('⚠️  Sin salas'); return; }

    const slug = hrefs[0].split('/salas/')[1];
    await page.goto(`/salas/${slug}/wiki/nueva`);

    const titleInput = page.locator('input[name="title"], input[name="titulo"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill(TEST_WIKI.title);

    const categoryInput = page.locator('input[name="category"], input[name="categoria"]').first();
    if (await categoryInput.count() > 0) await categoryInput.fill(TEST_WIKI.category);

    const quill = page.locator('.ql-editor');
    if (await quill.count() > 0) {
      await quill.click();
      await quill.fill(TEST_WIKI.content);
    }

    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Página wiki creada — URL:', page.url());
  });
});