import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import SheetEditorClient from './SheetEditorClient'
import { ArrowLeftIcon, IdentificationIcon } from '@heroicons/react/24/outline'
import { getSheet } from '../sheetactions'

export default async function UserSheetPage({
  params,
}: {
  params: Promise<{ slug: string; username: string }>
}) {
  const { slug, username } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: roomData } = await supabase
    .from('rooms').select('id, title, owner_id').eq('slug', slug).is('deleted_at', null).single()
  if (!roomData) notFound()

  // Perfil del usuario cuya ficha se ve
  const { data: targetProfile } = await supabase
    .from('profiles').select('id, username, display_name, avatar_url').eq('username', username).single()
  if (!targetProfile) notFound()

  const { data: currentProfile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  const isOwner   = user.id === roomData.owner_id
  const isAdmin   = currentProfile?.role === 'admin'
  const isSelf    = user.id === targetProfile.id
  const canEdit   = isSelf || isOwner || isAdmin
  if (!canEdit) redirect(`/salas/${slug}/fichas`)

  // Plantilla
  const { data: template } = await supabase
    .from('room_sheet_templates').select('id').eq('room_id', roomData.id).single()

  const fields = template
    ? (await supabase
        .from('room_sheet_fields')
        .select('*')
        .eq('template_id', template.id)
        .order('position', { ascending: true })
      ).data ?? []
    : []

  // Ficha y valores existentes
  const { sheet, values } = await getSheet(roomData.id, targetProfile.id)

  const valueMap: Record<string, any> = {}
  values.forEach((v: any) => { valueMap[v.field_id] = v })

  return (
    <div className="sheet-page">
      <div className="sheet-header animate-enter">
        <div className="sheet-header-left">
          <IdentificationIcon className="sheet-header-icon" />
          <div>
            <h1 className="sheet-title">
              {isSelf ? 'Mi Ficha' : `Ficha de ${targetProfile.display_name || targetProfile.username}`}
            </h1>
            <p className="sheet-sub">{roomData.title}</p>
          </div>
        </div>
        <Link href={`/salas/${slug}/fichas`} className="btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Volver a fichas
        </Link>
      </div>

      <SheetEditorClient
        roomId={roomData.id}
        targetUserId={targetProfile.id}
        slug={slug}
        fields={fields}
        valueMap={valueMap}
        canEdit={canEdit}
        isSelf={isSelf}
      />

      <style>{`
        .sheet-page { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6); }
        .sheet-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4); padding-bottom: var(--space-5); border-bottom: 1px solid var(--border-subtle); position: relative; }
        .sheet-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: var(--color-crimson); }
        .sheet-header-left { display: flex; align-items: center; gap: var(--space-4); }
        .sheet-header-icon { width: 28px; height: 28px; color: var(--color-crimson); }
        .sheet-title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; letter-spacing: 0.08em; margin: 0; }
        .sheet-sub { color: var(--text-muted); font-size: var(--text-sm); margin: var(--space-1) 0 0; }
      `}</style>
    </div>
  )
}