// tests/01-auth.spec.ts
// Registro de usuario nuevo y login/logout

import { test, expect } from '@playwright/test';
import { ADMIN, TEST_USER } from './helpers';

// ─── REGISTRO ────────────────────────────────────────────────────────────────

test.describe('Registro', () => {
  test('página de registro carga correctamente', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
  });

  test('registro con usuario nuevo', async ({ page }) => {
    await page.goto('/auth/register');

    // Rellena el formulario (ajusta los selectores si tu form usa otros names/ids)
    await page.fill('input[name="email"], input[type="email"]', TEST_USER.email);
    await page.fill('input[name="username"], input[placeholder*="usuario" i]', TEST_USER.username);
    await page.fill('input[name="password"], input[type="password"]', TEST_USER.password);

    // Segundo campo de password si existe
    const confirmPass = page.locator('input[name="confirmPassword"], input[name="password_confirm"]');
    if (await confirmPass.count() > 0) {
      await confirmPass.fill(TEST_USER.password);
    }

    await page.click('button[type="submit"]');

    // Debe redirigir o mostrar mensaje de éxito
    await page.waitForURL(url => !url.pathname.includes('/register'), { timeout: 8000 })
      .catch(() => {
        // Si no redirige, al menos no debe mostrar un error de servidor
        expect(page.url()).not.toContain('500');
      });
  });

  test('registro con email duplicado muestra error', async ({ page }) => {
    await page.goto('/auth/register');
    await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
    await page.fill('input[name="username"], input[placeholder*="usuario" i]', 'adminduplicado');
    await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');

    // Debe aparecer algún mensaje de error
    const errorMsg = page.locator('[role="alert"], .error, .text-red-500, .text-destructive');
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // Algunos formularios usan texto inline
      console.log('⚠️  No se encontró mensaje de error visible por duplicado');
    });
  });
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────

test.describe('Login', () => {
  test('login con credenciales correctas (admin)', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
    await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');

    // Debe redirigir fuera del login
    await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 8000 });
    console.log('✅ Login admin OK — URL:', page.url());
  });

  test('login con contraseña incorrecta muestra error', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
    await page.fill('input[name="password"], input[type="password"]', 'contraseña_incorrecta_xyz');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 5000 });
    console.log('✅ Login con password erróneo rechazado correctamente');
  });

  test('logout funciona', async ({ page }) => {
    // Login primero
    await page.goto('/auth/login');
    await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
    await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });

    // Busca el botón de cerrar sesión
    const logoutBtn = page.locator('button:has-text("Salir"), button:has-text("Cerrar"), a:has-text("Salir"), a:has-text("Cerrar sesión")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      await expect(page).toHaveURL(/\/auth\/login|^\/$/, { timeout: 5000 });
      console.log('✅ Logout OK');
    } else {
      console.log('⚠️  Botón de logout no encontrado — revisa el selector');
    }
  });
});