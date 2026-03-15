"use client";

import { useState, useRef } from "react";
import Link from "next/link";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Audience = "todos" | "jugador" | "director" | "admin";

type ContentBlock =
  | { type: "intro"; text: string }
  | { type: "steps"; steps: { title: string; desc: string }[] }
  | { type: "tip"; text: string }
  | { type: "warning"; text: string }
  | { type: "subsection"; title: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

type Section = {
  id: string;
  title: string;
  audience: Audience;
  content: ContentBlock[];
};

type Category = {
  id: string;
  label: string;
  icon: string;
  audience: Audience;
  sections: Section[];
};

// ─── Datos de contenido ───────────────────────────────────────────────────────

const categories: Category[] = [
  {
    id: "inicio",
    label: "Primeros pasos",
    icon: "✦",
    audience: "todos",
    sections: [
      {
        id: "que-es",
        title: "¿Qué es TalesRol?",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "TalesRol es una plataforma de rol por foro donde grupos de personas crean historias colaborativas. Cada partida tiene su propia sala con temas narrativos, un sistema de dados verificados, fichas de personaje y una wiki del mundo.",
          },
          {
            type: "list",
            items: [
              "Salas — el espacio de cada partida de rol",
              "Temas — los hilos narrativos dentro de una sala",
              "Posts — tus intervenciones en la historia",
              "Fichas — la hoja de personaje de cada jugador",
              "Wiki — la enciclopedia del mundo de la partida",
              "Mensajes privados — comunicación directa entre usuarios",
              "Notificaciones — avisos en tiempo real de actividad",
            ],
          },
          {
            type: "tip",
            text: "Si es tu primera vez en el rol por foro, no te preocupes. El formato es sencillo: lees los posts anteriores, escribes la acción o diálogo de tu personaje y los demás continúan la historia.",
          },
        ],
      },
      {
        id: "registro",
        title: "Registro e inicio de sesión",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Para usar TalesRol necesitas una cuenta gratuita. El proceso tarda menos de un minuto.",
          },
          {
            type: "steps",
            steps: [
              { title: "Ve a /registro", desc: 'Haz clic en "Registrarse" en la barra de navegación superior.' },
              { title: "Rellena el formulario", desc: "Elige un nombre de usuario único, introduce tu correo electrónico y crea una contraseña." },
              { title: "Inicia sesión", desc: "Con la cuenta creada, ve a /login e introduce tus credenciales." },
            ],
          },
          {
            type: "tip",
            text: "Tu nombre de usuario es público y aparecerá en tus posts y perfil. Elige uno que te represente bien.",
          },
        ],
      },
      {
        id: "perfil",
        title: "Tu perfil de usuario",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Desde tu perfil puedes personalizar tu presencia en TalesRol: avatar, descripción, privacidad e insignias desbloqueadas.",
          },
          {
            type: "steps",
            steps: [
              { title: "Accede a tu perfil", desc: "Haz clic en tu avatar en la barra superior o ve a /perfil." },
              { title: "Edita tu información", desc: "Cambia tu avatar, añade una descripción y configura si tu perfil es público o privado." },
              { title: "Consulta tus insignias", desc: "En la sección de badges verás todos los logros desbloqueados." },
            ],
          },
          {
            type: "subsection",
            title: "Privacidad del perfil",
            text: "Si estableces tu perfil como privado, otros usuarios no podrán ver tus estadísticas ni tu historial de salas. Tu nombre de usuario seguirá siendo visible en los posts que escribas.",
          },
        ],
      },
    ],
  },
  {
    id: "salas",
    label: "Salas y temas",
    icon: "⬡",
    audience: "todos",
    sections: [
      {
        id: "explorar-salas",
        title: "Explorar y unirse a salas",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Las salas son las partidas de rol de TalesRol. Cada sala tiene su propio sistema de temas, fichas y wiki.",
          },
          {
            type: "steps",
            steps: [
              { title: "Ve a /salas", desc: "Desde el menú de navegación o la página de inicio, accede al listado de salas." },
              { title: "Explora las salas activas", desc: "Verás las salas organizadas por estado: activa, en pausa, cerrada, finalizada o archivada." },
              { title: "Solicita unirte", desc: "Entra en la sala que te interese y pide al director que te añada como jugador." },
            ],
          },
          {
            type: "table",
            headers: ["Estado", "Significado"],
            rows: [
              ["Activa", "La partida está en marcha y se aceptan posts"],
              ["En pausa", "La partida está temporalmente detenida"],
              ["Cerrada", "No se aceptan nuevos jugadores"],
              ["Finalizada", "La historia ha concluido"],
              ["Archivada", "Sala guardada solo para consulta"],
            ],
          },
        ],
      },
      {
        id: "temas-posts",
        title: "Temas y escritura de posts",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Dentro de cada sala hay temas: hilos narrativos en los que los jugadores escriben sus posts para avanzar la historia.",
          },
          {
            type: "steps",
            steps: [
              { title: "Entra en un tema", desc: "Desde la página de sala, haz clic en el tema en el que quieres participar." },
              { title: "Lee los posts anteriores", desc: "Antes de escribir, lee lo que ha pasado para continuar la historia de forma coherente." },
              { title: "Escribe tu post", desc: "Usa el editor al final del tema para redactar tu intervención." },
              { title: "Envía tu post", desc: 'Haz clic en "Publicar" para que tu post aparezca en el tema.' },
            ],
          },
          {
            type: "tip",
            text: "Los posts admiten formato HTML básico: negritas, cursivas, encabezados y blockquotes. Úsalos para dar más expresividad a tu escritura.",
          },
          {
            type: "subsection",
            title: "Vincular un personaje a un post",
            text: "Si tienes personajes creados, puedes asociar uno a tu post. Aparecerá su nombre y avatar junto a tu intervención, diferenciando claramente al personaje del jugador.",
          },
        ],
      },
      {
        id: "dados",
        title: "Sistema de dados",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "TalesRol incluye un sistema de tiradas de dados verificadas. Las tiradas quedan registradas en el post y no pueden modificarse posteriormente.",
          },
          {
            type: "steps",
            steps: [
              { title: "Activa el dado en el formulario", desc: "En el formulario de nuevo post, haz clic en el botón de dado para mostrar las opciones." },
              { title: "Configura la tirada", desc: "Elige el tipo de dado (d4, d6, d8, d10, d12, d20, d100) y la cantidad a tirar." },
              { title: "Lanza y publica", desc: "Al enviar el post, la tirada se genera de forma aleatoria verificada y se incluye junto al texto." },
            ],
          },
          {
            type: "warning",
            text: "Las tiradas de dados son definitivas y verificadas. No es posible editar o eliminar un post que contenga una tirada de dados.",
          },
        ],
      },
    ],
  },
  {
    id: "personajes",
    label: "Personajes",
    icon: "◉",
    audience: "todos",
    sections: [
      {
        id: "crear-personaje",
        title: "Crear y gestionar personajes",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Los personajes son los alter ego que usas en las partidas. Puedes tener varios y vincularlos a diferentes salas.",
          },
          {
            type: "steps",
            steps: [
              { title: "Ve a /personajes", desc: "Desde el menú de usuario o la navegación accede a tu lista de personajes." },
              { title: "Crea un personaje nuevo", desc: 'Haz clic en "Nuevo personaje". Introduce nombre, descripción, avatar y los datos que necesites.' },
              { title: "Edita o elimina", desc: "Desde la ficha de cada personaje puedes editar su información o eliminarlo." },
            ],
          },
          {
            type: "tip",
            text: "Puedes tener tantos personajes como quieras. Cada uno puede tener su propio avatar e historia.",
          },
        ],
      },
      {
        id: "fichas",
        title: "Fichas de personaje en salas",
        audience: "jugador",
        content: [
          {
            type: "intro",
            text: "Cada sala puede tener su propia plantilla de ficha de personaje. El director configura los campos y los jugadores rellenan su ficha.",
          },
          {
            type: "steps",
            steps: [
              { title: 'Accede a "Fichas" en la sala', desc: "Desde la página de la sala, haz clic en el botón Fichas." },
              { title: "Rellena tu ficha", desc: "Completa los campos que el director ha configurado: nombre, raza, vida, habilidades, historia, etc." },
              { title: "Guarda los cambios", desc: "Tu ficha queda visible para el director y, si lo permite, para otros jugadores." },
            ],
          },
          {
            type: "tip",
            text: "El director puede ver y editar la ficha de cualquier jugador. Si hay un error en tu ficha, puedes pedirle ayuda.",
          },
        ],
      },
    ],
  },
  {
    id: "comunicacion",
    label: "Comunicación",
    icon: "✉",
    audience: "todos",
    sections: [
      {
        id: "mensajes-privados",
        title: "Mensajes privados",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Puedes enviar mensajes privados a cualquier usuario registrado. Las conversaciones son privadas y solo las pueden ver los participantes.",
          },
          {
            type: "steps",
            steps: [
              { title: "Ve a /mensajes", desc: "Desde el icono de mensajes en la barra superior o el menú de navegación." },
              { title: "Inicia una conversación", desc: "Introduce el nombre de usuario del destinatario y escribe tu mensaje." },
              { title: "Gestiona tus conversaciones", desc: "Verás todas tus conversaciones activas. Haz clic en una para continuar el hilo." },
            ],
          },
        ],
      },
      {
        id: "notificaciones",
        title: "Notificaciones",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "TalesRol envía notificaciones en tiempo real cuando ocurren eventos relevantes para ti.",
          },
          {
            type: "list",
            items: [
              "Nuevos posts en temas en los que participas",
              "Mensajes privados recibidos",
              "Cambios en tu rango dentro de una sala",
              "Anuncios del equipo de administración",
            ],
          },
          {
            type: "tip",
            text: "Puedes marcar todas las notificaciones como leídas desde el panel haciendo clic en el icono de campana.",
          },
        ],
      },
    ],
  },
  {
    id: "director",
    label: "Dirección de sala",
    icon: "⬟",
    audience: "director",
    sections: [
      {
        id: "crear-sala",
        title: "Crear una sala",
        audience: "director",
        content: [
          {
            type: "intro",
            text: "Cualquier usuario puede crear una sala y convertirse en su director. El director tiene control total sobre la partida.",
          },
          {
            type: "steps",
            steps: [
              { title: "Ve a /salas/nueva", desc: 'Desde el listado de salas, haz clic en el botón "Nueva sala".' },
              { title: "Configura la sala", desc: "Introduce el título, descripción, imagen de portada, etiquetas y el estado inicial." },
              { title: "Publica la sala", desc: "Una vez creada, la sala aparecerá en el listado público y podrás añadir jugadores." },
            ],
          },
          {
            type: "tip",
            text: "Puedes editar todos los datos de la sala en cualquier momento desde el botón Editar en la página de la sala.",
          },
        ],
      },
      {
        id: "gestionar-miembros",
        title: "Gestionar miembros",
        audience: "director",
        content: [
          {
            type: "intro",
            text: 'Desde la sección "Miembros" de tu sala puedes añadir jugadores, cambiar sus rangos y expulsarlos si es necesario.',
          },
          {
            type: "table",
            headers: ["Rango", "Permisos"],
            rows: [
              ["Director", "Control total: editar sala, gestionar miembros, moderar posts"],
              ["Codirector", "Puede moderar posts y gestionar temas, pero no editar la sala"],
              ["Jugador", "Puede escribir posts y rellenar su ficha"],
              ["Espectador", "Solo puede leer los temas, sin poder escribir posts"],
            ],
          },
          {
            type: "steps",
            steps: [
              { title: "Añade un jugador", desc: "Introduce el nombre de usuario en el campo de búsqueda y selecciona el rango a asignar." },
              { title: "Cambia el rango", desc: "Haz clic en el rango actual del jugador para desplegar el selector y elige el nuevo rango." },
              { title: "Expulsa a un miembro", desc: "Usa el botón de expulsión junto al nombre del jugador. Se le eliminará de la sala inmediatamente." },
            ],
          },
        ],
      },
      {
        id: "gestionar-temas",
        title: "Crear y moderar temas",
        audience: "director",
        content: [
          {
            type: "intro",
            text: "Los temas son los hilos narrativos de tu sala. Como director puedes crear temas, fijarlos al principio del listado y bloquearlos cuando sea necesario.",
          },
          {
            type: "steps",
            steps: [
              { title: "Crea un tema nuevo", desc: 'Desde la página de sala, haz clic en "Nuevo tema". Introduce el título y el post inicial.' },
              { title: "Fija un tema", desc: "Los temas fijados aparecen siempre al principio. Útil para normas o información importante." },
              { title: "Bloquea un tema", desc: "Un tema bloqueado no acepta nuevos posts. Útil cuando una escena ha concluido." },
            ],
          },
          {
            type: "tip",
            text: "Puedes editar o eliminar cualquier post de la sala, incluso los de otros jugadores, si es necesario para la moderación.",
          },
        ],
      },
      {
        id: "wiki-director",
        title: "Gestionar la wiki de la sala",
        audience: "director",
        content: [
          {
            type: "intro",
            text: "La wiki es la enciclopedia del mundo de tu partida. Puedes crear páginas para personajes, lugares, facciones, reglas de la partida, etc.",
          },
          {
            type: "steps",
            steps: [
              { title: "Accede a la wiki", desc: "Desde la página de sala, haz clic en el botón Wiki." },
              { title: "Crea páginas", desc: "Haz clic en Nueva página, elige una categoría, escribe el título y el contenido con el editor." },
              { title: "Organiza con categorías", desc: "Asigna categorías a las páginas para que los jugadores puedan filtrar y encontrar información fácilmente." },
              { title: "Establece la portada", desc: "La página marcada como portada (is_home) se muestra destacada al entrar en la wiki." },
            ],
          },
          {
            type: "subsection",
            title: "Historial de versiones",
            text: "Cada edición de una página wiki queda guardada. Puedes consultar el historial desde el sidebar de la wiki y restaurar versiones anteriores si lo necesitas.",
          },
          {
            type: "tip",
            text: "El editor de la wiki admite HTML. Hay un panel de referencia lateral con los elementos más habituales para ayudarte a dar formato.",
          },
        ],
      },
      {
        id: "ficha-plantilla",
        title: "Configurar la plantilla de ficha",
        audience: "director",
        content: [
          {
            type: "intro",
            text: "Puedes diseñar una plantilla de ficha personalizada para tu sala. Los jugadores la rellenarán con los datos de su personaje.",
          },
          {
            type: "table",
            headers: ["Tipo de campo", "Uso habitual"],
            rows: [
              ["Texto corto", "Nombre, raza, clase, origen"],
              ["Texto largo", "Descripción, historia del personaje"],
              ["Número / Barra", "Vida, maná, puntos de experiencia"],
              ["Lista de habilidades", "Habilidades, rasgos, poderes"],
              ["Imagen avatar", "Retrato del personaje"],
              ["Imagen cabecera", "Ilustración de cabecera de la ficha"],
            ],
          },
          {
            type: "steps",
            steps: [
              { title: "Accede a Fichas → Plantilla", desc: "Desde la sección de fichas de tu sala, haz clic en Editar plantilla." },
              { title: "Añade campos", desc: "Haz clic en Añadir campo, elige el tipo y dale un nombre descriptivo." },
              { title: "Ordena y elimina campos", desc: "Puedes reordenar los campos arrastrándolos y eliminar cualquiera que no necesites." },
            ],
          },
          {
            type: "warning",
            text: "Si eliminas un campo de la plantilla que ya tiene datos, esos datos se perderán en las fichas de los jugadores. Hazlo con cuidado.",
          },
        ],
      },
    ],
  },
  {
    id: "moderacion",
    label: "Moderación y reportes",
    icon: "◬",
    audience: "todos",
    sections: [
      {
        id: "reportar",
        title: "Cómo reportar contenido",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Si encuentras un post o una sala que incumple las normas, puedes reportarlo para que el equipo de administración lo revise.",
          },
          {
            type: "steps",
            steps: [
              { title: "Localiza el botón de reporte", desc: "En cada post verás un icono de reporte en sus acciones. En la página de sala hay también un botón para reportar la sala entera." },
              { title: "Elige el motivo", desc: "Selecciona el motivo del reporte: contenido inapropiado, spam, acoso, etc." },
              { title: "Añade un comentario", desc: "Opcionalmente puedes añadir contexto adicional para ayudar a los moderadores." },
              { title: "Envía el reporte", desc: "El reporte llega al panel de administración. El equipo lo revisará lo antes posible." },
            ],
          },
          {
            type: "tip",
            text: "Los reportes son anónimos. El usuario reportado no sabrá quién ha realizado el reporte.",
          },
        ],
      },
      {
        id: "avisos-moderacion",
        title: "Avisos de moderación en salas",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Si una sala ha recibido una acción de moderación, verás un aviso destacado en su página. Puede ser un cierre temporal o permanente.",
          },
          {
            type: "list",
            items: [
              "Cierre temporal — la sala está suspendida temporalmente por el equipo de administración",
              "Cierre permanente — la sala ha sido cerrada de forma definitiva por incumplimiento de normas",
            ],
          },
          {
            type: "warning",
            text: "Si tu sala ha sido cerrada por moderación y crees que es un error, contacta con el equipo de administración a través de mensajes privados.",
          },
        ],
      },
    ],
  },
  {
    id: "insignias-ayuda",
    label: "Insignias",
    icon: "⬟",
    audience: "todos",
    sections: [
      {
        id: "sistema-insignias",
        title: "Sistema de insignias",
        audience: "todos",
        content: [
          {
            type: "intro",
            text: "Las insignias son logros que se desbloquean al alcanzar ciertos hitos en TalesRol. Aparecen en tu perfil y en la página /insignias.",
          },
          {
            type: "list",
            items: [
              "Las insignias se otorgan automáticamente o manualmente por el equipo de administración",
              "Puedes ver el catálogo completo en /insignias",
              "Desde /perfil/badges puedes gestionar cuáles aparecen visibles en tu perfil",
              "El número de insignias aparece en tu tarjeta de la página /usuarios",
            ],
          },
          {
            type: "tip",
            text: "Si crees que has cumplido los requisitos de una insignia y no la has recibido, puedes contactar con el equipo de administración.",
          },
        ],
      },
    ],
  },
  {
    id: "administracion",
    label: "Administración",
    icon: "⬡",
    audience: "admin",
    sections: [
      {
        id: "panel-admin",
        title: "Panel de administración",
        audience: "admin",
        content: [
          {
            type: "intro",
            text: "El panel de administración centraliza la gestión de toda la plataforma. Solo los usuarios con rol admin tienen acceso.",
          },
          {
            type: "table",
            headers: ["Sección", "Función"],
            rows: [
              ["Usuarios", "Ver, editar roles y gestionar cuentas de usuario"],
              ["Salas", "Moderar salas, cerrar temporal o permanentemente"],
              ["Reportes", "Revisar y resolver reportes de posts y salas"],
              ["Dados", "Consultar el historial de tiradas verificadas"],
              ["Etiquetas", "Crear y gestionar las etiquetas de sala"],
              ["Anuncios", "Publicar anuncios en la página pública /anuncios"],
            ],
          },
          {
            type: "tip",
            text: "Accede al panel desde el menú de tu avatar → Administración, o directamente en /admin.",
          },
        ],
      },
      {
        id: "gestionar-usuarios-admin",
        title: "Gestión de usuarios",
        audience: "admin",
        content: [
          {
            type: "intro",
            text: "Desde la sección Usuarios del panel puedes consultar todos los usuarios registrados, cambiar su rol y gestionar sus cuentas.",
          },
          {
            type: "steps",
            steps: [
              { title: "Busca un usuario", desc: "Usa el buscador para encontrar usuarios por nombre o correo electrónico." },
              { title: "Cambia el rol", desc: "Los roles disponibles son usuario, moderador y admin. Cambia el rol desde la tabla de usuarios." },
              { title: "Consulta la actividad", desc: "Puedes ver el número de posts, salas y otros datos relevantes de cada usuario." },
            ],
          },
          {
            type: "warning",
            text: "El baneo por IP desde el frontend está en desarrollo. Por ahora la gestión de baneos se realiza directamente desde la base de datos.",
          },
        ],
      },
      {
        id: "moderar-salas-admin",
        title: "Moderación de salas",
        audience: "admin",
        content: [
          {
            type: "intro",
            text: "Desde el panel puedes aplicar acciones de moderación sobre cualquier sala de la plataforma.",
          },
          {
            type: "steps",
            steps: [
              { title: "Accede a Salas en el panel", desc: "Verás el listado completo de salas con su estado actual." },
              { title: "Aplica una acción de moderación", desc: "Puedes cerrar temporalmente una sala o de forma definitiva." },
              { title: "El aviso aparece automáticamente", desc: "En cuanto apliques la acción, el aviso de moderación aparecerá en la página de la sala afectada." },
            ],
          },
        ],
      },
      {
        id: "anuncios-admin",
        title: "Gestión de anuncios",
        audience: "admin",
        content: [
          {
            type: "intro",
            text: "Los anuncios son comunicados oficiales que aparecen en /anuncios. Úsalos para informar de novedades, mantenimientos o cambios en las normas.",
          },
          {
            type: "steps",
            steps: [
              { title: "Ve a Anuncios en el panel", desc: "Desde el panel de administración, accede a la sección Anuncios." },
              { title: "Crea un anuncio", desc: "Introduce el título, el contenido y la fecha. Puedes marcar anuncios como destacados." },
              { title: "Publica o archiva", desc: "Los anuncios publicados aparecen en /anuncios. Puedes archivarlos para que dejen de mostrarse." },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const audienceLabel: Record<Audience, string> = {
  todos: "Todos",
  jugador: "Jugadores",
  director: "Directores",
  admin: "Administradores",
};

const audienceColor: Record<Audience, string> = {
  todos: "var(--color-crimson)",
  jugador: "var(--color-role-jugador)",
  director: "var(--color-role-director)",
  admin: "var(--color-role-admin)",
};

// ─── Bloques de contenido ─────────────────────────────────────────────────────

function IntroBlock({ text }: { text: string }) {
  return <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>{text}</p>;
}

function StepsBlock({ steps }: { steps: { title: string; desc: string }[] }) {
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {steps.map((step, i) => (
        <li key={i} style={{
          display: "flex", gap: "1rem", alignItems: "flex-start",
          background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)", padding: "0.85rem 1rem",
        }}>
          <span style={{
            flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
            background: "var(--color-crimson-subtle)", border: "1px solid var(--border-medium)",
            color: "var(--color-crimson)", fontFamily: "var(--font-display)",
            fontSize: "var(--text-xs)", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
          }}>{i + 1}</span>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.03em" }}>{step.title}</p>
            <p style={{ margin: "0.2rem 0 0", fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function TipBlock({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "var(--color-info-bg)", border: "1px solid var(--color-info-border)", borderRadius: "var(--radius-sm)", padding: "0.85rem 1rem" }}>
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 2 }}>💡</span>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-info)", lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function WarningBlock({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "var(--color-warning-bg)", border: "1px solid var(--color-warning-border)", borderRadius: "var(--radius-sm)", padding: "0.85rem 1rem" }}>
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 2 }}>⚠️</span>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-warning)", lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function SubsectionBlock({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ borderLeft: "2px solid var(--border-medium)", paddingLeft: "1rem" }}>
      <p style={{ margin: "0 0 0.3rem", fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.04em" }}>{title}</p>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

function ListBlock({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          <span style={{ color: "var(--color-crimson)", flexShrink: 0, marginTop: "0.15rem", fontSize: "0.6rem" }}>◆</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={j === 0 ? { fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--text-sm)" } : {}}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "intro":      return <IntroBlock key={i} text={block.text} />;
    case "steps":      return <StepsBlock key={i} steps={block.steps} />;
    case "tip":        return <TipBlock key={i} text={block.text} />;
    case "warning":    return <WarningBlock key={i} text={block.text} />;
    case "subsection": return <SubsectionBlock key={i} title={block.title} text={block.text} />;
    case "list":       return <ListBlock key={i} items={block.items} />;
    case "table":      return <TableBlock key={i} headers={block.headers} rows={block.rows} />;
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AyudaPage() {
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [activeSection, setActiveSection] = useState(categories[0].sections[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentCat = categories.find((c) => c.id === activeCat)!;
  const currentSection = currentCat.sections.find((s) => s.id === activeSection) ?? currentCat.sections[0];

  const searchResults: { cat: Category; section: Section }[] =
    searchQuery.trim().length > 1
      ? categories.flatMap((cat) =>
          cat.sections
            .filter((s) =>
              s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.content.some((b) => b.type === "intro" && b.text.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((section) => ({ cat, section }))
        )
      : [];

  function selectSection(catId: string, sectionId: string) {
    setActiveCat(catId);
    setActiveSection(sectionId);
    setSearchQuery("");
    setMobileNavOpen(false);
    setTimeout(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const allSections = currentCat.sections;
  const idx = allSections.findIndex((s) => s.id === currentSection.id);
  const prev = allSections[idx - 1];
  const next = allSections[idx + 1];

  return (
    <>
      <style>{`
        .ayuda-layout { display: grid; grid-template-columns: 260px 1fr; min-height: calc(100vh - 62px); max-width: 1200px; margin: 0 auto; }
        .ayuda-sidebar { border-right: 1px solid var(--border-subtle); padding: 1.5rem 0; position: sticky; top: 62px; height: calc(100vh - 62px); overflow-y: auto; background: var(--bg-secondary); }
        .ayuda-sidebar-header { padding: 0 1.25rem 1rem; border-bottom: 1px solid var(--border-subtle); margin-bottom: 0.75rem; }
        .ayuda-search-wrap { position: relative; }
        .ayuda-search { width: 100%; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; color: var(--text-primary); font-family: var(--font-body); font-size: var(--text-sm); outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .ayuda-search:focus { border-color: var(--color-crimson); box-shadow: 0 0 0 3px var(--color-crimson-glow); }
        .ayuda-search::placeholder { color: var(--text-muted); }
        .ayuda-search-results { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); box-shadow: var(--shadow-lg); z-index: 200; max-height: 280px; overflow-y: auto; }
        .ayuda-search-result-item { display: flex; flex-direction: column; gap: 0.1rem; width: 100%; padding: 0.6rem 1rem; border: none; border-bottom: 1px solid var(--border-subtle); background: transparent; cursor: pointer; text-align: left; transition: background 0.1s; }
        .ayuda-search-result-item:last-child { border-bottom: none; }
        .ayuda-search-result-item:hover { background: var(--color-crimson-subtle); }
        .ayuda-search-result-title { font-family: var(--font-display); font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }
        .ayuda-search-result-cat { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-display); letter-spacing: 0.05em; }
        .ayuda-nav-cat-btn { display: flex; align-items: center; gap: 0.5rem; width: 100%; padding: 0.5rem 1.25rem; background: transparent; border: none; cursor: pointer; font-family: var(--font-display); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); transition: color 0.15s; text-align: left; }
        .ayuda-nav-cat-btn:hover { color: var(--text-primary); }
        .ayuda-nav-cat-btn.active { color: var(--color-crimson); }
        .ayuda-nav-sections { display: flex; flex-direction: column; gap: 1px; padding: 0 0.5rem 0.75rem; }
        .ayuda-nav-section-btn { display: flex; align-items: center; width: 100%; padding: 0.45rem 0.75rem; background: transparent; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: var(--text-sm); color: var(--text-secondary); transition: all 0.15s; text-align: left; font-family: var(--font-body); }
        .ayuda-nav-section-btn:hover { background: var(--color-crimson-subtle); color: var(--text-primary); }
        .ayuda-nav-section-btn.active { background: rgba(193,6,6,0.1); color: var(--color-crimson); font-weight: 600; }
        .ayuda-content { padding: 2rem 2.5rem; min-width: 0; }
        .ayuda-breadcrumb { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-family: var(--font-display); font-size: var(--text-xs); letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); }
        .ayuda-section-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; }
        .ayuda-section-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-subtle); background: var(--bg-elevated); display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
        .ayuda-section-title { font-family: var(--font-display); font-size: var(--text-xl); font-weight: 700; letter-spacing: 0.05em; margin: 0; }
        .ayuda-audience-tag { display: inline-flex; align-items: center; padding: 0.2rem 0.65rem; border-radius: var(--radius-full); font-family: var(--font-display); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid; flex-shrink: 0; white-space: nowrap; }
        .ayuda-section-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .ayuda-section-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); gap: 1rem; }
        .ayuda-nav-arrow { display: flex; align-items: center; gap: 0.4rem; background: transparent; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.5rem 1rem; cursor: pointer; font-family: var(--font-display); font-size: var(--text-xs); letter-spacing: 0.06em; color: var(--text-muted); transition: all 0.15s; }
        .ayuda-nav-arrow:hover:not(:disabled) { border-color: var(--color-crimson); color: var(--color-crimson); background: var(--color-crimson-subtle); }
        .ayuda-nav-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        .ayuda-mobile-toggle { display: none; align-items: center; gap: 0.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.6rem 1rem; cursor: pointer; font-family: var(--font-display); font-size: var(--text-sm); color: var(--text-secondary); width: 100%; margin-bottom: 1rem; transition: all 0.15s; }
        .ayuda-mobile-toggle:hover { border-color: var(--color-crimson); color: var(--color-crimson); }
        .ayuda-mobile-nav { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); margin-bottom: 1rem; overflow: hidden; }
        @media (max-width: 768px) {
          .ayuda-layout { grid-template-columns: 1fr; }
          .ayuda-sidebar { display: none; }
          .ayuda-content { padding: 1.25rem; }
          .ayuda-mobile-toggle { display: flex; }
        }
      `}</style>

      {/* Hero */}
      <div style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-card)", padding: "2rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(to right, transparent, var(--color-crimson), transparent)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(193,6,6,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", background: "var(--color-crimson-subtle)", border: "1px solid var(--border-medium)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-crimson)", fontSize: "1.5rem", flexShrink: 0 }}>✦</div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "0.06em", margin: "0 0 0.35rem" }}>Centro de ayuda</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", margin: 0 }}>Guías y documentación para jugadores, directores de sala y administradores.</p>
          </div>
        </div>
      </div>

      <div className="ayuda-layout">
        {/* Sidebar */}
        <aside className="ayuda-sidebar">
          <div className="ayuda-sidebar-header">
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 0.75rem" }}>Guías</p>
            <div className="ayuda-search-wrap">
              <input className="ayuda-search" type="text" placeholder="Buscar en la ayuda…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              {searchResults.length > 0 && (
                <div className="ayuda-search-results">
                  {searchResults.map(({ cat, section }) => (
                    <button key={section.id} className="ayuda-search-result-item" onClick={() => selectSection(cat.id, section.id)}>
                      <span className="ayuda-search-result-title">{section.title}</span>
                      <span className="ayuda-search-result-cat">{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery.trim().length > 1 && searchResults.length === 0 && (
                <div className="ayuda-search-results">
                  <div style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "var(--text-sm)", textAlign: "center" }}>Sin resultados para «{searchQuery}»</div>
                </div>
              )}
            </div>
          </div>

          <nav>
            {categories.map((cat) => (
              <div key={cat.id}>
                <button
                  className={`ayuda-nav-cat-btn ${activeCat === cat.id ? "active" : ""}`}
                  onClick={() => { setActiveCat(cat.id); setActiveSection(cat.sections[0].id); }}
                >
                  <span style={{ fontSize: "0.9rem" }}>{cat.icon}</span>
                  {cat.label}
                  {cat.audience !== "todos" && (
                    <span style={{ marginLeft: "auto", fontSize: "0.58rem", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-full)", padding: "0.05rem 0.4rem", color: audienceColor[cat.audience], fontFamily: "var(--font-display)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
                      {audienceLabel[cat.audience]}
                    </span>
                  )}
                </button>
                {activeCat === cat.id && (
                  <div className="ayuda-nav-sections">
                    {cat.sections.map((s) => (
                      <button key={s.id} className={`ayuda-nav-section-btn ${activeSection === s.id ? "active" : ""}`} onClick={() => selectSection(cat.id, s.id)}>
                        {s.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Links rápidos */}
          <div style={{ margin: "1rem 0.5rem 0", padding: "1rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 0.65rem" }}>Accesos directos</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {[
                { href: "/normas", label: "Normas de la comunidad" },
                { href: "/insignias", label: "Catálogo de insignias" },
                { href: "/salas", label: "Explorar salas" },
                { href: "/usuarios", label: "Comunidad" },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "var(--text-sm)", color: "var(--text-secondary)", textDecoration: "none", padding: "0.25rem", borderRadius: "var(--radius-sm)", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-crimson)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
                  <span style={{ color: "var(--color-crimson)", fontSize: "0.55rem" }}>◆</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido */}
        <main className="ayuda-content" ref={contentRef}>
          {/* Toggle móvil */}
          <button className="ayuda-mobile-toggle" onClick={() => setMobileNavOpen((v) => !v)}>
            <span style={{ color: "var(--color-crimson)" }}>☰</span>
            {currentCat.label} — {currentSection.title}
            <span style={{ marginLeft: "auto" }}>{mobileNavOpen ? "▲" : "▼"}</span>
          </button>

          {mobileNavOpen && (
            <div className="ayuda-mobile-nav">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <div style={{ padding: "0.5rem 1rem", background: "var(--bg-elevated)", fontFamily: "var(--font-display)", fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>
                    {cat.icon} {cat.label}
                  </div>
                  {cat.sections.map((s) => (
                    <button key={s.id} onClick={() => selectSection(cat.id, s.id)} style={{ display: "block", width: "100%", padding: "0.55rem 1.25rem", background: activeSection === s.id ? "var(--color-crimson-subtle)" : "transparent", border: "none", borderBottom: "1px solid var(--border-subtle)", color: activeSection === s.id ? "var(--color-crimson)" : "var(--text-secondary)", fontSize: "var(--text-sm)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-body)" }}>
                      {s.title}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Breadcrumb */}
          <div className="ayuda-breadcrumb">
            <span>Ayuda</span>
            <span style={{ color: "var(--border-medium)" }}>›</span>
            <span>{currentCat.label}</span>
            <span style={{ color: "var(--border-medium)" }}>›</span>
            <span style={{ color: "var(--text-secondary)" }}>{currentSection.title}</span>
          </div>

          {/* Tarjeta de sección */}
          <div className="ayuda-section-card animate-enter" key={currentSection.id}>
            <div className="ayuda-section-header">
              <h2 className="ayuda-section-title">{currentSection.title}</h2>
              <span className="ayuda-audience-tag" style={{ color: audienceColor[currentSection.audience], borderColor: audienceColor[currentSection.audience] + "55", background: audienceColor[currentSection.audience] + "12" }}>
                {audienceLabel[currentSection.audience]}
              </span>
            </div>
            <div className="ayuda-section-body">
              {currentSection.content.map((block, i) => renderBlock(block, i))}
            </div>
          </div>

          {/* Prev / Next */}
          <div className="ayuda-section-nav">
            <button className="ayuda-nav-arrow" disabled={!prev} onClick={() => prev && selectSection(currentCat.id, prev.id)}>
              ← {prev ? prev.title : "Anterior"}
            </button>
            <button className="ayuda-nav-arrow" disabled={!next} onClick={() => next && selectSection(currentCat.id, next.id)}>
              {next ? next.title : "Siguiente"} →
            </button>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1.1rem" }}>❓</span>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-muted)", flex: 1 }}>
              ¿No encuentras lo que buscas? Contacta con el equipo de administración a través de{" "}
              <Link href="/mensajes" style={{ color: "var(--color-crimson)" }}>mensajes privados</Link>.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}