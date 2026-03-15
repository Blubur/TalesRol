import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Profile } from '@/types/database'
import EditProfileForm from './EditProfileForm'

export const metadata = { title: 'Editar perfil — TalesRol' }

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profileData) redirect('/auth/login')
  const profile = profileData as Profile

  return <EditProfileForm profile={profile} />
}