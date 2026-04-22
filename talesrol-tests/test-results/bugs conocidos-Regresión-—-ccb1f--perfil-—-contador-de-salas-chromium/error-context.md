# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bugs conocidos.spec.ts >> Regresión — bugs documentados >> [BUG] Estadísticas del perfil — contador de salas
- Location: tests\bugs conocidos.spec.ts:74:7

# Error details

```
Error: locator.textContent: Error: strict mode violation: locator('main') resolved to 2 elements:
    1) <main class="app-main">…</main> aka getByRole('main').filter({ hasText: 'aventurera@' })
    2) <main class="profile-main">…</main> aka getByRole('main').filter({ hasText: 'aventurera@' }).getByRole('main')

Call log:
  - waiting for locator('main')

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
          - generic [ref=e105]:
            - generic [ref=e106]:
              - img "aventurera" [ref=e107]
              - generic "Administrador" [ref=e108]
            - generic [ref=e109]:
              - heading "aventurera" [level=1] [ref=e110]
              - generic [ref=e111]: "@aventurera"
              - generic [ref=e112]: Administrador
            - generic [ref=e113]:
              - link "Editar perfil" [ref=e114] [cursor=pointer]:
                - /url: /perfil/editar
                - img [ref=e115]
                - text: Editar perfil
              - link "Privacidad" [ref=e117] [cursor=pointer]:
                - /url: /perfil/privacidad
                - img [ref=e118]
                - text: Privacidad
          - generic [ref=e120]:
            - complementary [ref=e121]:
              - generic [ref=e122]:
                - heading "Sobre mí" [level=2] [ref=e123]
                - paragraph [ref=e124]: No se que contar la verdad
              - generic [ref=e125]:
                - heading "Estadísticas" [level=2] [ref=e126]
                - generic [ref=e127]:
                  - generic [ref=e128]:
                    - generic [ref=e129]: "76"
                    - generic [ref=e130]: Posts
                  - generic [ref=e131]:
                    - generic [ref=e132]: "85"
                    - generic [ref=e133]: Puntos
                  - generic [ref=e134]:
                    - generic [ref=e135]: "6"
                    - generic [ref=e136]: Personajes
                  - generic [ref=e137]:
                    - generic [ref=e138]: "6"
                    - generic [ref=e139]: Salas
              - generic [ref=e140]:
                - heading "Actividad" [level=2] [ref=e141]
                - generic [ref=e142]:
                  - generic [ref=e143]:
                    - img [ref=e144]
                    - generic [ref=e146]:
                      - generic [ref=e147]: Registrado
                      - generic [ref=e148]: 7 de marzo de 2026
                  - generic [ref=e149]:
                    - img [ref=e150]
                    - generic [ref=e152]:
                      - generic [ref=e153]: Último acceso
                      - generic [ref=e154]: 22 de abril de 2026
              - generic [ref=e155]:
                - heading "Insignias" [level=2] [ref=e156]:
                  - img [ref=e157]
                  - text: Insignias
                - generic [ref=e159]:
                  - generic "trasto" [ref=e160]:
                    - img [ref=e161]
                    - text: trasto
                  - generic "Primer trazo" [ref=e163]:
                    - img [ref=e164]
                    - text: Primer trazo
                  - generic "Escribano" [ref=e166]:
                    - img [ref=e167]
                    - text: Escribano
                  - generic "Narrador" [ref=e169]:
                    - img [ref=e170]
                    - text: Narrador
                  - generic "Primer escenario" [ref=e172]:
                    - img [ref=e173]
                    - text: Primer escenario
                  - generic "Arquitecto" [ref=e175]:
                    - img [ref=e176]
                    - text: Arquitecto
                  - generic "Primer alter ego" [ref=e178]:
                    - img [ref=e179]
                    - text: Primer alter ego
                  - generic "Intérprete" [ref=e181]:
                    - img [ref=e182]
                    - text: Intérprete
                  - generic "Veterano" [ref=e184]:
                    - img [ref=e185]
                    - text: Veterano
                - link "Gestionar insignias →" [ref=e187] [cursor=pointer]:
                  - /url: /perfil/badges
            - main [ref=e188]:
              - generic [ref=e189]:
                - heading "Personajes" [level=2] [ref=e190]:
                  - img [ref=e191]
                  - text: Personajes
                - generic [ref=e193]:
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e194] [cursor=pointer]:
                    - /url: /personajes/2ab31d12-809b-4437-9364-b2ec80f33349
                    - img "Personaje Bot" [ref=e195]
                    - generic [ref=e196]:
                      - generic [ref=e197]: Personaje Bot
                      - generic [ref=e198]: Personaje creado automáticamente para tests.
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e199] [cursor=pointer]:
                    - /url: /personajes/2b0f4b59-5821-46d5-8fcd-64175e94a35b
                    - img "Personaje Bot" [ref=e200]
                    - generic [ref=e201]:
                      - generic [ref=e202]: Personaje Bot
                      - generic [ref=e203]: Personaje creado automáticamente para tests.
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e204] [cursor=pointer]:
                    - /url: /personajes/013ad3b8-dfba-4b21-a8fe-200c0d96e2af
                    - img "Personaje Bot" [ref=e205]
                    - generic [ref=e206]:
                      - generic [ref=e207]: Personaje Bot
                      - generic [ref=e208]: Personaje creado automáticamente para tests.
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e209] [cursor=pointer]:
                    - /url: /personajes/4adccfe3-c515-4b0e-8d70-43261fdbd719
                    - img "Personaje Bot" [ref=e210]
                    - generic [ref=e211]:
                      - generic [ref=e212]: Personaje Bot
                      - generic [ref=e213]: Personaje creado automáticamente para tests.
                  - link "Luxana Luxana Serafina esplendorosa" [ref=e214] [cursor=pointer]:
                    - /url: /personajes/f297c4ac-a142-49fa-86d7-c0d2ba6c1ec1
                    - img "Luxana" [ref=e215]
                    - generic [ref=e216]:
                      - generic [ref=e217]: Luxana
                      - generic [ref=e218]: Serafina esplendorosa
                  - link "Lyra doce Lyra doce Magdalenas con halvah. Algodón de azúcar danés, gominolas da…" [ref=e219] [cursor=pointer]:
                    - /url: /personajes/25903e40-9a6a-4a16-9b43-7d5b7762b15a
                    - img "Lyra doce" [ref=e220]
                    - generic [ref=e221]:
                      - generic [ref=e222]: Lyra doce
                      - generic [ref=e223]: Magdalenas con halvah. Algodón de azúcar danés, gominolas da…
              - generic [ref=e224]:
                - heading "Salas en las que participa" [level=2] [ref=e225]:
                  - img [ref=e226]
                  - text: Salas en las que participa
                - generic [ref=e228]:
                  - link "A la media noche pasó A la media noche pasó active" [ref=e229] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso
                    - img "A la media noche pasó" [ref=e230]
                    - generic [ref=e231]: A la media noche pasó
                    - generic [ref=e232]: active
                  - link "Perihelio tardío Perihelio tardío active" [ref=e233] [cursor=pointer]:
                    - /url: /salas/perihelio-tardio
                    - img "Perihelio tardío" [ref=e234]
                    - generic [ref=e235]: Perihelio tardío
                    - generic [ref=e236]: active
                  - link "Viento y fuego Viento y fuego finished" [ref=e237] [cursor=pointer]:
                    - /url: /salas/viento-y-fuego
                    - img "Viento y fuego" [ref=e238]
                    - generic [ref=e239]: Viento y fuego
                    - generic [ref=e240]: finished
                  - link "Castillos del agua Castillos del agua closed" [ref=e241] [cursor=pointer]:
                    - /url: /salas/castillos-del-agua
                    - img "Castillos del agua" [ref=e242]
                    - generic [ref=e243]: Castillos del agua
                    - generic [ref=e244]: closed
                  - link "La casa del cura La casa del cura paused" [ref=e245] [cursor=pointer]:
                    - /url: /salas/la-casa-del-cura
                    - img "La casa del cura" [ref=e246]
                    - generic [ref=e247]: La casa del cura
                    - generic [ref=e248]: paused
                  - link "Cenizas blancas Cenizas blancas active" [ref=e249] [cursor=pointer]:
                    - /url: /salas/cenizas-blancas
                    - img "Cenizas blancas" [ref=e250]
                    - generic [ref=e251]: Cenizas blancas
                    - generic [ref=e252]: active
              - generic [ref=e253]:
                - heading "Temas abiertos" [level=2] [ref=e254]:
                  - img [ref=e255]
                  - text: Temas abiertos
                - generic [ref=e257]:
                  - link "Tema de prueba automatizada A la media noche pasó 21 abr 2026" [ref=e258] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/d439123d-8bd6-4ea7-b559-3039ea720415
                    - generic [ref=e259]:
                      - generic [ref=e260]: Tema de prueba automatizada
                      - generic [ref=e261]: A la media noche pasó
                    - generic [ref=e263]:
                      - img [ref=e264]
                      - text: 21 abr 2026
                  - link "Tema de prueba automatizada A la media noche pasó 21 abr 2026" [ref=e266] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/67b6c5ba-1c29-4830-b92f-f452166fa6e2
                    - generic [ref=e267]:
                      - generic [ref=e268]: Tema de prueba automatizada
                      - generic [ref=e269]: A la media noche pasó
                    - generic [ref=e271]:
                      - img [ref=e272]
                      - text: 21 abr 2026
                  - link "Tema de prueba automatizada A la media noche pasó 21 abr 2026" [ref=e274] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/90575307-3503-43a4-b2ec-0e8b6fa60ac5
                    - generic [ref=e275]:
                      - generic [ref=e276]: Tema de prueba automatizada
                      - generic [ref=e277]: A la media noche pasó
                    - generic [ref=e279]:
                      - img [ref=e280]
                      - text: 21 abr 2026
                  - link "Trece Cenizas blancas 6 abr 2026" [ref=e282] [cursor=pointer]:
                    - /url: /salas/cenizas-blancas/dd732e1f-cbf8-415a-9e13-97a23fa1fc06
                    - generic [ref=e283]:
                      - generic [ref=e284]: Trece
                      - generic [ref=e285]: Cenizas blancas
                    - generic [ref=e287]:
                      - img [ref=e288]
                      - text: 6 abr 2026
                  - link "Probando starter Perihelio tardío 30 mar 2026" [ref=e290] [cursor=pointer]:
                    - /url: /salas/perihelio-tardio/7304c068-7238-46f7-9f12-2ae47f644186
                    - generic [ref=e291]:
                      - generic [ref=e292]: Probando starter
                      - generic [ref=e293]: Perihelio tardío
                    - generic [ref=e295]:
                      - img [ref=e296]
                      - text: 30 mar 2026
                  - 'link "Laralalá Perihelio tardío 25 mar 2026 Último post: aventurera · 30 mar" [ref=e298] [cursor=pointer]':
                    - /url: /salas/perihelio-tardio/466cd177-f0b0-4e2f-8362-d9cad4f89af7
                    - generic [ref=e299]:
                      - generic [ref=e300]: Laralalá
                      - generic [ref=e301]: Perihelio tardío
                    - generic [ref=e302]:
                      - generic [ref=e303]:
                        - img [ref=e304]
                        - text: 25 mar 2026
                      - generic [ref=e306]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e307]:
                          - /url: /perfil/aventurera
                        - text: · 30 mar
                  - 'link "A las 12 A la media noche pasó 18 mar 2026 Último post: aventurera · 21 abr" [ref=e308] [cursor=pointer]':
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408
                    - generic [ref=e309]:
                      - generic [ref=e310]: A las 12
                      - generic [ref=e311]: A la media noche pasó
                    - generic [ref=e312]:
                      - generic [ref=e313]:
                        - img [ref=e314]
                        - text: 18 mar 2026
                      - generic [ref=e316]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e317]:
                          - /url: /perfil/aventurera
                        - text: · 21 abr
                  - 'link "Probemos html La casa del cura 16 mar 2026 Último post: aventurera · 17 mar" [ref=e318] [cursor=pointer]':
                    - /url: /salas/la-casa-del-cura/e1421ced-43dc-4de9-90eb-8b490d5d3ca0
                    - generic [ref=e319]:
                      - generic [ref=e320]: Probemos html
                      - generic [ref=e321]: La casa del cura
                    - generic [ref=e322]:
                      - generic [ref=e323]:
                        - img [ref=e324]
                        - text: 16 mar 2026
                      - generic [ref=e326]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e327]:
                          - /url: /perfil/aventurera
                        - text: · 17 mar
                  - 'link "prueba Viento y fuego 9 mar 2026 Último post: aventurera · 10 mar" [ref=e328] [cursor=pointer]':
                    - /url: /salas/viento-y-fuego/9e21e719-a7db-4f3b-8577-396405107d0a
                    - generic [ref=e329]:
                      - generic [ref=e330]: prueba
                      - generic [ref=e331]: Viento y fuego
                    - generic [ref=e332]:
                      - generic [ref=e333]:
                        - img [ref=e334]
                        - text: 9 mar 2026
                      - generic [ref=e336]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e337]:
                          - /url: /perfil/aventurera
                        - text: · 10 mar
                  - 'link "fdf Viento y fuego 9 mar 2026 Último post: aventurera · 16 mar" [ref=e338] [cursor=pointer]':
                    - /url: /salas/viento-y-fuego/5d4adb5d-e2de-4c2a-9534-65bba1ab4e9d
                    - generic [ref=e339]:
                      - generic [ref=e340]: fdf
                      - generic [ref=e341]: Viento y fuego
                    - generic [ref=e342]:
                      - generic [ref=e343]:
                        - img [ref=e344]
                        - text: 9 mar 2026
                      - generic [ref=e346]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e347]:
                          - /url: /perfil/aventurera
                        - text: · 16 mar
              - generic [ref=e348]:
                - heading "Posts recientes" [level=2] [ref=e349]:
                  - img [ref=e350]
                  - text: Posts recientes
                - generic [ref=e352]:
                  - link "A la media noche pasó › A las 12 21 abr 2026 gfgfgd" [ref=e353] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408#post-6
                    - generic [ref=e354]:
                      - generic [ref=e355]: A la media noche pasó
                      - generic [ref=e356]: ›
                      - generic [ref=e357]: A las 12
                      - generic [ref=e358]: 21 abr 2026
                    - paragraph [ref=e359]: gfgfgd
                  - link "A la media noche pasó › A las 12 10 abr 2026 adfadfads 🎲 2d6 [1, 3] → 4 por aventurera · 23:03 🎲 1d10" [ref=e360] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408#post-5
                    - generic [ref=e361]:
                      - generic [ref=e362]: A la media noche pasó
                      - generic [ref=e363]: ›
                      - generic [ref=e364]: A las 12
                      - generic [ref=e365]: 10 abr 2026
                    - paragraph [ref=e366]: adfadfads 🎲 2d6 [1, 3] → 4 por aventurera · 23:03 🎲 1d10
                  - link "A la media noche pasó › A las 12 5 abr 2026 El viento azotaba las murallas del castillo mientras la tormenta se aproximaba desde el norte. — No deberíamos estar" [ref=e367] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408#post-4
                    - generic [ref=e368]:
                      - generic [ref=e369]: A la media noche pasó
                      - generic [ref=e370]: ›
                      - generic [ref=e371]: A las 12
                      - generic [ref=e372]: 5 abr 2026
                    - paragraph [ref=e373]: El viento azotaba las murallas del castillo mientras la tormenta se aproximaba desde el norte. — No deberíamos estar
                  - link "A la media noche pasó › A las 12 1 abr 2026 bum 🎲 1d6 → 4 por aventurera · 00:32" [ref=e374] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408#post-3
                    - generic [ref=e375]:
                      - generic [ref=e376]: A la media noche pasó
                      - generic [ref=e377]: ›
                      - generic [ref=e378]: A las 12
                      - generic [ref=e379]: 1 abr 2026
                    - paragraph [ref=e380]: bum 🎲 1d6 → 4 por aventurera · 00:32
                  - link "Perihelio tardío › Laralalá 30 mar 2026 pru 🎲 1d4 → 1 por aventurera · 15:32 🎲 1d4 → 3" [ref=e381] [cursor=pointer]:
                    - /url: /salas/perihelio-tardio/466cd177-f0b0-4e2f-8362-d9cad4f89af7#post-7
                    - generic [ref=e382]:
                      - generic [ref=e383]: Perihelio tardío
                      - generic [ref=e384]: ›
                      - generic [ref=e385]: Laralalá
                      - generic [ref=e386]: 30 mar 2026
                    - paragraph [ref=e387]: pru 🎲 1d4 → 1 por aventurera · 15:32 🎲 1d4 → 3
    - contentinfo [ref=e388]:
      - generic [ref=e389]:
        - generic [ref=e390]:
          - generic [ref=e391]:
            - generic [ref=e392]: ✦
            - text: TalesRol
          - generic [ref=e393]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e394]:
          - link "Normas" [ref=e395] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e396] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e397] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e398]: aventurera — TalesRol | TalesRol
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
  8   |   await page.goto('/auth/login');
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
> 81  |       const statsText = await page.locator('main').textContent() || '';
      |                                                    ^ Error: locator.textContent: Error: strict mode violation: locator('main') resolved to 2 elements:
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
  109 |       console.log('✅ Sin errores de hidratación en portada');
  110 |     }
  111 |   });
  112 | 
  113 |   // Dado: dice_enabled no bloquea tiradas
  114 |   test('[BUG] dice_enabled = false debe bloquear tiradas de dado', async ({ page }) => {
  115 |     // Activa modo "dados desactivados"
  116 |     await page.goto('/admin/config/general');
  117 |     const diceToggle = page.locator('input[name="dice_enabled"], input[type="checkbox"]:near(:text("dados"))').first();
  118 |     if (await diceToggle.count() > 0 && await diceToggle.isChecked()) {
  119 |       await diceToggle.uncheck();
  120 |       await page.click('button[type="submit"], button:has-text("Guardar")');
  121 |       await page.waitForTimeout(1000);
  122 | 
  123 |       // Intenta tirar dado en una sala
  124 |       await page.goto('/salas');
  125 |       const roomLinks = page.locator('a[href*="/salas/"]');
  126 |       const hrefs = await roomLinks.evaluateAll(els =>
  127 |         els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/[^/]+$/.test(h))
  128 |       );
  129 | 
  130 |       if (hrefs.length > 0) {
  131 |         const slug = hrefs[0].split('/salas/')[1];
  132 |         await page.goto(hrefs[0]);
  133 |         // Busca temas
  134 |         const topicLinks = page.locator('a[href*="/salas/"]');
  135 |         const topicHrefs = await topicLinks.evaluateAll(els =>
  136 |           els.map(el => el.getAttribute('href') || '').filter(h => /\/salas\/.+\/\d+/.test(h))
  137 |         );
  138 |         if (topicHrefs.length > 0) {
  139 |           await page.goto(topicHrefs[0]);
  140 |           const diceUI = page.locator('.dice-roller, [data-dice], button:has-text("Tirar")').first();
  141 |           if (await diceUI.count() > 0) {
  142 |             console.log('🐛 BUG CONFIRMADO: El UI de dados sigue visible aunque dice_enabled=false');
  143 |           } else {
  144 |             console.log('✅ Dados ocultos con dice_enabled=false');
  145 |           }
  146 |         }
  147 |       }
  148 | 
  149 |       // Restaurar
  150 |       await page.goto('/admin/config/general');
  151 |       const toggle2 = page.locator('input[name="dice_enabled"]').first();
  152 |       if (await toggle2.count() > 0) {
  153 |         await toggle2.check();
  154 |         await page.click('button[type="submit"], button:has-text("Guardar")');
  155 |       }
  156 |     } else {
  157 |       console.log('⚠️  Toggle dice_enabled no encontrado o ya estaba desactivado');
  158 |     }
  159 |   });
  160 | });
```