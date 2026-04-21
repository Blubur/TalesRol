# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: salas.spec.ts >> Salas >> crear sala nueva
- Location: tests\salas.spec.ts:35:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="name"], input[name="nombre"], input[placeholder*="nombre" i]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="name"], input[name="nombre"], input[placeholder*="nombre" i]').first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e5]:
        - link "✦ Talesrol" [ref=e6] [cursor=pointer]:
          - /url: /
          - generic [ref=e7]: ✦
          - generic [ref=e8]: Talesrol
        - generic [ref=e9]:
          - link "Inicio" [ref=e10] [cursor=pointer]:
            - /url: /
            - img [ref=e11]
            - text: Inicio
          - link "Salas" [ref=e13] [cursor=pointer]:
            - /url: /salas
            - img [ref=e14]
            - text: Salas
          - link "Anuncios" [ref=e16] [cursor=pointer]:
            - /url: /anuncios
            - img [ref=e17]
            - text: Anuncios
        - generic [ref=e19]:
          - button "Modo claro" [ref=e20] [cursor=pointer]:
            - img [ref=e21]
          - button "Notificaciones" [ref=e24] [cursor=pointer]:
            - img [ref=e25]
          - link "Mensajes" [ref=e27] [cursor=pointer]:
            - /url: /mensajes
            - img [ref=e28]
          - button "aventurera aventurera" [ref=e31] [cursor=pointer]:
            - img "aventurera" [ref=e32]
            - generic [ref=e33]: aventurera
            - img [ref=e34]
    - generic [ref=e36]:
      - complementary [ref=e37]:
        - button "Colapsar" [ref=e38] [cursor=pointer]:
          - img [ref=e39]
        - generic [ref=e41]:
          - button "Administración" [expanded] [ref=e42] [cursor=pointer]:
            - img [ref=e44]
            - generic [ref=e47]: Administración
            - img [ref=e49]
          - generic [ref=e52]:
            - link "Panel de Admin" [ref=e53] [cursor=pointer]:
              - /url: /admin
              - text: Panel de Admin
            - link "Configuración" [ref=e55] [cursor=pointer]:
              - /url: /admin/config/general
              - text: Configuración
        - generic [ref=e58]:
          - button "Salas Activas Ver todas" [expanded] [ref=e59] [cursor=pointer]:
            - img [ref=e61]
            - generic [ref=e63]: Salas Activas
            - link "Ver todas" [ref=e65]:
              - /url: /salas
            - img [ref=e67]
          - generic [ref=e70]:
            - link "A la media noche pasó solo noche" [ref=e71] [cursor=pointer]:
              - /url: /salas/a-la-media-noche-paso
              - generic [ref=e73]:
                - generic [ref=e74]: A la media noche pasó
                - generic [ref=e75]: solo noche
            - link "Cenizas blancas Fantasia angelical" [ref=e76] [cursor=pointer]:
              - /url: /salas/cenizas-blancas
              - generic [ref=e78]:
                - generic [ref=e79]: Cenizas blancas
                - generic [ref=e80]: Fantasia angelical
            - link "Perihelio tardío sci fi" [ref=e81] [cursor=pointer]:
              - /url: /salas/perihelio-tardio
              - generic [ref=e83]:
                - generic [ref=e84]: Perihelio tardío
                - generic [ref=e85]: sci fi
            - 'link "Josepa y Camila se van a Benidorm TW: Josepa en bañador" [ref=e86] [cursor=pointer]':
              - /url: /salas/josepa-y-camila-se-van-a-benidorm
              - generic [ref=e88]:
                - generic [ref=e89]: Josepa y Camila se van a Benidorm
                - generic [ref=e90]: "TW: Josepa en bañador"
        - button "Accesos Rápidos" [ref=e93] [cursor=pointer]:
          - img [ref=e95]
          - generic [ref=e97]: Accesos Rápidos
          - img [ref=e99]
      - main [ref=e101]:
        - generic [ref=e102]:
          - generic [ref=e103]:
            - link "← Volver a Salas" [ref=e104] [cursor=pointer]:
              - /url: /salas
            - heading "Nueva Sala de Rol" [level=1] [ref=e105]
          - generic [ref=e106]:
            - generic [ref=e107]:
              - generic [ref=e108]:
                - generic [ref=e109]: Título de la Sala *
                - textbox "Título de la Sala *" [active] [ref=e110]:
                  - /placeholder: "Ej: Las Crónicas de Valdris"
                - generic [ref=e111]: El slug (URL) se generará automáticamente desde el título
              - generic [ref=e112]:
                - generic [ref=e113]: Descripción (opcional)
                - textbox "Descripción (opcional)" [ref=e114]:
                  - /placeholder: Describe el mundo, la ambientación, el tipo de rol...
              - generic [ref=e115]:
                - generic [ref=e116]: URL del Banner (opcional)
                - textbox "URL del Banner (opcional)" [ref=e117]:
                  - /placeholder: https://ejemplo.com/banner.jpg
              - generic [ref=e118]:
                - generic [ref=e119]: Etiquetas / Content Warnings (opcional)
                - textbox "Etiquetas / Content Warnings (opcional)" [ref=e120]:
                  - /placeholder: "Ej: Fantasía, TW: Violencia, Adultos"
                - generic [ref=e121]: Separa las etiquetas con comas
            - generic [ref=e122]:
              - link "Cancelar" [ref=e123] [cursor=pointer]:
                - /url: /salas
              - button "Crear Sala" [ref=e124] [cursor=pointer]
    - contentinfo [ref=e125]:
      - generic [ref=e126]:
        - generic [ref=e127]:
          - generic [ref=e128]:
            - generic [ref=e129]: ✦
            - text: TalesRol
          - generic [ref=e130]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e131]:
          - link "Normas" [ref=e132] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e133] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e134] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e135]
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
  8   |   await page.goto('/auth/login');
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
  39  |     const nameInput = page.locator('input[name="name"], input[name="nombre"], input[placeholder*="nombre" i]').first();
> 40  |     await expect(nameInput).toBeVisible({ timeout: 5000 });
      |                             ^ Error: expect(locator).toBeVisible() failed
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
  109 |     console.log('✅ Tema creado — URL:', page.url());
  110 |   });
  111 | 
  112 |   test('publicar post en un tema existente', async ({ page }) => {
  113 |     if (!roomSlug) { test.skip(); return; }
  114 |     await page.goto(`/salas/${roomSlug}`);
  115 | 
  116 |     // Click en el primer tema disponible
  117 |     const topicLink = page.locator('a[href*="/salas/"][href$=""]').filter({ hasText: /.+/ }).first();
  118 |     // Busca un enlace que lleve a un topicId (número)
  119 |     const topicLinks = page.locator('a[href*="/salas/"]');
  120 |     const hrefs = await topicLinks.evaluateAll(els =>
  121 |       els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/.+\/\d+/.test(h))
  122 |     );
  123 | 
  124 |     if (hrefs.length === 0) {
  125 |       console.log('⚠️  No hay temas con posts accesibles, saltando test de post');
  126 |       return;
  127 |     }
  128 | 
  129 |     await page.goto(hrefs[0]);
  130 | 
  131 |     // Quill o textarea de respuesta
  132 |     const quillEditor = page.locator('.ql-editor').last();
  133 |     if (await quillEditor.count() > 0) {
  134 |       await quillEditor.click();
  135 |       await quillEditor.fill('Post de prueba automatizada — puedes ignorarlo 🤖');
  136 |     }
  137 | 
  138 |     const submitBtn = page.locator('button[type="submit"]:has-text("Publicar"), button:has-text("Enviar"), button:has-text("Responder")').first();
  139 |     if (await submitBtn.count() > 0) {
  140 |       await submitBtn.click();
```