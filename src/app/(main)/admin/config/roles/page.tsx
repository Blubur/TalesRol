import { getRolePermissions } from './rolesactions'
import RolesForm from './RolesForm'

export const metadata = { title: 'Roles y permisos' }

export default async function RolesPage() {
  const permissions = await getRolePermissions()

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Roles y permisos
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Configura qué puede hacer cada rol en la plataforma.
        </p>
      </div>
      <RolesForm initialPermissions={permissions} />
    </div>
  )
}