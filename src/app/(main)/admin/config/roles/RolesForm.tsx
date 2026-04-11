'use client'

import { useState } from 'react'
import { saveRolePermissions } from './rolesactions'

const ROLES = ['master', 'director', 'jugador', 'miembro']

const ROLE_LABELS: Record<string, string> = {
  master:   'Master',
  director: 'Director',
  jugador:  'Jugador',
  miembro:  'Miembro',
}

const PERMISSIONS = [
  { key: 'perm_create_rooms',   label: 'Crear salas',                group: 'Salas' },
  { key: 'perm_edit_rooms',     label: 'Editar salas de otros',       group: 'Salas' },
  { key: 'perm_manage_members', label: 'Gestionar miembros de sala',  group: 'Salas' },
  { key: 'perm_create_topics',  label: 'Crear temas',                 group: 'Contenido' },
  { key: 'perm_use_dice',       label: 'Usar dados',                  group: 'Contenido' },
  { key: 'perm_messages',       label: 'Enviar mensajes privados',    group: 'Comunicación' },
  { key: 'perm_moderate',       label: 'Moderar posts (bloquear)',    group: 'Moderación' },
  { key: 'perm_reports',        label: 'Resolver reportes',           group: 'Moderación' },
  { key: 'perm_announcements',  label: 'Crear anuncios globales',     group: 'Moderación' },
  { key: 'perm_ban_users',      label: 'Banear usuarios',             group: 'Moderación' },
  { key: 'perm_admin_panel',    label: 'Acceder al panel de admin',   group: 'Administración' },
]

const GROUPS = ['Salas', 'Contenido', 'Comunicación', 'Moderación', 'Administración']

type Props = { initialPermissions: Record<string, string[]> }

export default function RolesForm({ initialPermissions }: Props) {
  const [perms, setPerms] = useState<Record<string, string[]>>(initialPermissions)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  function toggle(permKey: string, role: string) {
    // admin siempre tiene todos — no se puede quitar
    if (role === 'admin') return
    setPerms(prev => {
      const current = prev[permKey] ?? []
      const next = current.includes(role)
        ? current.filter(r => r !== role)
        : [...current, role]
      return { ...prev, [permKey]: next }
    })
  }

  async function handleSave() {
    setSaving(true); setMsg(null)
    const res = await saveRolePermissions(perms)
    setSaving(false)
    setMsg(res?.error
      ? { ok: false, text: res.error }
      : { ok: true, text: '✓ Permisos guardados.' }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Leyenda */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '0.75rem 1.25rem',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
      }}>
        ℹ️ El rol <strong>Admin</strong> siempre tiene todos los permisos y no puede modificarse.
        Los cambios se aplican en la próxima acción del usuario.
      </div>

      {GROUPS.map(group => {
        const groupPerms = PERMISSIONS.filter(p => p.group === group)
        return (
          <div key={group} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            {/* Cabecera del grupo */}
            <div style={{
              padding: '0.6rem 1.25rem',
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-cinzel)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-crimson)',
            }}>
              {group}
            </div>

            {/* Tabla */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.6rem 1.25rem', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--border-subtle)', width: '40%' }}>
                    Permiso
                  </th>
                  {/* Admin — columna fija */}
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--border-subtle)' }}>
                    Admin
                  </th>
                  {ROLES.map(role => (
                    <th key={role} style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, borderBottom: '1px solid var(--border-subtle)' }}>
                      {ROLE_LABELS[role]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupPerms.map((perm, idx) => (
                  <tr key={perm.key} style={{ borderBottom: idx < groupPerms.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <td style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {perm.label}
                    </td>
                    {/* Admin siempre activo */}
                    <td style={{ textAlign: 'center', padding: '0.65rem 0.75rem' }}>
                      <span style={{ fontSize: '1rem', opacity: 0.5 }} title="Admin siempre tiene este permiso">✓</span>
                    </td>
                    {ROLES.map(role => {
                      const active = (perms[perm.key] ?? []).includes(role)
                      return (
                        <td key={role} style={{ textAlign: 'center', padding: '0.65rem 0.75rem' }}>
                          <button
                            onClick={() => toggle(perm.key, role)}
                            style={{
                              width: '36px',
                              height: '20px',
                              borderRadius: '10px',
                              border: 'none',
                              cursor: 'pointer',
                              background: active ? 'var(--color-crimson, #e63946)' : 'var(--border-medium, #555)',
                              position: 'relative',
                              transition: 'background 0.2s',
                              flexShrink: 0,
                            }}
                            title={active ? `Quitar permiso a ${ROLE_LABELS[role]}` : `Dar permiso a ${ROLE_LABELS[role]}`}
                          >
                            <span style={{
                              position: 'absolute',
                              top: '2px',
                              left: active ? '18px' : '2px',
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              background: '#fff',
                              transition: 'left 0.2s',
                            }} />
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}

      {msg && (
        <p style={{ color: msg.ok ? 'var(--color-success, green)' : '#ff6b6b', fontSize: '0.85rem' }}>
          {msg.text}
        </p>
      )}

      <div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
          {saving ? 'Guardando…' : 'Guardar permisos'}
        </button>
      </div>
    </div>
  )
}