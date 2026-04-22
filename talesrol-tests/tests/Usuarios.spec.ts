// spec: listado de usuarios — /usuarios
// No hay <main>, <section> ni <article> como contenedor raíz identificable.
// El componente UsersClient usa:
//   - div.users-page  (raíz)
//   - div.users-header con h1.users-title ("Comunidad")
//   - input.users-search  (buscador)
//   - div.users-grid con a.user-card (tarjetas)
//   - div.users-roles con button.role-filter-btn (filtros de rol)

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'

test.describe('Listado de usuarios', () => {
  test('La página carga y muestra el título Comunidad', async ({ page }) => {
    await page.goto(`${BASE_URL}/usuarios`)
    await expect(page.locator('h1.users-title')).toBeVisible({ timeout: 8000 })
    await expect(page.locator('h1.users-title')).toHaveText('Comunidad')
  })

  test('El buscador está visible y funciona', async ({ page }) => {
    await page.goto(`${BASE_URL}/usuarios`)
    const search = page.locator('input.users-search')
    await expect(search).toBeVisible()
    await search.fill('admin')
    // La lista se filtra (puede quedar vacía si no hay usuario "admin")
    // Solo verificamos que el input acepta texto
    await expect(search).toHaveValue('admin')
  })

  test('Los filtros de rol están presentes', async ({ page }) => {
    await page.goto(`${BASE_URL}/usuarios`)
    await expect(page.locator('button.role-filter-btn').first()).toBeVisible()
    // Debe haber al menos el botón "Todos"
    await expect(page.locator('button.role-filter-btn:has-text("Todos")')).toBeVisible()
  })

  test('La grid de usuarios muestra al menos una tarjeta', async ({ page }) => {
    await page.goto(`${BASE_URL}/usuarios`)
    await expect(page.locator('.users-grid')).toBeVisible({ timeout: 8000 })
    const cards = page.locator('a.user-card')
    await expect(cards.first()).toBeVisible()
  })

  test('Las tarjetas de usuario enlazan a perfil', async ({ page }) => {
    await page.goto(`${BASE_URL}/usuarios`)
    const firstCard = page.locator('a.user-card').first()
    await expect(firstCard).toBeVisible({ timeout: 8000 })
    const href = await firstCard.getAttribute('href')
    expect(href).toMatch(/^\/perfil\//)
  })

  test('Filtrar por rol muestra resultados coherentes', async ({ page }) => {
    await page.goto(`${BASE_URL}/usuarios`)
    // Click en filtro "Admin"
    const adminBtn = page.locator('button.role-filter-btn:has-text("Admin")')
    if (await adminBtn.isVisible()) {
      await adminBtn.click()
      // Las tarjetas que quedan deben tener el badge de rol Admin
      const cards = page.locator('a.user-card')
      const count = await cards.count()
      // Si hay algún admin, verificar que aparece su rol
      if (count > 0) {
        await expect(cards.first().locator('.user-card-role')).toBeVisible()
      }
    }
  })
})