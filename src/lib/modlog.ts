import { createClient } from '@supabase/supabase-js'

export async function logModerationAction(
  _client: unknown,
  adminId: string,
  action: string,
  targetType: 'user' | 'room' | 'post' | 'ip' | 'system',
  targetId?: string,
  targetLabel?: string,
  notes?: string,
) {
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await serviceClient.from('moderation_logs').insert({
    admin_id:     adminId,
    action,
    target_type:  targetType,
    target_id:    targetId ?? null,
    target_label: targetLabel ?? null,
    notes:        notes ?? null,
  })

  if (error) console.error('[modlog] Error al registrar acción:', error.message)
}