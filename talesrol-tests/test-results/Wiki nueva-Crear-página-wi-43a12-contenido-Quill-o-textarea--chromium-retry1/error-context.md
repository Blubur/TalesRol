# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Wiki nueva.spec.ts >> Crear página wiki >> Contiene editor de contenido (Quill o textarea)
- Location: tests\Wiki nueva.spec.ts:53:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
          - generic [ref=e23]:
            - link "Entrar" [ref=e24] [cursor=pointer]:
              - /url: /auth/login
            - link "Registrarse" [ref=e25] [cursor=pointer]:
              - /url: /auth/register
    - generic [ref=e26]:
      - complementary [ref=e27]:
        - button "Colapsar" [ref=e28] [cursor=pointer]:
          - img [ref=e29]
        - button "Salas Activas Ver todas" [expanded] [ref=e32] [cursor=pointer]:
          - img [ref=e34]
          - generic [ref=e36]: Salas Activas
          - link "Ver todas" [ref=e38]:
            - /url: /salas
          - img [ref=e40]
        - button "Accesos Rápidos" [ref=e50] [cursor=pointer]:
          - img [ref=e52]
          - generic [ref=e54]: Accesos Rápidos
          - img [ref=e56]
      - main [ref=e58]:
        - generic [ref=e60]:
          - heading "404" [level=1] [ref=e61]
          - heading "This page could not be found." [level=2] [ref=e63]
    - contentinfo [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]: ✦
            - text: TalesRol
          - generic [ref=e69]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e70]:
          - link "Normas" [ref=e71] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e72] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e73] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e74]
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
  27 |     await expect(page.locator('h1.wiki-form-title')).toHaveText('Nueva página')
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
> 59 |     expect(hasQuill + hasTextarea + hasCm).toBeGreaterThan(0)
     |                                            ^ Error: expect(received).toBeGreaterThan(expected)
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