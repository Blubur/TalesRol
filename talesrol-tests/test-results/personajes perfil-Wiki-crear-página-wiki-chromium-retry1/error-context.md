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
            - link "Sala de prueba automatizada" [ref=e71] [cursor=pointer]:
              - /url: /salas/sala-de-prueba-automatizada
              - generic [ref=e74]: Sala de prueba automatizada
            - link "A la media noche pasó solo noche" [ref=e75] [cursor=pointer]:
              - /url: /salas/a-la-media-noche-paso
              - generic [ref=e77]:
                - generic [ref=e78]: A la media noche pasó
                - generic [ref=e79]: solo noche
            - link "Cenizas blancas Fantasia angelical" [ref=e80] [cursor=pointer]:
              - /url: /salas/cenizas-blancas
              - generic [ref=e82]:
                - generic [ref=e83]: Cenizas blancas
                - generic [ref=e84]: Fantasia angelical
            - link "Perihelio tardío sci fi" [ref=e85] [cursor=pointer]:
              - /url: /salas/perihelio-tardio
              - generic [ref=e87]:
                - generic [ref=e88]: Perihelio tardío
                - generic [ref=e89]: sci fi
            - 'link "Josepa y Camila se van a Benidorm TW: Josepa en bañador" [ref=e90] [cursor=pointer]':
              - /url: /salas/josepa-y-camila-se-van-a-benidorm
              - generic [ref=e92]:
                - generic [ref=e93]: Josepa y Camila se van a Benidorm
                - generic [ref=e94]: "TW: Josepa en bañador"
        - button "Accesos Rápidos" [ref=e97] [cursor=pointer]:
          - img [ref=e99]
          - generic [ref=e101]: Accesos Rápidos
          - img [ref=e103]
      - main [ref=e105]:
        - generic [ref=e106]:
          - generic [ref=e107]:
            - generic [ref=e108]:
              - img [ref=e109]
              - generic [ref=e111]:
                - heading "Nueva página" [level=1] [ref=e112]
                - paragraph [ref=e113]: Sala de prueba automatizada
            - link "Wiki" [ref=e114] [cursor=pointer]:
              - /url: /salas/sala-de-prueba-automatizada/wiki
              - img [ref=e115]
              - text: Wiki
          - generic [ref=e117]:
            - generic [ref=e118]:
              - generic [ref=e119]:
                - generic [ref=e120]: Título de la página
                - 'textbox "Ej: Historia del reino, PNJs importantes..." [ref=e121]'
              - generic [ref=e122]:
                - generic [ref=e123]: Contenido
                - generic [ref=e124]:
                  - generic [ref=e125]:
                    - button "✦ Visual" [ref=e126] [cursor=pointer]
                    - button "</> HTML" [ref=e127] [cursor=pointer]
                  - generic [ref=e128]:
                    - generic [ref=e130]:
                      - button "Normal" [ref=e131] [cursor=pointer]:
                        - text: Normal
                        - img [ref=e132]
                      - text: Heading 1 Heading 2 Heading 3 Normal
                    - generic [ref=e135]:
                      - button [ref=e136] [cursor=pointer]:
                        - img [ref=e137]
                      - button [ref=e140] [cursor=pointer]:
                        - img [ref=e141]
                      - button [ref=e143] [cursor=pointer]:
                        - img [ref=e144]
                      - button [ref=e147] [cursor=pointer]:
                        - img [ref=e148]
                    - generic [ref=e152]:
                      - button [ref=e153] [cursor=pointer]:
                        - img [ref=e154]
                      - button [ref=e158] [cursor=pointer]:
                        - img [ref=e159]
                    - generic [ref=e160]:
                      - button [ref=e161] [cursor=pointer]:
                        - img [ref=e162]
                      - button [ref=e167] [cursor=pointer]:
                        - img [ref=e168]
                    - button [ref=e173] [cursor=pointer]:
                      - img [ref=e174]
                  - generic [ref=e179]:
                    - generic [ref=e180]:
                      - text: Escribe el contenido de esta página de la wiki...
                      - paragraph [ref=e181]
                    - text: "Visit URL: EditRemove"
              - generic [ref=e182]:
                - generic [ref=e183]:
                  - img [ref=e184]
                  - text: Categorías (separadas por coma)
                - 'textbox "Ej: Lore, Personajes, Reglas" [ref=e187]'
              - generic [ref=e188] [cursor=pointer]:
                - checkbox "Establecer como portada de la wiki" [ref=e189]
                - img [ref=e190]
                - generic [ref=e192]: Establecer como portada de la wiki
              - generic [ref=e193]:
                - link "Cancelar" [ref=e194] [cursor=pointer]:
                  - /url: /salas/sala-de-prueba-automatizada/wiki
                - button "Crear página" [ref=e195] [cursor=pointer]:
                  - img [ref=e196]
                  - text: Crear página
            - complementary [ref=e198]:
              - generic [ref=e199]:
                - generic [ref=e200]: Referencia rápida
                - generic [ref=e201]: Etiquetas HTML disponibles
              - generic [ref=e202]:
                - generic [ref=e203]:
                  - generic [ref=e205]: Título H1
                  - code [ref=e206]: <h1>Texto</h1>
                  - generic [ref=e207]: Título principal
                - generic [ref=e208]:
                  - generic [ref=e210]: Título H2
                  - code [ref=e211]: <h2>Texto</h2>
                  - generic [ref=e212]: Subtítulo
                - generic [ref=e213]:
                  - generic [ref=e215]: Negrita
                  - code [ref=e216]: <strong>Texto</strong>
                  - strong [ref=e218]: texto en negrita
                - generic [ref=e219]:
                  - generic [ref=e221]: Cursiva
                  - code [ref=e222]: <em>Texto</em>
                  - emphasis [ref=e224]: texto en cursiva
                - generic [ref=e225]:
                  - generic [ref=e227]: Cita
                  - code [ref=e228]: <blockquote>Texto</blockquote>
                  - generic [ref=e230]: Una cita memorable
                - generic [ref=e231]:
                  - generic [ref=e233]: Lista
                  - code [ref=e234]: <ul> <li>Item 1</li> <li>Item 2</li> </ul>
                  - list [ref=e236]:
                    - listitem [ref=e237]: Item 1
                    - listitem [ref=e238]: Item 2
                - generic [ref=e239]:
                  - generic [ref=e241]: Enlace
                  - code [ref=e242]: <a href="/salas/slug/wiki/pagina">Título</a>
                  - generic [ref=e243]: Enlace a otra página
                - generic [ref=e244]:
                  - generic [ref=e246]: Separador
                  - code [ref=e247]: <hr>
                  - separator [ref=e249]
              - paragraph [ref=e250]:
                - text: El editor Quill aplica estos estilos automáticamente. También puedes escribir HTML directamente usando el botón
                - strong [ref=e251]: </>
                - text: de la barra del editor.
    - contentinfo [ref=e252]:
      - generic [ref=e253]:
        - generic [ref=e254]:
          - generic [ref=e255]:
            - generic [ref=e256]: ✦
            - text: TalesRol
          - generic [ref=e257]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e258]:
          - link "Normas" [ref=e259] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e260] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e261] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e262]
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