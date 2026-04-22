# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Crear sala.spec.ts >> Crear sala >> Sin sesión redirige al login
- Location: tests\Crear sala.spec.ts:47:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/auth\/login/
Received string:  "https://tales-rol.vercel.app/salas/nueva"
Timeout: 8000ms

Call log:
  - Expect "toHaveURL" with timeout 8000ms
    11 × unexpected value "https://tales-rol.vercel.app/salas/nueva"

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
          - generic [ref=e23]:
            - link "Entrar" [ref=e24] [cursor=pointer]:
              - /url: /auth/login
            - link "Registrarse" [ref=e25] [cursor=pointer]:
              - /url: /auth/register
    - generic [ref=e26]:
      - complementary [ref=e27]:
        - button "Colapsar" [ref=e28] [cursor=pointer]:
          - img [ref=e29]
        - generic [ref=e31]:
          - button "Salas Activas Ver todas" [expanded] [ref=e32] [cursor=pointer]:
            - img [ref=e34]
            - generic [ref=e36]: Salas Activas
            - link "Ver todas" [ref=e38]:
              - /url: /salas
            - img [ref=e40]
          - generic [ref=e43]:
            - link "A la media noche pasó solo noche" [ref=e44] [cursor=pointer]:
              - /url: /salas/a-la-media-noche-paso
              - generic [ref=e46]:
                - generic [ref=e47]: A la media noche pasó
                - generic [ref=e48]: solo noche
            - link "Cenizas blancas Fantasia angelical" [ref=e49] [cursor=pointer]:
              - /url: /salas/cenizas-blancas
              - generic [ref=e51]:
                - generic [ref=e52]: Cenizas blancas
                - generic [ref=e53]: Fantasia angelical
            - link "Perihelio tardío sci fi" [ref=e54] [cursor=pointer]:
              - /url: /salas/perihelio-tardio
              - generic [ref=e56]:
                - generic [ref=e57]: Perihelio tardío
                - generic [ref=e58]: sci fi
            - 'link "Josepa y Camila se van a Benidorm TW: Josepa en bañador" [ref=e59] [cursor=pointer]':
              - /url: /salas/josepa-y-camila-se-van-a-benidorm
              - generic [ref=e61]:
                - generic [ref=e62]: Josepa y Camila se van a Benidorm
                - generic [ref=e63]: "TW: Josepa en bañador"
        - button "Accesos Rápidos" [ref=e66] [cursor=pointer]:
          - img [ref=e68]
          - generic [ref=e70]: Accesos Rápidos
          - img [ref=e72]
      - main [ref=e74]:
        - generic [ref=e75]:
          - generic [ref=e76]:
            - link "← Volver a Salas" [ref=e77] [cursor=pointer]:
              - /url: /salas
            - heading "Nueva Sala de Rol" [level=1] [ref=e78]
          - generic [ref=e79]:
            - generic [ref=e80]:
              - generic [ref=e81]:
                - generic [ref=e82]: Título de la Sala *
                - textbox "Título de la Sala *" [active] [ref=e83]:
                  - /placeholder: "Ej: Las Crónicas de Valdris"
                - generic [ref=e84]: El slug (URL) se generará automáticamente desde el título
              - generic [ref=e85]:
                - generic [ref=e86]: Descripción (opcional)
                - textbox "Descripción (opcional)" [ref=e87]:
                  - /placeholder: Describe el mundo, la ambientación, el tipo de rol...
              - generic [ref=e88]:
                - generic [ref=e89]: URL del Banner (opcional)
                - textbox "URL del Banner (opcional)" [ref=e90]:
                  - /placeholder: https://ejemplo.com/banner.jpg
              - generic [ref=e91]:
                - generic [ref=e92]: Etiquetas / Content Warnings (opcional)
                - textbox "Etiquetas / Content Warnings (opcional)" [ref=e93]:
                  - /placeholder: "Ej: Fantasía, TW: Violencia, Adultos"
                - generic [ref=e94]: Separa las etiquetas con comas
            - generic [ref=e95]:
              - link "Cancelar" [ref=e96] [cursor=pointer]:
                - /url: /salas
              - button "Crear Sala" [ref=e97] [cursor=pointer]
    - contentinfo [ref=e98]:
      - generic [ref=e99]:
        - generic [ref=e100]:
          - generic [ref=e101]:
            - generic [ref=e102]: ✦
            - text: TalesRol
          - generic [ref=e103]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e104]:
          - link "Normas" [ref=e105] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e106] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e107] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e108]
```

# Test source

```ts
  1  | // spec: crear sala — /salas/nueva
  2  | // Selectores basados en el formulario de nueva sala de TalesRol.
  3  | 
  4  | import { test, expect } from '@playwright/test'
  5  | import { ADMIN, TEST_ROOM } from './helpers'
  6  | 
  7  | const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'
  8  | 
  9  | test.describe('Crear sala', () => {
  10 |   test.beforeEach(async ({ page }) => {
  11 |     await page.goto(`${BASE_URL}/auth/login`)
  12 |     await page.fill('input[name="email"]', ADMIN.email)
  13 |     await page.fill('input[name="password"]', ADMIN.password)
  14 |     await page.click('button[type="submit"]')
  15 |     await page.waitForURL(`${BASE_URL}/`, { timeout: 15000 })
  16 |     await page.goto(`${BASE_URL}/salas/nueva`)
  17 |   })
  18 | 
  19 |   test('La página de nueva sala carga', async ({ page }) => {
  20 |     await expect(page).not.toHaveTitle(/error|404|500/i)
  21 |     await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 })
  22 |   })
  23 | 
  24 |   test('El formulario de nueva sala tiene campos básicos', async ({ page }) => {
  25 |     // Nombre / título de la sala
  26 |     const nameInput = page.locator(
  27 |       'input[name="name"], input[name="nombre"], input[name="title"], input[name="titulo"]'
  28 |     ).first()
  29 |     await expect(nameInput).toBeVisible({ timeout: 8000 })
  30 |   })
  31 | 
  32 |   test('El campo de nombre acepta texto', async ({ page }) => {
  33 |     const nameInput = page.locator(
  34 |       'input[name="name"], input[name="nombre"], input[name="title"], input[name="titulo"]'
  35 |     ).first()
  36 |     await expect(nameInput).toBeVisible({ timeout: 8000 })
  37 |     await nameInput.fill(TEST_ROOM.name)
  38 |     await expect(nameInput).toHaveValue(TEST_ROOM.name)
  39 |   })
  40 | 
  41 |   test('Existe botón de guardar/crear', async ({ page }) => {
  42 |     const submitBtn = page.locator('button[type="submit"], button:has-text("Crear"), button:has-text("Guardar")').first()
  43 |     await expect(submitBtn).toBeVisible({ timeout: 8000 })
  44 |     await expect(submitBtn).toBeEnabled()
  45 |   })
  46 | 
  47 |   test('Sin sesión redirige al login', async ({ page, context }) => {
  48 |     await context.clearCookies()
  49 |     await page.goto(`${BASE_URL}/salas/nueva`)
> 50 |     await expect(page).toHaveURL(/\/auth\/login/, { timeout: 8000 })
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  51 |   })
  52 | })
```