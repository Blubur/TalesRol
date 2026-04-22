# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Wiki nueva.spec.ts >> Crear página wiki >> Contiene editor Quill
- Location: tests\Wiki nueva.spec.ts:40:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.ql-editor')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.ql-editor')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
            - link "Sala de prueba automatizada" [ref=e71] [cursor=pointer]:
              - /url: /salas/sala-de-prueba-automatizada
              - generic [ref=e74]: Sala de prueba automatizada
            - link "A la media noche pasó solo noche" [ref=e75] [cursor=pointer]:
              - /url: /salas/a-la-media-noche-paso
              - generic [ref=e77]:
                - generic [ref=e78]: A la media noche pasó
                - generic [ref=e79]: solo noche
            - link "Cenizas blancas Fantasia angelical" [ref=e80] [cursor=pointer]:
              - /url: /salas/cenizas-blancas
              - generic [ref=e82]:
                - generic [ref=e83]: Cenizas blancas
                - generic [ref=e84]: Fantasia angelical
            - link "Perihelio tardío sci fi" [ref=e85] [cursor=pointer]:
              - /url: /salas/perihelio-tardio
              - generic [ref=e87]:
                - generic [ref=e88]: Perihelio tardío
                - generic [ref=e89]: sci fi
            - 'link "Josepa y Camila se van a Benidorm TW: Josepa en bañador" [ref=e90] [cursor=pointer]':
              - /url: /salas/josepa-y-camila-se-van-a-benidorm
              - generic [ref=e92]:
                - generic [ref=e93]: Josepa y Camila se van a Benidorm
                - generic [ref=e94]: "TW: Josepa en bañador"
        - button "Accesos Rápidos" [ref=e97] [cursor=pointer]:
          - img [ref=e99]
          - generic [ref=e101]: Accesos Rápidos
          - img [ref=e103]
      - main [ref=e105]:
        - generic [ref=e107]:
          - heading "404" [level=1] [ref=e108]
          - heading "This page could not be found." [level=2] [ref=e110]
    - contentinfo [ref=e111]:
      - generic [ref=e112]:
        - generic [ref=e113]:
          - generic [ref=e114]:
            - generic [ref=e115]: ✦
            - text: TalesRol
          - generic [ref=e116]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e117]:
          - link "Normas" [ref=e118] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e119] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e120] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e121]
```

# Test source

```ts
  1  | // spec: crear página wiki — /salas/[slug]/wiki/nueva
  2  | // Selectores basados en WikiPageForm.tsx:
  3  | //   - input.wpf-input (primero = título, segundo = categorías)
  4  | //   - .ql-editor (Quill, cargado dinámicamente)
  5  | //   - button.btn-primary (guardar)
  6  | //   - a.btn-ghost (cancelar/volver)
  7  | //   - input.wpf-checkbox (portada)
  8  | // No hay name en los inputs — usan estado React con value/onChange.
  9  | // ROOM_SLUG: ajustar a una sala real donde el admin sea owner.
  10 | 
  11 | import { test, expect } from '@playwright/test'
  12 | 
  13 | const BASE_URL  = process.env.BASE_URL  ?? 'https://tales-rol.vercel.app'
  14 | const ROOM_SLUG = process.env.ROOM_SLUG ?? 'salas'
  15 | 
  16 | test.describe('Crear página wiki', () => {
  17 |   test.beforeEach(async ({ page }) => {
  18 |     await page.goto(`${BASE_URL}/auth/login`)
  19 |     await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
  20 |     await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
  21 |     await page.click('button[type="submit"]')
  22 |     await page.waitForURL(`${BASE_URL}/`)
  23 |   })
  24 | 
  25 |   test('La página de nueva wiki carga con el formulario', async ({ page }) => {
  26 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  27 |     // El título de la página usa h1.wiki-form-title
  28 |     await expect(page.locator('h1.wiki-form-title')).toBeVisible({ timeout: 8000 })
  29 |     await expect(page.locator('h1.wiki-form-title')).toHaveText('Nueva página')
  30 |   })
  31 | 
  32 |   test('Contiene input de título', async ({ page }) => {
  33 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  34 |     // El primer input.wpf-input es el título
  35 |     const titleInput = page.locator('input.wpf-input').first()
  36 |     await expect(titleInput).toBeVisible({ timeout: 8000 })
  37 |     await expect(titleInput).toHaveAttribute('placeholder', /título|reino|PNJs/i)
  38 |   })
  39 | 
  40 |   test('Contiene editor Quill', async ({ page }) => {
  41 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  42 |     // Quill se carga dinámicamente (next/dynamic sin ssr)
> 43 |     await expect(page.locator('.ql-editor')).toBeVisible({ timeout: 10000 })
     |                                              ^ Error: expect(locator).toBeVisible() failed
  44 |   })
  45 | 
  46 |   test('Contiene input de categorías', async ({ page }) => {
  47 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  48 |     // El segundo input.wpf-input es categorías
  49 |     const inputs = page.locator('input.wpf-input')
  50 |     await expect(inputs).toHaveCount(2, { timeout: 8000 })
  51 |     await expect(inputs.nth(1)).toHaveAttribute('placeholder', /categorías|lore/i)
  52 |   })
  53 | 
  54 |   test('El botón de guardar existe y está habilitado', async ({ page }) => {
  55 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  56 |     const saveBtn = page.locator('button.btn-primary')
  57 |     await expect(saveBtn).toBeVisible({ timeout: 8000 })
  58 |     await expect(saveBtn).toBeEnabled()
  59 |     await expect(saveBtn).toContainText('Crear página')
  60 |   })
  61 | 
  62 |   test('El enlace de cancelar vuelve a la wiki', async ({ page }) => {
  63 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  64 |     const cancelLink = page.locator('a.btn-ghost')
  65 |     await expect(cancelLink).toBeVisible({ timeout: 8000 })
  66 |     const href = await cancelLink.getAttribute('href')
  67 |     expect(href).toContain(`/salas/${ROOM_SLUG}/wiki`)
  68 |   })
  69 | 
  70 |   test('El checkbox de portada existe', async ({ page }) => {
  71 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  72 |     await expect(page.locator('input.wpf-checkbox')).toBeVisible({ timeout: 8000 })
  73 |   })
  74 | 
  75 |   test('Puede rellenar el título y guardarlo', async ({ page }) => {
  76 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  77 | 
  78 |     const titleInput = page.locator('input.wpf-input').first()
  79 |     await titleInput.fill(`Página de prueba ${Date.now()}`)
  80 | 
  81 |     // Esperar Quill y escribir contenido mínimo
  82 |     await page.locator('.ql-editor').waitFor({ state: 'visible', timeout: 10000 })
  83 |     await page.click('.ql-editor')
  84 |     await page.keyboard.type('Contenido de prueba generado por Playwright.')
  85 | 
  86 |     await page.click('button.btn-primary')
  87 | 
  88 |     // Tras guardar redirige a la página wiki creada
  89 |     await page.waitForURL(/\/salas\/.+\/wiki\//, { timeout: 10000 })
  90 |     await expect(page).toHaveURL(/\/salas\/.+\/wiki\//)
  91 |   })
  92 | 
  93 |   test('Sin sesión redirige al login', async ({ page, context }) => {
  94 |     await context.clearCookies()
  95 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  96 |     await expect(page).toHaveURL(/\/auth\/login/, { timeout: 8000 })
  97 |   })
  98 | })
```