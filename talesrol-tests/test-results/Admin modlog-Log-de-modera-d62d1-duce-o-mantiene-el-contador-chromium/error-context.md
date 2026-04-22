# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Admin modlog.spec.ts >> Log de moderación >> Filtrar por tipo "Usuario" reduce o mantiene el contador
- Location: tests\Admin modlog.spec.ts:61:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button.sort-th:has-text("Acción")').first() to be visible

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
  1   | // spec: log de moderación — /admin
  2   | // FIX: .admin-table-wrap existe en 4 tablas del PA.
  3   | // Solución: usar .filter({ has: locator('button.sort-th:has-text("Acción")') })
  4   | // para aislar exactamente el contenedor del modlog.
  5   | // El beforeEach espera al primer sort-th "Acción" visible, sin usar .admin-table-wrap.
  6   | 
  7   | import { test, expect } from '@playwright/test'
  8   | 
  9   | const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'
  10  | 
  11  | function modlogSection(page: any) {
  12  |   return page.locator('.admin-table-wrap').filter({
  13  |     has: page.locator('button.sort-th:has-text("Acción")')
  14  |   })
  15  | }
  16  | 
  17  | test.describe('Log de moderación', () => {
  18  |   test.beforeEach(async ({ page }) => {
  19  |     await page.goto(`${BASE_URL}/auth/login`)
  20  |     await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
  21  |     await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
  22  |     await page.click('button[type="submit"]')
  23  |     await page.waitForURL(`${BASE_URL}/`)
  24  |     await page.goto(`${BASE_URL}/admin`)
  25  |     // Esperar al sort-th "Acción" del modlog (único en la página)
> 26  |     await page.locator('button.sort-th:has-text("Acción")').first().waitFor({ state: 'visible', timeout: 15000 })
      |                                                                     ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  27  |   })
  28  | 
  29  |   test('La tabla de log está visible', async ({ page }) => {
  30  |     await expect(modlogSection(page).locator('table.admin-table')).toBeVisible()
  31  |   })
  32  | 
  33  |   test('La barra de filtros está visible', async ({ page }) => {
  34  |     const s = modlogSection(page)
  35  |     await expect(s.locator('.filter-bar')).toBeVisible()
  36  |     await expect(s.locator('.filter-btn').first()).toBeVisible()
  37  |   })
  38  | 
  39  |   test('El contador de entradas es visible', async ({ page }) => {
  40  |     const s = modlogSection(page)
  41  |     await expect(s.locator('.filter-count')).toBeVisible()
  42  |     const text = await s.locator('.filter-count').textContent()
  43  |     expect(text).toMatch(/\d+ de \d+/)
  44  |   })
  45  | 
  46  |   test('Las cabeceras ordenables están presentes', async ({ page }) => {
  47  |     const s = modlogSection(page)
  48  |     await expect(s.locator('button.sort-th:has-text("Acción")')).toBeVisible()
  49  |     await expect(s.locator('button.sort-th:has-text("Tipo")')).toBeVisible()
  50  |     await expect(s.locator('button.sort-th:has-text("Fecha")')).toBeVisible()
  51  |   })
  52  | 
  53  |   test('El filtro "Todas" está activo por defecto', async ({ page }) => {
  54  |     const s = modlogSection(page)
  55  |     const todasBtn = s.locator('.filter-btn.active').first()
  56  |     await expect(todasBtn).toBeVisible()
  57  |     const text = await todasBtn.textContent()
  58  |     expect(text?.trim()).toBe('Todas')
  59  |   })
  60  | 
  61  |   test('Filtrar por tipo "Usuario" reduce o mantiene el contador', async ({ page }) => {
  62  |     const s = modlogSection(page)
  63  |     const countBefore = await s.locator('.filter-count').textContent()
  64  |     const totalBefore = parseInt(countBefore?.split(' de ')[1] ?? '0')
  65  |     await s.locator('.filter-btn:has-text("Usuario")').click()
  66  |     const countAfter = await s.locator('.filter-count').textContent()
  67  |     const shownAfter = parseInt(countAfter?.split(' de ')[0] ?? '0')
  68  |     expect(shownAfter).toBeLessThanOrEqual(totalBefore)
  69  |   })
  70  | 
  71  |   test('Filtrar por acción "Baneo" muestra solo filas de baneo o tabla vacía', async ({ page }) => {
  72  |     const s = modlogSection(page)
  73  |     const baneoBtn = s.locator('.filter-btn:has-text("Baneo")').first()
  74  |     if (await baneoBtn.count() === 0) { test.skip(); return }
  75  |     await baneoBtn.click()
  76  |     const rows = s.locator('tbody tr:not(.empty-row)')
  77  |     const count = await rows.count()
  78  |     if (count > 0) {
  79  |       const badges = s.locator('.modlog-action-badge')
  80  |       for (let i = 0; i < await badges.count(); i++) {
  81  |         expect((await badges.nth(i).textContent())?.trim()).toBe('Baneo')
  82  |       }
  83  |     } else {
  84  |       await expect(s.locator('.empty-row')).toBeVisible()
  85  |     }
  86  |   })
  87  | 
  88  |   test('Los inputs de fecha están presentes', async ({ page }) => {
  89  |     await expect(modlogSection(page).locator('input.filter-date-input')).toHaveCount(2)
  90  |   })
  91  | 
  92  |   test('Filtrar por fecha futura da tabla vacía', async ({ page }) => {
  93  |     const s = modlogSection(page)
  94  |     await s.locator('input.filter-date-input').first().fill('2099-01-01')
  95  |     await expect(s.locator('.empty-row')).toBeVisible({ timeout: 3000 })
  96  |     expect((await s.locator('.filter-count').textContent())?.startsWith('0 de')).toBe(true)
  97  |   })
  98  | 
  99  |   test('Limpiar filtros restaura el contador original', async ({ page }) => {
  100 |     const s = modlogSection(page)
  101 |     const countBefore = await s.locator('.filter-count').textContent()
  102 |     await s.locator('input.filter-date-input').first().fill('2099-01-01')
  103 |     await expect(s.locator('.filter-clear-btn')).toBeVisible()
  104 |     await s.locator('.filter-clear-btn').click()
  105 |     await expect(s.locator('.filter-clear-btn')).toHaveCount(0)
  106 |     expect(await s.locator('.filter-count').textContent()).toBe(countBefore)
  107 |   })
  108 | 
  109 |   test('Hacer click en "Fecha" cambia el orden', async ({ page }) => {
  110 |     const s = modlogSection(page)
  111 |     if (await s.locator('tbody tr:not(.empty-row)').count() < 2) { test.skip(); return }
  112 |     await s.locator('button.sort-th:has-text("Fecha")').click()
  113 |     await page.waitForTimeout(300)
  114 |     await expect(s.locator('table.admin-table')).toBeVisible()
  115 |   })
  116 | 
  117 |   test('Hacer click dos veces en "Acción" invierte el orden', async ({ page }) => {
  118 |     const s = modlogSection(page)
  119 |     await s.locator('button.sort-th:has-text("Acción")').click()
  120 |     await page.waitForTimeout(200)
  121 |     await s.locator('button.sort-th:has-text("Acción")').click()
  122 |     await page.waitForTimeout(200)
  123 |     await expect(s.locator('table.admin-table')).toBeVisible()
  124 |   })
  125 | 
  126 |   test('Cada fila tiene badge de acción y fecha', async ({ page }) => {
```