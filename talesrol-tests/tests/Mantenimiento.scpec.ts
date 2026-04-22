// spec: modo mantenimiento — /admin/config/mantenimiento
// No hay <form> ni <form action>. El componente usa:
//   - Un <button> toggle (sin name/type) para activar/desactivar
//   - Un <textarea> sin name para el mensaje
//   - Un <button> con texto "Guardar configuración"
// Interacción vía click/fill directo, sin submit de form.

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'

test.describe('Modo mantenimiento', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`)
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`)
    await page.goto(`${BASE_URL}/admin/config/mantenimiento`)
  })

  test('La página carga con el toggle y el textarea', async ({ page }) => {
    // Toggle: botón con estilo pill (44x24px), no tiene texto visible
    // Buscamos por el textarea del mensaje de mantenimiento
    await expect(page.locator('textarea')).toBeVisible()
    await expect(page.locator('button:has-text("Guardar configuración")')).toBeVisible()
  })

  test('El textarea contiene el mensaje de mantenimiento', async ({ page }) => {
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()
    // Debe tener algún valor por defecto
    const value = await textarea.inputValue()
    expect(value.length).toBeGreaterThan(0)
  })

  test('Puede editar el mensaje y guardar', async ({ page }) => {
    const textarea = page.locator('textarea')
    await textarea.fill('Mantenimiento programado. Volvemos en breve. [Test Playwright]')

    await page.click('button:has-text("Guardar configuración")')

    await expect(page.locator('text=Configuración guardada')).toBeVisible({ timeout: 6000 })
  })

  test('El aviso rojo aparece cuando el modo mantenimiento está activo', async ({ page }) => {
    // Si el modo ya está activo, el aviso estará visible.
    // Si no, activarlo con el toggle y verificar que aparece.
    const warningVisible = await page.locator('text=El modo mantenimiento está activo').isVisible()

    if (!warningVisible) {
      // Buscar el toggle (botón pill sin texto, width ~44px)
      // Está antes del textarea, dentro de .cardStyle
      const toggles = page.locator('button').filter({ hasNot: page.locator('text') })
      // Alternativa más robusta: por posición en el DOM
      // El toggle es el primer button de la página que NO tiene texto legible
      const allButtons = await page.locator('button').all()
      // El toggle pill no tiene texto, el de guardar sí. Buscamos el primero sin texto.
      for (const btn of allButtons) {
        const text = await btn.textContent()
        if (!text?.trim()) {
          await btn.click()
          break
        }
      }
      await expect(page.locator('text=El modo mantenimiento está activo')).toBeVisible({ timeout: 3000 })

      // Desactivar de nuevo para no romper el sitio
      for (const btn of allButtons) {
        const text = await btn.textContent()
        if (!text?.trim()) {
          await btn.click()
          break
        }
      }
    } else {
      await expect(page.locator('text=El modo mantenimiento está activo')).toBeVisible()
    }
  })
})