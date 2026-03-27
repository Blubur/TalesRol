import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminCssEditor from '../AdminCssEditor'
import { getCustomCss, getCssVersions } from '../cssactions'

export const metadata = { title: 'CSS personalizado' }

export default async function AdminCssPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const [currentCss, cssVersions] = await Promise.all([
    getCustomCss(),
    getCssVersions(),
  ])

  return (
    <div className="admin-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <a href="/admin" style={{ fontSize: '0.9rem', opacity: 0.7 }}>← Volver al panel</a>
      </div>
      <AdminCssEditor initialCss={currentCss} versions={cssVersions} />
    </div>
  )
}