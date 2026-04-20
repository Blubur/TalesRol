# TalesRol — Tests automatizados con Playwright

Bot que prueba toda la plataforma: login, salas, posts, dados, wiki, perfil, panel admin, y bugs conocidos.

## Instalación (una vez)

```bash
# Copia esta carpeta dentro de tu proyecto TalesRol o en cualquier directorio
cd talesrol-tests
npm install
npx playwright install chromium
```

## Uso

```bash
# Lanzar todos los tests (navegador visible)
npm run test:headed

# Lanzar todos en segundo plano (más rápido)
npm test

# Solo un módulo
npm run test:admin
npm run test:bugs
npm run test:salas

# UI interactiva de Playwright (recomendada para ver qué hace)
npm run test:ui

# Ver el informe HTML tras ejecutar
npm run report
```

## Configuración

Edita `playwright.config.ts` para cambiar la URL base:
```ts
baseURL: process.env.BASE_URL || 'http://localhost:3000',
```

Para apuntar a producción:
```bash
BASE_URL=https://tu-talesrol.vercel.app npm test
```

## Qué prueba cada archivo

| Archivo | Qué cubre |
|---|---|
| `01-auth.spec.ts` | Registro, login, logout, errores de credenciales |
| `02-navegacion.spec.ts` | Portada, normas, ayuda, anuncios, salas, usuarios, navbar |
| `03-salas.spec.ts` | Crear sala, crear tema, publicar post, tirar dado |
| `04-personajes-perfil.spec.ts` | Crear personaje, editar perfil, privacidad, badges, wiki |
| `05-admin.spec.ts` | Todo el panel admin: stats, usuarios, salas, CSS, config |
| `06-bugs-conocidos.spec.ts` | Regresión específica de bugs documentados en el proyecto |

## Notas

- El test de **modo mantenimiento** NO lo activa para no romper el sitio.
- El test de **dice_enabled** lo activa y restaura automáticamente.
- Los tests generan datos de prueba reales en la BD. Bórralos después si quieres.
- Si un selector no funciona, usa `npm run test:debug` para inspeccionar el DOM en vivo.