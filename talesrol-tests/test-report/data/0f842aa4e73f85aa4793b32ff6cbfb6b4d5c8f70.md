# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bugs conocidos.spec.ts >> Regresión — bugs documentados >> [BUG] Editar sala — el HTML debe renderizarse, no verse como texto plano
- Location: tests\bugs conocidos.spec.ts:21:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
Call log:
  - navigating to "http://localhost:3000/auth/login", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "No se puede acceder a este sitio web" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - text: La página
      - strong [ref=e9]: localhost
      - text: ha rechazado la conexión.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Prueba a:"
      - list [ref=e12]:
        - listitem [ref=e13]: Comprobar la conexión
        - listitem [ref=e14]:
          - link "Comprobar el proxy y el cortafuegos" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Volver a cargar" [ref=e19] [cursor=pointer]
    - button "Detalles" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1   | // tests/06-bugs-conocidos.spec.ts
  2   | // Tests específicos para los bugs documentados en el proyecto
  3   | 
  4   | import { test, expect, Page } from '@playwright/test';
  5   | import { ADMIN } from './helpers';
  6   | 
  7   | async function loginAdmin(page: Page) {
> 8   |   await page.goto('/auth/login');
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
  9   |   await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  10  |   await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  11  |   await page.click('button[type="submit"]');
  12  |   await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
  13  | }
  14  | 
  15  | test.describe('Regresión — bugs documentados', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     await loginAdmin(page);
  18  |   });
  19  | 
  20  |   // BUG: "Al editar salas el HTML no se renderiza (se ve como texto plano)"
  21  |   test('[BUG] Editar sala — el HTML debe renderizarse, no verse como texto plano', async ({ page }) => {
  22  |     await page.goto('/salas');
  23  |     const roomLinks = page.locator('a[href*="/salas/"]');
  24  |     const hrefs = await roomLinks.evaluateAll(els =>
  25  |       els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
  26  |     );
  27  |     if (hrefs.length === 0) { console.log('⚠️  Sin salas para probar'); return; }
  28  | 
  29  |     const slug = hrefs[0].split('/salas/')[1];
  30  |     await page.goto(`/salas/${slug}/editar`);
  31  | 
  32  |     // Busca el editor — si usa Quill, el .ql-editor existe
  33  |     const quill = page.locator('.ql-editor');
  34  |     const rawHtml = page.locator('textarea:has-text("<p>"), textarea:has-text("<br>")');
  35  | 
  36  |     if (await quill.count() > 0) {
  37  |       console.log('✅ Editor Quill presente en editar sala — el HTML se edita correctamente');
  38  |     } else if (await rawHtml.count() > 0) {
  39  |       console.log('🐛 BUG CONFIRMADO: textarea muestra HTML en crudo (p.ej. <p>texto</p>)');
  40  |     } else {
  41  |       console.log('⚠️  No se pudo determinar el estado del editor');
  42  |     }
  43  |   });
  44  | 
  45  |   // BUG: "Próximos eventos en el PA lanza error de cliente al acceder"
  46  |   test('[BUG] Próximos eventos en PA no debe lanzar error de cliente', async ({ page }) => {
  47  |     await page.goto('/admin');
  48  | 
  49  |     // Captura errores de consola
  50  |     const errors: string[] = [];
  51  |     page.on('console', msg => {
  52  |       if (msg.type() === 'error') errors.push(msg.text());
  53  |     });
  54  | 
  55  |     // Busca la sección/widget de próximos eventos
  56  |     const eventsSection = page.locator(':has-text("Próximos eventos"), :has-text("Eventos"), [data-events]').first();
  57  |     if (await eventsSection.count() > 0) {
  58  |       await eventsSection.scrollIntoViewIfNeeded();
  59  |       await page.waitForTimeout(2000);
  60  | 
  61  |       const criticalErrors = errors.filter(e => e.includes('TypeError') || e.includes('Cannot read') || e.includes('undefined'));
  62  |       if (criticalErrors.length > 0) {
  63  |         console.log('🐛 BUG CONFIRMADO — Errores de cliente en eventos:');
  64  |         criticalErrors.forEach(e => console.log('  ', e));
  65  |       } else {
  66  |         console.log('✅ Sin errores críticos de cliente en eventos del PA');
  67  |       }
  68  |     } else {
  69  |       console.log('⚠️  Widget de próximos eventos no encontrado en el PA');
  70  |     }
  71  |   });
  72  | 
  73  |   // BUG: "Salas creadas no se contabilizan en estadísticas del perfil del creador"
  74  |   test('[BUG] Estadísticas del perfil — contador de salas', async ({ page }) => {
  75  |     await page.goto('/usuarios');
  76  |     const profileLink = page.locator('a[href*="/perfil/"]').first();
  77  |     if (await profileLink.count() > 0) {
  78  |       await profileLink.click();
  79  |       await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  80  | 
  81  |       const statsText = await page.locator('main').textContent() || '';
  82  |       if (statsText.match(/sala/i)) {
  83  |         console.log('ℹ️  Estadísticas de salas visibles en perfil — verifica manualmente el número');
  84  |       } else {
  85  |         console.log('⚠️  No se encontró estadística de salas en perfil');
  86  |       }
  87  |     }
  88  |   });
  89  | 
  90  |   // Error de hidratación React 418
  91  |   test('[BUG] Portada no muestra error de hidratación React', async ({ page }) => {
  92  |     const consoleErrors: string[] = [];
  93  |     page.on('console', msg => {
  94  |       if (msg.type() === 'error') consoleErrors.push(msg.text());
  95  |     });
  96  | 
  97  |     await page.goto('/');
  98  |     await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  99  |     await page.waitForTimeout(2000);
  100 | 
  101 |     const hydrationErrors = consoleErrors.filter(e =>
  102 |       e.includes('418') || e.includes('hydrat') || e.includes('Hydration')
  103 |     );
  104 | 
  105 |     if (hydrationErrors.length > 0) {
  106 |       console.log('🐛 BUG ACTIVO — Errores de hidratación React 418:');
  107 |       hydrationErrors.forEach(e => console.log('  ', e));
  108 |     } else {
```