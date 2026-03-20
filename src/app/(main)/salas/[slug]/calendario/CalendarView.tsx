'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, CalendarIcon, ClockIcon, LinkIcon, UserIcon, CheckIcon, XMarkIcon, QuestionMarkCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { createEvent, updateEvent, deleteEvent, upsertRsvp } from './calendaractions'

type Rsvp = { user_id: string; status: 'yes' | 'no' | 'maybe' }
type Topic = { id: string; title: string; slug: string }
type Event = {
  id: string
  title: string
  description: string | null
  starts_at: string
  ends_at: string | null
  topic_id: string | null
  created_by: string
  profiles: { username: string } | null
  topics: Topic | null
  session_rsvps: Rsvp[]
}
type Room = { id: string; name: string; slug: string }
type Profile = { id: string; username: string; role: string } | null

interface Props {
  events: Event[]
  topics: Topic[]
  room: Room
  profile: Profile
  canManage: boolean
  slug: string
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  // 0=lunes
  return (new Date(year, month, 1).getDay() + 6) % 7
}

export default function CalendarView({ events, topics, room, profile, canManage, slug }: Props) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    topic_id: '',
  })

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  // Eventos del mes actual
  const eventsThisMonth = events.filter(e => {
    const d = new Date(e.starts_at)
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  })

  function getEventsForDay(day: number) {
    return eventsThisMonth.filter(e => new Date(e.starts_at).getDate() === day)
  }

  function openCreate() {
    setEditingEvent(null)
    setForm({ title: '', description: '', starts_at: '', ends_at: '', topic_id: '' })
    setShowModal(true)
  }

  function openEdit(e: Event) {
    setEditingEvent(e)
    setForm({
      title: e.title,
      description: e.description ?? '',
      starts_at: e.starts_at.slice(0, 16),
      ends_at: e.ends_at ? e.ends_at.slice(0, 16) : '',
      topic_id: e.topic_id ?? '',
    })
    setSelectedEvent(null)
    setShowModal(true)
  }

  async function handleSubmit() {
    if (!form.title || !form.starts_at) return
    setLoading(true)
    try {
      if (editingEvent) {
        await updateEvent({ id: editingEvent.id, slug, ...form, ends_at: form.ends_at || undefined, topic_id: form.topic_id || undefined })
      } else {
        await createEvent({ room_id: room.id, slug, ...form, ends_at: form.ends_at || undefined, topic_id: form.topic_id || undefined })
      }
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este evento?')) return
    setLoading(true)
    try {
      await deleteEvent(id, slug)
      setSelectedEvent(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleRsvp(event_id: string, status: 'yes' | 'no' | 'maybe') {
    if (!profile) return
    setLoading(true)
    try {
      await upsertRsvp(event_id, slug, status)
    } finally {
      setLoading(false)
    }
  }

  function myRsvp(event: Event) {
    if (!profile) return null
    return event.session_rsvps.find(r => r.user_id === profile.id)?.status ?? null
  }

  function rsvpCount(event: Event, status: 'yes' | 'no' | 'maybe') {
    return event.session_rsvps.filter(r => r.status === status).length
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>

      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <CalendarIcon style={{ width: 22, height: 22, color: 'var(--color-crimson)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--text-primary)', margin: 0 }}>
            Calendario de sesiones
          </h2>
        </div>
        {canManage && (
          <button onClick={openCreate} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'var(--color-crimson)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-4)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            cursor: 'pointer', transition: 'background var(--transition-fast)',
          }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--color-crimson-light)')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--color-crimson)')}
          >
            <PlusIcon style={{ width: 16, height: 16 }} /> Nuevo evento
          </button>
        )}
      </div>

      {/* Navegación de mes */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-5)',
        marginBottom: 'var(--space-4)',
      }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 'var(--space-1)' }}>
          <ChevronLeftIcon style={{ width: 20, height: 20 }} />
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
          {MESES[currentMonth]} {currentYear}
        </span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 'var(--space-1)' }}>
          <ChevronRightIcon style={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Grid días de la semana */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
        {DIAS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: 'var(--space-2) 0', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid calendario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {/* Celdas vacías inicio */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={{ minHeight: 80, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', opacity: 0.3 }} />
        ))}

        {/* Días */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
          const dayEvents = getEventsForDay(day)

          return (
            <div key={day} style={{
              minHeight: 80,
              background: isToday ? 'var(--color-crimson-subtle)' : 'var(--bg-card)',
              border: isToday ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-2)',
              position: 'relative',
            }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-body)',
                color: isToday ? 'var(--color-crimson)' : 'var(--text-muted)',
                fontWeight: isToday ? 700 : 400,
              }}>{day}</span>

              {dayEvents.map(ev => (
                <button key={ev.id} onClick={() => setSelectedEvent(ev)} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  marginTop: 'var(--space-1)',
                  background: 'var(--color-crimson)',
                  color: '#fff',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  padding: '2px var(--space-2)',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  transition: 'background var(--transition-fast)',
                }}
                  onMouseOver={e => (e.currentTarget.style.background = 'var(--color-crimson-light)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'var(--color-crimson)')}
                  title={ev.title}
                >
                  {ev.title}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Lista de próximos eventos */}
      <div style={{ marginTop: 'var(--space-8)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
          Próximos eventos
        </h3>
        {events.filter(e => new Date(e.starts_at) >= today).slice(0, 5).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)' }}>No hay eventos próximos.</p>
        ) : (
          events.filter(e => new Date(e.starts_at) >= today).slice(0, 5).map(ev => (
            <div key={ev.id} onClick={() => setSelectedEvent(ev)} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-2)', cursor: 'pointer',
              transition: 'border-color var(--transition-fast)',
            }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ width: 4, height: 40, background: 'var(--color-crimson)', borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>{ev.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 2 }}>
                  <ClockIcon style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{formatDate(ev.starts_at)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                <span style={{ color: 'var(--color-success)' }}>✓ {rsvpCount(ev, 'yes')}</span>
                <span>? {rsvpCount(ev, 'maybe')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DETALLE EVENTO (panel lateral/modal) ── */}
      {selectedEvent && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg-overlay)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 'var(--space-4)',
        }} onClick={() => setSelectedEvent(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
            width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-lg)',
          }}>
            {/* Cabecera detalle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', margin: 0 }}>
                {selectedEvent.title}
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {canManage && (
                  <>
                    <button onClick={() => openEdit(selectedEvent)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 'var(--space-1)' }}>
                      <PencilIcon style={{ width: 16, height: 16 }} />
                    </button>
                    <button onClick={() => handleDelete(selectedEvent.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', padding: 'var(--space-1)' }}>
                      <TrashIcon style={{ width: 16, height: 16 }} />
                    </button>
                  </>
                )}
                <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 'var(--space-1)' }}>
                  <XMarkIcon style={{ width: 18, height: 18 }} />
                </button>
              </div>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <ClockIcon style={{ width: 14, height: 14, color: 'var(--color-crimson)', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                  {formatDate(selectedEvent.starts_at)}
                  {selectedEvent.ends_at && ` → ${formatDate(selectedEvent.ends_at)}`}
                </span>
              </div>
              {selectedEvent.profiles && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <UserIcon style={{ width: 14, height: 14, color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                    Creado por {selectedEvent.profiles.username}
                  </span>
                </div>
              )}
              {selectedEvent.topics && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <LinkIcon style={{ width: 14, height: 14, color: 'var(--text-muted)', flexShrink: 0 }} />
                  <a href={`/salas/${slug}/${selectedEvent.topics.id}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-crimson)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>
                    {selectedEvent.topics.title}
                  </a>
                </div>
              )}
              {selectedEvent.description && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', margin: 0, lineHeight: 1.6, borderLeft: '2px solid var(--border-medium)', paddingLeft: 'var(--space-3)' }}>
                  {selectedEvent.description}
                </p>
              )}
            </div>

            {/* RSVP */}
            {profile && (
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)' }}>
                  ¿Asistirás?
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {(['yes', 'maybe', 'no'] as const).map(status => {
                    const active = myRsvp(selectedEvent) === status
                    const icons = { yes: <CheckIcon style={{ width: 14, height: 14 }} />, maybe: <QuestionMarkCircleIcon style={{ width: 14, height: 14 }} />, no: <XMarkIcon style={{ width: 14, height: 14 }} /> }
                    const labels = { yes: `Sí (${rsvpCount(selectedEvent, 'yes')})`, maybe: `Quizás (${rsvpCount(selectedEvent, 'maybe')})`, no: `No (${rsvpCount(selectedEvent, 'no')})` }
                    const colors = { yes: 'var(--color-success)', maybe: 'var(--color-warning)', no: 'var(--color-error)' }
                    return (
                      <button key={status} onClick={() => handleRsvp(selectedEvent.id, status)} disabled={loading} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                        flex: 1, justifyContent: 'center',
                        padding: 'var(--space-2)',
                        border: `1px solid ${active ? colors[status] : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: active ? `${colors[status]}22` : 'transparent',
                        color: active ? colors[status] : 'var(--text-muted)',
                        fontSize: 'var(--text-xs)', fontFamily: 'var(--font-body)',
                        cursor: 'pointer', transition: 'all var(--transition-fast)',
                      }}>
                        {icons[status]} {labels[status]}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL CREAR/EDITAR ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg-overlay)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 'var(--space-4)',
        }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
            width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-lg)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', margin: '0 0 var(--space-5)' }}>
              {editingEvent ? 'Editar evento' : 'Nuevo evento'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Título */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Título *</span>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', outline: 'none' }}
                />
              </label>

              {/* Descripción */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Descripción</span>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', outline: 'none', resize: 'vertical' }}
                />
              </label>

              {/* Fechas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inicio *</span>
                  <input type="datetime-local" value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', outline: 'none' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fin</span>
                  <input type="datetime-local" value={form.ends_at} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value }))}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', outline: 'none' }}
                  />
                </label>
              </div>

              {/* Tema enlazado */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tema relacionado</span>
                <select value={form.topic_id} onChange={e => setForm(f => ({ ...f, topic_id: e.target.value }))}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', outline: 'none' }}
                >
                  <option value="">— Sin enlazar —</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </label>
            </div>

            {/* Acciones modal */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-4)',
                color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={handleSubmit} disabled={loading || !form.title || !form.starts_at} style={{
                background: 'var(--color-crimson)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2) var(--space-5)',
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Guardando...' : editingEvent ? 'Guardar cambios' : 'Crear evento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}