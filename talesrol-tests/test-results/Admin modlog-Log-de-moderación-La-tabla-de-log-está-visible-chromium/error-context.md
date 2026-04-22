# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Admin modlog.spec.ts >> Log de moderación >> La tabla de log está visible
- Location: tests\Admin modlog.spec.ts:35:7

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
          - generic [ref=e23]:
            - link "Entrar" [ref=e24] [cursor=pointer]:
              - /url: /auth/login
            - link "Registrarse" [ref=e25] [cursor=pointer]:
              - /url: /auth/register
    - generic [ref=e26]:
      - complementary [ref=e27]:
        - button "Colapsar" [ref=e28] [cursor=pointer]:
          - img [ref=e29]
        - button "Salas Activas Ver todas" [expanded] [ref=e32] [cursor=pointer]:
          - img [ref=e34]
          - generic [ref=e36]: Salas Activas
          - link "Ver todas" [ref=e38]:
            - /url: /salas
          - img [ref=e40]
        - button "Accesos Rápidos" [ref=e50] [cursor=pointer]:
          - img [ref=e52]
          - generic [ref=e54]: Accesos Rápidos
          - img [ref=e56]
      - main [ref=e58]:
        - generic [ref=e59]:
          - generic [ref=e60]:
            - generic [ref=e61]:
              - img [ref=e62]
              - generic [ref=e64]:
                - heading "Panel de Administración" [level=1] [ref=e65]
                - paragraph [ref=e66]: Control total del sistema
            - link "← Volver al inicio" [ref=e67] [cursor=pointer]:
              - /url: /
          - generic [ref=e68]:
            - generic [ref=e69]:
              - img [ref=e70]
              - generic [ref=e72]:
                - generic [ref=e73]: "8"
                - generic [ref=e74]: Usuarios
            - generic [ref=e75]:
              - img [ref=e76]
              - generic [ref=e78]:
                - generic [ref=e79]: "7"
                - generic [ref=e80]: Salas
            - generic [ref=e81]:
              - img [ref=e82]
              - generic [ref=e84]:
                - generic [ref=e85]: "77"
                - generic [ref=e86]: Posts
            - generic [ref=e87]:
              - img [ref=e88]
              - generic [ref=e90]:
                - generic [ref=e91]: "3"
                - generic [ref=e92]: Reportes pendientes
          - navigation [ref=e93]:
            - link "Reportes" [ref=e94] [cursor=pointer]:
              - /url: "#reportes"
              - img [ref=e95]
              - text: Reportes
            - link "Usuarios" [ref=e97] [cursor=pointer]:
              - /url: "#usuarios"
              - img [ref=e98]
              - text: Usuarios
            - link "Salas" [ref=e100] [cursor=pointer]:
              - /url: "#salas"
              - img [ref=e101]
              - text: Salas
            - link "Dados" [ref=e103] [cursor=pointer]:
              - /url: "#dados"
              - img [ref=e104]
              - text: Dados
            - link "Etiquetas" [ref=e106] [cursor=pointer]:
              - /url: "#etiquetas"
              - img [ref=e107]
              - text: Etiquetas
            - link "Anuncios" [ref=e110] [cursor=pointer]:
              - /url: "#anuncios"
              - img [ref=e111]
              - text: Anuncios
            - link "Eventos" [ref=e113] [cursor=pointer]:
              - /url: "#eventos"
              - img [ref=e114]
              - text: Eventos
            - link "Actividad" [ref=e116] [cursor=pointer]:
              - /url: "#modlog"
              - img [ref=e117]
              - text: Actividad
            - link "Bloqueados" [ref=e119] [cursor=pointer]:
              - /url: "#bloqueados"
              - img [ref=e120]
              - text: Bloqueados
            - link "CSS" [ref=e122] [cursor=pointer]:
              - /url: /admin/css
              - img [ref=e123]
              - text: CSS
            - link "Configuración" [ref=e125] [cursor=pointer]:
              - /url: /admin/config
              - img [ref=e126]
              - text: Configuración
          - generic [ref=e129]:
            - generic [ref=e130]:
              - img [ref=e131]
              - heading "Reportes 3 pendientes" [level=2] [ref=e133]:
                - text: Reportes
                - generic [ref=e134]: 3 pendientes
            - generic [ref=e135]:
              - generic [ref=e136]:
                - button "Pendiente 3" [ref=e137] [cursor=pointer]:
                  - text: Pendiente
                  - generic [ref=e138]: "3"
                - button "Todos 5" [ref=e139] [cursor=pointer]:
                  - text: Todos
                  - generic [ref=e140]: "5"
                - button "Resuelto 2" [ref=e141] [cursor=pointer]:
                  - text: Resuelto
                  - generic [ref=e142]: "2"
                - button "Descartado 0" [ref=e143] [cursor=pointer]:
                  - text: Descartado
                  - generic [ref=e144]: "0"
              - generic [ref=e145]:
                - generic [ref=e146]:
                  - generic [ref=e147]:
                    - generic [ref=e148]: Pendiente
                    - generic [ref=e149]:
                      - img [ref=e150]
                      - text: Post
                    - generic [ref=e152]: 23 mar 2026
                  - generic [ref=e153]:
                    - generic [ref=e154]:
                      - img [ref=e155]
                      - generic [ref=e157]: "Reportado por:"
                      - link "@aventurera" [ref=e158] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e159]:
                      - img [ref=e160]
                      - generic [ref=e162]: "Post:"
                      - generic [ref=e163]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e164] [cursor=pointer]:
                      - generic [ref=e165]: "Motivo:"
                      - generic [ref=e166]: Bloqueado por director/moderador
                  - generic [ref=e167]:
                    - button "Resolver" [ref=e168] [cursor=pointer]:
                      - img [ref=e169]
                      - text: Resolver
                    - button "Descartar" [ref=e171] [cursor=pointer]:
                      - img [ref=e172]
                      - text: Descartar
                - generic [ref=e174]:
                  - generic [ref=e175]:
                    - generic [ref=e176]: Pendiente
                    - generic [ref=e177]:
                      - img [ref=e178]
                      - text: Post
                    - generic [ref=e180]: 22 mar 2026
                  - generic [ref=e181]:
                    - generic [ref=e182]:
                      - img [ref=e183]
                      - generic [ref=e185]: "Reportado por:"
                      - link "@aventurera" [ref=e186] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e187]:
                      - img [ref=e188]
                      - generic [ref=e190]: "Post:"
                      - generic [ref=e191]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor i…
                    - generic [ref=e192] [cursor=pointer]:
                      - generic [ref=e193]: "Motivo:"
                      - generic [ref=e194]: Bloqueado por director/moderador
                  - generic [ref=e195]:
                    - button "Resolver" [ref=e196] [cursor=pointer]:
                      - img [ref=e197]
                      - text: Resolver
                    - button "Descartar" [ref=e199] [cursor=pointer]:
                      - img [ref=e200]
                      - text: Descartar
                - generic [ref=e202]:
                  - generic [ref=e203]:
                    - generic [ref=e204]: Pendiente
                    - generic [ref=e205]:
                      - img [ref=e206]
                      - text: Usuario
                    - generic [ref=e208]: 10 mar 2026
                  - generic [ref=e209]:
                    - generic [ref=e210]:
                      - img [ref=e211]
                      - generic [ref=e213]: "Reportado por:"
                      - link "@aventurera" [ref=e214] [cursor=pointer]:
                        - /url: /perfil/aventurera
                    - generic [ref=e215]:
                      - img [ref=e216]
                      - generic [ref=e218]: "Usuario reportado:"
                      - link "@Zorra" [ref=e219] [cursor=pointer]:
                        - /url: /perfil/Zorra
                    - generic [ref=e220] [cursor=pointer]:
                      - generic [ref=e221]: "Motivo:"
                      - generic [ref=e222]: Comportamiento inapropiado
                  - generic [ref=e223]:
                    - button "Resolver" [ref=e224] [cursor=pointer]:
                      - img [ref=e225]
                      - text: Resolver
                    - button "Descartar" [ref=e227] [cursor=pointer]:
                      - img [ref=e228]
                      - text: Descartar
                    - button "Avisar usuario" [ref=e231] [cursor=pointer]:
                      - img [ref=e232]
                      - text: Avisar usuario
                    - button "Banear" [ref=e234] [cursor=pointer]:
                      - img [ref=e235]
                      - text: Banear
                    - button "Banear IP" [ref=e237] [cursor=pointer]:
                      - img [ref=e238]
                      - text: Banear IP
          - generic [ref=e240]:
            - generic [ref=e241]:
              - img [ref=e242]
              - heading "Usuarios (8)" [level=2] [ref=e244]:
                - text: Usuarios
                - generic [ref=e245]: (8)
            - generic [ref=e246]:
              - generic [ref=e247]:
                - generic [ref=e248]:
                  - img
                  - textbox "Buscar por nombre, usuario o email..." [ref=e249]
                - button "Colores de rol" [ref=e250] [cursor=pointer]:
                  - img [ref=e251]
                  - text: Colores de rol
              - generic [ref=e253]:
                - generic [ref=e254]:
                  - generic [ref=e255]: Rol
                  - generic [ref=e256]:
                    - button "Todos" [ref=e257] [cursor=pointer]
                    - button "admin" [ref=e258] [cursor=pointer]
                    - button "master" [ref=e259] [cursor=pointer]
                    - button "director" [ref=e260] [cursor=pointer]
                    - button "jugador" [ref=e261] [cursor=pointer]
                    - button "miembro" [ref=e262] [cursor=pointer]
                - generic [ref=e263]:
                  - generic [ref=e264]: Estado
                  - generic [ref=e265]:
                    - button "Todos" [ref=e266] [cursor=pointer]
                    - button "Activos" [ref=e267] [cursor=pointer]
                    - button "Baneados" [ref=e268] [cursor=pointer]
                - generic [ref=e269]:
                  - generic [ref=e270]: Registro
                  - generic [ref=e271]:
                    - textbox [ref=e272] [cursor=pointer]
                    - generic [ref=e273]: —
                    - textbox [ref=e274] [cursor=pointer]
                - generic [ref=e275]: 8 de 8
              - table [ref=e277]:
                - rowgroup [ref=e278]:
                  - row "Usuario Correo Rol Estado Puntos Registrado Acciones" [ref=e279]:
                    - columnheader "Usuario" [ref=e280]:
                      - button "Usuario" [ref=e281] [cursor=pointer]:
                        - text: Usuario
                        - img [ref=e282]
                    - columnheader "Correo" [ref=e284]
                    - columnheader "Rol" [ref=e285]
                    - columnheader "Estado" [ref=e286]
                    - columnheader "Puntos" [ref=e287]:
                      - button "Puntos" [ref=e288] [cursor=pointer]:
                        - text: Puntos
                        - img [ref=e289]
                    - columnheader "Registrado" [ref=e291]:
                      - button "Registrado" [ref=e292] [cursor=pointer]:
                        - text: Registrado
                        - img [ref=e293]
                    - columnheader "Acciones" [ref=e295]
                - rowgroup [ref=e296]:
                  - row "testbot1776807228952 testbot1776807228952 @testbot1776807228952 testbot_1776807228952@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e297]:
                    - cell "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e298]:
                      - link "testbot1776807228952 testbot1776807228952 @testbot1776807228952" [ref=e299] [cursor=pointer]:
                        - /url: /perfil/testbot1776807228952
                        - img "testbot1776807228952" [ref=e300]
                        - generic [ref=e301]:
                          - generic [ref=e302]: testbot1776807228952
                          - generic [ref=e303]: "@testbot1776807228952"
                    - cell "testbot_1776807228952@mailinator.com" [ref=e304]
                    - cell "admin" [ref=e305]:
                      - combobox [ref=e307] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e308]
                    - cell "0" [ref=e309]
                    - cell "21 abr 26" [ref=e310]
                    - cell "Banear" [ref=e311]:
                      - button "Banear" [ref=e313] [cursor=pointer]:
                        - img [ref=e314]
                        - text: Banear
                  - row "testbot1776806837639 testbot1776806837639 @testbot1776806837639 testbot_1776806837639@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e316]:
                    - cell "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e317]:
                      - link "testbot1776806837639 testbot1776806837639 @testbot1776806837639" [ref=e318] [cursor=pointer]:
                        - /url: /perfil/testbot1776806837639
                        - img "testbot1776806837639" [ref=e319]
                        - generic [ref=e320]:
                          - generic [ref=e321]: testbot1776806837639
                          - generic [ref=e322]: "@testbot1776806837639"
                    - cell "testbot_1776806837639@mailinator.com" [ref=e323]
                    - cell "admin" [ref=e324]:
                      - combobox [ref=e326] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e327]
                    - cell "0" [ref=e328]
                    - cell "21 abr 26" [ref=e329]
                    - cell "Banear" [ref=e330]:
                      - button "Banear" [ref=e332] [cursor=pointer]:
                        - img [ref=e333]
                        - text: Banear
                  - row "testbot1776797825837 testbot1776797825837 @testbot1776797825837 testbot_1776797825837@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e335]:
                    - cell "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e336]:
                      - link "testbot1776797825837 testbot1776797825837 @testbot1776797825837" [ref=e337] [cursor=pointer]:
                        - /url: /perfil/testbot1776797825837
                        - img "testbot1776797825837" [ref=e338]
                        - generic [ref=e339]:
                          - generic [ref=e340]: testbot1776797825837
                          - generic [ref=e341]: "@testbot1776797825837"
                    - cell "testbot_1776797825837@mailinator.com" [ref=e342]
                    - cell "admin" [ref=e343]:
                      - combobox [ref=e345] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e346]
                    - cell "0" [ref=e347]
                    - cell "21 abr 26" [ref=e348]
                    - cell "Banear" [ref=e349]:
                      - button "Banear" [ref=e351] [cursor=pointer]:
                        - img [ref=e352]
                        - text: Banear
                  - row "testbot1776797707071 testbot1776797707071 @testbot1776797707071 testbot_1776797707071@mailinator.com admin Activo 0 21 abr 26 Banear" [ref=e354]:
                    - cell "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e355]:
                      - link "testbot1776797707071 testbot1776797707071 @testbot1776797707071" [ref=e356] [cursor=pointer]:
                        - /url: /perfil/testbot1776797707071
                        - img "testbot1776797707071" [ref=e357]
                        - generic [ref=e358]:
                          - generic [ref=e359]: testbot1776797707071
                          - generic [ref=e360]: "@testbot1776797707071"
                    - cell "testbot_1776797707071@mailinator.com" [ref=e361]
                    - cell "admin" [ref=e362]:
                      - combobox [ref=e364] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e365]
                    - cell "0" [ref=e366]
                    - cell "21 abr 26" [ref=e367]
                    - cell "Banear" [ref=e368]:
                      - button "Banear" [ref=e370] [cursor=pointer]:
                        - img [ref=e371]
                        - text: Banear
                  - row "Puck Puck @Puck loregalafate@gmail.com admin Activo 0 16 mar 26 Banear" [ref=e373]:
                    - cell "Puck Puck @Puck" [ref=e374]:
                      - link "Puck Puck @Puck" [ref=e375] [cursor=pointer]:
                        - /url: /perfil/Puck
                        - img "Puck" [ref=e376]
                        - generic [ref=e377]:
                          - generic [ref=e378]: Puck
                          - generic [ref=e379]: "@Puck"
                    - cell "loregalafate@gmail.com" [ref=e380]
                    - cell "admin" [ref=e381]:
                      - combobox [ref=e383] [cursor=pointer]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e384]
                    - cell "0" [ref=e385]
                    - cell "16 mar 26" [ref=e386]
                    - cell "Banear" [ref=e387]:
                      - button "Banear" [ref=e389] [cursor=pointer]:
                        - img [ref=e390]
                        - text: Banear
                  - row "Blu Aventurera Rosa @Blu pililahiguera@gmail.com master Activo 0 16 mar 26 Banear" [ref=e392]:
                    - cell "Blu Aventurera Rosa @Blu" [ref=e393]:
                      - link "Blu Aventurera Rosa @Blu" [ref=e394] [cursor=pointer]:
                        - /url: /perfil/Blu
                        - img "Blu" [ref=e395]
                        - generic [ref=e396]:
                          - generic [ref=e397]: Aventurera Rosa
                          - generic [ref=e398]: "@Blu"
                    - cell "pililahiguera@gmail.com" [ref=e399]
                    - cell "master" [ref=e400]:
                      - combobox [ref=e402] [cursor=pointer]:
                        - option "admin"
                        - option "master" [selected]
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e403]
                    - cell "0" [ref=e404]
                    - cell "16 mar 26" [ref=e405]
                    - cell "Banear" [ref=e406]:
                      - button "Banear" [ref=e408] [cursor=pointer]:
                        - img [ref=e409]
                        - text: Banear
                  - row "Zorra Zorra @Zorra test@fatrol.com jugador Activo 70 8 mar 26 Banear" [ref=e411]:
                    - cell "Zorra Zorra @Zorra" [ref=e412]:
                      - link "Zorra Zorra @Zorra" [ref=e413] [cursor=pointer]:
                        - /url: /perfil/Zorra
                        - img "Zorra" [ref=e414]
                        - generic [ref=e415]:
                          - generic [ref=e416]: Zorra
                          - generic [ref=e417]: "@Zorra"
                    - cell "test@fatrol.com" [ref=e418]
                    - cell "jugador" [ref=e419]:
                      - combobox [ref=e421] [cursor=pointer]:
                        - option "admin"
                        - option "master"
                        - option "director"
                        - option "jugador" [selected]
                        - option "miembro"
                    - cell "Activo" [ref=e422]
                    - cell "70" [ref=e423]
                    - cell "8 mar 26" [ref=e424]
                    - cell "Banear" [ref=e425]:
                      - button "Banear" [ref=e427] [cursor=pointer]:
                        - img [ref=e428]
                        - text: Banear
                  - row "aventurera aventurera @aventurera veinticuatro0792@gmail.com admin Activo 85 7 mar 26 Tú" [ref=e430]:
                    - cell "aventurera aventurera @aventurera" [ref=e431]:
                      - link "aventurera aventurera @aventurera" [ref=e432] [cursor=pointer]:
                        - /url: /perfil/aventurera
                        - img "aventurera" [ref=e433]
                        - generic [ref=e434]:
                          - generic [ref=e435]: aventurera
                          - generic [ref=e436]: "@aventurera"
                    - cell "veinticuatro0792@gmail.com" [ref=e437]
                    - cell "admin" [ref=e438]:
                      - combobox [disabled] [ref=e440]:
                        - option "admin" [selected]
                        - option "master"
                        - option "director"
                        - option "jugador"
                        - option "miembro"
                    - cell "Activo" [ref=e441]
                    - cell "85" [ref=e442]
                    - cell "7 mar 26" [ref=e443]
                    - cell "Tú" [ref=e444]
          - generic [ref=e445]:
            - generic [ref=e446]:
              - img [ref=e447]
              - heading "Salas (7)" [level=2] [ref=e449]:
                - text: Salas
                - generic [ref=e450]: (7)
            - generic [ref=e451]:
              - textbox "Buscar por título o creador..." [ref=e453]
              - generic [ref=e454]:
                - generic [ref=e455]:
                  - generic [ref=e456]: Estado
                  - generic [ref=e457]:
                    - button "Todos" [ref=e458] [cursor=pointer]
                    - button "Próximamente" [ref=e459] [cursor=pointer]
                    - button "Activa" [ref=e460] [cursor=pointer]
                    - button "En pausa" [ref=e461] [cursor=pointer]
                    - button "Finalizada" [ref=e462] [cursor=pointer]
                    - button "Cerrada" [ref=e463] [cursor=pointer]
                    - button "Archivada" [ref=e464] [cursor=pointer]
                - generic [ref=e465]:
                  - generic [ref=e466]: Creación
                  - generic [ref=e467]:
                    - textbox [ref=e468] [cursor=pointer]
                    - generic [ref=e469]: —
                    - textbox [ref=e470] [cursor=pointer]
                - generic [ref=e471]: 7 de 7
              - generic [ref=e472]:
                - generic [ref=e474]:
                  - button [ref=e475] [cursor=pointer]:
                    - img [ref=e476]
                  - img "Cenizas blancas" [ref=e479]
                  - generic [ref=e480]:
                    - generic [ref=e482]: Cenizas blancas
                    - generic [ref=e483]: aventurera
                  - generic [ref=e484]:
                    - generic [ref=e485]: Fantasia angelical
                    - generic [ref=e486]: "TW: vais a llorar"
                  - combobox [ref=e487] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e488]: 5 abr 26
                  - generic [ref=e489]:
                    - link "Miembros" [ref=e490] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas/miembros
                      - img [ref=e491]
                      - text: Miembros
                    - link "Ver" [ref=e493] [cursor=pointer]:
                      - /url: /salas/cenizas-blancas
                      - img [ref=e494]
                      - text: Ver
                    - button "Eliminar" [ref=e496] [cursor=pointer]:
                      - img [ref=e497]
                      - text: Eliminar
                - generic [ref=e500]:
                  - button [ref=e501] [cursor=pointer]:
                    - img [ref=e502]
                  - img "Perihelio tardío" [ref=e505]
                  - generic [ref=e506]:
                    - generic [ref=e508]: Perihelio tardío
                    - generic [ref=e509]: aventurera
                  - generic [ref=e511]: sci fi
                  - combobox [ref=e512] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e513]: 22 mar 26
                  - generic [ref=e514]:
                    - link "Miembros" [ref=e515] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio/miembros
                      - img [ref=e516]
                      - text: Miembros
                    - link "Ver" [ref=e518] [cursor=pointer]:
                      - /url: /salas/perihelio-tardio
                      - img [ref=e519]
                      - text: Ver
                    - button "Eliminar" [ref=e521] [cursor=pointer]:
                      - img [ref=e522]
                      - text: Eliminar
                - generic [ref=e525]:
                  - button [ref=e526] [cursor=pointer]:
                    - img [ref=e527]
                  - img "A la media noche pasó" [ref=e530]
                  - generic [ref=e531]:
                    - generic [ref=e533]: A la media noche pasó
                    - generic [ref=e534]: aventurera
                  - generic [ref=e535]:
                    - generic [ref=e536]: solo noche
                    - generic [ref=e537]: algodones
                  - combobox [ref=e538] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e539]: 18 mar 26
                  - generic [ref=e540]:
                    - link "Miembros" [ref=e541] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso/miembros
                      - img [ref=e542]
                      - text: Miembros
                    - link "Ver" [ref=e544] [cursor=pointer]:
                      - /url: /salas/a-la-media-noche-paso
                      - img [ref=e545]
                      - text: Ver
                    - button "Eliminar" [ref=e547] [cursor=pointer]:
                      - img [ref=e548]
                      - text: Eliminar
                - generic [ref=e551]:
                  - button [ref=e552] [cursor=pointer]:
                    - img [ref=e553]
                  - img "Josepa y Camila se van a Benidorm" [ref=e556]
                  - generic [ref=e557]:
                    - generic [ref=e559]: Josepa y Camila se van a Benidorm
                    - generic [ref=e560]: Puck
                  - generic [ref=e562]: "TW: Josepa en bañador"
                  - combobox [ref=e563] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa" [selected]
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e564]: 16 mar 26
                  - generic [ref=e565]:
                    - link "Miembros" [ref=e566] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm/miembros
                      - img [ref=e567]
                      - text: Miembros
                    - link "Ver" [ref=e569] [cursor=pointer]:
                      - /url: /salas/josepa-y-camila-se-van-a-benidorm
                      - img [ref=e570]
                      - text: Ver
                    - button "Eliminar" [ref=e572] [cursor=pointer]:
                      - img [ref=e573]
                      - text: Eliminar
                - generic [ref=e576]:
                  - button [ref=e577] [cursor=pointer]:
                    - img [ref=e578]
                  - img "La casa del cura" [ref=e581]
                  - generic [ref=e582]:
                    - generic [ref=e584]: La casa del cura
                    - generic [ref=e585]: aventurera
                  - generic [ref=e586]:
                    - generic [ref=e587]: fantasía
                    - generic [ref=e588]: arañas
                    - generic [ref=e589]: religión
                  - combobox [ref=e590] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa" [selected]
                    - option "Finalizada"
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e591]: 16 mar 26
                  - generic [ref=e592]:
                    - link "Miembros" [ref=e593] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura/miembros
                      - img [ref=e594]
                      - text: Miembros
                    - link "Ver" [ref=e596] [cursor=pointer]:
                      - /url: /salas/la-casa-del-cura
                      - img [ref=e597]
                      - text: Ver
                    - button "Eliminar" [ref=e599] [cursor=pointer]:
                      - img [ref=e600]
                      - text: Eliminar
                - generic [ref=e603]:
                  - button [ref=e604] [cursor=pointer]:
                    - img [ref=e605]
                  - img "Viento y fuego" [ref=e608]
                  - generic [ref=e609]:
                    - generic [ref=e611]: Viento y fuego
                    - generic [ref=e612]: aventurera
                  - generic [ref=e613]:
                    - generic [ref=e614]: Violencia
                    - generic [ref=e615]: Misterio
                  - combobox [ref=e616] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada" [selected]
                    - option "Cerrada"
                    - option "Archivada"
                  - generic [ref=e617]: 9 mar 26
                  - generic [ref=e618]:
                    - link "Miembros" [ref=e619] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego/miembros
                      - img [ref=e620]
                      - text: Miembros
                    - link "Ver" [ref=e622] [cursor=pointer]:
                      - /url: /salas/viento-y-fuego
                      - img [ref=e623]
                      - text: Ver
                    - button "Eliminar" [ref=e625] [cursor=pointer]:
                      - img [ref=e626]
                      - text: Eliminar
                - generic [ref=e629]:
                  - button [ref=e630] [cursor=pointer]:
                    - img [ref=e631]
                  - img "Castillos del agua" [ref=e634]
                  - generic [ref=e635]:
                    - generic [ref=e637]: Castillos del agua
                    - generic [ref=e638]: aventurera
                  - generic [ref=e640]: Fantasía
                  - combobox [ref=e641] [cursor=pointer]:
                    - option "Próximamente"
                    - option "Activa"
                    - option "En pausa"
                    - option "Finalizada"
                    - option "Cerrada" [selected]
                    - option "Archivada"
                  - generic [ref=e642]: 7 mar 26
                  - generic [ref=e643]:
                    - link "Miembros" [ref=e644] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua/miembros
                      - img [ref=e645]
                      - text: Miembros
                    - link "Ver" [ref=e647] [cursor=pointer]:
                      - /url: /salas/castillos-del-agua
                      - img [ref=e648]
                      - text: Ver
                    - button "Eliminar" [ref=e650] [cursor=pointer]:
                      - img [ref=e651]
                      - text: Eliminar
          - generic [ref=e653]:
            - generic [ref=e654]:
              - img [ref=e655]
              - heading "Tipos de Dado (8)" [level=2] [ref=e657]:
                - text: Tipos de Dado
                - generic [ref=e658]: (8)
            - generic [ref=e660]:
              - generic [ref=e661]:
                - generic [ref=e662]: d2
                - generic [ref=e663]:
                  - generic [ref=e664]: 2 caras
                  - generic [ref=e665]: cara o cruz
                - generic [ref=e666]:
                  - button [ref=e667] [cursor=pointer]:
                    - img [ref=e668]
                  - button [ref=e670] [cursor=pointer]:
                    - img [ref=e671]
              - generic [ref=e673]:
                - generic [ref=e674]: d4
                - generic [ref=e675]:
                  - generic [ref=e676]: 4 caras
                  - generic [ref=e677]: Dado de 4 caras
                - generic [ref=e678]:
                  - button [ref=e679] [cursor=pointer]:
                    - img [ref=e680]
                  - button [ref=e682] [cursor=pointer]:
                    - img [ref=e683]
              - generic [ref=e685]:
                - generic [ref=e686]: d6
                - generic [ref=e687]:
                  - generic [ref=e688]: 6 caras
                  - generic [ref=e689]: Dado de 6 caras
                - generic [ref=e690]:
                  - button [ref=e691] [cursor=pointer]:
                    - img [ref=e692]
                  - button [ref=e694] [cursor=pointer]:
                    - img [ref=e695]
              - generic [ref=e697]:
                - generic [ref=e698]: d8
                - generic [ref=e699]:
                  - generic [ref=e700]: 8 caras
                  - generic [ref=e701]: Dado de 8 caras
                - generic [ref=e702]:
                  - button [ref=e703] [cursor=pointer]:
                    - img [ref=e704]
                  - button [ref=e706] [cursor=pointer]:
                    - img [ref=e707]
              - generic [ref=e709]:
                - generic [ref=e710]: d10
                - generic [ref=e711]:
                  - generic [ref=e712]: 10 caras
                  - generic [ref=e713]: Dado de 10 caras
                - generic [ref=e714]:
                  - button [ref=e715] [cursor=pointer]:
                    - img [ref=e716]
                  - button [ref=e718] [cursor=pointer]:
                    - img [ref=e719]
              - generic [ref=e721]:
                - generic [ref=e722]: d12
                - generic [ref=e723]:
                  - generic [ref=e724]: 12 caras
                  - generic [ref=e725]: Dado de 12 caras
                - generic [ref=e726]:
                  - button [ref=e727] [cursor=pointer]:
                    - img [ref=e728]
                  - button [ref=e730] [cursor=pointer]:
                    - img [ref=e731]
              - generic [ref=e733]:
                - generic [ref=e734]: d20
                - generic [ref=e735]:
                  - generic [ref=e736]: 20 caras
                  - generic [ref=e737]: Dado de 20 caras
                - generic [ref=e738]:
                  - button [ref=e739] [cursor=pointer]:
                    - img [ref=e740]
                  - button [ref=e742] [cursor=pointer]:
                    - img [ref=e743]
              - generic [ref=e745]:
                - generic [ref=e746]: d100
                - generic [ref=e747]:
                  - generic [ref=e748]: 100 caras
                  - generic [ref=e749]: Dado percentil
                - generic [ref=e750]:
                  - button [ref=e751] [cursor=pointer]:
                    - img [ref=e752]
                  - button [ref=e754] [cursor=pointer]:
                    - img [ref=e755]
              - button "Nuevo dado" [ref=e757] [cursor=pointer]:
                - img [ref=e758]
                - text: Nuevo dado
          - generic [ref=e760]:
            - generic [ref=e761]:
              - img [ref=e762]
              - heading "Etiquetas (2)" [level=2] [ref=e765]:
                - text: Etiquetas
                - generic [ref=e766]: (2)
            - generic [ref=e768]:
              - generic [ref=e769]:
                - generic [ref=e770]: Fantasía
                - generic [ref=e772]: "#34d399"
                - generic [ref=e773]:
                  - button [ref=e774] [cursor=pointer]:
                    - img [ref=e775]
                  - button [ref=e777] [cursor=pointer]:
                    - img [ref=e778]
              - generic [ref=e780]:
                - generic [ref=e781]: Misterio
                - generic [ref=e783]: "#fbbf24"
                - generic [ref=e784]:
                  - button [ref=e785] [cursor=pointer]:
                    - img [ref=e786]
                  - button [ref=e788] [cursor=pointer]:
                    - img [ref=e789]
              - button "Nueva etiqueta" [ref=e791] [cursor=pointer]:
                - img [ref=e792]
                - text: Nueva etiqueta
          - generic [ref=e794]:
            - generic [ref=e795]:
              - img [ref=e796]
              - heading "Anuncios (5)" [level=2] [ref=e798]:
                - text: Anuncios
                - generic [ref=e799]: (5)
            - generic [ref=e800]:
              - button "Nuevo anuncio" [ref=e801] [cursor=pointer]:
                - img [ref=e802]
                - text: Nuevo anuncio
              - generic [ref=e804]:
                - generic [ref=e805]:
                  - generic [ref=e806]:
                    - heading "lololo" [level=3] [ref=e808]
                    - generic [ref=e809]: 21 mar 2026
                  - paragraph [ref=e811]: This paragraph has a border.
                  - generic [ref=e812]: Por aventurera
                  - generic [ref=e813]:
                    - button "Fijar" [ref=e814] [cursor=pointer]:
                      - img [ref=e815]
                      - text: Fijar
                    - button "Editar" [ref=e818] [cursor=pointer]:
                      - img [ref=e819]
                      - text: Editar
                    - button "Eliminar" [ref=e821] [cursor=pointer]:
                      - img [ref=e822]
                      - text: Eliminar
                - generic [ref=e824]:
                  - generic [ref=e825]:
                    - heading "Lalalala" [level=3] [ref=e827]
                    - generic [ref=e828]: 21 mar 2026
                  - paragraph [ref=e830]: This paragraph has a border.
                  - generic [ref=e831]: Por aventurera
                  - generic [ref=e832]:
                    - button "Fijar" [ref=e833] [cursor=pointer]:
                      - img [ref=e834]
                      - text: Fijar
                    - button "Editar" [ref=e837] [cursor=pointer]:
                      - img [ref=e838]
                      - text: Editar
                    - button "Eliminar" [ref=e840] [cursor=pointer]:
                      - img [ref=e841]
                      - text: Eliminar
                - generic [ref=e843]:
                  - generic [ref=e844]:
                    - heading "Pureba de html 2" [level=3] [ref=e846]
                    - generic [ref=e847]: 21 mar 2026
                  - paragraph [ref=e849]: This paragraph has a border.
                  - generic [ref=e850]: Por aventurera
                  - generic [ref=e851]:
                    - button "Fijar" [ref=e852] [cursor=pointer]:
                      - img [ref=e853]
                      - text: Fijar
                    - button "Editar" [ref=e856] [cursor=pointer]:
                      - img [ref=e857]
                      - text: Editar
                    - button "Eliminar" [ref=e859] [cursor=pointer]:
                      - img [ref=e860]
                      - text: Eliminar
                - generic [ref=e862]:
                  - generic [ref=e863]:
                    - heading "Prueba de html" [level=3] [ref=e865]
                    - generic [ref=e866]: 21 mar 2026
                  - generic [ref=e867]:
                    - generic [ref=e868]: tengo un camisón guardado
                    - text: en el armario.
                    - paragraph
                    - heading "puedo con titulos?" [level=1] [ref=e869]
                    - paragraph [ref=e870]: Ahora lo averiguaremos. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e871]: Por aventurera
                  - generic [ref=e872]:
                    - button "Fijar" [ref=e873] [cursor=pointer]:
                      - img [ref=e874]
                      - text: Fijar
                    - button "Editar" [ref=e877] [cursor=pointer]:
                      - img [ref=e878]
                      - text: Editar
                    - button "Eliminar" [ref=e880] [cursor=pointer]:
                      - img [ref=e881]
                      - text: Eliminar
                - generic [ref=e883]:
                  - generic [ref=e884]:
                    - generic [ref=e885]:
                      - img [ref=e886]
                      - heading "Empieza en" [level=3] [ref=e889]
                    - generic [ref=e890]: 9 mar 2026
                  - generic [ref=e891]: Noviembre. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  - generic [ref=e892]: Por aventurera
                  - generic [ref=e893]:
                    - button "Desfijar" [ref=e894] [cursor=pointer]:
                      - img [ref=e895]
                      - text: Desfijar
                    - button "Editar" [ref=e898] [cursor=pointer]:
                      - img [ref=e899]
                      - text: Editar
                    - button "Eliminar" [ref=e901] [cursor=pointer]:
                      - img [ref=e902]
                      - text: Eliminar
          - generic [ref=e904]:
            - generic [ref=e905]:
              - img [ref=e906]
              - heading "Eventos (0)" [level=2] [ref=e908]:
                - text: Eventos
                - generic [ref=e909]: (0)
            - generic [ref=e910]:
              - button "+ Nuevo evento" [ref=e912] [cursor=pointer]
              - table [ref=e914]:
                - rowgroup [ref=e915]:
                  - row "Título Tipo Estado Sala Inicio Acciones" [ref=e916]:
                    - columnheader "Título" [ref=e917]
                    - columnheader "Tipo" [ref=e918]
                    - columnheader "Estado" [ref=e919]
                    - columnheader "Sala" [ref=e920]
                    - columnheader "Inicio" [ref=e921]
                    - columnheader "Acciones" [ref=e922]
                - rowgroup [ref=e923]:
                  - row "No hay eventos todavía" [ref=e924]:
                    - cell "No hay eventos todavía" [ref=e925]
          - generic [ref=e926]:
            - generic [ref=e927]:
              - img [ref=e928]
              - heading "Posts Bloqueados (1)" [level=2] [ref=e930]:
                - text: Posts Bloqueados
                - generic [ref=e931]: (1)
            - generic [ref=e934]:
              - generic [ref=e935]:
                - generic [ref=e936]:
                  - link "A la media noche pasó" [ref=e937] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso
                  - generic [ref=e938]: ›
                  - link "A las 12" [ref=e939] [cursor=pointer]:
                    - /url: /salas/a-la-media-noche-paso/8e673c4b-0849-4a4f-95e3-c6e0f026e408
                - generic [ref=e940]: Bloqueado 23 mar 2026
              - paragraph [ref=e941]: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              - generic [ref=e942]:
                - generic [ref=e943]:
                  - generic [ref=e944]:
                    - text: "Autor:"
                    - link "aventurera" [ref=e945] [cursor=pointer]:
                      - /url: /perfil/aventurera
                  - generic [ref=e946]:
                    - text: "Bloqueado por:"
                    - link "aventurera" [ref=e947] [cursor=pointer]:
                      - /url: /perfil/aventurera
                - button "Desbloquear" [ref=e948] [cursor=pointer]:
                  - img [ref=e949]
                  - text: Desbloquear
          - generic [ref=e951]:
            - generic [ref=e952]:
              - img [ref=e953]
              - heading "Log de Moderación (6)" [level=2] [ref=e955]:
                - text: Log de Moderación
                - generic [ref=e956]: (6)
            - generic [ref=e957]:
              - generic [ref=e958]:
                - generic [ref=e959]:
                  - generic [ref=e960]: Acción
                  - generic [ref=e961]:
                    - button "Todas" [ref=e962] [cursor=pointer]
                    - button "Cambio de rol" [ref=e963] [cursor=pointer]
                    - button "Desbaneo" [ref=e964] [cursor=pointer]
                    - button "Baneo" [ref=e965] [cursor=pointer]
                - generic [ref=e966]:
                  - generic [ref=e967]: Tipo
                  - generic [ref=e968]:
                    - button "Todos" [ref=e969] [cursor=pointer]
                    - button "Usuario" [ref=e970] [cursor=pointer]
                    - button "Sala" [ref=e971] [cursor=pointer]
                    - button "Post" [ref=e972] [cursor=pointer]
                    - button "IP" [ref=e973] [cursor=pointer]
                    - button "Sistema" [ref=e974] [cursor=pointer]
                - generic [ref=e975]:
                  - generic [ref=e976]: Fecha
                  - generic [ref=e977]:
                    - textbox [ref=e978] [cursor=pointer]
                    - generic [ref=e979]: —
                    - textbox [ref=e980] [cursor=pointer]
                - generic [ref=e981]: 6 de 6
              - table [ref=e983]:
                - rowgroup [ref=e984]:
                  - row "Acción Tipo Objetivo Notas Admin Fecha" [ref=e985]:
                    - columnheader "Acción" [ref=e986]:
                      - button "Acción" [ref=e987] [cursor=pointer]:
                        - text: Acción
                        - img [ref=e988]
                    - columnheader "Tipo" [ref=e990]:
                      - button "Tipo" [ref=e991] [cursor=pointer]:
                        - text: Tipo
                        - img [ref=e992]
                    - columnheader "Objetivo" [ref=e994]
                    - columnheader "Notas" [ref=e995]
                    - columnheader "Admin" [ref=e996]
                    - columnheader "Fecha" [ref=e997]:
                      - button "Fecha" [ref=e998] [cursor=pointer]:
                        - text: Fecha
                        - img [ref=e999]
                - rowgroup [ref=e1001]:
                  - 'row "Cambio de rol Usuario Blu Nuevo rol: master aventurera 18 mar 26, 12:33" [ref=e1002]':
                    - cell "Cambio de rol" [ref=e1003]
                    - cell "Usuario" [ref=e1004]
                    - cell "Blu" [ref=e1005]
                    - 'cell "Nuevo rol: master" [ref=e1006]'
                    - cell "aventurera" [ref=e1007]:
                      - generic [ref=e1009]: aventurera
                    - cell "18 mar 26, 12:33" [ref=e1010]
                  - 'row "Cambio de rol Usuario Blu Nuevo rol: jugador aventurera 18 mar 26, 12:32" [ref=e1011]':
                    - cell "Cambio de rol" [ref=e1012]
                    - cell "Usuario" [ref=e1013]
                    - cell "Blu" [ref=e1014]
                    - 'cell "Nuevo rol: jugador" [ref=e1015]'
                    - cell "aventurera" [ref=e1016]:
                      - generic [ref=e1018]: aventurera
                    - cell "18 mar 26, 12:32" [ref=e1019]
                  - 'row "Cambio de rol Usuario Blu Nuevo rol: master aventurera 17 mar 26, 16:00" [ref=e1020]':
                    - cell "Cambio de rol" [ref=e1021]
                    - cell "Usuario" [ref=e1022]
                    - cell "Blu" [ref=e1023]
                    - 'cell "Nuevo rol: master" [ref=e1024]'
                    - cell "aventurera" [ref=e1025]:
                      - generic [ref=e1027]: aventurera
                    - cell "17 mar 26, 16:00" [ref=e1028]
                  - 'row "Cambio de rol Usuario Blu Nuevo rol: miembro aventurera 17 mar 26, 15:59" [ref=e1029]':
                    - cell "Cambio de rol" [ref=e1030]
                    - cell "Usuario" [ref=e1031]
                    - cell "Blu" [ref=e1032]
                    - 'cell "Nuevo rol: miembro" [ref=e1033]'
                    - cell "aventurera" [ref=e1034]:
                      - generic [ref=e1036]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1037]
                  - row "Desbaneo Usuario Zorra — aventurera 17 mar 26, 15:59" [ref=e1038]:
                    - cell "Desbaneo" [ref=e1039]
                    - cell "Usuario" [ref=e1040]
                    - cell "Zorra" [ref=e1041]
                    - cell "—" [ref=e1042]
                    - cell "aventurera" [ref=e1043]:
                      - generic [ref=e1045]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1046]
                  - row "Baneo Usuario Zorra — aventurera 17 mar 26, 15:59" [ref=e1047]:
                    - cell "Baneo" [ref=e1048]
                    - cell "Usuario" [ref=e1049]
                    - cell "Zorra" [ref=e1050]
                    - cell "—" [ref=e1051]
                    - cell "aventurera" [ref=e1052]:
                      - generic [ref=e1054]: aventurera
                    - cell "17 mar 26, 15:59" [ref=e1055]
    - contentinfo [ref=e1056]:
      - generic [ref=e1057]:
        - generic [ref=e1058]:
          - generic [ref=e1059]:
            - generic [ref=e1060]: ✦
            - text: TalesRol
          - generic [ref=e1061]: © 2026 — Plataforma de Roleplay en español
        - generic [ref=e1062]:
          - link "Normas" [ref=e1063] [cursor=pointer]:
            - /url: /normas
          - link "Privacidad" [ref=e1064] [cursor=pointer]:
            - /url: /privacidad
          - link "Contacto" [ref=e1065] [cursor=pointer]:
            - /url: /contacto
  - alert [ref=e1066]
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