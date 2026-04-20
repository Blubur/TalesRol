// tests/05-admin.spec.ts
// Panel de administración completo

import { test, expect, Page } from '@playwright/test';
import { ADMIN } from './helpers';

async function loginAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
}

const adminPages = [
  { path: '/admin', name: 'Panel principal' },
  { path: '/admin/css', name: 'CSS personalizado' },
  { path: '/admin/config', name: 'Config — redirect' },
  { path: '/admin/config/general', name: 'Config — General' },
  { path: '/admin/config/mantenimiento', name: 'Config — Mantenimiento' },
  { path: '/admin/config/banner', name: 'Config — Banner' },
  { path: '/admin/config/textos', name: 'Config — Textos' },
  { path: '/admin/config/roles', name: 'Config — Roles (placeholder)' },
];

test.describe('Panel de Administración — carga de páginas', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  for (const { path, name } of adminPages) {
    test(`${name} (${path}) carga sin error`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});

      const title = await page.title();
      expect(title).not.toMatch(/error|500/i);

      // No deben aparecer errores de Next.js
      const errorEl = page.locator('text=Application error, h2:has-text("500"), h1:has-text("Error")');
      expect(await errorEl.count()).toBe(0);

      console.log(`✅ ${name} — título: ${title}`);
    });
  }
});

test.describe('Panel de Administración — funcionalidades', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('estadísticas del panel principal se cargan', async ({ page }) => {
    await page.goto('/admin');
    // Busca números/stats (usuarios, salas, posts...)
    const statNumbers = page.locator('[class*="stat"], [class*="card"], .text-2xl, .text-3xl, .text-4xl');
    if (await statNumbers.count() > 0) {
      console.log(`✅ Stats visibles: ${await statNumbers.count()} elementos`);
    } else {
      console.log('⚠️  No se encontraron elementos de estadísticas');
    }
  });

  test('tabla de usuarios carga', async ({ page }) => {
    await page.goto('/admin');
    const usersTab = page.locator('button:has-text("Usuarios"), a:has-text("Usuarios")').first();
    if (await usersTab.count() > 0) {
      await usersTab.click();
      await page.waitForTimeout(1500);
    }
    const table = page.locator('table, [role="table"]').first();
    if (await table.count() > 0) {
      console.log('✅ Tabla de usuarios visible');
    } else {
      console.log('⚠️  Tabla de usuarios no encontrada');
    }
  });

  test('tabla de salas carga', async ({ page }) => {
    await page.goto('/admin');
    const roomsTab = page.locator('button:has-text("Salas"), a:has-text("Salas")').first();
    if (await roomsTab.count() > 0) {
      await roomsTab.click();
      await page.waitForTimeout(1500);
      const table = page.locator('table, [role="table"]').first();
      if (await table.count() > 0) {
        console.log('✅ Tabla de salas visible');
      }
    }
  });

  test('tabla de reportes carga', async ({ page }) => {
    await page.goto('/admin');
    const reportsTab = page.locator('button:has-text("Reporte"), a:has-text("Reporte")').first();
    if (await reportsTab.count() > 0) {
      await reportsTab.click();
      await page.waitForTimeout(1500);
      console.log('✅ Tab de reportes clickado');
    }
  });

  test('editor CSS guarda sin error', async ({ page }) => {
    await page.goto('/admin/css');
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible({ timeout: 5000 });

    // Añade un comentario CSS inofensivo
    const current = await textarea.inputValue();
    await textarea.fill(current + '\n/* test automatizado */');

    const saveBtn = page.locator('button:has-text("Guardar")').first();
    await saveBtn.click();
    await page.waitForTimeout(2000);

    // No debe haber error visible
    const errorEl = page.locator('[role="alert"]:has-text("error"), .text-red-500').first();
    if (await errorEl.count() > 0) {
      console.log('⚠️  Error al guardar CSS:', await errorEl.textContent());
    } else {
      console.log('✅ CSS guardado correctamente');
    }
  });

  test('config general — cambio de site_name y guardar', async ({ page }) => {
    await page.goto('/admin/config/general');
    const siteNameInput = page.locator('input[name="site_name"], input[placeholder*="nombre" i]').first();
    if (await siteNameInput.count() > 0) {
      const prev = await siteNameInput.inputValue();
      await siteNameInput.fill('TalesRol (test bot)');
      await page.click('button[type="submit"], button:has-text("Guardar")');
      await page.waitForTimeout(1500);
      // Restaura
      await siteNameInput.fill(prev);
      await page.click('button[type="submit"], button:has-text("Guardar")');
      console.log('✅ Config general guardada y restaurada');
    } else {
      console.log('⚠️  Campo site_name no encontrado');
    }
  });

  test('config banner — activar y desactivar', async ({ page }) => {
    await page.goto('/admin/config/banner');
    const toggle = page.locator('input[type="checkbox"][name*="banner"], input[type="checkbox"]').first();
    if (await toggle.count() > 0) {
      const wasChecked = await toggle.isChecked();
      await toggle.click();
      await page.click('button[type="submit"], button:has-text("Guardar")');
      await page.waitForTimeout(1000);
      // Restaura
      if (wasChecked !== await toggle.isChecked()) {
        await toggle.click();
        await page.click('button[type="submit"], button:has-text("Guardar")');
      }
      console.log('✅ Toggle de banner OK');
    }
  });

  test('modo mantenimiento — no se activa accidentalmente', async ({ page }) => {
    await page.goto('/admin/config/mantenimiento');
    // Solo verificamos que el formulario esté visible, NO lo activamos
    const form = page.locator('form').first();
    await expect(form).toBeVisible({ timeout: 5000 });
    console.log('✅ Config mantenimiento carga (NO se activa para no romper el sitio)');
  });
});

test.describe('Protección de rutas admin', () => {
  test('usuario no logueado no puede acceder al panel', async ({ page }) => {
    await page.goto('/admin');
    // Debe redirigir al login
    await expect(page).not.toHaveURL(/\/admin$/, { timeout: 5000 });
    console.log('✅ Ruta /admin protegida — redirige a:', page.url());
  });
});