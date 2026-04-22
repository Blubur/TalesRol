# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Admin modlog.spec.ts >> Log de moderación >> Filtrar por tipo "Usuario" reduce o mantiene el contador
- Location: tests\Admin modlog.spec.ts:66:7

# Error details

```
Error: locator.waitFor: Error: strict mode violation: locator('.admin-table-wrap') resolved to 4 elements:
    1) <div class="admin-table-wrap">…</div> aka locator('div').filter({ hasText: 'Colores de' }).nth(3)
    2) <div class="admin-table-wrap">…</div> aka locator('div').filter({ hasText: 'EstadoTodosPró' }).nth(3)
    3) <div class="admin-table-wrap">…</div> aka locator('div').filter({ hasText: /^TítuloTipoEstadoSalaInicioAccionesNo hay eventos todavía$/ })
    4) <div class="admin-table-wrap">…</div> aka locator('div').filter({ hasText: 'AcciónTodasCambio de' }).nth(3)

Call log:
  - waiting for locator('.admin-table-wrap') to be visible

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
                - heading "Panel de Administración" [level=1] [ref=e108]
                - paragraph [ref=e109]: Control total del sistema
            - link "← Volver al inicio" [ref=e110] [cursor=pointer]:
              - /url: /
          - generic [ref=e111]:
            - generic [ref=e112]:
              - img [ref=e113]
              - generic [ref=e115]:
                - generic [ref=e116]: "9"
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
              - heading "Usuarios (9)" [level=2] [ref=e287]:
                - text: Usuarios
                - generic [ref=e288]: (9)
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
                - generic [ref=e318]: 9 de 9
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
                  - row "testbot1776842601153 testbot1776842601153 @testbot1776842601153 testbot_1776842601153@mailinator.com admin Activo 0 22 abr 26 Banear" [ref=e340]:
                    - cell "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e341]:
                      - link "testbot1776842601153 testbot1776842601153 @testbot1776842601153" [ref=e342] [cursor=pointer]:
                        - /url: /perfil/testbot1776842601153
                        - img "testbot1776842601153" [ref=e343]
                        - generic [ref=e344]:
                          - generic [ref=e345]: testbot1776842601153
                          - generic [ref=e346]: "@testbot1776842601153"
                    - cell "testbot_1776842601153@mailinator.com" [ref=e347]
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
                  - row "testbot1776807228952 testbot1776807228952 @testbot1776807228952 testbot_1776807228952@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e359]:
                    - cell "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e360]:
                      - link "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e361] [cursor=pointer]:
                        - /url: /perfil/testbot1776807228952
                        - img "testbot1776807228952" [ref=e362]
                        - generic [ref=e363]:
                          - generic [ref=e364]: testbot1776807228952
                          - generic [ref=e365]: "@testbot1776807228952"
                    - cell "testbot_1776807228952@mailinator.com" [ref=e366]
                    - cell "admin" [ref=e367]:
                      - combobox [ref=e369] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e370]
                    - cell "0" [ref=e371]
                    - cell "21 abr 26" [ref=e372]
                    - cell "Banear" [ref=e373]:
                      - button "Banear" [ref=e375] [cursor=pointer]:
                        - img [ref=e376]
                        - text: Banear
                  - row "testbot1776806837639 testbot1776806837639 @testbot1776806837639 testbot_1776806837639@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e378]:
                    - cell "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e379]:
                      - link "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e380] [cursor=pointer]:
                        - /url: /perfil/testbot1776806837639
                        - img "testbot1776806837639" [ref=e381]
                        - generic [ref=e382]:
                          - generic [ref=e383]: testbot1776806837639
                          - generic [ref=e384]: "@testbot1776806837639"
                    - cell "testbot_1776806837639@mailinator.com" [ref=e385]
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
                  - row "testbot1776797825837 testbot1776797825837 @testbot1776797825837 testbot_1776797825837@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e397]:
                    - cell "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e398]:
                      - link "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e399] [cursor=pointer]:
                        - /url: /perfil/testbot1776797825837
                        - img "testbot1776797825837" [ref=e400]
                        - generic [ref=e401]:
                          - generic [ref=e402]: testbot1776797825837
                          - generic [ref=e403]: "@testbot1776797825837"
                    - cell "testbot_1776797825837@mailinator.com" [ref=e404]
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
                  - row "testbot1776797707071 testbot1776797707071 @testbot1776797707071 testbot_1776797707071@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e416]:
                    - cell "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e417]:
                      - link "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e418] [cursor=pointer]:
                        - /url: /perfil/testbot1776797707071
                        - img "testbot1776797707071" [ref=e419]
                        - generic [ref=e420]:
                          - generic [ref=e421]: testbot1776797707071
                          - generic [ref=e422]: "@testbot1776797707071"
                    - cell "testbot_1776797707071@mailinator.com" [ref=e423]
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
                  - row "Puck Puck @Puck loregalafate@gmail.com admin Activo 0 16 mar 26 Banear" [ref=e435]:
                    - cell "Puck Puck @Puck" [ref=e436]:
                      - link "Puck Puck @Puck" [ref=e437] [cursor=pointer]:
                        - /url: /perfil/Puck
                        - img "Puck" [ref=e438]
                        - generic [ref=e439]:
                          - generic [ref=e440]: Puck
                          - generic [ref=e441]: "@Puck"
                    - cell "loregalafate@gmail.com" [ref=e442]
                    - cell "admin" [ref=e443]:
                      - combobox [ref=e445] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e446]
                    - cell "0" [ref=e447]
                    - cell "16 mar 26" [ref=e448]
                    - cell "Banear" [ref=e449]:
                      - button "Banear" [ref=e451] [cursor=pointer]:
                        - img [ref=e452]
                        - text: Banear
                  - row "Blu Aventurera Rosa @Blu pililahiguera@gmail.com master Activo 0 16 mar 26 Banear" [ref=e454]:
                    - cell "Blu Aventurera Rosa @Blu" [ref=e455]:
                      - link "Blu Aventurera Rosa @Blu" [ref=e456] [cursor=pointer]:
                        - /url: /perfil/Blu
                        - img "Blu" [ref=e457]
                        - generic [ref=e458]:
                          - generic [ref=e459]: Aventurera Rosa
                          - generic [ref=e460]: "@Blu"
                    - cell "pililahiguera@gmail.com" [ref=e461]
                    - cell "master" [ref=e462]:
                      - combobox [ref=e464] [cursor=pointer]:
                        - option "admin"
                        - option "master" [selected]
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
                  - row "Zorra Zorra @Zorra test@fatrol.com jugador Activo 70 8 mar 26 Banear" [ref=e473]:
                    - cell "Zorra Zorra @Zorra" [ref=e474]:
                      - link "Zorra Zorra @Zorra" [ref=e475] [cursor=pointer]:
                        - /url: /perfil/Zorra
                        - img "Zorra" [ref=e476]
                        - generic [ref=e477]:
                          - generic [ref=e478]: Zorra
                          - generic [ref=e479]: "@Zorra"
                    - cell "test@fatrol.com" [ref=e480]
                    - cell "jugador" [ref=e481]:
                      - combobox [ref=e483] [cursor=pointer]:
                        - option "admin"
                        - option "master"
                        - option "director"
                        - option "jugador" [selected]
                        - option "miembro"
                    - cell "Activo" [ref=e484]
                    - cell "70" [ref=e485]
                    - cell "8 mar 26" [ref=e486]
                    - cell "Banear" [ref=e487]:
                      - button "Banear" [ref=e489] [cursor=pointer]:
                        - img [ref=e490]
                        - text: Banear
                  - row "aventurera aventurera @aventurera veinticuatro0792@gmail.com admin Activo 85 7 mar 26 Tú" [ref=e492]:
                    - cell "aventurera aventurera @aventurera" [ref=e493]:
                      - link "aventurera aventurera @aventurera" [ref=e494] [cursor=pointer]:
                        - /url: /perfil/aventurera
                        - img "aventurera" [ref=e495]
                        - generic [ref=e496]:
                          - generic [ref=e497]: aventurera
                          - generic [ref=e498]: "@aventurera"
                    - cell "veinticuatro0792@gmail.com" [ref=e499]
                    - cell "admin" [ref=e500]:
                      - combobox [disabled] [ref=e502]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e503]
                    - cell "85" [ref=e504]
                    - cell "7 mar 26" [ref=e505]
                    - cell "Tú" [ref=e506]
          - generic [ref=e507]:
            - generic [ref=e508]:
              - img [ref=e509]
              - heading "Salas (7)" [level=2] [ref=e511]:
                - text: Salas
                - generic [ref=e512]: (7)
            - generic [ref=e513]:
              - textbox "Buscar por título o creador..." [ref=e515]
              - generic [ref=e516]:
                - generic [ref=e517]:
                  - generic [ref=e518]: Estado
                  - generic [ref=e519]:
                    - button "Todos" [ref=e520] [cursor=pointer]
                    - button "Próximamente" [ref=e521] [cursor=pointer]
                    - button "Activa" [ref=e522] [cursor=pointer]
                    - button "En pausa" [ref=e523] [cursor=pointer]
                    - button "Finalizada" [ref=e524] [cursor=pointer]
                    - button "Cerrada" [ref=e525] [cursor=pointer]
                    - button "Archivada" [ref=e526] [cursor=pointer]
                - generic [ref=e527]:
                  - generic [ref=e528]: Creación
                  - generic [ref=e529]:
                    - textbox [ref=e530] [cursor=pointer]
                    - generic [ref=e531]: —
                    - textbox [ref=e532] [cursor=pointer]
                - generic [ref=e533]: 7 de 7
              - generic [ref=e534]:
                - generic [ref=e536]:
                  - button [ref=e537] [cursor=pointer]:
                    - img [ref=e538]
                  - img "Cenizas blancas" [ref=e541]
                  - generic [ref=e542]:
                    - generic [ref=e544]: Cenizas blancas
                    - generic [ref=e545]: aventurera
                  - generic [ref=e546]:
                    - generic [ref=e547]: Fantasia angelical
                    - generic [ref=e548]: "TW: vais a llorar"
                  - combobox [ref=e549] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e550]: 5 abr 26
                  - generic [ref=e551]:
                    - link "Miembros" [ref=e552] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas/miembros
                      - img [ref=e553]
                      - text: Miembros
                    - link "Ver" [ref=e555] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas
                      - img [ref=e556]
                      - text: Ver
                    - button "Eliminar" [ref=e558] [cursor=pointer]:
                      - img [ref=e559]
                      - text: Eliminar
                - generic [ref=e562]:
                  - button [ref=e563] [cursor=pointer]:
                    - img [ref=e564]
                  - img "Perihelio tardío" [ref=e567]
                  - generic [ref=e568]:
                    - generic [ref=e570]: Perihelio tardío
                    - generic [ref=e571]: aventurera
                  - generic [ref=e573]: sci fi
                  - combobox [ref=e574] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e575]: 22 mar 26
                  - generic [ref=e576]:
                    - link "Miembros" [ref=e577] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio/miembros
                      - img [ref=e578]
                      - text: Miembros
                    - link "Ver" [ref=e580] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio
                      - img [ref=e581]
                      - text: Ver
                    - button "Eliminar" [ref=e583] [cursor=pointer]:
                      - img [ref=e584]
                      - text: Eliminar
                - generic [ref=e587]:
                  - button [ref=e588] [cursor=pointer]:
                    - img [ref=e589]
                  - img "A la media noche pasó" [ref=e592]
                  - generic [ref=e593]:
                    - generic [ref=e595]: A la media noche pasó
                    - generic [ref=e596]: aventurera
                  - generic [ref=e597]:
                    - generic [ref=e598]: solo noche
                    - generic [ref=e599]: algodones
                  - combobox [ref=e600] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e601]: 18 mar 26
                  - generic [ref=e602]:
                    - link "Miembros" [ref=e603] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso/miembros
                      - img [ref=e604]
                      - text: Miembros
                    - link "Ver" [ref=e606] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso
                      - img [ref=e607]
                      - text: Ver
                    - button "Eliminar" [ref=e609] [cursor=pointer]:
                      - img [ref=e610]
                      - text: Eliminar
                - generic [ref=e613]:
                  - button [ref=e614] [cursor=pointer]:
                    - img [ref=e615]
                  - img "Josepa y Camila se van a Benidorm" [ref=e618]
                  - generic [ref=e619]:
                    - generic [ref=e621]: Josepa y Camila se van a Benidorm
                    - generic [ref=e622]: Puck
                  - generic [ref=e624]: "TW: Josepa en bañador"
                  - combobox [ref=e625] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e626]: 16 mar 26
                  - generic [ref=e627]:
                    - link "Miembros" [ref=e628] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm/miembros
                      - img [ref=e629]
                      - text: Miembros
                    - link "Ver" [ref=e631] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm
                      - img [ref=e632]
                      - text: Ver
                    - button "Eliminar" [ref=e634] [cursor=pointer]:
                      - img [ref=e635]
                      - text: Eliminar
                - generic [ref=e638]:
                  - button [ref=e639] [cursor=pointer]:
                    - img [ref=e640]
                  - img "La casa del cura" [ref=e643]
                  - generic [ref=e644]:
                    - generic [ref=e646]: La casa del cura
                    - generic [ref=e647]: aventurera
                  - generic [ref=e648]:
                    - generic [ref=e649]: fantasía
                    - generic [ref=e650]: arañas
                    - generic [ref=e651]: religión
                  - combobox [ref=e652] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa" [selected]
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e653]: 16 mar 26
                  - generic [ref=e654]:
                    - link "Miembros" [ref=e655] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura/miembros
                      - img [ref=e656]
                      - text: Miembros
                    - link "Ver" [ref=e658] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura
                      - img [ref=e659]
                      - text: Ver
                    - button "Eliminar" [ref=e661] [cursor=pointer]:
                      - img [ref=e662]
                      - text: Eliminar
                - generic [ref=e665]:
                  - button [ref=e666] [cursor=pointer]:
                    - img [ref=e667]
                  - img "Viento y fuego" [ref=e670]
                  - generic [ref=e671]:
                    - generic [ref=e673]: Viento y fuego
                    - generic [ref=e674]: aventurera
                  - generic [ref=e675]:
                    - generic [ref=e676]: Violencia
                    - generic [ref=e677]: Misterio
                  - combobox [ref=e678] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada" [selected]
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e679]: 9 mar 26
                  - generic [ref=e680]:
                    - link "Miembros" [ref=e681] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego/miembros
                      - img [ref=e682]
                      - text: Miembros
                    - link "Ver" [ref=e684] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego
                      - img [ref=e685]
                      - text: Ver
                    - button "Eliminar" [ref=e687] [cursor=pointer]:
                      - img [ref=e688]
                      - text: Eliminar
                - generic [ref=e691]:
                  - button [ref=e692] [cursor=pointer]:
                    - img [ref=e693]
                  - img "Castillos del agua" [ref=e696]
                  - generic [ref=e697]:
                    - generic [ref=e699]: Castillos del agua
                    - generic [ref=e700]: aventurera
                  - generic [ref=e702]: Fantasía
                  - combobox [ref=e703] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada" [selected]
                    - option "Archivada"
                  - generic [ref=e704]: 7 mar 26
                  - generic [ref=e705]:
                    - link "Miembros" [ref=e706] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua/miembros
                      - img [ref=e707]
                      - text: Miembros
                    - link "Ver" [ref=e709] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua
                      - img [ref=e710]
                      - text: Ver
                    - button "Eliminar" [ref=e712] [cursor=pointer]:
                      - img [ref=e713]
                      - text: Eliminar
          - generic [ref=e715]:
            - generic [ref=e716]:
              - img [ref=e717]
              - heading "Tipos de Dado (8)" [level=2] [ref=e719]:
                - text: Tipos de Dado
                - generic [ref=e720]: (8)
            - generic [ref=e722]:
              - generic [ref=e723]:
                - generic [ref=e724]: d2
                - generic [ref=e725]:
                  - generic [ref=e726]: 2 caras
                  - generic [ref=e727]: cara o cruz
                - generic [ref=e728]:
                  - button [ref=e729] [cursor=pointer]:
                    - img [ref=e730]
                  - button [ref=e732] [cursor=pointer]:
                    - img [ref=e733]
              - generic [ref=e735]:
                - generic [ref=e736]: d4
                - generic [ref=e737]:
                  - generic [ref=e738]: 4 caras
                  - generic [ref=e739]: Dado de 4 caras
                - generic [ref=e740]:
                  - button [ref=e741] [cursor=pointer]:
                    - img [ref=e742]
                  - button [ref=e744] [cursor=pointer]:
                    - img [ref=e745]
              - generic [ref=e747]:
                - generic [ref=e748]: d6
                - generic [ref=e749]:
                  - generic [ref=e750]: 6 caras
                  - generic [ref=e751]: Dado de 6 caras
                - generic [ref=e752]:
                  - button [ref=e753] [cursor=pointer]:
                    - img [ref=e754]
                  - button [ref=e756] [cursor=pointer]:
                    - img [ref=e757]
              - generic [ref=e759]:
                - generic [ref=e760]: d8
                - generic [ref=e761]:
                  - generic [ref=e762]: 8 caras
                  - generic [ref=e763]: Dado de 8 caras
                - generic [ref=e764]:
                  - button [ref=e765] [cursor=pointer]:
                    - img [ref=e766]
                  - button [ref=e768] [cursor=pointer]:
                    - img [ref=e769]
              - generic [ref=e771]:
                - generic [ref=e772]: d10
                - generic [ref=e773]:
                  - generic [ref=e774]: 10 caras
                  - generic [ref=e775]: Dado de 10 caras
                - generic [ref=e776]:
                  - button [ref=e777] [cursor=pointer]:
                    - img [ref=e778]
                  - button [ref=e780] [cursor=pointer]:
                    - img [ref=e781]
              - generic [ref=e783]:
                - generic [ref=e784]: d12
                - generic [ref=e785]:
                  - generic [ref=e786]: 12 caras
                  - generic [ref=e787]: Dado de 12 caras
                - generic [ref=e788]:
                  - button [ref=e789] [cursor=pointer]:
                    - img [ref=e790]
                  - button [ref=e792] [cursor=pointer]:
                    - img [ref=e793]
              - generic [ref=e795]:
                - generic [ref=e796]: d20
                - generic [ref=e797]:
                  - generic [ref=e798]: 20 caras
                  - generic [ref=e799]: Dado de 20 caras
                - generic [ref=e800]:
                  - button [ref=e801] [cursor=pointer]:
                    - img [ref=e802]
                  - button [ref=e804] [cursor=pointer]:
                    - img [ref=e805]
              - generic [ref=e807]:
                - generic [ref=e808]: d100
                - generic [ref=e809]:
                  - generic [ref=e810]: 100 caras
                  - generic [ref=e811]: Dado percentil
                - generic [ref=e812]:
                  - button [ref=e813] [cursor=pointer]:
                    - img [ref=e814]
                  - button [ref=e816] [cursor=pointer]:
                    - img [ref=e817]
              - button "Nuevo dado" [ref=e819] [cursor=pointer]:
                - img [ref=e820]
                - text: Nuevo dado
          - generic [ref=e822]:
            - generic [ref=e823]:
              - img [ref=e824]
              - heading "Etiquetas (2)" [level=2] [ref=e827]:
                - text: Etiquetas
                - generic [ref=e828]: (2)
            - generic [ref=e830]:
              - generic [ref=e831]:
                - generic [ref=e832]: Fantasía
                - generic [ref=e834]: "#34d399"
                - generic [ref=e835]:
                  - button [ref=e836] [cursor=pointer]:
                    - img [ref=e837]
                  - button [ref=e839] [cursor=pointer]:
                    - img [ref=e840]
              - generic [ref=e842]:
                - generic [ref=e843]: Misterio
                - generic [ref=e845]: "#fbbf24"
                - generic [ref=e846]:
                  - button [ref=e847] [cursor=pointer]:
                    - img [ref=e848]
                  - button [ref=e850] [cursor=pointer]:
                    - img [ref=e851]
              - button "Nueva etiqueta" [ref=e853] [cursor=pointer]:
                - img [ref=e854]
                - text: Nueva etiqueta
          - generic [ref=e856]:
            - generic [ref=e857]:
              - img [ref=e858]
              - heading "Anuncios (5)" [level=2] [ref=e860]:
                - text: Anuncios
                - generic [ref=e861]: (5)
            - generic [ref=e862]:
              - button "Nuevo anuncio" [ref=e863] [cursor=pointer]:
                - img [ref=e864]
                - text: Nuevo anuncio
              - generic [ref=e866]:
                - generic [ref=e867]:
                  - generic [ref=e868]:
                    - heading "lololo" [level=3] [ref=e870]
                    - generic [ref=e871]: 21 mar 2026
                  - paragraph [ref=e873]: This paragraph has a border.
                  - generic [ref=e874]: Por aventurera
                  - generic [ref=e875]:
                    - button "Fijar" [ref=e876] [cursor=pointer]:
                      - img [ref=e877]
                      - text: Fijar
                    - button "Editar" [ref=e880] [cursor=pointer]:
                      - img [ref=e881]
                      - text: Editar
                    - button "Eliminar" [ref=e883] [cursor=pointer]:
                      - img [ref=e884]
                      - text: Eliminar
                - generic [ref=e886]:
                  - generic [ref=e887]:
                    - heading "Lalalala" [level=3] [ref=e889]
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
                    - heading "Pureba de html 2" [level=3] [ref=e908]
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
                    - heading "Prueba de html" [level=3] [ref=e927]
                    - generic [ref=e928]: 21 mar 2026
                  - generic [ref=e929]:
                    - generic [ref=e930]: tengo un camisón guardado
                    - text: en el armario.
                    - paragraph
                    - heading "puedo con titulos?" [level=1] [ref=e931]
                    - paragraph [ref=e932]: Ahora lo averiguaremos. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e933]: Por aventurera
                  - generic [ref=e934]:
                    - button "Fijar" [ref=e935] [cursor=pointer]:
                      - img [ref=e936]
                      - text: Fijar
                    - button "Editar" [ref=e939] [cursor=pointer]:
                      - img [ref=e940]
                      - text: Editar
                    - button "Eliminar" [ref=e942] [cursor=pointer]:
                      - img [ref=e943]
                      - text: Eliminar
                - generic [ref=e945]:
                  - generic [ref=e946]:
                    - generic [ref=e947]:
                      - img [ref=e948]
                      - heading "Empieza en" [level=3] [ref=e951]
                    - generic [ref=e952]: 9 mar 2026
                  - generic [ref=e953]: Noviembre. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e954]: Por aventurera
                  - generic [ref=e955]:
                    - button "Desfijar" [ref=e956] [cursor=pointer]:
                      - img [ref=e957]
                      - text: Desfijar
                    - button "Editar" [ref=e960] [cursor=pointer]:
                      - img [ref=e961]
                      - text: Editar
                    - button "Eliminar" [ref=e963] [cursor=pointer]:
                      - img [ref=e964]
                      - text: Eliminar
          - generic [ref=e966]:
            - generic [ref=e967]:
              - img [ref=e968]
              - heading "Eventos (0)" [level=2] [ref=e970]:
                - text: Eventos
                - generic [ref=e971]: (0)
            - generic [ref=e972]:
              - button "+ Nuevo evento" [ref=e974] [cursor=pointer]
              - table [ref=e976]:
                - rowgroup [ref=e977]:
                  - row "Título Tipo Estado Sala Inicio Acciones" [ref=e978]:
                    - columnheader "Título" [ref=e979]
                    - columnheader "Tipo" [ref=e980]
                    - columnheader "Estado" [ref=e981]
                    - columnheader "Sala" [ref=e982]
                    - columnheader "Inicio" [ref=e983]
                    - columnheader "Acciones" [ref=e984]
                - rowgroup [ref=e985]:
                  - row "No hay eventos todavía" [ref=e986]:
                    - cell "No hay eventos todavía" [ref=e987]
          - generic [ref=e988]:
            - generic [ref=e989]:
              - img [ref=e990]
              - heading "Posts Bloqueados (1)" [level=2] [ref=e992]:
                - text: Posts Bloqueados
                - generic [ref=e993]: (1)
            - generic [ref=e996]:
              - generic [ref=e997]:
                - generic [ref=e998]:
                  - link "A la media noche pasó" [ref=e999] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso
                  - generic [ref=e1000]: ›
                  - link "A las 12" [ref=e1001] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408
                - generic [ref=e1002]: Bloqueado 23 mar 2026
              - paragraph [ref=e1003]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              - generic [ref=e1004]:
                - generic [ref=e1005]:
                  - generic [ref=e1006]:
                    - text: "Autor:"
                    - link "aventurera" [ref=e1007] [cursor=pointer]:
                      - /url: /perfil/aventurera
                  - generic [ref=e1008]:
                    - text: "Bloqueado por:"
                    - link "aventurera" [ref=e1009] [cursor=pointer]:
                      - /url: /perfil/aventurera
                - button "Desbloquear" [ref=e1010] [cursor=pointer]:
                  - img [ref=e1011]
                  - text: Desbloquear
          - generic [ref=e1013]:
            - generic [ref=e1014]:
              - img [ref=e1015]
              - heading "Log de Moderación (6)" [level=2] [ref=e1017]:
                - text: Log de Moderación
                - generic [ref=e1018]: (6)
            - generic [ref=e1019]:
              - generic [ref=e1020]:
                - generic [ref=e1021]:
                  - generic [ref=e1022]: Acción
                  - generic [ref=e1023]:
                    - button "Todas" [ref=e1024] [cursor=pointer]
                    - button "Cambio de rol" [ref=e1025] [cursor=pointer]
                    - button "Desbaneo" [ref=e1026] [cursor=pointer]
                    - button "Baneo" [ref=e1027] [cursor=pointer]
                - generic [ref=e1028]:
                  - generic [ref=e1029]: Tipo
                  - generic [ref=e1030]:
                    - button "Todos" [ref=e1031] [cursor=pointer]
                    - button "Usuario" [ref=e1032] [cursor=pointer]
                    - button "Sala" [ref=e1033] [cursor=pointer]
                    - button "Post" [ref=e1034] [cursor=pointer]
                    - button "IP" [ref=e1035] [cursor=pointer]
                    - button "Sistema" [ref=e1036] [cursor=pointer]
                - generic [ref=e1037]:
                  - generic [ref=e1038]: Fecha
                  - generic [ref=e1039]:
                    - textbox [ref=e1040] [cursor=pointer]
                    - generic [ref=e1041]: —
                    - textbox [ref=e1042] [cursor=pointer]
                - generic [ref=e1043]: 6 de 6
              - table [ref=e1045]:
                - rowgroup [ref=e1046]:
                  - row "Acción Tipo Objetivo Notas Admin Fecha" [ref=e1047]:
                    - columnheader "Acción" [ref=e1048]:
                      - button "Acción" [ref=e1049] [cursor=pointer]:
                        - text: Acción
                        - img [ref=e1050]
                    - columnheader "Tipo" [ref=e1052]:
                      - button "Tipo" [ref=e1053] [cursor=pointer]:
                        - text: Tipo
                        - img [ref=e1054]
                    - columnheader "Objetivo" [ref=e1056]
                    - columnheader "Notas" [ref=e1057]
                    - columnheader "Admin" [ref=e1058]
                    - columnheader "Fecha" [ref=e1059]:
                      - button "Fecha" [ref=e1060] [cursor=pointer]:
                        - text: Fecha
                        - img [ref=e1061]
                - rowgroup [ref=e1063]:
                  - 'row "Cambio de rol Usuario Blu Nuevo rol: master aventurera 18 mar 26, 12:33" [ref=e1064]':
                    - cell "Cambio de rol" [ref=e1065]
                    - cell "Usuario" [ref=e1066]
                    - cell "Blu" [ref=e1067]
                    - 'cell "Nuevo rol: master" [ref=e1068]'
                    - cell "aventurera" [ref=e1069]:
                      - generic [ref=e1071]: aventurera
                    - cell "18 mar 26, 12:33" [ref=e1072]
                  - 'row "Cambio de rol Usuario Blu Nuevo rol: jugador aventurera 18 mar 26, 12:32" [ref=e1073]':
                    - cell "Cambio de rol" [ref=e1074]
                    - cell "Usuario" [ref=e1075]
                    - cell "Blu" [ref=e1076]
                    - 'cell "Nuevo rol: jugador" [ref=e1077]'
                    - cell "aventurera" [ref=e1078]:
                      - generic [ref=e1080]: aventurera
                    - cell "18 mar 26, 12:32" [ref=e1081]
                  - 'row "Cambio de rol Usuario Blu Nuevo rol: master aventurera 17 mar 26, 16:00" [ref=e1082]':
                    - cell "Cambio de rol" [ref=e1083]
                    - cell "Usuario" [ref=e1084]
                    - cell "Blu" [ref=e1085]
                    - 'cell "Nuevo rol: master" [ref=e1086]'
                    - cell "aventurera" [ref=e1087]:
                      - generic [ref=e1089]: aventurera
                    - cell "17 mar 26, 16:00" [ref=e1090]
                  - 'row "Cambio de rol Usuario Blu Nuevo rol: miembro aventurera 17 mar 26, 15:59" [ref=e1091]':
                    - cell "Cambio de rol" [ref=e1092]
                    - cell "Usuario" [ref=e1093]
                    - cell "Blu" [ref=e1094]
                    - 'cell "Nuevo rol: miembro" [ref=e1095]'
                    - cell "aventurera" [ref=e1096]:
                      - generic [ref=e1098]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1099]
                  - row "Desbaneo Usuario Zorra — aventurera 17 mar 26, 15:59" [ref=e1100]:
                    - cell "Desbaneo" [ref=e1101]
                    - cell "Usuario" [ref=e1102]
                    - cell "Zorra" [ref=e1103]
                    - cell "—" [ref=e1104]
                    - cell "aventurera" [ref=e1105]:
                      - generic [ref=e1107]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1108]
                  - row "Baneo Usuario Zorra — aventurera 17 mar 26, 15:59" [ref=e1109]:
                    - cell "Baneo" [ref=e1110]
                    - cell "Usuario" [ref=e1111]
                    - cell "Zorra" [ref=e1112]
                    - cell "—" [ref=e1113]
                    - cell "aventurera" [ref=e1114]:
                      - generic [ref=e1116]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1117]
    - contentinfo [ref=e1118]:
      - generic [ref=e1119]:
        - generic [ref=e1120]:
          - generic [ref=e1121]:
            - generic [ref=e1122]: ✦
            - text: TalesRol
          - generic [ref=e1123]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e1124]:
          - link "Normas" [ref=e1125] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e1126] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e1127] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e1128]
```

# Test source

```ts
  1   | // spec: log de moderación — /admin#modlog
  2   | // El componente AdminModLogTable está embebido en /admin como una sección/pestaña.
  3   | // Selectores basados en AdminModLogTable.tsx:
  4   | //   - .admin-table-wrap          → contenedor raíz del componente
  5   | //   - .filter-bar                → barra de filtros
  6   | //   - .filter-btn                → botones de filtro (Acción, Tipo)
  7   | //   - .filter-date-input         → inputs de fecha
  8   | //   - .filter-clear-btn          → botón "Limpiar filtros"
  9   | //   - .filter-count              → contador "X de Y"
  10  | //   - table.admin-table          → tabla de logs
  11  | //   - .modlog-action-badge       → badge de acción en cada fila
  12  | //   - .sort-th                   → botones de cabecera ordenable
  13  | //   - .empty-row                 → fila vacía si no hay resultados
  14  | 
  15  | import { test, expect } from '@playwright/test'
  16  | 
  17  | const BASE_URL = process.env.BASE_URL ?? 'https://tales-rol.vercel.app'
  18  | 
  19  | test.describe('Log de moderación', () => {
  20  |   test.beforeEach(async ({ page }) => {
  21  |     await page.goto(`${BASE_URL}/auth/login`)
  22  |     await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'veinticuatro0792@gmail.com')
  23  |     await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'pilipp22')
  24  |     await page.click('button[type="submit"]')
  25  |     await page.waitForURL(`${BASE_URL}/`)
  26  |     await page.goto(`${BASE_URL}/admin`)
  27  |     // Navegar a la sección modlog (puede ser scroll, tab o anchor)
  28  |     await page.goto(`${BASE_URL}/admin#modlog`)
  29  |     // Esperar a que la tabla esté en el DOM
> 30  |     await page.locator('.admin-table-wrap').waitFor({ state: 'visible', timeout: 10000 })
      |                                             ^ Error: locator.waitFor: Error: strict mode violation: locator('.admin-table-wrap') resolved to 4 elements:
  31  |   })
  32  | 
  33  |   // ── Carga básica ────────────────────────────────────────────────────────
  34  | 
  35  |   test('La tabla de log está visible', async ({ page }) => {
  36  |     await expect(page.locator('table.admin-table')).toBeVisible()
  37  |   })
  38  | 
  39  |   test('La barra de filtros está visible', async ({ page }) => {
  40  |     await expect(page.locator('.filter-bar')).toBeVisible()
  41  |     await expect(page.locator('.filter-btn').first()).toBeVisible()
  42  |   })
  43  | 
  44  |   test('El contador de entradas es visible', async ({ page }) => {
  45  |     await expect(page.locator('.filter-count')).toBeVisible()
  46  |     const text = await page.locator('.filter-count').textContent()
  47  |     // Formato esperado: "X de Y"
  48  |     expect(text).toMatch(/\d+ de \d+/)
  49  |   })
  50  | 
  51  |   test('Las cabeceras ordenables están presentes', async ({ page }) => {
  52  |     await expect(page.locator('button.sort-th:has-text("Acción")')).toBeVisible()
  53  |     await expect(page.locator('button.sort-th:has-text("Tipo")')).toBeVisible()
  54  |     await expect(page.locator('button.sort-th:has-text("Fecha")')).toBeVisible()
  55  |   })
  56  | 
  57  |   // ── Filtros de acción ───────────────────────────────────────────────────
  58  | 
  59  |   test('El filtro "Todas" está activo por defecto', async ({ page }) => {
  60  |     const todasBtn = page.locator('.filter-btn.active').first()
  61  |     await expect(todasBtn).toBeVisible()
  62  |     const text = await todasBtn.textContent()
  63  |     expect(text?.trim()).toBe('Todas')
  64  |   })
  65  | 
  66  |   test('Filtrar por tipo "Usuario" reduce o mantiene el contador', async ({ page }) => {
  67  |     const countBefore = await page.locator('.filter-count').textContent()
  68  |     const totalBefore = parseInt(countBefore?.split(' de ')[1] ?? '0')
  69  | 
  70  |     await page.locator('.filter-btn:has-text("Usuario")').click()
  71  | 
  72  |     const countAfter = await page.locator('.filter-count').textContent()
  73  |     const shownAfter = parseInt(countAfter?.split(' de ')[0] ?? '0')
  74  | 
  75  |     // El total mostrado no puede superar el total original
  76  |     expect(shownAfter).toBeLessThanOrEqual(totalBefore)
  77  |   })
  78  | 
  79  |   test('Filtrar por acción "Baneo" muestra solo filas de baneo o tabla vacía', async ({ page }) => {
  80  |     const baneoBtn = page.locator('.filter-btn:has-text("Baneo")').first()
  81  |     if (await baneoBtn.count() === 0) {
  82  |       // No hay acciones de baneo registradas, el filtro no aparece
  83  |       test.skip()
  84  |       return
  85  |     }
  86  |     await baneoBtn.click()
  87  |     const rows = page.locator('tbody tr:not(.empty-row)')
  88  |     const count = await rows.count()
  89  |     if (count > 0) {
  90  |       // Todas las filas visibles deben tener badge de Baneo
  91  |       const badges = page.locator('.modlog-action-badge')
  92  |       for (let i = 0; i < await badges.count(); i++) {
  93  |         const text = await badges.nth(i).textContent()
  94  |         expect(text?.trim()).toBe('Baneo')
  95  |       }
  96  |     }
  97  |     // Si count === 0, aparece la fila vacía
  98  |     else {
  99  |       await expect(page.locator('.empty-row')).toBeVisible()
  100 |     }
  101 |   })
  102 | 
  103 |   // ── Filtros de fecha ────────────────────────────────────────────────────
  104 | 
  105 |   test('Los inputs de fecha están presentes', async ({ page }) => {
  106 |     const dateInputs = page.locator('input.filter-date-input')
  107 |     await expect(dateInputs).toHaveCount(2)
  108 |   })
  109 | 
  110 |   test('Filtrar por fecha futura da tabla vacía', async ({ page }) => {
  111 |     // Fecha en el futuro → no puede haber logs
  112 |     await page.locator('input.filter-date-input').first().fill('2099-01-01')
  113 |     await expect(page.locator('.empty-row')).toBeVisible({ timeout: 3000 })
  114 |     const countText = await page.locator('.filter-count').textContent()
  115 |     expect(countText?.startsWith('0 de')).toBe(true)
  116 |   })
  117 | 
  118 |   test('Limpiar filtros restaura el contador original', async ({ page }) => {
  119 |     const countBefore = await page.locator('.filter-count').textContent()
  120 | 
  121 |     // Aplicar filtro de fecha futuro
  122 |     await page.locator('input.filter-date-input').first().fill('2099-01-01')
  123 |     await expect(page.locator('.filter-clear-btn')).toBeVisible()
  124 | 
  125 |     // Limpiar
  126 |     await page.click('.filter-clear-btn')
  127 |     await expect(page.locator('.filter-clear-btn')).toHaveCount(0)
  128 | 
  129 |     const countAfter = await page.locator('.filter-count').textContent()
  130 |     expect(countAfter).toBe(countBefore)
```