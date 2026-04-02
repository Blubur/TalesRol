'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export interface DiceRollResult {
  diceType: string
  faces: number
  quantity: number
  rolls: number[]
  total: number
  rolledBy: string
  rolledAt: string
}

export async function rollDice(diceTypeId: string, quantity: number): Promise<{ result?: DiceRollResult; error?: string }> {
  if (quantity < 1 || quantity > 20) return { error: 'Cantidad inválida (1-20).' }

  // Comprobar si los dados están habilitados globalmente
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: configRow } = await service
    .from('site_config')
    .select('value')
    .eq('key', 'dice_enabled')
    .single()

  if (configRow?.value === 'false') {
    return { error: 'Las tiradas de dado están desactivadas temporalmente.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  // Verificar que el dado existe
  const { data: diceType } = await supabase
    .from('dice_types')
    .select('id, name, faces')
    .eq('id', diceTypeId)
    .single()

  if (!diceType) return { error: 'Tipo de dado no encontrado.' }
  if (diceType.faces < 2 || diceType.faces > 1000) return { error: 'Dado inválido.' }

  // Tirada verificada en el servidor
  const rolls: number[] = []
  for (let i = 0; i < quantity; i++) {
    rolls.push(Math.floor(Math.random() * diceType.faces) + 1)
  }
  const total = rolls.reduce((a, b) => a + b, 0)

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', user.id)
    .single()

  return {
    result: {
      diceType: diceType.name,
      faces:    diceType.faces,
      quantity,
      rolls,
      total,
      rolledBy: profile?.display_name ?? profile?.username ?? 'Anónimo',
      rolledAt: new Date().toISOString(),
    }
  }
}