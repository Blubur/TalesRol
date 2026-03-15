'use server'

import { createClient } from '@/lib/supabase/server'

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

