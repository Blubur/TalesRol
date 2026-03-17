import { SupabaseClient } from '@supabase/supabase-js'

export async function logModerationAction(
  admin: SupabaseClient,
  adminId: string,
  action: string,
  targetType: 'user' | 'room' | 'post' | 'ip' | 'system',
  targetId?: string,
  targetLabel?: string,
  notes?: string,
) {
  await admin.from('moderation_logs').insert({
    admin_id:     adminId,
    action,
    target_type:  targetType,
    target_id:    targetId ?? null,
    target_label: targetLabel ?? null,
    notes:        notes ?? null,
  })
}