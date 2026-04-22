# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Usuarios.spec.ts >> Listado de usuarios >> Los filtros de rol están presentes
- Location: tests\Usuarios.spec.ts:31:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button.role-filter-btn').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button.role-filter-btn').first()

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
  1  | // spec: listado de usuarios — /usuarios
  2  | // No hay <main>, <section> ni <article> como contenedor raíz identificable.
  3  | // El componente UsersClient usa:
  4  | //   - div.users-page  (raíz)
  5  | //   - div.users-header con h1.users-title ("Comunidad")
  6  | //   - input.users-search  (buscador)
  7  | //   - div.users-grid con a.user-card (tarjetas)
  8  | //   - div.users-roles con button.role-filter-btn (filtros de rol)
  9  | 
  10 | import { test, expect } from '@playwright/test'
  11 | 
  12 | const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'
  13 | 
  14 | test.describe('Listado de usuarios', () => {
  15 |   test('La página carga y muestra el título Comunidad', async ({ page }) => {
  16 |     await page.goto(`${BASE_URL}/usuarios`)
  17 |     await expect(page.locator('h1.users-title')).toBeVisible({ timeout: 8000 })
  18 |     await expect(page.locator('h1.users-title')).toHaveText('Comunidad')
  19 |   })
  20 | 
  21 |   test('El buscador está visible y funciona', async ({ page }) => {
  22 |     await page.goto(`${BASE_URL}/usuarios`)
  23 |     const search = page.locator('input.users-search')
  24 |     await expect(search).toBeVisible()
  25 |     await search.fill('admin')
  26 |     // La lista se filtra (puede quedar vacía si no hay usuario "admin")
  27 |     // Solo verificamos que el input acepta texto
  28 |     await expect(search).toHaveValue('admin')
  29 |   })
  30 | 
  31 |   test('Los filtros de rol están presentes', async ({ page }) => {
  32 |     await page.goto(`${BASE_URL}/usuarios`)
> 33 |     await expect(page.locator('button.role-filter-btn').first()).toBeVisible()
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  34 |     // Debe haber al menos el botón "Todos"
  35 |     await expect(page.locator('button.role-filter-btn:has-text("Todos")')).toBeVisible()
  36 |   })
  37 | 
  38 |   test('La grid de usuarios muestra al menos una tarjeta', async ({ page }) => {
  39 |     await page.goto(`${BASE_URL}/usuarios`)
  40 |     await expect(page.locator('.users-grid')).toBeVisible({ timeout: 8000 })
  41 |     const cards = page.locator('a.user-card')
  42 |     await expect(cards.first()).toBeVisible()
  43 |   })
  44 | 
  45 |   test('Las tarjetas de usuario enlazan a perfil', async ({ page }) => {
  46 |     await page.goto(`${BASE_URL}/usuarios`)
  47 |     const firstCard = page.locator('a.user-card').first()
  48 |     await expect(firstCard).toBeVisible({ timeout: 8000 })
  49 |     const href = await firstCard.getAttribute('href')
  50 |     expect(href).toMatch(/^\/perfil\//)
  51 |   })
  52 | 
  53 |   test('Filtrar por rol muestra resultados coherentes', async ({ page }) => {
  54 |     await page.goto(`${BASE_URL}/usuarios`)
  55 |     // Click en filtro "Admin"
  56 |     const adminBtn = page.locator('button.role-filter-btn:has-text("Admin")')
  57 |     if (await adminBtn.isVisible()) {
  58 |       await adminBtn.click()
  59 |       // Las tarjetas que quedan deben tener el badge de rol Admin
  60 |       const cards = page.locator('a.user-card')
  61 |       const count = await cards.count()
  62 |       // Si hay algún admin, verificar que aparece su rol
  63 |       if (count > 0) {
  64 |         await expect(cards.first().locator('.user-card-role')).toBeVisible()
  65 |       }
  66 |     }
  67 |   })
  68 | })
```