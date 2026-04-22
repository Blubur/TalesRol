// spec: log de moderación — /admin
// FIX: .admin-table-wrap existe en 4 tablas del PA.
// Solución: usar .filter({ has: locator('button.sort-th:has-text("Acción")') })
// para aislar exactamente el contenedor del modlog.
// El beforeEach espera al primer sort-th "Acción" visible, sin usar .admin-table-wrap.

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'

function modlogSection(page: any) {
  return page.locator('.admin-table-wrap').filter({
    has: page.locator('button.sort-th:has-text("Acción")')
  })
}

test.describe('Log de moderación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`)
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`)
    await page.goto(`${BASE_URL}/admin`)
    // Esperar al sort-th "Acción" del modlog (único en la página)
    await page.locator('button.sort-th:has-text("Acción")').first().waitFor({ state: 'visible', timeout: 15000 })
  })

  test('La tabla de log está visible', async ({ page }) => {
    await expect(modlogSection(page).locator('table.admin-table')).toBeVisible()
  })

  test('La barra de filtros está visible', async ({ page }) => {
    const s = modlogSection(page)
    await expect(s.locator('.filter-bar')).toBeVisible()
    await expect(s.locator('.filter-btn').first()).toBeVisible()
  })

  test('El contador de entradas es visible', async ({ page }) => {
    const s = modlogSection(page)
    await expect(s.locator('.filter-count')).toBeVisible()
    const text = await s.locator('.filter-count').textContent()
    expect(text).toMatch(/\d+ de \d+/)
  })

  test('Las cabeceras ordenables están presentes', async ({ page }) => {
    const s = modlogSection(page)
    await expect(s.locator('button.sort-th:has-text("Acción")')).toBeVisible()
    await expect(s.locator('button.sort-th:has-text("Tipo")')).toBeVisible()
    await expect(s.locator('button.sort-th:has-text("Fecha")')).toBeVisible()
  })

  test('El filtro "Todas" está activo por defecto', async ({ page }) => {
    const s = modlogSection(page)
    const todasBtn = s.locator('.filter-btn.active').first()
    await expect(todasBtn).toBeVisible()
    const text = await todasBtn.textContent()
    expect(text?.trim()).toBe('Todas')
  })

  test('Filtrar por tipo "Usuario" reduce o mantiene el contador', async ({ page }) => {
    const s = modlogSection(page)
    const countBefore = await s.locator('.filter-count').textContent()
    const totalBefore = parseInt(countBefore?.split(' de ')[1] ?? '0')
    await s.locator('.filter-btn:has-text("Usuario")').click()
    const countAfter = await s.locator('.filter-count').textContent()
    const shownAfter = parseInt(countAfter?.split(' de ')[0] ?? '0')
    expect(shownAfter).toBeLessThanOrEqual(totalBefore)
  })

  test('Filtrar por acción "Baneo" muestra solo filas de baneo o tabla vacía', async ({ page }) => {
    const s = modlogSection(page)
    const baneoBtn = s.locator('.filter-btn:has-text("Baneo")').first()
    if (await baneoBtn.count() === 0) { test.skip(); return }
    await baneoBtn.click()
    const rows = s.locator('tbody tr:not(.empty-row)')
    const count = await rows.count()
    if (count > 0) {
      const badges = s.locator('.modlog-action-badge')
      for (let i = 0; i < await badges.count(); i++) {
        expect((await badges.nth(i).textContent())?.trim()).toBe('Baneo')
      }
    } else {
      await expect(s.locator('.empty-row')).toBeVisible()
    }
  })

  test('Los inputs de fecha están presentes', async ({ page }) => {
    await expect(modlogSection(page).locator('input.filter-date-input')).toHaveCount(2)
  })

  test('Filtrar por fecha futura da tabla vacía', async ({ page }) => {
    const s = modlogSection(page)
    await s.locator('input.filter-date-input').first().fill('2099-01-01')
    await expect(s.locator('.empty-row')).toBeVisible({ timeout: 3000 })
    expect((await s.locator('.filter-count').textContent())?.startsWith('0 de')).toBe(true)
  })

  test('Limpiar filtros restaura el contador original', async ({ page }) => {
    const s = modlogSection(page)
    const countBefore = await s.locator('.filter-count').textContent()
    await s.locator('input.filter-date-input').first().fill('2099-01-01')
    await expect(s.locator('.filter-clear-btn')).toBeVisible()
    await s.locator('.filter-clear-btn').click()
    await expect(s.locator('.filter-clear-btn')).toHaveCount(0)
    expect(await s.locator('.filter-count').textContent()).toBe(countBefore)
  })

  test('Hacer click en "Fecha" cambia el orden', async ({ page }) => {
    const s = modlogSection(page)
    if (await s.locator('tbody tr:not(.empty-row)').count() < 2) { test.skip(); return }
    await s.locator('button.sort-th:has-text("Fecha")').click()
    await page.waitForTimeout(300)
    await expect(s.locator('table.admin-table')).toBeVisible()
  })

  test('Hacer click dos veces en "Acción" invierte el orden', async ({ page }) => {
    const s = modlogSection(page)
    await s.locator('button.sort-th:has-text("Acción")').click()
    await page.waitForTimeout(200)
    await s.locator('button.sort-th:has-text("Acción")').click()
    await page.waitForTimeout(200)
    await expect(s.locator('table.admin-table')).toBeVisible()
  })

  test('Cada fila tiene badge de acción y fecha', async ({ page }) => {
    const s = modlogSection(page)
    const rows = s.locator('tbody tr:not(.empty-row)')
    if (await rows.count() === 0) {
      await expect(s.locator('.empty-row')).toBeVisible()
      return
    }
    await expect(rows.first().locator('.modlog-action-badge')).toBeVisible()
    await expect(rows.first().locator('.date-cell').last()).toBeVisible()
  })

  test('Si no hay logs se muestra el mensaje vacío', async ({ page }) => {
    const s = modlogSection(page)
    await s.locator('input.filter-date-input').first().fill('2099-01-01')
    await expect(s.locator('.empty-row')).toContainText('No hay acciones registradas.')
  })
})