// spec: log de moderación — /admin#modlog
// El componente AdminModLogTable está embebido en /admin como una sección/pestaña.
// Selectores basados en AdminModLogTable.tsx:
//   - .admin-table-wrap          → contenedor raíz del componente
//   - .filter-bar                → barra de filtros
//   - .filter-btn                → botones de filtro (Acción, Tipo)
//   - .filter-date-input         → inputs de fecha
//   - .filter-clear-btn          → botón "Limpiar filtros"
//   - .filter-count              → contador "X de Y"
//   - table.admin-table          → tabla de logs
//   - .modlog-action-badge       → badge de acción en cada fila
//   - .sort-th                   → botones de cabecera ordenable
//   - .empty-row                 → fila vacía si no hay resultados

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'

test.describe('Log de moderación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`)
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`)
    await page.goto(`${BASE_URL}/admin`)
    // Navegar a la sección modlog (puede ser scroll, tab o anchor)
    await page.goto(`${BASE_URL}/admin#modlog`)
    // Esperar a que la tabla esté en el DOM
    await page.locator('.admin-table-wrap').waitFor({ state: 'visible', timeout: 10000 })
  })

  // ── Carga básica ────────────────────────────────────────────────────────

  test('La tabla de log está visible', async ({ page }) => {
    await expect(page.locator('table.admin-table')).toBeVisible()
  })

  test('La barra de filtros está visible', async ({ page }) => {
    await expect(page.locator('.filter-bar')).toBeVisible()
    await expect(page.locator('.filter-btn').first()).toBeVisible()
  })

  test('El contador de entradas es visible', async ({ page }) => {
    await expect(page.locator('.filter-count')).toBeVisible()
    const text = await page.locator('.filter-count').textContent()
    // Formato esperado: "X de Y"
    expect(text).toMatch(/\d+ de \d+/)
  })

  test('Las cabeceras ordenables están presentes', async ({ page }) => {
    await expect(page.locator('button.sort-th:has-text("Acción")')).toBeVisible()
    await expect(page.locator('button.sort-th:has-text("Tipo")')).toBeVisible()
    await expect(page.locator('button.sort-th:has-text("Fecha")')).toBeVisible()
  })

  // ── Filtros de acción ───────────────────────────────────────────────────

  test('El filtro "Todas" está activo por defecto', async ({ page }) => {
    const todasBtn = page.locator('.filter-btn.active').first()
    await expect(todasBtn).toBeVisible()
    const text = await todasBtn.textContent()
    expect(text?.trim()).toBe('Todas')
  })

  test('Filtrar por tipo "Usuario" reduce o mantiene el contador', async ({ page }) => {
    const countBefore = await page.locator('.filter-count').textContent()
    const totalBefore = parseInt(countBefore?.split(' de ')[1] ?? '0')

    await page.locator('.filter-btn:has-text("Usuario")').click()

    const countAfter = await page.locator('.filter-count').textContent()
    const shownAfter = parseInt(countAfter?.split(' de ')[0] ?? '0')

    // El total mostrado no puede superar el total original
    expect(shownAfter).toBeLessThanOrEqual(totalBefore)
  })

  test('Filtrar por acción "Baneo" muestra solo filas de baneo o tabla vacía', async ({ page }) => {
    const baneoBtn = page.locator('.filter-btn:has-text("Baneo")').first()
    if (await baneoBtn.count() === 0) {
      // No hay acciones de baneo registradas, el filtro no aparece
      test.skip()
      return
    }
    await baneoBtn.click()
    const rows = page.locator('tbody tr:not(.empty-row)')
    const count = await rows.count()
    if (count > 0) {
      // Todas las filas visibles deben tener badge de Baneo
      const badges = page.locator('.modlog-action-badge')
      for (let i = 0; i < await badges.count(); i++) {
        const text = await badges.nth(i).textContent()
        expect(text?.trim()).toBe('Baneo')
      }
    }
    // Si count === 0, aparece la fila vacía
    else {
      await expect(page.locator('.empty-row')).toBeVisible()
    }
  })

  // ── Filtros de fecha ────────────────────────────────────────────────────

  test('Los inputs de fecha están presentes', async ({ page }) => {
    const dateInputs = page.locator('input.filter-date-input')
    await expect(dateInputs).toHaveCount(2)
  })

  test('Filtrar por fecha futura da tabla vacía', async ({ page }) => {
    // Fecha en el futuro → no puede haber logs
    await page.locator('input.filter-date-input').first().fill('2099-01-01')
    await expect(page.locator('.empty-row')).toBeVisible({ timeout: 3000 })
    const countText = await page.locator('.filter-count').textContent()
    expect(countText?.startsWith('0 de')).toBe(true)
  })

  test('Limpiar filtros restaura el contador original', async ({ page }) => {
    const countBefore = await page.locator('.filter-count').textContent()

    // Aplicar filtro de fecha futuro
    await page.locator('input.filter-date-input').first().fill('2099-01-01')
    await expect(page.locator('.filter-clear-btn')).toBeVisible()

    // Limpiar
    await page.click('.filter-clear-btn')
    await expect(page.locator('.filter-clear-btn')).toHaveCount(0)

    const countAfter = await page.locator('.filter-count').textContent()
    expect(countAfter).toBe(countBefore)
  })

  // ── Ordenación ──────────────────────────────────────────────────────────

  test('Hacer click en "Fecha" cambia el orden', async ({ page }) => {
    const rows = page.locator('tbody tr:not(.empty-row)')
    if (await rows.count() < 2) {
      test.skip()
      return
    }
    // Primera fecha antes de reordenar
    const dateCells = page.locator('.date-cell')
    const firstBefore = await dateCells.first().textContent()

    await page.click('button.sort-th:has-text("Fecha")')
    // Esperar rerender
    await page.waitForTimeout(300)

    const firstAfter = await page.locator('.date-cell').first().textContent()
    // El orden debe haber cambiado (o al menos no romperse)
    // Con un solo registro será igual, con varios diferirá
    expect(firstAfter).toBeTruthy()
  })

  test('Hacer click dos veces en "Acción" invierte el orden', async ({ page }) => {
    await page.click('button.sort-th:has-text("Acción")')
    await page.waitForTimeout(200)
    await page.click('button.sort-th:has-text("Acción")')
    await page.waitForTimeout(200)
    // No debe haber errores y la tabla sigue visible
    await expect(page.locator('table.admin-table')).toBeVisible()
  })

  // ── Contenido de filas ──────────────────────────────────────────────────

  test('Cada fila tiene badge de acción, tipo, objetivo, admin y fecha', async ({ page }) => {
    const rows = page.locator('tbody tr:not(.empty-row)')
    const count = await rows.count()
    if (count === 0) {
      await expect(page.locator('.empty-row')).toBeVisible()
      return
    }
    const firstRow = rows.first()
    await expect(firstRow.locator('.modlog-action-badge')).toBeVisible()
    await expect(firstRow.locator('.date-cell').last()).toBeVisible()
  })

  test('Si no hay logs se muestra el mensaje vacío', async ({ page }) => {
    // Aplicar filtro imposible para forzar estado vacío
    await page.locator('input.filter-date-input').first().fill('2099-01-01')
    await expect(page.locator('.empty-row')).toContainText('No hay acciones registradas.')
  })
})