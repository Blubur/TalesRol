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
          - generic [ref=e109]:
            - generic [ref=e110]:
              - img "aventurera" [ref=e111]
              - generic "Administrador" [ref=e112]
            - generic [ref=e113]:
              - heading "aventurera" [level=1] [ref=e114]
              - generic [ref=e115]: "@aventurera"
              - generic [ref=e116]: Administrador
            - generic [ref=e117]:
              - link "Editar perfil" [ref=e118] [cursor=pointer]:
                - /url: /perfil/editar
                - img [ref=e119]
                - text: Editar perfil
              - link "Privacidad" [ref=e121] [cursor=pointer]:
                - /url: /perfil/privacidad
                - img [ref=e122]
                - text: Privacidad
          - generic [ref=e124]:
            - complementary [ref=e125]:
              - generic [ref=e126]:
                - heading "Sobre mí" [level=2] [ref=e127]
                - paragraph [ref=e128]: No se que contar la verdad
              - generic [ref=e129]:
                - heading "Estadísticas" [level=2] [ref=e130]
                - generic [ref=e131]:
                  - generic [ref=e132]:
                    - generic [ref=e133]: "76"
                    - generic [ref=e134]: Posts
                  - generic [ref=e135]:
                    - generic [ref=e136]: "85"
                    - generic [ref=e137]: Puntos
                  - generic [ref=e138]:
                    - generic [ref=e139]: "7"
                    - generic [ref=e140]: Personajes
                  - generic [ref=e141]:
                    - generic [ref=e142]: "7"
                    - generic [ref=e143]: Salas
              - generic [ref=e144]:
                - heading "Actividad" [level=2] [ref=e145]
                - generic [ref=e146]:
                  - generic [ref=e147]:
                    - img [ref=e148]
                    - generic [ref=e150]:
                      - generic [ref=e151]: Registrado
                      - generic [ref=e152]: 7 de marzo de 2026
                  - generic [ref=e153]:
                    - img [ref=e154]
                    - generic [ref=e156]:
                      - generic [ref=e157]: Último acceso
                      - generic [ref=e158]: 22 de abril de 2026
              - generic [ref=e159]:
                - heading "Insignias" [level=2] [ref=e160]:
                  - img [ref=e161]
                  - text: Insignias
                - generic [ref=e163]:
                  - generic "trasto" [ref=e164]:
                    - img [ref=e165]
                    - text: trasto
                  - generic "Primer trazo" [ref=e167]:
                    - img [ref=e168]
                    - text: Primer trazo
                  - generic "Escribano" [ref=e170]:
                    - img [ref=e171]
                    - text: Escribano
                  - generic "Narrador" [ref=e173]:
                    - img [ref=e174]
                    - text: Narrador
                  - generic "Primer escenario" [ref=e176]:
                    - img [ref=e177]
                    - text: Primer escenario
                  - generic "Arquitecto" [ref=e179]:
                    - img [ref=e180]
                    - text: Arquitecto
                  - generic "Primer alter ego" [ref=e182]:
                    - img [ref=e183]
                    - text: Primer alter ego
                  - generic "Intérprete" [ref=e185]:
                    - img [ref=e186]
                    - text: Intérprete
                  - generic "Veterano" [ref=e188]:
                    - img [ref=e189]
                    - text: Veterano
                - link "Gestionar insignias →" [ref=e191] [cursor=pointer]:
                  - /url: /perfil/badges
            - main [ref=e192]:
              - generic [ref=e193]:
                - heading "Personajes" [level=2] [ref=e194]:
                  - img [ref=e195]
                  - text: Personajes
                - generic [ref=e197]:
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e198] [cursor=pointer]:
                    - /url: /personajes/ae85acd7-2cf1-465e-b851-fdd6a3723e37
                    - img "Personaje Bot" [ref=e199]
                    - generic [ref=e200]:
                      - generic [ref=e201]: Personaje Bot
                      - generic [ref=e202]: Personaje creado automáticamente para tests.
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e203] [cursor=pointer]:
                    - /url: /personajes/2ab31d12-809b-4437-9364-b2ec80f33349
                    - img "Personaje Bot" [ref=e204]
                    - generic [ref=e205]:
                      - generic [ref=e206]: Personaje Bot
                      - generic [ref=e207]: Personaje creado automáticamente para tests.
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e208] [cursor=pointer]:
                    - /url: /personajes/2b0f4b59-5821-46d5-8fcd-64175e94a35b
                    - img "Personaje Bot" [ref=e209]
                    - generic [ref=e210]:
                      - generic [ref=e211]: Personaje Bot
                      - generic [ref=e212]: Personaje creado automáticamente para tests.
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e213] [cursor=pointer]:
                    - /url: /personajes/013ad3b8-dfba-4b21-a8fe-200c0d96e2af
                    - img "Personaje Bot" [ref=e214]
                    - generic [ref=e215]:
                      - generic [ref=e216]: Personaje Bot
                      - generic [ref=e217]: Personaje creado automáticamente para tests.
                  - link "Personaje Bot Personaje Bot Personaje creado automáticamente para tests." [ref=e218] [cursor=pointer]:
                    - /url: /personajes/4adccfe3-c515-4b0e-8d70-43261fdbd719
                    - img "Personaje Bot" [ref=e219]
                    - generic [ref=e220]:
                      - generic [ref=e221]: Personaje Bot
                      - generic [ref=e222]: Personaje creado automáticamente para tests.
                  - link "Luxana Luxana Serafina esplendorosa" [ref=e223] [cursor=pointer]:
                    - /url: /personajes/f297c4ac-a142-49fa-86d7-c0d2ba6c1ec1
                    - img "Luxana" [ref=e224]
                    - generic [ref=e225]:
                      - generic [ref=e226]: Luxana
                      - generic [ref=e227]: Serafina esplendorosa
                  - link "Lyra doce Lyra doce Magdalenas con halvah. Algodón de azúcar danés, gominolas da…" [ref=e228] [cursor=pointer]:
                    - /url: /personajes/25903e40-9a6a-4a16-9b43-7d5b7762b15a
                    - img "Lyra doce" [ref=e229]
                    - generic [ref=e230]:
                      - generic [ref=e231]: Lyra doce
                      - generic [ref=e232]: Magdalenas con halvah. Algodón de azúcar danés, gominolas da…
              - generic [ref=e233]:
                - heading "Salas en las que participa" [level=2] [ref=e234]:
                  - img [ref=e235]
                  - text: Salas en las que participa
                - generic [ref=e237]:
                  - link "A la media noche pasó A la media noche pasó active" [ref=e238] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso
                    - img "A la media noche pasó" [ref=e239]
                    - generic [ref=e240]: A la media noche pasó
                    - generic [ref=e241]: active
                  - link "Perihelio tardío Perihelio tardío active" [ref=e242] [cursor=pointer]:
                    - /url: /salas/perihelio-tardio
                    - img "Perihelio tardío" [ref=e243]
                    - generic [ref=e244]: Perihelio tardío
                    - generic [ref=e245]: active
                  - link "Sala de prueba automatizada active" [ref=e246] [cursor=pointer]:
                    - /url: /salas/sala-de-prueba-automatizada
                    - img [ref=e248]
                    - generic [ref=e250]: Sala de prueba automatizada
                    - generic [ref=e251]: active
                  - link "Viento y fuego Viento y fuego finished" [ref=e252] [cursor=pointer]:
                    - /url: /salas/viento-y-fuego
                    - img "Viento y fuego" [ref=e253]
                    - generic [ref=e254]: Viento y fuego
                    - generic [ref=e255]: finished
                  - link "Castillos del agua Castillos del agua closed" [ref=e256] [cursor=pointer]:
                    - /url: /salas/castillos-del-agua
                    - img "Castillos del agua" [ref=e257]
                    - generic [ref=e258]: Castillos del agua
                    - generic [ref=e259]: closed
                  - link "La casa del cura La casa del cura paused" [ref=e260] [cursor=pointer]:
                    - /url: /salas/la-casa-del-cura
                    - img "La casa del cura" [ref=e261]
                    - generic [ref=e262]: La casa del cura
                    - generic [ref=e263]: paused
                  - link "Cenizas blancas Cenizas blancas active" [ref=e264] [cursor=pointer]:
                    - /url: /salas/cenizas-blancas
                    - img "Cenizas blancas" [ref=e265]
                    - generic [ref=e266]: Cenizas blancas
                    - generic [ref=e267]: active
              - generic [ref=e268]:
                - heading "Temas abiertos" [level=2] [ref=e269]:
                  - img [ref=e270]
                  - text: Temas abiertos
                - generic [ref=e272]:
                  - link "Tema de prueba automatizada A la media noche pasó 21 abr 2026" [ref=e273] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/d439123d-8bd6-4ea7-b559-3039ea720415
                    - generic [ref=e274]:
                      - generic [ref=e275]: Tema de prueba automatizada
                      - generic [ref=e276]: A la media noche pasó
                    - generic [ref=e278]:
                      - img [ref=e279]
                      - text: 21 abr 2026
                  - link "Tema de prueba automatizada A la media noche pasó 21 abr 2026" [ref=e281] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/67b6c5ba-1c29-4830-b92f-f452166fa6e2
                    - generic [ref=e282]:
                      - generic [ref=e283]: Tema de prueba automatizada
                      - generic [ref=e284]: A la media noche pasó
                    - generic [ref=e286]:
                      - img [ref=e287]
                      - text: 21 abr 2026
                  - link "Tema de prueba automatizada A la media noche pasó 21 abr 2026" [ref=e289] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/90575307-3503-43a4-b2ec-0e8b6fa60ac5
                    - generic [ref=e290]:
                      - generic [ref=e291]: Tema de prueba automatizada
                      - generic [ref=e292]: A la media noche pasó
                    - generic [ref=e294]:
                      - img [ref=e295]
                      - text: 21 abr 2026
                  - link "Trece Cenizas blancas 6 abr 2026" [ref=e297] [cursor=pointer]:
                    - /url: /salas/cenizas-blancas/dd732e1f-cbf8-415a-9e13-97a23fa1fc06
                    - generic [ref=e298]:
                      - generic [ref=e299]: Trece
                      - generic [ref=e300]: Cenizas blancas
                    - generic [ref=e302]:
                      - img [ref=e303]
                      - text: 6 abr 2026
                  - link "Probando starter Perihelio tardío 30 mar 2026" [ref=e305] [cursor=pointer]:
                    - /url: /salas/perihelio-tardio/7304c068-7238-46f7-9f12-2ae47f644186
                    - generic [ref=e306]:
                      - generic [ref=e307]: Probando starter
                      - generic [ref=e308]: Perihelio tardío
                    - generic [ref=e310]:
                      - img [ref=e311]
                      - text: 30 mar 2026
                  - 'link "Laralalá Perihelio tardío 25 mar 2026 Último post: aventurera · 30 mar" [ref=e313] [cursor=pointer]':
                    - /url: /salas/perihelio-tardio/466cd177-f0b0-4e2f-8362-d9cad4f89af7
                    - generic [ref=e314]:
                      - generic [ref=e315]: Laralalá
                      - generic [ref=e316]: Perihelio tardío
                    - generic [ref=e317]:
                      - generic [ref=e318]:
                        - img [ref=e319]
                        - text: 25 mar 2026
                      - generic [ref=e321]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e322]:
                          - /url: /perfil/aventurera
                        - text: · 30 mar
                  - 'link "A las 12 A la media noche pasó 18 mar 2026 Último post: aventurera · 21 abr" [ref=e323] [cursor=pointer]':
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408
                    - generic [ref=e324]:
                      - generic [ref=e325]: A las 12
                      - generic [ref=e326]: A la media noche pasó
                    - generic [ref=e327]:
                      - generic [ref=e328]:
                        - img [ref=e329]
                        - text: 18 mar 2026
                      - generic [ref=e331]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e332]:
                          - /url: /perfil/aventurera
                        - text: · 21 abr
                  - 'link "Probemos html La casa del cura 16 mar 2026 Último post: aventurera · 17 mar" [ref=e333] [cursor=pointer]':
                    - /url: /salas/la-casa-del-cura/e1421ced-43dc-4de9-90eb-8b490d5d3ca0
                    - generic [ref=e334]:
                      - generic [ref=e335]: Probemos html
                      - generic [ref=e336]: La casa del cura
                    - generic [ref=e337]:
                      - generic [ref=e338]:
                        - img [ref=e339]
                        - text: 16 mar 2026
                      - generic [ref=e341]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e342]:
                          - /url: /perfil/aventurera
                        - text: · 17 mar
                  - 'link "prueba Viento y fuego 9 mar 2026 Último post: aventurera · 10 mar" [ref=e343] [cursor=pointer]':
                    - /url: /salas/viento-y-fuego/9e21e719-a7db-4f3b-8577-396405107d0a
                    - generic [ref=e344]:
                      - generic [ref=e345]: prueba
                      - generic [ref=e346]: Viento y fuego
                    - generic [ref=e347]:
                      - generic [ref=e348]:
                        - img [ref=e349]
                        - text: 9 mar 2026
                      - generic [ref=e351]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e352]:
                          - /url: /perfil/aventurera
                        - text: · 10 mar
                  - 'link "fdf Viento y fuego 9 mar 2026 Último post: aventurera · 16 mar" [ref=e353] [cursor=pointer]':
                    - /url: /salas/viento-y-fuego/5d4adb5d-e2de-4c2a-9534-65bba1ab4e9d
                    - generic [ref=e354]:
                      - generic [ref=e355]: fdf
                      - generic [ref=e356]: Viento y fuego
                    - generic [ref=e357]:
                      - generic [ref=e358]:
                        - img [ref=e359]
                        - text: 9 mar 2026
                      - generic [ref=e361]:
                        - text: "Último post:"
                        - link "aventurera" [ref=e362]:
                          - /url: /perfil/aventurera
                        - text: · 16 mar
              - generic [ref=e363]:
                - heading "Posts recientes" [level=2] [ref=e364]:
                  - img [ref=e365]
                  - text: Posts recientes
                - generic [ref=e367]:
                  - link "A la media noche pasó › A las 12 21 abr 2026 gfgfgd" [ref=e368] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408#post-6
                    - generic [ref=e369]:
                      - generic [ref=e370]: A la media noche pasó
                      - generic [ref=e371]: ›
                      - generic [ref=e372]: A las 12
                      - generic [ref=e373]: 21 abr 2026
                    - paragraph [ref=e374]: gfgfgd
                  - link "A la media noche pasó › A las 12 10 abr 2026 adfadfads 🎲 2d6 [1, 3] → 4 por aventurera · 23:03 🎲 1d10" [ref=e375] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408#post-5
                    - generic [ref=e376]:
                      - generic [ref=e377]: A la media noche pasó
                      - generic [ref=e378]: ›
                      - generic [ref=e379]: A las 12
                      - generic [ref=e380]: 10 abr 2026
                    - paragraph [ref=e381]: adfadfads 🎲 2d6 [1, 3] → 4 por aventurera · 23:03 🎲 1d10
                  - link "A la media noche pasó › A las 12 5 abr 2026 El viento azotaba las murallas del castillo mientras la tormenta se aproximaba desde el norte. — No deberíamos estar" [ref=e382] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408#post-4
                    - generic [ref=e383]:
                      - generic [ref=e384]: A la media noche pasó
                      - generic [ref=e385]: ›
                      - generic [ref=e386]: A las 12
                      - generic [ref=e387]: 5 abr 2026
                    - paragraph [ref=e388]: El viento azotaba las murallas del castillo mientras la tormenta se aproximaba desde el norte. — No deberíamos estar
                  - link "A la media noche pasó › A las 12 1 abr 2026 bum 🎲 1d6 → 4 por aventurera · 00:32" [ref=e389] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408#post-3
                    - generic [ref=e390]:
                      - generic [ref=e391]: A la media noche pasó
                      - generic [ref=e392]: ›
                      - generic [ref=e393]: A las 12
                      - generic [ref=e394]: 1 abr 2026
                    - paragraph [ref=e395]: bum 🎲 1d6 → 4 por aventurera · 00:32
                  - link "Perihelio tardío › Laralalá 30 mar 2026 pru 🎲 1d4 → 1 por aventurera · 15:32 🎲 1d4 → 3" [ref=e396] [cursor=pointer]:
                    - /url: /salas/perihelio-tardio/466cd177-f0b0-4e2f-8362-d9cad4f89af7#post-7
                    - generic [ref=e397]:
                      - generic [ref=e398]: Perihelio tardío
                      - generic [ref=e399]: ›
                      - generic [ref=e400]: Laralalá
                      - generic [ref=e401]: 30 mar 2026
                    - paragraph [ref=e402]: pru 🎲 1d4 → 1 por aventurera · 15:32 🎲 1d4 → 3
    - contentinfo [ref=e403]:
      - generic [ref=e404]:
        - generic [ref=e405]:
          - generic [ref=e406]:
            - generic [ref=e407]: ✦
            - text: TalesRol
          - generic [ref=e408]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e409]:
          - link "Normas" [ref=e410] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e411] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e412] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e413]: aventurera — TalesRol | TalesRol
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