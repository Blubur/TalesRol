# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Wiki nueva.spec.ts >> Crear página wiki >> La página de nueva wiki carga con el formulario
- Location: tests\Wiki nueva.spec.ts:25:7

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('h1.wiki-form-title')
Expected: "Nueva página"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('h1.wiki-form-title')

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
        - generic [ref=e103]:
          - heading "404" [level=1] [ref=e104]
          - heading "This page could not be found." [level=2] [ref=e106]
    - contentinfo [ref=e107]:
      - generic [ref=e108]:
        - generic [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]: ✦
            - text: TalesRol
          - generic [ref=e112]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e113]:
          - link "Normas" [ref=e114] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e115] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e116] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e117]
```

# Test source

```ts
  1  | // spec: crear página wiki — /salas/[slug]/wiki/nueva
  2  | // El form real está en WikiPageForm.tsx (no disponible en contexto).
  3  | // Inferimos campos estándar: title, slug, category, content (Quill).
  4  | // Si los selectores fallan, ejecutar en /salas/[slug]/wiki/nueva:
  5  | //   document.querySelectorAll('input, textarea, form, [contenteditable]')
  6  | //     .forEach(e => console.log(e.tagName, e.name, e.className.slice(0,60)))
  7  | // y actualizar en consecuencia.
  8  | //
  9  | // SALA DE TEST: ajustar ROOM_SLUG a una sala existente donde el admin sea owner/codirector.
  10 | 
  11 | import { test, expect } from '@playwright/test'
  12 | 
  13 | const BASE_URL  = process.env.BASE_URL  ?? 'https://tales-rol.vercel.app'
  14 | const ROOM_SLUG = process.env.ROOM_SLUG ?? 'sala-de-pruebas' // ← ajustar
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
> 27 |     await expect(page.locator('h1.wiki-form-title')).toHaveText('Nueva página')
     |                                                      ^ Error: expect(locator).toHaveText(expected) failed
  28 |     // Verificar que hay al menos un input de texto (título)
  29 |     await expect(page.locator('input[type="text"], input[type="text"]').first()).toBeVisible({ timeout: 8000 })
  30 |   })
  31 | 
  32 |   test('Contiene campo de título', async ({ page }) => {
  33 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  34 |     // Probar selectores en orden de probabilidad
  35 |     const titleSelectors = [
  36 |       'input[name="title"]',
  37 |       'input[placeholder*="título" i]',
  38 |       'input[placeholder*="Título" i]',
  39 |       'input[id="title"]',
  40 |     ]
  41 |     let found = false
  42 |     for (const sel of titleSelectors) {
  43 |       const el = page.locator(sel)
  44 |       if (await el.count() > 0) {
  45 |         await expect(el.first()).toBeVisible()
  46 |         found = true
  47 |         break
  48 |       }
  49 |     }
  50 |     expect(found, 'No se encontró input de título').toBe(true)
  51 |   })
  52 | 
  53 |   test('Contiene editor de contenido (Quill o textarea)', async ({ page }) => {
  54 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  55 |     // WikiPageForm probablemente usa Quill como el resto de la app
  56 |     const hasQuill    = await page.locator('.ql-editor').count()
  57 |     const hasTextarea = await page.locator('textarea').count()
  58 |     const hasCm       = await page.locator('.cm-editor').count()
  59 |     expect(hasQuill + hasTextarea + hasCm).toBeGreaterThan(0)
  60 |   })
  61 | 
  62 |   test('El enlace de volver a la wiki existe', async ({ page }) => {
  63 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  64 |     await expect(page.locator('a:has-text("Wiki")')).toBeVisible()
  65 |   })
  66 | 
  67 |   test('Sin permisos redirige a la wiki', async ({ page, context }) => {
  68 |     // Logout
  69 |     await context.clearCookies()
  70 |     await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
  71 |     // Sin sesión → redirige a login
  72 |     await expect(page).toHaveURL(/\/auth\/login/, { timeout: 8000 })
  73 |   })
  74 | })
```