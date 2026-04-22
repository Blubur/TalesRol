# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Editor CSS personalizado >> Enlace de volver al panel existe
- Location: tests\admin.spec.ts:56:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a:has-text("Volver al panel")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a:has-text("Volver al panel")')

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
  1  | // spec: editor CSS — /admin/css
  2  | // Selector corregido: textarea → .cm-content (CodeMirror 6, no hay textarea)
  3  | // Para escribir: click en .cm-content + keyboard.type
  4  | // Para limpiar: Ctrl+A antes de escribir
  5  | 
  6  | import { test, expect } from '@playwright/test'
  7  | 
  8  | const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'
  9  | 
  10 | test.describe('Editor CSS personalizado', () => {
  11 |   test.beforeEach(async ({ page }) => {
  12 |     await page.goto(`${BASE_URL}/auth/login`)
  13 |     await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
  14 |     await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
  15 |     await page.click('button[type="submit"]')
  16 |     await page.waitForURL(`${BASE_URL}/`)
  17 |     await page.goto(`${BASE_URL}/admin/css`)
  18 |   })
  19 | 
  20 |   test('La página carga con el editor CodeMirror', async ({ page }) => {
  21 |     await expect(page.locator('.cm-editor')).toBeVisible({ timeout: 8000 })
  22 |     await expect(page.locator('.cm-content')).toBeVisible()
  23 |   })
  24 | 
  25 |   test('Botones de guardar e historial están presentes', async ({ page }) => {
  26 |     await expect(page.locator('button:has-text("Guardar y aplicar")')).toBeVisible()
  27 |     await expect(page.locator('button:has-text("Historial")')).toBeVisible()
  28 |   })
  29 | 
  30 |   test('Puede escribir CSS en el editor y guardar', async ({ page }) => {
  31 |     await page.locator('.cm-editor').waitFor({ state: 'visible', timeout: 8000 })
  32 | 
  33 |     // Hacer click en el área editable de CodeMirror
  34 |     await page.click('.cm-content')
  35 | 
  36 |     // Seleccionar todo y escribir CSS de prueba
  37 |     await page.keyboard.press('Control+A')
  38 |     await page.keyboard.type('/* test Playwright */ body { color: inherit; }')
  39 | 
  40 |     // Guardar
  41 |     await page.click('button:has-text("Guardar y aplicar")')
  42 | 
  43 |     // Esperar confirmación
  44 |     await expect(page.locator('text=CSS guardado')).toBeVisible({ timeout: 6000 })
  45 |   })
  46 | 
  47 |   test('El historial se despliega al hacer click', async ({ page }) => {
  48 |     await page.locator('.cm-editor').waitFor({ state: 'visible', timeout: 8000 })
  49 |     await page.click('button:has-text("Historial")')
  50 |     // Muestra versiones o mensaje de "no hay versiones"
  51 |     const hasVersions = await page.locator('button:has-text("Restaurar")').count()
  52 |     const hasEmpty    = await page.locator('text=no hay versiones').count()
  53 |     expect(hasVersions + hasEmpty).toBeGreaterThan(0)
  54 |   })
  55 | 
  56 |   test('Enlace de volver al panel existe', async ({ page }) => {
> 57 |     await expect(page.locator('a:has-text("Volver al panel")')).toBeVisible()
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
  58 |   })
  59 | })
```