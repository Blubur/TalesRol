# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Panel de Administración — funcionalidades >> modo mantenimiento — no se activa accidentalmente
- Location: tests\admin.spec.ts:158:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('form').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('form').first()

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
          - complementary [ref=e103]:
            - paragraph [ref=e104]: Configuración
            - navigation [ref=e105]:
              - link "Ajustes globales" [ref=e106] [cursor=pointer]:
                - /url: /admin/config/general
                - img [ref=e107]
                - text: Ajustes globales
              - link "Mantenimiento" [ref=e110] [cursor=pointer]:
                - /url: /admin/config/mantenimiento
                - img [ref=e111]
                - text: Mantenimiento
              - link "Banner de aviso" [ref=e113] [cursor=pointer]:
                - /url: /admin/config/banner
                - img [ref=e114]
                - text: Banner de aviso
              - link "Textos del sitio" [ref=e116] [cursor=pointer]:
                - /url: /admin/config/textos
                - img [ref=e117]
                - text: Textos del sitio
              - link "Favicon" [ref=e119] [cursor=pointer]:
                - /url: /admin/config/favicon
                - img [ref=e120]
                - text: Favicon
              - link "Roles y permisos" [ref=e122] [cursor=pointer]:
                - /url: /admin/config/roles
                - img [ref=e123]
                - text: Roles y permisos
              - link "Puntos e insignias" [ref=e125] [cursor=pointer]:
                - /url: /admin/config/puntos
                - img [ref=e126]
                - text: Puntos e insignias
              - link "Tema rápido" [ref=e128] [cursor=pointer]:
                - /url: /admin/config/tema
                - img [ref=e129]
                - text: Tema rápido
              - link "CSS personalizado" [ref=e131] [cursor=pointer]:
                - /url: /admin/css
                - img [ref=e132]
                - text: CSS personalizado
            - link "← Volver al panel" [ref=e135] [cursor=pointer]:
              - /url: /admin
          - main [ref=e136]:
            - generic [ref=e137]:
              - generic [ref=e138]:
                - heading "Modo mantenimiento" [level=1] [ref=e139]
                - paragraph [ref=e140]: Cuando está activo, los usuarios ven una pantalla de mantenimiento. Los admins pueden seguir accediendo con normalidad.
              - generic [ref=e141]:
                - generic [ref=e143]:
                  - generic [ref=e144]:
                    - paragraph [ref=e145]: Modo mantenimiento
                    - paragraph [ref=e146]: Actívalo para mostrar la pantalla de mantenimiento a todos los usuarios.
                  - button [ref=e147] [cursor=pointer]
                - generic [ref=e149]:
                  - paragraph [ref=e150]: Mensaje de mantenimiento
                  - paragraph [ref=e151]: Texto que verán los usuarios en la pantalla de mantenimiento.
                  - textbox [ref=e152]: Estamos realizando tareas de mantenimiento. Volvemos pronto.
                - button "Guardar configuración" [ref=e154] [cursor=pointer]
    - contentinfo [ref=e155]:
      - generic [ref=e156]:
        - generic [ref=e157]:
          - generic [ref=e158]:
            - generic [ref=e159]: ✦
            - text: TalesRol
          - generic [ref=e160]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e161]:
          - link "Normas" [ref=e162] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e163] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e164] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e165]
```

# Test source

```ts
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
  105 |     await expect(textarea).toBeVisible({ timeout: 5000 });
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
> 162 |     await expect(form).toBeVisible({ timeout: 5000 });
      |                        ^ Error: expect(locator).toBeVisible() failed
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