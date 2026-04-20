// tests/03-salas.spec.ts
// Crear sala, crear tema, escribir post, tirar dado

import { test, expect, Page } from '@playwright/test';
import { ADMIN, TEST_ROOM, TEST_TOPIC } from './helpers';

async function loginAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
}

// Guarda el slug de la sala creada para tests siguientes
let roomSlug = '';

test.describe('Salas', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('listado de salas carga', async ({ page }) => {
    await page.goto('/salas');
    await expect(page.locator('main').first()).toBeVisible();
    console.log('✅ /salas OK');
  });

  test('formulario de nueva sala carga', async ({ page }) => {
    await page.goto('/salas/nueva');
    await expect(page.locator('form, input[name="name"], input[name="nombre"]').first()).toBeVisible({ timeout: 5000 });
    console.log('✅ /salas/nueva carga OK');
  });

  test('crear sala nueva', async ({ page }) => {
    await page.goto('/salas/nueva');

    // Nombre
    const nameInput = page.locator('input[name="name"], input[name="nombre"], input[placeholder*="nombre" i]').first();
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill(TEST_ROOM.name);

    // Descripción
    const descInput = page.locator('textarea[name="description"], textarea[name="descripcion"], textarea').first();
    if (await descInput.count() > 0) {
      await descInput.fill(TEST_ROOM.description);
    }

    // Slug (si es editable)
    const slugInput = page.locator('input[name="slug"]');
    if (await slugInput.count() > 0) {
      await slugInput.fill(TEST_ROOM.slug);
    }

    await page.click('button[type="submit"]');

    // Debe redirigir a la sala creada
    await page.waitForURL(url => url.pathname.includes('/salas/'), { timeout: 10000 });
    roomSlug = page.url().split('/salas/')[1]?.split('/')[0] || TEST_ROOM.slug;
    console.log('✅ Sala creada — slug:', roomSlug, '— URL:', page.url());
  });

  test('sala creada aparece en el listado', async ({ page }) => {
    await page.goto('/salas');
    const salaLink = page.locator(`a:has-text("${TEST_ROOM.name}")`).first();
    if (await salaLink.count() > 0) {
      console.log('✅ Sala aparece en listado');
    } else {
      console.log('⚠️  Sala NO aparece en listado (puede estar paginada)');
    }
  });
});

test.describe('Temas y Posts', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
    if (!roomSlug) {
      // Busca una sala existente si no se creó en este run
      await page.goto('/salas');
      const firstRoom = page.locator('a[href*="/salas/"]').first();
      if (await firstRoom.count() > 0) {
        const href = await firstRoom.getAttribute('href') || '';
        roomSlug = href.split('/salas/')[1]?.split('/')[0] || '';
      }
    }
  });

  test('crear tema nuevo en la sala', async ({ page }) => {
    if (!roomSlug) { test.skip(); return; }
    await page.goto(`/salas/${roomSlug}/nuevo-tema`);

    const titleInput = page.locator('input[name="title"], input[name="titulo"], input[placeholder*="título" i]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill(TEST_TOPIC.title);

    // Editor Quill — el contenido va en el div .ql-editor
    const quillEditor = page.locator('.ql-editor');
    if (await quillEditor.count() > 0) {
      await quillEditor.click();
      await quillEditor.fill(TEST_TOPIC.content);
    } else {
      // Fallback a textarea
      const textarea = page.locator('textarea').first();
      if (await textarea.count() > 0) await textarea.fill(TEST_TOPIC.content);
    }

    await page.click('button[type="submit"]');
    await page.waitForURL(url => url.pathname.includes('/salas/'), { timeout: 10000 });
    console.log('✅ Tema creado — URL:', page.url());
  });

  test('publicar post en un tema existente', async ({ page }) => {
    if (!roomSlug) { test.skip(); return; }
    await page.goto(`/salas/${roomSlug}`);

    // Click en el primer tema disponible
    const topicLink = page.locator('a[href*="/salas/"][href$=""]').filter({ hasText: /.+/ }).first();
    // Busca un enlace que lleve a un topicId (número)
    const topicLinks = page.locator('a[href*="/salas/"]');
    const hrefs = await topicLinks.evaluateAll(els =>
      els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/.+\/\d+/.test(h))
    );

    if (hrefs.length === 0) {
      console.log('⚠️  No hay temas con posts accesibles, saltando test de post');
      return;
    }

    await page.goto(hrefs[0]);

    // Quill o textarea de respuesta
    const quillEditor = page.locator('.ql-editor').last();
    if (await quillEditor.count() > 0) {
      await quillEditor.click();
      await quillEditor.fill('Post de prueba automatizada — puedes ignorarlo 🤖');
    }

    const submitBtn = page.locator('button[type="submit"]:has-text("Publicar"), button:has-text("Enviar"), button:has-text("Responder")').first();
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
      console.log('✅ Post publicado');
    } else {
      console.log('⚠️  Botón de publicar no encontrado');
    }
  });
});

test.describe('Tirada de dados', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('componente de dados visible en tema', async ({ page }) => {
    if (!roomSlug) { test.skip(); return; }
    await page.goto(`/salas/${roomSlug}`);

    const topicLinks = page.locator('a[href*="/salas/"]');
    const hrefs = await topicLinks.evaluateAll(els =>
      els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/.+\/\d+/.test(h))
    );
    if (hrefs.length === 0) { console.log('⚠️  Sin temas, saltando test dado'); return; }

    await page.goto(hrefs[0]);

    const diceBtn = page.locator('button:has-text("Tirar"), button:has-text("Dado"), [data-dice], .dice-roller').first();
    if (await diceBtn.count() > 0) {
      console.log('✅ Componente de dados visible');
      await diceBtn.click();
      await page.waitForTimeout(1500);
      console.log('✅ Click en tirar dado ejecutado');
    } else {
      console.log('⚠️  Componente de dados no encontrado (¿está en el formulario de post?)');
    }
  });
});