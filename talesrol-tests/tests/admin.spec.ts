// spec: editor CSS — /admin/css
// Selector corregido: textarea → .cm-content (CodeMirror 6, no hay textarea)
// Para escribir: click en .cm-content + keyboard.type
// Para limpiar: Ctrl+A antes de escribir

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'

test.describe('Editor CSS personalizado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`)
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`)
    await page.goto(`${BASE_URL}/admin/css`)
  })

  test('La página carga con el editor CodeMirror', async ({ page }) => {
    await expect(page.locator('.cm-editor')).toBeVisible({ timeout: 8000 })
    await expect(page.locator('.cm-content')).toBeVisible()
  })

  test('Botones de guardar e historial están presentes', async ({ page }) => {
    await expect(page.locator('button:has-text("Guardar y aplicar")')).toBeVisible()
    await expect(page.locator('button:has-text("Historial")')).toBeVisible()
  })

  test('Puede escribir CSS en el editor y guardar', async ({ page }) => {
    await page.locator('.cm-editor').waitFor({ state: 'visible', timeout: 8000 })

    // Hacer click en el área editable de CodeMirror
    await page.click('.cm-content')

    // Seleccionar todo y escribir CSS de prueba
    await page.keyboard.press('Control+A')
    await page.keyboard.type('/* test Playwright */ body { color: inherit; }')

    // Guardar
    await page.click('button:has-text("Guardar y aplicar")')

    // Esperar confirmación
    await expect(page.locator('text=CSS guardado')).toBeVisible({ timeout: 6000 })
  })

  test('El historial se despliega al hacer click', async ({ page }) => {
    await page.locator('.cm-editor').waitFor({ state: 'visible', timeout: 8000 })
    await page.click('button:has-text("Historial")')
    // Muestra versiones o mensaje de "no hay versiones"
    const hasVersions = await page.locator('button:has-text("Restaurar")').count()
    const hasEmpty    = await page.locator('text=no hay versiones').count()
    expect(hasVersions + hasEmpty).toBeGreaterThan(0)
  })

  test('Enlace de volver al panel existe', async ({ page }) => {
  await expect(page.locator('a[href="/admin"]')).toBeVisible()
})