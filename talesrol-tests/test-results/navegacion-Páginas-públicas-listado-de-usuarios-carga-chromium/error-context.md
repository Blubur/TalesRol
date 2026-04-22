# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navegacion.spec.ts >> Páginas públicas >> listado de usuarios carga
- Location: tests\navegacion.spec.ts:52:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('main').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]: ✦
      - heading "TalesRol" [level=1] [ref=e5]
      - paragraph [ref=e6]: Plataforma de Roleplay
    - generic [ref=e7]:
      - generic [ref=e8]:
        - heading "Iniciar Sesión" [level=2] [ref=e9]
        - paragraph [ref=e10]: Bienvenido de vuelta, aventurero
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: Correo electrónico
          - textbox "Correo electrónico" [ref=e14]:
            - /placeholder: tu@email.com
        - generic [ref=e15]:
          - generic [ref=e16]: Contraseña
          - textbox "Contraseña" [ref=e17]:
            - /placeholder: ••••••••
        - button "Entrar al Portal" [ref=e18] [cursor=pointer]
      - generic [ref=e20]: ✦
      - paragraph [ref=e21]:
        - text: ¿Aún no tienes cuenta?
        - link "Únete a TalesRol" [ref=e22] [cursor=pointer]:
          - /url: /auth/register
  - alert [ref=e23]
```

# Test source

```ts
  1  | // tests/02-navegacion.spec.ts
  2  | // Portada, navegación general, páginas públicas
  3  | 
  4  | import { test, expect } from '@playwright/test';
  5  | import { ADMIN } from './helpers';
  6  | 
  7  | // Helper para hacer login rápido
  8  | async function loginAdmin(page: any) {
  9  |   await page.goto('/auth/login');
  10 |   await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  11 |   await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  12 |   await page.click('button[type="submit"]');
  13 |   await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 20000 });
  14 | }
  15 | 
  16 | test.describe('Páginas públicas', () => {
  17 |   test('portada carga sin errores', async ({ page }) => {
  18 |     await page.goto('/');
  19 |     await expect(page).not.toHaveTitle(/error|404|500/i);
  20 |     // No debe haber errores de React visibles
  21 |     const errorBoundary = page.locator('text=Application error, text=Unhandled Runtime Error');
  22 |     expect(await errorBoundary.count()).toBe(0);
  23 |     console.log('✅ Portada OK — título:', await page.title());
  24 |   });
  25 | 
  26 |   test('página de normas carga', async ({ page }) => {
  27 |     await page.goto('/normas');
  28 |     await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 5000 });
  29 |     console.log('✅ /normas OK');
  30 |   });
  31 | 
  32 |   test('página de ayuda carga', async ({ page }) => {
  33 |     await page.goto('/ayuda');
  34 |     await expect(page.locator('h1, h2, main').first()).toBeVisible({ timeout: 5000 });
  35 |     console.log('✅ /ayuda OK');
  36 |   });
  37 | 
  38 |   test('página de anuncios carga', async ({ page }) => {
  39 |     await page.goto('/anuncios');
  40 |     await expect(page.locator('main, article, .anuncio').first()).toBeVisible({ timeout: 5000 });
  41 |     console.log('✅ /anuncios OK');
  42 |   });
  43 | 
  44 |   test('listado de salas visible sin login', async ({ page }) => {
  45 |     await page.goto('/salas');
  46 |     await expect(page.locator('.users-page, main').first()).toBeVisible({ timeout: 8000 })
  47 |     const title = await page.title();
  48 |     expect(title).not.toMatch(/error|404|500/i);
  49 |     console.log('✅ /salas sin login OK');
  50 |   });
  51 | 
  52 |   test('listado de usuarios carga', async ({ page }) => {
  53 |     await page.goto('/usuarios');
> 54 |     await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
     |                                                ^ Error: expect(locator).toBeVisible() failed
  55 |     console.log('✅ /usuarios OK');
  56 |   });
  57 | });
  58 | 
  59 | test.describe('Navegación con login', () => {
  60 |   test.beforeEach(async ({ page }) => {
  61 |     await loginAdmin(page);
  62 |   });
  63 | 
  64 |   test('sidebar o navbar contiene links principales', async ({ page }) => {
  65 |     await page.goto('/');
  66 |     const nav = page.locator('nav, aside, header');
  67 |     await expect(nav.first()).toBeVisible();
  68 | 
  69 |     // Busca links importantes
  70 |     const links = ['salas', 'personajes', 'mensajes', 'notificaciones'];
  71 |     for (const link of links) {
  72 |       const el = page.locator(`a[href*="${link}"]`).first();
  73 |       if (await el.count() > 0) {
  74 |         console.log(`✅ Link a /${link} encontrado`);
  75 |       } else {
  76 |         console.log(`⚠️  Link a /${link} NO encontrado`);
  77 |       }
  78 |     }
  79 |   });
  80 | 
  81 |   test('página de insignias carga', async ({ page }) => {
  82 |     await page.goto('/insignias');
  83 |     await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  84 |     console.log('✅ /insignias OK');
  85 |   });
  86 | 
  87 |   test('página de notificaciones carga', async ({ page }) => {
  88 |     await page.goto('/notificaciones');
  89 |     await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  90 |     console.log('✅ /notificaciones OK');
  91 |   });
  92 | 
  93 |   test('página de mensajes carga', async ({ page }) => {
  94 |     await page.goto('/mensajes');
  95 |     await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  96 |     console.log('✅ /mensajes OK');
  97 |   });
  98 | });
```