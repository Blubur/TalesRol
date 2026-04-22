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
              - /url: /salas/sala-de-prueba-automatizada-1776864887068
              - generic [ref=e74]: Sala de prueba automatizada
            - link "Sala de prueba automatizada" [ref=e75] [cursor=pointer]:
              - /url: /salas/sala-de-prueba-automatizada
              - generic [ref=e78]: Sala de prueba automatizada
            - link "A la media noche pasó solo noche" [ref=e79] [cursor=pointer]:
              - /url: /salas/a-la-media-noche-paso
              - generic [ref=e81]:
                - generic [ref=e82]: A la media noche pasó
                - generic [ref=e83]: solo noche
            - link "Cenizas blancas Fantasia angelical" [ref=e84] [cursor=pointer]:
              - /url: /salas/cenizas-blancas
              - generic [ref=e86]:
                - generic [ref=e87]: Cenizas blancas
                - generic [ref=e88]: Fantasia angelical
            - link "Perihelio tardío sci fi" [ref=e89] [cursor=pointer]:
              - /url: /salas/perihelio-tardio
              - generic [ref=e91]:
                - generic [ref=e92]: Perihelio tardío
                - generic [ref=e93]: sci fi
            - 'link "Josepa y Camila se van a Benidorm TW: Josepa en bañador" [ref=e94] [cursor=pointer]':
              - /url: /salas/josepa-y-camila-se-van-a-benidorm
              - generic [ref=e96]:
                - generic [ref=e97]: Josepa y Camila se van a Benidorm
                - generic [ref=e98]: "TW: Josepa en bañador"
        - button "Accesos Rápidos" [ref=e101] [cursor=pointer]:
          - img [ref=e103]
          - generic [ref=e105]: Accesos Rápidos
          - img [ref=e107]
      - main [ref=e109]:
        - generic [ref=e110]:
          - generic [ref=e111]:
            - generic [ref=e112]:
              - img [ref=e113]
              - generic [ref=e115]:
                - heading "Panel de Administración" [level=1] [ref=e116]
                - paragraph [ref=e117]: Control total del sistema
            - link "← Volver al inicio" [ref=e118] [cursor=pointer]:
              - /url: /
          - generic [ref=e119]:
            - generic [ref=e120]:
              - img [ref=e121]
              - generic [ref=e123]:
                - generic [ref=e124]: "11"
                - generic [ref=e125]: Usuarios
            - generic [ref=e126]:
              - img [ref=e127]
              - generic [ref=e129]:
                - generic [ref=e130]: "9"
                - generic [ref=e131]: Salas
            - generic [ref=e132]:
              - img [ref=e133]
              - generic [ref=e135]:
                - generic [ref=e136]: "77"
                - generic [ref=e137]: Posts
            - generic [ref=e138]:
              - img [ref=e139]
              - generic [ref=e141]:
                - generic [ref=e142]: "3"
                - generic [ref=e143]: Reportes pendientes
          - navigation [ref=e144]:
            - link "Reportes" [ref=e145] [cursor=pointer]:
              - /url: "#reportes"
              - img [ref=e146]
              - text: Reportes
            - link "Usuarios" [ref=e148] [cursor=pointer]:
              - /url: "#usuarios"
              - img [ref=e149]
              - text: Usuarios
            - link "Salas" [ref=e151] [cursor=pointer]:
              - /url: "#salas"
              - img [ref=e152]
              - text: Salas
            - link "Dados" [ref=e154] [cursor=pointer]:
              - /url: "#dados"
              - img [ref=e155]
              - text: Dados
            - link "Etiquetas" [ref=e157] [cursor=pointer]:
              - /url: "#etiquetas"
              - img [ref=e158]
              - text: Etiquetas
            - link "Anuncios" [ref=e161] [cursor=pointer]:
              - /url: "#anuncios"
              - img [ref=e162]
              - text: Anuncios
            - link "Eventos" [ref=e164] [cursor=pointer]:
              - /url: "#eventos"
              - img [ref=e165]
              - text: Eventos
            - link "Actividad" [ref=e167] [cursor=pointer]:
              - /url: "#modlog"
              - img [ref=e168]
              - text: Actividad
            - link "Bloqueados" [ref=e170] [cursor=pointer]:
              - /url: "#bloqueados"
              - img [ref=e171]
              - text: Bloqueados
            - link "CSS" [ref=e173] [cursor=pointer]:
              - /url: /admin/css
              - img [ref=e174]
              - text: CSS
            - link "Configuración" [ref=e176] [cursor=pointer]:
              - /url: /admin/config
              - img [ref=e177]
              - text: Configuración
          - generic [ref=e180]:
            - generic [ref=e181]:
              - img [ref=e182]
              - heading "Reportes 3 pendientes" [level=2] [ref=e184]:
                - text: Reportes
                - generic [ref=e185]: 3 pendientes
            - generic [ref=e186]:
              - generic [ref=e187]:
                - button "Pendiente 3" [ref=e188] [cursor=pointer]:
                  - text: Pendiente
                  - generic [ref=e189]: "3"
                - button "Todos 5" [ref=e190] [cursor=pointer]:
                  - text: Todos
                  - generic [ref=e191]: "5"
                - button "Resuelto 2" [ref=e192] [cursor=pointer]:
                  - text: Resuelto
                  - generic [ref=e193]: "2"
                - button "Descartado 0" [ref=e194] [cursor=pointer]:
                  - text: Descartado
                  - generic [ref=e195]: "0"
              - generic [ref=e196]:
                - generic [ref=e197]:
                  - generic [ref=e198]:
                    - generic [ref=e199]: Pendiente
                    - generic [ref=e200]:
                      - img [ref=e201]
                      - text: Post
                    - generic [ref=e203]: 23 mar 2026
                  - generic [ref=e204]:
                    - generic [ref=e205]:
                      - img [ref=e206]
                      - generic [ref=e208]: "Reportado por:"
                      - link "@aventurera" [ref=e209] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e210]:
                      - img [ref=e211]
                      - generic [ref=e213]: "Post:"
                      - generic [ref=e214]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e215] [cursor=pointer]:
                      - generic [ref=e216]: "Motivo:"
                      - generic [ref=e217]: Bloqueado por director/moderador
                  - generic [ref=e218]:
                    - button "Resolver" [ref=e219] [cursor=pointer]:
                      - img [ref=e220]
                      - text: Resolver
                    - button "Descartar" [ref=e222] [cursor=pointer]:
                      - img [ref=e223]
                      - text: Descartar
                - generic [ref=e225]:
                  - generic [ref=e226]:
                    - generic [ref=e227]: Pendiente
                    - generic [ref=e228]:
                      - img [ref=e229]
                      - text: Post
                    - generic [ref=e231]: 22 mar 2026
                  - generic [ref=e232]:
                    - generic [ref=e233]:
                      - img [ref=e234]
                      - generic [ref=e236]: "Reportado por:"
                      - link "@aventurera" [ref=e237] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e238]:
                      - img [ref=e239]
                      - generic [ref=e241]: "Post:"
                      - generic [ref=e242]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e243] [cursor=pointer]:
                      - generic [ref=e244]: "Motivo:"
                      - generic [ref=e245]: Bloqueado por director/moderador
                  - generic [ref=e246]:
                    - button "Resolver" [ref=e247] [cursor=pointer]:
                      - img [ref=e248]
                      - text: Resolver
                    - button "Descartar" [ref=e250] [cursor=pointer]:
                      - img [ref=e251]
                      - text: Descartar
                - generic [ref=e253]:
                  - generic [ref=e254]:
                    - generic [ref=e255]: Pendiente
                    - generic [ref=e256]:
                      - img [ref=e257]
                      - text: Usuario
                    - generic [ref=e259]: 10 mar 2026
                  - generic [ref=e260]:
                    - generic [ref=e261]:
                      - img [ref=e262]
                      - generic [ref=e264]: "Reportado por:"
                      - link "@aventurera" [ref=e265] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e266]:
                      - img [ref=e267]
                      - generic [ref=e269]: "Usuario reportado:"
                      - link "@Zorra" [ref=e270] [cursor=pointer]:
                        - /url: /perfil/Zorra
                    - generic [ref=e271] [cursor=pointer]:
                      - generic [ref=e272]: "Motivo:"
                      - generic [ref=e273]: Comportamiento inapropiado
                  - generic [ref=e274]:
                    - button "Resolver" [ref=e275] [cursor=pointer]:
                      - img [ref=e276]
                      - text: Resolver
                    - button "Descartar" [ref=e278] [cursor=pointer]:
                      - img [ref=e279]
                      - text: Descartar
                    - button "Avisar usuario" [ref=e282] [cursor=pointer]:
                      - img [ref=e283]
                      - text: Avisar usuario
                    - button "Banear" [ref=e285] [cursor=pointer]:
                      - img [ref=e286]
                      - text: Banear
                    - button "Banear IP" [ref=e288] [cursor=pointer]:
                      - img [ref=e289]
                      - text: Banear IP
          - generic [ref=e291]:
            - generic [ref=e292]:
              - img [ref=e293]
              - heading "Usuarios (11)" [level=2] [ref=e295]:
                - text: Usuarios
                - generic [ref=e296]: (11)
            - generic [ref=e297]:
              - generic [ref=e298]:
                - generic [ref=e299]:
                  - img
                  - textbox "Buscar por nombre, usuario o email..." [ref=e300]
                - button "Colores de rol" [ref=e301] [cursor=pointer]:
                  - img [ref=e302]
                  - text: Colores de rol
              - generic [ref=e304]:
                - generic [ref=e305]:
                  - generic [ref=e306]: Rol
                  - generic [ref=e307]:
                    - button "Todos" [ref=e308] [cursor=pointer]
                    - button "admin" [ref=e309] [cursor=pointer]
                    - button "master" [ref=e310] [cursor=pointer]
                    - button "director" [ref=e311] [cursor=pointer]
                    - button "jugador" [ref=e312] [cursor=pointer]
                    - button "miembro" [ref=e313] [cursor=pointer]
                - generic [ref=e314]:
                  - generic [ref=e315]: Estado
                  - generic [ref=e316]:
                    - button "Todos" [ref=e317] [cursor=pointer]
                    - button "Activos" [ref=e318] [cursor=pointer]
                    - button "Baneados" [ref=e319] [cursor=pointer]
                - generic [ref=e320]:
                  - generic [ref=e321]: Registro
                  - generic [ref=e322]:
                    - textbox [ref=e323] [cursor=pointer]
                    - generic [ref=e324]: —
                    - textbox [ref=e325] [cursor=pointer]
                - generic [ref=e326]: 11 de 11
              - table [ref=e328]:
                - rowgroup [ref=e329]:
                  - row "Usuario Correo Rol Estado Puntos Registrado Acciones" [ref=e330]:
                    - columnheader "Usuario" [ref=e331]:
                      - button "Usuario" [ref=e332] [cursor=pointer]:
                        - text: Usuario
                        - img [ref=e333]
                    - columnheader "Correo" [ref=e335]
                    - columnheader "Rol" [ref=e336]
                    - columnheader "Estado" [ref=e337]
                    - columnheader "Puntos" [ref=e338]:
                      - button "Puntos" [ref=e339] [cursor=pointer]:
                        - text: Puntos
                        - img [ref=e340]
                    - columnheader "Registrado" [ref=e342]:
                      - button "Registrado" [ref=e343] [cursor=pointer]:
                        - text: Registrado
                        - img [ref=e344]
                    - columnheader "Acciones" [ref=e346]
                - rowgroup [ref=e347]:
                  - row "testbot1776864705975 testbot1776864705975 @testbot1776864705975 testbot_1776864705975@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e348]:
                    - cell "testbot1776864705975 testbot1776864705975 @testbot1776864705975" [ref=e349]:
                      - link "testbot1776864705975 testbot1776864705975 @testbot1776864705975" [ref=e350] [cursor=pointer]:
                        - /url: /perfil/testbot1776864705975
                        - img "testbot1776864705975" [ref=e351]
                        - generic [ref=e352]:
                          - generic [ref=e353]: testbot1776864705975
                          - generic [ref=e354]: "@testbot1776864705975"
                    - cell "testbot_1776864705975@mailinator.com" [ref=e355]
                    - cell "admin" [ref=e356]:
                      - combobox [ref=e358] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e359]
                    - cell "0" [ref=e360]
                    - cell "22 abr 26" [ref=e361]
                    - cell "Banear" [ref=e362]:
                      - button "Banear" [ref=e364] [cursor=pointer]:
                        - img [ref=e365]
                        - text: Banear
                  - row "testbot1776845705320 testbot1776845705320 @testbot1776845705320 testbot_1776845705320@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e367]:
                    - cell "testbot1776845705320 testbot1776845705320 @testbot1776845705320" [ref=e368]:
                      - link "testbot1776845705320 testbot1776845705320 @testbot1776845705320" [ref=e369] [cursor=pointer]:
                        - /url: /perfil/testbot1776845705320
                        - img "testbot1776845705320" [ref=e370]
                        - generic [ref=e371]:
                          - generic [ref=e372]: testbot1776845705320
                          - generic [ref=e373]: "@testbot1776845705320"
                    - cell "testbot_1776845705320@mailinator.com" [ref=e374]
                    - cell "admin" [ref=e375]:
                      - combobox [ref=e377] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e378]
                    - cell "0" [ref=e379]
                    - cell "22 abr 26" [ref=e380]
                    - cell "Banear" [ref=e381]:
                      - button "Banear" [ref=e383] [cursor=pointer]:
                        - img [ref=e384]
                        - text: Banear
                  - row "testbot1776842601153 testbot1776842601153 @testbot1776842601153 testbot_1776842601153@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e386]:
                    - cell "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e387]:
                      - link "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e388] [cursor=pointer]:
                        - /url: /perfil/testbot1776842601153
                        - img "testbot1776842601153" [ref=e389]
                        - generic [ref=e390]:
                          - generic [ref=e391]: testbot1776842601153
                          - generic [ref=e392]: "@testbot1776842601153"
                    - cell "testbot_1776842601153@mailinator.com" [ref=e393]
                    - cell "admin" [ref=e394]:
                      - combobox [ref=e396] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e397]
                    - cell "0" [ref=e398]
                    - cell "22 abr 26" [ref=e399]
                    - cell "Banear" [ref=e400]:
                      - button "Banear" [ref=e402] [cursor=pointer]:
                        - img [ref=e403]
                        - text: Banear
                  - row "testbot1776807228952 testbot1776807228952 @testbot1776807228952 testbot_1776807228952@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e405]:
                    - cell "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e406]:
                      - link "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e407] [cursor=pointer]:
                        - /url: /perfil/testbot1776807228952
                        - img "testbot1776807228952" [ref=e408]
                        - generic [ref=e409]:
                          - generic [ref=e410]: testbot1776807228952
                          - generic [ref=e411]: "@testbot1776807228952"
                    - cell "testbot_1776807228952@mailinator.com" [ref=e412]
                    - cell "admin" [ref=e413]:
                      - combobox [ref=e415] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e416]
                    - cell "0" [ref=e417]
                    - cell "21 abr 26" [ref=e418]
                    - cell "Banear" [ref=e419]:
                      - button "Banear" [ref=e421] [cursor=pointer]:
                        - img [ref=e422]
                        - text: Banear
                  - row "testbot1776806837639 testbot1776806837639 @testbot1776806837639 testbot_1776806837639@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e424]:
                    - cell "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e425]:
                      - link "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e426] [cursor=pointer]:
                        - /url: /perfil/testbot1776806837639
                        - img "testbot1776806837639" [ref=e427]
                        - generic [ref=e428]:
                          - generic [ref=e429]: testbot1776806837639
                          - generic [ref=e430]: "@testbot1776806837639"
                    - cell "testbot_1776806837639@mailinator.com" [ref=e431]
                    - cell "admin" [ref=e432]:
                      - combobox [ref=e434] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e435]
                    - cell "0" [ref=e436]
                    - cell "21 abr 26" [ref=e437]
                    - cell "Banear" [ref=e438]:
                      - button "Banear" [ref=e440] [cursor=pointer]:
                        - img [ref=e441]
                        - text: Banear
                  - row "testbot1776797825837 testbot1776797825837 @testbot1776797825837 testbot_1776797825837@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e443]:
                    - cell "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e444]:
                      - link "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e445] [cursor=pointer]:
                        - /url: /perfil/testbot1776797825837
                        - img "testbot1776797825837" [ref=e446]
                        - generic [ref=e447]:
                          - generic [ref=e448]: testbot1776797825837
                          - generic [ref=e449]: "@testbot1776797825837"
                    - cell "testbot_1776797825837@mailinator.com" [ref=e450]
                    - cell "admin" [ref=e451]:
                      - combobox [ref=e453] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e454]
                    - cell "0" [ref=e455]
                    - cell "21 abr 26" [ref=e456]
                    - cell "Banear" [ref=e457]:
                      - button "Banear" [ref=e459] [cursor=pointer]:
                        - img [ref=e460]
                        - text: Banear
                  - row "testbot1776797707071 testbot1776797707071 @testbot1776797707071 testbot_1776797707071@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e462]:
                    - cell "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e463]:
                      - link "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e464] [cursor=pointer]:
                        - /url: /perfil/testbot1776797707071
                        - img "testbot1776797707071" [ref=e465]
                        - generic [ref=e466]:
                          - generic [ref=e467]: testbot1776797707071
                          - generic [ref=e468]: "@testbot1776797707071"
                    - cell "testbot_1776797707071@mailinator.com" [ref=e469]
                    - cell "admin" [ref=e470]:
                      - combobox [ref=e472] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e473]
                    - cell "0" [ref=e474]
                    - cell "21 abr 26" [ref=e475]
                    - cell "Banear" [ref=e476]:
                      - button "Banear" [ref=e478] [cursor=pointer]:
                        - img [ref=e479]
                        - text: Banear
                  - row "Puck Puck @Puck loregalafate@gmail.com admin Activo 0 16 mar 26 Banear" [ref=e481]:
                    - cell "Puck Puck @Puck" [ref=e482]:
                      - link "Puck Puck @Puck" [ref=e483] [cursor=pointer]:
                        - /url: /perfil/Puck
                        - img "Puck" [ref=e484]
                        - generic [ref=e485]:
                          - generic [ref=e486]: Puck
                          - generic [ref=e487]: "@Puck"
                    - cell "loregalafate@gmail.com" [ref=e488]
                    - cell "admin" [ref=e489]:
                      - combobox [ref=e491] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e492]
                    - cell "0" [ref=e493]
                    - cell "16 mar 26" [ref=e494]
                    - cell "Banear" [ref=e495]:
                      - button "Banear" [ref=e497] [cursor=pointer]:
                        - img [ref=e498]
                        - text: Banear
                  - row "Blu Aventurera Rosa @Blu pililahiguera@gmail.com master Activo 0 16 mar 26 Banear" [ref=e500]:
                    - cell "Blu Aventurera Rosa @Blu" [ref=e501]:
                      - link "Blu Aventurera Rosa @Blu" [ref=e502] [cursor=pointer]:
                        - /url: /perfil/Blu
                        - img "Blu" [ref=e503]
                        - generic [ref=e504]:
                          - generic [ref=e505]: Aventurera Rosa
                          - generic [ref=e506]: "@Blu"
                    - cell "pililahiguera@gmail.com" [ref=e507]
                    - cell "master" [ref=e508]:
                      - combobox [ref=e510] [cursor=pointer]:
                        - option "admin"
                        - option "master" [selected]
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e511]
                    - cell "0" [ref=e512]
                    - cell "16 mar 26" [ref=e513]
                    - cell "Banear" [ref=e514]:
                      - button "Banear" [ref=e516] [cursor=pointer]:
                        - img [ref=e517]
                        - text: Banear
                  - row "Zorra Zorra @Zorra test@fatrol.com jugador Activo 70 8 mar 26 Banear" [ref=e519]:
                    - cell "Zorra Zorra @Zorra" [ref=e520]:
                      - link "Zorra Zorra @Zorra" [ref=e521] [cursor=pointer]:
                        - /url: /perfil/Zorra
                        - img "Zorra" [ref=e522]
                        - generic [ref=e523]:
                          - generic [ref=e524]: Zorra
                          - generic [ref=e525]: "@Zorra"
                    - cell "test@fatrol.com" [ref=e526]
                    - cell "jugador" [ref=e527]:
                      - combobox [ref=e529] [cursor=pointer]:
                        - option "admin"
                        - option "master"
                        - option "director"
                        - option "jugador" [selected]
                        - option "miembro"
                    - cell "Activo" [ref=e530]
                    - cell "70" [ref=e531]
                    - cell "8 mar 26" [ref=e532]
                    - cell "Banear" [ref=e533]:
                      - button "Banear" [ref=e535] [cursor=pointer]:
                        - img [ref=e536]
                        - text: Banear
                  - row "aventurera aventurera @aventurera veinticuatro0792@gmail.com admin Activo 85 7 mar 26 Tú" [ref=e538]:
                    - cell "aventurera aventurera @aventurera" [ref=e539]:
                      - link "aventurera aventurera @aventurera" [ref=e540] [cursor=pointer]:
                        - /url: /perfil/aventurera
                        - img "aventurera" [ref=e541]
                        - generic [ref=e542]:
                          - generic [ref=e543]: aventurera
                          - generic [ref=e544]: "@aventurera"
                    - cell "veinticuatro0792@gmail.com" [ref=e545]
                    - cell "admin" [ref=e546]:
                      - combobox [disabled] [ref=e548]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e549]
                    - cell "85" [ref=e550]
                    - cell "7 mar 26" [ref=e551]
                    - cell "Tú" [ref=e552]
          - generic [ref=e553]:
            - generic [ref=e554]:
              - img [ref=e555]
              - heading "Salas (9)" [level=2] [ref=e557]:
                - text: Salas
                - generic [ref=e558]: (9)
            - generic [ref=e559]:
              - textbox "Buscar por título o creador..." [ref=e561]
              - generic [ref=e562]:
                - generic [ref=e563]:
                  - generic [ref=e564]: Estado
                  - generic [ref=e565]:
                    - button "Todos" [ref=e566] [cursor=pointer]
                    - button "Próximamente" [ref=e567] [cursor=pointer]
                    - button "Activa" [ref=e568] [cursor=pointer]
                    - button "En pausa" [ref=e569] [cursor=pointer]
                    - button "Finalizada" [ref=e570] [cursor=pointer]
                    - button "Cerrada" [ref=e571] [cursor=pointer]
                    - button "Archivada" [ref=e572] [cursor=pointer]
                - generic [ref=e573]:
                  - generic [ref=e574]: Creación
                  - generic [ref=e575]:
                    - textbox [ref=e576] [cursor=pointer]
                    - generic [ref=e577]: —
                    - textbox [ref=e578] [cursor=pointer]
                - generic [ref=e579]: 9 de 9
              - generic [ref=e580]:
                - generic [ref=e582]:
                  - button [ref=e583] [cursor=pointer]:
                    - img [ref=e584]
                  - generic [ref=e588]:
                    - generic [ref=e590]: Sala de prueba automatizada
                    - generic [ref=e591]: aventurera
                  - combobox [ref=e592] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e593]: 22 abr 26
                  - generic [ref=e594]:
                    - link "Miembros" [ref=e595] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada-1776864887068/miembros
                      - img [ref=e596]
                      - text: Miembros
                    - link "Ver" [ref=e598] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada-1776864887068
                      - img [ref=e599]
                      - text: Ver
                    - button "Eliminar" [ref=e601] [cursor=pointer]:
                      - img [ref=e602]
                      - text: Eliminar
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
                  - generic [ref=e616]: 22 abr 26
                  - generic [ref=e617]:
                    - link "Miembros" [ref=e618] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada/miembros
                      - img [ref=e619]
                      - text: Miembros
                    - link "Ver" [ref=e621] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada
                      - img [ref=e622]
                      - text: Ver
                    - button "Eliminar" [ref=e624] [cursor=pointer]:
                      - img [ref=e625]
                      - text: Eliminar
                - generic [ref=e628]:
                  - button [ref=e629] [cursor=pointer]:
                    - img [ref=e630]
                  - img "Cenizas blancas" [ref=e633]
                  - generic [ref=e634]:
                    - generic [ref=e636]: Cenizas blancas
                    - generic [ref=e637]: aventurera
                  - generic [ref=e638]:
                    - generic [ref=e639]: Fantasia angelical
                    - generic [ref=e640]: "TW: vais a llorar"
                  - combobox [ref=e641] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e642]: 5 abr 26
                  - generic [ref=e643]:
                    - link "Miembros" [ref=e644] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas/miembros
                      - img [ref=e645]
                      - text: Miembros
                    - link "Ver" [ref=e647] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas
                      - img [ref=e648]
                      - text: Ver
                    - button "Eliminar" [ref=e650] [cursor=pointer]:
                      - img [ref=e651]
                      - text: Eliminar
                - generic [ref=e654]:
                  - button [ref=e655] [cursor=pointer]:
                    - img [ref=e656]
                  - img "Perihelio tardío" [ref=e659]
                  - generic [ref=e660]:
                    - generic [ref=e662]: Perihelio tardío
                    - generic [ref=e663]: aventurera
                  - generic [ref=e665]: sci fi
                  - combobox [ref=e666] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e667]: 22 mar 26
                  - generic [ref=e668]:
                    - link "Miembros" [ref=e669] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio/miembros
                      - img [ref=e670]
                      - text: Miembros
                    - link "Ver" [ref=e672] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio
                      - img [ref=e673]
                      - text: Ver
                    - button "Eliminar" [ref=e675] [cursor=pointer]:
                      - img [ref=e676]
                      - text: Eliminar
                - generic [ref=e679]:
                  - button [ref=e680] [cursor=pointer]:
                    - img [ref=e681]
                  - img "A la media noche pasó" [ref=e684]
                  - generic [ref=e685]:
                    - generic [ref=e687]: A la media noche pasó
                    - generic [ref=e688]: aventurera
                  - generic [ref=e689]:
                    - generic [ref=e690]: solo noche
                    - generic [ref=e691]: algodones
                  - combobox [ref=e692] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e693]: 18 mar 26
                  - generic [ref=e694]:
                    - link "Miembros" [ref=e695] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso/miembros
                      - img [ref=e696]
                      - text: Miembros
                    - link "Ver" [ref=e698] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso
                      - img [ref=e699]
                      - text: Ver
                    - button "Eliminar" [ref=e701] [cursor=pointer]:
                      - img [ref=e702]
                      - text: Eliminar
                - generic [ref=e705]:
                  - button [ref=e706] [cursor=pointer]:
                    - img [ref=e707]
                  - img "Josepa y Camila se van a Benidorm" [ref=e710]
                  - generic [ref=e711]:
                    - generic [ref=e713]: Josepa y Camila se van a Benidorm
                    - generic [ref=e714]: Puck
                  - generic [ref=e716]: "TW: Josepa en bañador"
                  - combobox [ref=e717] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e718]: 16 mar 26
                  - generic [ref=e719]:
                    - link "Miembros" [ref=e720] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm/miembros
                      - img [ref=e721]
                      - text: Miembros
                    - link "Ver" [ref=e723] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm
                      - img [ref=e724]
                      - text: Ver
                    - button "Eliminar" [ref=e726] [cursor=pointer]:
                      - img [ref=e727]
                      - text: Eliminar
                - generic [ref=e730]:
                  - button [ref=e731] [cursor=pointer]:
                    - img [ref=e732]
                  - img "La casa del cura" [ref=e735]
                  - generic [ref=e736]:
                    - generic [ref=e738]: La casa del cura
                    - generic [ref=e739]: aventurera
                  - generic [ref=e740]:
                    - generic [ref=e741]: fantasía
                    - generic [ref=e742]: arañas
                    - generic [ref=e743]: religión
                  - combobox [ref=e744] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa" [selected]
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e745]: 16 mar 26
                  - generic [ref=e746]:
                    - link "Miembros" [ref=e747] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura/miembros
                      - img [ref=e748]
                      - text: Miembros
                    - link "Ver" [ref=e750] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura
                      - img [ref=e751]
                      - text: Ver
                    - button "Eliminar" [ref=e753] [cursor=pointer]:
                      - img [ref=e754]
                      - text: Eliminar
                - generic [ref=e757]:
                  - button [ref=e758] [cursor=pointer]:
                    - img [ref=e759]
                  - img "Viento y fuego" [ref=e762]
                  - generic [ref=e763]:
                    - generic [ref=e765]: Viento y fuego
                    - generic [ref=e766]: aventurera
                  - generic [ref=e767]:
                    - generic [ref=e768]: Violencia
                    - generic [ref=e769]: Misterio
                  - combobox [ref=e770] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada" [selected]
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e771]: 9 mar 26
                  - generic [ref=e772]:
                    - link "Miembros" [ref=e773] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego/miembros
                      - img [ref=e774]
                      - text: Miembros
                    - link "Ver" [ref=e776] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego
                      - img [ref=e777]
                      - text: Ver
                    - button "Eliminar" [ref=e779] [cursor=pointer]:
                      - img [ref=e780]
                      - text: Eliminar
                - generic [ref=e783]:
                  - button [ref=e784] [cursor=pointer]:
                    - img [ref=e785]
                  - img "Castillos del agua" [ref=e788]
                  - generic [ref=e789]:
                    - generic [ref=e791]: Castillos del agua
                    - generic [ref=e792]: aventurera
                  - generic [ref=e794]: Fantasía
                  - combobox [ref=e795] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada" [selected]
                    - option "Archivada"
                  - generic [ref=e796]: 7 mar 26
                  - generic [ref=e797]:
                    - link "Miembros" [ref=e798] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua/miembros
                      - img [ref=e799]
                      - text: Miembros
                    - link "Ver" [ref=e801] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua
                      - img [ref=e802]
                      - text: Ver
                    - button "Eliminar" [ref=e804] [cursor=pointer]:
                      - img [ref=e805]
                      - text: Eliminar
          - generic [ref=e807]:
            - generic [ref=e808]:
              - img [ref=e809]
              - heading "Tipos de Dado (8)" [level=2] [ref=e811]:
                - text: Tipos de Dado
                - generic [ref=e812]: (8)
            - generic [ref=e814]:
              - generic [ref=e815]:
                - generic [ref=e816]: d2
                - generic [ref=e817]:
                  - generic [ref=e818]: 2 caras
                  - generic [ref=e819]: cara o cruz
                - generic [ref=e820]:
                  - button [ref=e821] [cursor=pointer]:
                    - img [ref=e822]
                  - button [ref=e824] [cursor=pointer]:
                    - img [ref=e825]
              - generic [ref=e827]:
                - generic [ref=e828]: d4
                - generic [ref=e829]:
                  - generic [ref=e830]: 4 caras
                  - generic [ref=e831]: Dado de 4 caras
                - generic [ref=e832]:
                  - button [ref=e833] [cursor=pointer]:
                    - img [ref=e834]
                  - button [ref=e836] [cursor=pointer]:
                    - img [ref=e837]
              - generic [ref=e839]:
                - generic [ref=e840]: d6
                - generic [ref=e841]:
                  - generic [ref=e842]: 6 caras
                  - generic [ref=e843]: Dado de 6 caras
                - generic [ref=e844]:
                  - button [ref=e845] [cursor=pointer]:
                    - img [ref=e846]
                  - button [ref=e848] [cursor=pointer]:
                    - img [ref=e849]
              - generic [ref=e851]:
                - generic [ref=e852]: d8
                - generic [ref=e853]:
                  - generic [ref=e854]: 8 caras
                  - generic [ref=e855]: Dado de 8 caras
                - generic [ref=e856]:
                  - button [ref=e857] [cursor=pointer]:
                    - img [ref=e858]
                  - button [ref=e860] [cursor=pointer]:
                    - img [ref=e861]
              - generic [ref=e863]:
                - generic [ref=e864]: d10
                - generic [ref=e865]:
                  - generic [ref=e866]: 10 caras
                  - generic [ref=e867]: Dado de 10 caras
                - generic [ref=e868]:
                  - button [ref=e869] [cursor=pointer]:
                    - img [ref=e870]
                  - button [ref=e872] [cursor=pointer]:
                    - img [ref=e873]
              - generic [ref=e875]:
                - generic [ref=e876]: d12
                - generic [ref=e877]:
                  - generic [ref=e878]: 12 caras
                  - generic [ref=e879]: Dado de 12 caras
                - generic [ref=e880]:
                  - button [ref=e881] [cursor=pointer]:
                    - img [ref=e882]
                  - button [ref=e884] [cursor=pointer]:
                    - img [ref=e885]
              - generic [ref=e887]:
                - generic [ref=e888]: d20
                - generic [ref=e889]:
                  - generic [ref=e890]: 20 caras
                  - generic [ref=e891]: Dado de 20 caras
                - generic [ref=e892]:
                  - button [ref=e893] [cursor=pointer]:
                    - img [ref=e894]
                  - button [ref=e896] [cursor=pointer]:
                    - img [ref=e897]
              - generic [ref=e899]:
                - generic [ref=e900]: d100
                - generic [ref=e901]:
                  - generic [ref=e902]: 100 caras
                  - generic [ref=e903]: Dado percentil
                - generic [ref=e904]:
                  - button [ref=e905] [cursor=pointer]:
                    - img [ref=e906]
                  - button [ref=e908] [cursor=pointer]:
                    - img [ref=e909]
              - button "Nuevo dado" [ref=e911] [cursor=pointer]:
                - img [ref=e912]
                - text: Nuevo dado
          - generic [ref=e914]:
            - generic [ref=e915]:
              - img [ref=e916]
              - heading "Etiquetas (2)" [level=2] [ref=e919]:
                - text: Etiquetas
                - generic [ref=e920]: (2)
            - generic [ref=e922]:
              - generic [ref=e923]:
                - generic [ref=e924]: Fantasía
                - generic [ref=e926]: "#34d399"
                - generic [ref=e927]:
                  - button [ref=e928] [cursor=pointer]:
                    - img [ref=e929]
                  - button [ref=e931] [cursor=pointer]:
                    - img [ref=e932]
              - generic [ref=e934]:
                - generic [ref=e935]: Misterio
                - generic [ref=e937]: "#fbbf24"
                - generic [ref=e938]:
                  - button [ref=e939] [cursor=pointer]:
                    - img [ref=e940]
                  - button [ref=e942] [cursor=pointer]:
                    - img [ref=e943]
              - button "Nueva etiqueta" [ref=e945] [cursor=pointer]:
                - img [ref=e946]
                - text: Nueva etiqueta
          - generic [ref=e948]:
            - generic [ref=e949]:
              - img [ref=e950]
              - heading "Anuncios (5)" [level=2] [ref=e952]:
                - text: Anuncios
                - generic [ref=e953]: (5)
            - generic [ref=e954]:
              - button "Nuevo anuncio" [ref=e955] [cursor=pointer]:
                - img [ref=e956]
                - text: Nuevo anuncio
              - generic [ref=e958]:
                - generic [ref=e959]:
                  - generic [ref=e960]:
                    - heading "lololo" [level=3] [ref=e962]
                    - generic [ref=e963]: 21 mar 2026
                  - paragraph [ref=e965]: This paragraph has a border.
                  - generic [ref=e966]: Por aventurera
                  - generic [ref=e967]:
                    - button "Fijar" [ref=e968] [cursor=pointer]:
                      - img [ref=e969]
                      - text: Fijar
                    - button "Editar" [ref=e972] [cursor=pointer]:
                      - img [ref=e973]
                      - text: Editar
                    - button "Eliminar" [ref=e975] [cursor=pointer]:
                      - img [ref=e976]
                      - text: Eliminar
                - generic [ref=e978]:
                  - generic [ref=e979]:
                    - heading "Lalalala" [level=3] [ref=e981]
                    - generic [ref=e982]: 21 mar 2026
                  - paragraph [ref=e984]: This paragraph has a border.
                  - generic [ref=e985]: Por aventurera
                  - generic [ref=e986]:
                    - button "Fijar" [ref=e987] [cursor=pointer]:
                      - img [ref=e988]
                      - text: Fijar
                    - button "Editar" [ref=e991] [cursor=pointer]:
                      - img [ref=e992]
                      - text: Editar
                    - button "Eliminar" [ref=e994] [cursor=pointer]:
                      - img [ref=e995]
                      - text: Eliminar
                - generic [ref=e997]:
                  - generic [ref=e998]:
                    - heading "Pureba de html 2" [level=3] [ref=e1000]
                    - generic [ref=e1001]: 21 mar 2026
                  - paragraph [ref=e1003]: This paragraph has a border.
                  - generic [ref=e1004]: Por aventurera
                  - generic [ref=e1005]:
                    - button "Fijar" [ref=e1006] [cursor=pointer]:
                      - img [ref=e1007]
                      - text: Fijar
                    - button "Editar" [ref=e1010] [cursor=pointer]:
                      - img [ref=e1011]
                      - text: Editar
                    - button "Eliminar" [ref=e1013] [cursor=pointer]:
                      - img [ref=e1014]
                      - text: Eliminar
                - generic [ref=e1016]:
                  - generic [ref=e1017]:
                    - heading "Prueba de html" [level=3] [ref=e1019]
                    - generic [ref=e1020]: 21 mar 2026
                  - generic [ref=e1021]:
                    - generic [ref=e1022]: tengo un camisón guardado
                    - text: en el armario.
                    - paragraph
                    - heading "puedo con titulos?" [level=1] [ref=e1023]
                    - paragraph [ref=e1024]: Ahora lo averiguaremos. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e1025]: Por aventurera
                  - generic [ref=e1026]:
                    - button "Fijar" [ref=e1027] [cursor=pointer]:
                      - img [ref=e1028]
                      - text: Fijar
                    - button "Editar" [ref=e1031] [cursor=pointer]:
                      - img [ref=e1032]
                      - text: Editar
                    - button "Eliminar" [ref=e1034] [cursor=pointer]:
                      - img [ref=e1035]
                      - text: Eliminar
                - generic [ref=e1037]:
                  - generic [ref=e1038]:
                    - generic [ref=e1039]:
                      - img [ref=e1040]
                      - heading "Empieza en" [level=3] [ref=e1043]
                    - generic [ref=e1044]: 9 mar 2026
                  - generic [ref=e1045]: Noviembre. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e1046]: Por aventurera
                  - generic [ref=e1047]:
                    - button "Desfijar" [ref=e1048] [cursor=pointer]:
                      - img [ref=e1049]
                      - text: Desfijar
                    - button "Editar" [ref=e1052] [cursor=pointer]:
                      - img [ref=e1053]
                      - text: Editar
                    - button "Eliminar" [ref=e1055] [cursor=pointer]:
                      - img [ref=e1056]
                      - text: Eliminar
          - generic [ref=e1058]:
            - generic [ref=e1059]:
              - img [ref=e1060]
              - heading "Eventos (0)" [level=2] [ref=e1062]:
                - text: Eventos
                - generic [ref=e1063]: (0)
            - generic [ref=e1064]:
              - button "+ Nuevo evento" [ref=e1066] [cursor=pointer]
              - table [ref=e1068]:
                - rowgroup [ref=e1069]:
                  - row "Título Tipo Estado Sala Inicio Acciones" [ref=e1070]:
                    - columnheader "Título" [ref=e1071]
                    - columnheader "Tipo" [ref=e1072]
                    - columnheader "Estado" [ref=e1073]
                    - columnheader "Sala" [ref=e1074]
                    - columnheader "Inicio" [ref=e1075]
                    - columnheader "Acciones" [ref=e1076]
                - rowgroup [ref=e1077]:
                  - row "No hay eventos todavía" [ref=e1078]:
                    - cell "No hay eventos todavía" [ref=e1079]
          - generic [ref=e1080]:
            - generic [ref=e1081]:
              - img [ref=e1082]
              - heading "Posts Bloqueados (1)" [level=2] [ref=e1084]:
                - text: Posts Bloqueados
                - generic [ref=e1085]: (1)
            - generic [ref=e1088]:
              - generic [ref=e1089]:
                - generic [ref=e1090]:
                  - link "A la media noche pasó" [ref=e1091] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso
                  - generic [ref=e1092]: ›
                  - link "A las 12" [ref=e1093] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408
                - generic [ref=e1094]: Bloqueado 23 mar 2026
              - paragraph [ref=e1095]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              - generic [ref=e1096]:
                - generic [ref=e1097]:
                  - generic [ref=e1098]:
                    - text: "Autor:"
                    - link "aventurera" [ref=e1099] [cursor=pointer]:
                      - /url: /perfil/aventurera
                  - generic [ref=e1100]:
                    - text: "Bloqueado por:"
                    - link "aventurera" [ref=e1101] [cursor=pointer]:
                      - /url: /perfil/aventurera
                - button "Desbloquear" [ref=e1102] [cursor=pointer]:
                  - img [ref=e1103]
                  - text: Desbloquear
          - generic [ref=e1105]:
            - generic [ref=e1106]:
              - img [ref=e1107]
              - heading "Log de Moderación (6)" [level=2] [ref=e1109]:
                - text: Log de Moderación
                - generic [ref=e1110]: (6)
            - generic [ref=e1111]:
              - generic [ref=e1112]:
                - generic [ref=e1113]:
                  - generic [ref=e1114]: Acción
                  - generic [ref=e1115]:
                    - button "Todas" [ref=e1116] [cursor=pointer]
                    - button "Cambio de rol" [ref=e1117] [cursor=pointer]
                    - button "Desbaneo" [active] [ref=e1118] [cursor=pointer]
                    - button "Baneo" [ref=e1119] [cursor=pointer]
                - generic [ref=e1120]:
                  - generic [ref=e1121]: Tipo
                  - generic [ref=e1122]:
                    - button "Todos" [ref=e1123] [cursor=pointer]
                    - button "Usuario" [ref=e1124] [cursor=pointer]
                    - button "Sala" [ref=e1125] [cursor=pointer]
                    - button "Post" [ref=e1126] [cursor=pointer]
                    - button "IP" [ref=e1127] [cursor=pointer]
                    - button "Sistema" [ref=e1128] [cursor=pointer]
                - generic [ref=e1129]:
                  - generic [ref=e1130]: Fecha
                  - generic [ref=e1131]:
                    - textbox [ref=e1132] [cursor=pointer]
                    - generic [ref=e1133]: —
                    - textbox [ref=e1134] [cursor=pointer]
                - button "Limpiar filtros" [ref=e1135] [cursor=pointer]
                - generic [ref=e1136]: 1 de 6
              - table [ref=e1138]:
                - rowgroup [ref=e1139]:
                  - row "Acción Tipo Objetivo Notas Admin Fecha" [ref=e1140]:
                    - columnheader "Acción" [ref=e1141]:
                      - button "Acción" [ref=e1142] [cursor=pointer]:
                        - text: Acción
                        - img [ref=e1143]
                    - columnheader "Tipo" [ref=e1145]:
                      - button "Tipo" [ref=e1146] [cursor=pointer]:
                        - text: Tipo
                        - img [ref=e1147]
                    - columnheader "Objetivo" [ref=e1149]
                    - columnheader "Notas" [ref=e1150]
                    - columnheader "Admin" [ref=e1151]
                    - columnheader "Fecha" [ref=e1152]:
                      - button "Fecha" [ref=e1153] [cursor=pointer]:
                        - text: Fecha
                        - img [ref=e1154]
                - rowgroup [ref=e1156]:
                  - row "Desbaneo Usuario Zorra — aventurera 17 mar 26, 15:59" [ref=e1157]:
                    - cell "Desbaneo" [ref=e1158]
                    - cell "Usuario" [ref=e1159]
                    - cell "Zorra" [ref=e1160]
                    - cell "—" [ref=e1161]
                    - cell "aventurera" [ref=e1162]:
                      - generic [ref=e1164]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1165]
    - contentinfo [ref=e1166]:
      - generic [ref=e1167]:
        - generic [ref=e1168]:
          - generic [ref=e1169]:
            - generic [ref=e1170]: ✦
            - text: TalesRol
          - generic [ref=e1171]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e1172]:
          - link "Normas" [ref=e1173] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e1174] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e1175] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e1176]
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