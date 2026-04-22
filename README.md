# TalesRol — Guía de Instalación desde Cero

## Stack
- **Next.js 15** (App Router + Server Actions)
- **Supabase** (Auth + PostgreSQL + RLS + Realtime)
- **TypeScript**
- **Tailwind CSS**
- **React Quill** (editor de texto enriquecido)
- **DOMPurify** (sanitización HTML anti-XSS)

---
## Características

- Autenticación completa (registro, login, sesiones)
- Sistema de roles (admin, director, master, player, guest)
- Base de datos con Supabase (PostgreSQL + RLS)
- Server Actions con Next.js 15
- Editor enriquecido (React Quill)
- Sanitización HTML (DOMPurify)
- Interfaz con Tailwind CSS
- Preparado para funcionalidades en tiempo real


## PASO 1 — Crear proyecto Next.js

```bash
# En tu terminal, dentro de Desktop o donde quieras el proyecto:
npx create-next-app@latest talesrol --typescript --tailwind --app --no-src-dir --no-import-alias
cd talesrol
```

> ⚠️ Cuando te pregunte "Would you like to use src/ directory?" responde **No** si usaste el comando anterior, o **Sí** para mantener la estructura de estos archivos (recomendado).

**Recomendado: con src/**
```bash
npx create-next-app@latest talesrol --typescript --tailwind --app --src-dir --no-import-alias
```

---

## PASO 2 — Instalar dependencias

```bash
cd talesrol
npm install @supabase/supabase-js @supabase/ssr react-quill isomorphic-dompurify lucide-react clsx tailwind-merge
npm install -D @types/dompurify
```

---

## PASO 3 — Crear proyecto en Supabase

1. Ve a **https://supabase.com** y crea una cuenta gratuita
2. Crea un **New Project**
   - Nombre: `talesrol`
   - Contraseña DB: guárdala en un lugar seguro
   - Región: elige la más cercana a España (West EU - Ireland)
3. Espera ~2 minutos a que termine de provisionar

---

## PASO 4 — Configurar el esquema SQL

1. En tu proyecto Supabase, ve a **SQL Editor** (menú izquierdo)
2. Crea un **New snippet**
3. Copia todo el contenido del archivo `supabase_schema.sql`
4. Pega y haz clic en **RUN**
5. Verás las tablas creadas en **Table Editor**

---

## PASO 5 — Obtener credenciales de Supabase

1. Ve a **Project Settings** → **API**
2. Copia:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon / public key**: la clave larga que empieza con `eyJ...`

---

## PASO 6 — Configurar variables de entorno

En la raíz de tu proyecto crea el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ **Nunca** subas `.env.local` a GitHub. Ya está en `.gitignore` por defecto.

---

## PASO 7 — Copiar los archivos del proyecto

Copia los archivos de esta carpeta a tu proyecto manteniendo la estructura:

```
talesrol/
├── src/
│   ├── app/
│   │   ├── globals.css          ← reemplaza el existente
│   │   ├── layout.tsx           ← reemplaza el existente
│   │   ├── page.tsx             ← reemplaza el existente
│   │   └── auth/
│   │       ├── actions.ts
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── register/
│   │           └── page.tsx
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   ├── middleware.ts
│   └── types/
│       └── database.ts
├── next.config.js               ← reemplaza el existente
├── tailwind.config.js           ← reemplaza el existente
└── .env.example                 → renombrar a .env.local y rellenar
```

---

## PASO 8 — Configurar Supabase Auth

1. En Supabase Dashboard → **Authentication** → **URL Configuration**
2. Pon en **Site URL**: `http://localhost:3000`
3. En **Redirect URLs** añade: `http://localhost:3000/**`

---

## PASO 9 — Arrancar el servidor

```bash
npm run dev
```

Abre **http://localhost:3000** en tu navegador.

- `/` → Página principal
- `/auth/login` → Login
- `/auth/register` → Registro

---

## PASO 10 — Verificar que funciona

1. Ve a `/auth/register` y crea una cuenta
2. Revisa en Supabase → **Authentication** → **Users** que aparece el usuario
3. Revisa en **Table Editor** → **profiles** que se creó el perfil automáticamente (gracias al trigger)
4. Inicia sesión y verifica que te redirige al inicio con tu nombre

---

## Siguientes módulos (en construcción)

| Módulo | Estado |
|--------|--------|
| ✅ Autenticación (login/registro/logout) | **Listo** |
| ✅ Esquema SQL completo | **Listo** |
| 🔜 Navbar + Layout principal | Próximo |
| 🔜 Feed principal (salas activas + anuncios) | Próximo |
| 🔜 Salas de rol | Próximo |
| 🔜 Temas y posts con editor Quill | Próximo |
| 🔜 Perfil de usuario | Próximo |
| 🔜 Personajes | Próximo |
| 🔜 Mensajes privados | Próximo |
| 🔜 Notificaciones en tiempo real | Próximo |
| 🔜 Panel de administración | Próximo |
| 🔜 Sistema de dados (verificados) | Próximo |
| 🔜 Sistema de puntos y badges | Próximo |

---

## Comandos útiles

```bash
npm run dev               # Servidor de desarrollo
npm run build             # Build de producción
rmdir /s /q .next         # Limpiar caché (Windows)
rm -rf .next              # Limpiar caché (Mac/Linux)
```

---

## Estructura de roles

| Rol | Descripción |
|-----|-------------|
| `admin` | Control total del sistema |
| `director` | Crea y gestiona salas, CSS personalizado |
| `master` | Gestiona temas dentro de salas |
| `player` | Participa en el rol |
| `guest` | Solo lectura |