# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: personajes perfil.spec.ts >> Wiki >> crear página wiki
- Location: tests\personajes perfil.spec.ts:113:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="title"], input[name="titulo"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="title"], input[name="titulo"]').first()

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
          - generic [ref=e103]:
            - generic [ref=e104]:
              - img [ref=e105]
              - generic [ref=e107]:
                - heading "Nueva página" [level=1] [ref=e108]
                - paragraph [ref=e109]: A la media noche pasó
            - link "Wiki" [ref=e110] [cursor=pointer]:
              - /url: /salas/a-la-media-noche-paso/wiki
              - img [ref=e111]
              - text: Wiki
          - generic [ref=e113]:
            - generic [ref=e114]:
              - generic [ref=e115]:
                - generic [ref=e116]: Título de la página
                - 'textbox "Ej: Historia del reino, PNJs importantes..." [ref=e117]'
              - generic [ref=e118]:
                - generic [ref=e119]: Contenido
                - generic [ref=e120]:
                  - generic [ref=e121]:
                    - button "✦ Visual" [ref=e122] [cursor=pointer]
                    - button "</> HTML" [ref=e123] [cursor=pointer]
                  - generic [ref=e124]:
                    - generic [ref=e126]:
                      - button "Normal" [ref=e127] [cursor=pointer]:
                        - text: Normal
                        - img [ref=e128]
                      - text: Heading 1 Heading 2 Heading 3 Normal
                    - generic [ref=e131]:
                      - button [ref=e132] [cursor=pointer]:
                        - img [ref=e133]
                      - button [ref=e136] [cursor=pointer]:
                        - img [ref=e137]
                      - button [ref=e139] [cursor=pointer]:
                        - img [ref=e140]
                      - button [ref=e143] [cursor=pointer]:
                        - img [ref=e144]
                    - generic [ref=e148]:
                      - button [ref=e149] [cursor=pointer]:
                        - img [ref=e150]
                      - button [ref=e154] [cursor=pointer]:
                        - img [ref=e155]
                    - generic [ref=e156]:
                      - button [ref=e157] [cursor=pointer]:
                        - img [ref=e158]
                      - button [ref=e163] [cursor=pointer]:
                        - img [ref=e164]
                    - button [ref=e169] [cursor=pointer]:
                      - img [ref=e170]
                  - generic [ref=e175]:
                    - generic [ref=e176]:
                      - text: Escribe el contenido de esta página de la wiki...
                      - paragraph [ref=e177]
                    - text: "Visit URL: EditRemove"
              - generic [ref=e178]:
                - generic [ref=e179]:
                  - img [ref=e180]
                  - text: Categorías (separadas por coma)
                - 'textbox "Ej: Lore, Personajes, Reglas" [ref=e183]'
              - generic [ref=e184] [cursor=pointer]:
                - checkbox "Establecer como portada de la wiki" [ref=e185]
                - img [ref=e186]
                - generic [ref=e188]: Establecer como portada de la wiki
              - generic [ref=e189]:
                - link "Cancelar" [ref=e190] [cursor=pointer]:
                  - /url: /salas/a-la-media-noche-paso/wiki
                - button "Crear página" [ref=e191] [cursor=pointer]:
                  - img [ref=e192]
                  - text: Crear página
            - complementary [ref=e194]:
              - generic [ref=e195]:
                - generic [ref=e196]: Referencia rápida
                - generic [ref=e197]: Etiquetas HTML disponibles
              - generic [ref=e198]:
                - generic [ref=e199]:
                  - generic [ref=e201]: Título H1
                  - code [ref=e202]: <h1>Texto</h1>
                  - generic [ref=e203]: Título principal
                - generic [ref=e204]:
                  - generic [ref=e206]: Título H2
                  - code [ref=e207]: <h2>Texto</h2>
                  - generic [ref=e208]: Subtítulo
                - generic [ref=e209]:
                  - generic [ref=e211]: Negrita
                  - code [ref=e212]: <strong>Texto</strong>
                  - strong [ref=e214]: texto en negrita
                - generic [ref=e215]:
                  - generic [ref=e217]: Cursiva
                  - code [ref=e218]: <em>Texto</em>
                  - emphasis [ref=e220]: texto en cursiva
                - generic [ref=e221]:
                  - generic [ref=e223]: Cita
                  - code [ref=e224]: <blockquote>Texto</blockquote>
                  - generic [ref=e226]: Una cita memorable
                - generic [ref=e227]:
                  - generic [ref=e229]: Lista
                  - code [ref=e230]: <ul> <li>Item 1</li> <li>Item 2</li> </ul>
                  - list [ref=e232]:
                    - listitem [ref=e233]: Item 1
                    - listitem [ref=e234]: Item 2
                - generic [ref=e235]:
                  - generic [ref=e237]: Enlace
                  - code [ref=e238]: <a href="/salas/slug/wiki/pagina">Título</a>
                  - generic [ref=e239]: Enlace a otra página
                - generic [ref=e240]:
                  - generic [ref=e242]: Separador
                  - code [ref=e243]: <hr>
                  - separator [ref=e245]
              - paragraph [ref=e246]:
                - text: El editor Quill aplica estos estilos automáticamente. También puedes escribir HTML directamente usando el botón
                - strong [ref=e247]: </>
                - text: de la barra del editor.
    - contentinfo [ref=e248]:
      - generic [ref=e249]:
        - generic [ref=e250]:
          - generic [ref=e251]:
            - generic [ref=e252]: ✦
            - text: TalesRol
          - generic [ref=e253]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e254]:
          - link "Normas" [ref=e255] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e256] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e257] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e258]
```

# Test source

```ts
  25  |     console.log('✅ /personajes OK');
  26  |   });
  27  | 
  28  |   test('formulario de nuevo personaje carga', async ({ page }) => {
  29  |     await page.goto('/personajes/nuevo');
  30  |     await expect(page.locator('form, input').first()).toBeVisible({ timeout: 5000 });
  31  |     console.log('✅ /personajes/nuevo carga OK');
  32  |   });
  33  | 
  34  |   test('crear personaje nuevo', async ({ page }) => {
  35  |     await page.goto('/personajes/nuevo');
  36  | 
  37  |     const nameInput = page.locator('input[name="name"], input[name="nombre"], input[placeholder*="nombre" i]').first();
  38  |     await expect(nameInput).toBeVisible({ timeout: 5000 });
  39  |     await nameInput.fill(TEST_CHARACTER.name);
  40  | 
  41  |     const descInput = page.locator('textarea[name="description"], textarea[name="descripcion"], textarea').first();
  42  |     if (await descInput.count() > 0) {
  43  |       await descInput.fill(TEST_CHARACTER.description);
  44  |     }
  45  | 
  46  |     await page.click('button[type="submit"]');
  47  |     await page.waitForTimeout(2000);
  48  |     console.log('✅ Personaje creado — URL:', page.url());
  49  |   });
  50  | });
  51  | 
  52  | // ─── PERFIL ───────────────────────────────────────────────────────────────────
  53  | 
  54  | test.describe('Perfil de usuario', () => {
  55  |   test.beforeEach(async ({ page }) => {
  56  |     await loginAdmin(page);
  57  |   });
  58  | 
  59  |   test('editar perfil carga', async ({ page }) => {
  60  |     await page.goto('/perfil/editar');
  61  |     await expect(page.locator('form, input').first()).toBeVisible({ timeout: 5000 });
  62  |     console.log('✅ /perfil/editar OK');
  63  |   });
  64  | 
  65  |   test('página de privacidad carga', async ({ page }) => {
  66  |     await page.goto('/perfil/privacidad');
  67  |     await expect(page.locator('form, main').first()).toBeVisible({ timeout: 5000 });
  68  |     console.log('✅ /perfil/privacidad OK');
  69  |   });
  70  | 
  71  |   test('página de badges carga', async ({ page }) => {
  72  |     await page.goto('/perfil/badges');
  73  |     await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  74  |     console.log('✅ /perfil/badges OK');
  75  |   });
  76  | 
  77  |   test('perfil público de admin visible', async ({ page }) => {
  78  |     // Intenta con el username guardado o busca en la lista de usuarios
  79  |     await page.goto('/usuarios');
  80  |     const profileLink = page.locator('a[href*="/perfil/"]').first();
  81  |     if (await profileLink.count() > 0) {
  82  |       await profileLink.click();
  83  |       await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  84  |       console.log('✅ Perfil público visible — URL:', page.url());
  85  |     } else {
  86  |       console.log('⚠️  No se encontró link a perfil público');
  87  |     }
  88  |   });
  89  | });
  90  | 
  91  | // ─── WIKI ─────────────────────────────────────────────────────────────────────
  92  | 
  93  | test.describe('Wiki', () => {
  94  |   test.beforeEach(async ({ page }) => {
  95  |     await loginAdmin(page);
  96  |   });
  97  | 
  98  |   test('wiki de una sala carga', async ({ page }) => {
  99  |     await page.goto('/salas');
  100 |     const roomLinks = page.locator('a[href*="/salas/"]');
  101 |     const hrefs = await roomLinks.evaluateAll(els =>
  102 |       els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
  103 |     );
  104 | 
  105 |     if (hrefs.length === 0) { console.log('⚠️  No hay salas'); return; }
  106 | 
  107 |     const slug = hrefs[0].split('/salas/')[1];
  108 |     await page.goto(`/salas/${slug}/wiki`);
  109 |     await expect(page.locator('main').first()).toBeVisible({ timeout: 5000 });
  110 |     console.log('✅ Wiki de sala OK — slug:', slug);
  111 |   });
  112 | 
  113 |   test('crear página wiki', async ({ page }) => {
  114 |     await page.goto('/salas');
  115 |     const roomLinks = page.locator('a[href*="/salas/"]');
  116 |     const hrefs = await roomLinks.evaluateAll(els =>
  117 |       els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
  118 |     );
  119 |     if (hrefs.length === 0) { console.log('⚠️  Sin salas'); return; }
  120 | 
  121 |     const slug = hrefs[0].split('/salas/')[1];
  122 |     await page.goto(`/salas/${slug}/wiki/nueva`);
  123 | 
  124 |     const titleInput = page.locator('input[name="title"], input[name="titulo"]').first();
> 125 |     await expect(titleInput).toBeVisible({ timeout: 5000 });
      |                              ^ Error: expect(locator).toBeVisible() failed
  126 |     await titleInput.fill(TEST_WIKI.title);
  127 | 
  128 |     const categoryInput = page.locator('input[name="category"], input[name="categoria"]').first();
  129 |     if (await categoryInput.count() > 0) await categoryInput.fill(TEST_WIKI.category);
  130 | 
  131 |     const quill = page.locator('.ql-editor');
  132 |     if (await quill.count() > 0) {
  133 |       await quill.click();
  134 |       await quill.fill(TEST_WIKI.content);
  135 |     }
  136 | 
  137 |     await page.click('button[type="submit"]');
  138 |     await page.waitForTimeout(2000);
  139 |     console.log('✅ Página wiki creada — URL:', page.url());
  140 |   });
  141 | });
```