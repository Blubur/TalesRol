// src/app/api/users/search/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q     = searchParams.get('q')?.trim() ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '6'), 10)

  if (q.length < 1) return NextResponse.json([])

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url')
    .ilike('username', `${q}%`)
    .eq('status', 'active')
    .order('username', { ascending: true })
    .limit(limit)

  if (error) return NextResponse.json([], { status: 500 })

  return NextResponse.json(data ?? [])
}