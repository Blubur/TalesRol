# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Panel de Administración — funcionalidades >> editor CSS guarda sin error
- Location: tests\admin.spec.ts:102:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('textarea').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('textarea').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e5]:
        - link "✦ Talesrol" [ref=e6] [cursor=pointer]:
          - /url: /
          - generic [ref=e7]: ✦
          - generic [ref=e8]: Talesrol
        - generic [ref=e9]:
          - link "Inicio" [ref=e10] [cursor=pointer]:
            - /url: /
            - img [ref=e11]
            - text: Inicio
          - link "Salas" [ref=e13] [cursor=pointer]:
            - /url: /salas
            - img [ref=e14]
            - text: Salas
          - link "Anuncios" [ref=e16] [cursor=pointer]:
            - /url: /anuncios
            - img [ref=e17]
            - text: Anuncios
        - generic [ref=e19]:
          - button "Modo claro" [ref=e20] [cursor=pointer]:
            - img [ref=e21]
          - button "Notificaciones" [ref=e24] [cursor=pointer]:
            - img [ref=e25]
          - link "Mensajes" [ref=e27] [cursor=pointer]:
            - /url: /mensajes
            - img [ref=e28]
          - button "aventurera aventurera" [ref=e31] [cursor=pointer]:
            - img "aventurera" [ref=e32]
            - generic [ref=e33]: aventurera
            - img [ref=e34]
    - generic [ref=e36]:
      - complementary [ref=e37]:
        - button "Colapsar" [ref=e38] [cursor=pointer]:
          - img [ref=e39]
        - generic [ref=e41]:
          - button "Administración" [expanded] [ref=e42] [cursor=pointer]:
            - img [ref=e44]
            - generic [ref=e47]: Administración
            - img [ref=e49]
          - generic [ref=e52]:
            - link "Panel de Admin" [ref=e53] [cursor=pointer]:
              - /url: /admin
              - text: Panel de Admin
            - link "Configuración" [ref=e55] [cursor=pointer]:
              - /url: /admin/config/general
              - text: Configuración
        - generic [ref=e58]:
          - button "Salas Activas Ver todas" [expanded] [ref=e59] [cursor=pointer]:
            - img [ref=e61]
            - generic [ref=e63]: Salas Activas
            - link "Ver todas" [ref=e65]:
              - /url: /salas
            - img [ref=e67]
          - generic [ref=e70]:
            - link "A la media noche pasó solo noche" [ref=e71] [cursor=pointer]:
              - /url: /salas/a-la-media-noche-paso
              - generic [ref=e73]:
                - generic [ref=e74]: A la media noche pasó
                - generic [ref=e75]: solo noche
            - link "Cenizas blancas Fantasia angelical" [ref=e76] [cursor=pointer]:
              - /url: /salas/cenizas-blancas
              - generic [ref=e78]:
                - generic [ref=e79]: Cenizas blancas
                - generic [ref=e80]: Fantasia angelical
            - link "Perihelio tardío sci fi" [ref=e81] [cursor=pointer]:
              - /url: /salas/perihelio-tardio
              - generic [ref=e83]:
                - generic [ref=e84]: Perihelio tardío
                - generic [ref=e85]: sci fi
            - 'link "Josepa y Camila se van a Benidorm TW: Josepa en bañador" [ref=e86] [cursor=pointer]':
              - /url: /salas/josepa-y-camila-se-van-a-benidorm
              - generic [ref=e88]:
                - generic [ref=e89]: Josepa y Camila se van a Benidorm
                - generic [ref=e90]: "TW: Josepa en bañador"
        - button "Accesos Rápidos" [ref=e93] [cursor=pointer]:
          - img [ref=e95]
          - generic [ref=e97]: Accesos Rápidos
          - img [ref=e99]
      - main [ref=e101]:
        - generic [ref=e102]:
          - link "← Volver al panel" [ref=e104] [cursor=pointer]:
            - /url: /admin
          - generic [ref=e105]:
            - generic [ref=e106]:
              - heading "CSS personalizado" [level=2] [ref=e107]
              - generic [ref=e108]:
                - button "Historial (5)" [ref=e109]
                - button "Guardar y aplicar" [ref=e110] [cursor=pointer]
            - generic [ref=e113]:
              - generic [ref=e114]:
                - generic [ref=e115]:
                  - generic [ref=e116]: "1"
                  - generic [ref=e117]: "2"
                  - generic [ref=e118]: "3"
                  - generic [ref=e119]: "4"
                  - generic [ref=e120]: "5"
                  - generic [ref=e121]: "6"
                  - generic [ref=e122]: "7"
                  - generic [ref=e123]: "8"
                  - generic [ref=e124]: "9"
                  - generic [ref=e125]: "10"
                  - generic [ref=e126]: "11"
                  - generic [ref=e127]: "12"
                  - generic [ref=e128]: "13"
                  - generic [ref=e129]: "14"
                  - generic [ref=e130]: "15"
                  - generic [ref=e131]: "16"
                  - generic [ref=e132]: "17"
                  - generic [ref=e133]: "18"
                  - generic [ref=e134]: "19"
                  - generic [ref=e135]: "20"
                  - generic [ref=e136]: "21"
                  - generic [ref=e137]: "22"
                  - generic [ref=e138]: "23"
                  - generic [ref=e139]: "24"
                  - generic [ref=e140]: "25"
                  - generic [ref=e141]: "26"
                  - generic [ref=e142]: "27"
                  - generic [ref=e143]: "28"
                  - generic [ref=e144]: "29"
                  - generic [ref=e145]: "30"
                  - generic [ref=e146]: "31"
                  - generic [ref=e147]: "32"
                  - generic [ref=e148]: "33"
                  - generic [ref=e149]: "34"
                  - generic [ref=e150]: "35"
                  - generic [ref=e151]: "36"
                - generic [ref=e152]:
                  - generic [ref=e153]: ⌄
                  - generic [ref=e154]: ⌄
                  - generic [ref=e155]: ⌄
                  - generic [ref=e156]: ⌄
                  - generic [ref=e157]: ⌄
                  - generic [ref=e158]: ⌄
              - textbox [ref=e159]:
                - generic [ref=e160]: ".wiki-content h2 {"
                - generic [ref=e161]: "color: var(--color-info) !important;"
                - generic [ref=e162]: "}"
                - generic [ref=e163]: ".wiki-content h3 {"
                - generic [ref=e164]: "color: var(--color-success);"
                - generic [ref=e165]: "}"
                - generic [ref=e167]: ".wiki-toc-link {"
                - generic [ref=e168]: "font-size: var(--text-xs) !important;"
                - generic [ref=e169]: "}"
                - generic [ref=e171]: /****/
                - generic [ref=e172]: ".recursos {"
                - generic [ref=e173]: "font-family: var(--font-body);"
                - generic [ref=e174]: "color: var(--text-primary);"
                - generic [ref=e175]: "max-width: 800px;"
                - generic [ref=e176]: "margin: var(--space-6) 0;"
                - generic [ref=e177]: "}"
                - generic [ref=e179]: ".recursos-container {"
                - generic [ref=e180]: "display: flex;"
                - generic [ref=e181]: "flex-direction: column;"
                - generic [ref=e182]: "gap: var(--space-3);"
                - generic [ref=e183]: "}"
                - generic [ref=e185]: ".recurso-card {"
                - generic [ref=e186]: "display: flex;"
                - generic [ref=e187]: "justify-content: space-between;"
                - generic [ref=e188]: "align-items: center;"
                - generic [ref=e189]: "padding: var(--space-4) var(--space-5);"
                - generic [ref=e190]: "background: var(--bg-card);"
                - generic [ref=e191]: "border: 1px solid var(--border-subtle);"
                - generic [ref=e192]: "border-left: 4px solid var(--color-crimson);"
                - generic [ref=e193]: "border-radius: var(--radius-md);"
                - generic [ref=e194]: "box-shadow: var(--shadow-sm);"
                - generic [ref=e195]: "}"
    - contentinfo [ref=e197]:
      - generic [ref=e198]:
        - generic [ref=e199]:
          - generic [ref=e200]:
            - generic [ref=e201]: ✦
            - text: TalesRol
          - generic [ref=e202]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e203]:
          - link "Normas" [ref=e204] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e205] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e206] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e207]
```

# Test source

```ts
  5   | import { ADMIN } from './helpers';
  6   | 
  7   | async function loginAdmin(page: Page) {
  8   |   await page.goto('/auth/login');
  9   |   await page.fill('input[name="email"], input[type="email"]', ADMIN.email);
  10  |   await page.fill('input[name="password"], input[type="password"]', ADMIN.password);
  11  |   await page.click('button[type="submit"]');
  12  |   await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 8000 });
  13  | }
  14  | 
  15  | const adminPages = [
  16  |   { path: '/admin', name: 'Panel principal' },
  17  |   { path: '/admin/css', name: 'CSS personalizado' },
  18  |   { path: '/admin/config', name: 'Config — redirect' },
  19  |   { path: '/admin/config/general', name: 'Config — General' },
  20  |   { path: '/admin/config/mantenimiento', name: 'Config — Mantenimiento' },
  21  |   { path: '/admin/config/banner', name: 'Config — Banner' },
  22  |   { path: '/admin/config/textos', name: 'Config — Textos' },
  23  |   { path: '/admin/config/roles', name: 'Config — Roles (placeholder)' },
  24  | ];
  25  | 
  26  | test.describe('Panel de Administración — carga de páginas', () => {
  27  |   test.beforeEach(async ({ page }) => {
  28  |     await loginAdmin(page);
  29  |   });
  30  | 
  31  |   for (const { path, name } of adminPages) {
  32  |     test(`${name} (${path}) carga sin error`, async ({ page }) => {
  33  |       await page.goto(path);
  34  |       await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  35  | 
  36  |       const title = await page.title();
  37  |       expect(title).not.toMatch(/error|500/i);
  38  | 
  39  |       // No deben aparecer errores de Next.js
  40  |       const errorEl = page.locator('text=Application error, h2:has-text("500"), h1:has-text("Error")');
  41  |       expect(await errorEl.count()).toBe(0);
  42  | 
  43  |       console.log(`✅ ${name} — título: ${title}`);
  44  |     });
  45  |   }
  46  | });
  47  | 
  48  | test.describe('Panel de Administración — funcionalidades', () => {
  49  |   test.beforeEach(async ({ page }) => {
  50  |     await loginAdmin(page);
  51  |   });
  52  | 
  53  |   test('estadísticas del panel principal se cargan', async ({ page }) => {
  54  |     await page.goto('/admin');
  55  |     // Busca números/stats (usuarios, salas, posts...)
  56  |     const statNumbers = page.locator('[class*="stat"], [class*="card"], .text-2xl, .text-3xl, .text-4xl');
  57  |     if (await statNumbers.count() > 0) {
  58  |       console.log(`✅ Stats visibles: ${await statNumbers.count()} elementos`);
  59  |     } else {
  60  |       console.log('⚠️  No se encontraron elementos de estadísticas');
  61  |     }
  62  |   });
  63  | 
  64  |   test('tabla de usuarios carga', async ({ page }) => {
  65  |     await page.goto('/admin');
  66  |     const usersTab = page.locator('button:has-text("Usuarios"), a:has-text("Usuarios")').first();
  67  |     if (await usersTab.count() > 0) {
  68  |       await usersTab.click();
  69  |       await page.waitForTimeout(1500);
  70  |     }
  71  |     const table = page.locator('table, [role="table"]').first();
  72  |     if (await table.count() > 0) {
  73  |       console.log('✅ Tabla de usuarios visible');
  74  |     } else {
  75  |       console.log('⚠️  Tabla de usuarios no encontrada');
  76  |     }
  77  |   });
  78  | 
  79  |   test('tabla de salas carga', async ({ page }) => {
  80  |     await page.goto('/admin');
  81  |     const roomsTab = page.locator('button:has-text("Salas"), a:has-text("Salas")').first();
  82  |     if (await roomsTab.count() > 0) {
  83  |       await roomsTab.click();
  84  |       await page.waitForTimeout(1500);
  85  |       const table = page.locator('table, [role="table"]').first();
  86  |       if (await table.count() > 0) {
  87  |         console.log('✅ Tabla de salas visible');
  88  |       }
  89  |     }
  90  |   });
  91  | 
  92  |   test('tabla de reportes carga', async ({ page }) => {
  93  |     await page.goto('/admin');
  94  |     const reportsTab = page.locator('button:has-text("Reporte"), a:has-text("Reporte")').first();
  95  |     if (await reportsTab.count() > 0) {
  96  |       await reportsTab.click();
  97  |       await page.waitForTimeout(1500);
  98  |       console.log('✅ Tab de reportes clickado');
  99  |     }
  100 |   });
  101 | 
  102 |   test('editor CSS guarda sin error', async ({ page }) => {
  103 |     await page.goto('/admin/css');
  104 |     const textarea = page.locator('textarea').first();
> 105 |     await expect(textarea).toBeVisible({ timeout: 5000 });
      |                            ^ Error: expect(locator).toBeVisible() failed
  106 | 
  107 |     // Añade un comentario CSS inofensivo
  108 |     const current = await textarea.inputValue();
  109 |     await textarea.fill(current + '\n/* test automatizado */');
  110 | 
  111 |     const saveBtn = page.locator('button:has-text("Guardar")').first();
  112 |     await saveBtn.click();
  113 |     await page.waitForTimeout(2000);
  114 | 
  115 |     // No debe haber error visible
  116 |     const errorEl = page.locator('[role="alert"]:has-text("error"), .text-red-500').first();
  117 |     if (await errorEl.count() > 0) {
  118 |       console.log('⚠️  Error al guardar CSS:', await errorEl.textContent());
  119 |     } else {
  120 |       console.log('✅ CSS guardado correctamente');
  121 |     }
  122 |   });
  123 | 
  124 |   test('config general — cambio de site_name y guardar', async ({ page }) => {
  125 |     await page.goto('/admin/config/general');
  126 |     const siteNameInput = page.locator('input[name="site_name"], input[placeholder*="nombre" i]').first();
  127 |     if (await siteNameInput.count() > 0) {
  128 |       const prev = await siteNameInput.inputValue();
  129 |       await siteNameInput.fill('TalesRol (test bot)');
  130 |       await page.click('button[type="submit"], button:has-text("Guardar")');
  131 |       await page.waitForTimeout(1500);
  132 |       // Restaura
  133 |       await siteNameInput.fill(prev);
  134 |       await page.click('button[type="submit"], button:has-text("Guardar")');
  135 |       console.log('✅ Config general guardada y restaurada');
  136 |     } else {
  137 |       console.log('⚠️  Campo site_name no encontrado');
  138 |     }
  139 |   });
  140 | 
  141 |   test('config banner — activar y desactivar', async ({ page }) => {
  142 |     await page.goto('/admin/config/banner');
  143 |     const toggle = page.locator('input[type="checkbox"][name*="banner"], input[type="checkbox"]').first();
  144 |     if (await toggle.count() > 0) {
  145 |       const wasChecked = await toggle.isChecked();
  146 |       await toggle.click();
  147 |       await page.click('button[type="submit"], button:has-text("Guardar")');
  148 |       await page.waitForTimeout(1000);
  149 |       // Restaura
  150 |       if (wasChecked !== await toggle.isChecked()) {
  151 |         await toggle.click();
  152 |         await page.click('button[type="submit"], button:has-text("Guardar")');
  153 |       }
  154 |       console.log('✅ Toggle de banner OK');
  155 |     }
  156 |   });
  157 | 
  158 |   test('modo mantenimiento — no se activa accidentalmente', async ({ page }) => {
  159 |     await page.goto('/admin/config/mantenimiento');
  160 |     // Solo verificamos que el formulario esté visible, NO lo activamos
  161 |     const form = page.locator('form').first();
  162 |     await expect(form).toBeVisible({ timeout: 5000 });
  163 |     console.log('✅ Config mantenimiento carga (NO se activa para no romper el sitio)');
  164 |   });
  165 | });
  166 | 
  167 | test.describe('Protección de rutas admin', () => {
  168 |   test('usuario no logueado no puede acceder al panel', async ({ page }) => {
  169 |     await page.goto('/admin');
  170 |     // Debe redirigir al login
  171 |     await expect(page).not.toHaveURL(/\/admin$/, { timeout: 5000 });
  172 |     console.log('✅ Ruta /admin protegida — redirige a:', page.url());
  173 |   });
  174 | });
```