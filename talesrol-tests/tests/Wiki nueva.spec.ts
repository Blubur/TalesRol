// spec: crear página wiki — /salas/[slug]/wiki/nueva
// Selectores basados en WikiPageForm.tsx:
//   - input.wpf-input (primero = título, segundo = categorías)
//   - .ql-editor (Quill, cargado dinámicamente)
//   - button.btn-primary (guardar)
//   - a.btn-ghost (cancelar/volver)
//   - input.wpf-checkbox (portada)
// No hay name en los inputs — usan estado React con value/onChange.
// ROOM_SLUG: ajustar a una sala real donde el admin sea owner.

import { test, expect } from '@playwright/test'

const BASE_URL  = process.env.BASE_URL  ?? 'https://tales-rol.vercel.app'
const ROOM_SLUG = process.env.ROOM_SLUG ?? 'salas'

test.describe('Crear página wiki', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`)
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`)
  })

  test('La página de nueva wiki carga con el formulario', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    // El título de la página usa h1.wiki-form-title
    await expect(page.locator('h1.wiki-form-title')).toBeVisible({ timeout: 8000 })
    await expect(page.locator('h1.wiki-form-title')).toHaveText('Nueva página')
  })

  test('Contiene input de título', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    // El primer input.wpf-input es el título
    const titleInput = page.locator('input.wpf-input').first()
    await expect(titleInput).toBeVisible({ timeout: 8000 })
    await expect(titleInput).toHaveAttribute('placeholder', /título|reino|PNJs/i)
  })

  test('Contiene editor Quill', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    // Quill se carga dinámicamente (next/dynamic sin ssr)
    await expect(page.locator('.ql-editor')).toBeVisible({ timeout: 10000 })
  })

  test('Contiene input de categorías', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    // El segundo input.wpf-input es categorías
    const inputs = page.locator('input.wpf-input')
    await expect(inputs).toHaveCount(2, { timeout: 8000 })
    await expect(inputs.nth(1)).toHaveAttribute('placeholder', /categorías|lore/i)
  })

  test('El botón de guardar existe y está habilitado', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    const saveBtn = page.locator('button.btn-primary')
    await expect(saveBtn).toBeVisible({ timeout: 8000 })
    await expect(saveBtn).toBeEnabled()
    await expect(saveBtn).toContainText('Crear página')
  })

  test('El enlace de cancelar vuelve a la wiki', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    const cancelLink = page.locator('a.btn-ghost')
    await expect(cancelLink).toBeVisible({ timeout: 8000 })
    const href = await cancelLink.getAttribute('href')
    expect(href).toContain(`/salas/${ROOM_SLUG}/wiki`)
  })

  test('El checkbox de portada existe', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    await expect(page.locator('input.wpf-checkbox')).toBeVisible({ timeout: 8000 })
  })

  test('Puede rellenar el título y guardarlo', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)

    const titleInput = page.locator('input.wpf-input').first()
    await titleInput.fill(`Página de prueba ${Date.now()}`)

    // Esperar Quill y escribir contenido mínimo
    await page.locator('.ql-editor').waitFor({ state: 'visible', timeout: 10000 })
    await page.click('.ql-editor')
    await page.keyboard.type('Contenido de prueba generado por Playwright.')

    await page.click('button.btn-primary')

    // Tras guardar redirige a la página wiki creada
    await page.waitForURL(/\/salas\/.+\/wiki\//, { timeout: 10000 })
    await expect(page).toHaveURL(/\/salas\/.+\/wiki\//)
  })

  test('Sin sesión redirige al login', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 8000 })
  })
})