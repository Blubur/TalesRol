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
                - heading "Panel de Administración" [level=1] [ref=e112]
                - paragraph [ref=e113]: Control total del sistema
            - link "← Volver al inicio" [ref=e114] [cursor=pointer]:
              - /url: /
          - generic [ref=e115]:
            - generic [ref=e116]:
              - img [ref=e117]
              - generic [ref=e119]:
                - generic [ref=e120]: "11"
                - generic [ref=e121]: Usuarios
            - generic [ref=e122]:
              - img [ref=e123]
              - generic [ref=e125]:
                - generic [ref=e126]: "8"
                - generic [ref=e127]: Salas
            - generic [ref=e128]:
              - img [ref=e129]
              - generic [ref=e131]:
                - generic [ref=e132]: "77"
                - generic [ref=e133]: Posts
            - generic [ref=e134]:
              - img [ref=e135]
              - generic [ref=e137]:
                - generic [ref=e138]: "3"
                - generic [ref=e139]: Reportes pendientes
          - navigation [ref=e140]:
            - link "Reportes" [ref=e141] [cursor=pointer]:
              - /url: "#reportes"
              - img [ref=e142]
              - text: Reportes
            - link "Usuarios" [ref=e144] [cursor=pointer]:
              - /url: "#usuarios"
              - img [ref=e145]
              - text: Usuarios
            - link "Salas" [ref=e147] [cursor=pointer]:
              - /url: "#salas"
              - img [ref=e148]
              - text: Salas
            - link "Dados" [ref=e150] [cursor=pointer]:
              - /url: "#dados"
              - img [ref=e151]
              - text: Dados
            - link "Etiquetas" [ref=e153] [cursor=pointer]:
              - /url: "#etiquetas"
              - img [ref=e154]
              - text: Etiquetas
            - link "Anuncios" [ref=e157] [cursor=pointer]:
              - /url: "#anuncios"
              - img [ref=e158]
              - text: Anuncios
            - link "Eventos" [ref=e160] [cursor=pointer]:
              - /url: "#eventos"
              - img [ref=e161]
              - text: Eventos
            - link "Actividad" [ref=e163] [cursor=pointer]:
              - /url: "#modlog"
              - img [ref=e164]
              - text: Actividad
            - link "Bloqueados" [ref=e166] [cursor=pointer]:
              - /url: "#bloqueados"
              - img [ref=e167]
              - text: Bloqueados
            - link "CSS" [ref=e169] [cursor=pointer]:
              - /url: /admin/css
              - img [ref=e170]
              - text: CSS
            - link "Configuración" [ref=e172] [cursor=pointer]:
              - /url: /admin/config
              - img [ref=e173]
              - text: Configuración
          - generic [ref=e176]:
            - generic [ref=e177]:
              - img [ref=e178]
              - heading "Reportes 3 pendientes" [level=2] [ref=e180]:
                - text: Reportes
                - generic [ref=e181]: 3 pendientes
            - generic [ref=e182]:
              - generic [ref=e183]:
                - button "Pendiente 3" [ref=e184] [cursor=pointer]:
                  - text: Pendiente
                  - generic [ref=e185]: "3"
                - button "Todos 5" [ref=e186] [cursor=pointer]:
                  - text: Todos
                  - generic [ref=e187]: "5"
                - button "Resuelto 2" [ref=e188] [cursor=pointer]:
                  - text: Resuelto
                  - generic [ref=e189]: "2"
                - button "Descartado 0" [ref=e190] [cursor=pointer]:
                  - text: Descartado
                  - generic [ref=e191]: "0"
              - generic [ref=e192]:
                - generic [ref=e193]:
                  - generic [ref=e194]:
                    - generic [ref=e195]: Pendiente
                    - generic [ref=e196]:
                      - img [ref=e197]
                      - text: Post
                    - generic [ref=e199]: 23 mar 2026
                  - generic [ref=e200]:
                    - generic [ref=e201]:
                      - img [ref=e202]
                      - generic [ref=e204]: "Reportado por:"
                      - link "@aventurera" [ref=e205] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e206]:
                      - img [ref=e207]
                      - generic [ref=e209]: "Post:"
                      - generic [ref=e210]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e211] [cursor=pointer]:
                      - generic [ref=e212]: "Motivo:"
                      - generic [ref=e213]: Bloqueado por director/moderador
                  - generic [ref=e214]:
                    - button "Resolver" [ref=e215] [cursor=pointer]:
                      - img [ref=e216]
                      - text: Resolver
                    - button "Descartar" [ref=e218] [cursor=pointer]:
                      - img [ref=e219]
                      - text: Descartar
                - generic [ref=e221]:
                  - generic [ref=e222]:
                    - generic [ref=e223]: Pendiente
                    - generic [ref=e224]:
                      - img [ref=e225]
                      - text: Post
                    - generic [ref=e227]: 22 mar 2026
                  - generic [ref=e228]:
                    - generic [ref=e229]:
                      - img [ref=e230]
                      - generic [ref=e232]: "Reportado por:"
                      - link "@aventurera" [ref=e233] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e234]:
                      - img [ref=e235]
                      - generic [ref=e237]: "Post:"
                      - generic [ref=e238]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e239] [cursor=pointer]:
                      - generic [ref=e240]: "Motivo:"
                      - generic [ref=e241]: Bloqueado por director/moderador
                  - generic [ref=e242]:
                    - button "Resolver" [ref=e243] [cursor=pointer]:
                      - img [ref=e244]
                      - text: Resolver
                    - button "Descartar" [ref=e246] [cursor=pointer]:
                      - img [ref=e247]
                      - text: Descartar
                - generic [ref=e249]:
                  - generic [ref=e250]:
                    - generic [ref=e251]: Pendiente
                    - generic [ref=e252]:
                      - img [ref=e253]
                      - text: Usuario
                    - generic [ref=e255]: 10 mar 2026
                  - generic [ref=e256]:
                    - generic [ref=e257]:
                      - img [ref=e258]
                      - generic [ref=e260]: "Reportado por:"
                      - link "@aventurera" [ref=e261] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e262]:
                      - img [ref=e263]
                      - generic [ref=e265]: "Usuario reportado:"
                      - link "@Zorra" [ref=e266] [cursor=pointer]:
                        - /url: /perfil/Zorra
                    - generic [ref=e267] [cursor=pointer]:
                      - generic [ref=e268]: "Motivo:"
                      - generic [ref=e269]: Comportamiento inapropiado
                  - generic [ref=e270]:
                    - button "Resolver" [ref=e271] [cursor=pointer]:
                      - img [ref=e272]
                      - text: Resolver
                    - button "Descartar" [ref=e274] [cursor=pointer]:
                      - img [ref=e275]
                      - text: Descartar
                    - button "Avisar usuario" [ref=e278] [cursor=pointer]:
                      - img [ref=e279]
                      - text: Avisar usuario
                    - button "Banear" [ref=e281] [cursor=pointer]:
                      - img [ref=e282]
                      - text: Banear
                    - button "Banear IP" [ref=e284] [cursor=pointer]:
                      - img [ref=e285]
                      - text: Banear IP
          - generic [ref=e287]:
            - generic [ref=e288]:
              - img [ref=e289]
              - heading "Usuarios (11)" [level=2] [ref=e291]:
                - text: Usuarios
                - generic [ref=e292]: (11)
            - generic [ref=e293]:
              - generic [ref=e294]:
                - generic [ref=e295]:
                  - img
                  - textbox "Buscar por nombre, usuario o email..." [ref=e296]
                - button "Colores de rol" [ref=e297] [cursor=pointer]:
                  - img [ref=e298]
                  - text: Colores de rol
              - generic [ref=e300]:
                - generic [ref=e301]:
                  - generic [ref=e302]: Rol
                  - generic [ref=e303]:
                    - button "Todos" [ref=e304] [cursor=pointer]
                    - button "admin" [ref=e305] [cursor=pointer]
                    - button "master" [ref=e306] [cursor=pointer]
                    - button "director" [ref=e307] [cursor=pointer]
                    - button "jugador" [ref=e308] [cursor=pointer]
                    - button "miembro" [ref=e309] [cursor=pointer]
                - generic [ref=e310]:
                  - generic [ref=e311]: Estado
                  - generic [ref=e312]:
                    - button "Todos" [ref=e313] [cursor=pointer]
                    - button "Activos" [ref=e314] [cursor=pointer]
                    - button "Baneados" [ref=e315] [cursor=pointer]
                - generic [ref=e316]:
                  - generic [ref=e317]: Registro
                  - generic [ref=e318]:
                    - textbox [ref=e319] [cursor=pointer]
                    - generic [ref=e320]: —
                    - textbox [ref=e321] [cursor=pointer]
                - generic [ref=e322]: 11 de 11
              - table [ref=e324]:
                - rowgroup [ref=e325]:
                  - row "Usuario Correo Rol Estado Puntos Registrado Acciones" [ref=e326]:
                    - columnheader "Usuario" [ref=e327]:
                      - button "Usuario" [ref=e328] [cursor=pointer]:
                        - text: Usuario
                        - img [ref=e329]
                    - columnheader "Correo" [ref=e331]
                    - columnheader "Rol" [ref=e332]
                    - columnheader "Estado" [ref=e333]
                    - columnheader "Puntos" [ref=e334]:
                      - button "Puntos" [ref=e335] [cursor=pointer]:
                        - text: Puntos
                        - img [ref=e336]
                    - columnheader "Registrado" [ref=e338]:
                      - button "Registrado" [ref=e339] [cursor=pointer]:
                        - text: Registrado
                        - img [ref=e340]
                    - columnheader "Acciones" [ref=e342]
                - rowgroup [ref=e343]:
                  - row "testbot1776864705975 testbot1776864705975 @testbot1776864705975 testbot_1776864705975@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e344]:
                    - cell "testbot1776864705975 testbot1776864705975 @testbot1776864705975" [ref=e345]:
                      - link "testbot1776864705975 testbot1776864705975 @testbot1776864705975" [ref=e346] [cursor=pointer]:
                        - /url: /perfil/testbot1776864705975
                        - img "testbot1776864705975" [ref=e347]
                        - generic [ref=e348]:
                          - generic [ref=e349]: testbot1776864705975
                          - generic [ref=e350]: "@testbot1776864705975"
                    - cell "testbot_1776864705975@mailinator.com" [ref=e351]
                    - cell "admin" [ref=e352]:
                      - combobox [ref=e354] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e355]
                    - cell "0" [ref=e356]
                    - cell "22 abr 26" [ref=e357]
                    - cell "Banear" [ref=e358]:
                      - button "Banear" [ref=e360] [cursor=pointer]:
                        - img [ref=e361]
                        - text: Banear
                  - row "testbot1776845705320 testbot1776845705320 @testbot1776845705320 testbot_1776845705320@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e363]:
                    - cell "testbot1776845705320 testbot1776845705320 @testbot1776845705320" [ref=e364]:
                      - link "testbot1776845705320 testbot1776845705320 @testbot1776845705320" [ref=e365] [cursor=pointer]:
                        - /url: /perfil/testbot1776845705320
                        - img "testbot1776845705320" [ref=e366]
                        - generic [ref=e367]:
                          - generic [ref=e368]: testbot1776845705320
                          - generic [ref=e369]: "@testbot1776845705320"
                    - cell "testbot_1776845705320@mailinator.com" [ref=e370]
                    - cell "admin" [ref=e371]:
                      - combobox [ref=e373] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e374]
                    - cell "0" [ref=e375]
                    - cell "22 abr 26" [ref=e376]
                    - cell "Banear" [ref=e377]:
                      - button "Banear" [ref=e379] [cursor=pointer]:
                        - img [ref=e380]
                        - text: Banear
                  - row "testbot1776842601153 testbot1776842601153 @testbot1776842601153 testbot_1776842601153@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e382]:
                    - cell "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e383]:
                      - link "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e384] [cursor=pointer]:
                        - /url: /perfil/testbot1776842601153
                        - img "testbot1776842601153" [ref=e385]
                        - generic [ref=e386]:
                          - generic [ref=e387]: testbot1776842601153
                          - generic [ref=e388]: "@testbot1776842601153"
                    - cell "testbot_1776842601153@mailinator.com" [ref=e389]
                    - cell "admin" [ref=e390]:
                      - combobox [ref=e392] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e393]
                    - cell "0" [ref=e394]
                    - cell "22 abr 26" [ref=e395]
                    - cell "Banear" [ref=e396]:
                      - button "Banear" [ref=e398] [cursor=pointer]:
                        - img [ref=e399]
                        - text: Banear
                  - row "testbot1776807228952 testbot1776807228952 @testbot1776807228952 testbot_1776807228952@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e401]:
                    - cell "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e402]:
                      - link "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e403] [cursor=pointer]:
                        - /url: /perfil/testbot1776807228952
                        - img "testbot1776807228952" [ref=e404]
                        - generic [ref=e405]:
                          - generic [ref=e406]: testbot1776807228952
                          - generic [ref=e407]: "@testbot1776807228952"
                    - cell "testbot_1776807228952@mailinator.com" [ref=e408]
                    - cell "admin" [ref=e409]:
                      - combobox [ref=e411] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e412]
                    - cell "0" [ref=e413]
                    - cell "21 abr 26" [ref=e414]
                    - cell "Banear" [ref=e415]:
                      - button "Banear" [ref=e417] [cursor=pointer]:
                        - img [ref=e418]
                        - text: Banear
                  - row "testbot1776806837639 testbot1776806837639 @testbot1776806837639 testbot_1776806837639@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e420]:
                    - cell "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e421]:
                      - link "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e422] [cursor=pointer]:
                        - /url: /perfil/testbot1776806837639
                        - img "testbot1776806837639" [ref=e423]
                        - generic [ref=e424]:
                          - generic [ref=e425]: testbot1776806837639
                          - generic [ref=e426]: "@testbot1776806837639"
                    - cell "testbot_1776806837639@mailinator.com" [ref=e427]
                    - cell "admin" [ref=e428]:
                      - combobox [ref=e430] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e431]
                    - cell "0" [ref=e432]
                    - cell "21 abr 26" [ref=e433]
                    - cell "Banear" [ref=e434]:
                      - button "Banear" [ref=e436] [cursor=pointer]:
                        - img [ref=e437]
                        - text: Banear
                  - row "testbot1776797825837 testbot1776797825837 @testbot1776797825837 testbot_1776797825837@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e439]:
                    - cell "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e440]:
                      - link "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e441] [cursor=pointer]:
                        - /url: /perfil/testbot1776797825837
                        - img "testbot1776797825837" [ref=e442]
                        - generic [ref=e443]:
                          - generic [ref=e444]: testbot1776797825837
                          - generic [ref=e445]: "@testbot1776797825837"
                    - cell "testbot_1776797825837@mailinator.com" [ref=e446]
                    - cell "admin" [ref=e447]:
                      - combobox [ref=e449] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e450]
                    - cell "0" [ref=e451]
                    - cell "21 abr 26" [ref=e452]
                    - cell "Banear" [ref=e453]:
                      - button "Banear" [ref=e455] [cursor=pointer]:
                        - img [ref=e456]
                        - text: Banear
                  - row "testbot1776797707071 testbot1776797707071 @testbot1776797707071 testbot_1776797707071@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e458]:
                    - cell "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e459]:
                      - link "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e460] [cursor=pointer]:
                        - /url: /perfil/testbot1776797707071
                        - img "testbot1776797707071" [ref=e461]
                        - generic [ref=e462]:
                          - generic [ref=e463]: testbot1776797707071
                          - generic [ref=e464]: "@testbot1776797707071"
                    - cell "testbot_1776797707071@mailinator.com" [ref=e465]
                    - cell "admin" [ref=e466]:
                      - combobox [ref=e468] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e469]
                    - cell "0" [ref=e470]
                    - cell "21 abr 26" [ref=e471]
                    - cell "Banear" [ref=e472]:
                      - button "Banear" [ref=e474] [cursor=pointer]:
                        - img [ref=e475]
                        - text: Banear
                  - row "Puck Puck @Puck loregalafate@gmail.com admin Activo 0 16 mar 26 Banear" [ref=e477]:
                    - cell "Puck Puck @Puck" [ref=e478]:
                      - link "Puck Puck @Puck" [ref=e479] [cursor=pointer]:
                        - /url: /perfil/Puck
                        - img "Puck" [ref=e480]
                        - generic [ref=e481]:
                          - generic [ref=e482]: Puck
                          - generic [ref=e483]: "@Puck"
                    - cell "loregalafate@gmail.com" [ref=e484]
                    - cell "admin" [ref=e485]:
                      - combobox [ref=e487] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e488]
                    - cell "0" [ref=e489]
                    - cell "16 mar 26" [ref=e490]
                    - cell "Banear" [ref=e491]:
                      - button "Banear" [ref=e493] [cursor=pointer]:
                        - img [ref=e494]
                        - text: Banear
                  - row "Blu Aventurera Rosa @Blu pililahiguera@gmail.com master Activo 0 16 mar 26 Banear" [ref=e496]:
                    - cell "Blu Aventurera Rosa @Blu" [ref=e497]:
                      - link "Blu Aventurera Rosa @Blu" [ref=e498] [cursor=pointer]:
                        - /url: /perfil/Blu
                        - img "Blu" [ref=e499]
                        - generic [ref=e500]:
                          - generic [ref=e501]: Aventurera Rosa
                          - generic [ref=e502]: "@Blu"
                    - cell "pililahiguera@gmail.com" [ref=e503]
                    - cell "master" [ref=e504]:
                      - combobox [ref=e506] [cursor=pointer]:
                        - option "admin"
                        - option "master" [selected]
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e507]
                    - cell "0" [ref=e508]
                    - cell "16 mar 26" [ref=e509]
                    - cell "Banear" [ref=e510]:
                      - button "Banear" [ref=e512] [cursor=pointer]:
                        - img [ref=e513]
                        - text: Banear
                  - row "Zorra Zorra @Zorra test@fatrol.com jugador Activo 70 8 mar 26 Banear" [ref=e515]:
                    - cell "Zorra Zorra @Zorra" [ref=e516]:
                      - link "Zorra Zorra @Zorra" [ref=e517] [cursor=pointer]:
                        - /url: /perfil/Zorra
                        - img "Zorra" [ref=e518]
                        - generic [ref=e519]:
                          - generic [ref=e520]: Zorra
                          - generic [ref=e521]: "@Zorra"
                    - cell "test@fatrol.com" [ref=e522]
                    - cell "jugador" [ref=e523]:
                      - combobox [ref=e525] [cursor=pointer]:
                        - option "admin"
                        - option "master"
                        - option "director"
                        - option "jugador" [selected]
                        - option "miembro"
                    - cell "Activo" [ref=e526]
                    - cell "70" [ref=e527]
                    - cell "8 mar 26" [ref=e528]
                    - cell "Banear" [ref=e529]:
                      - button "Banear" [ref=e531] [cursor=pointer]:
                        - img [ref=e532]
                        - text: Banear
                  - row "aventurera aventurera @aventurera veinticuatro0792@gmail.com admin Activo 85 7 mar 26 Tú" [ref=e534]:
                    - cell "aventurera aventurera @aventurera" [ref=e535]:
                      - link "aventurera aventurera @aventurera" [ref=e536] [cursor=pointer]:
                        - /url: /perfil/aventurera
                        - img "aventurera" [ref=e537]
                        - generic [ref=e538]:
                          - generic [ref=e539]: aventurera
                          - generic [ref=e540]: "@aventurera"
                    - cell "veinticuatro0792@gmail.com" [ref=e541]
                    - cell "admin" [ref=e542]:
                      - combobox [disabled] [ref=e544]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e545]
                    - cell "85" [ref=e546]
                    - cell "7 mar 26" [ref=e547]
                    - cell "Tú" [ref=e548]
          - generic [ref=e549]:
            - generic [ref=e550]:
              - img [ref=e551]
              - heading "Salas (8)" [level=2] [ref=e553]:
                - text: Salas
                - generic [ref=e554]: (8)
            - generic [ref=e555]:
              - textbox "Buscar por título o creador..." [ref=e557]
              - generic [ref=e558]:
                - generic [ref=e559]:
                  - generic [ref=e560]: Estado
                  - generic [ref=e561]:
                    - button "Todos" [ref=e562] [cursor=pointer]
                    - button "Próximamente" [ref=e563] [cursor=pointer]
                    - button "Activa" [ref=e564] [cursor=pointer]
                    - button "En pausa" [ref=e565] [cursor=pointer]
                    - button "Finalizada" [ref=e566] [cursor=pointer]
                    - button "Cerrada" [ref=e567] [cursor=pointer]
                    - button "Archivada" [ref=e568] [cursor=pointer]
                - generic [ref=e569]:
                  - generic [ref=e570]: Creación
                  - generic [ref=e571]:
                    - textbox [ref=e572] [cursor=pointer]
                    - generic [ref=e573]: —
                    - textbox [ref=e574] [cursor=pointer]
                - generic [ref=e575]: 8 de 8
              - generic [ref=e576]:
                - generic [ref=e578]:
                  - button [ref=e579] [cursor=pointer]:
                    - img [ref=e580]
                  - generic [ref=e584]:
                    - generic [ref=e586]: Sala de prueba automatizada
                    - generic [ref=e587]: aventurera
                  - combobox [ref=e588] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e589]: 22 abr 26
                  - generic [ref=e590]:
                    - link "Miembros" [ref=e591] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada/miembros
                      - img [ref=e592]
                      - text: Miembros
                    - link "Ver" [ref=e594] [cursor=pointer]:
                      - /url: /salas/sala-de-prueba-automatizada
                      - img [ref=e595]
                      - text: Ver
                    - button "Eliminar" [ref=e597] [cursor=pointer]:
                      - img [ref=e598]
                      - text: Eliminar
                - generic [ref=e601]:
                  - button [ref=e602] [cursor=pointer]:
                    - img [ref=e603]
                  - img "Cenizas blancas" [ref=e606]
                  - generic [ref=e607]:
                    - generic [ref=e609]: Cenizas blancas
                    - generic [ref=e610]: aventurera
                  - generic [ref=e611]:
                    - generic [ref=e612]: Fantasia angelical
                    - generic [ref=e613]: "TW: vais a llorar"
                  - combobox [ref=e614] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e615]: 5 abr 26
                  - generic [ref=e616]:
                    - link "Miembros" [ref=e617] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas/miembros
                      - img [ref=e618]
                      - text: Miembros
                    - link "Ver" [ref=e620] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas
                      - img [ref=e621]
                      - text: Ver
                    - button "Eliminar" [ref=e623] [cursor=pointer]:
                      - img [ref=e624]
                      - text: Eliminar
                - generic [ref=e627]:
                  - button [ref=e628] [cursor=pointer]:
                    - img [ref=e629]
                  - img "Perihelio tardío" [ref=e632]
                  - generic [ref=e633]:
                    - generic [ref=e635]: Perihelio tardío
                    - generic [ref=e636]: aventurera
                  - generic [ref=e638]: sci fi
                  - combobox [ref=e639] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e640]: 22 mar 26
                  - generic [ref=e641]:
                    - link "Miembros" [ref=e642] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio/miembros
                      - img [ref=e643]
                      - text: Miembros
                    - link "Ver" [ref=e645] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio
                      - img [ref=e646]
                      - text: Ver
                    - button "Eliminar" [ref=e648] [cursor=pointer]:
                      - img [ref=e649]
                      - text: Eliminar
                - generic [ref=e652]:
                  - button [ref=e653] [cursor=pointer]:
                    - img [ref=e654]
                  - img "A la media noche pasó" [ref=e657]
                  - generic [ref=e658]:
                    - generic [ref=e660]: A la media noche pasó
                    - generic [ref=e661]: aventurera
                  - generic [ref=e662]:
                    - generic [ref=e663]: solo noche
                    - generic [ref=e664]: algodones
                  - combobox [ref=e665] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e666]: 18 mar 26
                  - generic [ref=e667]:
                    - link "Miembros" [ref=e668] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso/miembros
                      - img [ref=e669]
                      - text: Miembros
                    - link "Ver" [ref=e671] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso
                      - img [ref=e672]
                      - text: Ver
                    - button "Eliminar" [ref=e674] [cursor=pointer]:
                      - img [ref=e675]
                      - text: Eliminar
                - generic [ref=e678]:
                  - button [ref=e679] [cursor=pointer]:
                    - img [ref=e680]
                  - img "Josepa y Camila se van a Benidorm" [ref=e683]
                  - generic [ref=e684]:
                    - generic [ref=e686]: Josepa y Camila se van a Benidorm
                    - generic [ref=e687]: Puck
                  - generic [ref=e689]: "TW: Josepa en bañador"
                  - combobox [ref=e690] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e691]: 16 mar 26
                  - generic [ref=e692]:
                    - link "Miembros" [ref=e693] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm/miembros
                      - img [ref=e694]
                      - text: Miembros
                    - link "Ver" [ref=e696] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm
                      - img [ref=e697]
                      - text: Ver
                    - button "Eliminar" [ref=e699] [cursor=pointer]:
                      - img [ref=e700]
                      - text: Eliminar
                - generic [ref=e703]:
                  - button [ref=e704] [cursor=pointer]:
                    - img [ref=e705]
                  - img "La casa del cura" [ref=e708]
                  - generic [ref=e709]:
                    - generic [ref=e711]: La casa del cura
                    - generic [ref=e712]: aventurera
                  - generic [ref=e713]:
                    - generic [ref=e714]: fantasía
                    - generic [ref=e715]: arañas
                    - generic [ref=e716]: religión
                  - combobox [ref=e717] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa" [selected]
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e718]: 16 mar 26
                  - generic [ref=e719]:
                    - link "Miembros" [ref=e720] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura/miembros
                      - img [ref=e721]
                      - text: Miembros
                    - link "Ver" [ref=e723] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura
                      - img [ref=e724]
                      - text: Ver
                    - button "Eliminar" [ref=e726] [cursor=pointer]:
                      - img [ref=e727]
                      - text: Eliminar
                - generic [ref=e730]:
                  - button [ref=e731] [cursor=pointer]:
                    - img [ref=e732]
                  - img "Viento y fuego" [ref=e735]
                  - generic [ref=e736]:
                    - generic [ref=e738]: Viento y fuego
                    - generic [ref=e739]: aventurera
                  - generic [ref=e740]:
                    - generic [ref=e741]: Violencia
                    - generic [ref=e742]: Misterio
                  - combobox [ref=e743] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada" [selected]
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e744]: 9 mar 26
                  - generic [ref=e745]:
                    - link "Miembros" [ref=e746] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego/miembros
                      - img [ref=e747]
                      - text: Miembros
                    - link "Ver" [ref=e749] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego
                      - img [ref=e750]
                      - text: Ver
                    - button "Eliminar" [ref=e752] [cursor=pointer]:
                      - img [ref=e753]
                      - text: Eliminar
                - generic [ref=e756]:
                  - button [ref=e757] [cursor=pointer]:
                    - img [ref=e758]
                  - img "Castillos del agua" [ref=e761]
                  - generic [ref=e762]:
                    - generic [ref=e764]: Castillos del agua
                    - generic [ref=e765]: aventurera
                  - generic [ref=e767]: Fantasía
                  - combobox [ref=e768] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada" [selected]
                    - option "Archivada"
                  - generic [ref=e769]: 7 mar 26
                  - generic [ref=e770]:
                    - link "Miembros" [ref=e771] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua/miembros
                      - img [ref=e772]
                      - text: Miembros
                    - link "Ver" [ref=e774] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua
                      - img [ref=e775]
                      - text: Ver
                    - button "Eliminar" [ref=e777] [cursor=pointer]:
                      - img [ref=e778]
                      - text: Eliminar
          - generic [ref=e780]:
            - generic [ref=e781]:
              - img [ref=e782]
              - heading "Tipos de Dado (8)" [level=2] [ref=e784]:
                - text: Tipos de Dado
                - generic [ref=e785]: (8)
            - generic [ref=e787]:
              - generic [ref=e788]:
                - generic [ref=e789]: d2
                - generic [ref=e790]:
                  - generic [ref=e791]: 2 caras
                  - generic [ref=e792]: cara o cruz
                - generic [ref=e793]:
                  - button [ref=e794] [cursor=pointer]:
                    - img [ref=e795]
                  - button [ref=e797] [cursor=pointer]:
                    - img [ref=e798]
              - generic [ref=e800]:
                - generic [ref=e801]: d4
                - generic [ref=e802]:
                  - generic [ref=e803]: 4 caras
                  - generic [ref=e804]: Dado de 4 caras
                - generic [ref=e805]:
                  - button [ref=e806] [cursor=pointer]:
                    - img [ref=e807]
                  - button [ref=e809] [cursor=pointer]:
                    - img [ref=e810]
              - generic [ref=e812]:
                - generic [ref=e813]: d6
                - generic [ref=e814]:
                  - generic [ref=e815]: 6 caras
                  - generic [ref=e816]: Dado de 6 caras
                - generic [ref=e817]:
                  - button [ref=e818] [cursor=pointer]:
                    - img [ref=e819]
                  - button [ref=e821] [cursor=pointer]:
                    - img [ref=e822]
              - generic [ref=e824]:
                - generic [ref=e825]: d8
                - generic [ref=e826]:
                  - generic [ref=e827]: 8 caras
                  - generic [ref=e828]: Dado de 8 caras
                - generic [ref=e829]:
                  - button [ref=e830] [cursor=pointer]:
                    - img [ref=e831]
                  - button [ref=e833] [cursor=pointer]:
                    - img [ref=e834]
              - generic [ref=e836]:
                - generic [ref=e837]: d10
                - generic [ref=e838]:
                  - generic [ref=e839]: 10 caras
                  - generic [ref=e840]: Dado de 10 caras
                - generic [ref=e841]:
                  - button [ref=e842] [cursor=pointer]:
                    - img [ref=e843]
                  - button [ref=e845] [cursor=pointer]:
                    - img [ref=e846]
              - generic [ref=e848]:
                - generic [ref=e849]: d12
                - generic [ref=e850]:
                  - generic [ref=e851]: 12 caras
                  - generic [ref=e852]: Dado de 12 caras
                - generic [ref=e853]:
                  - button [ref=e854] [cursor=pointer]:
                    - img [ref=e855]
                  - button [ref=e857] [cursor=pointer]:
                    - img [ref=e858]
              - generic [ref=e860]:
                - generic [ref=e861]: d20
                - generic [ref=e862]:
                  - generic [ref=e863]: 20 caras
                  - generic [ref=e864]: Dado de 20 caras
                - generic [ref=e865]:
                  - button [ref=e866] [cursor=pointer]:
                    - img [ref=e867]
                  - button [ref=e869] [cursor=pointer]:
                    - img [ref=e870]
              - generic [ref=e872]:
                - generic [ref=e873]: d100
                - generic [ref=e874]:
                  - generic [ref=e875]: 100 caras
                  - generic [ref=e876]: Dado percentil
                - generic [ref=e877]:
                  - button [ref=e878] [cursor=pointer]:
                    - img [ref=e879]
                  - button [ref=e881] [cursor=pointer]:
                    - img [ref=e882]
              - button "Nuevo dado" [ref=e884] [cursor=pointer]:
                - img [ref=e885]
                - text: Nuevo dado
          - generic [ref=e887]:
            - generic [ref=e888]:
              - img [ref=e889]
              - heading "Etiquetas (2)" [level=2] [ref=e892]:
                - text: Etiquetas
                - generic [ref=e893]: (2)
            - generic [ref=e895]:
              - generic [ref=e896]:
                - generic [ref=e897]: Fantasía
                - generic [ref=e899]: "#34d399"
                - generic [ref=e900]:
                  - button [ref=e901] [cursor=pointer]:
                    - img [ref=e902]
                  - button [ref=e904] [cursor=pointer]:
                    - img [ref=e905]
              - generic [ref=e907]:
                - generic [ref=e908]: Misterio
                - generic [ref=e910]: "#fbbf24"
                - generic [ref=e911]:
                  - button [ref=e912] [cursor=pointer]:
                    - img [ref=e913]
                  - button [ref=e915] [cursor=pointer]:
                    - img [ref=e916]
              - button "Nueva etiqueta" [ref=e918] [cursor=pointer]:
                - img [ref=e919]
                - text: Nueva etiqueta
          - generic [ref=e921]:
            - generic [ref=e922]:
              - img [ref=e923]
              - heading "Anuncios (5)" [level=2] [ref=e925]:
                - text: Anuncios
                - generic [ref=e926]: (5)
            - generic [ref=e927]:
              - button "Nuevo anuncio" [ref=e928] [cursor=pointer]:
                - img [ref=e929]
                - text: Nuevo anuncio
              - generic [ref=e931]:
                - generic [ref=e932]:
                  - generic [ref=e933]:
                    - heading "lololo" [level=3] [ref=e935]
                    - generic [ref=e936]: 21 mar 2026
                  - paragraph [ref=e938]: This paragraph has a border.
                  - generic [ref=e939]: Por aventurera
                  - generic [ref=e940]:
                    - button "Fijar" [ref=e941] [cursor=pointer]:
                      - img [ref=e942]
                      - text: Fijar
                    - button "Editar" [ref=e945] [cursor=pointer]:
                      - img [ref=e946]
                      - text: Editar
                    - button "Eliminar" [ref=e948] [cursor=pointer]:
                      - img [ref=e949]
                      - text: Eliminar
                - generic [ref=e951]:
                  - generic [ref=e952]:
                    - heading "Lalalala" [level=3] [ref=e954]
                    - generic [ref=e955]: 21 mar 2026
                  - paragraph [ref=e957]: This paragraph has a border.
                  - generic [ref=e958]: Por aventurera
                  - generic [ref=e959]:
                    - button "Fijar" [ref=e960] [cursor=pointer]:
                      - img [ref=e961]
                      - text: Fijar
                    - button "Editar" [ref=e964] [cursor=pointer]:
                      - img [ref=e965]
                      - text: Editar
                    - button "Eliminar" [ref=e967] [cursor=pointer]:
                      - img [ref=e968]
                      - text: Eliminar
                - generic [ref=e970]:
                  - generic [ref=e971]:
                    - heading "Pureba de html 2" [level=3] [ref=e973]
                    - generic [ref=e974]: 21 mar 2026
                  - paragraph [ref=e976]: This paragraph has a border.
                  - generic [ref=e977]: Por aventurera
                  - generic [ref=e978]:
                    - button "Fijar" [ref=e979] [cursor=pointer]:
                      - img [ref=e980]
                      - text: Fijar
                    - button "Editar" [ref=e983] [cursor=pointer]:
                      - img [ref=e984]
                      - text: Editar
                    - button "Eliminar" [ref=e986] [cursor=pointer]:
                      - img [ref=e987]
                      - text: Eliminar
                - generic [ref=e989]:
                  - generic [ref=e990]:
                    - heading "Prueba de html" [level=3] [ref=e992]
                    - generic [ref=e993]: 21 mar 2026
                  - generic [ref=e994]:
                    - generic [ref=e995]: tengo un camisón guardado
                    - text: en el armario.
                    - paragraph
                    - heading "puedo con titulos?" [level=1] [ref=e996]
                    - paragraph [ref=e997]: Ahora lo averiguaremos. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e998]: Por aventurera
                  - generic [ref=e999]:
                    - button "Fijar" [ref=e1000] [cursor=pointer]:
                      - img [ref=e1001]
                      - text: Fijar
                    - button "Editar" [ref=e1004] [cursor=pointer]:
                      - img [ref=e1005]
                      - text: Editar
                    - button "Eliminar" [ref=e1007] [cursor=pointer]:
                      - img [ref=e1008]
                      - text: Eliminar
                - generic [ref=e1010]:
                  - generic [ref=e1011]:
                    - generic [ref=e1012]:
                      - img [ref=e1013]
                      - heading "Empieza en" [level=3] [ref=e1016]
                    - generic [ref=e1017]: 9 mar 2026
                  - generic [ref=e1018]: Noviembre. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e1019]: Por aventurera
                  - generic [ref=e1020]:
                    - button "Desfijar" [ref=e1021] [cursor=pointer]:
                      - img [ref=e1022]
                      - text: Desfijar
                    - button "Editar" [ref=e1025] [cursor=pointer]:
                      - img [ref=e1026]
                      - text: Editar
                    - button "Eliminar" [ref=e1028] [cursor=pointer]:
                      - img [ref=e1029]
                      - text: Eliminar
          - generic [ref=e1031]:
            - generic [ref=e1032]:
              - img [ref=e1033]
              - heading "Eventos (0)" [level=2] [ref=e1035]:
                - text: Eventos
                - generic [ref=e1036]: (0)
            - generic [ref=e1037]:
              - button "+ Nuevo evento" [ref=e1039] [cursor=pointer]
              - table [ref=e1041]:
                - rowgroup [ref=e1042]:
                  - row "Título Tipo Estado Sala Inicio Acciones" [ref=e1043]:
                    - columnheader "Título" [ref=e1044]
                    - columnheader "Tipo" [ref=e1045]
                    - columnheader "Estado" [ref=e1046]
                    - columnheader "Sala" [ref=e1047]
                    - columnheader "Inicio" [ref=e1048]
                    - columnheader "Acciones" [ref=e1049]
                - rowgroup [ref=e1050]:
                  - row "No hay eventos todavía" [ref=e1051]:
                    - cell "No hay eventos todavía" [ref=e1052]
          - generic [ref=e1053]:
            - generic [ref=e1054]:
              - img [ref=e1055]
              - heading "Posts Bloqueados (1)" [level=2] [ref=e1057]:
                - text: Posts Bloqueados
                - generic [ref=e1058]: (1)
            - generic [ref=e1061]:
              - generic [ref=e1062]:
                - generic [ref=e1063]:
                  - link "A la media noche pasó" [ref=e1064] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso
                  - generic [ref=e1065]: ›
                  - link "A las 12" [ref=e1066] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408
                - generic [ref=e1067]: Bloqueado 23 mar 2026
              - paragraph [ref=e1068]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              - generic [ref=e1069]:
                - generic [ref=e1070]:
                  - generic [ref=e1071]:
                    - text: "Autor:"
                    - link "aventurera" [ref=e1072] [cursor=pointer]:
                      - /url: /perfil/aventurera
                  - generic [ref=e1073]:
                    - text: "Bloqueado por:"
                    - link "aventurera" [ref=e1074] [cursor=pointer]:
                      - /url: /perfil/aventurera
                - button "Desbloquear" [ref=e1075] [cursor=pointer]:
                  - img [ref=e1076]
                  - text: Desbloquear
          - generic [ref=e1078]:
            - generic [ref=e1079]:
              - img [ref=e1080]
              - heading "Log de Moderación (6)" [level=2] [ref=e1082]:
                - text: Log de Moderación
                - generic [ref=e1083]: (6)
            - generic [ref=e1084]:
              - generic [ref=e1085]:
                - generic [ref=e1086]:
                  - generic [ref=e1087]: Acción
                  - generic [ref=e1088]:
                    - button "Todas" [ref=e1089] [cursor=pointer]
                    - button "Cambio de rol" [ref=e1090] [cursor=pointer]
                    - button "Desbaneo" [active] [ref=e1091] [cursor=pointer]
                    - button "Baneo" [ref=e1092] [cursor=pointer]
                - generic [ref=e1093]:
                  - generic [ref=e1094]: Tipo
                  - generic [ref=e1095]:
                    - button "Todos" [ref=e1096] [cursor=pointer]
                    - button "Usuario" [ref=e1097] [cursor=pointer]
                    - button "Sala" [ref=e1098] [cursor=pointer]
                    - button "Post" [ref=e1099] [cursor=pointer]
                    - button "IP" [ref=e1100] [cursor=pointer]
                    - button "Sistema" [ref=e1101] [cursor=pointer]
                - generic [ref=e1102]:
                  - generic [ref=e1103]: Fecha
                  - generic [ref=e1104]:
                    - textbox [ref=e1105] [cursor=pointer]
                    - generic [ref=e1106]: —
                    - textbox [ref=e1107] [cursor=pointer]
                - button "Limpiar filtros" [ref=e1108] [cursor=pointer]
                - generic [ref=e1109]: 1 de 6
              - table [ref=e1111]:
                - rowgroup [ref=e1112]:
                  - row "Acción Tipo Objetivo Notas Admin Fecha" [ref=e1113]:
                    - columnheader "Acción" [ref=e1114]:
                      - button "Acción" [ref=e1115] [cursor=pointer]:
                        - text: Acción
                        - img [ref=e1116]
                    - columnheader "Tipo" [ref=e1118]:
                      - button "Tipo" [ref=e1119] [cursor=pointer]:
                        - text: Tipo
                        - img [ref=e1120]
                    - columnheader "Objetivo" [ref=e1122]
                    - columnheader "Notas" [ref=e1123]
                    - columnheader "Admin" [ref=e1124]
                    - columnheader "Fecha" [ref=e1125]:
                      - button "Fecha" [ref=e1126] [cursor=pointer]:
                        - text: Fecha
                        - img [ref=e1127]
                - rowgroup [ref=e1129]:
                  - row "Desbaneo Usuario Zorra — aventurera 17 mar 26, 15:59" [ref=e1130]:
                    - cell "Desbaneo" [ref=e1131]
                    - cell "Usuario" [ref=e1132]
                    - cell "Zorra" [ref=e1133]
                    - cell "—" [ref=e1134]
                    - cell "aventurera" [ref=e1135]:
                      - generic [ref=e1137]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1138]
    - contentinfo [ref=e1139]:
      - generic [ref=e1140]:
        - generic [ref=e1141]:
          - generic [ref=e1142]:
            - generic [ref=e1143]: ✦
            - text: TalesRol
          - generic [ref=e1144]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e1145]:
          - link "Normas" [ref=e1146] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e1147] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e1148] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e1149]
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