# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Registro >> registro con email duplicado muestra error
- Location: tests\auth.spec.ts:40:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/register
Call log:
  - navigating to "http://localhost:3000/auth/register", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "No se puede acceder a este sitio web" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - text: La página
      - strong [ref=e9]: localhost
      - text: ha rechazado la conexión.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Prueba a:"
      - list [ref=e12]:
        - listitem [ref=e13]: Comprobar la conexión
        - listitem [ref=e14]:
          - link "Comprobar el proxy y el cortafuegos" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Volver a cargar" [ref=e19] [cursor=pointer]
    - button "Detalles" [ref=e20] [cursor=pointer]
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
  20 |     await page.fill('input[name="email"], input[type="email"]', TEST_USER.email);
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
> 41 |     await page.goto('/auth/register');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/register
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
  81 |   await page.goto('/auth/login');
  82 |   await page.fill('input[name="email"]', ADMIN.email);
  83 |   await page.fill('input[name="password"]', ADMIN.password);
  84 |   await page.click('button[type="submit"]');
  85 |   await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 20000 });
  86 | 
  87 |   // Abre el menú de usuario
  88 |   await page.click('.navbar-avatar-btn');
  89 |   await page.waitForTimeout(300);
  90 | 
  91 |   // Click en Cerrar Sesión
  92 |   await page.click('button.dropdown-item.logout');
  93 |   await expect(page).toHaveURL(/\/auth\/login|^\/$/, { timeout: 10000 });
  94 |   console.log('✅ Logout OK');
  95 | });
  96 | });
```