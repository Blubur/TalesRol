# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: salas.spec.ts >> Salas >> formulario de nueva sala carga
- Location: tests\salas.spec.ts:29:7

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
  1   | // tests/03-salas.spec.ts
  2   | // Crear sala, crear tema, escribir post, tirar dado
  3   | 
  4   | import { test, expect, Page } from '@playwright/test';
  5   | import { ADMIN, TEST_ROOM, TEST_TOPIC } from './helpers';
  6   | 
  7   | async function loginAdmin(page: Page) {
> 8   |   await page.goto('/auth/login');
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
  9   |   await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  10  |   await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  11  |   await page.click('button[type="submit"]');
  12  |   await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 20000 });
  13  | }
  14  | 
  15  | // Guarda el slug de la sala creada para tests siguientes
  16  | let roomSlug = '';
  17  | 
  18  | test.describe('Salas', () => {
  19  |   test.beforeEach(async ({ page }) => {
  20  |     await loginAdmin(page);
  21  |   });
  22  | 
  23  |   test('listado de salas carga', async ({ page }) => {
  24  |     await page.goto('/salas');
  25  |     await expect(page.locator('main').first()).toBeVisible();
  26  |     console.log('✅ /salas OK');
  27  |   });
  28  | 
  29  |   test('formulario de nueva sala carga', async ({ page }) => {
  30  |     await page.goto('/salas/nueva');
  31  |     await expect(page.locator('form, input[name="name"], input[name="nombre"]').first()).toBeVisible({ timeout: 5000 });
  32  |     console.log('✅ /salas/nueva carga OK');
  33  |   });
  34  | 
  35  |   test('crear sala nueva', async ({ page }) => {
  36  |     await page.goto('/salas/nueva');
  37  | 
  38  |     // Nombre
  39  |     const nameInput = page.locator('input[name="title"]').first();
  40  |     await expect(nameInput).toBeVisible({ timeout: 5000 });
  41  |     await nameInput.fill(TEST_ROOM.name);
  42  | 
  43  |     // Descripción
  44  |     const descInput = page.locator('textarea[name="description"], textarea[name="descripcion"], textarea').first();
  45  |     if (await descInput.count() > 0) {
  46  |       await descInput.fill(TEST_ROOM.description);
  47  |     }
  48  | 
  49  |     // Slug (si es editable)
  50  |     const slugInput = page.locator('input[name="slug"]');
  51  |     if (await slugInput.count() > 0) {
  52  |       await slugInput.fill(TEST_ROOM.slug);
  53  |     }
  54  | 
  55  |     await page.click('button[type="submit"]');
  56  | 
  57  |     // Debe redirigir a la sala creada
  58  |     await page.waitForURL(url => url.pathname.includes('/salas/'), { timeout: 10000 });
  59  |     roomSlug = page.url().split('/salas/')[1]?.split('/')[0] || TEST_ROOM.slug;
  60  |     console.log('✅ Sala creada — slug:', roomSlug, '— URL:', page.url());
  61  |   });
  62  | 
  63  |   test('sala creada aparece en el listado', async ({ page }) => {
  64  |     await page.goto('/salas');
  65  |     const salaLink = page.locator(`a:has-text("${TEST_ROOM.name}")`).first();
  66  |     if (await salaLink.count() > 0) {
  67  |       console.log('✅ Sala aparece en listado');
  68  |     } else {
  69  |       console.log('⚠️  Sala NO aparece en listado (puede estar paginada)');
  70  |     }
  71  |   });
  72  | });
  73  | 
  74  | test.describe('Temas y Posts', () => {
  75  |   test.beforeEach(async ({ page }) => {
  76  |     await loginAdmin(page);
  77  |     if (!roomSlug) {
  78  |       // Busca una sala existente si no se creó en este run
  79  |       await page.goto('/salas');
  80  |       const firstRoom = page.locator('a[href*="/salas/"]').first();
  81  |       if (await firstRoom.count() > 0) {
  82  |         const href = await firstRoom.getAttribute('href') || '';
  83  |         roomSlug = href.split('/salas/')[1]?.split('/')[0] || '';
  84  |       }
  85  |     }
  86  |   });
  87  | 
  88  |   test('crear tema nuevo en la sala', async ({ page }) => {
  89  |     if (!roomSlug) { test.skip(); return; }
  90  |     await page.goto(`/salas/${roomSlug}/nuevo-tema`);
  91  | 
  92  |     const titleInput = page.locator('input[name="title"], input[name="titulo"], input[placeholder*="título" i]').first();
  93  |     await expect(titleInput).toBeVisible({ timeout: 5000 });
  94  |     await titleInput.fill(TEST_TOPIC.title);
  95  | 
  96  |     // Editor Quill — el contenido va en el div .ql-editor
  97  |     const quillEditor = page.locator('.ql-editor');
  98  |     if (await quillEditor.count() > 0) {
  99  |       await quillEditor.click();
  100 |       await quillEditor.fill(TEST_TOPIC.content);
  101 |     } else {
  102 |       // Fallback a textarea
  103 |       const textarea = page.locator('textarea').first();
  104 |       if (await textarea.count() > 0) await textarea.fill(TEST_TOPIC.content);
  105 |     }
  106 | 
  107 |     await page.click('button[type="submit"]');
  108 |     await page.waitForURL(url => url.pathname.includes('/salas/'), { timeout: 10000 });
```