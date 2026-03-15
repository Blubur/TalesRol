import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import TemplateEditorClient from './TemplateEditorClient'
import { ArrowLeftIcon, RectangleGroupIcon } from '@heroicons/react/24/outline'
import { getOrCreateTemplate } from '../sheetactions'

export default async function PlantillaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: roomData } = await supabase
    .from('rooms').select('id, title, owner_id').eq('slug', slug).is('deleted_at', null).single()
  if (!roomData) notFound()

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isOwner = user.id === roomData.owner_id
  const isAdmin = profile?.role === 'admin'
  if (!isOwner && !isAdmin) redirect(`/salas/${slug}/fichas`)

  await getOrCreateTemplate(roomData.id)

  const { data: template } = await supabase
    .from('room_sheet_templates').select('id').eq('room_id', roomData.id).single()
  if (!template) notFound()

  const { data: fields } = await supabase
    .from('room_sheet_fields')
    .select('*')
    .eq('template_id', template.id)
    .order('position', { ascending: true })

  return (
    <div className="plantilla-page">
      <div className="plantilla-header animate-enter">
        <div className="plantilla-header-left">
          <RectangleGroupIcon className="plantilla-header-icon" />
          <div>
            <h1 className="plantilla-title">Editar Plantilla</h1>
            <p className="plantilla-sub">{roomData.title}</p>
          </div>
        </div>
        <Link href={`/salas/${slug}/fichas`} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Volver a fichas
        </Link>
      </div>

      <TemplateEditorClient
        templateId={template.id}
        fields={fields ?? []}
        slug={slug}
      />

      <style>{`
        .plantilla-page { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6); }
        .plantilla-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4); padding-bottom: var(--space-5); border-bottom: 1px solid var(--border-subtle); position: relative; }
        .plantilla-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: var(--color-crimson); }
        .plantilla-header-left { display: flex; align-items: center; gap: var(--space-4); }
        .plantilla-header-icon { width: 28px; height: 28px; color: var(--color-crimson); }
        .plantilla-title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; letter-spacing: 0.08em; margin: 0; }
        .plantilla-sub { color: var(--text-muted); font-size: var(--text-sm); margin: var(--space-1) 0 0; }
      `}</style>
    </div>
  )
}