# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Registro >> registro con usuario nuevo
- Location: tests\auth.spec.ts:16:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"], input[type="email"]')

```

# Page snapshot

```yaml
- main [ref=e3]:
  - paragraph [ref=e4]:
    - generic [ref=e5]:
      - strong [ref=e6]: "404"
      - text: ": NOT_FOUND"
    - generic [ref=e7]:
      - text: "Code:"
      - code [ref=e8]: "`DEPLOYMENT_NOT_FOUND`"
    - generic [ref=e9]:
      - text: "ID:"
      - code [ref=e10]: "`cdg1::jtksj-1776722785131-0b214c93d5b5`"
  - link "This deployment cannot be found. For more information and troubleshooting, see our documentation." [ref=e11] [cursor=pointer]:
    - /url: https://vercel.com/docs/errors/DEPLOYMENT_NOT_FOUND
    - generic [ref=e12]: This deployment cannot be found. For more information and troubleshooting, see our documentation.
```

# Test source

```ts
  1  | // tests/01-auth.spec.ts
  2  | // Registro de usuario nuevo y login/logout
  3  | 
  4  | import { test, expect } from '@playwright/test';
  5  | import { ADMIN, TEST_USER } from './helpers';
  6  | 
  7  | // ─── REGISTRO ────────────────────────────────────────────────────────────────
  8  | 
  9  | test.describe('Registro', () => {
  10 |   test('página de registro carga correctamente', async ({ page }) => {
  11 |     await page.goto('/auth/register');
  12 |     await expect(page).toHaveTitle(/.+/);
  13 |     await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
  14 |   });
  15 | 
  16 |   test('registro con usuario nuevo', async ({ page }) => {
  17 |     await page.goto('/auth/register');
  18 | 
  19 |     // Rellena el formulario (ajusta los selectores si tu form usa otros names/ids)
> 20 |     await page.fill('input[name="email"], input[type="email"]', TEST_USER.email);
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  21 |     await page.fill('input[name="username"], input[placeholder*="usuario" i]', TEST_USER.username);
  22 |     await page.fill('input[name="password"], input[type="password"]', TEST_USER.password);
  23 | 
  24 |     // Segundo campo de password si existe
  25 |     const confirmPass = page.locator('input[name="confirmPassword"], input[name="password_confirm"]');
  26 |     if (await confirmPass.count() > 0) {
  27 |       await confirmPass.fill(TEST_USER.password);
  28 |     }
  29 | 
  30 |     await page.click('button[type="submit"]');
  31 | 
  32 |     // Debe redirigir o mostrar mensaje de éxito
  33 |     await page.waitForURL(url => !url.pathname.includes('/register'), { timeout: 8000 })
  34 |       .catch(() => {
  35 |         // Si no redirige, al menos no debe mostrar un error de servidor
  36 |         expect(page.url()).not.toContain('500');
  37 |       });
  38 |   });
  39 | 
  40 |   test('registro con email duplicado muestra error', async ({ page }) => {
  41 |     await page.goto('/auth/register');
  42 |     await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  43 |     await page.fill('input[name="username"], input[placeholder*="usuario" i]', 'adminduplicado');
  44 |     await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  45 |     await page.click('button[type="submit"]');
  46 | 
  47 |     // Debe aparecer algún mensaje de error
  48 |     const errorMsg = page.locator('[role="alert"], .error, .text-red-500, .text-destructive');
  49 |     await expect(errorMsg.first()).toBeVisible({ timeout: 5000 }).catch(() => {
  50 |       // Algunos formularios usan texto inline
  51 |       console.log('⚠️  No se encontró mensaje de error visible por duplicado');
  52 |     });
  53 |   });
  54 | });
  55 | 
  56 | // ─── LOGIN ────────────────────────────────────────────────────────────────────
  57 | 
  58 | test.describe('Login', () => {
  59 |   test('login con credenciales correctas (admin)', async ({ page }) => {
  60 |     await page.goto('/auth/login');
  61 |     await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  62 |     await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  63 |     await page.click('button[type="submit"]');
  64 | 
  65 |     // Debe redirigir fuera del login
  66 |     await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 8000 });
  67 |     console.log('✅ Login admin OK — URL:', page.url());
  68 |   });
  69 | 
  70 |   test('login con contraseña incorrecta muestra error', async ({ page }) => {
  71 |     await page.goto('/auth/login');
  72 |     await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  73 |     await page.fill('input[name="password"], input[type="password"]', 'contraseña_incorrecta_xyz');
  74 |     await page.click('button[type="submit"]');
  75 | 
  76 |     await expect(page).toHaveURL(/\/auth\/login/, { timeout: 5000 });
  77 |     console.log('✅ Login con password erróneo rechazado correctamente');
  78 |   });
  79 | 
  80 |   test('logout funciona', async ({ page }) => {
  81 |     // Login primero
  82 |     await page.goto('/auth/login');
  83 |     await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  84 |     await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  85 |     await page.click('button[type="submit"]');
  86 |     await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
  87 | 
  88 |     // Busca el botón de cerrar sesión
  89 |     const logoutBtn = page.locator('button:has-text("Salir"), button:has-text("Cerrar"), a:has-text("Salir"), a:has-text("Cerrar sesión")');
  90 |     if (await logoutBtn.count() > 0) {
  91 |       await logoutBtn.first().click();
  92 |       await expect(page).toHaveURL(/\/auth\/login|^\/$/, { timeout: 5000 });
  93 |       console.log('✅ Logout OK');
  94 |     } else {
  95 |       console.log('⚠️  Botón de logout no encontrado — revisa el selector');
  96 |     }
  97 |   });
  98 | });
```