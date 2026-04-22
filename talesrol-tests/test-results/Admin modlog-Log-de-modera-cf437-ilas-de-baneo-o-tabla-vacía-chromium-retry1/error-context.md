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
                - heading "Panel de Administración" [level=1] [ref=e108]
                - paragraph [ref=e109]: Control total del sistema
            - link "← Volver al inicio" [ref=e110] [cursor=pointer]:
              - /url: /
          - generic [ref=e111]:
            - generic [ref=e112]:
              - img [ref=e113]
              - generic [ref=e115]:
                - generic [ref=e116]: "10"
                - generic [ref=e117]: Usuarios
            - generic [ref=e118]:
              - img [ref=e119]
              - generic [ref=e121]:
                - generic [ref=e122]: "7"
                - generic [ref=e123]: Salas
            - generic [ref=e124]:
              - img [ref=e125]
              - generic [ref=e127]:
                - generic [ref=e128]: "77"
                - generic [ref=e129]: Posts
            - generic [ref=e130]:
              - img [ref=e131]
              - generic [ref=e133]:
                - generic [ref=e134]: "3"
                - generic [ref=e135]: Reportes pendientes
          - navigation [ref=e136]:
            - link "Reportes" [ref=e137] [cursor=pointer]:
              - /url: "#reportes"
              - img [ref=e138]
              - text: Reportes
            - link "Usuarios" [ref=e140] [cursor=pointer]:
              - /url: "#usuarios"
              - img [ref=e141]
              - text: Usuarios
            - link "Salas" [ref=e143] [cursor=pointer]:
              - /url: "#salas"
              - img [ref=e144]
              - text: Salas
            - link "Dados" [ref=e146] [cursor=pointer]:
              - /url: "#dados"
              - img [ref=e147]
              - text: Dados
            - link "Etiquetas" [ref=e149] [cursor=pointer]:
              - /url: "#etiquetas"
              - img [ref=e150]
              - text: Etiquetas
            - link "Anuncios" [ref=e153] [cursor=pointer]:
              - /url: "#anuncios"
              - img [ref=e154]
              - text: Anuncios
            - link "Eventos" [ref=e156] [cursor=pointer]:
              - /url: "#eventos"
              - img [ref=e157]
              - text: Eventos
            - link "Actividad" [ref=e159] [cursor=pointer]:
              - /url: "#modlog"
              - img [ref=e160]
              - text: Actividad
            - link "Bloqueados" [ref=e162] [cursor=pointer]:
              - /url: "#bloqueados"
              - img [ref=e163]
              - text: Bloqueados
            - link "CSS" [ref=e165] [cursor=pointer]:
              - /url: /admin/css
              - img [ref=e166]
              - text: CSS
            - link "Configuración" [ref=e168] [cursor=pointer]:
              - /url: /admin/config
              - img [ref=e169]
              - text: Configuración
          - generic [ref=e172]:
            - generic [ref=e173]:
              - img [ref=e174]
              - heading "Reportes 3 pendientes" [level=2] [ref=e176]:
                - text: Reportes
                - generic [ref=e177]: 3 pendientes
            - generic [ref=e178]:
              - generic [ref=e179]:
                - button "Pendiente 3" [ref=e180] [cursor=pointer]:
                  - text: Pendiente
                  - generic [ref=e181]: "3"
                - button "Todos 5" [ref=e182] [cursor=pointer]:
                  - text: Todos
                  - generic [ref=e183]: "5"
                - button "Resuelto 2" [ref=e184] [cursor=pointer]:
                  - text: Resuelto
                  - generic [ref=e185]: "2"
                - button "Descartado 0" [ref=e186] [cursor=pointer]:
                  - text: Descartado
                  - generic [ref=e187]: "0"
              - generic [ref=e188]:
                - generic [ref=e189]:
                  - generic [ref=e190]:
                    - generic [ref=e191]: Pendiente
                    - generic [ref=e192]:
                      - img [ref=e193]
                      - text: Post
                    - generic [ref=e195]: 23 mar 2026
                  - generic [ref=e196]:
                    - generic [ref=e197]:
                      - img [ref=e198]
                      - generic [ref=e200]: "Reportado por:"
                      - link "@aventurera" [ref=e201] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e202]:
                      - img [ref=e203]
                      - generic [ref=e205]: "Post:"
                      - generic [ref=e206]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e207] [cursor=pointer]:
                      - generic [ref=e208]: "Motivo:"
                      - generic [ref=e209]: Bloqueado por director/moderador
                  - generic [ref=e210]:
                    - button "Resolver" [ref=e211] [cursor=pointer]:
                      - img [ref=e212]
                      - text: Resolver
                    - button "Descartar" [ref=e214] [cursor=pointer]:
                      - img [ref=e215]
                      - text: Descartar
                - generic [ref=e217]:
                  - generic [ref=e218]:
                    - generic [ref=e219]: Pendiente
                    - generic [ref=e220]:
                      - img [ref=e221]
                      - text: Post
                    - generic [ref=e223]: 22 mar 2026
                  - generic [ref=e224]:
                    - generic [ref=e225]:
                      - img [ref=e226]
                      - generic [ref=e228]: "Reportado por:"
                      - link "@aventurera" [ref=e229] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e230]:
                      - img [ref=e231]
                      - generic [ref=e233]: "Post:"
                      - generic [ref=e234]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e235] [cursor=pointer]:
                      - generic [ref=e236]: "Motivo:"
                      - generic [ref=e237]: Bloqueado por director/moderador
                  - generic [ref=e238]:
                    - button "Resolver" [ref=e239] [cursor=pointer]:
                      - img [ref=e240]
                      - text: Resolver
                    - button "Descartar" [ref=e242] [cursor=pointer]:
                      - img [ref=e243]
                      - text: Descartar
                - generic [ref=e245]:
                  - generic [ref=e246]:
                    - generic [ref=e247]: Pendiente
                    - generic [ref=e248]:
                      - img [ref=e249]
                      - text: Usuario
                    - generic [ref=e251]: 10 mar 2026
                  - generic [ref=e252]:
                    - generic [ref=e253]:
                      - img [ref=e254]
                      - generic [ref=e256]: "Reportado por:"
                      - link "@aventurera" [ref=e257] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e258]:
                      - img [ref=e259]
                      - generic [ref=e261]: "Usuario reportado:"
                      - link "@Zorra" [ref=e262] [cursor=pointer]:
                        - /url: /perfil/Zorra
                    - generic [ref=e263] [cursor=pointer]:
                      - generic [ref=e264]: "Motivo:"
                      - generic [ref=e265]: Comportamiento inapropiado
                  - generic [ref=e266]:
                    - button "Resolver" [ref=e267] [cursor=pointer]:
                      - img [ref=e268]
                      - text: Resolver
                    - button "Descartar" [ref=e270] [cursor=pointer]:
                      - img [ref=e271]
                      - text: Descartar
                    - button "Avisar usuario" [ref=e274] [cursor=pointer]:
                      - img [ref=e275]
                      - text: Avisar usuario
                    - button "Banear" [ref=e277] [cursor=pointer]:
                      - img [ref=e278]
                      - text: Banear
                    - button "Banear IP" [ref=e280] [cursor=pointer]:
                      - img [ref=e281]
                      - text: Banear IP
          - generic [ref=e283]:
            - generic [ref=e284]:
              - img [ref=e285]
              - heading "Usuarios (10)" [level=2] [ref=e287]:
                - text: Usuarios
                - generic [ref=e288]: (10)
            - generic [ref=e289]:
              - generic [ref=e290]:
                - generic [ref=e291]:
                  - img
                  - textbox "Buscar por nombre, usuario o email..." [ref=e292]
                - button "Colores de rol" [ref=e293] [cursor=pointer]:
                  - img [ref=e294]
                  - text: Colores de rol
              - generic [ref=e296]:
                - generic [ref=e297]:
                  - generic [ref=e298]: Rol
                  - generic [ref=e299]:
                    - button "Todos" [ref=e300] [cursor=pointer]
                    - button "admin" [ref=e301] [cursor=pointer]
                    - button "master" [ref=e302] [cursor=pointer]
                    - button "director" [ref=e303] [cursor=pointer]
                    - button "jugador" [ref=e304] [cursor=pointer]
                    - button "miembro" [ref=e305] [cursor=pointer]
                - generic [ref=e306]:
                  - generic [ref=e307]: Estado
                  - generic [ref=e308]:
                    - button "Todos" [ref=e309] [cursor=pointer]
                    - button "Activos" [ref=e310] [cursor=pointer]
                    - button "Baneados" [ref=e311] [cursor=pointer]
                - generic [ref=e312]:
                  - generic [ref=e313]: Registro
                  - generic [ref=e314]:
                    - textbox [ref=e315] [cursor=pointer]
                    - generic [ref=e316]: —
                    - textbox [ref=e317] [cursor=pointer]
                - generic [ref=e318]: 10 de 10
              - table [ref=e320]:
                - rowgroup [ref=e321]:
                  - row "Usuario Correo Rol Estado Puntos Registrado Acciones" [ref=e322]:
                    - columnheader "Usuario" [ref=e323]:
                      - button "Usuario" [ref=e324] [cursor=pointer]:
                        - text: Usuario
                        - img [ref=e325]
                    - columnheader "Correo" [ref=e327]
                    - columnheader "Rol" [ref=e328]
                    - columnheader "Estado" [ref=e329]
                    - columnheader "Puntos" [ref=e330]:
                      - button "Puntos" [ref=e331] [cursor=pointer]:
                        - text: Puntos
                        - img [ref=e332]
                    - columnheader "Registrado" [ref=e334]:
                      - button "Registrado" [ref=e335] [cursor=pointer]:
                        - text: Registrado
                        - img [ref=e336]
                    - columnheader "Acciones" [ref=e338]
                - rowgroup [ref=e339]:
                  - row "testbot1776845705320 testbot1776845705320 @testbot1776845705320 testbot_1776845705320@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e340]:
                    - cell "testbot1776845705320 testbot1776845705320 @testbot1776845705320" [ref=e341]:
                      - link "testbot1776845705320 testbot1776845705320 @testbot1776845705320" [ref=e342] [cursor=pointer]:
                        - /url: /perfil/testbot1776845705320
                        - img "testbot1776845705320" [ref=e343]
                        - generic [ref=e344]:
                          - generic [ref=e345]: testbot1776845705320
                          - generic [ref=e346]: "@testbot1776845705320"
                    - cell "testbot_1776845705320@mailinator.com" [ref=e347]
                    - cell "admin" [ref=e348]:
                      - combobox [ref=e350] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e351]
                    - cell "0" [ref=e352]
                    - cell "22 abr 26" [ref=e353]
                    - cell "Banear" [ref=e354]:
                      - button "Banear" [ref=e356] [cursor=pointer]:
                        - img [ref=e357]
                        - text: Banear
                  - row "testbot1776842601153 testbot1776842601153 @testbot1776842601153 testbot_1776842601153@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e359]:
                    - cell "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e360]:
                      - link "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e361] [cursor=pointer]:
                        - /url: /perfil/testbot1776842601153
                        - img "testbot1776842601153" [ref=e362]
                        - generic [ref=e363]:
                          - generic [ref=e364]: testbot1776842601153
                          - generic [ref=e365]: "@testbot1776842601153"
                    - cell "testbot_1776842601153@mailinator.com" [ref=e366]
                    - cell "admin" [ref=e367]:
                      - combobox [ref=e369] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e370]
                    - cell "0" [ref=e371]
                    - cell "22 abr 26" [ref=e372]
                    - cell "Banear" [ref=e373]:
                      - button "Banear" [ref=e375] [cursor=pointer]:
                        - img [ref=e376]
                        - text: Banear
                  - row "testbot1776807228952 testbot1776807228952 @testbot1776807228952 testbot_1776807228952@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e378]:
                    - cell "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e379]:
                      - link "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e380] [cursor=pointer]:
                        - /url: /perfil/testbot1776807228952
                        - img "testbot1776807228952" [ref=e381]
                        - generic [ref=e382]:
                          - generic [ref=e383]: testbot1776807228952
                          - generic [ref=e384]: "@testbot1776807228952"
                    - cell "testbot_1776807228952@mailinator.com" [ref=e385]
                    - cell "admin" [ref=e386]:
                      - combobox [ref=e388] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e389]
                    - cell "0" [ref=e390]
                    - cell "21 abr 26" [ref=e391]
                    - cell "Banear" [ref=e392]:
                      - button "Banear" [ref=e394] [cursor=pointer]:
                        - img [ref=e395]
                        - text: Banear
                  - row "testbot1776806837639 testbot1776806837639 @testbot1776806837639 testbot_1776806837639@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e397]:
                    - cell "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e398]:
                      - link "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e399] [cursor=pointer]:
                        - /url: /perfil/testbot1776806837639
                        - img "testbot1776806837639" [ref=e400]
                        - generic [ref=e401]:
                          - generic [ref=e402]: testbot1776806837639
                          - generic [ref=e403]: "@testbot1776806837639"
                    - cell "testbot_1776806837639@mailinator.com" [ref=e404]
                    - cell "admin" [ref=e405]:
                      - combobox [ref=e407] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e408]
                    - cell "0" [ref=e409]
                    - cell "21 abr 26" [ref=e410]
                    - cell "Banear" [ref=e411]:
                      - button "Banear" [ref=e413] [cursor=pointer]:
                        - img [ref=e414]
                        - text: Banear
                  - row "testbot1776797825837 testbot1776797825837 @testbot1776797825837 testbot_1776797825837@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e416]:
                    - cell "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e417]:
                      - link "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e418] [cursor=pointer]:
                        - /url: /perfil/testbot1776797825837
                        - img "testbot1776797825837" [ref=e419]
                        - generic [ref=e420]:
                          - generic [ref=e421]: testbot1776797825837
                          - generic [ref=e422]: "@testbot1776797825837"
                    - cell "testbot_1776797825837@mailinator.com" [ref=e423]
                    - cell "admin" [ref=e424]:
                      - combobox [ref=e426] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e427]
                    - cell "0" [ref=e428]
                    - cell "21 abr 26" [ref=e429]
                    - cell "Banear" [ref=e430]:
                      - button "Banear" [ref=e432] [cursor=pointer]:
                        - img [ref=e433]
                        - text: Banear
                  - row "testbot1776797707071 testbot1776797707071 @testbot1776797707071 testbot_1776797707071@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e435]:
                    - cell "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e436]:
                      - link "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e437] [cursor=pointer]:
                        - /url: /perfil/testbot1776797707071
                        - img "testbot1776797707071" [ref=e438]
                        - generic [ref=e439]:
                          - generic [ref=e440]: testbot1776797707071
                          - generic [ref=e441]: "@testbot1776797707071"
                    - cell "testbot_1776797707071@mailinator.com" [ref=e442]
                    - cell "admin" [ref=e443]:
                      - combobox [ref=e445] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e446]
                    - cell "0" [ref=e447]
                    - cell "21 abr 26" [ref=e448]
                    - cell "Banear" [ref=e449]:
                      - button "Banear" [ref=e451] [cursor=pointer]:
                        - img [ref=e452]
                        - text: Banear
                  - row "Puck Puck @Puck loregalafate@gmail.com admin Activo 0 16 mar 26 Banear" [ref=e454]:
                    - cell "Puck Puck @Puck" [ref=e455]:
                      - link "Puck Puck @Puck" [ref=e456] [cursor=pointer]:
                        - /url: /perfil/Puck
                        - img "Puck" [ref=e457]
                        - generic [ref=e458]:
                          - generic [ref=e459]: Puck
                          - generic [ref=e460]: "@Puck"
                    - cell "loregalafate@gmail.com" [ref=e461]
                    - cell "admin" [ref=e462]:
                      - combobox [ref=e464] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e465]
                    - cell "0" [ref=e466]
                    - cell "16 mar 26" [ref=e467]
                    - cell "Banear" [ref=e468]:
                      - button "Banear" [ref=e470] [cursor=pointer]:
                        - img [ref=e471]
                        - text: Banear
                  - row "Blu Aventurera Rosa @Blu pililahiguera@gmail.com master Activo 0 16 mar 26 Banear" [ref=e473]:
                    - cell "Blu Aventurera Rosa @Blu" [ref=e474]:
                      - link "Blu Aventurera Rosa @Blu" [ref=e475] [cursor=pointer]:
                        - /url: /perfil/Blu
                        - img "Blu" [ref=e476]
                        - generic [ref=e477]:
                          - generic [ref=e478]: Aventurera Rosa
                          - generic [ref=e479]: "@Blu"
                    - cell "pililahiguera@gmail.com" [ref=e480]
                    - cell "master" [ref=e481]:
                      - combobox [ref=e483] [cursor=pointer]:
                        - option "admin"
                        - option "master" [selected]
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e484]
                    - cell "0" [ref=e485]
                    - cell "16 mar 26" [ref=e486]
                    - cell "Banear" [ref=e487]:
                      - button "Banear" [ref=e489] [cursor=pointer]:
                        - img [ref=e490]
                        - text: Banear
                  - row "Zorra Zorra @Zorra test@fatrol.com jugador Activo 70 8 mar 26 Banear" [ref=e492]:
                    - cell "Zorra Zorra @Zorra" [ref=e493]:
                      - link "Zorra Zorra @Zorra" [ref=e494] [cursor=pointer]:
                        - /url: /perfil/Zorra
                        - img "Zorra" [ref=e495]
                        - generic [ref=e496]:
                          - generic [ref=e497]: Zorra
                          - generic [ref=e498]: "@Zorra"
                    - cell "test@fatrol.com" [ref=e499]
                    - cell "jugador" [ref=e500]:
                      - combobox [ref=e502] [cursor=pointer]:
                        - option "admin"
                        - option "master"
                        - option "director"
                        - option "jugador" [selected]
                        - option "miembro"
                    - cell "Activo" [ref=e503]
                    - cell "70" [ref=e504]
                    - cell "8 mar 26" [ref=e505]
                    - cell "Banear" [ref=e506]:
                      - button "Banear" [ref=e508] [cursor=pointer]:
                        - img [ref=e509]
                        - text: Banear
                  - row "aventurera aventurera @aventurera veinticuatro0792@gmail.com admin Activo 85 7 mar 26 Tú" [ref=e511]:
                    - cell "aventurera aventurera @aventurera" [ref=e512]:
                      - link "aventurera aventurera @aventurera" [ref=e513] [cursor=pointer]:
                        - /url: /perfil/aventurera
                        - img "aventurera" [ref=e514]
                        - generic [ref=e515]:
                          - generic [ref=e516]: aventurera
                          - generic [ref=e517]: "@aventurera"
                    - cell "veinticuatro0792@gmail.com" [ref=e518]
                    - cell "admin" [ref=e519]:
                      - combobox [disabled] [ref=e521]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e522]
                    - cell "85" [ref=e523]
                    - cell "7 mar 26" [ref=e524]
                    - cell "Tú" [ref=e525]
          - generic [ref=e526]:
            - generic [ref=e527]:
              - img [ref=e528]
              - heading "Salas (7)" [level=2] [ref=e530]:
                - text: Salas
                - generic [ref=e531]: (7)
            - generic [ref=e532]:
              - textbox "Buscar por título o creador..." [ref=e534]
              - generic [ref=e535]:
                - generic [ref=e536]:
                  - generic [ref=e537]: Estado
                  - generic [ref=e538]:
                    - button "Todos" [ref=e539] [cursor=pointer]
                    - button "Próximamente" [ref=e540] [cursor=pointer]
                    - button "Activa" [ref=e541] [cursor=pointer]
                    - button "En pausa" [ref=e542] [cursor=pointer]
                    - button "Finalizada" [ref=e543] [cursor=pointer]
                    - button "Cerrada" [ref=e544] [cursor=pointer]
                    - button "Archivada" [ref=e545] [cursor=pointer]
                - generic [ref=e546]:
                  - generic [ref=e547]: Creación
                  - generic [ref=e548]:
                    - textbox [ref=e549] [cursor=pointer]
                    - generic [ref=e550]: —
                    - textbox [ref=e551] [cursor=pointer]
                - generic [ref=e552]: 7 de 7
              - generic [ref=e553]:
                - generic [ref=e555]:
                  - button [ref=e556] [cursor=pointer]:
                    - img [ref=e557]
                  - img "Cenizas blancas" [ref=e560]
                  - generic [ref=e561]:
                    - generic [ref=e563]: Cenizas blancas
                    - generic [ref=e564]: aventurera
                  - generic [ref=e565]:
                    - generic [ref=e566]: Fantasia angelical
                    - generic [ref=e567]: "TW: vais a llorar"
                  - combobox [ref=e568] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e569]: 5 abr 26
                  - generic [ref=e570]:
                    - link "Miembros" [ref=e571] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas/miembros
                      - img [ref=e572]
                      - text: Miembros
                    - link "Ver" [ref=e574] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas
                      - img [ref=e575]
                      - text: Ver
                    - button "Eliminar" [ref=e577] [cursor=pointer]:
                      - img [ref=e578]
                      - text: Eliminar
                - generic [ref=e581]:
                  - button [ref=e582] [cursor=pointer]:
                    - img [ref=e583]
                  - img "Perihelio tardío" [ref=e586]
                  - generic [ref=e587]:
                    - generic [ref=e589]: Perihelio tardío
                    - generic [ref=e590]: aventurera
                  - generic [ref=e592]: sci fi
                  - combobox [ref=e593] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e594]: 22 mar 26
                  - generic [ref=e595]:
                    - link "Miembros" [ref=e596] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio/miembros
                      - img [ref=e597]
                      - text: Miembros
                    - link "Ver" [ref=e599] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio
                      - img [ref=e600]
                      - text: Ver
                    - button "Eliminar" [ref=e602] [cursor=pointer]:
                      - img [ref=e603]
                      - text: Eliminar
                - generic [ref=e606]:
                  - button [ref=e607] [cursor=pointer]:
                    - img [ref=e608]
                  - img "A la media noche pasó" [ref=e611]
                  - generic [ref=e612]:
                    - generic [ref=e614]: A la media noche pasó
                    - generic [ref=e615]: aventurera
                  - generic [ref=e616]:
                    - generic [ref=e617]: solo noche
                    - generic [ref=e618]: algodones
                  - combobox [ref=e619] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e620]: 18 mar 26
                  - generic [ref=e621]:
                    - link "Miembros" [ref=e622] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso/miembros
                      - img [ref=e623]
                      - text: Miembros
                    - link "Ver" [ref=e625] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso
                      - img [ref=e626]
                      - text: Ver
                    - button "Eliminar" [ref=e628] [cursor=pointer]:
                      - img [ref=e629]
                      - text: Eliminar
                - generic [ref=e632]:
                  - button [ref=e633] [cursor=pointer]:
                    - img [ref=e634]
                  - img "Josepa y Camila se van a Benidorm" [ref=e637]
                  - generic [ref=e638]:
                    - generic [ref=e640]: Josepa y Camila se van a Benidorm
                    - generic [ref=e641]: Puck
                  - generic [ref=e643]: "TW: Josepa en bañador"
                  - combobox [ref=e644] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e645]: 16 mar 26
                  - generic [ref=e646]:
                    - link "Miembros" [ref=e647] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm/miembros
                      - img [ref=e648]
                      - text: Miembros
                    - link "Ver" [ref=e650] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm
                      - img [ref=e651]
                      - text: Ver
                    - button "Eliminar" [ref=e653] [cursor=pointer]:
                      - img [ref=e654]
                      - text: Eliminar
                - generic [ref=e657]:
                  - button [ref=e658] [cursor=pointer]:
                    - img [ref=e659]
                  - img "La casa del cura" [ref=e662]
                  - generic [ref=e663]:
                    - generic [ref=e665]: La casa del cura
                    - generic [ref=e666]: aventurera
                  - generic [ref=e667]:
                    - generic [ref=e668]: fantasía
                    - generic [ref=e669]: arañas
                    - generic [ref=e670]: religión
                  - combobox [ref=e671] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa" [selected]
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e672]: 16 mar 26
                  - generic [ref=e673]:
                    - link "Miembros" [ref=e674] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura/miembros
                      - img [ref=e675]
                      - text: Miembros
                    - link "Ver" [ref=e677] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura
                      - img [ref=e678]
                      - text: Ver
                    - button "Eliminar" [ref=e680] [cursor=pointer]:
                      - img [ref=e681]
                      - text: Eliminar
                - generic [ref=e684]:
                  - button [ref=e685] [cursor=pointer]:
                    - img [ref=e686]
                  - img "Viento y fuego" [ref=e689]
                  - generic [ref=e690]:
                    - generic [ref=e692]: Viento y fuego
                    - generic [ref=e693]: aventurera
                  - generic [ref=e694]:
                    - generic [ref=e695]: Violencia
                    - generic [ref=e696]: Misterio
                  - combobox [ref=e697] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada" [selected]
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e698]: 9 mar 26
                  - generic [ref=e699]:
                    - link "Miembros" [ref=e700] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego/miembros
                      - img [ref=e701]
                      - text: Miembros
                    - link "Ver" [ref=e703] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego
                      - img [ref=e704]
                      - text: Ver
                    - button "Eliminar" [ref=e706] [cursor=pointer]:
                      - img [ref=e707]
                      - text: Eliminar
                - generic [ref=e710]:
                  - button [ref=e711] [cursor=pointer]:
                    - img [ref=e712]
                  - img "Castillos del agua" [ref=e715]
                  - generic [ref=e716]:
                    - generic [ref=e718]: Castillos del agua
                    - generic [ref=e719]: aventurera
                  - generic [ref=e721]: Fantasía
                  - combobox [ref=e722] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada" [selected]
                    - option "Archivada"
                  - generic [ref=e723]: 7 mar 26
                  - generic [ref=e724]:
                    - link "Miembros" [ref=e725] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua/miembros
                      - img [ref=e726]
                      - text: Miembros
                    - link "Ver" [ref=e728] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua
                      - img [ref=e729]
                      - text: Ver
                    - button "Eliminar" [ref=e731] [cursor=pointer]:
                      - img [ref=e732]
                      - text: Eliminar
          - generic [ref=e734]:
            - generic [ref=e735]:
              - img [ref=e736]
              - heading "Tipos de Dado (8)" [level=2] [ref=e738]:
                - text: Tipos de Dado
                - generic [ref=e739]: (8)
            - generic [ref=e741]:
              - generic [ref=e742]:
                - generic [ref=e743]: d2
                - generic [ref=e744]:
                  - generic [ref=e745]: 2 caras
                  - generic [ref=e746]: cara o cruz
                - generic [ref=e747]:
                  - button [ref=e748] [cursor=pointer]:
                    - img [ref=e749]
                  - button [ref=e751] [cursor=pointer]:
                    - img [ref=e752]
              - generic [ref=e754]:
                - generic [ref=e755]: d4
                - generic [ref=e756]:
                  - generic [ref=e757]: 4 caras
                  - generic [ref=e758]: Dado de 4 caras
                - generic [ref=e759]:
                  - button [ref=e760] [cursor=pointer]:
                    - img [ref=e761]
                  - button [ref=e763] [cursor=pointer]:
                    - img [ref=e764]
              - generic [ref=e766]:
                - generic [ref=e767]: d6
                - generic [ref=e768]:
                  - generic [ref=e769]: 6 caras
                  - generic [ref=e770]: Dado de 6 caras
                - generic [ref=e771]:
                  - button [ref=e772] [cursor=pointer]:
                    - img [ref=e773]
                  - button [ref=e775] [cursor=pointer]:
                    - img [ref=e776]
              - generic [ref=e778]:
                - generic [ref=e779]: d8
                - generic [ref=e780]:
                  - generic [ref=e781]: 8 caras
                  - generic [ref=e782]: Dado de 8 caras
                - generic [ref=e783]:
                  - button [ref=e784] [cursor=pointer]:
                    - img [ref=e785]
                  - button [ref=e787] [cursor=pointer]:
                    - img [ref=e788]
              - generic [ref=e790]:
                - generic [ref=e791]: d10
                - generic [ref=e792]:
                  - generic [ref=e793]: 10 caras
                  - generic [ref=e794]: Dado de 10 caras
                - generic [ref=e795]:
                  - button [ref=e796] [cursor=pointer]:
                    - img [ref=e797]
                  - button [ref=e799] [cursor=pointer]:
                    - img [ref=e800]
              - generic [ref=e802]:
                - generic [ref=e803]: d12
                - generic [ref=e804]:
                  - generic [ref=e805]: 12 caras
                  - generic [ref=e806]: Dado de 12 caras
                - generic [ref=e807]:
                  - button [ref=e808] [cursor=pointer]:
                    - img [ref=e809]
                  - button [ref=e811] [cursor=pointer]:
                    - img [ref=e812]
              - generic [ref=e814]:
                - generic [ref=e815]: d20
                - generic [ref=e816]:
                  - generic [ref=e817]: 20 caras
                  - generic [ref=e818]: Dado de 20 caras
                - generic [ref=e819]:
                  - button [ref=e820] [cursor=pointer]:
                    - img [ref=e821]
                  - button [ref=e823] [cursor=pointer]:
                    - img [ref=e824]
              - generic [ref=e826]:
                - generic [ref=e827]: d100
                - generic [ref=e828]:
                  - generic [ref=e829]: 100 caras
                  - generic [ref=e830]: Dado percentil
                - generic [ref=e831]:
                  - button [ref=e832] [cursor=pointer]:
                    - img [ref=e833]
                  - button [ref=e835] [cursor=pointer]:
                    - img [ref=e836]
              - button "Nuevo dado" [ref=e838] [cursor=pointer]:
                - img [ref=e839]
                - text: Nuevo dado
          - generic [ref=e841]:
            - generic [ref=e842]:
              - img [ref=e843]
              - heading "Etiquetas (2)" [level=2] [ref=e846]:
                - text: Etiquetas
                - generic [ref=e847]: (2)
            - generic [ref=e849]:
              - generic [ref=e850]:
                - generic [ref=e851]: Fantasía
                - generic [ref=e853]: "#34d399"
                - generic [ref=e854]:
                  - button [ref=e855] [cursor=pointer]:
                    - img [ref=e856]
                  - button [ref=e858] [cursor=pointer]:
                    - img [ref=e859]
              - generic [ref=e861]:
                - generic [ref=e862]: Misterio
                - generic [ref=e864]: "#fbbf24"
                - generic [ref=e865]:
                  - button [ref=e866] [cursor=pointer]:
                    - img [ref=e867]
                  - button [ref=e869] [cursor=pointer]:
                    - img [ref=e870]
              - button "Nueva etiqueta" [ref=e872] [cursor=pointer]:
                - img [ref=e873]
                - text: Nueva etiqueta
          - generic [ref=e875]:
            - generic [ref=e876]:
              - img [ref=e877]
              - heading "Anuncios (5)" [level=2] [ref=e879]:
                - text: Anuncios
                - generic [ref=e880]: (5)
            - generic [ref=e881]:
              - button "Nuevo anuncio" [ref=e882] [cursor=pointer]:
                - img [ref=e883]
                - text: Nuevo anuncio
              - generic [ref=e885]:
                - generic [ref=e886]:
                  - generic [ref=e887]:
                    - heading "lololo" [level=3] [ref=e889]
                    - generic [ref=e890]: 21 mar 2026
                  - paragraph [ref=e892]: This paragraph has a border.
                  - generic [ref=e893]: Por aventurera
                  - generic [ref=e894]:
                    - button "Fijar" [ref=e895] [cursor=pointer]:
                      - img [ref=e896]
                      - text: Fijar
                    - button "Editar" [ref=e899] [cursor=pointer]:
                      - img [ref=e900]
                      - text: Editar
                    - button "Eliminar" [ref=e902] [cursor=pointer]:
                      - img [ref=e903]
                      - text: Eliminar
                - generic [ref=e905]:
                  - generic [ref=e906]:
                    - heading "Lalalala" [level=3] [ref=e908]
                    - generic [ref=e909]: 21 mar 2026
                  - paragraph [ref=e911]: This paragraph has a border.
                  - generic [ref=e912]: Por aventurera
                  - generic [ref=e913]:
                    - button "Fijar" [ref=e914] [cursor=pointer]:
                      - img [ref=e915]
                      - text: Fijar
                    - button "Editar" [ref=e918] [cursor=pointer]:
                      - img [ref=e919]
                      - text: Editar
                    - button "Eliminar" [ref=e921] [cursor=pointer]:
                      - img [ref=e922]
                      - text: Eliminar
                - generic [ref=e924]:
                  - generic [ref=e925]:
                    - heading "Pureba de html 2" [level=3] [ref=e927]
                    - generic [ref=e928]: 21 mar 2026
                  - paragraph [ref=e930]: This paragraph has a border.
                  - generic [ref=e931]: Por aventurera
                  - generic [ref=e932]:
                    - button "Fijar" [ref=e933] [cursor=pointer]:
                      - img [ref=e934]
                      - text: Fijar
                    - button "Editar" [ref=e937] [cursor=pointer]:
                      - img [ref=e938]
                      - text: Editar
                    - button "Eliminar" [ref=e940] [cursor=pointer]:
                      - img [ref=e941]
                      - text: Eliminar
                - generic [ref=e943]:
                  - generic [ref=e944]:
                    - heading "Prueba de html" [level=3] [ref=e946]
                    - generic [ref=e947]: 21 mar 2026
                  - generic [ref=e948]:
                    - generic [ref=e949]: tengo un camisón guardado
                    - text: en el armario.
                    - paragraph
                    - heading "puedo con titulos?" [level=1] [ref=e950]
                    - paragraph [ref=e951]: Ahora lo averiguaremos. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e952]: Por aventurera
                  - generic [ref=e953]:
                    - button "Fijar" [ref=e954] [cursor=pointer]:
                      - img [ref=e955]
                      - text: Fijar
                    - button "Editar" [ref=e958] [cursor=pointer]:
                      - img [ref=e959]
                      - text: Editar
                    - button "Eliminar" [ref=e961] [cursor=pointer]:
                      - img [ref=e962]
                      - text: Eliminar
                - generic [ref=e964]:
                  - generic [ref=e965]:
                    - generic [ref=e966]:
                      - img [ref=e967]
                      - heading "Empieza en" [level=3] [ref=e970]
                    - generic [ref=e971]: 9 mar 2026
                  - generic [ref=e972]: Noviembre. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e973]: Por aventurera
                  - generic [ref=e974]:
                    - button "Desfijar" [ref=e975] [cursor=pointer]:
                      - img [ref=e976]
                      - text: Desfijar
                    - button "Editar" [ref=e979] [cursor=pointer]:
                      - img [ref=e980]
                      - text: Editar
                    - button "Eliminar" [ref=e982] [cursor=pointer]:
                      - img [ref=e983]
                      - text: Eliminar
          - generic [ref=e985]:
            - generic [ref=e986]:
              - img [ref=e987]
              - heading "Eventos (0)" [level=2] [ref=e989]:
                - text: Eventos
                - generic [ref=e990]: (0)
            - generic [ref=e991]:
              - button "+ Nuevo evento" [ref=e993] [cursor=pointer]
              - table [ref=e995]:
                - rowgroup [ref=e996]:
                  - row "Título Tipo Estado Sala Inicio Acciones" [ref=e997]:
                    - columnheader "Título" [ref=e998]
                    - columnheader "Tipo" [ref=e999]
                    - columnheader "Estado" [ref=e1000]
                    - columnheader "Sala" [ref=e1001]
                    - columnheader "Inicio" [ref=e1002]
                    - columnheader "Acciones" [ref=e1003]
                - rowgroup [ref=e1004]:
                  - row "No hay eventos todavía" [ref=e1005]:
                    - cell "No hay eventos todavía" [ref=e1006]
          - generic [ref=e1007]:
            - generic [ref=e1008]:
              - img [ref=e1009]
              - heading "Posts Bloqueados (1)" [level=2] [ref=e1011]:
                - text: Posts Bloqueados
                - generic [ref=e1012]: (1)
            - generic [ref=e1015]:
              - generic [ref=e1016]:
                - generic [ref=e1017]:
                  - link "A la media noche pasó" [ref=e1018] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso
                  - generic [ref=e1019]: ›
                  - link "A las 12" [ref=e1020] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408
                - generic [ref=e1021]: Bloqueado 23 mar 2026
              - paragraph [ref=e1022]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              - generic [ref=e1023]:
                - generic [ref=e1024]:
                  - generic [ref=e1025]:
                    - text: "Autor:"
                    - link "aventurera" [ref=e1026] [cursor=pointer]:
                      - /url: /perfil/aventurera
                  - generic [ref=e1027]:
                    - text: "Bloqueado por:"
                    - link "aventurera" [ref=e1028] [cursor=pointer]:
                      - /url: /perfil/aventurera
                - button "Desbloquear" [ref=e1029] [cursor=pointer]:
                  - img [ref=e1030]
                  - text: Desbloquear
          - generic [ref=e1032]:
            - generic [ref=e1033]:
              - img [ref=e1034]
              - heading "Log de Moderación (6)" [level=2] [ref=e1036]:
                - text: Log de Moderación
                - generic [ref=e1037]: (6)
            - generic [ref=e1038]:
              - generic [ref=e1039]:
                - generic [ref=e1040]:
                  - generic [ref=e1041]: Acción
                  - generic [ref=e1042]:
                    - button "Todas" [ref=e1043] [cursor=pointer]
                    - button "Cambio de rol" [ref=e1044] [cursor=pointer]
                    - button "Desbaneo" [active] [ref=e1045] [cursor=pointer]
                    - button "Baneo" [ref=e1046] [cursor=pointer]
                - generic [ref=e1047]:
                  - generic [ref=e1048]: Tipo
                  - generic [ref=e1049]:
                    - button "Todos" [ref=e1050] [cursor=pointer]
                    - button "Usuario" [ref=e1051] [cursor=pointer]
                    - button "Sala" [ref=e1052] [cursor=pointer]
                    - button "Post" [ref=e1053] [cursor=pointer]
                    - button "IP" [ref=e1054] [cursor=pointer]
                    - button "Sistema" [ref=e1055] [cursor=pointer]
                - generic [ref=e1056]:
                  - generic [ref=e1057]: Fecha
                  - generic [ref=e1058]:
                    - textbox [ref=e1059] [cursor=pointer]
                    - generic [ref=e1060]: —
                    - textbox [ref=e1061] [cursor=pointer]
                - button "Limpiar filtros" [ref=e1062] [cursor=pointer]
                - generic [ref=e1063]: 1 de 6
              - table [ref=e1065]:
                - rowgroup [ref=e1066]:
                  - row "Acción Tipo Objetivo Notas Admin Fecha" [ref=e1067]:
                    - columnheader "Acción" [ref=e1068]:
                      - button "Acción" [ref=e1069] [cursor=pointer]:
                        - text: Acción
                        - img [ref=e1070]
                    - columnheader "Tipo" [ref=e1072]:
                      - button "Tipo" [ref=e1073] [cursor=pointer]:
                        - text: Tipo
                        - img [ref=e1074]
                    - columnheader "Objetivo" [ref=e1076]
                    - columnheader "Notas" [ref=e1077]
                    - columnheader "Admin" [ref=e1078]
                    - columnheader "Fecha" [ref=e1079]:
                      - button "Fecha" [ref=e1080] [cursor=pointer]:
                        - text: Fecha
                        - img [ref=e1081]
                - rowgroup [ref=e1083]:
                  - row "Desbaneo Usuario Zorra — aventurera 17 mar 26, 15:59" [ref=e1084]:
                    - cell "Desbaneo" [ref=e1085]
                    - cell "Usuario" [ref=e1086]
                    - cell "Zorra" [ref=e1087]
                    - cell "—" [ref=e1088]
                    - cell "aventurera" [ref=e1089]:
                      - generic [ref=e1091]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1092]
    - contentinfo [ref=e1093]:
      - generic [ref=e1094]:
        - generic [ref=e1095]:
          - generic [ref=e1096]:
            - generic [ref=e1097]: ✦
            - text: TalesRol
          - generic [ref=e1098]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e1099]:
          - link "Normas" [ref=e1100] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e1101] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e1102] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e1103]
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