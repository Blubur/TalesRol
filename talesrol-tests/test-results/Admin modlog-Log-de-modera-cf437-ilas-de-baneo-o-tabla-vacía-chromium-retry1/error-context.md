# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Admin modlog.spec.ts >> Log de moderación >> Filtrar por acción "Baneo" muestra solo filas de baneo o tabla vacía
- Location: tests\Admin modlog.spec.ts:71:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Baneo"
Received: "Desbaneo"
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
              - /url: /salas/sala-de-prueba-automatizada-1776930103104
              - generic [ref=e74]: Sala de prueba automatizada
            - link "Sala de prueba automatizada" [ref=e75] [cursor=pointer]:
              - /url: /salas/sala-de-prueba-automatizada-1776864887068
              - generic [ref=e78]: Sala de prueba automatizada
            - link "Sala de prueba automatizada" [ref=e79] [cursor=pointer]:
              - /url: /salas/sala-de-prueba-automatizada
              - generic [ref=e82]: Sala de prueba automatizada
            - link "A la media noche pasó solo noche" [ref=e83] [cursor=pointer]:
              - /url: /salas/a-la-media-noche-paso
              - generic [ref=e85]:
                - generic [ref=e86]: A la media noche pasó
                - generic [ref=e87]: solo noche
            - link "Cenizas blancas Fantasia angelical" [ref=e88] [cursor=pointer]:
              - /url: /salas/cenizas-blancas
              - generic [ref=e90]:
                - generic [ref=e91]: Cenizas blancas
                - generic [ref=e92]: Fantasia angelical
            - link "Perihelio tardío sci fi" [ref=e93] [cursor=pointer]:
              - /url: /salas/perihelio-tardio
              - generic [ref=e95]:
                - generic [ref=e96]: Perihelio tardío
                - generic [ref=e97]: sci fi
            - 'link "Josepa y Camila se van a Benidorm TW: Josepa en bañador" [ref=e98] [cursor=pointer]':
              - /url: /salas/josepa-y-camila-se-van-a-benidorm
              - generic [ref=e100]:
                - generic [ref=e101]: Josepa y Camila se van a Benidorm
                - generic [ref=e102]: "TW: Josepa en bañador"
        - button "Accesos Rápidos" [ref=e105] [cursor=pointer]:
          - img [ref=e107]
          - generic [ref=e109]: Accesos Rápidos
          - img [ref=e111]
      - main [ref=e113]:
        - generic [ref=e114]:
          - generic [ref=e115]:
            - generic [ref=e116]:
              - img [ref=e117]
              - generic [ref=e119]:
                - heading "Panel de Administración" [level=1] [ref=e120]
                - paragraph [ref=e121]: Control total del sistema
            - link "← Volver al inicio" [ref=e122] [cursor=pointer]:
              - /url: /
          - generic [ref=e123]:
            - generic [ref=e124]:
              - img [ref=e125]
              - generic [ref=e127]:
                - generic [ref=e128]: "12"
                - generic [ref=e129]: Usuarios
            - generic [ref=e130]:
              - img [ref=e131]
              - generic [ref=e133]:
                - generic [ref=e134]: "10"
                - generic [ref=e135]: Salas
            - generic [ref=e136]:
              - img [ref=e137]
              - generic [ref=e139]:
                - generic [ref=e140]: "77"
                - generic [ref=e141]: Posts
            - generic [ref=e142]:
              - img [ref=e143]
              - generic [ref=e145]:
                - generic [ref=e146]: "3"
                - generic [ref=e147]: Reportes pendientes
          - navigation [ref=e148]:
            - link "Reportes" [ref=e149] [cursor=pointer]:
              - /url: "#reportes"
              - img [ref=e150]
              - text: Reportes
            - link "Usuarios" [ref=e152] [cursor=pointer]:
              - /url: "#usuarios"
              - img [ref=e153]
              - text: Usuarios
            - link "Salas" [ref=e155] [cursor=pointer]:
              - /url: "#salas"
              - img [ref=e156]
              - text: Salas
            - link "Dados" [ref=e158] [cursor=pointer]:
              - /url: "#dados"
              - img [ref=e159]
              - text: Dados
            - link "Etiquetas" [ref=e161] [cursor=pointer]:
              - /url: "#etiquetas"
              - img [ref=e162]
              - text: Etiquetas
            - link "Anuncios" [ref=e165] [cursor=pointer]:
              - /url: "#anuncios"
              - img [ref=e166]
              - text: Anuncios
            - link "Eventos" [ref=e168] [cursor=pointer]:
              - /url: "#eventos"
              - img [ref=e169]
              - text: Eventos
            - link "Actividad" [ref=e171] [cursor=pointer]:
              - /url: "#modlog"
              - img [ref=e172]
              - text: Actividad
            - link "Bloqueados" [ref=e174] [cursor=pointer]:
              - /url: "#bloqueados"
              - img [ref=e175]
              - text: Bloqueados
            - link "CSS" [ref=e177] [cursor=pointer]:
              - /url: /admin/css
              - img [ref=e178]
              - text: CSS
            - link "Configuración" [ref=e180] [cursor=pointer]:
              - /url: /admin/config
              - img [ref=e181]
              - text: Configuración
          - generic [ref=e184]:
            - generic [ref=e185]:
              - img [ref=e186]
              - heading "Reportes 3 pendientes" [level=2] [ref=e188]:
                - text: Reportes
                - generic [ref=e189]: 3 pendientes
            - generic [ref=e190]:
              - generic [ref=e191]:
                - button "Pendiente 3" [ref=e192] [cursor=pointer]:
                  - text: Pendiente
                  - generic [ref=e193]: "3"
                - button "Todos 5" [ref=e194] [cursor=pointer]:
                  - text: Todos
                  - generic [ref=e195]: "5"
                - button "Resuelto 2" [ref=e196] [cursor=pointer]:
                  - text: Resuelto
                  - generic [ref=e197]: "2"
                - button "Descartado 0" [ref=e198] [cursor=pointer]:
                  - text: Descartado
                  - generic [ref=e199]: "0"
              - generic [ref=e200]:
                - generic [ref=e201]:
                  - generic [ref=e202]:
                    - generic [ref=e203]: Pendiente
                    - generic [ref=e204]:
                      - img [ref=e205]
                      - text: Post
                    - generic [ref=e207]: 23 mar 2026
                  - generic [ref=e208]:
                    - generic [ref=e209]:
                      - img [ref=e210]
                      - generic [ref=e212]: "Reportado por:"
                      - link "@aventurera" [ref=e213] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e214]:
                      - img [ref=e215]
                      - generic [ref=e217]: "Post:"
                      - generic [ref=e218]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e219] [cursor=pointer]:
                      - generic [ref=e220]: "Motivo:"
                      - generic [ref=e221]: Bloqueado por director/moderador
                  - generic [ref=e222]:
                    - button "Resolver" [ref=e223] [cursor=pointer]:
                      - img [ref=e224]
                      - text: Resolver
                    - button "Descartar" [ref=e226] [cursor=pointer]:
                      - img [ref=e227]
                      - text: Descartar
                - generic [ref=e229]:
                  - generic [ref=e230]:
                    - generic [ref=e231]: Pendiente
                    - generic [ref=e232]:
                      - img [ref=e233]
                      - text: Post
                    - generic [ref=e235]: 22 mar 2026
                  - generic [ref=e236]:
                    - generic [ref=e237]:
                      - img [ref=e238]
                      - generic [ref=e240]: "Reportado por:"
                      - link "@aventurera" [ref=e241] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e242]:
                      - img [ref=e243]
                      - generic [ref=e245]: "Post:"
                      - generic [ref=e246]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e247] [cursor=pointer]:
                      - generic [ref=e248]: "Motivo:"
                      - generic [ref=e249]: Bloqueado por director/moderador
                  - generic [ref=e250]:
                    - button "Resolver" [ref=e251] [cursor=pointer]:
                      - img [ref=e252]
                      - text: Resolver
                    - button "Descartar" [ref=e254] [cursor=pointer]:
                      - img [ref=e255]
                      - text: Descartar
                - generic [ref=e257]:
                  - generic [ref=e258]:
                    - generic [ref=e259]: Pendiente
                    - generic [ref=e260]:
                      - img [ref=e261]
                      - text: Usuario
                    - generic [ref=e263]: 10 mar 2026
                  - generic [ref=e264]:
                    - generic [ref=e265]:
                      - img [ref=e266]
                      - generic [ref=e268]: "Reportado por:"
                      - link "@aventurera" [ref=e269] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e270]:
                      - img [ref=e271]
                      - generic [ref=e273]: "Usuario reportado:"
                      - link "@Zorra" [ref=e274] [cursor=pointer]:
                        - /url: /perfil/Zorra
                    - generic [ref=e275] [cursor=pointer]:
                      - generic [ref=e276]: "Motivo:"
                      - generic [ref=e277]: Comportamiento inapropiado
                  - generic [ref=e278]:
                    - button "Resolver" [ref=e279] [cursor=pointer]:
                      - img [ref=e280]
                      - text: Resolver
                    - button "Descartar" [ref=e282] [cursor=pointer]:
                      - img [ref=e283]
                      - text: Descartar
                    - button "Avisar usuario" [ref=e286] [cursor=pointer]:
                      - img [ref=e287]
                      - text: Avisar usuario
                    - button "Banear" [ref=e289] [cursor=pointer]:
                      - img [ref=e290]
                      - text: Banear
                    - button "Banear IP" [ref=e292] [cursor=pointer]:
                      - img [ref=e293]
                      - text: Banear IP
          - generic [ref=e295]:
            - generic [ref=e296]:
              - img [ref=e297]
              - heading "Usuarios (12)" [level=2] [ref=e299]:
                - text: Usuarios
                - generic [ref=e300]: (12)
            - generic [ref=e301]:
              - generic [ref=e302]:
                - generic [ref=e303]:
                  - img
                  - textbox "Buscar por nombre, usuario o email..." [ref=e304]
                - button "Colores de rol" [ref=e305] [cursor=pointer]:
                  - img [ref=e306]
                  - text: Colores de rol
              - generic [ref=e308]:
                - generic [ref=e309]:
                  - generic [ref=e310]: Rol
                  - generic [ref=e311]:
                    - button "Todos" [ref=e312] [cursor=pointer]
                    - button "admin" [ref=e313] [cursor=pointer]
                    - button "master" [ref=e314] [cursor=pointer]
                    - button "director" [ref=e315] [cursor=pointer]
                    - button "jugador" [ref=e316] [cursor=pointer]
                    - button "miembro" [ref=e317] [cursor=pointer]
                - generic [ref=e318]:
                  - generic [ref=e319]: Estado
                  - generic [ref=e320]:
                    - button "Todos" [ref=e321] [cursor=pointer]
                    - button "Activos" [ref=e322] [cursor=pointer]
                    - button "Baneados" [ref=e323] [cursor=pointer]
                - generic [ref=e324]:
                  - generic [ref=e325]: Registro
                  - generic [ref=e326]:
                    - textbox [ref=e327] [cursor=pointer]
                    - generic [ref=e328]: —
                    - textbox [ref=e329] [cursor=pointer]
                - generic [ref=e330]: 12 de 12
              - table [ref=e332]:
                - rowgroup [ref=e333]:
                  - row "Usuario Correo Rol Estado Puntos Registrado Acciones" [ref=e334]:
                    - columnheader "Usuario" [ref=e335]:
                      - button "Usuario" [ref=e336] [cursor=pointer]:
                        - text: Usuario
                        - img [ref=e337]
                    - columnheader "Correo" [ref=e339]
                    - columnheader "Rol" [ref=e340]
                    - columnheader "Estado" [ref=e341]
                    - columnheader "Puntos" [ref=e342]:
                      - button "Puntos" [ref=e343] [cursor=pointer]:
                        - text: Puntos
                        - img [ref=e344]
                    - columnheader "Registrado" [ref=e346]:
                      - button "Registrado" [ref=e347] [cursor=pointer]:
                        - text: Registrado
                        - img [ref=e348]
                    - columnheader "Acciones" [ref=e350]
                - rowgroup [ref=e351]:
                  - row "testbot1776929973182 testbot1776929973182 @testbot1776929973182 testbot_1776929973182@mailinator.com admin Activo 0 23 abr 26 Banear" [ref=e352]:
                    - cell "testbot1776929973182 testbot1776929973182 @testbot1776929973182" [ref=e353]:
                      - link "testbot1776929973182 testbot1776929973182 @testbot1776929973182" [ref=e354] [cursor=pointer]:
                        - /url: /perfil/testbot1776929973182
                        - img "testbot1776929973182" [ref=e355]
                        - generic [ref=e356]:
                          - generic [ref=e357]: testbot1776929973182
                          - generic [ref=e358]: "@testbot1776929973182"
                    - cell "testbot_1776929973182@mailinator.com" [ref=e359]
                    - cell "admin" [ref=e360]:
                      - combobox [ref=e362] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e363]
                    - cell "0" [ref=e364]
                    - cell "23 abr 26" [ref=e365]
                    - cell "Banear" [ref=e366]:
                      - button "Banear" [ref=e368] [cursor=pointer]:
                        - img [ref=e369]
                        - text: Banear
                  - row "testbot1776864705975 testbot1776864705975 @testbot1776864705975 testbot_1776864705975@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e371]:
                    - cell "testbot1776864705975 testbot1776864705975 @testbot1776864705975" [ref=e372]:
                      - link "testbot1776864705975 testbot1776864705975 @testbot1776864705975" [ref=e373] [cursor=pointer]:
                        - /url: /perfil/testbot1776864705975
                        - img "testbot1776864705975" [ref=e374]
                        - generic [ref=e375]:
                          - generic [ref=e376]: testbot1776864705975
                          - generic [ref=e377]: "@testbot1776864705975"
                    - cell "testbot_1776864705975@mailinator.com" [ref=e378]
                    - cell "admin" [ref=e379]:
                      - combobox [ref=e381] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e382]
                    - cell "0" [ref=e383]
                    - cell "22 abr 26" [ref=e384]
                    - cell "Banear" [ref=e385]:
                      - button "Banear" [ref=e387] [cursor=pointer]:
                        - img [ref=e388]
                        - text: Banear
                  - row "testbot1776845705320 testbot1776845705320 @testbot1776845705320 testbot_1776845705320@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e390]:
                    - cell "testbot1776845705320 testbot1776845705320 @testbot1776845705320" [ref=e391]:
                      - link "testbot1776845705320 testbot1776845705320 @testbot1776845705320" [ref=e392] [cursor=pointer]:
                        - /url: /perfil/testbot1776845705320
                        - img "testbot1776845705320" [ref=e393]
                        - generic [ref=e394]:
                          - generic [ref=e395]: testbot1776845705320
                          - generic [ref=e396]: "@testbot1776845705320"
                    - cell "testbot_1776845705320@mailinator.com" [ref=e397]
                    - cell "admin" [ref=e398]:
                      - combobox [ref=e400] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e401]
                    - cell "0" [ref=e402]
                    - cell "22 abr 26" [ref=e403]
                    - cell "Banear" [ref=e404]:
                      - button "Banear" [ref=e406] [cursor=pointer]:
                        - img [ref=e407]
                        - text: Banear
                  - row "testbot1776842601153 testbot1776842601153 @testbot1776842601153 testbot_1776842601153@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e409]:
                    - cell "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e410]:
                      - link "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e411] [cursor=pointer]:
                        - /url: /perfil/testbot1776842601153
                        - img "testbot1776842601153" [ref=e412]
                        - generic [ref=e413]:
                          - generic [ref=e414]: testbot1776842601153
                          - generic [ref=e415]: "@testbot1776842601153"
                    - cell "testbot_1776842601153@mailinator.com" [ref=e416]
                    - cell "admin" [ref=e417]:
                      - combobox [ref=e419] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e420]
                    - cell "0" [ref=e421]
                    - cell "22 abr 26" [ref=e422]
                    - cell "Banear" [ref=e423]:
                      - button "Banear" [ref=e425] [cursor=pointer]:
                        - img [ref=e426]
                        - text: Banear
                  - row "testbot1776807228952 testbot1776807228952 @testbot1776807228952 testbot_1776807228952@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e428]:
                    - cell "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e429]:
                      - link "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e430] [cursor=pointer]:
                        - /url: /perfil/testbot1776807228952
                        - img "testbot1776807228952" [ref=e431]
                        - generic [ref=e432]:
                          - generic [ref=e433]: testbot1776807228952
                          - generic [ref=e434]: "@testbot1776807228952"
                    - cell "testbot_1776807228952@mailinator.com" [ref=e435]
                    - cell "admin" [ref=e436]:
                      - combobox [ref=e438] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e439]
                    - cell "0" [ref=e440]
                    - cell "21 abr 26" [ref=e441]
                    - cell "Banear" [ref=e442]:
                      - button "Banear" [ref=e444] [cursor=pointer]:
                        - img [ref=e445]
                        - text: Banear
                  - row "testbot1776806837639 testbot1776806837639 @testbot1776806837639 testbot_1776806837639@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e447]:
                    - cell "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e448]:
                      - link "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e449] [cursor=pointer]:
                        - /url: /perfil/testbot1776806837639
                        - img "testbot1776806837639" [ref=e450]
                        - generic [ref=e451]:
                          - generic [ref=e452]: testbot1776806837639
                          - generic [ref=e453]: "@testbot1776806837639"
                    - cell "testbot_1776806837639@mailinator.com" [ref=e454]
                    - cell "admin" [ref=e455]:
                      - combobox [ref=e457] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e458]
                    - cell "0" [ref=e459]
                    - cell "21 abr 26" [ref=e460]
                    - cell "Banear" [ref=e461]:
                      - button "Banear" [ref=e463] [cursor=pointer]:
                        - img [ref=e464]
                        - text: Banear
                  - row "testbot1776797825837 testbot1776797825837 @testbot1776797825837 testbot_1776797825837@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e466]:
                    - cell "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e467]:
                      - link "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e468] [cursor=pointer]:
                        - /url: /perfil/testbot1776797825837
                        - img "testbot1776797825837" [ref=e469]
                        - generic [ref=e470]:
                          - generic [ref=e471]: testbot1776797825837
                          - generic [ref=e472]: "@testbot1776797825837"
                    - cell "testbot_1776797825837@mailinator.com" [ref=e473]
                    - cell "admin" [ref=e474]:
                      - combobox [ref=e476] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e477]
                    - cell "0" [ref=e478]
                    - cell "21 abr 26" [ref=e479]
                    - cell "Banear" [ref=e480]:
                      - button "Banear" [ref=e482] [cursor=pointer]:
                        - img [ref=e483]
                        - text: Banear
                  - row "testbot1776797707071 testbot1776797707071 @testbot1776797707071 testbot_1776797707071@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e485]:
                    - cell "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e486]:
                      - link "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e487] [cursor=pointer]:
                        - /url: /perfil/testbot1776797707071
                        - img "testbot1776797707071" [ref=e488]
                        - generic [ref=e489]:
                          - generic [ref=e490]: testbot1776797707071
                          - generic [ref=e491]: "@testbot1776797707071"
                    - cell "testbot_1776797707071@mailinator.com" [ref=e492]
                    - cell "admin" [ref=e493]:
                      - combobox [ref=e495] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e496]
                    - cell "0" [ref=e497]
                    - cell "21 abr 26" [ref=e498]
                    - cell "Banear" [ref=e499]:
                      - button "Banear" [ref=e501] [cursor=pointer]:
                        - img [ref=e502]
                        - text: Banear
                  - row "Puck Puck @Puck loregalafate@gmail.com admin Activo 0 16 mar 26 Banear" [ref=e504]:
                    - cell "Puck Puck @Puck" [ref=e505]:
                      - link "Puck Puck @Puck" [ref=e506] [cursor=pointer]:
                        - /url: /perfil/Puck
                        - img "Puck" [ref=e507]
                        - generic [ref=e508]:
                          - generic [ref=e509]: Puck
                          - generic [ref=e510]: "@Puck"
                    - cell "loregalafate@gmail.com" [ref=e511]
                    - cell "admin" [ref=e512]:
                      - combobox [ref=e514] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e515]
                    - cell "0" [ref=e516]
                    - cell "16 mar 26" [ref=e517]
                    - cell "Banear" [ref=e518]:
                      - button "Banear" [ref=e520] [cursor=pointer]:
                        - img [ref=e521]
                        - text: Banear
                  - row "Blu Aventurera Rosa @Blu pililahiguera@gmail.com master Activo 0 16 mar 26 Banear" [ref=e523]:
                    - cell "Blu Aventurera Rosa @Blu" [ref=e524]:
                      - link "Blu Aventurera Rosa @Blu" [ref=e525] [cursor=pointer]:
                        - /url: /perfil/Blu
                        - img "Blu" [ref=e526]
                        - generic [ref=e527]:
                          - generic [ref=e528]: Aventurera Rosa
                          - generic [ref=e529]: "@Blu"
                    - cell "pililahiguera@gmail.com" [ref=e530]
                    - cell "master" [ref=e531]:
                      - combobox [ref=e533] [cursor=pointer]:
                        - option "admin"
                        - option "master" [selected]
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e534]
                    - cell "0" [ref=e535]
                    - cell "16 mar 26" [ref=e536]
                    - cell "Banear" [ref=e537]:
                      - button "Banear" [ref=e539] [cursor=pointer]:
                        - img [ref=e540]
                        - text: Banear
                  - row "Zorra Zorra @Zorra test@fatrol.com jugador Activo 70 8 mar 26 Banear" [ref=e542]:
                    - cell "Zorra Zorra @Zorra" [ref=e543]:
                      - link "Zorra Zorra @Zorra" [ref=e544] [cursor=pointer]:
                        - /url: /perfil/Zorra
                        - img "Zorra" [ref=e545]
                        - generic [ref=e546]:
                          - generic [ref=e547]: Zorra
                          - generic [ref=e548]: "@Zorra"
                    - cell "test@fatrol.com" [ref=e549]
                    - cell "jugador" [ref=e550]:
                      - combobox [ref=e552] [cursor=pointer]:
                        - option "admin"
                        - option "master"
                        - option "director"
                        - option "jugador" [selected]
                        - option "miembro"
                    - cell "Activo" [ref=e553]
                    - cell "70" [ref=e554]
                    - cell "8 mar 26" [ref=e555]
                    - cell "Banear" [ref=e556]:
                      - button "Banear" [ref=e558] [cursor=pointer]:
                        - img [ref=e559]
                        - text: Banear
                  - row "aventurera aventurera @aventurera veinticuatro0792@gmail.com admin Activo 85 7 mar 26 Tú" [ref=e561]:
                    - cell "aventurera aventurera @aventurera" [ref=e562]:
                      - link "aventurera aventurera @aventurera" [ref=e563] [cursor=pointer]:
                        - /url: /perfil/aventurera
                        - img "aventurera" [ref=e564]
                        - generic [ref=e565]:
                          - generic [ref=e566]: aventurera
                          - generic [ref=e567]: "@aventurera"
                    - cell "veinticuatro0792@gmail.com" [ref=e568]
                    - cell "admin" [ref=e569]:
                      - combobox [disabled] [ref=e571]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e572]
                    - cell "85" [ref=e573]
                    - cell "7 mar 26" [ref=e574]
                    - cell "Tú" [ref=e575]
          - generic [ref=e576]:
            - generic [ref=e577]:
              - img [ref=e578]
              - heading "Salas (10)" [level=2] [ref=e580]:
                - text: Salas
                - generic [ref=e581]: (10)
            - generic [ref=e582]:
              - textbox "Buscar por título o creador..." [ref=e584]
              - generic [ref=e585]:
                - generic [ref=e586]:
                  - generic [ref=e587]: Estado
                  - generic [ref=e588]:
                    - button "Todos" [ref=e589] [cursor=pointer]
                    - button "Próximamente" [ref=e590] [cursor=pointer]
                    - button "Activa" [ref=e591] [cursor=pointer]
                    - button "En pausa" [ref=e592] [cursor=pointer]
                    - button "Finalizada" [ref=e593] [cursor=pointer]
                    - button "Cerrada" [ref=e594] [cursor=pointer]
                    - button "Archivada" [ref=e595] [cursor=pointer]
                - generic [ref=e596]:
                  - generic [ref=e597]: Creación
                  - generic [ref=e598]:
                    - textbox [ref=e599] [cursor=pointer]
                    - generic [ref=e600]: —
                    - textbox [ref=e601] [cursor=pointer]
                - generic [ref=e602]: 10 de 10
              - generic [ref=e603]:
                - generic [ref=e605]:
                  - button [ref=e606] [cursor=pointer]:
                    - img [ref=e607]
                  - generic [ref=e611]:
                    - generic [ref=e613]: Sala de prueba automatizada
                    - generic [ref=e614]: aventurera
                  - combobox [ref=e615] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e616]: 23 abr 26
                  - generic [ref=e617]:
                    - link "Miembros" [ref=e618] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada-1776930103104/miembros
                      - img [ref=e619]
                      - text: Miembros
                    - link "Ver" [ref=e621] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada-1776930103104
                      - img [ref=e622]
                      - text: Ver
                    - button "Eliminar" [ref=e624] [cursor=pointer]:
                      - img [ref=e625]
                      - text: Eliminar
                - generic [ref=e628]:
                  - button [ref=e629] [cursor=pointer]:
                    - img [ref=e630]
                  - generic [ref=e634]:
                    - generic [ref=e636]: Sala de prueba automatizada
                    - generic [ref=e637]: aventurera
                  - combobox [ref=e638] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e639]: 22 abr 26
                  - generic [ref=e640]:
                    - link "Miembros" [ref=e641] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada-1776864887068/miembros
                      - img [ref=e642]
                      - text: Miembros
                    - link "Ver" [ref=e644] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada-1776864887068
                      - img [ref=e645]
                      - text: Ver
                    - button "Eliminar" [ref=e647] [cursor=pointer]:
                      - img [ref=e648]
                      - text: Eliminar
                - generic [ref=e651]:
                  - button [ref=e652] [cursor=pointer]:
                    - img [ref=e653]
                  - generic [ref=e657]:
                    - generic [ref=e659]: Sala de prueba automatizada
                    - generic [ref=e660]: aventurera
                  - combobox [ref=e661] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e662]: 22 abr 26
                  - generic [ref=e663]:
                    - link "Miembros" [ref=e664] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada/miembros
                      - img [ref=e665]
                      - text: Miembros
                    - link "Ver" [ref=e667] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada
                      - img [ref=e668]
                      - text: Ver
                    - button "Eliminar" [ref=e670] [cursor=pointer]:
                      - img [ref=e671]
                      - text: Eliminar
                - generic [ref=e674]:
                  - button [ref=e675] [cursor=pointer]:
                    - img [ref=e676]
                  - img "Cenizas blancas" [ref=e679]
                  - generic [ref=e680]:
                    - generic [ref=e682]: Cenizas blancas
                    - generic [ref=e683]: aventurera
                  - generic [ref=e684]:
                    - generic [ref=e685]: Fantasia angelical
                    - generic [ref=e686]: "TW: vais a llorar"
                  - combobox [ref=e687] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e688]: 5 abr 26
                  - generic [ref=e689]:
                    - link "Miembros" [ref=e690] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas/miembros
                      - img [ref=e691]
                      - text: Miembros
                    - link "Ver" [ref=e693] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas
                      - img [ref=e694]
                      - text: Ver
                    - button "Eliminar" [ref=e696] [cursor=pointer]:
                      - img [ref=e697]
                      - text: Eliminar
                - generic [ref=e700]:
                  - button [ref=e701] [cursor=pointer]:
                    - img [ref=e702]
                  - img "Perihelio tardío" [ref=e705]
                  - generic [ref=e706]:
                    - generic [ref=e708]: Perihelio tardío
                    - generic [ref=e709]: aventurera
                  - generic [ref=e711]: sci fi
                  - combobox [ref=e712] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e713]: 22 mar 26
                  - generic [ref=e714]:
                    - link "Miembros" [ref=e715] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio/miembros
                      - img [ref=e716]
                      - text: Miembros
                    - link "Ver" [ref=e718] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio
                      - img [ref=e719]
                      - text: Ver
                    - button "Eliminar" [ref=e721] [cursor=pointer]:
                      - img [ref=e722]
                      - text: Eliminar
                - generic [ref=e725]:
                  - button [ref=e726] [cursor=pointer]:
                    - img [ref=e727]
                  - img "A la media noche pasó" [ref=e730]
                  - generic [ref=e731]:
                    - generic [ref=e733]: A la media noche pasó
                    - generic [ref=e734]: aventurera
                  - generic [ref=e735]:
                    - generic [ref=e736]: solo noche
                    - generic [ref=e737]: algodones
                  - combobox [ref=e738] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e739]: 18 mar 26
                  - generic [ref=e740]:
                    - link "Miembros" [ref=e741] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso/miembros
                      - img [ref=e742]
                      - text: Miembros
                    - link "Ver" [ref=e744] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso
                      - img [ref=e745]
                      - text: Ver
                    - button "Eliminar" [ref=e747] [cursor=pointer]:
                      - img [ref=e748]
                      - text: Eliminar
                - generic [ref=e751]:
                  - button [ref=e752] [cursor=pointer]:
                    - img [ref=e753]
                  - img "Josepa y Camila se van a Benidorm" [ref=e756]
                  - generic [ref=e757]:
                    - generic [ref=e759]: Josepa y Camila se van a Benidorm
                    - generic [ref=e760]: Puck
                  - generic [ref=e762]: "TW: Josepa en bañador"
                  - combobox [ref=e763] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e764]: 16 mar 26
                  - generic [ref=e765]:
                    - link "Miembros" [ref=e766] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm/miembros
                      - img [ref=e767]
                      - text: Miembros
                    - link "Ver" [ref=e769] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm
                      - img [ref=e770]
                      - text: Ver
                    - button "Eliminar" [ref=e772] [cursor=pointer]:
                      - img [ref=e773]
                      - text: Eliminar
                - generic [ref=e776]:
                  - button [ref=e777] [cursor=pointer]:
                    - img [ref=e778]
                  - img "La casa del cura" [ref=e781]
                  - generic [ref=e782]:
                    - generic [ref=e784]: La casa del cura
                    - generic [ref=e785]: aventurera
                  - generic [ref=e786]:
                    - generic [ref=e787]: fantasía
                    - generic [ref=e788]: arañas
                    - generic [ref=e789]: religión
                  - combobox [ref=e790] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa" [selected]
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e791]: 16 mar 26
                  - generic [ref=e792]:
                    - link "Miembros" [ref=e793] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura/miembros
                      - img [ref=e794]
                      - text: Miembros
                    - link "Ver" [ref=e796] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura
                      - img [ref=e797]
                      - text: Ver
                    - button "Eliminar" [ref=e799] [cursor=pointer]:
                      - img [ref=e800]
                      - text: Eliminar
                - generic [ref=e803]:
                  - button [ref=e804] [cursor=pointer]:
                    - img [ref=e805]
                  - img "Viento y fuego" [ref=e808]
                  - generic [ref=e809]:
                    - generic [ref=e811]: Viento y fuego
                    - generic [ref=e812]: aventurera
                  - generic [ref=e813]:
                    - generic [ref=e814]: Violencia
                    - generic [ref=e815]: Misterio
                  - combobox [ref=e816] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada" [selected]
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e817]: 9 mar 26
                  - generic [ref=e818]:
                    - link "Miembros" [ref=e819] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego/miembros
                      - img [ref=e820]
                      - text: Miembros
                    - link "Ver" [ref=e822] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego
                      - img [ref=e823]
                      - text: Ver
                    - button "Eliminar" [ref=e825] [cursor=pointer]:
                      - img [ref=e826]
                      - text: Eliminar
                - generic [ref=e829]:
                  - button [ref=e830] [cursor=pointer]:
                    - img [ref=e831]
                  - img "Castillos del agua" [ref=e834]
                  - generic [ref=e835]:
                    - generic [ref=e837]: Castillos del agua
                    - generic [ref=e838]: aventurera
                  - generic [ref=e840]: Fantasía
                  - combobox [ref=e841] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada" [selected]
                    - option "Archivada"
                  - generic [ref=e842]: 7 mar 26
                  - generic [ref=e843]:
                    - link "Miembros" [ref=e844] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua/miembros
                      - img [ref=e845]
                      - text: Miembros
                    - link "Ver" [ref=e847] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua
                      - img [ref=e848]
                      - text: Ver
                    - button "Eliminar" [ref=e850] [cursor=pointer]:
                      - img [ref=e851]
                      - text: Eliminar
          - generic [ref=e853]:
            - generic [ref=e854]:
              - img [ref=e855]
              - heading "Tipos de Dado (8)" [level=2] [ref=e857]:
                - text: Tipos de Dado
                - generic [ref=e858]: (8)
            - generic [ref=e860]:
              - generic [ref=e861]:
                - generic [ref=e862]: d2
                - generic [ref=e863]:
                  - generic [ref=e864]: 2 caras
                  - generic [ref=e865]: cara o cruz
                - generic [ref=e866]:
                  - button [ref=e867] [cursor=pointer]:
                    - img [ref=e868]
                  - button [ref=e870] [cursor=pointer]:
                    - img [ref=e871]
              - generic [ref=e873]:
                - generic [ref=e874]: d4
                - generic [ref=e875]:
                  - generic [ref=e876]: 4 caras
                  - generic [ref=e877]: Dado de 4 caras
                - generic [ref=e878]:
                  - button [ref=e879] [cursor=pointer]:
                    - img [ref=e880]
                  - button [ref=e882] [cursor=pointer]:
                    - img [ref=e883]
              - generic [ref=e885]:
                - generic [ref=e886]: d6
                - generic [ref=e887]:
                  - generic [ref=e888]: 6 caras
                  - generic [ref=e889]: Dado de 6 caras
                - generic [ref=e890]:
                  - button [ref=e891] [cursor=pointer]:
                    - img [ref=e892]
                  - button [ref=e894] [cursor=pointer]:
                    - img [ref=e895]
              - generic [ref=e897]:
                - generic [ref=e898]: d8
                - generic [ref=e899]:
                  - generic [ref=e900]: 8 caras
                  - generic [ref=e901]: Dado de 8 caras
                - generic [ref=e902]:
                  - button [ref=e903] [cursor=pointer]:
                    - img [ref=e904]
                  - button [ref=e906] [cursor=pointer]:
                    - img [ref=e907]
              - generic [ref=e909]:
                - generic [ref=e910]: d10
                - generic [ref=e911]:
                  - generic [ref=e912]: 10 caras
                  - generic [ref=e913]: Dado de 10 caras
                - generic [ref=e914]:
                  - button [ref=e915] [cursor=pointer]:
                    - img [ref=e916]
                  - button [ref=e918] [cursor=pointer]:
                    - img [ref=e919]
              - generic [ref=e921]:
                - generic [ref=e922]: d12
                - generic [ref=e923]:
                  - generic [ref=e924]: 12 caras
                  - generic [ref=e925]: Dado de 12 caras
                - generic [ref=e926]:
                  - button [ref=e927] [cursor=pointer]:
                    - img [ref=e928]
                  - button [ref=e930] [cursor=pointer]:
                    - img [ref=e931]
              - generic [ref=e933]:
                - generic [ref=e934]: d20
                - generic [ref=e935]:
                  - generic [ref=e936]: 20 caras
                  - generic [ref=e937]: Dado de 20 caras
                - generic [ref=e938]:
                  - button [ref=e939] [cursor=pointer]:
                    - img [ref=e940]
                  - button [ref=e942] [cursor=pointer]:
                    - img [ref=e943]
              - generic [ref=e945]:
                - generic [ref=e946]: d100
                - generic [ref=e947]:
                  - generic [ref=e948]: 100 caras
                  - generic [ref=e949]: Dado percentil
                - generic [ref=e950]:
                  - button [ref=e951] [cursor=pointer]:
                    - img [ref=e952]
                  - button [ref=e954] [cursor=pointer]:
                    - img [ref=e955]
              - button "Nuevo dado" [ref=e957] [cursor=pointer]:
                - img [ref=e958]
                - text: Nuevo dado
          - generic [ref=e960]:
            - generic [ref=e961]:
              - img [ref=e962]
              - heading "Etiquetas (2)" [level=2] [ref=e965]:
                - text: Etiquetas
                - generic [ref=e966]: (2)
            - generic [ref=e968]:
              - generic [ref=e969]:
                - generic [ref=e970]: Fantasía
                - generic [ref=e972]: "#34d399"
                - generic [ref=e973]:
                  - button [ref=e974] [cursor=pointer]:
                    - img [ref=e975]
                  - button [ref=e977] [cursor=pointer]:
                    - img [ref=e978]
              - generic [ref=e980]:
                - generic [ref=e981]: Misterio
                - generic [ref=e983]: "#fbbf24"
                - generic [ref=e984]:
                  - button [ref=e985] [cursor=pointer]:
                    - img [ref=e986]
                  - button [ref=e988] [cursor=pointer]:
                    - img [ref=e989]
              - button "Nueva etiqueta" [ref=e991] [cursor=pointer]:
                - img [ref=e992]
                - text: Nueva etiqueta
          - generic [ref=e994]:
            - generic [ref=e995]:
              - img [ref=e996]
              - heading "Anuncios (5)" [level=2] [ref=e998]:
                - text: Anuncios
                - generic [ref=e999]: (5)
            - generic [ref=e1000]:
              - button "Nuevo anuncio" [ref=e1001] [cursor=pointer]:
                - img [ref=e1002]
                - text: Nuevo anuncio
              - generic [ref=e1004]:
                - generic [ref=e1005]:
                  - generic [ref=e1006]:
                    - heading "lololo" [level=3] [ref=e1008]
                    - generic [ref=e1009]: 21 mar 2026
                  - paragraph [ref=e1011]: This paragraph has a border.
                  - generic [ref=e1012]: Por aventurera
                  - generic [ref=e1013]:
                    - button "Fijar" [ref=e1014] [cursor=pointer]:
                      - img [ref=e1015]
                      - text: Fijar
                    - button "Editar" [ref=e1018] [cursor=pointer]:
                      - img [ref=e1019]
                      - text: Editar
                    - button "Eliminar" [ref=e1021] [cursor=pointer]:
                      - img [ref=e1022]
                      - text: Eliminar
                - generic [ref=e1024]:
                  - generic [ref=e1025]:
                    - heading "Lalalala" [level=3] [ref=e1027]
                    - generic [ref=e1028]: 21 mar 2026
                  - paragraph [ref=e1030]: This paragraph has a border.
                  - generic [ref=e1031]: Por aventurera
                  - generic [ref=e1032]:
                    - button "Fijar" [ref=e1033] [cursor=pointer]:
                      - img [ref=e1034]
                      - text: Fijar
                    - button "Editar" [ref=e1037] [cursor=pointer]:
                      - img [ref=e1038]
                      - text: Editar
                    - button "Eliminar" [ref=e1040] [cursor=pointer]:
                      - img [ref=e1041]
                      - text: Eliminar
                - generic [ref=e1043]:
                  - generic [ref=e1044]:
                    - heading "Pureba de html 2" [level=3] [ref=e1046]
                    - generic [ref=e1047]: 21 mar 2026
                  - paragraph [ref=e1049]: This paragraph has a border.
                  - generic [ref=e1050]: Por aventurera
                  - generic [ref=e1051]:
                    - button "Fijar" [ref=e1052] [cursor=pointer]:
                      - img [ref=e1053]
                      - text: Fijar
                    - button "Editar" [ref=e1056] [cursor=pointer]:
                      - img [ref=e1057]
                      - text: Editar
                    - button "Eliminar" [ref=e1059] [cursor=pointer]:
                      - img [ref=e1060]
                      - text: Eliminar
                - generic [ref=e1062]:
                  - generic [ref=e1063]:
                    - heading "Prueba de html" [level=3] [ref=e1065]
                    - generic [ref=e1066]: 21 mar 2026
                  - generic [ref=e1067]:
                    - generic [ref=e1068]: tengo un camisón guardado
                    - text: en el armario.
                    - paragraph
                    - heading "puedo con titulos?" [level=1] [ref=e1069]
                    - paragraph [ref=e1070]: Ahora lo averiguaremos. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e1071]: Por aventurera
                  - generic [ref=e1072]:
                    - button "Fijar" [ref=e1073] [cursor=pointer]:
                      - img [ref=e1074]
                      - text: Fijar
                    - button "Editar" [ref=e1077] [cursor=pointer]:
                      - img [ref=e1078]
                      - text: Editar
                    - button "Eliminar" [ref=e1080] [cursor=pointer]:
                      - img [ref=e1081]
                      - text: Eliminar
                - generic [ref=e1083]:
                  - generic [ref=e1084]:
                    - generic [ref=e1085]:
                      - img [ref=e1086]
                      - heading "Empieza en" [level=3] [ref=e1089]
                    - generic [ref=e1090]: 9 mar 2026
                  - generic [ref=e1091]: Noviembre. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e1092]: Por aventurera
                  - generic [ref=e1093]:
                    - button "Desfijar" [ref=e1094] [cursor=pointer]:
                      - img [ref=e1095]
                      - text: Desfijar
                    - button "Editar" [ref=e1098] [cursor=pointer]:
                      - img [ref=e1099]
                      - text: Editar
                    - button "Eliminar" [ref=e1101] [cursor=pointer]:
                      - img [ref=e1102]
                      - text: Eliminar
          - generic [ref=e1104]:
            - generic [ref=e1105]:
              - img [ref=e1106]
              - heading "Eventos (0)" [level=2] [ref=e1108]:
                - text: Eventos
                - generic [ref=e1109]: (0)
            - generic [ref=e1110]:
              - button "+ Nuevo evento" [ref=e1112] [cursor=pointer]
              - table [ref=e1114]:
                - rowgroup [ref=e1115]:
                  - row "Título Tipo Estado Sala Inicio Acciones" [ref=e1116]:
                    - columnheader "Título" [ref=e1117]
                    - columnheader "Tipo" [ref=e1118]
                    - columnheader "Estado" [ref=e1119]
                    - columnheader "Sala" [ref=e1120]
                    - columnheader "Inicio" [ref=e1121]
                    - columnheader "Acciones" [ref=e1122]
                - rowgroup [ref=e1123]:
                  - row "No hay eventos todavía" [ref=e1124]:
                    - cell "No hay eventos todavía" [ref=e1125]
          - generic [ref=e1126]:
            - generic [ref=e1127]:
              - img [ref=e1128]
              - heading "Posts Bloqueados (1)" [level=2] [ref=e1130]:
                - text: Posts Bloqueados
                - generic [ref=e1131]: (1)
            - generic [ref=e1134]:
              - generic [ref=e1135]:
                - generic [ref=e1136]:
                  - link "A la media noche pasó" [ref=e1137] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso
                  - generic [ref=e1138]: ›
                  - link "A las 12" [ref=e1139] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408
                - generic [ref=e1140]: Bloqueado 23 mar 2026
              - paragraph [ref=e1141]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              - generic [ref=e1142]:
                - generic [ref=e1143]:
                  - generic [ref=e1144]:
                    - text: "Autor:"
                    - link "aventurera" [ref=e1145] [cursor=pointer]:
                      - /url: /perfil/aventurera
                  - generic [ref=e1146]:
                    - text: "Bloqueado por:"
                    - link "aventurera" [ref=e1147] [cursor=pointer]:
                      - /url: /perfil/aventurera
                - button "Desbloquear" [ref=e1148] [cursor=pointer]:
                  - img [ref=e1149]
                  - text: Desbloquear
          - generic [ref=e1151]:
            - generic [ref=e1152]:
              - img [ref=e1153]
              - heading "Log de Moderación (6)" [level=2] [ref=e1155]:
                - text: Log de Moderación
                - generic [ref=e1156]: (6)
            - generic [ref=e1157]:
              - generic [ref=e1158]:
                - generic [ref=e1159]:
                  - generic [ref=e1160]: Acción
                  - generic [ref=e1161]:
                    - button "Todas" [ref=e1162] [cursor=pointer]
                    - button "Cambio de rol" [ref=e1163] [cursor=pointer]
                    - button "Desbaneo" [active] [ref=e1164] [cursor=pointer]
                    - button "Baneo" [ref=e1165] [cursor=pointer]
                - generic [ref=e1166]:
                  - generic [ref=e1167]: Tipo
                  - generic [ref=e1168]:
                    - button "Todos" [ref=e1169] [cursor=pointer]
                    - button "Usuario" [ref=e1170] [cursor=pointer]
                    - button "Sala" [ref=e1171] [cursor=pointer]
                    - button "Post" [ref=e1172] [cursor=pointer]
                    - button "IP" [ref=e1173] [cursor=pointer]
                    - button "Sistema" [ref=e1174] [cursor=pointer]
                - generic [ref=e1175]:
                  - generic [ref=e1176]: Fecha
                  - generic [ref=e1177]:
                    - textbox [ref=e1178] [cursor=pointer]
                    - generic [ref=e1179]: —
                    - textbox [ref=e1180] [cursor=pointer]
                - button "Limpiar filtros" [ref=e1181] [cursor=pointer]
                - generic [ref=e1182]: 1 de 6
              - table [ref=e1184]:
                - rowgroup [ref=e1185]:
                  - row "Acción Tipo Objetivo Notas Admin Fecha" [ref=e1186]:
                    - columnheader "Acción" [ref=e1187]:
                      - button "Acción" [ref=e1188] [cursor=pointer]:
                        - text: Acción
                        - img [ref=e1189]
                    - columnheader "Tipo" [ref=e1191]:
                      - button "Tipo" [ref=e1192] [cursor=pointer]:
                        - text: Tipo
                        - img [ref=e1193]
                    - columnheader "Objetivo" [ref=e1195]
                    - columnheader "Notas" [ref=e1196]
                    - columnheader "Admin" [ref=e1197]
                    - columnheader "Fecha" [ref=e1198]:
                      - button "Fecha" [ref=e1199] [cursor=pointer]:
                        - text: Fecha
                        - img [ref=e1200]
                - rowgroup [ref=e1202]:
                  - row "Desbaneo Usuario Zorra — aventurera 17 mar 26, 15:59" [ref=e1203]:
                    - cell "Desbaneo" [ref=e1204]
                    - cell "Usuario" [ref=e1205]
                    - cell "Zorra" [ref=e1206]
                    - cell "—" [ref=e1207]
                    - cell "aventurera" [ref=e1208]:
                      - generic [ref=e1210]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1211]
    - contentinfo [ref=e1212]:
      - generic [ref=e1213]:
        - generic [ref=e1214]:
          - generic [ref=e1215]:
            - generic [ref=e1216]: ✦
            - text: TalesRol
          - generic [ref=e1217]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e1218]:
          - link "Normas" [ref=e1219] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e1220] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e1221] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e1222]
```

# Test source

```ts
  1   | // spec: log de moderación — /admin
  2   | // FIX: .admin-table-wrap existe en 4 tablas del PA.
  3   | // Solución: usar .filter({ has: locator('button.sort-th:has-text("Acción")') })
  4   | // para aislar exactamente el contenedor del modlog.
  5   | // El beforeEach espera al primer sort-th "Acción" visible, sin usar .admin-table-wrap.
  6   | 
  7   | import { test, expect } from '@playwright/test'
  8   | 
  9   | const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'
  10  | 
  11  | function modlogSection(page: any) {
  12  |   return page.locator('.admin-table-wrap').filter({
  13  |     has: page.locator('button.sort-th:has-text("Acción")')
  14  |   })
  15  | }
  16  | 
  17  | test.describe('Log de moderación', () => {
  18  |   test.beforeEach(async ({ page }) => {
  19  |     await page.goto(`${BASE_URL}/auth/login`)
  20  |     await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
  21  |     await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
  22  |     await page.click('button[type="submit"]')
  23  |     await page.waitForURL(`${BASE_URL}/`)
  24  |     await page.goto(`${BASE_URL}/admin`)
  25  |     // Esperar al sort-th "Acción" del modlog (único en la página)
  26  |     await page.locator('button.sort-th:has-text("Acción")').first().waitFor({ state: 'visible', timeout: 15000 })
  27  |   })
  28  | 
  29  |   test('La tabla de log está visible', async ({ page }) => {
  30  |     await expect(modlogSection(page).locator('table.admin-table')).toBeVisible()
  31  |   })
  32  | 
  33  |   test('La barra de filtros está visible', async ({ page }) => {
  34  |     const s = modlogSection(page)
  35  |     await expect(s.locator('.filter-bar')).toBeVisible()
  36  |     await expect(s.locator('.filter-btn').first()).toBeVisible()
  37  |   })
  38  | 
  39  |   test('El contador de entradas es visible', async ({ page }) => {
  40  |     const s = modlogSection(page)
  41  |     await expect(s.locator('.filter-count')).toBeVisible()
  42  |     const text = await s.locator('.filter-count').textContent()
  43  |     expect(text).toMatch(/\d+ de \d+/)
  44  |   })
  45  | 
  46  |   test('Las cabeceras ordenables están presentes', async ({ page }) => {
  47  |     const s = modlogSection(page)
  48  |     await expect(s.locator('button.sort-th:has-text("Acción")')).toBeVisible()
  49  |     await expect(s.locator('button.sort-th:has-text("Tipo")')).toBeVisible()
  50  |     await expect(s.locator('button.sort-th:has-text("Fecha")')).toBeVisible()
  51  |   })
  52  | 
  53  |   test('El filtro "Todas" está activo por defecto', async ({ page }) => {
  54  |     const s = modlogSection(page)
  55  |     const todasBtn = s.locator('.filter-btn.active').first()
  56  |     await expect(todasBtn).toBeVisible()
  57  |     const text = await todasBtn.textContent()
  58  |     expect(text?.trim()).toBe('Todas')
  59  |   })
  60  | 
  61  |   test('Filtrar por tipo "Usuario" reduce o mantiene el contador', async ({ page }) => {
  62  |     const s = modlogSection(page)
  63  |     const countBefore = await s.locator('.filter-count').textContent()
  64  |     const totalBefore = parseInt(countBefore?.split(' de ')[1] ?? '0')
  65  |     await s.locator('.filter-btn:has-text("Usuario")').click()
  66  |     const countAfter = await s.locator('.filter-count').textContent()
  67  |     const shownAfter = parseInt(countAfter?.split(' de ')[0] ?? '0')
  68  |     expect(shownAfter).toBeLessThanOrEqual(totalBefore)
  69  |   })
  70  | 
  71  |   test('Filtrar por acción "Baneo" muestra solo filas de baneo o tabla vacía', async ({ page }) => {
  72  |     const s = modlogSection(page)
  73  |     const baneoBtn = s.locator('.filter-btn:has-text("Baneo")').first()
  74  |     if (await baneoBtn.count() === 0) { test.skip(); return }
  75  |     await baneoBtn.click()
  76  |     const rows = s.locator('tbody tr:not(.empty-row)')
  77  |     const count = await rows.count()
  78  |     if (count > 0) {
  79  |       const badges = s.locator('.modlog-action-badge')
  80  |       for (let i = 0; i < await badges.count(); i++) {
> 81  |         expect((await badges.nth(i).textContent())?.trim()).toBe('Baneo')
      |                                                             ^ Error: expect(received).toBe(expected) // Object.is equality
  82  |       }
  83  |     } else {
  84  |       await expect(s.locator('.empty-row')).toBeVisible()
  85  |     }
  86  |   })
  87  | 
  88  |   test('Los inputs de fecha están presentes', async ({ page }) => {
  89  |     await expect(modlogSection(page).locator('input.filter-date-input')).toHaveCount(2)
  90  |   })
  91  | 
  92  |   test('Filtrar por fecha futura da tabla vacía', async ({ page }) => {
  93  |     const s = modlogSection(page)
  94  |     await s.locator('input.filter-date-input').first().fill('2099-01-01')
  95  |     await expect(s.locator('.empty-row')).toBeVisible({ timeout: 3000 })
  96  |     expect((await s.locator('.filter-count').textContent())?.startsWith('0 de')).toBe(true)
  97  |   })
  98  | 
  99  |   test('Limpiar filtros restaura el contador original', async ({ page }) => {
  100 |     const s = modlogSection(page)
  101 |     const countBefore = await s.locator('.filter-count').textContent()
  102 |     await s.locator('input.filter-date-input').first().fill('2099-01-01')
  103 |     await expect(s.locator('.filter-clear-btn')).toBeVisible()
  104 |     await s.locator('.filter-clear-btn').click()
  105 |     await expect(s.locator('.filter-clear-btn')).toHaveCount(0)
  106 |     expect(await s.locator('.filter-count').textContent()).toBe(countBefore)
  107 |   })
  108 | 
  109 |   test('Hacer click en "Fecha" cambia el orden', async ({ page }) => {
  110 |     const s = modlogSection(page)
  111 |     if (await s.locator('tbody tr:not(.empty-row)').count() < 2) { test.skip(); return }
  112 |     await s.locator('button.sort-th:has-text("Fecha")').click()
  113 |     await page.waitForTimeout(300)
  114 |     await expect(s.locator('table.admin-table')).toBeVisible()
  115 |   })
  116 | 
  117 |   test('Hacer click dos veces en "Acción" invierte el orden', async ({ page }) => {
  118 |     const s = modlogSection(page)
  119 |     await s.locator('button.sort-th:has-text("Acción")').click()
  120 |     await page.waitForTimeout(200)
  121 |     await s.locator('button.sort-th:has-text("Acción")').click()
  122 |     await page.waitForTimeout(200)
  123 |     await expect(s.locator('table.admin-table')).toBeVisible()
  124 |   })
  125 | 
  126 |   test('Cada fila tiene badge de acción y fecha', async ({ page }) => {
  127 |     const s = modlogSection(page)
  128 |     const rows = s.locator('tbody tr:not(.empty-row)')
  129 |     if (await rows.count() === 0) {
  130 |       await expect(s.locator('.empty-row')).toBeVisible()
  131 |       return
  132 |     }
  133 |     await expect(rows.first().locator('.modlog-action-badge')).toBeVisible()
  134 |     await expect(rows.first().locator('.date-cell').last()).toBeVisible()
  135 |   })
  136 | 
  137 |   test('Si no hay logs se muestra el mensaje vacío', async ({ page }) => {
  138 |     const s = modlogSection(page)
  139 |     await s.locator('input.filter-date-input').first().fill('2099-01-01')
  140 |     await expect(s.locator('.empty-row')).toContainText('No hay acciones registradas.')
  141 |   })
  142 | })
```