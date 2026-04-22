// spec: crear sala — /salas/nueva
// Selectores basados en el formulario de nueva sala de TalesRol.

import { test, expect } from '@playwright/test'
import { ADMIN, TEST_ROOM } from './helpers'

const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'

test.describe('Crear sala', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`)
    await page.fill('input[name="email"]', ADMIN.email)
    await page.fill('input[name="password"]', ADMIN.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(`${BASE_URL}/`, { timeout: 15000 })
    await page.goto(`${BASE_URL}/salas/nueva`)
  })

  test('La página de nueva sala carga', async ({ page }) => {
    await expect(page).not.toHaveTitle(/error|404|500/i)
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 })
  })

  test('El formulario de nueva sala tiene campos básicos', async ({ page }) => {
    // Nombre / título de la sala
    const nameInput = page.locator(
      'input[name="name"], input[name="nombre"], input[name="title"], input[name="titulo"]'
    ).first()
    await expect(nameInput).toBeVisible({ timeout: 8000 })
  })

  test('El campo de nombre acepta texto', async ({ page }) => {
    const nameInput = page.locator(
      'input[name="name"], input[name="nombre"], input[name="title"], input[name="titulo"]'
    ).first()
    await expect(nameInput).toBeVisible({ timeout: 8000 })
    await nameInput.fill(TEST_ROOM.name)
    await expect(nameInput).toHaveValue(TEST_ROOM.name)
  })

  test('Existe botón de guardar/crear', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"], button:has-text("Crear"), button:has-text("Guardar")').first()
    await expect(submitBtn).toBeVisible({ timeout: 8000 })
    await expect(submitBtn).toBeEnabled()
  })

  test('Sin sesión redirige al login', async ({ page, context }) => {
    await context.clearCookies()
    await page.goto(`${BASE_URL}/salas/nueva`)
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 8000 })
  })
})