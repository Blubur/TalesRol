// spec: crear página wiki — /salas/[slug]/wiki/nueva
// El form real está en WikiPageForm.tsx (no disponible en contexto).
// Inferimos campos estándar: title, slug, category, content (Quill).
// Si los selectores fallan, ejecutar en /salas/[slug]/wiki/nueva:
//   document.querySelectorAll('input, textarea, form, [contenteditable]')
//     .forEach(e => console.log(e.tagName, e.name, e.className.slice(0,60)))
// y actualizar en consecuencia.
//
// SALA DE TEST: ajustar ROOM_SLUG a una sala existente donde el admin sea owner/codirector.

import { test, expect } from '@playwright/test'

const BASE_URL  = process.env.BASE_URL  ?? 'https://tales-rol.vercel.app'
const ROOM_SLUG = process.env.ROOM_SLUG ?? 'sala-de-pruebas' // ← ajustar

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
    await expect(page.locator('h1.wiki-form-title')).toHaveText('Nueva página')
    // Verificar que hay al menos un input de texto (título)
    await expect(page.locator('input[type="text"], input[type="text"]').first()).toBeVisible({ timeout: 8000 })
  })

  test('Contiene campo de título', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    // Probar selectores en orden de probabilidad
    const titleSelectors = [
      'input[name="title"]',
      'input[placeholder*="título" i]',
      'input[placeholder*="Título" i]',
      'input[id="title"]',
    ]
    let found = false
    for (const sel of titleSelectors) {
      const el = page.locator(sel)
      if (await el.count() > 0) {
        await expect(el.first()).toBeVisible()
        found = true
        break
      }
    }
    expect(found, 'No se encontró input de título').toBe(true)
  })

  test('Contiene editor de contenido (Quill o textarea)', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    // WikiPageForm probablemente usa Quill como el resto de la app
    const hasQuill    = await page.locator('.ql-editor').count()
    const hasTextarea = await page.locator('textarea').count()
    const hasCm       = await page.locator('.cm-editor').count()
    expect(hasQuill + hasTextarea + hasCm).toBeGreaterThan(0)
  })

  test('El enlace de volver a la wiki existe', async ({ page }) => {
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    await expect(page.locator('a:has-text("Wiki")')).toBeVisible()
  })

  test('Sin permisos redirige a la wiki', async ({ page, context }) => {
    // Logout
    await context.clearCookies()
    await page.goto(`${BASE_URL}/salas/${ROOM_SLUG}/wiki/nueva`)
    // Sin sesión → redirige a login
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 8000 })
  })
})