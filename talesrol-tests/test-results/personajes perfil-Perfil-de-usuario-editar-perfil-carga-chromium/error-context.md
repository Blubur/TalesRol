# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: personajes perfil.spec.ts >> Perfil de usuario >> editar perfil carga
- Location: tests\personajes perfil.spec.ts:59:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
Call log:
  - navigating to "http://localhost:3000/auth/login", waiting until "load"

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
  1   | // tests/04-personajes-perfil.spec.ts
  2   | // Personajes, perfil de usuario, wiki
  3   | 
  4   | import { test, expect, Page } from '@playwright/test';
  5   | import { ADMIN, TEST_CHARACTER, TEST_WIKI } from './helpers';
  6   | 
  7   | async function loginAdmin(page: Page) {
> 8   |   await page.goto('/auth/login');
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
  9   |   await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  10  |   await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  11  |   await page.click('button[type="submit"]');
  12  |   await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
  13  | }
  14  | 
  15  | // ─── PERSONAJES ───────────────────────────────────────────────────────────────
  16  | 
  17  | test.describe('Personajes', () => {
  18  |   test.beforeEach(async ({ page }) => {
  19  |     await loginAdmin(page);
  20  |   });
  21  | 
  22  |   test('listado de personajes carga', async ({ page }) => {
  23  |     await page.goto('/personajes');
  24  |     await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  25  |     console.log('✅ /personajes OK');
  26  |   });
  27  | 
  28  |   test('formulario de nuevo personaje carga', async ({ page }) => {
  29  |     await page.goto('/personajes/nuevo');
  30  |     await expect(page.locator('form, input').first()).toBeVisible({ timeout: 5000 });
  31  |     console.log('✅ /personajes/nuevo carga OK');
  32  |   });
  33  | 
  34  |   test('crear personaje nuevo', async ({ page }) => {
  35  |     await page.goto('/personajes/nuevo');
  36  | 
  37  |     const nameInput = page.locator('input[name="name"], input[name="nombre"], input[placeholder*="nombre" i]').first();
  38  |     await expect(nameInput).toBeVisible({ timeout: 5000 });
  39  |     await nameInput.fill(TEST_CHARACTER.name);
  40  | 
  41  |     const descInput = page.locator('textarea[name="description"], textarea[name="descripcion"], textarea').first();
  42  |     if (await descInput.count() > 0) {
  43  |       await descInput.fill(TEST_CHARACTER.description);
  44  |     }
  45  | 
  46  |     await page.click('button[type="submit"]');
  47  |     await page.waitForTimeout(2000);
  48  |     console.log('✅ Personaje creado — URL:', page.url());
  49  |   });
  50  | });
  51  | 
  52  | // ─── PERFIL ───────────────────────────────────────────────────────────────────
  53  | 
  54  | test.describe('Perfil de usuario', () => {
  55  |   test.beforeEach(async ({ page }) => {
  56  |     await loginAdmin(page);
  57  |   });
  58  | 
  59  |   test('editar perfil carga', async ({ page }) => {
  60  |     await page.goto('/perfil/editar');
  61  |     await expect(page.locator('form, input').first()).toBeVisible({ timeout: 5000 });
  62  |     console.log('✅ /perfil/editar OK');
  63  |   });
  64  | 
  65  |   test('página de privacidad carga', async ({ page }) => {
  66  |     await page.goto('/perfil/privacidad');
  67  |     await expect(page.locator('form, main').first()).toBeVisible({ timeout: 5000 });
  68  |     console.log('✅ /perfil/privacidad OK');
  69  |   });
  70  | 
  71  |   test('página de badges carga', async ({ page }) => {
  72  |     await page.goto('/perfil/badges');
  73  |     await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  74  |     console.log('✅ /perfil/badges OK');
  75  |   });
  76  | 
  77  |   test('perfil público de admin visible', async ({ page }) => {
  78  |     // Intenta con el username guardado o busca en la lista de usuarios
  79  |     await page.goto('/usuarios');
  80  |     const profileLink = page.locator('a[href*="/perfil/"]').first();
  81  |     if (await profileLink.count() > 0) {
  82  |       await profileLink.click();
  83  |       await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  84  |       console.log('✅ Perfil público visible — URL:', page.url());
  85  |     } else {
  86  |       console.log('⚠️  No se encontró link a perfil público');
  87  |     }
  88  |   });
  89  | });
  90  | 
  91  | // ─── WIKI ─────────────────────────────────────────────────────────────────────
  92  | 
  93  | test.describe('Wiki', () => {
  94  |   test.beforeEach(async ({ page }) => {
  95  |     await loginAdmin(page);
  96  |   });
  97  | 
  98  |   test('wiki de una sala carga', async ({ page }) => {
  99  |     await page.goto('/salas');
  100 |     const roomLinks = page.locator('a[href*="/salas/"]');
  101 |     const hrefs = await roomLinks.evaluateAll(els =>
  102 |       els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
  103 |     );
  104 | 
  105 |     if (hrefs.length === 0) { console.log('⚠️  No hay salas'); return; }
  106 | 
  107 |     const slug = hrefs[0].split('/salas/')[1];
  108 |     await page.goto(`/salas/${slug}/wiki`);
```