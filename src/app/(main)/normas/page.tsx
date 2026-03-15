import Link from 'next/link'
import {
  ShieldCheckIcon,
  PencilSquareIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'

export const metadata = {
  title: 'Normas — TalesRol',
  description: 'Normas de conducta y participación en TalesRol.',
}

export default function NormasPage() {
  return (
    <div className="normas-page">

      {/* Hero */}
      <div className="normas-hero animate-enter border-ornament">
        <div className="normas-hero-icon">
          <BookOpenIcon style={{ width: 28, height: 28 }} />
        </div>
        <div>
          <h1 className="normas-hero-title">El Código de TalesRol</h1>
          <p className="normas-hero-sub">
            Este es un espacio para crear historias juntos. Estas normas existen para que cada aventurero,
            director y viajero ocasional pueda disfrutar de la experiencia con respeto y libertad creativa.
          </p>
        </div>
      </div>

      {/* Índice */}
      <nav className="normas-index animate-enter" style={{ animationDelay: '0.05s' }}>
        <p className="normas-index-label">Contenido</p>
        <div className="normas-index-links">
          <a href="#conducta" className="normas-index-link">Conducta general</a>
          <a href="#rol" className="normas-index-link">Rol y escritura</a>
          <a href="#directores" className="normas-index-link">Directores</a>
          <a href="#sanciones" className="normas-index-link">Sanciones</a>
        </div>
      </nav>

      {/* Sección 1 — Conducta */}
      <section id="conducta" className="normas-section animate-enter" style={{ animationDelay: '0.1s' }}>
        <div className="normas-section-header">
          <ShieldCheckIcon style={{ width: 20, height: 20 }} />
          <h2 className="normas-section-title">Normas generales de conducta</h2>
        </div>
        <div className="normas-content">
          <p>
            TalesRol es una comunidad construida sobre la colaboración y el respeto mutuo.
            Al registrarte, aceptas cumplir estas normas en el uso dentro de la plataforma.
          </p>

          <div className="normas-rule">
            <span className="normas-rule-num">1.1</span>
            <div>
              <strong>Respeto ante todo.</strong> Trata a los demás usuarios con educación y consideración,
              tanto dentro como fuera de las salas de rol. Las discusiones constructivas son bienvenidas;
              los insultos, el acoso y las faltas de respeto no tienen cabida aquí.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">1.2</span>
            <div>
              <strong>Sin discriminación.</strong> Quedan prohibidos comentarios o comportamientos que
              discriminen por motivos de origen, género, orientación sexual, religión, ideología
              o cualquier otra característica personal.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">1.3</span>
            <div>
              <strong>Contenido apropiado.</strong> El contenido explícitamente sexual, violento o perturbador
              fuera del contexto narrativo acordado en una sala está prohibido. Los directores pueden
              establecer el tono maduro de su sala, pero dentro de los límites de la plataforma.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">1.4</span>
            <div>
              <strong>Una cuenta por persona.</strong> No se permite crear cuentas múltiples para eludir
              sanciones o suplantar a otros usuarios.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">1.5</span>
            <div>
              <strong>Privacidad.</strong> Está terminantemente prohibido compartir información personal
              de otros usuarios sin su consentimiento explícito.
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2 — Rol */}
      <section id="rol" className="normas-section animate-enter" style={{ animationDelay: '0.15s' }}>
        <div className="normas-section-header">
          <PencilSquareIcon style={{ width: 20, height: 20 }} />
          <h2 className="normas-section-title">Normas de rol y escritura</h2>
        </div>
        <div className="normas-content">
          <p>
            El rol colaborativo exige un compromiso con la historia y con los compañeros de aventura.
            Estas normas buscan garantizar una experiencia narrativa satisfactoria para todos.
          </p>

          <div className="normas-rule">
            <span className="normas-rule-num">2.1</span>
            <div>
              <strong>Respeta el lore y las reglas de cada sala.</strong> Cada sala tiene su propio
              universo y normas internas establecidas por el director. Léelas antes de participar
              y respétalas durante toda la campaña.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">2.2</span>
            <div>
              <strong>Sin godmodding ni metagaming.</strong> No controles las acciones de personajes
              ajenos sin permiso de su jugador. No uses información que tu personaje no podría conocer
              dentro de la ficción.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">2.3</span>
            <div>
              <strong>Calidad sobre cantidad.</strong> No es obligatorio escribir novelas, pero sí se
              espera un mínimo de esfuerzo narrativo. Evita respuestas de una sola línea que no
              aporten nada a la historia.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">2.4</span>
            <div>
              <strong>Abandono de sala.</strong> Si vas a abandonar una sala en curso, comunícalo
              con antelación al director. Desaparecer sin avisar afecta al resto de jugadores
              y al desarrollo de la historia.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">2.5</span>
            <div>
              <strong>Spam y flood.</strong> Está prohibido publicar mensajes repetitivos, sin contenido
              o con el único fin de aumentar el contador de posts.
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3 — Directores */}
      <section id="directores" className="normas-section animate-enter" style={{ animationDelay: '0.2s' }}>
        <div className="normas-section-header">
          <UserGroupIcon style={{ width: 20, height: 20 }} />
          <h2 className="normas-section-title">Normas para directores</h2>
        </div>
        <div className="normas-content">
          <p>
            Los directores son los arquitectos de las historias en TalesRol. Con ese poder creativo
            viene también una responsabilidad especial hacia su comunidad de jugadores.
          </p>

          <div className="normas-rule">
            <span className="normas-rule-num">3.1</span>
            <div>
              <strong>Descripción honesta de la sala.</strong> La descripción, etiquetas y tono de tu sala
              deben reflejar fielmente el tipo de historia que vas a narrar. No engañes a los jugadores
              sobre el contenido o el nivel de compromiso requerido.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">3.2</span>
            <div>
              <strong>Comunicación con los jugadores.</strong> Si vas a pausar o cerrar una sala,
              comunícalo a tus jugadores con la mayor antelación posible. El silencio prolongado
              sin aviso puede derivar en una denuncia y revisión de la sala.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">3.3</span>
            <div>
              <strong>Gestión justa de miembros.</strong> Los directores pueden expulsar jugadores
              de su sala, pero no de forma arbitraria o como represalia por críticas legítimas.
              El abuso de esta función puede ser reportado.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">3.4</span>
            <div>
              <strong>Moderación interna.</strong> El director es el primer responsable del buen
              ambiente en su sala. Se espera que gestione conflictos menores entre jugadores antes
              de escalar al equipo de moderación.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">3.5</span>
            <div>
              <strong>Contenido de la sala.</strong> El director establece el tono y los límites
              narrativos de su historia, pero siempre dentro de las normas generales de la plataforma.
              La responsabilidad del contenido publicado en su sala recae también sobre él.
            </div>
          </div>
        </div>
      </section>

      {/* Sección 4 — Sanciones */}
      <section id="sanciones" className="normas-section animate-enter" style={{ animationDelay: '0.25s' }}>
        <div className="normas-section-header">
          <ExclamationTriangleIcon style={{ width: 20, height: 20 }} />
          <h2 className="normas-section-title">Sanciones y moderación</h2>
        </div>
        <div className="normas-content">
          <p>
            El equipo de moderación de TalesRol actúa con criterio y proporcionalidad.
            Las sanciones se aplican en función de la gravedad y reincidencia de la infracción.
          </p>

          <div className="normas-sanctions-grid">
            <div className="normas-sanction-card warning">
              <span className="normas-sanction-label">Advertencia</span>
              <p>Primera infracción leve. Aviso formal al usuario con explicación de la norma incumplida.</p>
            </div>
            <div className="normas-sanction-card temp">
              <span className="normas-sanction-label">Silencio temporal</span>
              <p>Reincidencia o infracción moderada. Restricción temporal de publicación de posts.</p>
            </div>
            <div className="normas-sanction-card ban">
              <span className="normas-sanction-label">Suspensión</span>
              <p>Infracción grave o reiterada. Acceso suspendido durante un periodo determinado.</p>
            </div>
            <div className="normas-sanction-card permban">
              <span className="normas-sanction-label">Baneo permanente</span>
              <p>Infracciones muy graves o acumulación de sanciones. Expulsión definitiva de la plataforma.</p>
            </div>
          </div>

          <div className="normas-rule" style={{ marginTop: '1.5rem' }}>
            <span className="normas-rule-num">4.1</span>
            <div>
              <strong>Reportes.</strong> Si presencias una infracción, usa el botón de reporte disponible
              en posts y salas. Los reportes son revisados por el equipo de moderación en el menor
              tiempo posible.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">4.2</span>
            <div>
              <strong>Falsos reportes.</strong> El uso malintencionado del sistema de reportes para
              perjudicar a otros usuarios es en sí mismo una infracción sancionable.
            </div>
          </div>

          <div className="normas-rule">
            <span className="normas-rule-num">4.3</span>
            <div>
              <strong>Decisiones de moderación.</strong> Las decisiones del equipo de moderación
              son definitivas. Si crees que una sanción ha sido injusta, puedes contactar con
              el equipo a través de los canales oficiales para revisión.
            </div>
          </div>
        </div>
      </section>

      {/* Footer de normas */}
      <div className="normas-footer animate-enter" style={{ animationDelay: '0.3s' }}>
        <p>
          Estas normas pueden actualizarse con el tiempo. Los cambios significativos serán comunicados
          a través del <Link href="/anuncios">tablón de anuncios</Link>.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Última actualización: enero 2025
        </p>
      </div>

    </div>
  )
}