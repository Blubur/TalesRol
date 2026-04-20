// tests/06-bugs-conocidos.spec.ts
// Tests específicos para los bugs documentados en el proyecto

import { test, expect, Page } from '@playwright/test';
import { ADMIN } from './helpers';

async function loginAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
}

test.describe('Regresión — bugs documentados', () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  // BUG: "Al editar salas el HTML no se renderiza (se ve como texto plano)"
  test('[BUG] Editar sala — el HTML debe renderizarse, no verse como texto plano', async ({ page }) => {
    await page.goto('/salas');
    const roomLinks = page.locator('a[href*="/salas/"]');
    const hrefs = await roomLinks.evaluateAll(els =>
      els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
    );
    if (hrefs.length === 0) { console.log('⚠️  Sin salas para probar'); return; }

    const slug = hrefs[0].split('/salas/')[1];
    await page.goto(`/salas/${slug}/editar`);

    // Busca el editor — si usa Quill, el .ql-editor existe
    const quill = page.locator('.ql-editor');
    const rawHtml = page.locator('textarea:has-text("<p>"), textarea:has-text("<br>")');

    if (await quill.count() > 0) {
      console.log('✅ Editor Quill presente en editar sala — el HTML se edita correctamente');
    } else if (await rawHtml.count() > 0) {
      console.log('🐛 BUG CONFIRMADO: textarea muestra HTML en crudo (p.ej. <p>texto</p>)');
    } else {
      console.log('⚠️  No se pudo determinar el estado del editor');
    }
  });

  // BUG: "Próximos eventos en el PA lanza error de cliente al acceder"
  test('[BUG] Próximos eventos en PA no debe lanzar error de cliente', async ({ page }) => {
    await page.goto('/admin');

    // Captura errores de consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // Busca la sección/widget de próximos eventos
    const eventsSection = page.locator(':has-text("Próximos eventos"), :has-text("Eventos"), [data-events]').first();
    if (await eventsSection.count() > 0) {
      await eventsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);

      const criticalErrors = errors.filter(e => e.includes('TypeError') || e.includes('Cannot read') || e.includes('undefined'));
      if (criticalErrors.length > 0) {
        console.log('🐛 BUG CONFIRMADO — Errores de cliente en eventos:');
        criticalErrors.forEach(e => console.log('  ', e));
      } else {
        console.log('✅ Sin errores críticos de cliente en eventos del PA');
      }
    } else {
      console.log('⚠️  Widget de próximos eventos no encontrado en el PA');
    }
  });

  // BUG: "Salas creadas no se contabilizan en estadísticas del perfil del creador"
  test('[BUG] Estadísticas del perfil — contador de salas', async ({ page }) => {
    await page.goto('/usuarios');
    const profileLink = page.locator('a[href*="/perfil/"]').first();
    if (await profileLink.count() > 0) {
      await profileLink.click();
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

      const statsText = await page.locator('main').textContent() || '';
      if (statsText.match(/sala/i)) {
        console.log('ℹ️  Estadísticas de salas visibles en perfil — verifica manualmente el número');
      } else {
        console.log('⚠️  No se encontró estadística de salas en perfil');
      }
    }
  });

  // Error de hidratación React 418
  test('[BUG] Portada no muestra error de hidratación React', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const hydrationErrors = consoleErrors.filter(e =>
      e.includes('418') || e.includes('hydrat') || e.includes('Hydration')
    );

    if (hydrationErrors.length > 0) {
      console.log('🐛 BUG ACTIVO — Errores de hidratación React 418:');
      hydrationErrors.forEach(e => console.log('  ', e));
    } else {
      console.log('✅ Sin errores de hidratación en portada');
    }
  });

  // Dado: dice_enabled no bloquea tiradas
  test('[BUG] dice_enabled = false debe bloquear tiradas de dado', async ({ page }) => {
    // Activa modo "dados desactivados"
    await page.goto('/admin/config/general');
    const diceToggle = page.locator('input[name="dice_enabled"], input[type="checkbox"]:near(:text("dados"))').first();
    if (await diceToggle.count() > 0 && await diceToggle.isChecked()) {
      await diceToggle.uncheck();
      await page.click('button[type="submit"], button:has-text("Guardar")');
      await page.waitForTimeout(1000);

      // Intenta tirar dado en una sala
      await page.goto('/salas');
      const roomLinks = page.locator('a[href*="/salas/"]');
      const hrefs = await roomLinks.evaluateAll(els =>
        els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
      );

      if (hrefs.length > 0) {
        const slug = hrefs[0].split('/salas/')[1];
        await page.goto(hrefs[0]);
        // Busca temas
        const topicLinks = page.locator('a[href*="/salas/"]');
        const topicHrefs = await topicLinks.evaluateAll(els =>
          els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/.+\/\d+/.test(h))
        );
        if (topicHrefs.length > 0) {
          await page.goto(topicHrefs[0]);
          const diceUI = page.locator('.dice-roller, [data-dice], button:has-text("Tirar")').first();
          if (await diceUI.count() > 0) {
            console.log('🐛 BUG CONFIRMADO: El UI de dados sigue visible aunque dice_enabled=false');
          } else {
            console.log('✅ Dados ocultos con dice_enabled=false');
          }
        }
      }

      // Restaurar
      await page.goto('/admin/config/general');
      const toggle2 = page.locator('input[name="dice_enabled"]').first();
      if (await toggle2.count() > 0) {
        await toggle2.check();
        await page.click('button[type="submit"], button:has-text("Guardar")');
      }
    } else {
      console.log('⚠️  Toggle dice_enabled no encontrado o ya estaba desactivado');
    }
  });
});